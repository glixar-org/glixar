use wasm_bindgen::prelude::*;

// Esta "macro de atributo" le indica a wasm-bindgen que procese la siguiente función
// para que sea accesible desde JavaScript.
#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    // La macro format! es una forma conveniente de construir un String en Rust.
    format!("¡Hola, {}! Saludos desde Rust y WebAssembly.", name)
}
