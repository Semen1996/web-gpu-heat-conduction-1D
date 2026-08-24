export type DrawProps = {
  context: GPUCanvasContext;
  device: GPUDevice;
  pipeline: GPURenderPipeline;
  vertexBuffer: GPUBuffer;
  bindGroup: GPUBindGroup;
  countVertex: number;
};

export const draw = ({
  device,
  context,
  pipeline,
  vertexBuffer,
  bindGroup,
  countVertex,
}: DrawProps) => {
  const encoder = device.createCommandEncoder();

  const pass = encoder.beginRenderPass({
    colorAttachments: [
      {
        view: context.getCurrentTexture().createView(),

        clearValue: {
          r: 255,
          g: 255,
          b: 255,
          a: 1,
        },

        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });

  pass.setPipeline(pipeline);
  pass.setVertexBuffer(0, vertexBuffer);
  pass.setBindGroup(0, bindGroup);

  pass.draw(countVertex);
  pass.end();

  device.queue.submit([encoder.finish()]);
};
