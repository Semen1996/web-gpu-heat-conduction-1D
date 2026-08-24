import "./style.css";
import { initRenderPipeline } from "./init-render-pipeline";
import { initWebGPU } from "./init-webgpu";

import { createColorBuffer } from "./buffers/create-color-buffer";
import { createLabel } from "./helpers/create-label";
import {
  color,
  dt,
  dx,
  initialTemperature,
  lambda,
  leftBoundary,
  N,
  r,
  rightBoundary,
  t,
  tEnd,
  VIEWPORT,
} from "./utils/initial-conditions";
import { createTemperatureBuffer } from "./buffers/create-temperature-buffer";
import { createComputeParamsBuffer } from "./buffers/create-compute-params-buffer";
import { initComputePipeline } from "./init-compute-pipeline";
import { createComputeBindGroups } from "./create-compute-bind-groups";
import { createViewportBuffer } from "./buffers/createViewportBuffer";
import { createRenderBindGroups } from "./createRenderBindGroups";
import { computeAndRender } from "./computeAndRender";

async function run() {
  try {
    const { device, context } = await initWebGPU({
      canvasSelector: "#gfx-main",
    });

    const { temperatureBuffer: temperatureBufferA } = createTemperatureBuffer({
      device,
      initialTemperature,
    });

    const { temperatureBuffer: temperatureBufferB } = createTemperatureBuffer({
      device,
      initialTemperature,
    });

    const { computeParamsBuffer } = createComputeParamsBuffer({
      device,
      params: {
        r,
        lambda: lambda,
        dx: dx,
        leftBoundary,
        rightBoundary,
        N,
      },
    });

    const { viewportBuffer } = createViewportBuffer({
      device,
      params: {
        xMin: VIEWPORT.xMin,
        xMax: VIEWPORT.xMax,
        yMin: VIEWPORT.yMin,
        yMax: VIEWPORT.yMax,
        N,
      },
    });

    const { colorBuffer } = createColorBuffer({ device, color });

    const { computePipeline } = await initComputePipeline({ device });
    const { computeBindGroupAtoB, computeBindGroupBtoA } =
      createComputeBindGroups({
        device,
        pipeline: computePipeline,
        temperatureA: temperatureBufferA,
        temperatureB: temperatureBufferB,
        paramsBuffer: computeParamsBuffer,
      });

    const { renderPipeline } = await initRenderPipeline({
      device,
    });

    const { renderBindGroupA, renderBindGroupB } = createRenderBindGroups({
      device,
      pipeline: renderPipeline,
      temperatureA: temperatureBufferA,
      temperatureB: temperatureBufferB,
      viewportBuffer,
      colorBuffer,
    });

    const STEPS_PER_RENDER = 10;
    const simulation = {
      t,
      currentIsA: true,
      running: true,
    };

    function frame() {
      if (!simulation.running) {
        return;
      }
      computeAndRender({
        device,
        context,
        computePipeline,
        computeBindGroupAtoB,
        computeBindGroupBtoA,
        renderPipeline,
        renderBindGroupA,
        renderBindGroupB,
        N,
        dt,
        tEnd,
        steps: STEPS_PER_RENDER,
        simulation,
      });

      if (simulation.running) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  } catch (error) {
    console.error(error);
  }
}

function createPlot() {
  const labelsContainer = document.querySelector("#labels");
  if (!labelsContainer) {
    console.error("labels container isn't found");
    return;
  }

  createLabel(labelsContainer as HTMLElement, VIEWPORT.xMin.toString(), 0, "x");
  createLabel(
    labelsContainer as HTMLElement,
    VIEWPORT.xMax.toString(),
    labelsContainer.clientWidth,
    "x",
  );
  createLabel(labelsContainer as HTMLElement, VIEWPORT.yMin.toString(), 0, "y");
  createLabel(
    labelsContainer as HTMLElement,
    VIEWPORT.yMax.toString(),
    labelsContainer.clientHeight,
    "y",
  );
}

createPlot();
run();
