struct Viewport {
    xMin: f32,
    xMax: f32,
    yMin: f32,
    yMax: f32,
    N: u32,
};

@group(0) @binding(0)
var<storage, read> temperature: array<f32>;

@group(0) @binding(1)
var<uniform> viewport: Viewport;

@vertex
fn main(
    @builtin(vertex_index) index: u32
) -> @builtin(position) vec4<f32> {

    let x =
        viewport.xMin +
        f32(index) /
        f32(viewport.N - 1u) *
        (viewport.xMax - viewport.xMin);

    let y = temperature[index];

    let ndcX =
        ((x - viewport.xMin) /
        (viewport.xMax - viewport.xMin))
        * 2.0 - 1.0;

    let ndcY =
        ((y - viewport.yMin) /
        (viewport.yMax - viewport.yMin))
        * 2.0 - 1.0;

    return vec4<f32>(
        ndcX,
        ndcY,
        0.0,
        1.0
    );
}