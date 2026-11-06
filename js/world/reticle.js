/** The slowly turning target ring drawn around whatever the camera is focused on. */
import { THREE } from "../core/three.js";
import { scene } from "../core/stage.js";
import { reticleTex } from "../graphics/textures.js";

export function createReticle() {
  const reticle = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: reticleTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    }),
  );
  reticle.visible = false;
  scene.add(reticle);

  return {
    // body: the focused place (or null) · flying: is the camera mid-flight?
    update(dt, body, flying) {
      if (body && body.reticle) {
        body.obj.getWorldPosition(reticle.position);
        const r = body.reticle;
        reticle.scale.set(r, r, 1);
        reticle.material.rotation += dt * 0.35;
        reticle.material.opacity = flying ? 0.25 : 0.7;
        reticle.visible = true;
      } else reticle.visible = false;
    },
  };
}
