import { LessonInfo, PersonData, PersonInfo } from '../services/DataService';

const isInvalidNote = (note: string | undefined) => {
  return note !== 'odd' && note !== 'even';
};

/**
 * LessonInteractions["dayNumber-BI-PA2-lec-T9:350-..."] = array of people who share this lesson.
 * Hashmap go brrr... Jebu nějaký fancy, top speed, A* lookup překryvů.
 */
export type LessonIntersections = {
  [key: string]: PersonInfo[];
};

/**
 * Normalize time strings to make leading zeros irrelevant,
 * i.e. treat for example 9:5 and 09:05 as the same time.
 */
const normalizeTime = (time: string): string =>
  time
    .split(':')
    .map((x) => x.trim().padStart(2, '0'))
    .join(':');

/**
 * Get an identification key for a given lesson.
 */
export const getLessonKey = (lesson: LessonInfo, day: number) => {
  const start = normalizeTime(lesson.startTime);
  const end = normalizeTime(lesson.endTime);

  const key = `${day}-${lesson.title}-${lesson.type}-${start}-${end}`;

  if (isInvalidNote(lesson.note)) {
    return key;
  }

  return `${key}-${lesson.note}`;
};

/**
 * Since we've only got a few people, we can afford to "precalculate" all the
 * intersections once.
 * @param people
 */
export const getLessonIntersectionsMap = (
  people: PersonData[],
): LessonIntersections => {
  const intersections: LessonIntersections = {};

  for (const person of people) {
    person.timetable.forEach((day, dayIndex) => {
      for (const lesson of day) {
        const key = getLessonKey(lesson, dayIndex);
        if (!intersections[key]) {
          intersections[key] = [];
        }

        intersections[key].push({
          id: person.id,
          name: person.name,
        });
      }
    });
  }

  return intersections;
};
