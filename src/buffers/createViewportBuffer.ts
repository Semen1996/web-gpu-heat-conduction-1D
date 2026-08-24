type CreateViewportBufferProps = {
  device: GPUDevice;
  params: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    N: number;
  };
};

export const createViewportBuffer = ({
  device,
  params,
}: CreateViewportBufferProps) => {
  const viewportBuffer = device.createBuffer({
    size: 32,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const data = new ArrayBuffer(32);
  const floats = new Float32Array(data);
  const uints = new Uint32Array(data);

  floats[0] = params.xMin;
  floats[1] = params.xMax;
  floats[2] = params.yMin;
  floats[3] = params.yMax;
  uints[4] = params.N;

  device.queue.writeBuffer(viewportBuffer, 0, data);

  return { viewportBuffer };
};
