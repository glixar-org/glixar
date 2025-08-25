// src/main.ts
import { Glixar } from './Glixar';
import { SceneObject } from './objects/SceneObject';
import { Camera2D } from './core/Camera2D';
import { basicVertexShader, basicFragmentShader } from './shaders/basic';
// Importamos DIRECTAMENTE desde el archivo generado por wasm-pack. La ruta es precisa.
import init, { get_polygon_vertices, get_polygon_indices } from '../glixar-wasm/pkg/glixar_wasm.js';

class WasmPolygonApp {
  private glixar: Glixar;
  private scene: SceneObject[] = [];
  private camera: Camera2D;

  private constructor(glixar: Glixar) {
    this.glixar = glixar;
    this.camera = new Camera2D(glixar.canvas.width, glixar.canvas.height);
    this.setupScene();
  }

  public static async create(canvasId: string): Promise<WasmPolygonApp> {
    // La inicialización ahora necesita la URL del binario .wasm que está junto al JS.
    await init(new URL('../glixar-wasm/pkg/glixar_wasm_bg.wasm', import.meta.url));
    console.log('Módulo Wasm inicializado manualmente.');
    const glixar = new Glixar(canvasId);
    return new WasmPolygonApp(glixar);
  }

  private setupScene(): void {
    const radius = 0.8;
    const sides = 7;

    const verticesData = get_polygon_vertices(radius, sides);
    const indicesData = get_polygon_indices(radius, sides);

    const vertices = new Float32Array(verticesData);
    const indices = new Uint16Array(indicesData);

    const polygonGeom = this.glixar.createGeometry('wasm_polygon', vertices, 5, indices);
    const shader = this.glixar.createShader('basic', basicVertexShader, basicFragmentShader);
    const polygonObject = new SceneObject(polygonGeom, shader);
    this.scene.push(polygonObject);
  }

  public start(): void {
    const animate = (time: number) => {
      if (this.scene.length > 0) {
        this.scene[0].setIdentity().rotateZ(time * 0.0005);
      }
      this.camera.zoom(1.0);
      this.glixar.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
}

async function main() {
  try {
    const app = await WasmPolygonApp.create('glixar-canvas');
    app.start();
    console.log('Glixar Alpha: Renderizando con el Puente Manual a Wasm.');
  } catch (error) {
    console.error('No se pudo inicializar la app Wasm de Glixar:', error);
  }
}

main();
