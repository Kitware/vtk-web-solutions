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
    -B ./vtk-build \
    -G Ninja \
    -DVTK_WRAP_PYTHON=ON \
    -DVTK_GROUP_ENABLE_Web=WANT \
    -DPython3_LIBRARY=/opt/homebrew/opt/python@3.9/Frameworks/Python.framework/Versions/3.9/lib/libpython3.9.dylib
cmake --build ./vtk-build
cmake --install ./vtk-build --prefix ./vtk-install
```

## Compilation

```bash
# Get code
git clone https://github.com/Kitware/vtk-web-solutions.git

# Build
cmake \
    -S ./vtk-web-solutions/client-server/cxx-engine \
    -B ./engine-build \
    -G Ninja \
    -DVTK_DIR=$PWD/vtk-build
cmake --build ./engine-build

# Install
cmake --install ./engine-build --prefix ./engine-install
```

## Usage

Then to use that server you will have to rely on trame to run it with a built-in UI or a custom Vue/React client UI.