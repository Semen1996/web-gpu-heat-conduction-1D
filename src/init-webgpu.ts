type InitWebGPUProps = {
  canvasSelector: string;
};

export const initWebGPU = async ({ canvasSelector }: InitWebGPUProps) => {
  if (!navigator.gpu)
    throw new Error("WebGPU cannot be initialized - navigator.gpu not found");

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter)
    throw new Error("WebGPU cannot be initialized - Adapter not found");

  const device = await adapter.requestDevice();
  device.lost.then(() => {
    console.error("WebGPU cannot be initialized - Device has been lost");
    return null;
  });

  // Создание контекста канваса
  const canvas: HTMLCanvasElement | null =
    document.querySelector(canvasSelector);
  if (!canvas)
    throw new Error("WebGPU cannot be initialized - Canvas isn't found");

  const context = canvas.getContext("webgpu") as GPUCanvasContext | null;
  if (!context) {
    throw new Error(
      "WebGPU cannot be initialized - Canvas does not support WebGPU",
    );
  }

  const devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;

  context.configure({
    device,
    format: navigator.gpu.getPreferredCanvasFormat(),
  });

  return { adapter, device, canvas, context };
};
