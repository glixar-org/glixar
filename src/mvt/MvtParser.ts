// src/mvt/MvtParser.ts
import type { VectorTileLayer } from '@mapbox/vector-tile';

const TILE_EXTENT = 4096; // El tamaño estándar de la cuadrícula de una tesela MVT

/**
 * Procesa una capa de una tesela vectorial y extrae las geometrías de PUNTOS.
 * @param layer La capa de la tesela a procesar.
 * @returns Un Float32Array con los vértices para renderizar cada punto como un cuadrado.
 */
export function parsePointLayer(layer: VectorTileLayer): Float32Array {
    const vertices: number[] = [];
    const pointSize = 200; // Tamaño del cuadrado que representará el punto (en unidades de tesela)

    for (let i = 0; i < layer.length; i++) {
        const feature = layer.feature(i);

        // Solo nos interesan las características de tipo Punto (type === 1)
        if (feature.type !== 1) {
            continue;
        }

        const geometry = feature.loadGeometry();
        for (const point of geometry) {
            const x = point[0].x;
            const y = point[0].y;

            // Normalizamos las coordenadas del espacio de la tesela (0-4096)
            // a nuestro espacio de clip de WebGL (-1.0 a +1.0).
            const normX = (x / TILE_EXTENT) * 2 - 1;
            const normY = (y / TILE_EXTENT) * -2 + 1; // El eje Y está invertido

            const halfSize = (pointSize / TILE_EXTENT);

            // Creamos un cuadrado (dos triángulos) para representar el punto
            const x1 = normX - halfSize;
            const y1 = normY - halfSize;
            const x2 = normX + halfSize;
            const y2 = normY + halfSize;
            const color = [1.0, 1.0, 1.0]; // Color blanco

            // Triángulo 1
            vertices.push(x1, y1, ...color);
            vertices.push(x2, y1, ...color);
            vertices.push(x1, y2, ...color);

            // Triángulo 2
            vertices.push(x1, y2, ...color);
            vertices.push(x2, y1, ...color);
            vertices.push(x2, y2, ...color);
        }
    }

    return new Float32Array(vertices);
}
