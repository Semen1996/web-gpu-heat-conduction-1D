import vertexCode from "./shaders/position.vert.wgsl?raw";
import fragmentCode from "./shaders/color.frag.wgsl?raw";

type InitPipelineProps = {
  device: GPUDevice;
};

export const initPipeline = async ({ device }: InitPipelineProps) => {
  const vertexShader = device.createShaderModule({ code: vertexCode });
  const fragmentShader = device.createShaderModule({ code: fragmentCode });

  const pipeline = await device.createRenderPipelineAsync({
    layout: "auto",

    vertex: {
      module: vertexShader,
      entryPoint: "main",
      buffers: [
        {
          arrayStride: 3 * Float32Array.BYTES_PER_ELEMENT, // 1 вершина состоит из 3 координат по 4 байта
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: "float32x3",
            },
          ],
        },
      ],
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
      topology: "triangle-list",
      cullMode: "back",
    },
  });

  return { pipeline };
};
