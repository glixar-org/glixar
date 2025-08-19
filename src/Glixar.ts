// src/Glixar.ts
import { Renderer } from './core/Renderer';
import { Geometry } from './core/Geometry';
import { Shader } from './core/Shader';
import { SceneObject } from './objects/SceneObject';
import { Camera2D } from './core/Camera2D';

/**
 * La clase principal de Glixar. Este es el punto de entrada para toda la librería.
 * Orquesta el renderer y proporciona una API pública para interactuar con el motor.
 * @example
 * const glixar = new Glixar('my-canvas-id');
 */
export class Glixar {
    private renderer: Renderer;
    public readonly canvas: HTMLCanvasElement;

    /**
     * Crea una nueva instancia del motor Glixar.
     * @param canvasId El ID del elemento `<canvas>` en el DOM sobre el que se renderizará.
     */
    constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`No se encontró el canvas con id "${canvasId}"`);
        }
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
    }

    /**
     * Obtiene o crea una geometría a partir de un array de datos de vértices.
     * La geometría se guarda en una caché interna para su reutilización.
     * @param name Un nombre único para identificar esta geometría.
     * @param data Un Float32Array con los datos de los vértices intercalados.
     * @param componentCount El número de componentes por vértice (ej: 5 para X, Y, R, G, B).
     * @returns Una instancia de Geometry.
     */
    public createGeometry(name: string, data: Float32Array, componentCount: number): Geometry {
        return this.renderer.getOrCreateGeometry(name, data, componentCount);
    }

    /**
     * Obtiene o crea un programa de shaders a partir del código fuente.
     * Los shaders se compilan y se guardan en una caché interna para su reutilización.
     * @param name Un nombre único para identificar este shader.
     * @param vertexSrc El código fuente del Vertex Shader.
     * @param fragmentSrc El código fuente del Fragment Shader.
     * @returns Una instancia de Shader.
     */
    public createShader(name: string, vertexSrc: string, fragmentSrc: string): Shader {
        return this.renderer.getOrCreateShader(name, vertexSrc, fragmentSrc);
    }

    /**
     * Renderiza una escena completa usando una cámara específica.
     * @param scene Un array de objetos {@link SceneObject} para dibujar.
     * @param camera La {@link Camera2D} que define el punto de vista.
     */
    public render(scene: SceneObject[], camera: Camera2D): void {
        camera.update();
        this.renderer.clear();
        for (const sceneObject of scene) {
            this.renderer.draw(sceneObject, camera);
        }
    }
}
