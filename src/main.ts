import "./style.css";
import { Spiral } from "./canvas/Spiral";
import { Functional } from "./canvas/Functional";
import { Bullet1 } from "./canvas/Bullet1";

const KEY = "canvasIdx";
const canvasList = [Functional, Spiral, Bullet1];
const options = canvasList
  .map((canvas, idx) => `<option value=${idx}>${canvas.name}</option>`)
  .reduce((str, html) => str + html, "");

const reloadCanvas = (canvasIndex: number) => {
  const canvasContainer = document.getElementById("canvas-container");
  if (!canvasContainer) throw new Error("not found switcher");

  canvasContainer.innerHTML = "";

  const canvas = new canvasList[canvasIndex](canvasContainer);
  document.addEventListener("mousemove", (e) => {
    canvas.onMouseMoved(e.clientX, e.clientY);
  });
  window.addEventListener("resize", () => {
    canvas.onResize();
  });
};

document.addEventListener("DOMContentLoaded", () => {
  let selectedCanvasIdx = Number(localStorage.getItem(KEY)) ?? 0;
  const switcher = document.getElementById(
    "switcher"
  ) as HTMLSelectElement | null;
  if (!switcher) throw new Error("not found switcher");
  switcher.innerHTML = options;
  switcher.value = selectedCanvasIdx.toString();

  switcher.addEventListener("change", (e) => {
    const idx = (e.target as any).value;
    reloadCanvas(idx);
    localStorage.setItem(KEY, idx);
  });

  reloadCanvas(selectedCanvasIdx);
});
