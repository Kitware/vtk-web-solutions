import concurrent.futures
import time
import asyncio

from vtkmodules.vtkRenderingCore import (
    vtkRenderWindow,
    vtkRenderer,
    vtkRenderWindowInteractor,
    vtkPolyDataMapper,
    vtkActor,
)
from vtkmodules.vtkFiltersSources import vtkConeSource
from vtkmodules.vtkInteractionStyle import vtkInteractorStyleSwitch  # noqa
import vtkmodules.vtkRenderingOpenGL2  # noqa

from trame.app import get_server
from trame.widgets import vtk
from trame.decorators import TrameApp, change, trigger


def threaded_execution(thread_safe_update_resolution):
    LOOP_SIZE = 50
    BASE_RESOLUTION = 6
    for i in range(LOOP_SIZE):
        time.sleep(0.1)
        thread_safe_update_resolution(BASE_RESOLUTION + i)
    for i in range(LOOP_SIZE):
        time.sleep(0.1)
        thread_safe_update_resolution(BASE_RESOLUTION + LOOP_SIZE - i)


@TrameApp()
class WebApp:
    def __init__(self):
        # client type does not matter since we are just using the server
        self.server = get_server()
        self.current_event_loop = asyncio.get_event_loop()

        # Thread pool
        self.pool = concurrent.futures.ThreadPoolExecutor(max_workers=1)

        # Put some default value in state
        self.server.state.resolution = 60

        # Custom VTK code
        self.setup_vtk()

        # Create server side for remote view
        self.client_view = vtk.VtkRemoteView(
            self.render_window, trame_server=self.server, ref="view"
        )

    def setup_vtk(self):
        renderer = vtkRenderer()
        render_window = vtkRenderWindow()
        render_window.AddRenderer(renderer)
        render_window.OffScreenRenderingOn()

        render_window_interactor = vtkRenderWindowInteractor()
        render_window_interactor.SetRenderWindow(render_window)
        render_window_interactor.GetInteractorStyle().SetCurrentStyleToTrackballCamera()

        cone_source = vtkConeSource()
        mapper = vtkPolyDataMapper()
        actor = vtkActor()
        mapper.SetInputConnection(cone_source.GetOutputPort())
        actor.SetMapper(mapper)
        renderer.AddActor(actor)
        renderer.ResetCamera()
        render_window.Render()

        self.cone_source = cone_source
        self.renderer = renderer
        self.render_window = render_window

    @change("resolution")
    def on_resolution_change(self, resolution, **kwargs):
        self.cone_source.SetResolution(resolution)
        self.client_view.update()

    @trigger("reset_camera")
    def reset_camera(self):
        self.renderer.ResetCamera()
        self.client_view.update()

    def _set_resolution(self, value):
        state = self.server.state
        with state:
            state.resolution = value

    def _set_resolution_thread_safe(self, value):
        self.current_event_loop.call_soon_threadsafe(self._set_resolution, value)
        self.current_event_loop.call_soon_threadsafe(self.exec_js, "a", value, "c")

    @trigger("start_animation")
    def start_animation(self):
        self.pool.submit(threaded_execution, self._set_resolution_thread_safe)

    def exec_js(self, *args):
        self.server.js_call("ref:hello", "method:world", *args)


if __name__ == "__main__":
    web_app = WebApp()
    web_app.server.start()
