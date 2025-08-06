// src/core/Geometry.ts

/**
 * La clase Geometry representa una forma geométrica, conteniendo los datos de sus vértices
 * y el buffer de WebGL correspondiente.
 */
export class Geometry {
    public readonly vertexBuffer: WebGLBuffer;
    public readonly vertexCount: number;
    private readonly gl: WebGLRenderingContext;

    constructor(
        gl: WebGLRenderingContext,
        data: Float32Array,
        vertexComponentCount: number
    ) {
        this.gl = gl;

        if (vertexComponentCount <= 0) {
            throw new Error('vertexComponentCount debe ser mayor que 0.');
        }

        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new Error('No se pudo crear el buffer de WebGL.');
        }
        this.vertexBuffer = buffer;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        // Corregimos el cálculo usando el número de componentes proporcionado
        this.vertexCount = data.length / vertexComponentCount;

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}
