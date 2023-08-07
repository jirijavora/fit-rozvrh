import { parse } from 'date-fns';

import { LessonInfo } from '../services/DataService';

const timeFormat = 'HH:mm';

export function intervalFromLesson(lesson: LessonInfo) {
  return {
    start: parse(lesson.startTime, timeFormat, 0),
    end: parse(lesson.endTime, timeFormat, 0),
  };
}
