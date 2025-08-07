// src/main.ts
import { Glixar } from './Glixar';
import { SceneObject } from './objects/SceneObject';
import { Camera2D } from './core/Camera2D';
import { basicVertexShader, basicFragmentShader } from './shaders/basic';
import init, { generate_hexagon } from './wasm-pkg';

class CameraApp {
  private glixar: Glixar;
  private scene: SceneObject[] = [];
  private camera: Camera2D;
  private rotatingObject: SceneObject | null = null;

  private constructor(glixar: Glixar) {
    this.glixar = glixar;
    // Creamos una cámara pasándole las dimensiones del canvas
    this.camera = new Camera2D(glixar.canvas.width, glixar.canvas.height);
    this.setupScene();
  }

  public static async create(canvasId: string): Promise<CameraApp> {
    await init();
    const glixar = new Glixar(canvasId);
    return new CameraApp(glixar);
  }

  private setupScene(): void {
    const hexagonData = generate_hexagon(0.7);
    const hexagonGeom = this.glixar.createGeometry('wasm_hexagon', hexagonData, 5);
    const basicShader = this.glixar.createShader('basic_color', basicVertexShader, basicFragmentShader);
    this.rotatingObject = new SceneObject(hexagonGeom, basicShader);
    this.scene.push(this.rotatingObject);
  }

  public start(): void {
    requestAnimationFrame(this.update.bind(this));
  }

  private update(time: number): void {
    if (this.rotatingObject) {
      this.rotatingObject.setIdentity().rotateZ(time * 0.0005);
    }

    // Animamos la cámara con un efecto de zoom pulsante
    const zoom = 1.5 + Math.sin(time * 0.001) * 0.5;
    this.camera.zoom(zoom);

    // Pasamos la escena y la cámara al método render
    this.glixar.render(this.scene, this.camera);

    requestAnimationFrame(this.update.bind(this));
  }
}

async function main() {
  try {
    const app = await CameraApp.create('glixar-canvas');
    app.start();
    console.log('Glixar Alpha: Cámara 2D activa.');
  } catch (error) {
    console.error('No se pudo inicializar Glixar:', error);
  }
}

main();
