// src/types/vector-tile.d.ts
declare module '@mapbox/vector-tile' {
    import Pbf from 'pbf';

    export class VectorTile {
        constructor(pbf: Pbf);
        layers: { [name: string]: VectorTileLayer };
    }

    export class VectorTileLayer {
        length: number;
        feature(index: number): VectorTileFeature;
    }

    export class VectorTileFeature {
        id: number;
        type: 1 | 2 | 3; // Point, LineString, Polygon
        properties: { [key: string]: string | number | boolean };
        loadGeometry(): Array<Array<{ x: number; y: number }>>;
    }
}
