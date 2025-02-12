
import {
  BufferGeometry,
  Camera,
  Light,
  Line,
  LineBasicMaterial,
  OrthographicCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { MeshUtils } from "../util/three";
import { BaseCanvas } from "./BaseCanvas";

export class Milktea extends BaseCanvas {
  static readonly name = "Milktea";
  private readonly scene: Scene;
  private readonly camera: Camera;
  private readonly light: Light;
  private readonly lines: Line[] = [];

  private r = 300
  private theta = 0
  private scalar = 2;

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
    input.style.width = "400px"
    input.type = "number"
    input.placeholder = "formula: (cosΘ, sinΘ) -> (cos(nΘ),sin(nΘ)), default: n=2"

    input.addEventListener("change", (e) => {
      if (e.target instanceof HTMLInputElement) {
        this.scalar = e.target.value === "" ? 2 : Number(e.target.value)
        this.lines.forEach(l => {
          this.scene.remove(l)
        })
        this.theta = 0
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

    this.light = new PointLight(0xffffff, 200000);
    this.light.position.set(0, 100, 200);
    this.scene.add(this.light);

    MeshUtils.genCenterLine(this.w, this.h).forEach((l) => {
      l.material.color.set(0x008080)
      this.scene.add(l)
    });

    const D = 98
    const circlePoints = []
    for (let i = 0; i <= D; i++) {
      const t = 2 * Math.PI / D * i
      const x = this.r * Math.cos(t)
      const y = this.r * Math.sin(t)
      circlePoints.push(new Vector3(x, y, 0))
    }
    const circle = new Line(new BufferGeometry().setFromPoints(circlePoints), new LineBasicMaterial())
    this.scene.add(circle)

    this.render();
  }




  private genLine(x1: number, y1: number, x2: number, y2: number) {
    const geo = new BufferGeometry().setFromPoints([new Vector3(x1, y1, 0), new Vector3(x2, y2, 0)]);
    const mat = new LineBasicMaterial()
    const line = new Line(geo, mat)
    this.lines.push(line)
    this.scene.add(line)
  }

  private lastRenderTime = 0
  private render() {
    requestAnimationFrame(() => this.render());
    const now = performance.now()
    const delta = now - this.lastRenderTime
    // 大体、60FPSぐらいにしたい
    if (1000 / 60 > delta) {
      // skip render
      return
    }

    if (this.theta > 2 * Math.PI) {
      // 2πまでしか回さない
      return
    }

    this.lastRenderTime = now

    const x1 = this.r * Math.cos(this.theta)
    const y1 = this.r * Math.sin(this.theta)
    const x2 = this.r * Math.cos(this.theta * this.scalar)
    const y2 = this.r * Math.sin(this.theta * this.scalar)
    this.genLine(x1, y1, x2, y2)

    this.theta += Math.PI / 180 * 4;

    this.renderer.render(this.scene, this.camera);
  }
}
