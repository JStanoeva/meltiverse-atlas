/** FOCUS: which place the camera is visiting, and keeping up with it as it orbits. */
import { THREE } from "../core/three.js";
import { camera, controls, homeView } from "../core/stage.js";
import { bodies } from "../world/bodies.js";
import { startFly, isFlying } from "./flights.js";
import { openLedger, closeLedger } from "../ui/ledger.js";
import { setActiveNav } from "../ui/atlas-nav.js";
import { setActiveLabel } from "../ui/labels.js";

let focusId = null;

export const getFocusId = () => focusId;
export const getFocusedBody = () => (focusId ? bodies[focusId] : null);

function setActive(id) {
  setActiveNav(id);
  setActiveLabel(id);
}

// Fly to a place and open its ledger entry
export function focusOn(id) {
  const b = bodies[id];
  if (!b) return;
  focusId = id;
  const p = b.obj.getWorldPosition(new THREE.Vector3());
  const dir = camera.position.clone().sub(p);
  if (dir.lengthSq() < 1e-6) dir.set(0, 0.3, 1);
  dir.normalize();
  if (!b.far) {
    dir.y = Math.max(dir.y, 0.22);
    dir.normalize();
  }
  // narrow portrait screens get a little more breathing room
  const roomy =
    camera.aspect < 1 ? Math.sqrt(Math.min(2.2, 0.95 / camera.aspect)) : 1;
  const offset = dir.multiplyScalar(b.focusDist * roomy);
  const travel = camera.position.distanceTo(p.clone().add(offset));
  const dur = Math.min(3.6, Math.max(1.6, 1.3 + Math.log10(travel + 1) * 0.6));
  startFly(() => {
    const t = b.obj.getWorldPosition(new THREE.Vector3());
    return { target: t, pos: t.clone().add(offset) };
  }, dur);
  openLedger(b);
  setActive(id);
}

// Back to the overview of the whole system
export function goHome(dur) {
  focusId = null;
  setActive(null);
  closeLedger();
  startFly(homeView, dur);
}

// Once a flight lands, ride along with the focused place as it moves
const tmpF = new THREE.Vector3(),
  tmpD = new THREE.Vector3();
export function updateFollow() {
  if (isFlying() || !focusId) return;
  const b = bodies[focusId];
  if (b.far) return;
  b.obj.getWorldPosition(tmpF);
  tmpD.subVectors(tmpF, controls.target);
  camera.position.add(tmpD);
  controls.target.copy(tmpF);
}
