
export let gl: WebGLRenderingContext = null;

export class WebGLContext
{
    public static Init(canvasName: string): boolean
    {
        let canvas = document.getElementById(canvasName) as HTMLCanvasElement;
        if (canvas === null)
        {
            console.log("Failed to get the canvas element: " + canvasName);
            return false;
        }

        gl = canvas.getContext("webgl");
        if (gl === null)
        {
            console.log("Failed to get the WebGL rendering context");
            return false;
        }

        return true;
    }
}