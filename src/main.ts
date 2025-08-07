// src/main.ts
import { Glixar } from './Glixar'; // IMPORTAMOS LA NUEVA CLASE PRINCIPAL
import { Renderable } from './core/types';
import { basicVertexShader, basicFragmentShader } from './shaders/basic';
import { mat4 } from 'gl-matrix';

// --- La aplicación de ejemplo que USA la librería Glixar ---
class ExampleApp {
  private glixar: Glixar;
  private scene: Renderable[] = [];
  private smallTriangleMatrix: mat4;

  constructor(canvasId: string) {
    // El usuario solo necesita instanciar Glixar, ¡toda la complejidad está oculta!
    this.glixar = new Glixar(canvasId);
    this.setupScene();
    this.smallTriangleMatrix = this.scene[1]?.modelMatrix ?? mat4.create();
  }

  private setupScene(): void {
    // Definición de datos
    const mainTriangleData = new Float32Array([
      0.0, 0.5, 1.0, 0.0, 0.0, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, -0.5, 0.0,
      0.0, 1.0,
    ]);
    const smallTriangleData = new Float32Array([
      0.0, 0.2, 0.0, 1.0, 1.0, -0.2, -0.2, 1.0, 0.0, 1.0, 0.2, -0.2, 1.0,
      1.0, 0.0,
    ]);

    // El usuario interactúa con la API de Glixar, no con el renderer.
    const mainTriangleGeom = this.glixar.createGeometry('main_triangle', mainTriangleData, 5);
    const smallTriangleGeom = this.glixar.createGeometry('small_triangle', smallTriangleData, 5);
    const basicShader = this.glixar.createShader('basic_color', basicVertexShader, basicFragmentShader);

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

  public start(): void {
    requestAnimationFrame(this.update.bind(this));
  }

  private update(time: number): void {
    // Actualizamos la matriz de nuestro objeto
    mat4.identity(this.smallTriangleMatrix);
    mat4.translate(this.smallTriangleMatrix, this.smallTriangleMatrix, [-0.6, 0.6, 0]);
    mat4.rotateZ(this.smallTriangleMatrix, this.smallTriangleMatrix, time * 0.001);

    // Le pasamos toda la escena a Glixar para que la renderice.
    this.glixar.render(this.scene);

    requestAnimationFrame(this.update.bind(this));
  }
}

// --- Punto de Entrada ---
try {
  const app = new ExampleApp('glixar-canvas');
  app.start();
  console.log('Glixar Alpha: Aplicación iniciada usando la nueva API pública.');
} catch (error) {
  console.error('No se pudo inicializar Glixar:', error);
}
