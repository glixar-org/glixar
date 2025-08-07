// src/core/Renderer.ts
import {Shader} from './Shader';
import {Geometry} from './Geometry';
import {Renderable} from './types';

export class Renderer {
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
        // ... (sin cambios en este método)
        if (this.shaderCache.has(name)) {
            return this.shaderCache.get(name)!;
        }
        const shader = new Shader(this.gl, vertexSrc, fragmentSrc);
        this.shaderCache.set(name, shader);
        console.log(`Shader "${name}" creado y cacheado.`);
        return shader;
    }

    public getOrCreateGeometry(
        name: string,
        data: Float32Array,
        vertexComponentCount: number
    ): Geometry {
        if (this.geometryCache.has(name)) {
            return this.geometryCache.get(name)!;
        }
        // Pasamos el nuevo parámetro al constructor de Geometry
        const geometry = new Geometry(this.gl, data, vertexComponentCount);
        this.geometryCache.set(name, geometry);
        console.log(`Geometría "${name}" creada y cacheada.`);
        return geometry;
    }

    /**
     * Limpia el canvas al color especificado.
     */
    public clear(): void {
        this.gl.clearColor(0.0, 0.13, 0.26, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    /**
     * Dibuja un único objeto Renderable en el canvas.
     * NO limpia el canvas.
     * @param renderable El objeto a dibujar.
     */

    public draw(renderable: Renderable): void {
        const {geometry, shader, modelMatrix} = renderable;
        const gl = this.gl;

        shader.use();

        // NUEVO: Enviamos la matriz del objeto al shader
        shader.setMatrix4fv('u_modelMatrix', modelMatrix);

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
        // ... (sin cambios en este método)
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
