import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'


import wslink from "./wslink";

const wsClient = wslink.createClient();
wsClient.connect().then(() => {
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App wsClient={wsClient} />
      </React.StrictMode>,
    )
});
