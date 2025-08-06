// src/main.ts
import { Renderer } from './core/Renderer';
import { Renderable } from './core/types';
import { basicVertexShader, basicFragmentShader } from './shaders/basic';

try {
  // 1. Setup
  const canvas = document.getElementById('glixar-canvas') as HTMLCanvasElement;
  const renderer = new Renderer(canvas);

  // 2. Definición de Datos con Color Intercalado (X, Y, R, G, B)
  const mainTriangleData = new Float32Array([
    // Vértice superior (ROJO)
    0.0,  0.5,   1.0, 0.0, 0.0,
    // Vértice inferior izquierdo (VERDE)
    -0.5, -0.5,   0.0, 1.0, 0.0,
    // Vértice inferior derecho (AZUL)
    0.5, -0.5,   0.0, 0.0, 1.0,
  ]);

  const smallTriangleData = new Float32Array([
    // Vértice superior (CIAN)
    -0.7, 0.8,   0.0, 1.0, 1.0,
    // Vértice inferior izquierdo (MAGENTA)
    -0.9, 0.5,   1.0, 0.0, 1.0,
    // Vértice inferior derecho (AMARILLO)
    -0.5, 0.5,   1.0, 1.0, 0.0,
  ]);

// 3. Creación de Recursos
  const vertexComponentCount = 5; // X, Y, R, G, B
  const mainTriangleGeom = renderer.getOrCreateGeometry(
      'main_triangle',
      mainTriangleData,
      vertexComponentCount // Le decimos cuántos componentes tiene cada vértice
  );
  const smallTriangleGeom = renderer.getOrCreateGeometry(
      'small_triangle',
      smallTriangleData,
      vertexComponentCount // Hacemos lo mismo para la otra geometría
  );
  const basicShader = renderer.getOrCreateShader(
      'basic_color',
      basicVertexShader,
      basicFragmentShader
  );

  // 4. Creación de la Escena
  const scene: Renderable[] = [
    { geometry: mainTriangleGeom, shader: basicShader },
    { geometry: smallTriangleGeom, shader: basicShader },
  ];

  // 5. El Bucle de Renderizado
  renderer.clear();
  for (const renderable of scene) {
    renderer.draw(renderable);
  }

  console.log('Glixar Alpha: Renderizado con colores por vértice.');
} catch (error) {
  console.error('No se pudo inicializar o renderizar con Glixar:', error);
}
