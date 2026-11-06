/**
 * PLANET & MOON FACTORIES
 * Shared machinery for every orbiting world. Each world's own file
 * (fromaggio-prime.js, new-earth.js, …) supplies the painter and options.
 */
import { THREE } from "../core/three.js";
import { systemRoot } from "../core/stage.js";
import { rand, smooth, V, randUnit } from "../core/math.js";
import { fbm } from "../core/noise.js";
import { makeAtmosphere, makeGlow, orbitLine } from "../graphics/primitives.js";

const orbitGroup = new THREE.Group();
systemRoot.add(orbitGroup);

function positionPlanet(p) {
  p.anchor.position.set(
    Math.cos(p.angle) * p.orbit,
    Math.sin(p.angle) * p.orbit * p.incl,
    Math.sin(p.angle) * p.orbit,
  );
}

/**
 * Builds a planet on its orbit and returns it.
 * anchor: follows the orbit · tilt: the axial tilt (and boop squish target)
 * mesh: the spinning, clickable surface · update(frame): call once per frame
 */
export function makePlanet(o) {
  const anchor = new THREE.Object3D();
  systemRoot.add(anchor);
  const tilt = new THREE.Object3D();
  tilt.rotation.z = o.tilt;
  anchor.add(tilt);
  const mat = new THREE.MeshStandardMaterial({
    map: o.tex.map,
    roughness: o.roughness ?? 0.9,
    metalness: o.metalness ?? 0,
  });
  if (o.tex.glow) {
    mat.emissiveMap = o.tex.glow;
    mat.emissive = new THREE.Color(0xffffff);
    mat.emissiveIntensity = o.emissive ?? 0.35;
  }
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(o.radius, 72, 48), mat);
  tilt.add(mesh);
  let clouds = null;
  if (o.clouds) {
    clouds = new THREE.Mesh(
      new THREE.SphereGeometry(o.radius * 1.022, 72, 48),
      new THREE.MeshStandardMaterial({
        map: o.clouds,
        transparent: true,
        depthWrite: false,
        roughness: 1,
      }),
    );
    tilt.add(clouds);
  }
  tilt.add(
    makeAtmosphere(o.radius * 1.1, o.atmo, o.atmoI ?? 1.2, o.atmoP ?? 2.6),
  );
  if (o.halo) anchor.add(makeGlow(o.atmo, o.radius * 5, o.halo));
  orbitGroup.add(orbitLine(o.orbit, o.incl, o.lineColor ?? 0xf6c453, 0.32));
  const p = Object.assign({}, o, {
    anchor,
    tilt,
    mesh,
    clouds,
    angle: o.phase,
    update({ sdt }) {
      p.angle += p.speed * sdt;
      positionPlanet(p);
      p.mesh.rotation.y += p.spin * sdt;
      if (p.clouds) p.clouds.rotation.y += p.spin * 1.3 * sdt;
    },
  });
  positionPlanet(p);
  return p;
}

export function makeMoon(parent, o) {
  const pivot = new THREE.Object3D();
  pivot.rotation.set(o.incl, 0, o.incl * 0.5);
  parent.anchor.add(pivot);
  const spin = new THREE.Object3D();
  spin.rotation.y = o.phase;
  pivot.add(spin);
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(o.radius, 48, 32),
    new THREE.MeshStandardMaterial({ map: o.tex, roughness: 0.95 }),
  );
  mesh.position.x = o.dist;
  spin.add(mesh);
  const ring = orbitLine(o.dist, 0, 0xfff1d6, 0.22);
  pivot.add(ring);
  return {
    spin,
    mesh,
    speed: o.speed,
    update({ sdt }) {
      spin.rotation.y += o.speed * sdt;
      mesh.rotation.y += 0.2 * sdt;
    },
  };
}

// Sprinkle `count` instanced shapes (crystals, blades…) over a planet's surface
export function scatterOnSurface(
  mesh,
  radius,
  count,
  geo,
  mat,
  minLen,
  maxLen,
) {
  const inst = new THREE.InstancedMesh(geo, mat, count);
  const up = V(0, 1, 0),
    n = new THREE.Vector3(),
    q = new THREE.Quaternion(),
    m4 = new THREE.Matrix4(),
    sc = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    randUnit(n);
    q.setFromUnitVectors(up, n);
    const len = minLen + rand() * (maxLen - minLen);
    sc.set(1, len, 1);
    m4.compose(n.clone().multiplyScalar(radius * 0.97), q, sc);
    inst.setMatrixAt(i, m4);
  }
  mesh.add(inst);
  return inst;
}

// A painter for a transparent cloud layer (used by Fromaggio Prime and New Earth)
export const paintClouds = (tint, seed, cover) => (x, y, z, o) => {
  const n = fbm(x * 2.2 + seed, y * 4.2 + seed * 0.5, z * 2.2 - seed, 5);
  o[0] = tint[0];
  o[1] = tint[1];
  o[2] = tint[2];
  o[3] = 205 * smooth(cover, cover + 0.2, n);
};
