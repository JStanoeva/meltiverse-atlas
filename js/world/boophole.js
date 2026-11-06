/** 🌀 The Boophole: an ancient, swirling portal where the Boopstream pours in. */
import { THREE } from "../core/three.js";
import { systemRoot, U } from "../core/stage.js";
import { makeGlow } from "../graphics/primitives.js";

const PORTAL_VS =
  "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }";
const PORTAL_FS = `
  uniform float uTime; varying vec2 vUv;
  void main(){
    vec2 p = vUv - 0.5; float r = length(p) * 2.0; float a = atan(p.y, p.x);
    float s = 0.5 + 0.5 * sin(a * 5.0 + r * 16.0 - uTime * 2.6);
    float s2 = 0.5 + 0.5 * sin(a * 3.0 - r * 9.0 + uTime * 1.3);
    vec3 col = mix(vec3(1.0, 0.31, 0.64), vec3(0.23, 0.84, 1.0), s);
    col = mix(col, vec3(1.0, 0.86, 0.5), (1.0 - smoothstep(0.0, 0.35, r)) * 0.9);
    float alpha = (1.0 - smoothstep(0.75, 1.0, r)) * (0.35 + 0.5 * s * s2 + 0.4 * (1.0 - smoothstep(0.0, 0.4, r)));
    gl_FragColor = vec4(col * alpha, 1.0);
  }`;

export function createBoophole() {
  const g = new THREE.Group();
  g.position.set(178, 16, -92);
  systemRoot.add(g);
  g.lookAt(0, 0, 0);
  const spin = new THREE.Group();
  g.add(spin);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(7, 0.55, 20, 120),
    new THREE.MeshStandardMaterial({
      color: 0xffc9e3,
      emissive: 0xff4fa3,
      emissiveIntensity: 0.9,
      metalness: 0.6,
      roughness: 0.3,
    }),
  );
  spin.add(ring);
  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(7.9, 0.12, 8, 120),
    new THREE.MeshStandardMaterial({
      color: 0xbff4ff,
      emissive: 0x3ad7ff,
      emissiveIntensity: 1.2,
    }),
  );
  spin.add(ring2);
  // Swiss holes around the rim
  for (let k = 0; k < 9; k++) {
    const a = (k / 9) * Math.PI * 2;
    const hole = new THREE.Mesh(
      new THREE.SphereGeometry(0.34, 12, 8),
      new THREE.MeshBasicMaterial({ color: 0x3b0f2a }),
    );
    hole.position.set(Math.cos(a) * 7, Math.sin(a) * 7, 0.42);
    spin.add(hole);
  }
  const disk = new THREE.Mesh(
    new THREE.CircleGeometry(6.8, 96),
    new THREE.ShaderMaterial({
      uniforms: { uTime: U.time },
      vertexShader: PORTAL_VS,
      fragmentShader: PORTAL_FS,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  g.add(disk);
  g.add(makeGlow(0xff4fa3, 44, 0.45));
  g.add(makeGlow(0x3ad7ff, 26, 0.35));
  return {
    group: g,
    spin,
    pick: [ring, disk],
    update({ dt }) {
      spin.rotation.z += 0.3 * dt;
    },
  };
}
