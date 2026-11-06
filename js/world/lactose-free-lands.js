/** 🗡️ The Lactose-Free Lands: a cracked grey world of blades and exile. 0% cheese. */
import { THREE } from "../core/three.js";
import { lerp, smooth } from "../core/math.js";
import { fbm } from "../core/noise.js";
import { paintSphere } from "../graphics/textures.js";
import { makePlanet, scatterOnSurface } from "./planet.js";

// cracked grey nothing
function paintLactoseFree(x, y, z, o) {
  const n = fbm(x * 3 + 90, y * 3 + 1, z * 3 - 7, 6);
  const c = Math.abs(fbm(x * 7 + 2, y * 7 + 2, z * 7 + 2, 3) * 2 - 1);
  const k = 1 - (1 - smooth(0.0, 0.05, c)) * 0.55;
  o[0] = lerp(70, 158, n) * k;
  o[1] = lerp(72, 160, n) * k;
  o[2] = lerp(84, 172, n) * k;
}

export function createLactoseFreeLands() {
  const lactoseFree = makePlanet({
    radius: 2.6,
    orbit: 140,
    speed: 0.014,
    phase: 1.4,
    incl: 0.05,
    tilt: 0.7,
    spin: 0.05,
    tex: paintSphere(512, 256, paintLactoseFree, false),
    atmo: 0x9aa0aa,
    atmoI: 0.45,
    lineColor: 0x8d929c,
    roughness: 0.6,
    metalness: 0.3,
  });
  const bladeGeo = new THREE.ConeGeometry(0.11, 1, 4);
  bladeGeo.translate(0, 0.5, 0);
  scatterOnSurface(
    lactoseFree.mesh,
    lactoseFree.radius,
    90,
    bladeGeo,
    new THREE.MeshStandardMaterial({
      color: 0xa3a8b3,
      metalness: 0.75,
      roughness: 0.3,
      flatShading: true,
    }),
    0.4,
    1.4,
  );
  return lactoseFree;
}
