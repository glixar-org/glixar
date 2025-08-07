// src/main.ts
import { Glixar } from './Glixar';
import { SceneObject } from './objects/SceneObject';
import { basicVertexShader, basicFragmentShader } from './shaders/basic';
// Importamos nuestro generador de geometría desde Wasm
import init, { generate_hexagon } from './wasm-pkg';

class WasmApp {
  private glixar: Glixar;
  private scene: SceneObject[] = [];
  private rotatingObject: SceneObject | null = null;

  private constructor(canvasId: string) {
    this.glixar = new Glixar(canvasId);
  }

  /**
   * Método de fábrica asíncrono para inicializar Wasm y la escena.
   */
  public static async create(canvasId: string): Promise<WasmApp> {
    // Inicializamos el módulo Wasm primero
    await init();
    console.log('Módulo Wasm inicializado para la generación de geometría.');

    const app = new WasmApp(canvasId);
    app.setupScene();
    return app;
  }

  private setupScene(): void {
    // ¡Llamamos a Rust para obtener los datos de nuestros vértices!
    const hexagonData = generate_hexagon(0.7); // 0.7 es el radio

    const hexagonGeom = this.glixar.createGeometry(
        'wasm_hexagon',
        hexagonData,
        5 // Siguen siendo 5 componentes: X, Y, R, G, B
    );
    const basicShader = this.glixar.createShader(
        'basic_color',
        basicVertexShader,
        basicFragmentShader
    );

    this.rotatingObject = new SceneObject(hexagonGeom, basicShader);
    this.scene.push(this.rotatingObject);
  }

  public start(): void {
    requestAnimationFrame(this.update.bind(this));
  }

  private update(time: number): void {
    if (this.rotatingObject) {
      this.rotatingObject
          .setIdentity()
          .rotateZ(time * 0.0005); // Lo hacemos rotar un poco más lento
    }

    this.glixar.render(this.scene);
    requestAnimationFrame(this.update.bind(this));
  }
}

// El punto de entrada ahora es asíncrono para esperar a Wasm.
async function main() {
  try {
    const app = await WasmApp.create('glixar-canvas');
    app.start();
    console.log('Glixar Alpha: Escena con geometría generada por Wasm.');
  } catch (error) {
    console.error('No se pudo inicializar Glixar con Wasm:', error);
  }
}

main();
