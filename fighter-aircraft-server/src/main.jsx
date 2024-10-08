import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { WebSocketProvider } from './context/WebSocketProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WebSocketProvider>
        <App />
    </WebSocketProvider>
  </React.StrictMode>,
)
