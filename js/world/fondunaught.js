/** 🚀 The S.S. Fondunaught: the royal corvette on patrol, trailing pink-to-blue exhaust. */
import { THREE } from "../core/three.js";
import { systemRoot, PU } from "../core/stage.js";
import { lerp } from "../core/math.js";
import { makeGlow, makePoints, setCol } from "../graphics/primitives.js";
import { PART_VS } from "../graphics/shaders.js";

const TRAIL = 80;

// the patrol route: a gently bobbing loop around the inner system
function shipPos(t, out) {
  return out.set(
    Math.cos(t) * 108 + 16,
    Math.sin(t * 2) * 6 + 4,
    Math.sin(t) * 82,
  );
}

function buildShipModel() {
  const ship = new THREE.Group();
  const wobble = new THREE.Group();
  ship.add(wobble);
  const model = new THREE.Group();
  model.scale.setScalar(0.9);
  wobble.add(model);
  const hullMat = new THREE.MeshStandardMaterial({
    color: 0xfff1d6,
    metalness: 0.35,
    roughness: 0.35,
  });
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf6c453,
    metalness: 0.6,
    roughness: 0.3,
    emissive: 0x5a3a00,
    emissiveIntensity: 0.5,
  });
  const roseMat = new THREE.MeshStandardMaterial({
    color: 0xe2a39b,
    metalness: 0.5,
    roughness: 0.35,
  });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x3ad7ff,
    emissive: 0x3ad7ff,
    emissiveIntensity: 0.8,
    roughness: 0.1,
  });

  const hull = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.5, 2.4, 16),
    hullMat,
  );
  hull.rotation.x = Math.PI / 2;
  model.add(hull);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.9, 16), roseMat);
  nose.rotation.x = Math.PI / 2;
  nose.position.z = 1.65;
  model.add(nose);
  const cockpit = new THREE.Mesh(
    new THREE.SphereGeometry(0.26, 16, 12),
    glassMat,
  );
  cockpit.position.set(0, 0.3, 0.7);
  cockpit.scale.set(1, 0.7, 1.6);
  model.add(cockpit);
  const wing = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.07, 0.8), goldMat);
  wing.position.z = -0.3;
  model.add(wing);
  [-1, 1].forEach((s) => {
    const pod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.9, 10),
      roseMat,
    );
    pod.rotation.x = Math.PI / 2;
    pod.position.set(1.5 * s, 0, -0.3);
    model.add(pod);
  });
  // The tail fin is a cheese wedge. Non-negotiable.
  const wedge = new THREE.Shape();
  wedge.moveTo(0, 0);
  wedge.lineTo(0.9, 0);
  wedge.lineTo(0, 0.7);
  wedge.lineTo(0, 0);
  const fin = new THREE.Mesh(
    new THREE.ExtrudeGeometry(wedge, { depth: 0.08, bevelEnabled: false }),
    goldMat,
  );
  fin.rotation.y = -Math.PI / 2;
  fin.position.set(0.04, 0.3, -1.25);
  model.add(fin);
  const e1 = makeGlow(0xff4fa3, 1.8, 0.95);
  e1.position.z = -1.35;
  model.add(e1);
  const e2 = makeGlow(0xffffff, 0.6, 0.9);
  e2.position.z = -1.3;
  model.add(e2);
  // an invisible, generous sphere so the tiny ship is easy to click
  const pick = new THREE.Mesh(
    new THREE.SphereGeometry(3.2, 8, 8),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  ship.add(pick);
  systemRoot.add(ship);
  return { ship, wobble, pick };
}

export function createFondunaught() {
  const { ship, wobble, pick } = buildShipModel();
  let shipT = 0.8;
  shipPos(shipT, ship.position);
  ship.updateMatrixWorld(true);

  // the engine trail starts bunched up behind the ship
  const trail = makePoints(TRAIL, PART_VS, PU);
  const tc1 = new THREE.Color(0xff4fa3),
    tc2 = new THREE.Color(0x3ad7ff),
    tc = new THREE.Color();
  for (let i = 0; i < TRAIL; i++) {
    const k = i / (TRAIL - 1);
    tc.copy(tc1).lerp(tc2, k);
    setCol(trail.col, i, tc);
    trail.size[i] = lerp(1.1, 0.15, k);
    trail.alpha[i] = Math.pow(1 - k, 1.5) * 0.85;
    trail.pos[i * 3] = ship.position.x;
    trail.pos[i * 3 + 1] = ship.position.y;
    trail.pos[i * 3 + 2] = ship.position.z;
  }
  systemRoot.add(trail.points);

  const tmpA = new THREE.Vector3(),
    tmpB = new THREE.Vector3();
  return {
    group: ship,
    wobble,
    pick,
    update({ sdt }) {
      shipT += sdt * 0.05;
      shipPos(shipT, ship.position);
      shipPos(shipT + 0.02, tmpA);
      ship.lookAt(tmpA);
      ship.rotateZ(Math.sin(shipT * 2) * 0.25);
      ship.updateMatrixWorld(true);
      ship.localToWorld(tmpB.set(0, 0, -1.3));
      trail.pos.copyWithin(3, 0, (TRAIL - 1) * 3);
      trail.pos[0] = tmpB.x;
      trail.pos[1] = tmpB.y;
      trail.pos[2] = tmpB.z;
      trail.geo.attributes.position.needsUpdate = true;
    },
  };
}
