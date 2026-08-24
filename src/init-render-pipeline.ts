import vertexCode from "./shaders/position.vert.wgsl?raw";
import fragmentCode from "./shaders/color.frag.wgsl?raw";

type InitRenderPipelineProps = {
  device: GPUDevice;
};

export const initRenderPipeline = async ({
  device,
}: InitRenderPipelineProps) => {
  const vertexShader = device.createShaderModule({ code: vertexCode });
  const fragmentShader = device.createShaderModule({ code: fragmentCode });

  const pipeline = await device.createRenderPipelineAsync({
    layout: "auto",

    vertex: {
      module: vertexShader,
      entryPoint: "main",
      buffers: [],
    },

    fragment: {
      module: fragmentShader,
      entryPoint: "main",

      targets: [
        {
          format: navigator.gpu.getPreferredCanvasFormat(),
        },
      ],
    },

    primitive: {
      topology: "line-strip",
    },
  });

  return { renderPipeline: pipeline };
};
