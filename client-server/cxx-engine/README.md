# cxx-engine

This directory contains custom C++ code that use VTK for its data processing and rendering.

This is a minimal example on how you can expose your C++ library into a Python module that can then be used within Kitware web infrastructure.

## Requirements

In order to build this library, you will need **pybind11** and **VTK**.

### Pybind11

On macOS, you can install **pybind11** via homebrew by running the following command.

```bash
brew install pybind11
```

### VTK

If you want to build the latest version of VTK, you can do the following

```bash
git clone https://gitlab.kitware.com/vtk/vtk.git
cmake \
    -S ./vtk \
    -B ./build/vtk \
    -G Ninja \
    -DVTK_WRAP_PYTHON=ON \
    -DVTK_GROUP_ENABLE_Web=WANT \
    -DPython3_LIBRARY=/opt/homebrew/opt/python@3.9/Frameworks/Python.framework/Versions/3.9/lib/libpython3.9.dylib
cmake --build ./build/vtk
cmake --install ./build/vtk --prefix ./install/vtk
```

## Compilation

```bash
# Build
cmake \
    -S ./client-server/cxx-engine \
    -B ./build/engine \
    -G Ninja \
    -DVTK_DIR=$PWD/install/vtk/lib/cmake/vtk-9.3
cmake --build ./build/engine

# Install
cmake --install ./build/engine --prefix ./install/engine
```

## Usage

Then to use that server you will have to rely on trame to run it with a built-in UI or a custom Vue/React client UI.