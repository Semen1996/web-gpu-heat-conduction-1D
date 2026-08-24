type CreateTemperatureBufferProps = {
  device: GPUDevice;
  initialTemperature: Float32Array;
};

export const createTemperatureBuffer = ({
  device,
  initialTemperature,
}: CreateTemperatureBufferProps) => {
  const temperatureBuffer = device.createBuffer({
    size: initialTemperature.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  device.queue.writeBuffer(temperatureBuffer, 0, initialTemperature);

  return {
    temperatureBuffer,
  };
};
