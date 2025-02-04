import { Canvas } from "./Canvas";
import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const canvasContainer = document.getElementById("canvas-container");
  if (canvasContainer) {
    const canvas = new Canvas(canvasContainer);
    document.addEventListener("mousemove", (e) => {
      canvas.onMouseMoved(e.clientX, e.clientY);
    });
    window.addEventListener("resize", () => {
      canvas.onResize();
    });
  } else {
    console.error("not found #canvas-container");
  }
});
