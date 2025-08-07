// src/objects/SceneObject.ts
import { Geometry } from '../core/Geometry';
import { Shader } from '../core/Shader';
import { mat4 } from 'gl-matrix';

export class SceneObject {
    public geometry: Geometry;
    public shader: Shader;
    public modelMatrix: mat4;

    constructor(geometry: Geometry, shader: Shader) {
        this.geometry = geometry;
        this.shader = shader;
        // Cada objeto se inicializa con su propia matriz de transformación.
        this.modelMatrix = mat4.create();
    }
}
