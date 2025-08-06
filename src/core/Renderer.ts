// src/core/Renderer.ts
import { Shader } from './Shader';
import { basicVertexShader, basicFragmentShader } from '../shaders/basic';

export class Renderer {
  public readonly gl: WebGLRenderingContext;

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl');
    if (!gl) {
      throw new Error('WebGL no está soportado en este navegador.');
    }
    this.gl = gl;
    this.resizeToDisplaySize();
    console.log('Renderer inicializado.');
  }

  public renderScene(): void {
    const gl = this.gl;

    // 1. Limpiar el canvas
    gl.clearColor(0.0, 0.13, 0.26, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 2. Definir datos y shaders (por ahora, aquí dentro)
    const triangleVertices = new Float32Array([
      0.0, 0.5, -0.5, -0.5, 0.5, -0.5,
    ]);
    const shader = new Shader(gl, basicVertexShader, basicFragmentShader);

    // 3. Crear buffer y enviarlo a la GPU
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);

    // 4. Conectar el buffer con el atributo del shader
    const positionAttribLocation = gl.getAttribLocation(
        shader.program,
        'a_position'
    );
    gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttribLocation);

    // 5. Dibujar
    shader.use();
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    console.log('Escena renderizada por el método Renderer.renderScene()');
  }

  public resizeToDisplaySize(): void {
    const canvas = this.gl.canvas as HTMLCanvasElement;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    }
  }
}
