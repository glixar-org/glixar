// src/core/types.ts

import { Geometry } from './Geometry';
import { Shader } from './Shader';

/**
 * Representa un objeto en la escena que es renderizable.
 * Es la combinación de una forma (Geometry) y una apariencia (Shader).
 */
export interface Renderable {
    geometry: Geometry;
    shader: Shader;
}
