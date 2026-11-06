/** The Cheese Nebula: big, slowly turning clouds of colored mist. */
import { THREE } from "../core/three.js";
import { scene, systemRoot } from "../core/stage.js";
import { rand, V } from "../core/math.js";
import { nebulaTexture } from "../graphics/textures.js";
import { makeGlow } from "../graphics/primitives.js";

export function createNebula() {
  const nebulae = [];
  const texes = [nebulaTexture(1.7), nebulaTexture(9.3), nebulaTexture(21.1)];
  const clusters = [
    { dir: [-0.7, 0.25, -0.65], cols: [0xff4fa3, 0xe2a39b, 0x8a5cff] },
    { dir: [0.8, -0.1, -0.5], cols: [0x3ad7ff, 0x8a5cff, 0xc7a8ff] },
    { dir: [0.1, 0.55, 0.8], cols: [0xf6c453, 0xe2a39b, 0xff4fa3] },
    { dir: [-0.5, -0.45, 0.7], cols: [0xf6c453, 0x3ad7ff, 0xffe2a0] },
    { dir: [0.35, -0.7, -0.3], cols: [0xff4fa3, 0xf6c453, 0x8a5cff] },
  ];
  clusters.forEach((cl, ci) => {
    const base = V(cl.dir[0], cl.dir[1], cl.dir[2]).normalize();
    for (let k = 0; k < 7; k++) {
      const sp = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: texes[(ci + k) % 3],
          color: cl.cols[k % 3],
          transparent: true,
          opacity: 0.1 + rand() * 0.14,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          rotation: rand() * Math.PI * 2,
        }),
      );
      const d = base
        .clone()
        .add(
          V((rand() - 0.5) * 0.7, (rand() - 0.5) * 0.5, (rand() - 0.5) * 0.7),
        )
        .normalize();
      sp.position.copy(d.multiplyScalar(4800 + rand() * 1600));
      const sc = 2200 + rand() * 2600;
      sp.scale.set(sc, sc, 1);
      sp.userData.spin = (rand() - 0.5) * 0.01;
      scene.add(sp);
      nebulae.push(sp);
    }
  });
  systemRoot.add(makeGlow(0xf6c453, 900, 0.05)); // we live *inside* the Cheese Nebula

  return {
    update({ dt }) {
      nebulae.forEach((n) => {
        n.material.rotation += n.userData.spin * dt;
      });
    },
  };
}
