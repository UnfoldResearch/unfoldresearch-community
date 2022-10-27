import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './Popup';
import './index.scss';

createRoot(document.getElementById('popup-page-root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
