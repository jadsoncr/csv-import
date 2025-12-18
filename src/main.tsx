import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import './styles/animations.css';

/**
 * Ponto de entrada da aplicação BRO.AI
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

