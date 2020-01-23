import { gl } from "./WebGLContext";

export default class VertexBuffers
{
    public static Init(program: WebGLProgram): number
    {
        let vertices = new Float32Array([
            1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5, 0.0, 1.5, 1.5, 0.0, 1.5,     // v0-v1-v2-v3 front
            1.5, 10.0, 1.5, 1.5, 0.0, 1.5, 1.5, 0.0, -1.5, 1.5, 10.0, -1.5,     // v0-v3-v4-v5 right
            1.5, 10.0, 1.5, 1.5, 10.0, -1.5, -1.5, 10.0, -1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
            -1.5, 10.0, 1.5, -1.5, 10.0, -1.5, -1.5, 0.0, -1.5, -1.5, 0.0, 1.5, // v1-v6-v7-v2 left
            -1.5, 0.0, -1.5, 1.5, 0.0, -1.5, 1.5, 0.0, 1.5, -1.5, 0.0, 1.5,     // v7-v4-v3-v2 down
            1.5, 0.0, -1.5, -1.5, 0.0, -1.5, -1.5, 10.0, -1.5, 1.5, 10.0, -1.5  // v4-v7-v6-v5 back
        ]);

        let normals = new Float32Array([
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,     // v0-v1-v2-v3 front
            1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,     // v0-v3-v4-v5 right
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,     // v0-v5-v6-v1 up
            -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
            0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, // v7-v4-v3-v2 down
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0  // v4-v7-v6-v5 back
        ]);

        let indices = new Uint8Array([
            0, 1, 2, 0, 2, 3,           // front
            4, 5, 6, 4, 6, 7,           // right
            8, 9, 10, 8, 10, 11,        // up
            12, 13, 14, 12, 14, 15,     // left
            16, 17, 18, 16, 18, 19,     // down
            20, 21, 22, 20, 22, 23      // back
        ]);

        if (!this.InitArrayBuffer(program, "aPosition", vertices, gl.FLOAT, 3)) return -1;
        if (!this.InitArrayBuffer(program, "aNormal", normals, gl.FLOAT, 3)) return -1;
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        let indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        return indices.length;
    }

    private static InitArrayBuffer(program: WebGLProgram, attributeName: string, data: Float32Array, type: number, num: number): boolean
    {
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        let attributeLocation = gl.getAttribLocation(program, attributeName);
        if (attributeLocation === -1)
        {
            console.log("Failed to get the storage location of " + attributeName);
            return false;
        }
        gl.vertexAttribPointer(attributeLocation, num, type, false, 0, 0);
        gl.enableVertexAttribArray(attributeLocation);

        return true;
    }
}