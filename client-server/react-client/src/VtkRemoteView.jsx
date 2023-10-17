import { useRef, useEffect } from "react";

import vtkRemoteView from "@kitware/vtk.js/Rendering/Misc/RemoteView";

function VtkRemoteView({ wsClient, viewId }) {
  const containerRef = useRef(null);
  
  useEffect(async () => {
    // created
    let resizeObserver = null;
    const viewStream = wsClient.getImageStream().createViewStream(viewId);
    const view = vtkRemoteView.newInstance({
      rpcWheelEvent: "viewport.mouse.zoom.wheel",
      viewStream,
    });

    // mount
    const container = containerRef.current;
    view.getCanvasView().setUseBackgroundImage(0);
    view.setContainer(container);

    const session = wsClient.getConnection().getSession();
    view.setSession(session);
    view.setViewId(viewId);

    // Update server quality/ratio/size
    const { width, height } = container.getBoundingClientRect(); // only valid now...
    const minSize = width < 10 || height < 10 ? 10 : 0; // prevent crash from hidden view
    view
      .getCanvasView()
      .setSize(Math.round(width + minSize), Math.round(height + minSize));

    await new Promise((resolve) => {
      const subscription = viewStream.onImageReady(({ image, metadata }) => {
        const [w, h] = metadata.size;
        if (w !== image.width || h !== image.height) {
          viewStream.render();
          return;
        }
        const sw = viewStream.getStillRatio() * Math.round(minSize + width);
        const sh = viewStream.getStillRatio() * Math.round(minSize + height);
        if (w === sw && h === sh) {
          subscription.unsubscribe();
          view.getCanvasView().setBackgroundImage(image);
          resolve();
        } else {
          viewStream.render();
        }
      });
      viewStream.endInteraction();
    });

    view.getCanvasView().setUseBackgroundImage(1);

    // Resize handling
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(view.resize);
      resizeObserver.observe(container);
    } else {
      // Old browser sucks...
      window.addEventListener("resize", view.resize);
    }

    // unmount
    return () => {
      console.log("VtkRemoteView::unmount");
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      } else {
        window.removeEventListener("resize", view.resize);
      }
      view.delete();
    };
  }, []);

  return (
    <>
      <div style={{ position:'relative', width:'100%', height:'100%', zIndex:0 }}>
        <div
          ref={containerRef}
          style={{ position:'absolute', width: '100%', height: '100%', overflow: 'hidden' }}
        />
        <slot style={{ display: "none" }}></slot>
      </div>
    </>
  );
}

export default VtkRemoteView;
