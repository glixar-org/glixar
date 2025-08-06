// src/shaders/basic.ts

export const basicVertexShader = `
  attribute vec2 a_position;
  attribute vec3 a_color; // NUEVO: Atributo para el color del vértice (R, G, B)

  varying vec3 v_color; // NUEVO: "Varying" para pasar el color al fragment shader

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_color = a_color; // Pasamos el color del atributo al varying
  }
`;

export const basicFragmentShader = `
  precision mediump float;

  varying vec3 v_color; // NUEVO: Recibimos el color interpolado

  void main() {
    // Usamos el color del varying en lugar de un color fijo
    gl_FragColor = vec4(v_color, 1.0);
  }
`;
