import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GrainProvider } from '@flodesk/grain';
import { App } from './app';
import './styles/main.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GrainProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GrainProvider>
  </StrictMode>,
);
