/** The background starfield and the Milky Whey's dusty band. */
import { THREE } from "../core/three.js";
import { scene, U } from "../core/stage.js";
import { rand, V, randUnit } from "../core/math.js";
import { makePoints, setCol, palette } from "../graphics/primitives.js";
import { STAR_VS } from "../graphics/shaders.js";

export function createStars() {
  const N = 7500,
    DUST = 2600;
  const s = makePoints(N + DUST, STAR_VS, { uTime: U.time, uPR: U.pr });
  const phase = new Float32Array(N + DUST);
  s.geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
  const band = V(0.28, 1, 0.12).normalize(); // the plane of the Milky Whey
  const tints = palette([
    0xfff4e0, 0xffe2a0, 0xcfe6ff, 0xffc7d6, 0xbfefff, 0xffffff,
  ]);
  const dustTints = palette([0xffe2a0, 0xe2a39b, 0xfff1d6, 0xc7a8ff]);
  const v = new THREE.Vector3();
  for (let i = 0; i < N + DUST; i++) {
    randUnit(v);
    const isDust = i >= N;
    if (isDust || rand() < 0.42) {
      const d = v.dot(band);
      v.addScaledVector(band, -d * (isDust ? 0.93 : 0.86)).normalize();
    }
    const r = isDust ? 8200 + rand() * 600 : 7000 + rand() * 2200;
    s.pos[i * 3] = v.x * r;
    s.pos[i * 3 + 1] = v.y * r;
    s.pos[i * 3 + 2] = v.z * r;
    if (isDust) {
      setCol(s.col, i, dustTints[i % 4]);
      s.size[i] = 14 + rand() * 26;
      s.alpha[i] = 0.05 + rand() * 0.08;
    } else {
      const big = rand() < 0.025;
      setCol(s.col, i, tints[(rand() * tints.length) | 0]);
      s.size[i] = big ? 3.2 + rand() * 2.6 : 0.9 + Math.pow(rand(), 2.5) * 2.4;
      s.alpha[i] = big ? 1 : 0.55 + rand() * 0.45;
    }
    phase[i] = rand() * 10;
  }
  scene.add(s.points);
  // they twinkle on the shared U.time uniform, so no update() is needed
  return { points: s.points };
}
