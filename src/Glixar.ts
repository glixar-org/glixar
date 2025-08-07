// src/Glixar.ts
import { Renderer } from './core/Renderer';
import { Geometry } from './core/Geometry';
import { Shader } from './core/Shader';
import { SceneObject } from './objects/SceneObject';
import { Camera2D } from './core/Camera2D'; // Importamos la cámara

export class Glixar {
    private renderer: Renderer;
    public readonly canvas: HTMLCanvasElement; // Hacemos el canvas público

    constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`No se encontró el canvas con id "${canvasId}"`);
        }
        this.canvas = canvas; // Guardamos la referencia
        this.renderer = new Renderer(canvas);
    }

    public createGeometry(name: string, data: Float32Array, componentCount: number): Geometry {
        return this.renderer.getOrCreateGeometry(name, data, componentCount);
    }

    public createShader(name: string, vertexSrc: string, fragmentSrc: string): Shader {
        return this.renderer.getOrCreateShader(name, vertexSrc, fragmentSrc);
    }

    // El método render ahora acepta una cámara
    public render(scene: SceneObject[], camera: Camera2D): void {
        camera.update(); // Importante: actualizamos la cámara antes de dibujar
        this.renderer.clear();
        for (const sceneObject of scene) {
            this.renderer.draw(sceneObject, camera);
        }
    }
}
