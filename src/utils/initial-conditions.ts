export const VIEWPORT = {
  xMin: 0,
  xMax: 0.12,
  yMin: 0,
  yMax: 350,
};

// Цвет графика
export const color = new Float32Array([1, 0, 0, 1]);

// Параметры стержня
export const L = 0.1; // длина стержня, [м]
export const rho = 7800; // плотность стержня, [кг/м^3]
export const lambda = 46; // коэффициент теплопроводности стержня, [Вт/(м*град)]
export const c = 460; // коэффициент теплоемкости стержня, [Дж/(кг*град)]
export const a = lambda / (rho * c); // коэффициент температуропроводности стержня
export const T0 = 20; // начальная температура (градус Цельсия)

export const N = 100; // количество узлов
export const dx = L / (N - 1); // шаг по сетке, [м]

// Граничные условия
export const TL = 300; // левое граничное условие (градус Цельсия)
export const TR = 100; // правое граничное условиеа (градус Цельсия)

export const cfl = 0.9; // число Куранта
export const dt = (0.5 * cfl * dx ** 2) / a; // шаг по времени, [c]
export const r = (a * dt) / dx ** 2;
export let t = 0; // текущее время расчета, [c].
export const tEnd = 60; // время окончания расчета, [c]

export const T: number[] = Array(N).fill(T0);
export const initialTemperature = new Float32Array(T); // массив начальной температуры
