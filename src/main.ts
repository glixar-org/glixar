// src/main.ts
import { Renderer } from './core/Renderer';
import { Renderable } from './core/types';
import { basicVertexShader, basicFragmentShader } from './shaders/basic';
import { mat4 } from 'gl-matrix';

// --- Contenedor Principal de la Aplicación Glixar ---
class GlixarApp {
  private renderer: Renderer;
  private scene: Renderable[] = [];
  private smallTriangleMatrix: mat4;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.setupScene();
    this.smallTriangleMatrix = this.scene[1]?.modelMatrix ?? mat4.create();
  }

  /**
   * Configura todos los recursos iniciales de la escena.
   */
  private setupScene(): void {
    // Definición de Datos Crudos
    const mainTriangleData = new Float32Array([
      0.0, 0.5, 1.0, 0.0, 0.0, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, -0.5, 0.0,
      0.0, 1.0,
    ]);
    const smallTriangleData = new Float32Array([
      0.0, 0.2, 0.0, 1.0, 1.0, -0.2, -0.2, 1.0, 0.0, 1.0, 0.2, -0.2, 1.0,
      1.0, 0.0,
    ]);

    // Creación de Recursos
    const mainTriangleGeom = this.renderer.getOrCreateGeometry('main_triangle', mainTriangleData, 5);
    const smallTriangleGeom = this.renderer.getOrCreateGeometry('small_triangle', smallTriangleData, 5);
    const basicShader = this.renderer.getOrCreateShader('basic_color', basicVertexShader, basicFragmentShader);

    // Creación de Matrices
    const mainTriangleMatrix = mat4.create();
    const smallTriangleMatrix = mat4.create();
    mat4.translate(smallTriangleMatrix, smallTriangleMatrix, [-0.6, 0.6, 0]);

    // Composición de la Escena
    this.scene.push(
        { geometry: mainTriangleGeom, shader: basicShader, modelMatrix: mainTriangleMatrix },
        { geometry: smallTriangleGeom, shader: basicShader, modelMatrix: smallTriangleMatrix }
    );
  }

  /**
   * Inicia el bucle de animación.
   */
  public start(): void {
    // Usamos .bind(this) para asegurar que 'this' dentro de 'update' se refiera a nuestra clase.
    requestAnimationFrame(this.update.bind(this));
  }

  /**
   * El corazón de la aplicación, se ejecuta en cada frame.
   * @param time El tiempo en milisegundos proporcionado por requestAnimationFrame.
   */
  private update(time: number): void {
    // --- Lógica de Actualización de la Escena ---
    // Rotamos la matriz del triángulo pequeño en cada frame.
    // Usamos el 'time' para que la velocidad de rotación sea constante.
    mat4.identity(this.smallTriangleMatrix); // Reseteamos la matriz
    mat4.translate(this.smallTriangleMatrix, this.smallTriangleMatrix, [-0.6, 0.6, 0]); // La volvemos a trasladar
    mat4.rotateZ(this.smallTriangleMatrix, this.smallTriangleMatrix, time * 0.001); // Y la rotamos según el tiempo

    // --- Lógica de Renderizado ---
    this.renderer.clear();
    for (const renderable of this.scene) {
      this.renderer.draw(renderable);
    }

    // Solicitamos al navegador que vuelva a llamar a 'update' en el siguiente frame.
    requestAnimationFrame(this.update.bind(this));
  }
}

// --- Punto de Entrada de la Aplicación ---
try {
  const canvas = document.getElementById('glixar-canvas') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('No se encontró el canvas con id "glixar-canvas"');
  }

  // Creamos e iniciamos nuestra aplicación.
  const app = new GlixarApp(canvas);
  app.start();

  console.log('Glixar Alpha: Bucle de animación iniciado.');
} catch (error) {
  console.error('No se pudo inicializar o renderizar con Glixar:', error);
}
