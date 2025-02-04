import {
  BufferGeometry,
  Light,
  Line,
  LineBasicMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { calcCameraDistance } from "../util/camera";
import { MeshUtils } from "../util/three";
import { BaseCanvas } from "./BaseCanvas";

export class Functional extends BaseCanvas {
  static readonly name = "Functional";
  private readonly scene: Scene;
  private readonly camera: PerspectiveCamera;
  private readonly defaultCameraDistance: number;
  private readonly light: Light;

  private readonly points: Vector3[] = [];
  private line;

  constructor(containerDom: Element) {
    super({
      w: window.innerWidth,
      h: window.innerHeight,
      containerDom: containerDom,
      renderer: new WebGLRenderer(),
    });

    this.scene = new Scene();

    const fov = 60;
    this.defaultCameraDistance = calcCameraDistance(fov, this.h);
    this.camera = new PerspectiveCamera(fov, this.w / this.h, 1);
    this.camera.position.z = this.defaultCameraDistance;

    this.light = new PointLight(0xffffff, 200000);
    this.light.position.set(0, 100, 200);
    this.scene.add(this.light);

    MeshUtils.genCenterLine(this.w, this.h).forEach((l) => this.scene.add(l));

    const f = (x: number) => (x / 80) ** 3 + (-x / 30) ** 2;
    for (let x = -1000; x <= 1000; x += 20) {
      const y = f(x);
      this.points.push(new Vector3(x, y, 0));
    }

    const m = new LineBasicMaterial();
    const g = new BufferGeometry().setFromPoints([]);
    const line = new Line(g, m);
    this.scene.add(line);
    this.line = line;

    this.render();
  }

  private cnt = 0;
  private render() {
    requestAnimationFrame(() => this.render());

    const idx = this.cnt / 4;
    if (idx <= this.points.length) {
      this.line.geometry.dispose();
      this.line.geometry = new BufferGeometry().setFromPoints(
        this.points.slice(0, idx)
      );
    }

    this.cnt++;

    this.renderer.render(this.scene, this.camera);
  }
}
