#ifndef cone_h
#define cone_h

#include <vtkConeSource.h>
#include <vtkSmartPointer.h>
#include <vtkRenderWindow.h>

#include "cone_export.h"

class CONE_EXPORT Cone {
    vtkSmartPointer<vtkConeSource> coneSource;
    vtkSmartPointer<vtkRenderWindow> renderWindow;

public:
    Cone();

    void Initialize(vtkSmartPointer<vtkRenderWindow> renderWindow);
    void SetResolution(int resolution);
};
#endif