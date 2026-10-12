import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './global.css';
import { App } from './App';

if (import.meta.env.DEV) {
  // Dev-only: serves StyleX CSS + HMR runtime from the unplugin.
  await import('virtual:stylex:runtime' as string);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
