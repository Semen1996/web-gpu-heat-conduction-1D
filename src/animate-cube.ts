import { mat4, vec3 } from "gl-matrix";

type AnimateCubeProps = {
  size: {
    width: number;
    height: number;
  };
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  callback: (newMvpMatrix: Float32Array) => void;
};

export const animateCube = ({
  size,
  position,
  rotation,
  scale,
  callback,
}: AnimateCubeProps) => {
  const frame = () => {
    rotation.x += 0.01;
    rotation.y += 0.01;

    const modelViewMatrix = mat4.create();
    mat4.translate(
      modelViewMatrix,
      modelViewMatrix,
      vec3.fromValues(position.x, position.y, position.z),
    );
    mat4.rotateX(modelViewMatrix, modelViewMatrix, rotation.x);
    mat4.rotateY(modelViewMatrix, modelViewMatrix, rotation.y);
    mat4.rotateZ(modelViewMatrix, modelViewMatrix, rotation.z);
    mat4.scale(
      modelViewMatrix,
      modelViewMatrix,
      vec3.fromValues(scale.x, scale.y, scale.z),
    );

    const projectionMatrix = mat4.create();
    mat4.perspective(
      projectionMatrix,
      Math.PI / 2,
      size.width / size.height,
      1,
      100,
    );

    const mvpMatrix = mat4.create();
    mat4.multiply(mvpMatrix, projectionMatrix, modelViewMatrix);

    callback(mvpMatrix as Float32Array);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
};
