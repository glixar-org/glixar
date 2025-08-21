// src/Glixar.ts
import { Renderer } from './core/Renderer';
import { Geometry } from './core/Geometry';
import { Shader } from './core/Shader';
import { SceneObject } from './objects/SceneObject';
import { Camera2D } from './core/Camera2D';

/**
 * The main Glixar class. This is the entry point for the entire library.
 * It orchestrates the internal renderer and provides a public API for engine interaction.
 * @example
 * const glixar = new Glixar('my-canvas-id');
 */
export class Glixar {
    private renderer: Renderer;
    public readonly canvas: HTMLCanvasElement;

    /**
     * Creates a new instance of the Glixar engine.
     * @param canvasId The ID of the HTML `<canvas>` element to render upon.
     */
    constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`Canvas element with id "${canvasId}" not found`);
        }
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
    }

    /**
     * Gets or creates a cached Geometry instance from a vertex data array.
     * @param name A unique name to identify this geometry.
     * @param data A Float32Array of interleaved vertex data.
     * @param componentCount The number of components per vertex (e.g., 5 for X, Y, R, G, B).
     * @param indices An optional Uint16Array of indices for indexed drawing.
     * @returns A Geometry instance.
     */
    public createGeometry(name: string, data: Float32Array, componentCount: number, indices?: Uint16Array): Geometry {
        return this.renderer.getOrCreateGeometry(name, data, componentCount, indices);
    }

    /**
     * Gets or creates a cached Shader program from source code.
     * Shaders are compiled and linked only once and then reused.
     * @param name A unique name to identify this shader.
     * @param vertexSrc The source code for the Vertex Shader.
     * @param fragmentSrc The source code for the Fragment Shader.
     * @returns A Shader instance.
     */
    public createShader(name: string, vertexSrc: string, fragmentSrc: string): Shader {
        return this.renderer.getOrCreateShader(name, vertexSrc, fragmentSrc);
    }

    /**
     * Renders a complete scene using a specific camera.
     * @param scene An array of {@link SceneObject} instances to draw.
     * @param camera The {@link Camera2D} defining the viewpoint.
     */
    public render(scene: SceneObject[], camera: Camera2D): void {
        camera.update();
        this.renderer.clear();
        for (const sceneObject of scene) {
            this.renderer.draw(sceneObject, camera);
        }
    }
}
