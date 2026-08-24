type CreateColorBufferProps = {
  color: Float32Array<ArrayBuffer>;
  device: GPUDevice;
};
export const createColorBuffer = ({
  device,
  color,
}: CreateColorBufferProps) => {
  const colorBuffer = device.createBuffer({
    size: color.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(colorBuffer, 0, color);

  return { colorBuffer };
};
