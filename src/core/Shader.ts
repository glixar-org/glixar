// src/core/Shader.ts

export class Shader {
  public readonly program: WebGLProgram;
  private readonly gl: WebGLRenderingContext;

  constructor(
    gl: WebGLRenderingContext,
    vertexSrc: string,
    fragmentSrc: string
  ) {
    this.gl = gl;
    const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexSrc);
    const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentSrc);

    const program = gl.createProgram();
    if (!program) {
      throw new Error('No se pudo crear el programa de shaders.');
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      throw new Error(`No se pudo enlazar el programa de shaders: ${info}`);
    }

    this.program = program;
  }

  private compileShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error('No se pudo crear el shader.');
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error(`No se pudo compilar el shader: ${info}`);
    }

    return shader;
  }

  public use(): void {
    this.gl.useProgram(this.program);
  }
}
