import {
  BoxGeometry,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshLambertMaterial,
  Vector3,
} from "three";

export class MeshUtils {
  static genCenterLine(w: number, h: number) {
    const mat = new LineBasicMaterial();
    const genLine = (vectors: Vector3[]) => {
      const geo = new BufferGeometry().setFromPoints(vectors);
      return new Line(geo, mat);
    };

    return [
      genLine([new Vector3(w / 2, 0, 0), new Vector3(-w / 2, 0, 0)]),
      genLine([new Vector3(0, h / 2, 0), new Vector3(0, -h / 2, 0)]),
    ];
  }

  static genGround() {
    const mat = new MeshLambertMaterial();
    const geo = new BoxGeometry(600, 600, 50);
    const mesh = new Mesh(geo, mat);
    mesh.rotateX(Math.PI / 2);
    mesh.position.y = -170;
    return mesh;
  }

  static genStar() {
    const mat = new MeshLambertMaterial({ color: 0x4169e1 });
    mat.transparent = true;
    const geo = new BoxGeometry(5, 75, 5);
    const mesh = new Mesh(geo, mat);
    return mesh;
  }
}
