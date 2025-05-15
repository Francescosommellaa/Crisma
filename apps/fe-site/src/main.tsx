import React from 'react';
import ReactDOM from 'react-dom/client';  // Usa 'react-dom/client' invece di 'react-dom'
import App from './App';
import { Analytics } from "@vercel/analytics/next"

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Analytics />
    <App />
  </React.StrictMode>
);
