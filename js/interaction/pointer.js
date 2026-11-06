/**
 * POINTER INPUT on the 3D canvas:
 * click a place to fly there, click it again to boop it, hover to highlight it.
 */
import { THREE } from "../core/three.js";
import { canvas, camera } from "../core/stage.js";
import { pickables } from "../world/bodies.js";
import { focusOn, getFocusId } from "../camera/focus.js";
import { isFlying } from "../camera/flights.js";
import { stopTour } from "../camera/tour.js";
import { boop } from "./boops.js";
import { hideHint } from "../ui/dock.js";
import { highlightLabel } from "../ui/labels.js";

const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();

// the id of the place under a screen point, or null
function pick(cx, cy) {
  const r = canvas.getBoundingClientRect();
  ndc.set(
    ((cx - r.left) / r.width) * 2 - 1,
    -((cy - r.top) / r.height) * 2 + 1,
  );
  raycaster.setFromCamera(ndc, camera);
  const hits = raycaster.intersectObjects(pickables, false);
  return hits.length ? hits[0].object.userData.bodyId : null;
}

export function initPointer() {
  // a quick press-and-release without dragging counts as a click
  let down = null;
  canvas.addEventListener("pointerdown", (e) => {
    down = { x: e.clientX, y: e.clientY, t: performance.now() };
    stopTour();
    hideHint();
  });
  canvas.addEventListener("pointerup", (e) => {
    if (!down) return;
    const dx = e.clientX - down.x,
      dy = e.clientY - down.y;
    const quick = performance.now() - down.t < 600;
    down = null;
    if (dx * dx + dy * dy > 36 || !quick) return;
    const id = pick(e.clientX, e.clientY);
    if (!id) return;
    if (id === getFocusId() && !isFlying()) boop(id);
    else focusOn(id);
  });

  // hover: picking is throttled to once per animation frame
  let hoverId = null,
    hoverQueued = false,
    lastMove = null;
  canvas.addEventListener("pointermove", (e) => {
    if (e.buttons) return;
    lastMove = e;
    if (hoverQueued) return;
    hoverQueued = true;
    requestAnimationFrame(() => {
      hoverQueued = false;
      const id = pick(lastMove.clientX, lastMove.clientY);
      if (id === hoverId) return;
      if (hoverId) highlightLabel(hoverId, false);
      hoverId = id;
      if (id) highlightLabel(id, true);
      canvas.classList.toggle("pointing", !!id);
    });
  });
}
