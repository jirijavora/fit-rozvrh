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

export const fetchTimetables = async (token: string) => {
  const data = await fetch('/api/data', {
    headers: { discordToken: `Bearer ${token}` },
  });
  return (await data.json()) as PersonData[];
};
