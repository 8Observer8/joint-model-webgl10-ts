import { WebGLContext } from "./WebGLContext";
import Scene3D from "./Scene3D";

class Prorgam
{
    public static Main(): void
    {
        if (!WebGLContext.Init("renderCanvas"))
        {
            return;
        }

        new Scene3D();
    }
}

// Debug version
Prorgam.Main();

// Release version
// window.onload = () => Prorgam.Main();
