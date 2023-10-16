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
from trame.ui.vuetify2 import SinglePageLayout
from trame.widgets import vuetify2, vtk
from trame.decorators import TrameApp, change

from cone import Cone


@TrameApp()
class WebApp:
    def __init__(self, cxxServer):
        self.cxxServer = cxxServer
        self.server = get_server(client_type="vue2")
        self.state = self.server.state
        self.ctrl = self.server.controller

        self.setup_vtk()
        self.setup_ui()

    def setup_ui(self):
        with SinglePageLayout(self.server) as layout:
            with layout.toolbar:
                vuetify2.VSpacer()
                vuetify2.VSlider(
                    v_model=("resolution", 6),
                    min=3,
                    max=60,
                    hide_details=True,
                    dense=True,
                )

            with layout.content:
                with vuetify2.VContainer(fluid=True, classes="fill-height pa-0 ma-0"):
                    pass
                    with vtk.VtkRemoteView(self.render_window) as view:
                        self.ctrl.view_update = view.update
                        self.ctrl.view_reset_camera = view.reset_camera

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
        self.ctrl.view_update()


if __name__ == "__main__":
    cxx_server_instance = Cone()
    web_app = WebApp(cxx_server_instance)
    web_app.server.start()
