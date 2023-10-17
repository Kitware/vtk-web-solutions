# Allow vtkpython to use a venv
import vtkmodules.web.venv

from vtkmodules.vtkRenderingCore import (
    vtkRenderWindow,
    vtkRenderer,
    vtkRenderWindowInteractor,
)
from vtkmodules.vtkInteractionStyle import vtkInteractorStyleSwitch  # noqa
import vtkmodules.vtkRenderingOpenGL2  # noqa

from trame.app import get_server
from trame.widgets import vtk
from trame.decorators import TrameApp, change

from cxx_engine import Cone


@TrameApp()
class WebApp:
    def __init__(self, cxxServer):
        self.cxxServer = cxxServer
        self.server = get_server(client_type="vue2")
        self.state = self.server.state
        self.ctrl = self.server.controller

        self.setup_vtk()
        self.view = vtk.VtkRemoteView(self.render_window, trame_server=self.server)

    def setup_vtk(self):
        renderer = vtkRenderer()
        render_window = vtkRenderWindow()
        render_window.AddRenderer(renderer)
        render_window.OffScreenRenderingOn()

        render_window_interactor = vtkRenderWindowInteractor()
        render_window_interactor.SetRenderWindow(render_window)
        render_window_interactor.GetInteractorStyle().SetCurrentStyleToTrackballCamera()

        self.render_window = render_window
        self.cxxServer.Initialize(render_window)

    @change("resolution")
    def on_resolution_change(self, resolution, **kwargs):
        self.cxxServer.SetResolution(resolution)
        self.view.update()


if __name__ == "__main__":
    cxx_server_instance = Cone()
    web_app = WebApp(cxx_server_instance)
    web_app.server.start()
