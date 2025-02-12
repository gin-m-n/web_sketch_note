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

export class ArchimedeanSpiral extends BaseCanvas {
  static readonly name = "ArchimedeanSpiral";
  private readonly scene: Scene;
  private readonly camera: Camera;
  private points: Vector3[] = [];
  private readonly line

  constructor(containerDom: Element) {
    super({
      w: window.innerWidth,
      h: window.innerHeight,
      containerDom: containerDom,
      renderer: new WebGLRenderer(),
    });

    this.scene = new Scene();

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

    this.lastRenderTime = now

    // 極形式: r = αΘ (これを満たす任意の点について: その点と原点とがつくる線分はの長さはr であり、偏角Θをつくりだす)
    const a = 10
    const r = a * this.theta
    // Θの向きはcos,sinで表現する その点をr倍すれば、極形式: r = aΘ を表現できる
    const x = r * Math.cos(this.theta)
    const y = r * Math.sin(this.theta)
    this.points.push(new Vector3(x, y, 0))
    this.updateLine()

    this.theta += Math.PI / 180 * 4;

    this.renderer.render(this.scene, this.camera);
  }
}
