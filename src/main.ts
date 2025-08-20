// src/main.ts
import { Glixar } from './Glixar';
import { SceneObject } from './objects/SceneObject';
import { Camera2D } from './core/Camera2D';
import { basicVertexShader, basicFragmentShader } from './shaders/basic';
import Pbf from 'pbf';
import { VectorTile } from '@mapbox/vector-tile';
import { parsePointLayer } from './mvt/MvtParser';

function createTestTileBuffer(): ArrayBuffer {
  const pbfWriter = new Pbf();
  const layerWriter = new Pbf();
  layerWriter.writeVarintField(15, 2);
  layerWriter.writeStringField(1, "test_layer");
  const featureWriter = new Pbf();
  featureWriter.writeVarintField(3, 1);
  // MoveTo(2048, 2048) -> El centro exacto de la tesela
  featureWriter.writeBytesField(4, new Uint8Array([9, 4096, 4096]));
  layerWriter.writeBytesField(2, featureWriter.finish());
  pbfWriter.writeBytesField(3, layerWriter.finish());
  return pbfWriter.finish().buffer;
}

class MvtApp {
  private glixar: Glixar;
  private scene: SceneObject[] = [];
  private camera: Camera2D;

  constructor(canvasId: string) {
    this.glixar = new Glixar(canvasId);
    this.camera = new Camera2D(this.glixar.canvas.width, this.glixar.canvas.height);
    this.setupScene();
  }

  private setupScene(): void {
    const buffer = createTestTileBuffer();
    const tile = new VectorTile(new Pbf(buffer));
    const layer = tile.layers.test_layer;
    const pointVertices = parsePointLayer(layer);

    if (pointVertices.length > 0) {
      const pointsGeom = this.glixar.createGeometry('mvt_points', pointVertices, 5);
      const shader = this.glixar.createShader('basic', basicVertexShader, basicFragmentShader);
      const pointsObject = new SceneObject(pointsGeom, shader);
      this.scene.push(pointsObject);
    }
  }

  public start(): void {
    const animate = (time: number) => {
      // Un zoom más intuitivo que oscila entre 0.5x y 1.5x
      const zoom = 1.0 + Math.sin(time * 0.001) * 0.5;
      this.camera.zoom(zoom);

      this.glixar.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
}

try {
  const app = new MvtApp('glixar-canvas');
  app.start();
  console.log('Glixar Alpha: Renderizando geometría desde una Tesela Vectorial con cámara corregida.');
} catch (error) {
  console.error('No se pudo inicializar la app MVT de Glixar:', error);
}
