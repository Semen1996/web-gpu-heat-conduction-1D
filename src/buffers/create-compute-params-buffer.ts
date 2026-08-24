type CreateComputeParamsBufferProps = {
  device: GPUDevice;
  params: {
    r: number;
    N: number;
    TL: number;
    TR: number;
  };
};

export const createComputeParamsBuffer = ({
  device,
  params,
}: CreateComputeParamsBufferProps) => {
  const computeParamsBuffer = device.createBuffer({
    size: 4 * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const data = new ArrayBuffer(4 * Float32Array.BYTES_PER_ELEMENT);
  const floatData = new Float32Array(data);
  const uintData = new Uint32Array(data);

  floatData[0] = params.r;
  uintData[1] = params.N;
  floatData[2] = params.TL;
  floatData[3] = params.TR;

  device.queue.writeBuffer(computeParamsBuffer, 0, data);

  return { computeParamsBuffer };
};
