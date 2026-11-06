/** BOOPS 😚👆: bursts of hearts, cheese, and sparkles, plus the jelly wobble. */
import { THREE } from "../core/three.js";
import { scene } from "../core/stage.js";
import { rand, randUnit } from "../core/math.js";
import { heartTex, wedgeTex, sparkleTex } from "../graphics/textures.js";
import { bodies } from "../world/bodies.js";
import { recordBoop } from "./boop-tally.js";
import { refreshBoopCount } from "../ui/ledger.js";

const boopTex = [heartTex, wedgeTex, sparkleTex];
const boopParticles = [];

export function boop(id) {
  const b = bodies[id];
  if (!b) return;
  const origin = b.obj.getWorldPosition(new THREE.Vector3());
  const base = b.boopScale;
  for (let i = 0; i < 24; i++) {
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: boopTex[i % 3],
        transparent: true,
        depthWrite: false,
      }),
    );
    s.position.copy(origin);
    const v = randUnit(new THREE.Vector3()).multiplyScalar(
      base * (0.8 + rand() * 1.2),
    );
    v.y += base * 0.6;
    s.userData = {
      v,
      life: 0,
      max: 1.4 + rand() * 0.8,
      size: base * (0.25 + rand() * 0.3),
    };
    s.scale.set(0.001, 0.001, 1);
    scene.add(s);
    boopParticles.push(s);
  }
  b.squish = 1;
  recordBoop(b.info.entry);
  refreshBoopCount();
}

export function updateBoops(dt) {
  for (let i = boopParticles.length - 1; i >= 0; i--) {
    const s = boopParticles[i],
      u = s.userData;
    u.life += dt;
    const k = u.life / u.max;
    if (k >= 1) {
      scene.remove(s);
      s.material.dispose();
      boopParticles.splice(i, 1);
      continue;
    }
    s.position.addScaledVector(u.v, dt);
    u.v.multiplyScalar(Math.pow(0.2, dt));
    s.material.opacity = 1 - k * k;
    const sc = u.size * (k < 0.15 ? k / 0.15 : 1);
    s.scale.set(sc, sc, 1);
  }
}

export function updateSquish(dt, t) {
  Object.values(bodies).forEach((b) => {
    if (!b.squishTarget || b.squish <= 0) return;
    b.squish *= Math.pow(0.015, dt);
    if (b.squish < 0.01) {
      b.squish = 0;
      b.squishTarget.scale.setScalar(1);
      return;
    }
    const s = 1 + Math.sin(t * 24) * 0.1 * b.squish;
    b.squishTarget.scale.set(s, 2 - s, s);
  });
}
