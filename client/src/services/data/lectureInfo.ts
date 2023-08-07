import { LessonInfo } from '../DataService';

export const GYM_lec: (startTime: string, endTime: string) => LessonInfo = (
  startTime,
  endTime,
) => ({
  title: 'Gym',
  type: 'lec',
  room: 'TBD',
  note: 'rec',
  startTime,
  endTime,
});

export const GYM_optional_lec: (
  startTime: string,
  endTime: string,
) => LessonInfo = (startTime, endTime) => ({
  title: 'Gym',
  type: 'lec',
  room: 'TBD',
  note: '(optional)',
  startTime,
  endTime,
});

export const ECON120_lec: LessonInfo = {
  title: 'ECON120',
  type: 'lec',
  room: 'Waters 231',
  startTime: '13:05',
  endTime: '14:20',
};

export const ECE431_lab: LessonInfo = {
  title: 'ECE431',
  type: 'lab',
  room: 'Durland 0093',
  startTime: '8:30',
  endTime: '9:20',
};

export const ECE431_lec: LessonInfo = {
  title: 'ECE431',
  type: 'lec',
  room: 'Durland 2189',
  startTime: '14:30',
  endTime: '17:20',
};

export const CIS505_tut: LessonInfo = {
  title: 'CIS505',
  type: 'tut',
  room: 'Durland 1109',
  startTime: '11:30',
  endTime: '12:20',
};

export const CIS525_tut: LessonInfo = {
  title: 'CIS525',
  type: 'tut',
  room: 'Durland 1116',
  startTime: '13:30',
  endTime: '14:20',
};

export const CIS580_tut: LessonInfo = {
  title: 'CIS580',
  type: 'tut',
  room: 'Durland 1116',
  startTime: '15:30',
  endTime: '16:20',
};
