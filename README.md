# Glixar

**A high-performance rendering library for the web, powered by WebGL and WebAssembly (Rust).**

---

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40glixar%2Fcore.svg)](https://badge.fury.io/js/%40glixar%2Fcore)
[![Build Status](https://github.com/glixar-org/glixar/actions/workflows/main.yml/badge.svg)](https://github.com/glixar-org/glixar/actions)

**Glixar** is a library designed from the ground up to deliver incredibly fast and fluid 2D rendering in the browser. By combining a WebGL rendering engine orchestrated by TypeScript with high-performance computation modules written in Rust (compiled to WebAssembly), Glixar is built for demanding interactive graphics applications.

## [🚀 View the Live Demo](https://glixar-org.github.io/glixar/)

## [📚 Read the API Documentation](https://glixar-org.github.io/glixar/docs/)

---

## Key Features

* **High-Performance Core:** A WebGL-based rendering pipeline with optimized resource management.
* **WebAssembly Integration:** Computationally intensive tasks, like geometry generation, are delegated to Rust for near-native speed.
* **Fluent, Object-Oriented API:** A public interface (`Glixar`, `SceneObject`) designed to be intuitive and easy to use, hiding internal complexity.
* **MVP Transformation System:** A full Model-View-Projection matrix pipeline with a 2D camera supporting zoom and pan.
* **Modern Animation Loop:** Uses `requestAnimationFrame` for smooth and efficient animations.
* **Assured Code Quality:** Strictly typed with TypeScript and enforced with ESLint and Prettier.

---

## Installation and Usage

### Via Script Tag

For quick use, you can download the `glixar.min.js` file from our [Releases page](https://github.com/glixar-org/glixar/releases) and include it in your HTML:

```html
<script src="path/to/glixar.min.js"></script>
<script>
  const glixar = new Glixar('your-canvas-id');
  // ... your code ...
</script>
```

### Via NPM (Coming Soon)

The library will be published to NPM in a future release.


npm install @glixar/core

import { Glixar } from '@glixar/core';

const glixar = new Glixar('your-canvas-id');
// ... your code ...

---

## Quick Start Example

This code creates a scene with a WebAssembly-generated hexagon and animates it.

```typescript
import { Glixar } from './Glixar';
import { SceneObject } from './objects/SceneObject';
import { Camera2D } from './core/Camera2D';
import { basicVertexShader, basicFragmentShader } from './shaders/basic';
import init, { generate_hexagon } from './wasm-pkg';

class MyApp {
  private glixar: Glixar;
  private scene: SceneObject[] = [];
  private camera: Camera2D;
  private animatedObject: SceneObject | null = null;

  private constructor(glixar: Glixar) {
    this.glixar = glixar;
    this.camera = new Camera2D(glixar.canvas.width, glixar.canvas.height);
    this.setupScene();
  }
  
  public static async create(canvasId: string): Promise<MyApp> {
    await init(); // Initialize the Wasm module
    const glixar = new Glixar(canvasId);
    return new MyApp(glixar);
  }

  private setupScene(): void {
    const hexagonData = generate_hexagon(0.7); // Geometry from Rust!
    const hexagonGeom = this.glixar.createGeometry('wasm_hexagon', hexagonData, 5);
    const shader = this.glixar.createShader('basic', basicVertexShader, basicFragmentShader);

    this.animatedObject = new SceneObject(hexagonGeom, shader);
    this.scene.push(this.animatedObject);
  }

  public start(): void {
    const animate = (time: number) => {
      if (this.animatedObject) {
        this.animatedObject.setIdentity().rotateZ(time * 0.0005);
      }
      this.glixar.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
}

// Start the application
MyApp.create('glixar-canvas').then(app => app.start());
```
---

## Building from Source

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/glixar-org/glixar.git
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development environment:**
    ```bash
    npm run dev
    ```
4.  **Create a production build:**
    ```bash
    npm run build:prod
    ```

---

## License

Glixar is distributed under the **MIT License**. See the `LICENSE` file for more details.
