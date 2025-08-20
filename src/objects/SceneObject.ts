// src/objects/SceneObject.ts
import { Geometry } from '../core/Geometry';
import { Shader } from '../core/Shader';
import { mat4 } from 'gl-matrix';

/**
 * Represents a renderable object in the scene.
 * It encapsulates a geometry, a shader, and its own transformation matrix.
 */
export class SceneObject {
    /** The shape of the object. */
    public geometry: Geometry;
    /** The material or appearance of the object. */
    public shader: Shader;
    /** The matrix defining the object's position, rotation, and scale in the world. */
    public modelMatrix: mat4;

    /**
     * @param geometry The object's geometry.
     * @param shader The shader used to render the object.
     */
    constructor(geometry: Geometry, shader: Shader) {
        this.geometry = geometry;
        this.shader = shader;
        this.modelMatrix = mat4.create();
    }

    /**
     * Resets the transformation matrix to the identity matrix.
     * @returns The object instance for method chaining.
     */
    public setIdentity(): this {
        mat4.identity(this.modelMatrix);
        return this;
    }

    /**
     * Applies a translation to the object's matrix.
     * @returns The object instance for method chaining.
     */
    public translate(x: number, y: number, z: number): this {
        mat4.translate(this.modelMatrix, this.modelMatrix, [x, y, z]);
        return this;
    }

    /**
     * Applies a Z-axis rotation to the object's matrix.
     * @param radians The rotation angle in radians.
     * @returns The object instance for method chaining.
     */
    public rotateZ(radians: number): this {
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, radians);
        return this;
    }

    /**
     * Applies a scale to the object's matrix.
     * @returns The object instance for method chaining.
     */
    public scale(x: number, y: number, z: number): this {
        mat4.scale(this.modelMatrix, this.modelMatrix, [x, y, z]);
        return this;
    }
}
