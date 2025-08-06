// src/main.ts
import { Renderer } from './core/Renderer';
import { Renderable } from './core/types';
import { basicVertexShader, basicFragmentShader } from './shaders/basic';

try {
  // 1. Setup
  const canvas = document.getElementById('glixar-canvas') as HTMLCanvasElement;
  const renderer = new Renderer(canvas);

  // 2. Definición de Datos y Recursos
  // Datos para nuestro primer triángulo (grande)
  const mainTriangleVertices = new Float32Array([
    0.0, 0.5, -0.5, -0.5, 0.5, -0.5,
  ]);
  // Datos para un segundo triángulo (pequeño, a la izquierda)
  const smallTriangleVertices = new Float32Array([
    -0.7, 0.8, -0.9, 0.5, -0.5, 0.5,
  ]);

  // Obtenemos los recursos de la GPU a través del renderer
  const mainTriangleGeom = renderer.getOrCreateGeometry('main_triangle', mainTriangleVertices);
  const smallTriangleGeom = renderer.getOrCreateGeometry('small_triangle', smallTriangleVertices);
  const basicShader = renderer.getOrCreateShader('basic', basicVertexShader, basicFragmentShader);

  // 3. Creación de la Escena
  // Una escena es simplemente una lista de objetos renderizables.
  const scene: Renderable[] = [
    { geometry: mainTriangleGeom, shader: basicShader },
    { geometry: smallTriangleGeom, shader: basicShader },
  ];

  // 4. El Bucle de Renderizado
  // Limpiamos el lienzo UNA SOLA VEZ.
  renderer.clear();

  // Recorremos la escena y dibujamos cada objeto.
  for (const renderable of scene) {
    renderer.draw(renderable);
  }

  console.log('Glixar Alpha: Escena con múltiples objetos renderizada.');
} catch (error) {
  console.error('No se pudo inicializar o renderizar con Glixar:', error);
}
