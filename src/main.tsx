import './styles/main.scss';

import { GrainProvider } from '@flodesk/grain';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from './app';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GrainProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GrainProvider>
  </StrictMode>,
);
