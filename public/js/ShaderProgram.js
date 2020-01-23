define(["require", "exports", "./WebGLContext"], function (require, exports, WebGLContext_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShaderProgram = /** @class */ (function () {
        function ShaderProgram() {
        }
        ShaderProgram.Create = function () {
            var vShader = this.CreateShader(this.vShaderSource, WebGLContext_1.gl.VERTEX_SHADER);
            var fShader = this.CreateShader(this.fShaderSource, WebGLContext_1.gl.FRAGMENT_SHADER);
            if (vShader === null || fShader === null) {
                return null;
            }
            var program = WebGLContext_1.gl.createProgram();
            WebGLContext_1.gl.attachShader(program, vShader);
            WebGLContext_1.gl.attachShader(program, fShader);
            WebGLContext_1.gl.linkProgram(program);
            var ok = WebGLContext_1.gl.getProgramParameter(program, WebGLContext_1.gl.LINK_STATUS);
            if (!ok) {
                console.log("Failed to link a program. Error: " + WebGLContext_1.gl.getProgramInfoLog(program));
                return null;
            }
            WebGLContext_1.gl.useProgram(program);
            return program;
        };
        ShaderProgram.CreateShader = function (source, type) {
            var shader = WebGLContext_1.gl.createShader(type);
            WebGLContext_1.gl.shaderSource(shader, source);
            WebGLContext_1.gl.compileShader(shader);
            var ok = WebGLContext_1.gl.getShaderParameter(shader, WebGLContext_1.gl.COMPILE_STATUS);
            if (!ok) {
                console.log("Failed to compile a shader.");
                console.log("Error: " + WebGLContext_1.gl.getShaderInfoLog(shader));
                console.log("Shader: " + source);
                return null;
            }
            return shader;
        };
        ShaderProgram.vShaderSource = "\n            attribute vec4 aPosition;\n            attribute vec4 aNormal;\n\n            uniform mat4 uMvpMatrix;\n            uniform mat4 uNormalMatrix;\n\n            varying vec4 vColor;\n\n            void main()\n            {\n                gl_Position = uMvpMatrix * aPosition;\n\n                vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7)); // Light direction\n                vec4 color = vec4(1.0, 0.4, 0.0, 1.0);\n                vec3 normal = normalize((uNormalMatrix * aNormal).xyz);\n                float nDotL = max(dot(normal, lightDirection), 0.0);\n                vColor = vec4(color.rgb * nDotL + vec3(0.1), color.a);\n            }\n        ";
        ShaderProgram.fShaderSource = "\n            precision mediump float;\n\n            varying vec4 vColor;\n\n            void main()\n            {\n                gl_FragColor = vColor;\n            }\n        ";
        return ShaderProgram;
    }());
    exports.default = ShaderProgram;
});
//# sourceMappingURL=ShaderProgram.js.map