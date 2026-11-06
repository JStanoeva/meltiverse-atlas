/** ☀️ The First Taste: a churning star of pure flavor with Swiss sunspots. */
import { THREE } from "../core/three.js";
import { systemRoot, U } from "../core/stage.js";
import { makeGlow } from "../graphics/primitives.js";
import { SUN_VS, SUN_FS } from "../graphics/shaders.js";

export function createSun() {
  const group = new THREE.Group();
  systemRoot.add(group);
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(10, 64, 48),
    new THREE.ShaderMaterial({
      uniforms: { uTime: U.time },
      vertexShader: SUN_VS,
      fragmentShader: SUN_FS,
    }),
  );
  group.add(mesh);
  group.add(makeGlow(0xfff3d0, 34, 0.95));
  group.add(makeGlow(0xf6c453, 90, 0.5));
  group.add(makeGlow(0xe2a39b, 220, 0.16));
  group.add(makeGlow(0xff4fa3, 460, 0.06));
  group.add(new THREE.PointLight(0xfff1dc, 1.15, 0));
  return {
    group,
    mesh,
    update({ dt }) {
      mesh.rotation.y += 0.02 * dt;
    },
  };
}
