import { ContextualizedLesson } from '../components/Lessons';
import { intervalFromLesson } from './TimeUtil';

type CompareKeyFunction<T> = (x: T) => number;
type CompareFunction<T> = (a: T, b: T) => number;
const chainComparisons =
  <T>(...funcs: CompareFunction<T>[]): CompareFunction<T> =>
  (a, b) => {
    for (const f of funcs) {
      const res = f(a, b);
      if (res !== 0) return res;
    }

    return 0;
  };

const keyCompare =
  <T>(key: CompareKeyFunction<T>): CompareFunction<T> =>
  (a, b) =>
    key(a) - key(b);

const compareLessonNames = (
  a: ContextualizedLesson,
  b: ContextualizedLesson,
): number => a.title.toLowerCase().localeCompare(b.title.toLowerCase());

enum LessonCollisionTimeType {
  START = 0,
  END = 1,
}

type LessonCollisionTime = {
  time: Date;
  lessonIdx: number;
  type: LessonCollisionTimeType;
};

const toSortedTimes = (
  lessons: ContextualizedLesson[],
): LessonCollisionTime[] =>
  lessons
    .map(intervalFromLesson)
    .flatMap((interval, lessonIdx) => [
      { time: interval.start, lessonIdx, type: LessonCollisionTimeType.START },
      { time: interval.end, lessonIdx, type: LessonCollisionTimeType.END },
    ])
    .toSorted(
      chainComparisons(
        keyCompare(({ time }) => time.getTime()),
        keyCompare(({ type }) =>
          // Order start times after end times. This makes lessons which just meet at their end
          // times still count as not colliding and allows them to break collision blocks.
          // It's up to discussion and testing whether we want this or not, but in the end it
          // shouldn't matter too much as most of our blocks still have 15 minute gaps inbetween
          type === LessonCollisionTimeType.START ? 1 : 0,
        ),
        (a, b) =>
          compareLessonNames(lessons[a.lessonIdx], lessons[b.lessonIdx]),
      ),
    );

export type ContextualizedCollidedLesson = ContextualizedLesson & {
  level: number;
  levelCount: number;
};

/**
 * Calculate the collisions between lessons in a day.
 *
 * Essentially this whole task boils down to an [interval graph](https://en.wikipedia.org/wiki/Interval_graph)
 * colouring problem. We create an array of start and end times of all lessons, sort it in ascending
 * order. We iterate these times in order, greedily assigning each lesson the first from a queue of
 * levels. If we run out of levels, we add a new one. Importantly, we return each lesson's level
 * back to the queue on its end time.
 *
 * The algorithm here has a modification which waits for points where there are no running intervals
 * and resets the queue and level counts at these points. This allows lessons to only shrink when
 * they actually belong to a conflicting block.
 *
 * @param lessons the set of lessons to calculate collisions among
 * @returns [lessons] with collision information
 */
export const calculateLessonCollisions = (
  lessons: ContextualizedLesson[],
): ContextualizedCollidedLesson[] => {
  const levels: Record<number, number> = {};
  const levelCounts: Record<number, number> = {};

  let currBlock: number[] = [];
  let nextLevel = 1;
  let availableLevels: number[] = [];

  const times = toSortedTimes(lessons);
  for (const time of times) {
    if (time.type === LessonCollisionTimeType.START) {
      const level = availableLevels.shift() ?? nextLevel++;

      levels[time.lessonIdx] = level;
      currBlock.push(time.lessonIdx);
    } else {
      availableLevels.push(levels[time.lessonIdx]);
      if (availableLevels.length === nextLevel - 1) {
        // No intervals open, ie we have reached a time with no overlapping lessons. We can reset
        // level counts here so the next blocks can again be as large as they need
        for (const lesson of currBlock) levelCounts[lesson] = nextLevel - 1;
        currBlock = [];
        availableLevels = [];
        nextLevel = 1;
      }
    }
  }

  return lessons.map((lesson, lessonIdx) => ({
    ...lesson,
    level: levels[lessonIdx],
    levelCount: levelCounts[lessonIdx],
  }));
};
