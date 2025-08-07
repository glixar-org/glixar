// src/core/Renderer.ts
import { Shader } from './Shader';
import { Geometry } from './Geometry';
import { SceneObject } from '../objects/SceneObject';
import { Camera2D } from './Camera2D'; // Importamos la cámara

export class Renderer {
    // ... (el constructor y los métodos getOrCreate... no cambian)
    public readonly gl: WebGLRenderingContext;
    private readonly shaderCache: Map<string, Shader>;
    private readonly geometryCache: Map<string, Geometry>;

    constructor(canvas: HTMLCanvasElement) {
        const gl = canvas.getContext('webgl');
        if (!gl) {
            throw new Error('WebGL no está soportado en este navegador.');
        }
        this.gl = gl;
        this.shaderCache = new Map();
        this.geometryCache = new Map();
        this.resizeToDisplaySize();
    }

    public getOrCreateShader(name: string, vertexSrc: string, fragmentSrc: string): Shader {
        if (this.shaderCache.has(name)) {
            return this.shaderCache.get(name)!;
        }
        const shader = new Shader(this.gl, vertexSrc, fragmentSrc);
        this.shaderCache.set(name, shader);
        return shader;
    }

    public getOrCreateGeometry(name: string, data: Float32Array, vertexComponentCount: number): Geometry {
        if (this.geometryCache.has(name)) {
            return this.geometryCache.get(name)!;
        }
        const geometry = new Geometry(this.gl, data, vertexComponentCount);
        this.geometryCache.set(name, geometry);
        return geometry;
    }

    public clear(): void {
        this.gl.clearColor(0.0, 0.13, 0.26, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    // El método draw ahora también necesita la cámara
    public draw(sceneObject: SceneObject, camera: Camera2D): void {
        const { geometry, shader, modelMatrix } = sceneObject;
        const gl = this.gl;

        shader.use();

        // Pasamos las TRES matrices al shader
        shader.setMatrix4fv('u_modelMatrix', modelMatrix);
        shader.setMatrix4fv('u_viewMatrix', camera.viewMatrix);
        shader.setMatrix4fv('u_projectionMatrix', camera.projectionMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, geometry.vertexBuffer);

        const STRIDE = 5 * 4;
        const posAttribLocation = gl.getAttribLocation(shader.program, 'a_position');
        gl.vertexAttribPointer(posAttribLocation, 2, gl.FLOAT, false, STRIDE, 0);
        gl.enableVertexAttribArray(posAttribLocation);

        const colorAttribLocation = gl.getAttribLocation(shader.program, 'a_color');
        gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, STRIDE, 8);
        gl.enableVertexAttribArray(colorAttribLocation);

        gl.drawArrays(gl.TRIANGLES, 0, geometry.vertexCount);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    public resizeToDisplaySize(): void {
        // ... (sin cambios)
    }
}
