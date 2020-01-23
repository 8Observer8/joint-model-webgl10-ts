import { gl } from "./WebGLContext";
import ShaderProgram from "./ShaderProgram";
import { mat4, vec3 } from "gl-matrix";
import VertexBuffers from "./VertexBuffers";

export default class Scene3D
{
    private modelMatrix: mat4;
    private mvpMatrix: mat4;
    private normalMatrix: mat4;
    private viewProjMatrix: mat4;

    private uMvpMatrixLocation: WebGLUniformLocation;
    private uNormalMatrixLocation: WebGLUniformLocation;

    private amountOfVertices: number;
    private readonly ANGLE_STEP = 3.0;
    private arm1Length = 10.0;
    private arm1Angle = -90.0;
    private joint1Angle = 0.0;

    public constructor()
    {
        let program = ShaderProgram.Create();
        if (program === null)
        {
            console.log("Failed to get a shader program.");
            return;
        }

        this.amountOfVertices = VertexBuffers.Init(program);
        if (this.amountOfVertices == -1)
        {
            console.log("Failed to initialize the vertex buffers.");
            return;
        }

        this.uMvpMatrixLocation = gl.getUniformLocation(program, "uMvpMatrix");
        this.uNormalMatrixLocation = gl.getUniformLocation(program, "uNormalMatrix");
        if (!this.uMvpMatrixLocation || !this.uNormalMatrixLocation)
        {
            console.log("Failed to get the storage location of matrix variables.");
            return;
        }

        this.modelMatrix = mat4.create();
        this.mvpMatrix = mat4.create();
        this.normalMatrix = mat4.create();
        this.viewProjMatrix = mat4.create();

        let projMatrix = mat4.create();
        let viewMatrix = mat4.create();
        mat4.perspective(projMatrix, 50.0 * Math.PI / 180.0, 1.0, 0.1, 100.0);
        mat4.lookAt(
            viewMatrix,
            vec3.fromValues(20.0, 10.0, 30.0),
            vec3.fromValues(0.0, 0.0, 0.0),
            vec3.fromValues(0.0, 1.0, 0.0));
        mat4.multiply(this.viewProjMatrix, projMatrix, viewMatrix);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        document.onkeydown =
            (ev: KeyboardEvent) =>
            {
                this.KeyDown(ev);
            };

        this.Draw();
    }

    private KeyDown(ev: KeyboardEvent): void
    {
        switch (ev.keyCode)
        {
            case 38:    // Up arrow key -> the positive rotation of joint1 around the z-axis
            case 87:    // 'W' key
                if (this.joint1Angle < 135.0)
                {
                    this.joint1Angle += this.ANGLE_STEP;
                }
                break;
            case 40:    // Down arrow key -> the negative rotation of joint1 around the z-axis
            case 83:    // S
                if (this.joint1Angle > -135.0)
                {
                    this.joint1Angle -= this.ANGLE_STEP;
                }
                break;
            case 39:    // Right arrow key -> the positive rotation of arm1 around the y-axis
            case 68:
                this.arm1Angle = (this.arm1Angle + this.ANGLE_STEP) % 360;
                break;
            case 37:    // Left arrow key -> the negative rotation of arm1 around the y-axis
            case 65:
                this.arm1Angle = (this.arm1Angle - this.ANGLE_STEP) % 360;
                break;
        }
        this.Draw();
    }

    private Draw(): void
    {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Arm1
        mat4.fromTranslation(this.modelMatrix, vec3.fromValues(0.0, -12.0, 0.0));
        mat4.rotateY(this.modelMatrix, this.modelMatrix, this.arm1Angle * Math.PI / 180.0);
        this.DrawBox();

        // Arm2
        mat4.translate(this.modelMatrix, this.modelMatrix, vec3.fromValues(0.0, this.arm1Length, 0.0));
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.joint1Angle * Math.PI / 180.0);
        mat4.scale(this.modelMatrix, this.modelMatrix, vec3.fromValues(1.3, 1.0, 1.3));
        this.DrawBox();
    }

    private DrawBox(): void
    {
        mat4.multiply(this.mvpMatrix, this.viewProjMatrix, this.modelMatrix);
        gl.uniformMatrix4fv(this.uMvpMatrixLocation, false, this.mvpMatrix);

        mat4.transpose(this.normalMatrix, this.modelMatrix);
        mat4.invert(this.normalMatrix, this.normalMatrix);
        gl.uniformMatrix4fv(this.uNormalMatrixLocation, false, this.normalMatrix);

        gl.drawElements(gl.TRIANGLES, this.amountOfVertices, gl.UNSIGNED_BYTE, 0);
    }
}