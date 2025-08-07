// src/main.ts
import { Renderer } from './core/Renderer';
import { Renderable } from './core/types';
import { basicVertexShader, basicFragmentShader } from './shaders/basic';
import { mat4 } from 'gl-matrix'; // ¡Importamos la herramienta de matrices!

try {
  // 1. Setup
  const canvas = document.getElementById('glixar-canvas') as HTMLCanvasElement;
  const renderer = new Renderer(canvas);

  // 2. Definición de Datos Crudos
  const mainTriangleData = new Float32Array([
    // Vértice superior (ROJO)
    0.0, 0.5, 1.0, 0.0, 0.0,
    // Vértice inferior izquierdo (VERDE)
    -0.5, -0.5, 0.0, 1.0, 0.0,
    // Vértice inferior derecho (AZUL)
    0.5, -0.5, 0.0, 0.0, 1.0,
  ]);

  const smallTriangleData = new Float32Array([
    // Vértice superior (CIAN)
    -0.7, 0.8, 0.0, 1.0, 1.0,
    // Vértice inferior izquierdo (MAGENTA)
    -0.9, 0.5, 1.0, 0.0, 1.0,
    // Vértice inferior derecho (AMARILLO)
    -0.5, 0.5, 1.0, 1.0, 0.0,
  ]);

  // 3. Creación de Recursos a través del Renderer
  const mainTriangleGeom = renderer.getOrCreateGeometry('main_triangle', mainTriangleData, 5);
  const smallTriangleGeom = renderer.getOrCreateGeometry('small_triangle', smallTriangleData, 5);
  const basicShader = renderer.getOrCreateShader('basic_color', basicVertexShader, basicFragmentShader);

  // 4. Creación de las Matrices de Modelo
  // Matriz para el triángulo grande: no se mueve (matriz identidad)
  const mainTriangleMatrix = mat4.create();

  // Matriz para el triángulo pequeño: lo moveremos y rotaremos
  const smallTriangleMatrix = mat4.create();
  mat4.translate(smallTriangleMatrix, smallTriangleMatrix, [-0.6, -0.4, 0]); // Mover a la izquierda y abajo
  mat4.rotateZ(smallTriangleMatrix, smallTriangleMatrix, Math.PI / 4); // Rotar 45 grados
  mat4.scale(smallTriangleMatrix, smallTriangleMatrix, [0.7, 0.7, 1.0]); // Hacerlo 70% más pequeño

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
