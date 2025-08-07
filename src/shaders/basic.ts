// src/shaders/basic.ts

export const basicVertexShader = `
  attribute vec2 a_position;
  attribute vec3 a_color;
  
  uniform mat4 u_modelMatrix;
  uniform mat4 u_viewMatrix;       // NUEVO: Matriz de la Cámara (Vista)
  uniform mat4 u_projectionMatrix; // NUEVO: Matriz del Lente (Proyección)

  varying vec3 v_color;

  void main() {
    // El pipeline completo: Proyección * Vista * Modelo * Posición
    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 0.0, 1.0);
    v_color = a_color;
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
