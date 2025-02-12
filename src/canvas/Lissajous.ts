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

export class Lissajous extends BaseCanvas {
  static readonly name = "Lissajous";
  private readonly scene: Scene;
  private readonly camera: Camera;
  private readonly light: Light;
  private points: Vector3[] = []
  private readonly line;

  private readonly cosScalarTimes;
  private readonly cosPhaseDiff;
  private readonly sinScalarTimes;
  private readonly sinPhaseDiff;
  private readonly thetaPerFrameInput;

  private cs: number = 1
  private cd: number = 0
  private ss: number = 1
  private sd: number = 0
  private thetaPerFrame: number = 1



  constructor(containerDom: Element) {
    super({
      w: window.innerWidth,
      h: window.innerHeight,
      containerDom: containerDom,
      renderer: new WebGLRenderer(),
    });

    const inputContainer = document.createElement("div")
    inputContainer.style.display = "flex"
    inputContainer.style.gap = "8px"
    inputContainer.style.position = "absolute"
    inputContainer.style.left = "10px"
    inputContainer.style.top = "10px"

    this.cosScalarTimes = document.createElement("input")
    this.cosScalarTimes.type = "number"
    this.cosScalarTimes.placeholder = "cos: scalar times (1)"
    this.cosScalarTimes.addEventListener("change", (e) => {
      if (e.target instanceof HTMLInputElement) {
        this.cs = e.target.value === "" ? 1 : Number(e.target.value)
        this.resetRender()
      }
    })

    this.cosPhaseDiff = document.createElement("input")
    this.cosPhaseDiff.type = "number"
    this.cosPhaseDiff.placeholder = "cos: phase diff (0°)"
    this.cosPhaseDiff.addEventListener("change", (e) => {
      if (e.target instanceof HTMLInputElement) {
        this.cd = e.target.value === "" ? 0 : Number(e.target.value)
        this.resetRender()
      }
    })

    this.sinScalarTimes = document.createElement("input")
    this.sinScalarTimes.type = "number"
    this.sinScalarTimes.placeholder = "sin: scalar times (1)"
    this.sinScalarTimes.addEventListener("change", (e) => {
      if (e.target instanceof HTMLInputElement) {
        this.ss = e.target.value === "" ? 1 : Number(e.target.value)
        this.resetRender()
      }
    })

    this.sinPhaseDiff = document.createElement("input")
    this.sinPhaseDiff.type = "number"
    this.sinPhaseDiff.placeholder = "sin: phase diff (0°)"
    this.sinPhaseDiff.addEventListener("change", (e) => {
      if (e.target instanceof HTMLInputElement) {
        this.sd = e.target.value === "" ? 0 : Number(e.target.value)
        this.resetRender()
      }
    })

    this.thetaPerFrameInput = document.createElement("input")
    this.thetaPerFrameInput.type = "number"
    this.thetaPerFrameInput.placeholder = "theta per frame (1°)"
    this.thetaPerFrameInput.addEventListener("change", (e) => {
      if (e.target instanceof HTMLInputElement) {
        this.thetaPerFrame = e.target.value === "" ? 1 : Number(e.target.value)
        this.resetRender()
      }
    })

    inputContainer.appendChild(this.cosScalarTimes)
    inputContainer.appendChild(this.cosPhaseDiff)
    inputContainer.appendChild(this.sinScalarTimes)
    inputContainer.appendChild(this.sinPhaseDiff)
    inputContainer.appendChild(this.thetaPerFrameInput)
    containerDom.appendChild(inputContainer)


    this.scene = new Scene();


    this.scene = new Scene();
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

    const geo = new BufferGeometry().setFromPoints([]);
    const mat = new LineBasicMaterial()
    this.line = new Line(geo, mat)
    this.scene.add(this.line)

    this.render();
  }

  private resetRender() {
    this.theta = 0
    this.points = []
    this.line.geometry.dispose();
    this.line.geometry = new BufferGeometry().setFromPoints([]);
    this.scene.add(this.line)
  }


  private expandLine(x: number, y: number) {
    this.points.push(new Vector3(x, y, 0))
    this.line.geometry.dispose();
    this.line.geometry = new BufferGeometry().setFromPoints(this.points);
  }


  private r = 300
  private theta = 0
  private lastRenderTime = 0
  private render() {
    requestAnimationFrame(() => this.render());
    const now = performance.now()
    const delta = now - this.lastRenderTime
    // 大体、60FPSぐらいにしたい
    if (1000 / 60 > delta) {
      // skip render
      // return
    }

    this.lastRenderTime = now
    const cosTheta = this.theta * this.cs + this.cd * Math.PI / 180
    const sinTheta = this.theta * this.ss + this.sd * Math.PI / 180
    const x = this.r * Math.cos(cosTheta)
    const y = this.r * Math.sin(sinTheta)
    this.expandLine(x, y)
    this.theta += Math.PI / 180 * this.thetaPerFrame;

    this.renderer.render(this.scene, this.camera);
  }
}
