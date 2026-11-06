/** 🌠 The Outer Melt: a warm, rose-gold glow beyond the farthest constellations. */
import { THREE } from "../core/three.js";
import { scene, PU } from "../core/stage.js";
import { rand, gauss } from "../core/math.js";
import {
  makeGlow,
  makePoints,
  setCol,
  palette,
} from "../graphics/primitives.js";
import { PART_VS } from "../graphics/shaders.js";

export function createOuterMelt() {
  const g = new THREE.Group();
  g.position.set(-1400, 620, -3600);
  scene.add(g);
  g.add(makeGlow(0xfff1d6, 260, 0.95));
  g.add(makeGlow(0xffd9b0, 620, 0.55));
  g.add(makeGlow(0xe2a39b, 1300, 0.35));
  g.add(makeGlow(0xff4fa3, 2400, 0.12));
  g.add(makeGlow(0x8a5cff, 3600, 0.07));
  // gentle tides of cheddar and memory
  const tilt = new THREE.Group();
  tilt.rotation.set(0.9, 0, 0.3);
  g.add(tilt);
  const N = 900;
  const s = makePoints(N, PART_VS, PU);
  const cols = palette([0xfff1d6, 0xffe2a0, 0xe2a39b, 0xff9fd0]);
  for (let i = 0; i < N; i++) {
    const r = 120 + Math.pow(rand(), 0.7) * 900;
    const a = rand() * Math.PI * 2 + r * 0.004 + (i % 2) * Math.PI;
    s.pos[i * 3] = Math.cos(a) * r;
    s.pos[i * 3 + 1] = gauss() * 40 * (1 - r / 1100);
    s.pos[i * 3 + 2] = Math.sin(a) * r;
    setCol(s.col, i, cols[i % 4]);
    s.size[i] = 6 + rand() * 16;
    s.alpha[i] = 0.2 + rand() * 0.5;
  }
  tilt.add(s.points);
  const disc = s.points;
  return {
    group: g,
    update({ dt }) {
      disc.rotation.y += 0.015 * dt;
    },
  };
}
