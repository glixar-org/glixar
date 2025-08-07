// src/main.ts

// Importamos la función de inicialización y nuestra función 'greet'
// desde el paquete generado por wasm-pack.
import init, { greet } from './wasm-pkg';

async function runWasmTest() {
  console.log('Iniciando prueba de WebAssembly...');

  // Primero, debemos inicializar el módulo Wasm. Es una operación asíncrona
  // que carga y prepara el binario .wasm.
  await init();
  console.log('Módulo Wasm inicializado.');

  // Ahora podemos llamar a nuestra función de Rust como si fuera JavaScript.
  const greeting = greet('Glixar');

  // Mostramos el resultado en la consola del navegador.
  console.log(greeting);
}

// Ejecutamos nuestra función de prueba.
runWasmTest();
