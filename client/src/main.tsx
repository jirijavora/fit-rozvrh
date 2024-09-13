import './styles/index.scss';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';

import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { VictimProvider } from './contexts/VictimContext';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <VictimProvider>
      <App />
    </VictimProvider>
  </React.StrictMode>,
);
