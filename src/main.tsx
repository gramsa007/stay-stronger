import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // Hier wird die CSS geladen

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// --- HIERHIN GEHÖRT DEIN CODE (GANZ UNTEN) ---
// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('Service Worker registered', reg))
      .catch((err) => console.log('Service Worker failed', err));
  });
}