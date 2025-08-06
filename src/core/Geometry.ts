// src/core/Geometry.ts

/**
 * La clase Geometry representa una forma geométrica, conteniendo los datos de sus vértices
 * y el buffer de WebGL correspondiente.
 */
export class Geometry {
    public readonly vertexBuffer: WebGLBuffer;
    public readonly vertexCount: number;
    private readonly gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext, data: Float32Array) {
        this.gl = gl;

        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new Error('No se pudo crear el buffer de WebGL.');
        }
        this.vertexBuffer = buffer;

        // Vinculamos el buffer y le cargamos los datos
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        // Asumimos 2 componentes por vértice (x, y)
        this.vertexCount = data.length / 2;

        // Desvinculamos el buffer para evitar modificaciones accidentales
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}
