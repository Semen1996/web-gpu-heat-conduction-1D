struct Params {
    N: u32,
    leftType: u32,
    rightType: u32,

    r: f32,
    dx: f32,
    lambda: f32,

    leftT: f32,
    leftQ: f32,
    leftH: f32,
    leftTinf: f32,

    rightT: f32,
    rightQ: f32,
    rightH: f32,
    rightTinf: f32,
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

    // ============================================================
    // ЛЕВАЯ ГРАНИЦА
    // ============================================================

    if (i == 0u) {

        // --------------------------------------------------------
        // Условие 1-го рода:
        //
        // T(0, t) = TL
        // --------------------------------------------------------

        if (params.leftType == 1u) {
            temperatureOut[i] = params.leftT;
            return;
        }

        // --------------------------------------------------------
        // Условие 2-го рода:
        //
        // -lambda * dT/dx = q
        //
        // dT/dx ≈ (T1 - T0) / (dx)
        // --------------------------------------------------------

        if (params.leftType == 2u) {
            let T1 = temperatureIn[1u];
            temperatureOut[i] = T1 + params.dx * params.leftQ / params.lambda;
            return;
        }

        // --------------------------------------------------------
        // Условие 3-го рода:
        //
        // -lambda * dT/dx =
        // h * (Tinf - T)
        //
        // --------------------------------------------------------

        if (params.leftType == 3u) {
            let T1 = temperatureIn[1u];
            let Bi1 = params.leftH * params.dx / params.lambda;

            temperatureOut[i] = 1 / ( 1 + Bi1 ) * T1 + Bi1 / (1 + Bi1) * params.leftTinf;
            return;
        }

        return;
    }


    // ============================================================
    // ПРАВАЯ ГРАНИЦА
    // ============================================================

    if (i == params.N - 1u) {

        // --------------------------------------------------------
        // Условие 1-го рода:
        //
        // T(L, t) = TR
        // --------------------------------------------------------

        if (params.rightType == 1u) {
            temperatureOut[i] = params.rightT;
            return;
        }

        // --------------------------------------------------------
        // Условие 2-го рода:
        //
        // -lambda * dT/dx = q
        //
        // dT/dx ≈
        // (3TN - 4TN-1 + TN-2) / (2dx)
        // --------------------------------------------------------

        if (params.rightType == 2u) {
            let T1 = temperatureIn[params.N - 2u];
            temperatureOut[i] = T1 - params.dx * params.rightQ / params.lambda;
            return;
        }

        // --------------------------------------------------------
        // Условие 3-го рода:
        //
        // -lambda * dT/dx =
        // h * (Tinf - T)
        // --------------------------------------------------------

        if (params.rightType == 3u) {
            let T1 = temperatureIn[params.N - 2u];
            let Bi2 = params.leftH * params.dx / params.lambda;
            temperatureOut[i] = 1 / ( 1 + Bi2 ) * T1 + Bi2 / ( 1 + Bi2 ) * params.rightTinf;
            return;
        }

        return;
    }


    // ============================================================
    // ВНУТРЕННИЕ УЗЛЫ
    // ============================================================

    let T_left = temperatureIn[i - 1u];
    let T_current = temperatureIn[i];
    let T_right = temperatureIn[i + 1u];

    temperatureOut[i] =  T_current + params.r * ( T_left - 2.0 * T_current + T_right );
}