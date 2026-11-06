/** CAMERA FLIGHTS: smooth, arcing swoops from wherever the camera is to somewhere new. */
import { camera, controls } from "../core/stage.js";
import { easeInOut } from "../core/math.js";

// with reduced motion turned on, flights become instant
const reduceMotion = !!(
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
);

let fly = null;

export const isFlying = () => fly !== null;

// endFn() returns { pos, target } and is re-read every frame, so the
// camera can chase a planet that keeps moving along its orbit
export function startFly(endFn, dur) {
  fly = {
    t: 0,
    dur: reduceMotion ? 0.001 : dur,
    fromPos: camera.position.clone(),
    fromTarget: controls.target.clone(),
    endFn,
  };
  controls.enabled = false;
}

export function updateFly(dt) {
  if (!fly) return;
  fly.t += dt / fly.dur;
  const k = Math.min(fly.t, 1),
    e = easeInOut(k);
  const end = fly.endFn();
  const dist = fly.fromPos.distanceTo(end.pos);
  camera.position.lerpVectors(fly.fromPos, end.pos, e);
  camera.position.y += Math.sin(Math.PI * e) * dist * 0.12;
  controls.target.lerpVectors(fly.fromTarget, end.target, e);
  if (k >= 1) {
    fly = null;
    controls.enabled = true;
  }
}
