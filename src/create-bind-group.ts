type CreateBindGroupProps = {
  device: GPUDevice;
  pipeline: GPURenderPipeline;
  mvpBuffer: GPUBuffer;
};

export const createBindGroup = ({
  device,
  pipeline,
  mvpBuffer,
}: CreateBindGroupProps) => {
  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: mvpBuffer,
        },
      },
    ],
  });

  return { bindGroup };
};
