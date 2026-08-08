type createMVPBufferProps = {
  device: GPUDevice;
};
export const createMVPBuffer = ({ device }: createMVPBufferProps) => {
  const mvpBuffer = device.createBuffer({
    size: 4 * 4 * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  return { mvpBuffer };
};
