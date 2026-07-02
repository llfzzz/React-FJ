import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque/index.css';
import '@fontsource-variable/hanken-grotesk/index.css';
import '@fontsource-variable/jetbrains-mono/index.css';
import '@fj/styles.css';
import './styles/site.css';
import { App } from './app/App';
import { ErrorBoundary } from './app/ErrorBoundary';
import logoMark from '@fj/assets/logo-mark.svg';

const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/svg+xml';
favicon.href = logoMark;
document.head.appendChild(favicon);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
