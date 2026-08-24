import computeCode from "./shaders/heat.comp.wgsl?raw";

type InitComputePipelineProps = {
  device: GPUDevice;
};

export const initComputePipeline = async ({
  device,
}: InitComputePipelineProps) => {
  const shaderModule = device.createShaderModule({
    code: computeCode,
  });

  const pipeline = await device.createComputePipelineAsync({
    layout: "auto",

    compute: {
      module: shaderModule,
      entryPoint: "main",
    },
  });

  return { computePipeline: pipeline };
};
