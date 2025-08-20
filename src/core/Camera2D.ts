// src/core/Camera2D.ts
import { mat4, vec3 } from 'gl-matrix';

export class Camera2D {
    public readonly projectionMatrix: mat4;
    public readonly viewMatrix: mat4;

    private position: vec3;
    private target: vec3;
    private up: vec3;

    private zoomLevel: number = 1.0;
    private dirty: boolean = true;
    private projectionDirty: boolean = true;
    private aspectRatio: number = 1.0;

    constructor(width: number, height: number) {
        this.projectionMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.aspectRatio = width / height;

        this.position = vec3.fromValues(0, 0, 1);
        this.target = vec3.fromValues(0, 0, 0);
        this.up = vec3.fromValues(0, 1, 0);

        this.updateProjection();
        this.updateView();
    }

    private updateProjection(): void {
        if (this.projectionDirty) {
            // El zoom ahora controla los límites de la proyección ortográfica.
            // Un zoom más grande hace que el área visible sea más pequeña, creando un "zoom in".
            const left = -this.aspectRatio / this.zoomLevel;
            const right = this.aspectRatio / this.zoomLevel;
            const bottom = -1 / this.zoomLevel;
            const top = 1 / this.zoomLevel;
            mat4.ortho(this.projectionMatrix, left, right, bottom, top, -1, 1);
            this.projectionDirty = false;
        }
    }

    private updateView(): void {
        if (this.dirty) {
            this.target[0] = this.position[0];
            this.target[1] = this.position[1];
            mat4.lookAt(this.viewMatrix, this.position, this.target, this.up);
            this.dirty = false;
        }
    }

    /**
     * Actualiza las matrices de la cámara si ha habido cambios.
     */
    public update(): void {
        this.updateProjection();
        this.updateView();
    }

    /**
     * Establece el nivel de zoom de la cámara.
     * @param level Un valor > 0. Valores mayores a 1 acercan la cámara (zoom in).
     */
    public zoom(level: number): void {
        this.zoomLevel = Math.max(0.01, level);
        this.projectionDirty = true;
    }
}
