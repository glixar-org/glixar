// src/core/Shader.ts
import { mat4 } from 'gl-matrix';

export class Shader {
  public readonly program: WebGLProgram;
  private readonly gl: WebGLRenderingContext;
  private readonly uniformLocations: Map<string, WebGLUniformLocation | null>;

  constructor(gl: WebGLRenderingContext, vertexSrc: string, fragmentSrc: string) {
    this.gl = gl;
    this.uniformLocations = new Map();
    const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexSrc);
    const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentSrc);
    const program = gl.createProgram();
    if (!program) throw new Error('No se pudo crear el programa de shaders.');
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`No se pudo enlazar el programa de shaders: ${gl.getProgramInfoLog(program)}`);
    }
    this.program = program;
  }

  private compileShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) throw new Error('No se pudo crear el shader.');
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

  private getUniformLocation(name: string): WebGLUniformLocation | null {
    if (this.uniformLocations.has(name)) {
      return this.uniformLocations.get(name)!;
    }
    const location = this.gl.getUniformLocation(this.program, name);
    this.uniformLocations.set(name, location);
    return location;
  }

  public setMatrix4fv(name: string, matrix: mat4): void {
    const location = this.getUniformLocation(name);
    if (location) {
      this.gl.uniformMatrix4fv(location, false, matrix);
    }
  }
}
