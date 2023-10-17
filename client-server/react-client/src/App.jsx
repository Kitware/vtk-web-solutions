import { useState } from 'react';
import VtkRemoteView from './VtkRemoteView.jsx';

function App({ wsClient, viewId }) {
  const [resolution, setResolution] = useState(6);

  function updateResolution(event) {
    const value = Number(event.target.value);
    setResolution(value);
    wsClient.getRemote().Trame.updateState([
        { key: "resolution", value }
    ]);
  }

  return (
    <>
        <input 
          type="range"
          min="3" 
          max="60" 
          value={resolution} 
          onChange={updateResolution} 
          style={{ position: 'absolute', top: '20px', 'right': '20px', zIndex: 1 }}
        />
        <VtkRemoteView 
          wsClient={wsClient}
          viewId={viewId}
        />
    </>
  )
}

export default App
