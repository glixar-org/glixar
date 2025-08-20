// src/main.ts
import Pbf from 'pbf';
import { VectorTile } from '@mapbox/vector-tile';

/**
 * Fabrica un buffer de una tesela vectorial mínima y válida.
 * Esta versión está corregida para usar la API de 'pbf' correctamente.
 */
function createTestTileBuffer(): ArrayBuffer {
  const pbfWriter = new Pbf(); // La tesela principal

  // 1. Construir el mensaje de la Característica (Feature)
  const featureWriter = new Pbf();
  featureWriter.writeVarintField(3, 1); // type = 1 (Point)
  featureWriter.writeBytesField(4, new Uint8Array([9, 50, 50])); // geometry: MoveTo(25,25)
  const featureBuffer = featureWriter.finish();

  // 2. Construir el mensaje de la Capa (Layer)
  const layerWriter = new Pbf();
  layerWriter.writeVarintField(15, 2); // version
  layerWriter.writeStringField(1, "test_layer"); // name
  // Añadimos el buffer del feature como un campo de bytes (tag = 2)
  layerWriter.writeBytesField(2, featureBuffer);
  const layerBuffer = layerWriter.finish();

  // 3. Añadir el buffer de la capa a la tesela principal (tag = 3)
  pbfWriter.writeBytesField(3, layerBuffer);

  return pbfWriter.finish().buffer;
}

async function inspectVectorTile() {
  try {
    console.log('Iniciando misión de reconocimiento (Fabricación Interna Correcta)...');

    // 1. Fabricamos nuestros datos binarios.
    const buffer = createTestTileBuffer();
    console.log(`Tesela fabricada en memoria. ${buffer.byteLength} bytes.`);

    // 2. Decodificamos
    const tile = new VectorTile(new Pbf(buffer));

    // 3. Interrogamos la tesela y mostramos su contenido
    console.log('--- INFORME DE INTELIGENCIA ---');
    console.log('Tesela decodificada con éxito.');
    console.log('Capas encontradas:', Object.keys(tile.layers));

    const layerName = "test_layer";
    if (tile.layers[layerName]) {
      const layer = tile.layers[layerName];
      console.log(`\n--- Inspeccionando capa "${layerName}" (${layer.length} características) ---`);

      if (layer.length > 0) {
        const feature = layer.feature(0);
        console.log('Primera característica:', {
          type: feature.type,
          properties: feature.properties,
          geometry: feature.loadGeometry(),
        });
      }
    }

    console.log('\n--- FIN DEL INFORME ---');

  } catch (error) {
    console.error('La misión de reconocimiento ha fallado:', error);
  }
}

inspectVectorTile();
