/** 🌙 The Twin Ricotta Moons: creamy, with suspiciously Swiss craters. */
import { lerp, smooth } from "../core/math.js";
import { fbm, vnoise } from "../core/noise.js";
import { paintSphere } from "../graphics/textures.js";
import { makeMoon } from "./planet.js";

const paintRicotta = (seed) => (x, y, z, o) => {
  const n = fbm(x * 5 + seed, y * 5 - seed, z * 5, 5);
  const k =
    1 - smooth(0.7, 0.76, vnoise(x * 9 + seed, y * 9, z * 9 - seed)) * 0.2;
  o[0] = lerp(232, 255, n) * k;
  o[1] = lerp(224, 250, n) * k;
  o[2] = lerp(204, 236, n) * k;
};

// returns [Ricotta I, Ricotta II], both circling Fromaggio Prime
export function createRicottaMoons(fromaggio) {
  return [
    makeMoon(fromaggio, {
      radius: 0.85,
      dist: 8,
      speed: 0.35,
      phase: 0.4,
      incl: 0.18,
      tex: paintSphere(256, 128, paintRicotta(3.3), false).map,
    }),
    makeMoon(fromaggio, {
      radius: 0.68,
      dist: 11,
      speed: 0.22,
      phase: 3.1,
      incl: -0.12,
      tex: paintSphere(256, 128, paintRicotta(8.8), false).map,
    }),
  ];
}
