export type BoundaryCondition =
  | {
      type: 1;
      T: number; // температура на границе
    }
  | {
      type: 2;
      q: number; // тепловой поток
    }
  | {
      type: 3;
      k: number; // коэффициент теплоотдачи
      Tinf: number; // температура окружающей среды
    };

export const VIEWPORT = {
  xMin: 0,
  xMax: 0.32,
  yMin: 0,
  yMax: 300,
};

// Цвет графика
export const color = new Float32Array([1, 0, 0, 1]);

// Параметры стержня
export const L = 0.3; // длина стержня, [м]
export const rho = 8800; // плотность стержня, [кг/м^3]
export const lambda = 384; // коэффициент теплопроводности стержня, [Вт/(м*град)]
export const c = 381; // коэффициент теплоемкости стержня, [Дж/(кг*град)]
export const a = lambda / (rho * c); // коэффициент температуропроводности стержня
export const T0 = 20; // начальная температура (градус Цельсия)

export const N = 100; // количество узлов
export const dx = L / (N - 1); // шаг по сетке, [м]

// Граничные условия
export const leftBoundary: BoundaryCondition = {
  type: 1,
  T: 300, // левое граничное условие (градус Цельсия)
  // Tinf: -30,
  // k: 1000,
};

export const rightBoundary: BoundaryCondition = {
  type: 1,
  T: 100,
  // k: 500,
  // Tinf: 10,
};

export const cfl = 0.9; // число Куранта
export const dt = (0.5 * cfl * dx ** 2) / a; // шаг по времени, [c]
export const r = (a * dt) / dx ** 2;
export let t = 0; // текущее время расчета, [c].
export const tEnd = 600; // время окончания расчета, [c]

export const T: number[] = Array(N).fill(T0);
export const initialTemperature = new Float32Array(T); // массив начальной температуры
