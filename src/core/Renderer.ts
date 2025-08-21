// src/core/Renderer.ts
import { Shader } from './Shader';
import { Geometry } from './Geometry';
import { SceneObject } from '../objects/SceneObject';
import { Camera2D } from './Camera2D';

export class Renderer {
    public readonly gl: WebGLRenderingContext;
    private readonly shaderCache: Map<string, Shader>;
    private readonly geometryCache: Map<string, Geometry>;

    constructor(canvas: HTMLCanvasElement) {
        const gl = canvas.getContext('webgl');
        if (!gl) {
            throw new Error('WebGL is not supported in this browser.');
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

    public getOrCreateGeometry(name: string, data: Float32Array, vertexComponentCount: number, indices?: Uint16Array): Geometry {
        if (this.geometryCache.has(name)) {
            return this.geometryCache.get(name)!;
        }
        const geometry = new Geometry(this.gl, data, vertexComponentCount, indices);
        this.geometryCache.set(name, geometry);
        return geometry;
    }

    public clear(): void {
        this.gl.clearColor(0.0, 0.13, 0.26, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    public draw(sceneObject: SceneObject, camera: Camera2D): void {
        const { geometry, shader, modelMatrix } = sceneObject;
        const gl = this.gl;

        shader.use();

        shader.setMatrix4fv('u_modelMatrix', modelMatrix);
        shader.setMatrix4fv('u_viewMatrix', camera.viewMatrix);
        shader.setMatrix4fv('u_projectionMatrix', camera.projectionMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, geometry.vertexBuffer);

        const STRIDE = 5 * 4; // 5 components (x,y,r,g,b) * 4 bytes/float
        const posAttribLocation = gl.getAttribLocation(shader.program, 'a_position');
        gl.vertexAttribPointer(posAttribLocation, 2, gl.FLOAT, false, STRIDE, 0);
        gl.enableVertexAttribArray(posAttribLocation);

        const colorAttribLocation = gl.getAttribLocation(shader.program, 'a_color');
        gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, STRIDE, 8);
        gl.enableVertexAttribArray(colorAttribLocation);

        if (geometry.indexBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.indexBuffer);
            gl.drawElements(gl.TRIANGLES, geometry.indexCount, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(gl.TRIANGLES, 0, geometry.vertexCount);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        if (geometry.indexBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }
    }

    public resizeToDisplaySize(): void {
        const canvas = this.gl.canvas as HTMLCanvasElement;
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        }
    }
}
