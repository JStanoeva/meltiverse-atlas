/**
 * 🫧 Fondulith: a teal, foaming anomaly world laced with pink froth,
 * wrapped in a gravity storm that never quite settles down.
 */
import { clamp01, lerp, rand, smooth } from "../core/math.js";
import { PU } from "../core/stage.js";
import { fbm, vnoise } from "../core/noise.js";
import { paintSphere } from "../graphics/textures.js";
import { makePoints, setCol, palette } from "../graphics/primitives.js";
import { PART_VS } from "../graphics/shaders.js";
import { makePlanet } from "./planet.js";

function paintFondulith(x, y, z, o) {
  const w = fbm(x * 2 + 5, y * 2 + 5, z * 2 + 5, 3);
  const n = fbm(x * 3 + w * 2.6, y * 3 - w * 2.2, z * 3 + w * 1.8, 5);
  const ridge = Math.pow(1 - Math.abs(n * 2 - 1), 12);
  const bub = smooth(0.66, 0.74, vnoise(x * 16 + 1, y * 16 + 2, z * 16 + 3));
  const t = clamp01(ridge * 0.95 + bub * 0.7);
  o[0] = lerp(lerp(34, 96, n), 255, t);
  o[1] = lerp(lerp(150, 214, n), 214, t);
  o[2] = lerp(lerp(170, 206, n), 234, t);
  o[4] = 255 * t * 0.5;
  o[5] = 110 * t * 0.5;
  o[6] = 190 * t * 0.5;
}

export function createFondulith() {
  return makePlanet({
    radius: 2.6,
    orbit: 26,
    speed: 0.16,
    phase: 2.4,
    incl: -0.04,
    tilt: 0.5,
    spin: 0.3,
    tex: paintSphere(512, 256, paintFondulith, true),
    emissive: 0.5,
    atmo: 0x7ff5e0,
    atmoI: 1.1,
    halo: 0.12,
  });
}

// the swirling ring of froth around the planet
export function createGravityStorm(p) {
  const N = 700;
  const s = makePoints(N, PART_VS, PU);
  const cols = palette([0x7ff5e0, 0xff9fd0, 0xfff1d6]);
  const data = [];
  for (let i = 0; i < N; i++) {
    const base = p.radius * 1.45 + rand() * p.radius * 1.4;
    data.push({
      a: rand() * Math.PI * 2,
      r: base,
      sp: (0.4 + rand() * 0.9) * (base < p.radius * 2 ? 1.5 : 1),
      h: (rand() - 0.5) * p.radius * 0.5,
      ph: rand() * 6.28,
    });
    setCol(s.col, i, cols[i % 3]);
    s.size[i] = 0.12 + rand() * 0.28;
    s.alpha[i] = 0.35 + rand() * 0.5;
  }
  s.points.rotation.set(0.45, 0, -0.2);
  p.anchor.add(s.points);

  return {
    update({ sdt, elapsed: t }) {
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        d.a += d.sp * sdt;
        const r = d.r + Math.sin(t * 1.7 + d.ph) * 0.25;
        s.pos[i * 3] = Math.cos(d.a) * r;
        s.pos[i * 3 + 1] = d.h + Math.sin(d.a * 3 + d.ph) * 0.18;
        s.pos[i * 3 + 2] = Math.sin(d.a) * r;
      }
      s.geo.attributes.position.needsUpdate = true;
    },
  };
}
