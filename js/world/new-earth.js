/** 💜 New Earth: blue oceans and green flora under a storm-free lilac sky. */
import { clamp01, lerp, smooth } from "../core/math.js";
import { fbm } from "../core/noise.js";
import { paintSphere } from "../graphics/textures.js";
import { makePlanet, paintClouds } from "./planet.js";

// (the lilac sky is its atmosphere)
function paintNewEarth(x, y, z, o) {
  const n = fbm(x * 2 + 40, y * 2 + 11, z * 2 + 5, 6);
  const g = fbm(x * 7 + 9, y * 7 - 2, z * 7 + 6, 4);
  const land = smooth(0.52, 0.545, n);
  const depth = clamp01((0.53 - n) / 0.2);
  const r = lerp(lerp(52, 12, depth), lerp(48, 128, g), land);
  const gr = lerp(lerp(132, 46, depth), lerp(132, 196, g), land);
  const b = lerp(lerp(222, 140, depth), lerp(70, 104, g), land);
  const cap = smooth(0.82, 0.92, Math.abs(y) + (g - 0.5) * 0.2);
  o[0] = lerp(r, 245, cap);
  o[1] = lerp(gr, 248, cap);
  o[2] = lerp(b, 255, cap);
}

export function createNewEarth() {
  return makePlanet({
    radius: 3.4,
    orbit: 68,
    speed: 0.045,
    phase: 3.9,
    incl: 0.03,
    tilt: 0.4,
    spin: 0.1,
    tex: paintSphere(512, 256, paintNewEarth, false),
    clouds: paintSphere(
      512,
      256,
      paintClouds([255, 255, 255], 30.1, 0.54),
      false,
    ).map,
    atmo: 0xc7a8ff,
    atmoI: 1.6,
    halo: 0.15,
    roughness: 0.7,
  });
}
