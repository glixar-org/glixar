// src/main.ts
import { Renderer } from './core/Renderer';
import { Renderable } from './core/types';
import { basicVertexShader, basicFragmentShader } from './shaders/basic';
import { mat4 } from 'gl-matrix';

try {
  // 1. Setup
  const canvas = document.getElementById('glixar-canvas') as HTMLCanvasElement;
  const renderer = new Renderer(canvas);

  // 2. Definición de Datos Crudos
  // El triángulo principal no cambia.
  const mainTriangleData = new Float32Array([
    0.0, 0.5, 1.0, 0.0, 0.0,
    -0.5, -0.5, 0.0, 1.0, 0.0,
    0.5, -0.5, 0.0, 0.0, 1.0,
  ]);

  // CORRECCIÓN: Redefinimos el triángulo pequeño alrededor del origen (0,0)
  const smallTriangleData = new Float32Array([
    // Vértice superior (CIAN)
    0.0,  0.2,   0.0, 1.0, 1.0,
    // Vértice inferior izquierdo (MAGENTA)
    -0.2, -0.2,   1.0, 0.0, 1.0,
    // Vértice inferior derecho (AMARILLO)
    0.2, -0.2,   1.0, 1.0, 0.0,
  ]);

  // 3. Creación de Recursos
  const mainTriangleGeom = renderer.getOrCreateGeometry('main_triangle', mainTriangleData, 5);
  const smallTriangleGeom = renderer.getOrCreateGeometry('small_triangle', smallTriangleData, 5);
  const basicShader = renderer.getOrCreateShader('basic_color', basicVertexShader, basicFragmentShader);

  // 4. Creación de las Matrices de Modelo
  // Matriz para el triángulo grande: identidad (sin transformación).
  const mainTriangleMatrix = mat4.create();

  // CORRECIÓN: Matriz para el triángulo pequeño. Ahora es más simple y predecible.
  const smallTriangleMatrix = mat4.create();
  // Solo lo movemos a una posición segura y visible en la esquina superior izquierda.
  mat4.translate(smallTriangleMatrix, smallTriangleMatrix, [-0.6, 0.6, 0]);

  // 5. Creación de la Escena
  const scene: Renderable[] = [
    {
      geometry: mainTriangleGeom,
      shader: basicShader,
      modelMatrix: mainTriangleMatrix,
    },
    {
      geometry: smallTriangleGeom,
      shader: basicShader,
      modelMatrix: smallTriangleMatrix,
    },
  ];

  // 6. El Bucle de Renderizado
  renderer.clear();
  for (const renderable of scene) {
    renderer.draw(renderable);
  }

  console.log('Glixar Alpha: ¡Objetos transformados con matrices!');
} catch (error) {
  console.error('No se pudo inicializar o renderizar con Glixar:', error);
}
