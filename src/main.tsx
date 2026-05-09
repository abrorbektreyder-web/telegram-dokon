import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import WebApp from '@twa-dev/sdk'

// Safe initialization for Telegram WebApp
try {
  if (WebApp) {
    if (typeof WebApp.ready === 'function') WebApp.ready();
    if (typeof WebApp.expand === 'function') WebApp.expand();
  }
} catch (e) {
  console.error("Telegram SDK Error:", e);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
