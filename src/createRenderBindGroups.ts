export const createRenderBindGroups = ({
  device,
  pipeline,
  temperatureA,
  temperatureB,
  viewportBuffer,
  colorBuffer,
}: {
  device: GPUDevice;
  pipeline: GPURenderPipeline;

  temperatureA: GPUBuffer;
  temperatureB: GPUBuffer;
  colorBuffer: GPUBuffer;

  viewportBuffer: GPUBuffer;
}) => {
  const renderBindGroupA = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),

    entries: [
      {
        binding: 0,
        resource: {
          buffer: temperatureA,
        },
      },

      {
        binding: 1,
        resource: {
          buffer: viewportBuffer,
        },
      },

      {
        binding: 2,
        resource: {
          buffer: colorBuffer,
        },
      },
    ],
  });

  const renderBindGroupB = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),

    entries: [
      {
        binding: 0,
        resource: {
          buffer: temperatureB,
        },
      },

      {
        binding: 1,
        resource: {
          buffer: viewportBuffer,
        },
      },

      {
        binding: 2,
        resource: {
          buffer: colorBuffer,
        },
      },
    ],
  });

  return {
    renderBindGroupA,
    renderBindGroupB,
  };
};
