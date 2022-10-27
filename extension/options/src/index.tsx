import React from 'react';
import { createRoot } from 'react-dom/client';
import Options from './Options';
import './style/index.scss';

createRoot(document.getElementById('options-page-root')!).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
);
