// src/Glixar.ts
import { Renderer } from './core/Renderer';
import { Geometry } from './core/Geometry';
import { Shader } from './core/Shader';
import { SceneObject } from './objects/SceneObject'; // Importa la nueva clase

export class Glixar {
    private renderer: Renderer;

    constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`No se encontró el canvas con id "${canvasId}"`);
        }
        this.renderer = new Renderer(canvas);
    }

    public createGeometry(name: string, data: Float32Array, componentCount: number): Geometry {
        return this.renderer.getOrCreateGeometry(name, data, componentCount);
    }

    public createShader(name: string, vertexSrc: string, fragmentSrc: string): Shader {
        return this.renderer.getOrCreateShader(name, vertexSrc, fragmentSrc);
    }

    /**
     * Renderiza una escena completa.
     * @param scene Una lista de objetos SceneObject.
     */
    public render(scene: SceneObject[]): void { // La firma ahora usa SceneObject
        this.renderer.clear();
        for (const sceneObject of scene) { // Cambiado el nombre de la variable por claridad
            this.renderer.draw(sceneObject);
        }
    }
}
