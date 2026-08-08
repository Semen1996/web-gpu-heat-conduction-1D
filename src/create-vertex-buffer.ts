type CreateVertexBufferProps = {
  vertices: Float32Array<ArrayBuffer>;
  device: GPUDevice;
};
export const createVertexBuffer = ({
  device,
  vertices,
}: CreateVertexBufferProps) => {
  const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, vertices);

  return { vertexBuffer };
};
