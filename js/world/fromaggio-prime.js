/**
 * 🏰 Fromaggio Prime, capital of the Cheese Republic:
 * deep golden seas, yellow grass that glows at night, parmesan snow caps,
 * and the Parmesan Palace twinkling pink on the golden shore.
 */
import { THREE } from "../core/three.js";
import { clamp01, lerp, smooth } from "../core/math.js";
import { fbm } from "../core/noise.js";
import { paintSphere } from "../graphics/textures.js";
import { makeGlow } from "../graphics/primitives.js";
import { makePlanet, paintClouds } from "./planet.js";

function paintFromaggio(x, y, z, o) {
  const n = fbm(x * 1.7 + 3.1, y * 1.7 + 7.7, z * 1.7 + 1.3, 6);
  const g = fbm(x * 6 + 20, y * 6 + 4, z * 6 - 3, 4);
  const land = smooth(0.5, 0.525, n);
  const depth = clamp01((0.51 - n) / 0.2);
  let r = lerp(lerp(255, 208, depth), lerp(230, 252, g), land);
  let gr = lerp(lerp(196, 118, depth), lerp(222, 242, g), land);
  let b = lerp(lerp(72, 18, depth), lerp(96, 142, g), land);
  const cap = smooth(0.8, 0.9, Math.abs(y) + (g - 0.5) * 0.2);
  r = lerp(r, 255, cap);
  gr = lerp(gr, 247, cap);
  b = lerp(b, 226, cap);
  o[0] = r;
  o[1] = gr;
  o[2] = b;
  const glow = land * (1 - cap) * (0.45 + 0.55 * g);
  const coast = smooth(0.475, 0.5, n) * (1 - smooth(0.5, 0.525, n));
  o[4] = 255 * glow + 255 * coast * 0.7;
  o[5] = 200 * glow + 120 * coast * 0.7;
  o[6] = 90 * glow + 190 * coast * 0.7;
}

export function createFromaggioPrime() {
  const texFrom = paintSphere(512, 256, paintFromaggio, true);
  const cloudFrom = paintSphere(
    512,
    256,
    paintClouds([255, 236, 170], 12.3, 0.56),
    false,
  ).map;
  return makePlanet({
    radius: 4.2,
    orbit: 46,
    speed: 0.07,
    phase: 0.6,
    incl: 0.02,
    tilt: 0.28,
    spin: 0.12,
    tex: texFrom,
    clouds: cloudFrom,
    emissive: 0.4,
    atmo: 0xffd36b,
    atmoI: 1.05,
    halo: 0.16,
    roughness: 0.75,
  });
}

// the Parmesan Palace, a tiny pink light on the golden shore
export function createParmesanPalace(fromaggio) {
  const palace = new THREE.Group();
  const lat = 0.42,
    lon = 1.1,
    pr = fromaggio.radius * 1.004;
  palace.position.set(
    Math.cos(lat) * Math.cos(lon) * pr,
    Math.sin(lat) * pr,
    Math.cos(lat) * Math.sin(lon) * pr,
  );
  const palaceGlow = makeGlow(0xff7fc0, 1.5, 0.95);
  palace.add(palaceGlow);
  palace.add(makeGlow(0xfff1d6, 0.45, 1));
  fromaggio.mesh.add(palace);
  return {
    update({ elapsed }) {
      palaceGlow.material.opacity = 0.7 + 0.3 * Math.sin(elapsed * 3);
    },
  };
}
