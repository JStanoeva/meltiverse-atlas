/** 💖 The Orion constellation, with Orion's Star beating at its heart. */
import { THREE } from "../core/three.js";
import { scene } from "../core/stage.js";
import { V } from "../core/math.js";
import { heartTex } from "../graphics/textures.js";
import { makeGlow } from "../graphics/primitives.js";

export function createOrionConstellation() {
  const g = new THREE.Group();
  scene.add(g);
  const dir = V(0.42, 0.1, -1).normalize();
  const center = dir.clone().multiplyScalar(5200);
  const right = new THREE.Vector3().crossVectors(dir, V(0, 1, 0)).normalize();
  const upv = new THREE.Vector3().crossVectors(right, dir).normalize();
  const S = 250;
  const at = (xy) =>
    center
      .clone()
      .addScaledVector(right, xy[0] * S)
      .addScaledVector(upv, xy[1] * S);
  const stars = {
    meissa: [0.05, 2.05],
    betelgeuse: [-1.05, 1.35],
    bellatrix: [0.95, 1.2],
    mintaka: [0.38, 0.05],
    alnilam: [0.0, -0.12],
    alnitak: [-0.36, -0.3],
    saiph: [-0.85, -1.55],
    rigel: [1.0, -1.35],
  };
  const tint = { betelgeuse: 0xffb38a, rigel: 0xcfe8ff };
  Object.keys(stars).forEach((k) => {
    const p = at(stars[k]);
    const big = k === "betelgeuse" || k === "rigel";
    const a = makeGlow(tint[k] || 0xe8f0ff, big ? 110 : 75, 0.95);
    a.position.copy(p);
    g.add(a);
    const b = makeGlow(0xffffff, big ? 30 : 20, 1);
    b.position.copy(p);
    g.add(b);
  });
  const LINES = [
    ["meissa", "betelgeuse"],
    ["meissa", "bellatrix"],
    ["betelgeuse", "alnitak"],
    ["bellatrix", "mintaka"],
    ["mintaka", "alnilam"],
    ["alnilam", "alnitak"],
    ["alnitak", "saiph"],
    ["mintaka", "rigel"],
  ];
  const seg = [];
  LINES.forEach(([a, b]) => {
    seg.push(at(stars[a]), at(stars[b]));
  });
  g.add(
    new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(seg),
      new THREE.LineBasicMaterial({
        color: 0xf6c453,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
    ),
  );
  // the heart star
  const heart = new THREE.Group();
  heart.position.copy(at([0.0, 0.66]));
  g.add(heart);
  const hGlow = makeGlow(0xff4fa3, 230, 0.8);
  heart.add(hGlow);
  const hGold = makeGlow(0xffe2a0, 90, 0.9);
  heart.add(hGold);
  const hShape = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: heartTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  hShape.scale.set(70, 70, 1);
  heart.add(hShape);
  return {
    group: g,
    heart,
    // a slow heartbeat
    update({ elapsed }) {
      const pulse = 1 + 0.22 * Math.sin(elapsed * 2.2);
      hGlow.scale.set(230 * pulse, 230 * pulse, 1);
      hShape.material.opacity = 0.75 + 0.25 * Math.sin(elapsed * 2.2);
    },
  };
}
