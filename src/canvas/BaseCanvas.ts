import { Vector2, WebGLRenderer } from "three";

export class BaseCanvas {
  protected w: number;
  protected h: number;
  protected readonly renderer: WebGLRenderer;
  protected readonly mouse: Vector2 = new Vector2(0, 0);

  constructor(param: {
    w: number;
    h: number;
    renderer: WebGLRenderer;
    containerDom: Element;
  }) {
    this.w = param.w;
    this.h = param.h;
    this.renderer = param.renderer;
    param.containerDom.appendChild(this.renderer.domElement);
    this.renderer.setSize(this.w, this.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  onMouseMoved(x: number, y: number) {
    this.mouse.x = x - this.w / 2;
    this.mouse.y = -(y - this.h / 2);
  }

  onResize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.w, this.h);
  }
}
