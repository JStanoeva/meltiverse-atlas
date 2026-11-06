/** Floating name tags that follow each place across the screen. */
import { THREE } from "../core/three.js";
import { camera } from "../core/stage.js";
import { bodies } from "../world/bodies.js";

const labelsLayer = document.querySelector("#labels");
let labelsOn = true;

// onSelect(id) runs when a label is clicked
export function createLabels({ onSelect }) {
  Object.values(bodies).forEach((b) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "tag off" + (b.minor ? " minor" : "");
    el.style.setProperty("--c", b.color);
    const dot = document.createElement("i");
    const txt = document.createElement("span");
    txt.textContent = b.name;
    el.append(dot, txt);
    el.addEventListener("click", () => onSelect(b.id));
    labelsLayer.appendChild(el);
    b.label = el;
    b.labelShown = false;
  });
}

export function setLabelsVisible(on) {
  labelsOn = on;
}

export function setActiveLabel(id) {
  Object.values(bodies).forEach(
    (b) => b.label && b.label.classList.toggle("active", b.id === id),
  );
}

// the hover highlight while the pointer is over a place in 3D
export function highlightLabel(id, on) {
  const b = bodies[id];
  if (b && b.label) b.label.classList.toggle("hot", on);
}

/* ---------- placement (world → screen), once per frame ---------- */
const tmpW = new THREE.Vector3(),
  tmpP = new THREE.Vector3(),
  camDir = new THREE.Vector3(),
  toObj = new THREE.Vector3();

function showLabel(b, on) {
  if (b.labelShown === on) return;
  b.labelShown = on;
  b.label.classList.toggle("off", !on);
}

export function updateLabels() {
  const w = window.innerWidth,
    h = window.innerHeight;
  camera.getWorldDirection(camDir);
  Object.values(bodies).forEach((b) => {
    if (!b.label) return;
    if (!labelsOn) {
      showLabel(b, false);
      return;
    }
    b.obj.getWorldPosition(tmpW);
    const dist = tmpW.distanceTo(camera.position);
    if (b.maxDist && dist > b.maxDist) {
      showLabel(b, false);
      return;
    }
    toObj.subVectors(tmpW, camera.position);
    if (toObj.dot(camDir) <= 0) {
      showLabel(b, false);
      return;
    }
    tmpP.copy(tmpW);
    tmpP.y += b.lift;
    tmpP.project(camera);
    const x = (tmpP.x * 0.5 + 0.5) * w,
      y = (-tmpP.y * 0.5 + 0.5) * h;
    if (x < -150 || x > w + 150 || y < -60 || y > h + 60) {
      showLabel(b, false);
      return;
    }
    b.label.style.transform = `translate3d(${x.toFixed(1)}px, ${(y - 4).toFixed(1)}px, 0) translate(-50%, -100%)`;
    showLabel(b, true);
  });
}
