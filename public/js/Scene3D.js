define(["require", "exports", "./WebGLContext", "./ShaderProgram", "gl-matrix", "./VertexBuffers"], function (require, exports, WebGLContext_1, ShaderProgram_1, gl_matrix_1, VertexBuffers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Scene3D = /** @class */ (function () {
        function Scene3D() {
            var _this = this;
            this.ANGLE_STEP = 3.0;
            this.arm1Length = 10.0;
            this.arm1Angle = -90.0;
            this.joint1Angle = 0.0;
            var program = ShaderProgram_1.default.Create();
            if (program === null) {
                console.log("Failed to get a shader program.");
                return;
            }
            this.amountOfVertices = VertexBuffers_1.default.Init(program);
            if (this.amountOfVertices == -1) {
                console.log("Failed to initialize the vertex buffers.");
                return;
            }
            this.uMvpMatrixLocation = WebGLContext_1.gl.getUniformLocation(program, "uMvpMatrix");
            this.uNormalMatrixLocation = WebGLContext_1.gl.getUniformLocation(program, "uNormalMatrix");
            if (!this.uMvpMatrixLocation || !this.uNormalMatrixLocation) {
                console.log("Failed to get the storage location of matrix variables.");
                return;
            }
            this.modelMatrix = gl_matrix_1.mat4.create();
            this.mvpMatrix = gl_matrix_1.mat4.create();
            this.normalMatrix = gl_matrix_1.mat4.create();
            this.viewProjMatrix = gl_matrix_1.mat4.create();
            var projMatrix = gl_matrix_1.mat4.create();
            var viewMatrix = gl_matrix_1.mat4.create();
            gl_matrix_1.mat4.perspective(projMatrix, 50.0 * Math.PI / 180.0, 1.0, 0.1, 100.0);
            gl_matrix_1.mat4.lookAt(viewMatrix, gl_matrix_1.vec3.fromValues(20.0, 10.0, 30.0), gl_matrix_1.vec3.fromValues(0.0, 0.0, 0.0), gl_matrix_1.vec3.fromValues(0.0, 1.0, 0.0));
            gl_matrix_1.mat4.multiply(this.viewProjMatrix, projMatrix, viewMatrix);
            WebGLContext_1.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            WebGLContext_1.gl.enable(WebGLContext_1.gl.DEPTH_TEST);
            WebGLContext_1.gl.viewport(0, 0, WebGLContext_1.gl.canvas.width, WebGLContext_1.gl.canvas.height);
            document.onkeydown =
                function (ev) {
                    _this.KeyDown(ev);
                };
            this.Draw();
        }
        Scene3D.prototype.KeyDown = function (ev) {
            switch (ev.keyCode) {
                case 38: // Up arrow key -> the positive rotation of joint1 around the z-axis
                case 87: // 'W' key
                    if (this.joint1Angle < 135.0) {
                        this.joint1Angle += this.ANGLE_STEP;
                    }
                    break;
                case 40: // Down arrow key -> the negative rotation of joint1 around the z-axis
                case 83: // S
                    if (this.joint1Angle > -135.0) {
                        this.joint1Angle -= this.ANGLE_STEP;
                    }
                    break;
                case 39: // Right arrow key -> the positive rotation of arm1 around the y-axis
                case 68:
                    this.arm1Angle = (this.arm1Angle + this.ANGLE_STEP) % 360;
                    break;
                case 37: // Left arrow key -> the negative rotation of arm1 around the y-axis
                case 65:
                    this.arm1Angle = (this.arm1Angle - this.ANGLE_STEP) % 360;
                    break;
            }
            this.Draw();
        };
        Scene3D.prototype.Draw = function () {
            WebGLContext_1.gl.clear(WebGLContext_1.gl.COLOR_BUFFER_BIT | WebGLContext_1.gl.DEPTH_BUFFER_BIT);
            // Arm1
            gl_matrix_1.mat4.fromTranslation(this.modelMatrix, gl_matrix_1.vec3.fromValues(0.0, -12.0, 0.0));
            gl_matrix_1.mat4.rotateY(this.modelMatrix, this.modelMatrix, this.arm1Angle * Math.PI / 180.0);
            this.DrawBox();
            // Arm2
            gl_matrix_1.mat4.translate(this.modelMatrix, this.modelMatrix, gl_matrix_1.vec3.fromValues(0.0, this.arm1Length, 0.0));
            gl_matrix_1.mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.joint1Angle * Math.PI / 180.0);
            gl_matrix_1.mat4.scale(this.modelMatrix, this.modelMatrix, gl_matrix_1.vec3.fromValues(1.3, 1.0, 1.3));
            this.DrawBox();
        };
        Scene3D.prototype.DrawBox = function () {
            gl_matrix_1.mat4.multiply(this.mvpMatrix, this.viewProjMatrix, this.modelMatrix);
            WebGLContext_1.gl.uniformMatrix4fv(this.uMvpMatrixLocation, false, this.mvpMatrix);
            gl_matrix_1.mat4.transpose(this.normalMatrix, this.modelMatrix);
            gl_matrix_1.mat4.invert(this.normalMatrix, this.normalMatrix);
            WebGLContext_1.gl.uniformMatrix4fv(this.uNormalMatrixLocation, false, this.normalMatrix);
            WebGLContext_1.gl.drawElements(WebGLContext_1.gl.TRIANGLES, this.amountOfVertices, WebGLContext_1.gl.UNSIGNED_BYTE, 0);
        };
        return Scene3D;
    }());
    exports.default = Scene3D;
});
//# sourceMappingURL=Scene3D.js.map