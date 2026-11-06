/** 💎 Relicotta: an overgrown relic world of moss and rock, dotted with glowing blue stones. */
import { THREE } from "../core/three.js";
import { lerp, smooth } from "../core/math.js";
import { fbm, vnoise } from "../core/noise.js";
import { paintSphere } from "../graphics/textures.js";
import { makePlanet, scatterOnSurface } from "./planet.js";

function paintRelicotta(x, y, z, o) {
  const n = fbm(x * 2.4 + 70, y * 2.4 + 3, z * 2.4 + 9, 6);
  const m = fbm(x * 8 + 5, y * 8 + 5, z * 8 + 5, 4);
  const rock = smooth(0.54, 0.6, n);
  const r = lerp(lerp(24, 70, m), lerp(92, 128, m), rock);
  const g = lerp(lerp(60, 130, m), lerp(86, 112, m), rock);
  const b = lerp(lerp(42, 66, m), lerp(76, 104, m), rock);
  const s = vnoise(x * 24 + 3, y * 24 + 3, z * 24 + 3);
  const glow = smooth(0.8, 0.87, s) * (0.35 + 0.65 * rock);
  o[0] = lerp(r, 120, glow);
  o[1] = lerp(g, 236, glow);
  o[2] = lerp(b, 255, glow);
  o[4] = 116 * glow;
  o[5] = 215 * glow;
  o[6] = 255 * glow;
}

export function createRelicotta() {
  const relicotta = makePlanet({
    radius: 3.0,
    orbit: 90,
    speed: 0.03,
    phase: 5.2,
    incl: -0.025,
    tilt: 0.15,
    spin: 0.09,
    tex: paintSphere(512, 256, paintRelicotta, true),
    emissive: 0.9,
    atmo: 0x5fe0ff,
    atmoI: 1.0,
    halo: 0.1,
  });
  // glowing blue crystals poking out of the moss
  scatterOnSurface(
    relicotta.mesh,
    relicotta.radius,
    60,
    new THREE.IcosahedronGeometry(0.13, 0),
    new THREE.MeshStandardMaterial({
      color: 0x9ff0ff,
      emissive: 0x3ad7ff,
      emissiveIntensity: 1.3,
      flatShading: true,
    }),
    0.8,
    1.8,
  );
  return relicotta;
}
