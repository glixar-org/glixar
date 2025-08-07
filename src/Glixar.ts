// src/Glixar.ts
import { Renderer } from './core/Renderer';
import { Geometry } from './core/Geometry';
import { Shader } from './core/Shader';
import { Renderable } from './core/types';

/**
 * La clase principal de Glixar. Este es el punto de entrada para toda la librería.
 */
export class Glixar {
    private renderer: Renderer;

    constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`No se encontró el canvas con id "${canvasId}"`);
        }
        this.renderer = new Renderer(canvas);
    }

    /**
     * Obtiene o crea una geometría cacheada.
     */
    public createGeometry(name: string, data: Float32Array, componentCount: number): Geometry {
        return this.renderer.getOrCreateGeometry(name, data, componentCount);
    }

    /**
     * Obtiene o crea un shader cacheado.
     */
    public createShader(name: string, vertexSrc: string, fragmentSrc: string): Shader {
        return this.renderer.getOrCreateShader(name, vertexSrc, fragmentSrc);
    }

    /**
     * Renderiza una escena completa.
     * @param scene Una lista de objetos renderizables.
     */
    public render(scene: Renderable[]): void {
        this.renderer.clear();
        for (const renderable of scene) {
            this.renderer.draw(renderable);
        }
    }
}
