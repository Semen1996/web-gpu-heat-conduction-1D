export const createLabel = (
  labelsContainer: HTMLElement,
  text: string,
  position: number,
  type?: "x" | "y",
) => {
  const label = document.createElement("span");

  label.textContent = text;

  label.style.position = "absolute";
  if (type === "x") {
    label.style.left = `${position}px`;
    label.style.bottom = "0";
    label.style.transform = "translate(-50%, 150%)";
  } else {
    label.style.left = "0";
    label.style.bottom = `${position}px`;
    label.style.transform = "translate(-150%, 50%)";
  }

  labelsContainer.appendChild(label);
};
