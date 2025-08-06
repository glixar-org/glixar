// src/shaders/basic.ts

// El Vertex Shader se ejecuta por cada vértice (esquina) de nuestra forma.
// Su trabajo principal es calcular la posición final del vértice en la pantalla.
export const basicVertexShader = `
  // 'attribute' es un input que viene desde un buffer de datos.
  // vec2 significa que es un vector de 2 componentes (x, y).
  attribute vec2 a_position;

  void main() {
    // gl_Position es una variable especial que indica la posición final.
    // Lo convertimos de 2D (x,y) a 4D (x,y,z,w) como requiere WebGL.
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// El Fragment Shader se ejecuta por cada píxel dentro de nuestra forma.
// Su trabajo es decidir el color de ese píxel.
export const basicFragmentShader = `
  // 'precision' define la precisión de los números de punto flotante.
  precision mediump float;

  void main() {
    // gl_FragColor es una variable especial que establece el color del píxel.
    // Usamos un color naranja (R, G, B, A).
    gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);
  }
`;
