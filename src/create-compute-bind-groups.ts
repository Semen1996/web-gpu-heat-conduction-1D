type CreateComputeBindGroupsProps = {
  device: GPUDevice;
  pipeline: GPUComputePipeline;

  temperatureA: GPUBuffer;
  temperatureB: GPUBuffer;

  paramsBuffer: GPUBuffer;
};

export const createComputeBindGroups = ({
  device,
  pipeline,
  temperatureA,
  temperatureB,
  paramsBuffer,
}: CreateComputeBindGroupsProps) => {
  const layout = pipeline.getBindGroupLayout(0);

  const computeBindGroupAtoB = device.createBindGroup({
    layout,

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
          buffer: temperatureB,
        },
      },

      {
        binding: 2,
        resource: {
          buffer: paramsBuffer,
        },
      },
    ],
  });

  const computeBindGroupBtoA = device.createBindGroup({
    layout,

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
          buffer: temperatureA,
        },
      },

      {
        binding: 2,
        resource: {
          buffer: paramsBuffer,
        },
      },
    ],
  });

  return {
    computeBindGroupAtoB,
    computeBindGroupBtoA,
  };
};
