import { gl } from "./WebGLContext";

export default class ShaderProgram
{
    private static vShaderSource =
        `
            attribute vec4 aPosition;
            attribute vec4 aNormal;

            uniform mat4 uMvpMatrix;
            uniform mat4 uNormalMatrix;

            varying vec4 vColor;

            void main()
            {
                gl_Position = uMvpMatrix * aPosition;

                vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7)); // Light direction
                vec4 color = vec4(1.0, 0.4, 0.0, 1.0);
                vec3 normal = normalize((uNormalMatrix * aNormal).xyz);
                float nDotL = max(dot(normal, lightDirection), 0.0);
                vColor = vec4(color.rgb * nDotL + vec3(0.1), color.a);
            }
        `;

    private static fShaderSource =
        `
            precision mediump float;

            varying vec4 vColor;

            void main()
            {
                gl_FragColor = vColor;
            }
        `;

    public static Create(): WebGLProgram
    {
        let vShader = this.CreateShader(this.vShaderSource, gl.VERTEX_SHADER);
        let fShader = this.CreateShader(this.fShaderSource, gl.FRAGMENT_SHADER);
        if (vShader === null || fShader === null)
        {
            return null;
        }

        let program = gl.createProgram();
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);
        let ok = gl.getProgramParameter(program, gl.LINK_STATUS) as boolean;
        if (!ok)
        {
            console.log("Failed to link a program. Error: " + gl.getProgramInfoLog(program));
            return null;
        }
        gl.useProgram(program);

        return program;
    }

    private static CreateShader(source: string, type: number): WebGLShader
    {
        let shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let ok = gl.getShaderParameter(shader, gl.COMPILE_STATUS) as boolean;
        if (!ok)
        {
            console.log("Failed to compile a shader.");
            console.log("Error: " + gl.getShaderInfoLog(shader));
            console.log("Shader: " + source);
            return null;
        }

        return shader;
    }
}