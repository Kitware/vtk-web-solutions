#include <pybind11/pybind11.h>
#include "PybindVTKTypeCaster.h"

#include "Cone.h"

namespace py = pybind11;
constexpr auto byref = py::return_value_policy::reference_internal;

PYBIND11_MODULE(cxx_engine, m) {
    m.doc() = "our c++ cone example";

    py::class_<Cone>(m, "Cone")
    .def(py::init<>())
    .def("Initialize", &Cone::Initialize)
    .def("SetResolution", &Cone::SetResolution)
    ;
}
