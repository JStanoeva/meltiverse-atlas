/** The Boopstream: a river of boops pouring out of deep space into the Boophole. */
import { THREE } from "../core/three.js";
import { systemRoot, PU } from "../core/stage.js";
import { rand, smooth, V, randUnit } from "../core/math.js";
import { makePoints, setCol, palette } from "../graphics/primitives.js";
import { PART_VS } from "../graphics/shaders.js";

// origin: where the Boophole sits; the stream widens as it heads outward
export function createBoopstream(origin) {
  const out = origin.clone().normalize();
  const up = V(0, 1, 0);
  const side = new THREE.Vector3().crossVectors(out, up).normalize();
  const at = (d, s, u) =>
    origin
      .clone()
      .addScaledVector(out, d)
      .addScaledVector(side, s)
      .addScaledVector(up, u);
  const curve = new THREE.CatmullRomCurve3([
    origin.clone(),
    at(60, 25, 12),
    at(260, -70, 70),
    at(700, 140, 40),
    at(1400, -80, 260),
    at(2400, 200, 380),
  ]);
  const table = curve.getSpacedPoints(1499);
  const N = 1300;
  const s = makePoints(N, PART_VS, PU);
  const cols = palette([0xff4fa3, 0x3ad7ff, 0xffe2a0, 0xff9fd0]);
  const data = [];
  for (let i = 0; i < N; i++) {
    data.push({
      t: rand(),
      off: randUnit(new THREE.Vector3()).multiplyScalar(rand()),
      sp: 0.012 + rand() * 0.01,
      size: 0.9 + rand() * 1.6,
      a: 0.4 + rand() * 0.6,
    });
    setCol(s.col, i, cols[i % 4]);
  }
  systemRoot.add(s.points);

  return {
    update({ sdt }) {
      const last = table.length - 1;
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        d.t -= d.sp * sdt;
        if (d.t < 0) d.t += 1;
        const p = table[Math.floor(d.t * last)];
        const spread = 1.2 + d.t * 70;
        s.pos[i * 3] = p.x + d.off.x * spread;
        s.pos[i * 3 + 1] = p.y + d.off.y * spread;
        s.pos[i * 3 + 2] = p.z + d.off.z * spread;
        s.size[i] = d.size * (1 + d.t * 9);
        s.alpha[i] = d.a * smooth(0, 0.03, d.t) * (1 - smooth(0.8, 1, d.t));
      }
      s.geo.attributes.position.needsUpdate = true;
      s.geo.attributes.aSize.needsUpdate = true;
      s.geo.attributes.aAlpha.needsUpdate = true;
    },
  };
}
