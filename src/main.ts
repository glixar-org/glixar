// src/main.ts
import { Glixar } from './Glixar';
import { SceneObject } from './objects/SceneObject';
import { basicVertexShader, basicFragmentShader } from './shaders/basic';
// Ya no necesitamos importar 'mat4' aquí. ¡La librería lo oculta!

class ExampleApp {
  private glixar: Glixar;
  private scene: SceneObject[] = [];
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

    const staticTriangle = new SceneObject(mainTriangleGeom, basicShader);
    this.rotatingObject = new SceneObject(smallTriangleGeom, basicShader);

    // Usamos la nueva API para la transformación inicial. ¡Mucho más limpio!
    this.rotatingObject.translate(-0.6, 0.6, 0);

    this.scene.push(staticTriangle, this.rotatingObject);
  }

  public start(): void {
    requestAnimationFrame(this.update.bind(this));
  }

  private update(time: number): void {
    if (this.rotatingObject) {
      // La animación ahora es una elegante cadena de métodos.
      this.rotatingObject
          .setIdentity()
          .translate(-0.6, 0.6, 0)
          .rotateZ(time * 0.001);
    }

    this.glixar.render(this.scene);

    requestAnimationFrame(this.update.bind(this));
  }
}

try {
  const app = new ExampleApp('glixar-canvas');
  app.start();
  console.log('Glixar Alpha: API de transformación fluida activada.');
} catch (error) {
  console.error('No se pudo inicializar Glixar:', error);
}
