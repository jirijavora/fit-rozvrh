import './styles/App.scss';

import { Header } from './components/Header';
import { TimetableWrapper } from './components/TimetableWrapper';

export const APP_PADDING_X = 20;

export const TIMETABLE_START_HOUR = 7;
export const TIMETABLE_END_HOUR = 20;

export const TIMETABLE_PIN_START_HOUR = 7.1;
export const TIMETABLE_PIN_END_HOUR = 20.7;

export const SEMESTER_START_DATE = Date.parse(
  import.meta.env.VITE_SEMESTER_START_DATE,
);

function App() {
  return (
    <div className="App bg-dark mx-3 py-3 text-light text-center">
      <Header />
      <TimetableWrapper />
    </div>
  );
}

export default App;
