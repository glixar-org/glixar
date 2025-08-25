use wasm_bindgen::prelude::*;
use std::f32::consts::PI;
use earcutr;
use js_sys::{Float32Array, Uint16Array};

fn calculate_polygon(radius: f32, num_sides: u32) -> (Vec<f32>, Vec<u16>) {
    let mut vertices_2d: Vec<f64> = Vec::new();
    let mut final_vertices: Vec<f32> = Vec::new();
    let color = [1.0, 0.7, 0.2];

    for i in 0..num_sides {
        let angle = (i as f32) * (2.0 * PI / num_sides as f32);
        let x = radius * angle.cos();
        let y = radius * angle.sin();

        vertices_2d.push(x as f64);
        vertices_2d.push(y as f64);

        final_vertices.push(x);
        final_vertices.push(y);
        final_vertices.extend_from_slice(&color);
    }

    let indices_u32 = earcutr::earcut(&vertices_2d, &[], 2).unwrap_or_default();
    let indices_u16: Vec<u16> = indices_u32.iter().map(|&i| i as u16).collect();

    (final_vertices, indices_u16)
}

#[wasm_bindgen]
pub fn get_polygon_vertices(radius: f32, num_sides: u32) -> Float32Array {
    let (vertices, _) = calculate_polygon(radius, num_sides);
    Float32Array::from(&vertices[..])
}

#[wasm_bindgen]
pub fn get_polygon_indices(radius: f32, num_sides: u32) -> Uint16Array {
    let (_, indices) = calculate_polygon(radius, num_sides);
    Uint16Array::from(&indices[..])
}
