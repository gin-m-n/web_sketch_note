import {
  BufferGeometry,
  CircleGeometry,
  Light,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { calcCameraDistance } from "../util/camera";
import { MeshUtils } from "../util/three";
import { BaseCanvas } from "./BaseCanvas";

export class Canvas extends BaseCanvas {
  static readonly name = "Canvas";
  private readonly scene: Scene;
  private readonly camera: PerspectiveCamera;
  private readonly defaultCameraDistance: number;
  private readonly light: Light;

  private readonly pointer;

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

    const mat = new MeshBasicMaterial();
    const geo = new CircleGeometry(20, 20);
    this.pointer = new Mesh(geo, mat);
    this.scene.add(this.pointer);

    const f = (x: number) => (x / 50) ** 3;
    const points: Vector3[] = [];
    for (let x = -1000; x <= 1000; x += 20) {
      const y = f(x);
      points.push(new Vector3(x, y, 0));
    }

    const m = new LineBasicMaterial();
    const g = new BufferGeometry().setFromPoints(points);
    const line = new Line(g, m);
    this.scene.add(line);

    this.render();
  }

  private past = 0;
  private r = 600;
  private flameCount = 0;
  private render() {
    requestAnimationFrame(() => this.render());
    this.flameCount++;

    const elapsedTime = performance.now();
    const elapsedSec = elapsedTime / 1000;

    if (Math.round(elapsedSec) - this.past >= 1) {
      this.past = Math.round(elapsedSec);
    }

    const theta = elapsedSec * 30;
    this.pointer.position.x = Math.cos(theta) * this.r;
    this.pointer.position.y = Math.sin(theta) * this.r;

    this.r = Math.max(this.r - 0.2, 0);

    this.renderer.render(this.scene, this.camera);
  }
}
