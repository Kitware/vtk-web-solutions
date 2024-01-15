import { useState } from 'react';
import VtkRemoteView from './VtkRemoteView.jsx';

function App({ wsClient, viewId }) {
  const [resolution, setResolution] = useState(6);

  wsClient.getRemote().Trame.subscribeToStateUpdate(([newState]) => {
    if ("resolution" in newState) {
      setResolution(newState.resolution);
    }
  });
  wsClient.getRemote().Trame.subscribeToActions(([actions]) => {
    for (let i = 0; i < actions.length; i++) {
      const { ref, method, args } = actions[i];
      console.log(`Call method "${method}" on ref="${ref}" with args=[${args}]`);
    }
  });
  

  function updateResolution(event) {
    const value = Number(event.target.value);
    setResolution(value);
    wsClient.getRemote().Trame.updateState([
        { key: "resolution", value }
    ]);
  }

  function trigger(name, args=[], kwargs={}) {
    return wsClient.getRemote().Trame.trigger(name, args, kwargs);
  }

  return (
    <>
        <div style={{ position: 'absolute', top: '20px', 'right': '20px', zIndex: 1 }}>
          <input 
            type="range"
            min="3" 
            max="60" 
            value={resolution} 
            onChange={updateResolution} 
          />
          <button onClick={() => trigger("reset_camera")}>Reset Camera</button>
          <button onClick={() => trigger("start_animation")}>Start animation</button>
        </div>

        <VtkRemoteView 
          wsClient={wsClient}
          viewId={viewId}
        />
    </>
  )
}

export default App
