import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'


import wslink from "./wslink";

const wsClient = wslink.createClient();
wsClient.connect().then(
  () => wsClient.getRemote().Trame.getState().then((s) => s.state.viewId)
).then((viewId) => {
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App wsClient={wsClient} viewId={viewId} />
      </React.StrictMode>,
    )
});
