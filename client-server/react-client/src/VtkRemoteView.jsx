import { useRef } from 'react';

import vtkRemoteView from "@kitware/vtk.js/Rendering/Misc/RemoteView";
import vtkInteractorStyleManipulator from "@kitware/vtk.js/Interaction/Style/InteractorStyleManipulator";

function VtkRemoteView({ wsClient, viewId }) {
    const containerRef = useRef(null);
  const viewStream = wsClient.getImageStream().createViewStream(viewId);
  const view = vtkRemoteView.newInstance({
    rpcWheelEvent: "viewport.mouse.zoom.wheel",
    viewStream,
  });

  function resize() {
    const canvas = view.getCanvasView();
    const [w, h] = canvas.getSize();
    canvas.setSize(w + 2, h + 2); // make sure we force a resize
    nextTick(view.resize);
  }

  return (
    <>
      <div style="position:relative;width:100%;height:100%;z-index:0;">
        <div
          ref="vtkContainer"
          style="position:absolute;width:100%;height:100%;overflow:hidden;"
        />
        <slot style="display: none;"></slot>
      </div>
    </>
  );
}

export default App;
