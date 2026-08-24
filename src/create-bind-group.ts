type CreateBindGroupProps = {
  device: GPUDevice;
  pipeline: GPURenderPipeline;
  colorBuffer: GPUBuffer;
};

export const createBindGroup = ({
  device,
  pipeline,
  colorBuffer,
}: CreateBindGroupProps) => {
  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: colorBuffer,
        },
      },
    ],
  });

  return { bindGroup };
};
