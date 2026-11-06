/** 🛣️ The Grate Galactic Cheese Highway: a glowing trade route with cheese caravans gliding along it. */
import { THREE } from "../core/three.js";
import { systemRoot, U, PU } from "../core/stage.js";
import { rand, smooth, V } from "../core/math.js";
import {
  makeGlow,
  makePoints,
  setCol,
  palette,
} from "../graphics/primitives.js";
import { PART_VS } from "../graphics/shaders.js";

const ROAD_VS =
  "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }";
const ROAD_FS = `
  uniform float uTime; varying vec2 vUv;
  void main(){
    float d = fract(vUv.x * 160.0 - uTime * 0.6);
    float dash = smoothstep(0.0, 0.08, d) * (1.0 - smoothstep(0.45, 0.55, d));
    float fade = smoothstep(0.0, 0.03, vUv.x) * (1.0 - smoothstep(0.55, 1.0, vUv.x));
    vec3 col = mix(vec3(0.89, 0.64, 0.61), vec3(0.96, 0.77, 0.33), dash);
    gl_FragColor = vec4(col * (0.16 + 0.6 * dash) * fade, 1.0);
  }`;

export function createCheeseHighway() {
  const pts = [
    V(-165, -8, 100),
    V(-270, -26, 215),
    V(-480, -55, 350),
    V(-840, -35, 660),
    V(-1450, 25, 1080),
    V(-2300, 90, 1600),
  ];
  const curve = new THREE.CatmullRomCurve3(pts);
  const tube = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 600, 1.4, 10, false),
    new THREE.ShaderMaterial({
      uniforms: { uTime: U.time },
      vertexShader: ROAD_VS,
      fragmentShader: ROAD_FS,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  systemRoot.add(tube);
  const beacon = makeGlow(0xf6c453, 18, 0.6);
  beacon.position.copy(pts[0]);
  systemRoot.add(beacon);

  // the caravans
  const table = curve.getSpacedPoints(999);
  const N = 70;
  const s = makePoints(N, PART_VS, PU);
  const cols = palette([0xffe2a0, 0xf6c453, 0xe2a39b]);
  const data = [];
  for (let i = 0; i < N; i++) {
    data.push({
      t: rand(),
      dir: rand() < 0.5 ? 1 : -1,
      sp: 0.006 + rand() * 0.006,
    });
    setCol(s.col, i, cols[i % 3]);
    s.size[i] = 2.4 + rand() * 1.4;
  }
  systemRoot.add(s.points);
  const anchor = new THREE.Object3D();
  anchor.position.copy(pts[0]).add(V(0, 4, 0));
  systemRoot.add(anchor);

  return {
    tube,
    anchor,
    update({ sdt }) {
      const last = table.length - 1;
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        d.t += d.sp * d.dir * sdt;
        if (d.t > 1) d.t -= 1;
        if (d.t < 0) d.t += 1;
        const p = table[Math.floor(d.t * last)];
        s.pos[i * 3] = p.x;
        s.pos[i * 3 + 1] = p.y + 0.6;
        s.pos[i * 3 + 2] = p.z;
        s.alpha[i] = smooth(0, 0.02, d.t) * (1 - smooth(0.5, 0.95, d.t));
      }
      s.geo.attributes.position.needsUpdate = true;
      s.geo.attributes.aAlpha.needsUpdate = true;
    },
  };
}
