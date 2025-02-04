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

export class Spiral extends BaseCanvas {
  private readonly scene: Scene;
  private readonly camera: PerspectiveCamera;
  private readonly defaultCameraDistance: number;
  private readonly light: Light;

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

    const points: Vector3[] = [];
    for (let r = 500, t = 0; r >= 0; r -= 0.5, t += (Math.PI / 180) * 3) {
      const x = Math.cos(t) * r;
      const y = Math.sin(t) * r;
      points.push(new Vector3(x, y, 0));
    }

    const m = new LineBasicMaterial();
    const g = new BufferGeometry().setFromPoints(points);
    const line = new Line(g, m);
    this.scene.add(line);

    this.render();
  }

  private render() {
    requestAnimationFrame(() => this.render());

    this.renderer.render(this.scene, this.camera);
  }
}
