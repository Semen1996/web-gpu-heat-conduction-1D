struct Params {
    r: f32,
    N: u32,
    TL: f32,
    TR: f32,
};

@group(0) @binding(0)
var<storage, read> temperatureIn: array<f32>;

@group(0) @binding(1)
var<storage, read_write> temperatureOut: array<f32>;

@group(0) @binding(2)
var<uniform> params: Params;


@compute
@workgroup_size(128)
fn main(
    @builtin(global_invocation_id)
    id: vec3<u32>
) {
    let i = id.x;

    if (i >= params.N) {
        return;
    }

    // Граничные условия 1-го рода

    if (i == 0u) {
        temperatureOut[i] = params.TL;
        return;
    }

    if (i == params.N - 1u) {
        temperatureOut[i] = params.TR;
        return;
    }

    let T_left =
        temperatureIn[i - 1u];

    let T_current =
        temperatureIn[i];

    let T_right =
        temperatureIn[i + 1u];

    temperatureOut[i] =
        T_current +
        params.r *
        (
            T_left
            - 2.0 * T_current
            + T_right
        );
}