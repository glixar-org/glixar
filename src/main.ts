// src/main.ts
import { Renderer } from './core/Renderer';

try {
  const canvas = document.getElementById('glixar-canvas') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('No se encontró el canvas con id "glixar-canvas"');
  }

  // Se crea una instancia del motor
  const renderer = new Renderer(canvas);

  // Se le da una sola orden: "Renderiza la escena"
  renderer.renderScene();

  console.log('Glixar Alpha: Bucle principal ejecutado.');
} catch (error) {
  console.error('No se pudo inicializar o renderizar con Glixar:', error);
}
