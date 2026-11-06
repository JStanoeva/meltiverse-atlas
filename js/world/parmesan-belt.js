/** 🧀 The Parmesan Belt: a glittering ring of grated parmesan asteroids. */
import { THREE } from "../core/three.js";
import { systemRoot, PU } from "../core/stage.js";
import { rand, gauss } from "../core/math.js";
import { makePoints, setCol, palette } from "../graphics/primitives.js";
import { PART_VS } from "../graphics/shaders.js";

export function createParmesanBelt() {
  const group = new THREE.Group();
  systemRoot.add(group);
  const COUNT = 1400;
  const inst = new THREE.InstancedMesh(
    new THREE.DodecahedronGeometry(0.42, 0),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.92,
      flatShading: true,
    }),
    COUNT,
  );
  const dummy = new THREE.Object3D(),
    c = new THREE.Color();
  for (let i = 0; i < COUNT; i++) {
    const a = rand() * Math.PI * 2,
      r = 112 + gauss() * 4.5;
    dummy.position.set(Math.cos(a) * r, gauss() * 1.2, Math.sin(a) * r);
    dummy.rotation.set(rand() * 6.28, rand() * 6.28, rand() * 6.28);
    const s = 0.3 + Math.pow(rand(), 2.2) * 1.5;
    dummy.scale.set(s, s * (0.35 + rand() * 0.45), s * (0.6 + rand() * 0.6));
    dummy.updateMatrix();
    inst.setMatrixAt(i, dummy.matrix);
    c.setHSL(0.11 + rand() * 0.035, 0.5 + rand() * 0.25, 0.72 + rand() * 0.16);
    inst.setColorAt(i, c);
  }
  group.add(inst);
  // freshly grated parmesan dust
  const D = 1800;
  const dust = makePoints(D, PART_VS, PU);
  const cols = palette([0xfff1d6, 0xffe2a0, 0xf6c453]);
  for (let i = 0; i < D; i++) {
    const a = rand() * Math.PI * 2,
      r = 112 + gauss() * 7;
    dust.pos[i * 3] = Math.cos(a) * r;
    dust.pos[i * 3 + 1] = gauss() * 2;
    dust.pos[i * 3 + 2] = Math.sin(a) * r;
    setCol(dust.col, i, cols[i % 3]);
    dust.size[i] = 0.15 + rand() * 0.35;
    dust.alpha[i] = 0.3 + rand() * 0.5;
  }
  group.add(dust.points);
  // the spot the camera visits
  const anchor = new THREE.Object3D();
  anchor.position.set(Math.cos(0.9) * 112, 2, Math.sin(0.9) * 112);
  group.add(anchor);
  return {
    group,
    anchor,
    update({ sdt }) {
      group.rotation.y += 0.012 * sdt;
    },
  };
}
