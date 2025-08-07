// src/core/types.ts
import { mat4 } from 'gl-matrix'; // IMPORTANTE: Añadir esta importación
import { Geometry } from './Geometry';
import { Shader } from './Shader';

export interface Renderable {
    geometry: Geometry;
    shader: Shader;
    modelMatrix: mat4;
}
