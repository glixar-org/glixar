// src/core/Camera2D.ts
import { mat4, vec3 } from 'gl-matrix';

export class Camera2D {
    public readonly projectionMatrix: mat4;
    public readonly viewMatrix: mat4;

    // Usamos el tipo 'vec3' de gl-matrix para nuestras propiedades
    private position: vec3;
    private target: vec3;
    private up: vec3;

    private zoomLevel: number = 1.0;
    private dirty: boolean = true;

    constructor(width: number, height: number) {
        this.projectionMatrix = mat4.create();
        this.viewMatrix = mat4.create();

        // Inicializamos nuestros vectores con el tipo correcto
        this.position = vec3.fromValues(0, 0, 1);
        this.target = vec3.fromValues(0, 0, 0);
        this.up = vec3.fromValues(0, 1, 0);

        mat4.ortho(this.projectionMatrix, -1, 1, -1, 1, -1, 1);
    }

    /**
     * Actualiza la matriz de la cámara si ha habido cambios.
     */
    public update(): void {
        if (this.dirty) {
            // Actualizamos el 'target' para que siempre mire al mismo plano X,Y que la cámara
            this.target[0] = this.position[0];
            this.target[1] = this.position[1];

            // Ahora todos los argumentos son del tipo 'vec3' correcto
            mat4.lookAt(this.viewMatrix, this.position, this.target, this.up);
            mat4.scale(this.viewMatrix, this.viewMatrix, [this.zoomLevel, this.zoomLevel, 1]);

            this.dirty = false;
        }
    }

    /**
     * Establece el nivel de zoom de la cámara.
     * @param level Un valor > 0. Valores más pequeños alejan la cámara (más zoom out).
     */
    public zoom(level: number): void {
        this.zoomLevel = Math.max(0.01, level);
        this.dirty = true;
    }
}
