import {
  CIS505_tut,
  CIS525_tut,
  CIS580_tut,
  ECE431_lab,
  ECE431_lec,
  ECON120_lec,
  GYM_lec,
  GYM_optional_lec,
} from './data/lectureInfo';

export type LessonInfo = {
  title: string;
  type: 'tut' | 'lab' | 'lec';
  room: string;
  note?: string;
  startTime: string;
  endTime: string;
};

export type Timetable = [
  LessonInfo[],
  LessonInfo[],
  LessonInfo[],
  LessonInfo[],
  LessonInfo[],
];

export type PersonInfo = {
  id: string;
  name: string;
};

export type PersonData = {
  timetable: Timetable;
} & PersonInfo;

export const fetchTimetables = async () => {
  const people: PersonData[] = [
    {
      timetable: [
        [
          ECE431_lab,
          GYM_lec('10:00', '11:00'),
          CIS505_tut,
          CIS525_tut,
          CIS580_tut,
        ],
        [ECON120_lec],
        [
          ECE431_lab,
          GYM_lec('10:00', '11:00'),
          CIS505_tut,
          CIS525_tut,
          CIS580_tut,
        ],
        [ECON120_lec, ECE431_lec],
        [
          GYM_optional_lec('10:00', '11:00'),
          CIS505_tut,
          CIS525_tut,
          CIS580_tut,
        ],
      ],
      id: '1',
      name: 'Jiří Javora',
    },
  ];

  return people;
};
