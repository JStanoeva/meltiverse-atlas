/**
 * 3D BUILDING BLOCKS shared by many places in the system:
 * glow sprites, particle clouds, fresnel atmospheres, and dashed orbit lines.
 */
import { THREE } from "../core/three.js";
import { V } from "../core/math.js";
import { glowTex } from "./textures.js";
import { ATMO_VS, ATMO_FS, POINT_FS } from "./shaders.js";

// A soft additive glow sprite
export function makeGlow(color, size, opacity) {
  const s = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTex,
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  s.scale.set(size, size, 1);
  return s;
}

// A cloud of n glowing points. Fill in pos/col/size/alpha, then add `points`.
export function makePoints(n, vs, uniforms) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(n * 3),
    col = new Float32Array(n * 3),
    size = new Float32Array(n),
    alpha = new Float32Array(n);
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
  geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  geo.setAttribute("aAlpha", new THREE.BufferAttribute(alpha, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vs,
    fragmentShader: POINT_FS,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  return { points, geo, pos, col, size, alpha };
}
export const setCol = (arr, i, c) => {
  arr[i * 3] = c.r;
  arr[i * 3 + 1] = c.g;
  arr[i * 3 + 2] = c.b;
};
export const palette = (hexes) => hexes.map((h) => new THREE.Color(h));

// Soft fresnel atmosphere shell
export function makeAtmosphere(radius, color, intensity, power) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, 48, 32),
    new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uIntensity: { value: intensity },
        uPower: { value: power },
      },
      vertexShader: ATMO_VS,
      fragmentShader: ATMO_FS,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
}

// Every orbit line is remembered, so the "Orbits" button can hide them all
const orbitLines = [];
export function orbitLine(r, incl, color, opacity) {
  const pts = [];
  for (let i = 0; i <= 256; i++) {
    const a = (i / 256) * Math.PI * 2;
    pts.push(V(Math.cos(a) * r, Math.sin(a) * r * incl, Math.sin(a) * r));
  }
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineDashedMaterial({
      color,
      dashSize: Math.max(0.5, r * 0.035),
      gapSize: Math.max(0.4, r * 0.025),
      transparent: true,
      opacity,
      depthWrite: false,
    }),
  );
  line.computeLineDistances();
  orbitLines.push(line);
  return line;
}
export function setOrbitsVisible(on) {
  orbitLines.forEach((l) => {
    l.visible = on;
  });
}
