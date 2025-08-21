// src/core/Geometry.ts
import { vec3 } from "gl-matrix";

export class Geometry {
    public readonly vertexBuffer: WebGLBuffer;
    public readonly vertexCount: number;
    public readonly indexBuffer: WebGLBuffer | null = null;
    public readonly indexCount: number = 0;
    private readonly gl: WebGLRenderingContext;

    /**
     * Creates a new Geometry instance.
     * @param gl The WebGL rendering context.
     * @param data The interleaved vertex data.
     * @param vertexComponentCount The number of float components per vertex.
     * @param indices An optional array of indices for indexed drawing.
     */
    constructor(
        gl: WebGLRenderingContext,
        data: Float32Array,
        vertexComponentCount: number,
        indices?: Uint16Array
    ) {
        this.gl = gl;

        if (vertexComponentCount <= 0) {
            throw new Error('vertexComponentCount must be greater than 0.');
        }

        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new Error('Could not create WebGL buffer.');
        }
        this.vertexBuffer = buffer;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        this.vertexCount = data.length / vertexComponentCount;

        // Si se proporcionan índices, crea y llena el buffer de índices.
        if (indices) {
            const idxBuffer = gl.createBuffer();
            if (!idxBuffer) {
                throw new Error('Could not create WebGL index buffer.');
            }
            this.indexBuffer = idxBuffer;
            this.indexCount = indices.length;

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        }

        // Desvinculamos los buffers para evitar modificaciones accidentales
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        if (indices) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }
    }
}
