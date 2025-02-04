import {
  Camera,
  CircleGeometry,
  ConeGeometry,
  Light,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} from "three";
import { MeshUtils } from "../util/three";
import { BaseCanvas } from "./BaseCanvas";

export class Bullet1 extends BaseCanvas {
  static readonly name = "Bullet1";
  private readonly scene: Scene;
  private readonly camera: Camera;
  private readonly light: Light;

  private readonly mousePointer;
  private centerBullets: ReturnType<typeof genBullet>[] = [];
  private leftBullets: ReturnType<typeof genBullet>[] = [];
  private rightBullets: ReturnType<typeof genBullet>[] = [];

  constructor(containerDom: Element) {
    const renderer = new WebGLRenderer();
    renderer.domElement.style.cursor = "none";
    super({
      w: window.innerWidth,
      h: window.innerHeight,
      containerDom: containerDom,
      renderer: renderer,
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

    this.light = new PointLight(0xffffff, 200000);
    this.light.position.set(0, 100, 200);
    this.scene.add(this.light);

    const pointerWidth = 15;
    this.mousePointer = new Mesh(
      new ConeGeometry(pointerWidth, pointerWidth * Math.sqrt(3)),
      new MeshBasicMaterial({ color: 0xffffff })
    );
    this.scene.add(this.mousePointer);

    MeshUtils.genCenterLine(this.w, this.h).forEach((l) => this.scene.add(l));

    this.render();
  }

  private deleteLimitOverBullet(
    lane: "centerBullets" | "leftBullets" | "rightBullets"
  ) {
    const end = this[lane].length - this.BULLET_LIMIT;
    this[lane].slice(0, end).forEach((b) => this.scene.remove(b));
    this[lane] = this[lane].slice(end);
  }

  private frame = 0;
  private readonly BULLET_LIMIT = 100;
  private render() {
    requestAnimationFrame(() => this.render());

    this.mousePointer.position.set(this.mouse.x, this.mouse.y, 0);

    // gen bullet
    if (this.frame % 20 == 0) {
      const bullets = Array(3)
        .fill(0)
        .map(() => {
          const bullet = genBullet(5);
          bullet.position.set(this.mouse.x, this.mouse.y, 0);
          this.scene.add(bullet);
          return bullet;
        });

      this.centerBullets.push(bullets[0]);
      this.leftBullets.push(bullets[1]);
      this.rightBullets.push(bullets[2]);
    }

    // delete bullet
    if (this.centerBullets.length > this.BULLET_LIMIT) {
      this.deleteLimitOverBullet("centerBullets");
    }
    if (this.rightBullets.length > this.BULLET_LIMIT) {
      this.deleteLimitOverBullet("rightBullets");
    }
    if (this.leftBullets.length > this.BULLET_LIMIT) {
      this.deleteLimitOverBullet("leftBullets");
    }

    // move bullet
    this.centerBullets.forEach((b) => {
      b.position.set(
        b.position.x + Math.cos(Math.PI / 2),
        b.position.y + Math.sin(Math.PI / 2),
        0
      );
    });
    this.leftBullets.forEach((b) => {
      b.position.set(
        b.position.x + Math.cos(Math.PI / 3),
        b.position.y + Math.sin(Math.PI / 3),
        0
      );
    });
    this.rightBullets.forEach((b) => {
      b.position.set(
        b.position.x + Math.cos(Math.PI * (2 / 3)),
        b.position.y + Math.sin(Math.PI * (2 / 3)),
        0
      );
    });

    this.renderer.render(this.scene, this.camera);
    this.frame++;
  }
}

const genBullet = (size: number) =>
  new Mesh(
    new CircleGeometry(size),
    new MeshBasicMaterial({ color: 0xff3333 })
  );
