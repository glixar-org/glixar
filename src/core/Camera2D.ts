// src/core/Camera2D.ts
import { mat4, vec3 } from 'gl-matrix';

export class Camera2D {
    public readonly projectionMatrix: mat4;
    public readonly viewMatrix: mat4;
    private position: vec3 = [0, 0, 1]; // Posición de la cámara (mirando hacia Z=0)
    private zoomLevel: number = 1.0;
    private dirty: boolean = true; // Flag para recalcular la matriz solo cuando sea necesario

    constructor(width: number, height: number) {
        this.projectionMatrix = mat4.create();
        this.viewMatrix = mat4.create();

        // Creamos una proyección ortográfica. Esto es como un lente sin perspectiva.
        // Mapea un área del mundo a la pantalla. Aquí, un área de 2x2 unidades.
        mat4.ortho(this.projectionMatrix, -1, 1, -1, 1, -1, 1);
    }

    /**
     * Actualiza la matriz de la cámara si ha habido cambios.
     */
    public update(): void {
        if (this.dirty) {
            const target = [this.position[0], this.position[1], 0]; // Hacia dónde mira
            const up = [0, 1, 0]; // El vector "arriba"

            mat4.lookAt(this.viewMatrix, this.position, target, up);
            mat4.scale(this.viewMatrix, this.viewMatrix, [this.zoomLevel, this.zoomLevel, 1]);

            this.dirty = false;
        }
    }

    /**
     * Establece el nivel de zoom de la cámara.
     * @param level Un valor > 0. Valores más pequeños alejan la cámara (más zoom out).
     */
    public zoom(level: number): void {
        this.zoomLevel = Math.max(0.01, level); // Evitar zoom cero o negativo
        this.dirty = true;
    }
}
