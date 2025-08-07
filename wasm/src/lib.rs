use wasm_bindgen::prelude::*;
use std::f32::consts::PI;

// Esta función se expondrá a JavaScript.
#[wasm_bindgen]
pub fn generate_hexagon(radius: f32) -> Vec<f32> {
    // Un vector para almacenar nuestros datos de vértices (X, Y, R, G, B)
    let mut vertices: Vec<f32> = Vec::new();

    // Color del centro (blanco)
    let center_color = [1.0, 1.0, 1.0];

    // Colores para los 6 puntos exteriores del hexágono
    let colors = [
        [1.0, 0.0, 0.0], // Rojo
        [1.0, 1.0, 0.0], // Amarillo
        [0.0, 1.0, 0.0], // Verde
        [0.0, 1.0, 1.0], // Cian
        [0.0, 0.0, 1.0], // Azul
        [1.0, 0.0, 1.0], // Magenta
    ];

    // Creamos 6 triángulos que componen el hexágono
    for i in 0..6 {
        // Vértice central
        vertices.push(0.0); // x
        vertices.push(0.0); // y
        vertices.extend_from_slice(&center_color);

        // Primer vértice exterior del triángulo
        let angle1 = (i as f32) * (2.0 * PI / 6.0);
        vertices.push(radius * angle1.cos()); // x
        vertices.push(radius * angle1.sin()); // y
        vertices.extend_from_slice(&colors[i]);

        // Segundo vértice exterior del triángulo
        let angle2 = ((i + 1) as f32) * (2.0 * PI / 6.0);
        vertices.push(radius * angle2.cos()); // x
        vertices.push(radius * angle2.sin()); // y
        vertices.extend_from_slice(&colors[if i + 1 == 6 { 0 } else { i + 1 }]);
    }

    vertices
}
