// src/main.ts
import { Glixar } from './Glixar';
import { SceneObject } from './objects/SceneObject'; // Importamos la nueva clase
import { basicVertexShader, basicFragmentShader } from './shaders/basic';
import { mat4 } from 'gl-matrix';

class ExampleApp {
  private glixar: Glixar;
  private scene: SceneObject[] = []; // El array de la escena ahora contiene SceneObjects
  private rotatingObject: SceneObject | null = null;

  constructor(canvasId: string) {
    this.glixar = new Glixar(canvasId);
    this.setupScene();
  }

  private setupScene(): void {
    const mainTriangleData = new Float32Array([
      0.0, 0.5, 1.0, 0.0, 0.0, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, -0.5, 0.0,
      0.0, 1.0,
    ]);
    const smallTriangleData = new Float32Array([
      0.0, 0.2, 0.0, 1.0, 1.0, -0.2, -0.2, 1.0, 0.0, 1.0, 0.2, -0.2, 1.0,
      1.0, 0.0,
    ]);

    const mainTriangleGeom = this.glixar.createGeometry('main_triangle', mainTriangleData, 5);
    const smallTriangleGeom = this.glixar.createGeometry('small_triangle', smallTriangleData, 5);
    const basicShader = this.glixar.createShader('basic_color', basicVertexShader, basicFragmentShader);

    // Creamos instancias de SceneObject
    const staticTriangle = new SceneObject(mainTriangleGeom, basicShader);
    this.rotatingObject = new SceneObject(smallTriangleGeom, basicShader);

    // Aplicamos la transformación inicial al objeto que rotará
    mat4.translate(this.rotatingObject.modelMatrix, this.rotatingObject.modelMatrix, [-0.6, 0.6, 0]);

    // Añadimos los objetos a la escena
    this.scene.push(staticTriangle, this.rotatingObject);
  }

  public start(): void {
    requestAnimationFrame(this.update.bind(this));
  }

  private update(time: number): void {
    if (this.rotatingObject) {
      // Para una rotación continua, reseteamos la matriz a su posición y luego rotamos
      mat4.identity(this.rotatingObject.modelMatrix);
      mat4.translate(this.rotatingObject.modelMatrix, this.rotatingObject.modelMatrix, [-0.6, 0.6, 0]);
      mat4.rotateZ(this.rotatingObject.modelMatrix, this.rotatingObject.modelMatrix, time * 0.001);
    }

    this.glixar.render(this.scene);

    requestAnimationFrame(this.update.bind(this));
  }
}

try {
  const app = new ExampleApp('glixar-canvas');
  app.start();
  console.log('Glixar Alpha: Escena compuesta con SceneObjects.');
} catch (error) {
  console.error('No se pudo inicializar Glixar:', error);
}
