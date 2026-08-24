import type { BoundaryCondition } from "../utils/initial-conditions";

type CreateComputeParamsBufferProps = {
  device: GPUDevice;
  params: {
    r: number;
    lambda: number;
    N: number;
    dx: number;
    leftBoundary: BoundaryCondition;
    rightBoundary: BoundaryCondition;
  };
};

const writeBoundaryCondition = (
  floatData: Float32Array,
  offset: number,
  boundary: BoundaryCondition,
) => {
  switch (boundary.type) {
    // Граничное условие 1-го рода
    case 1:
      floatData[offset] = boundary.T;
      floatData[offset + 1] = 0;
      floatData[offset + 2] = 0;
      floatData[offset + 3] = 0;
      break;

    // Граничное условие 2-го рода
    case 2:
      floatData[offset] = 0;
      floatData[offset + 1] = boundary.q;
      floatData[offset + 2] = 0;
      floatData[offset + 3] = 0;
      break;

    // Граничное условие 3-го рода
    case 3:
      floatData[offset] = 0;
      floatData[offset + 1] = 0;
      floatData[offset + 2] = boundary.k;
      floatData[offset + 3] = boundary.Tinf;
      break;
  }
};

export const createComputeParamsBuffer = ({
  device,
  params,
}: CreateComputeParamsBufferProps) => {
  const computeParamsBuffer = device.createBuffer({
    size: 64,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const data = new ArrayBuffer(64);
  const floatData = new Float32Array(data);
  const uintData = new Uint32Array(data);

  // Общие параметры
  uintData[0] = params.N;
  uintData[1] = params.leftBoundary.type;
  uintData[2] = params.rightBoundary.type;

  floatData[3] = params.r;
  floatData[4] = params.dx;
  floatData[5] = params.lambda;

  // Левая граница
  writeBoundaryCondition(floatData, 6, params.leftBoundary);

  // Правая граница
  writeBoundaryCondition(floatData, 10, params.rightBoundary);

  device.queue.writeBuffer(computeParamsBuffer, 0, data);

  return { computeParamsBuffer };
};
