type ComputeAndRenderProps = {
  device: GPUDevice;
  context: GPUCanvasContext;

  computePipeline: GPUComputePipeline;

  computeBindGroupAtoB: GPUBindGroup;
  computeBindGroupBtoA: GPUBindGroup;

  renderPipeline: GPURenderPipeline;

  renderBindGroupA: GPUBindGroup;
  renderBindGroupB: GPUBindGroup;

  N: number;
  dt: number;
  tEnd: number;
  steps: number;
  simulation: {
    t: number;
    currentIsA: boolean;
    running: boolean;
  };
};

export const computeAndRender = ({
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
  steps,

  simulation,
}: ComputeAndRenderProps) => {
  if (!simulation.running) {
    return;
  }

  const encoder = device.createCommandEncoder();

  // =========================
  // COMPUTE
  // =========================
  let actualSteps = 0;

  for (let i = 0; i < steps; i++) {
    if (simulation.t >= tEnd) {
      simulation.running = false;
      break;
    }

    const computePass = encoder.beginComputePass();

    computePass.setPipeline(computePipeline);

    if (simulation.currentIsA) {
      // A → B
      computePass.setBindGroup(0, computeBindGroupAtoB);
    } else {
      // B → A
      computePass.setBindGroup(0, computeBindGroupBtoA);
    }

    computePass.dispatchWorkgroups(Math.ceil(N / 128));
    computePass.end();

    simulation.currentIsA = !simulation.currentIsA;
    simulation.t += dt;
    actualSteps++;
  }

  // =========================
  // RENDER
  // =========================

  if (actualSteps === 0) {
    return;
  }

  const renderPass = encoder.beginRenderPass({
    colorAttachments: [
      {
        view: context.getCurrentTexture().createView(),

        clearValue: {
          r: 1,
          g: 1,
          b: 1,
          a: 1,
        },

        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });

  renderPass.setPipeline(renderPipeline);

  const renderBindGroup = simulation.currentIsA
    ? renderBindGroupA
    : renderBindGroupB;

  renderPass.setBindGroup(0, renderBindGroup);

  renderPass.draw(N);

  renderPass.end();
  device.queue.submit([encoder.finish()]);
};
