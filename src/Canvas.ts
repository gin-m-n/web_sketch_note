import {
  Light,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { SegmentCharactor, SegmentNumbers } from "./Segument";
import { TileManager } from "./Background";
import { MeshUtils } from "./MeshUtils";
import { calcCameraDistance } from "./cameraUtils";

export const hhmmss = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const hh = (hours < 10 ? `0${hours}` : hours.toString()) as `${number}`;
  const mm = (minutes < 10 ? `0${minutes}` : minutes.toString()) as `${number}`;
  const ss = (seconds < 10 ? `0${seconds}` : seconds.toString()) as `${number}`;

  return {
    hh,
    mm,
    ss,
  };
};

export class Canvas {
  private readonly w: number;
  private readonly h: number;
  private readonly renderer: WebGLRenderer;
  private readonly scene: Scene;
  private readonly camera: PerspectiveCamera;
  private readonly defaultCameraDistance: number;
  private readonly light: Light;
  private readonly mouse: Vector2 = new Vector2(0, 0);
  private readonly starts;
  private readonly tileManager;
  private starDistance = 420;
  private clockCharactor: {
    hh: SegmentNumbers | undefined;
    colon1: SegmentCharactor | undefined;
    mm: SegmentNumbers | undefined;
    colon2: SegmentCharactor | undefined;
    ss: SegmentNumbers | undefined;
  } = {
    hh: undefined,
    colon1: undefined,
    mm: undefined,
    colon2: undefined,
    ss: undefined,
  };

  constructor(containerDom: Element) {
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.w, this.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    containerDom.appendChild(this.renderer.domElement);

    this.scene = new Scene();

    this.drawTime();

    const fov = 60;
    this.defaultCameraDistance = calcCameraDistance(fov, this.h);
    this.camera = new PerspectiveCamera(fov, this.w / this.h, 1);
    this.camera.position.z = this.defaultCameraDistance;

    this.light = new PointLight(0xffffff, 200000);
    this.light.position.set(0, 100, 200);
    this.scene.add(this.light);

    this.starts = Array(60)
      .fill(0)
      .map(() => MeshUtils.genStar());
    this.starts.forEach((s) => {
      this.scene.add(s);
    });

    this.tileManager = new TileManager(new Vector3(0, 0, -1000), 200, 14, 30);
    this.tileManager.addScene(this.scene);

    this.render();
  }

  onMouseMoved(x: number, y: number) {
    this.mouse.x = x - this.w / 2;
    this.mouse.y = -(y - this.h / 2);
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private past = 0;
  private render() {
    requestAnimationFrame(() => this.render());

    const sec = performance.now() / 1000;
    if (Math.round(sec) - this.past >= 1) {
      this.drawTime();
      this.past = Math.round(sec);
    }

    this.clockCharactor.hh?.wave(sec);
    this.clockCharactor.colon1?.wave(sec + 1);
    this.clockCharactor.mm?.wave(sec + 2);
    this.clockCharactor.colon2?.wave(sec + 3);
    this.clockCharactor.ss?.wave(sec + 4);

    this.starts.forEach((star, idx) => {
      const t = ((2 * Math.PI) / this.starts.length) * idx + sec * 0.6;

      star.position.z = Math.cos(t) * this.starDistance;
      star.position.x = Math.sin(t) * this.starDistance;
      star.position.y =
        50 + Math.sin(t + Math.PI * (3 / 2)) * 0.4 * this.starDistance;

      const tan2Theta = Math.atan2(star.position.z, star.position.x);
      if (tan2Theta >= 0) {
        star.material.opacity = Math.abs(Math.cos(tan2Theta));
      } else {
        star.material.opacity = 1;
      }
    });

    this.tileManager.wave(sec);

    this.renderer.render(this.scene, this.camera);
  }

  private drawTime() {
    const cellSize = 30;
    const { hh, mm, ss } = hhmmss(new Date(Date.now()));
    if (this.clockCharactor.hh?.n !== hh) {
      this.clockCharactor.hh?.deleteFromScene(this.scene);
      const h = new SegmentNumbers(hh, cellSize).move(-cellSize * 10, 0);
      h.addScene(this.scene);
      this.clockCharactor.hh = h;
    }

    if (!this.clockCharactor.colon1) {
      const c1 = new SegmentCharactor(":", cellSize).move(-cellSize * 5, 0);
      c1.addScene(this.scene);
      this.clockCharactor.colon1 = c1;
    }

    if (this.clockCharactor.mm?.n !== mm) {
      this.clockCharactor.mm?.deleteFromScene(this.scene);
      const m = new SegmentNumbers(mm, cellSize).move(0, 0);
      m.addScene(this.scene);
      this.clockCharactor.mm = m;
    }

    if (!this.clockCharactor.colon2) {
      const c2 = new SegmentCharactor(":", cellSize).move(cellSize * 5, 0);
      c2.addScene(this.scene);
      this.clockCharactor.colon2 = c2;
    }

    if (this.clockCharactor.ss?.n !== ss) {
      this.clockCharactor.ss?.deleteFromScene(this.scene);
      const s = new SegmentNumbers(ss, cellSize).move(cellSize * 10, 0);
      s.addScene(this.scene);
      this.clockCharactor.ss = s;
    }
  }
}
