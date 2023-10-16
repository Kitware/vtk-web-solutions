import { useState } from 'react'

function App({ wsClient }) {
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
        <input type="range" min="3" max="60" value={resolution} onChange={updateResolution} />
        <h4>{resolution}</h4>
    </>
  )
}

export default App
