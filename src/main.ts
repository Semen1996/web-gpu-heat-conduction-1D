import "./style.css";
import { initPipeline } from "./init-pipeline";
import { initWebGPU } from "./init-webgpu";

import { draw } from "./draw";
import { createVertexBuffer } from "./create-vertex-buffer";
import { vertices, verticesCount } from "./utils/cube";
import { createBindGroup } from "./create-bind-group";
import { createMVPBuffer } from "./create-mvp-buffer";
import { animateCube } from "./animate-cube";

const position = { x: 0, y: 0, z: -8 };
const rotation = { x: 20, y: 30, z: 0 };
const scale = { x: 1, y: 1, z: 1 };

async function run() {
  try {
    const { device, context, canvas } = await initWebGPU({
      canvasSelector: "#gfx-main",
    });

    const { vertexBuffer } = createVertexBuffer({ device, vertices: vertices });
    const { mvpBuffer } = createMVPBuffer({ device });

    const { pipeline } = await initPipeline({
      device,
    });

    const { bindGroup } = createBindGroup({
      device,
      pipeline,
      mvpBuffer,
    });

    const drawCallback = () => {
      draw({
        device,
        context,
        pipeline,
        vertexBuffer,
        bindGroup,
        countVertex: verticesCount,
      });
    };

    // Рисуем
    animateCube({
      size: {
        width: canvas.width,
        height: canvas.height,
      },
      position: { ...position },
      rotation: { ...rotation },
      scale: { ...scale },
      callback: (mvpMatrix) => {
        device.queue.writeBuffer(mvpBuffer, 0.1, mvpMatrix);
        drawCallback();
      },
    });
  } catch (error) {
    console.error(error);
  }
}

run();
