/** SMALL HELPERS: randomness, easing, and interpolation. */
import { THREE } from "./three.js";

export const rand = Math.random;
export const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (e0, e1, x) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
// roughly normal, centred on 0
export const gauss = () => (rand() + rand() + rand() + rand() - 2) * 0.87;
export const easeInOut = (k) =>
  k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;

export const V = (x, y, z) => new THREE.Vector3(x, y, z);

// a random point on the unit sphere, written into v
export function randUnit(v) {
  const u = rand() * 2 - 1,
    t = rand() * Math.PI * 2,
    s = Math.sqrt(1 - u * u);
  return v.set(s * Math.cos(t), u, s * Math.sin(t));
}
