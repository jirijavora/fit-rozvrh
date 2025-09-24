import '../styles/Lessons.scss';

import { getDay } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

import useVictim from '../hooks/useVictim';
import { LessonInfo, PersonInfo } from '../services/DataService';
import { calculateLessonCollisions } from '../utils/collisions';
import { Lesson } from './Lesson';
import { TimeIndicator } from './TimeIndicator';

export type ContextualizedLesson = LessonInfo & {
  prevEndTime?: string;
  /** Array of people who share the same lesson */
  intersections?: PersonInfo[];
};

type Props = {
  lessons: ContextualizedLesson[];
  dayIndex: number;
};

const getDayName = (index: number) => {
  const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  return names[index];
};

export const Lessons = ({ lessons, dayIndex }: Props) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { activeVictim } = useVictim();

  const lessonsWithCollisions = useMemo(
    () => calculateLessonCollisions(lessons),
    [lessons, activeVictim],
  );

  useEffect(() => {
    const dateRefreshInterval = setInterval(
      () => {
        setCurrentDate(new Date());
      },
      1000 * 60 * 60, // 1000ms * 60 (for seconds) * 60 (for minutes) = 1 hour
    );

    return () => clearInterval(dateRefreshInterval);
  }, []);

  return (
    <>
      <div
        className="lessons py-2 text-dark d-flex flex-row"
        style={{ zIndex: dayIndex }}
      >
        <h5 className="day-text text-light h-index my-auto">
          {getDayName(dayIndex)}
        </h5>
        {dayIndex + 1 === getDay(currentDate) && <TimeIndicator />}
        {lessonsWithCollisions.map((lessonWithCollisions, i) => {
          return <Lesson key={i} dataWithCollisions={lessonWithCollisions} />;
        })}
      </div>
    </>
  );
};
