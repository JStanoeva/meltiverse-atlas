/** THE MELT LOOP: the animation loop that runs every frame. */
import { THREE } from "./core/three.js";
import { renderer, scene, camera, controls, U } from "./core/stage.js";
import { updateFly, isFlying } from "./camera/flights.js";
import { updateFollow, getFocusedBody } from "./camera/focus.js";
import { updateViewShift } from "./camera/view-shift.js";
import { updateBoops, updateSquish } from "./interaction/boops.js";
import { updateLabels } from "./ui/labels.js";

const clock = new THREE.Clock();
let elapsed = 0;
let timeScale = 1; // the "Melt speed" slider

export function setTimeScale(s) {
  timeScale = s;
}

export function startLoop(world) {
  // dt: real seconds since last frame · sdt: dt scaled by melt speed
  // (orbits use sdt, so pausing the melt freezes them) · elapsed: total seconds
  const frame = { dt: 0, sdt: 0, elapsed: 0 };

  function tick() {
    requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    elapsed += dt;
    frame.dt = dt;
    frame.sdt = dt * timeScale;
    frame.elapsed = elapsed;
    U.time.value = elapsed;

    world.update(frame);
    updateBoops(dt);
    updateSquish(dt, elapsed);

    scene.updateMatrixWorld();
    updateFly(dt);
    updateFollow();
    controls.update();
    updateViewShift(dt);
    camera.updateMatrixWorld();

    world.reticle.update(dt, getFocusedBody(), isFlying());
    updateLabels();
    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
}
