// src/objects/SceneObject.ts
import { Geometry } from '../core/Geometry';
import { Shader } from '../core/Shader';
import { mat4 } from 'gl-matrix';

/**
 * Representa un objeto renderizable en la escena.
 * Encapsula una geometría, un shader y su propia matriz de transformación.
 */
export class SceneObject {
    /** La forma del objeto. */
    public geometry: Geometry;
    /** El material o apariencia del objeto. */
    public shader: Shader;
    /** La matriz que define la posición, rotación y escala del objeto en el mundo. */
    public modelMatrix: mat4;

    /**
     * @param geometry La geometría del objeto.
     * @param shader El shader que se usará para renderizar el objeto.
     */
    constructor(geometry: Geometry, shader: Shader) {
        this.geometry = geometry;
        this.shader = shader;
        this.modelMatrix = mat4.create();
    }

    /**
     * Resetea la matriz de transformación a la matriz identidad.
     * @returns La instancia del objeto para encadenar métodos.
     */
    public setIdentity(): this {
        mat4.identity(this.modelMatrix);
        return this;
    }

    /**
     * Aplica una traslación a la matriz del objeto.
     * @returns La instancia del objeto para encadenar métodos.
     */
    public translate(x: number, y: number, z: number): this {
        mat4.translate(this.modelMatrix, this.modelMatrix, [x, y, z]);
        return this;
    }

    /**
     * Aplica una rotación en el eje Z a la matriz del objeto.
     * @param radians El ángulo de rotación en radianes.
     * @returns La instancia del objeto para encadenar métodos.
     */
    public rotateZ(radians: number): this {
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, radians);
        return this;
    }

    /**
     * Aplica una escala a la matriz del objeto.
     * @returns La instancia del objeto para encadenar métodos.
     */
    public scale(x: number, y: number, z: number): this {
        mat4.scale(this.modelMatrix, this.modelMatrix, [x, y, z]);
        return this;
    }
}
