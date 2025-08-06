// src/main.ts
import { Renderer } from './core/Renderer';
import { basicVertexShader, basicFragmentShader } from './shaders/basic';

try {
  // 1. Setup
  const canvas = document.getElementById('glixar-canvas') as HTMLCanvasElement;
  const renderer = new Renderer(canvas);

  // 2. Definición de Datos Crudos
  // Estos son solo números en un array. No hay objetos de WebGL aquí.
  const triangleVertices = new Float32Array([
    0.0,  0.5, // Vértice superior
    -0.5, -0.5, // Vértice inferior izquierdo
    0.5, -0.5, // Vértice inferior derecho
  ]);

  // 3. Creación de Recursos a través del Renderer
  // Le pedimos al renderer que cree/obtenga los objetos de la GPU.
  const triangleGeometry = renderer.getOrCreateGeometry('triangle', triangleVertices);
  const basicShader = renderer.getOrCreateShader('basic', basicVertexShader, basicFragmentShader);

  // 4. Renderizado
  // Le decimos al renderer qué objetos dibujar.
  renderer.draw(triangleGeometry, basicShader);

  console.log('Glixar Alpha: Geometría y shader obtenidos desde el gestor.');

} catch (error) {
  console.error('No se pudo inicializar o renderizar con Glixar:', error);
}
