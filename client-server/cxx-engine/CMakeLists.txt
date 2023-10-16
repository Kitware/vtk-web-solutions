cmake_minimum_required(VERSION 3.12 FATAL_ERROR)

project(cxx_engine)

find_package(VTK
  COMPONENTS
    CommonCore
    CommonDataModel
    FiltersSources
    InteractionStyle
    RenderingContextOpenGL2
    RenderingCore
    RenderingFreeType
    RenderingGL2PSOpenGL2
    RenderingOpenGL2
    WrappingPythonCore
)
find_package(pybind11 REQUIRED)

if (NOT VTK_FOUND)
  message(FATAL_ERROR "cxx_engine: Unable to find the VTK build folder.")
endif()

set(library_name "cxx_engine")
set(PYBIND11_FLAGS "-Wno-shadow")

pybind11_add_module(${library_name} PyWrap.cxx Cone.cxx)
target_include_directories(${library_name} PUBLIC
  $<BUILD_INTERFACE:${PROJECT_SOURCE_DIR}>
  $<BUILD_INTERFACE:${PROJECT_BINARY_DIR}>
)
target_link_libraries(${library_name} PRIVATE ${VTK_LIBRARIES})
set_target_properties(${library_name}
  PROPERTIES
    CXX_VISIBILITY_PRESET hidden
    COMPILE_FLAGS ${PYBIND11_FLAGS}
)

generate_export_header(${library_name})

# vtk_module_autoinit is needed
vtk_module_autoinit(
  TARGETS ${library_name}
  MODULES ${VTK_LIBRARIES}
)
