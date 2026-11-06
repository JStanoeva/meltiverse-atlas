/**
 * THE STAGE: renderer, scene, camera, and orbit controls.
 *
 * Importing this module creates the WebGL canvas, so it's only imported once
 * main.js has confirmed three.js loaded. If WebGL itself is unavailable, the
 * import throws a WebGLUnavailableError and main.js shows a friendly message.
 */
import { THREE } from "./three.js";

export class WebGLUnavailableError extends Error {
  constructor(cause) {
    super("WebGL is unavailable", { cause });
    this.name = "WebGLUnavailableError";
  }
}

function createRenderer() {
  try {
    return new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch (err) {
    throw new WebGLUnavailableError(err);
  }
}

export const renderer = createRenderer();
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0a0614, 1);
document.querySelector("#scene").appendChild(renderer.domElement);
export const canvas = renderer.domElement;

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.5,
  30000,
);

// Where "🏰 Whole system" flies to (nudged further out on portrait screens)
const HOME = {
  pos: new THREE.Vector3(0, 64, 228),
  target: new THREE.Vector3(0, 0, 0),
};
export const homeView = () => ({
  pos: HOME.pos.clone(),
  target: HOME.target.clone(),
});
camera.position.set(-320, 1150, 2700);

export const controls = new THREE.OrbitControls(camera, canvas);
Object.assign(controls, {
  enableDamping: true,
  dampingFactor: 0.07,
  minDistance: 1.5,
  maxDistance: 7000,
  rotateSpeed: 0.55,
  zoomSpeed: 0.9,
  panSpeed: 0.6,
});
controls.enabled = false;

scene.add(new THREE.AmbientLight(0x6a5886, 0.42));

// everything that belongs to the star system
export const systemRoot = new THREE.Group();
scene.add(systemRoot);

// Shared uniforms (one object, many materials)
export const U = {
  time: { value: 0 },
  scale: { value: 1 }, // px-per-world-unit factor for sized particles
  pr: { value: renderer.getPixelRatio() },
};
// the uniforms every world-sized particle system needs
export const PU = { uScale: U.scale };

export function onResize() {
  const w = window.innerWidth,
    h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  U.pr.value = renderer.getPixelRatio();
  U.scale.value =
    canvas.height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
  const portrait = w / h < 0.8;
  HOME.pos.set(0, portrait ? 130 : 64, portrait ? 420 : 228);
}
