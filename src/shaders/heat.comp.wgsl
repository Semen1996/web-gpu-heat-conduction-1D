struct Params {
  N: u32,
  bcTypeLeft: u32,
  bcTypeRight: u32,

  r: f32,
  dx: f32,
  lambda: f32,

  TL: f32,
  qL: f32,
  kL: f32,
  TL_inf: f32,

  TR: f32,
  qR: f32,
  kR: f32,
  TR_inf: f32,
};

@group(0) @binding(0)
var<storage, read> temperatureIn: array<f32>;

@group(0) @binding(1)
var<storage, read_write> temperatureOut: array<f32>;

@group(0) @binding(2)
var<uniform> params: Params;



// ============================================================
// УСЛОВИЯ 1-ГО РОДА
// ============================================================

fn boundaryType1(T: f32) -> f32 {
    return T;
}


// ============================================================
// УСЛОВИЯ 2-ГО РОДА
// ============================================================

// Левая граница:
// -lambda * dT/dx = q
//
// dT/dx ≈ (T1 - T0) / (dx)
//
// --------------------------------------------------------

fn boundaryType2Left( T1: f32, q: f32 ) -> f32 {
    return T1 + params.dx * q / params.lambda;
}

// Правая граница:
//
// -lambda * dT/dx = q
//
// dT/dx ≈ (T_N - T_N-1) / (dx)
//

fn boundaryType2Right( TN_1: f32, q: f32 ) -> f32 {
    return TN_1 - params.dx * q / params.lambda;
}



// ============================================================
// УСЛОВИЯ 3-ГО РОДА
// ============================================================

// Левая граница:
//
// -lambda * dT/dx = h * (Tinf - T)

fn boundaryType3Left( T1: f32, Bi: f32, Tinf: f32 ) -> f32 {
    return 1 / ( 1 + Bi ) * T1 + Bi / (1 + Bi) * Tinf;
}


// Правая граница:
//
// -lambda * dT/dx = h * (Tinf - T)
//

fn boundaryType3Right( TN_1: f32, Bi: f32, Tinf: f32 ) -> f32 {
    return 1 / ( 1 + Bi ) * TN_1 + Bi / ( 1 + Bi ) * Tinf;
}


// ============================================================
// ЛЕВАЯ ГРАНИЦА
// ============================================================

fn calculateLeftBoundary() -> f32 {
    if (params.bcTypeLeft == 1u) {
        return boundaryType1( params.TL );
    }

    if (params.bcTypeLeft == 2u) {
        let T1 = temperatureIn[1u];
        return boundaryType2Left( T1, params.qL );
    }

    if (params.bcTypeLeft == 3u) {
        let T1 = temperatureIn[1u];
        let Bi1 = params.kL * params.dx / params.lambda;
        return boundaryType3Left( T1, Bi1, params.TL_inf );
    }

    // Неизвестный тип.
    return temperatureIn[0u];
}

// ============================================================
// ПРАВАЯ ГРАНИЦА
// ============================================================

fn calculateRightBoundary() -> f32 {
    if (params.bcTypeRight == 1u) {
        return boundaryType1( params.TR );
    }

    if (params.bcTypeRight == 2u) {
        let TN_1 = temperatureIn[params.N - 2u];
        return boundaryType2Right( TN_1, params.qR );
    }

    if (params.bcTypeRight == 3u) {
        let TN_1 = temperatureIn[params.N - 2u];
        let Bi2 = params.kR * params.dx / params.lambda;
        return boundaryType3Right( TN_1, Bi2, params.TR_inf );
    }

    // Неизвестный тип.
    return temperatureIn[0u];
}


// ============================================================
// ВНУТРЕННИЙ УЗЕЛ
// ============================================================

fn calculateInterior(i: u32) -> f32 {
    let T_left = temperatureIn[i - 1u];
    let T_current = temperatureIn[i];
    let T_right = temperatureIn[i + 1u];

    return T_current + params.r * ( T_left - 2.0 * T_current + T_right);
}








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

  // Левая граница
    if (i == 0u) {
        temperatureOut[i] = calculateLeftBoundary();
        return;
    }

    // Правая граница
    if (i == params.N - 1u) {
        temperatureOut[i] = calculateRightBoundary();
        return;
    }

    // Внутренние узлы
    temperatureOut[i] = calculateInterior(i);
}