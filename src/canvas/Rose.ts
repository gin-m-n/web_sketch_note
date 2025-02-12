import {
  BufferGeometry,
  Camera,
  Line,
  LineBasicMaterial,
  OrthographicCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { MeshUtils } from "../util/three";
import { BaseCanvas } from "./BaseCanvas";

export class Rose extends BaseCanvas {
  static readonly name = "Rose";
  private readonly scene: Scene;
  private readonly camera: Camera;
  private points: Vector3[] = [];
  private readonly line
  private alpha = 7

  constructor(containerDom: Element) {
    super({
      w: window.innerWidth,
      h: window.innerHeight,
      containerDom: containerDom,
      renderer: new WebGLRenderer(),
    });

    this.scene = new Scene();

    const inputContainer = document.createElement("div")
    inputContainer.style.display = "flex"
    inputContainer.style.gap = "8px"
    inputContainer.style.position = "absolute"
    inputContainer.style.left = "10px"
    inputContainer.style.top = "10px"

    const input = document.createElement("input")
    input.type = "number"
    input.placeholder = "r = sin(αΘ) defaut: α = 7"
    input.addEventListener("change", (e) => {
      if (e.target instanceof HTMLInputElement) {
        console.log("aa")
        this.alpha = e.target.value === "" ? 7 : Number(e.target.value)
        this.resetRender()
      }
    })

    inputContainer.appendChild(input)
    containerDom.appendChild(inputContainer)

    this.camera = new OrthographicCamera(
      this.w / -2,
      this.w / 2,
      this.h / 2,
      this.h / -2,
      0
    );
    this.camera.position.z = 1000;

    MeshUtils.genCenterLine(this.w, this.h).forEach((l) => {
      l.material.color.set(0x008080)
      this.scene.add(l)
    });

    const geo = new BufferGeometry().setFromPoints([]);
    const mat = new LineBasicMaterial()
    this.line = new Line(geo, mat)
    this.scene.add(this.line)

    this.render();
  }

  private resetRender() {
    this.theta = 0
    this.points = []
    this.line.geometry.dispose()
    this.line.geometry = new BufferGeometry().setFromPoints([])
  }

  private updateLine() {
    this.line.geometry.dispose()
    this.line.geometry = new BufferGeometry().setFromPoints(this.points);
  }

  private lastRenderTime = 0
  private theta = 0
  private render() {
    requestAnimationFrame(() => this.render());
    const now = performance.now()
    const delta = now - this.lastRenderTime
    // 大体、60FPSぐらいにしたい
    if (1000 / 60 > delta) {
      // skip render
      return
    }

    if (Math.PI * 2 < this.theta) {
      return
    }

    this.lastRenderTime = now

    const expandParam = 400
    // 極形式: r = sin(aΘ)
    const r = Math.sin(this.alpha * this.theta)

    const x = expandParam * r * Math.cos(this.theta)
    const y = expandParam * r * Math.sin(this.theta)
    this.points.push(new Vector3(x, y, 0))
    this.updateLine()

    this.theta += Math.PI / 180;

    this.renderer.render(this.scene, this.camera);
  }
}
