import { createClient } from '@vercel/kv';

const kv = createClient({
  url: import.meta.env.VITE_KV_REST_API_URL,
  token: import.meta.env.VITE_KV_REST_READ_ONLY_API_TOKEN,
  enableTelemetry: false,
});

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
  const data = await kv.json.get('data');
  return data as PersonData[];
};
