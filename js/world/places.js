/**
 * Registers every clickable place.
 * The order here is the order of the floating labels (and their Tab order).
 */
import { addBody } from "./bodies.js";

export function registerPlaces({
  sun,
  fondulith,
  fromaggio,
  moons,
  newEarth,
  relicotta,
  lactoseFree,
  ship,
  belt,
  boophole,
  highway,
  orion,
  outerMelt,
}) {
  addBody("sun", "The First Taste", sun.mesh, {
    color: "#ffd36b",
    focusDist: 62,
    lift: 14,
    boopScale: 9,
    reticle: 30,
    pick: sun.mesh,
    squishTarget: sun.group,
  });
  addBody("fondulith", "Fondulith", fondulith.anchor, {
    color: "#7ff5e0",
    focusDist: 17,
    lift: 4.2,
    boopScale: 3,
    reticle: 11,
    pick: fondulith.mesh,
    squishTarget: fondulith.tilt,
  });
  addBody("fromaggio", "Fromaggio Prime", fromaggio.anchor, {
    color: "#f6c453",
    focusDist: 30,
    lift: 6.2,
    boopScale: 4.5,
    reticle: 13,
    pick: fromaggio.mesh,
    squishTarget: fromaggio.tilt,
  });
  addBody("ricotta1", "Ricotta I", moons[0].mesh, {
    info: "ricotta",
    color: "#fff1d6",
    focusDist: 7.5,
    lift: 1.4,
    boopScale: 1.2,
    reticle: 3,
    minor: true,
    maxDist: 110,
    pick: moons[0].mesh,
    squishTarget: moons[0].mesh,
  });
  addBody("ricotta2", "Ricotta II", moons[1].mesh, {
    info: "ricotta",
    color: "#fff1d6",
    focusDist: 7,
    lift: 1.2,
    boopScale: 1,
    reticle: 2.6,
    minor: true,
    maxDist: 110,
    pick: moons[1].mesh,
    squishTarget: moons[1].mesh,
  });
  addBody("newEarth", "New Earth", newEarth.anchor, {
    color: "#c7a8ff",
    focusDist: 21,
    lift: 5,
    boopScale: 3.6,
    reticle: 11,
    pick: newEarth.mesh,
    squishTarget: newEarth.tilt,
  });
  addBody("relicotta", "Relicotta", relicotta.anchor, {
    color: "#5fe0ff",
    focusDist: 19,
    lift: 4.6,
    boopScale: 3.2,
    reticle: 10,
    pick: relicotta.mesh,
    squishTarget: relicotta.tilt,
  });
  addBody("lactoseFree", "Lactose-Free Lands", lactoseFree.anchor, {
    color: "#a3a8b3",
    focusDist: 17,
    lift: 4.6,
    boopScale: 3,
    reticle: 10,
    pick: lactoseFree.mesh,
    squishTarget: lactoseFree.tilt,
  });
  addBody("ship", "S.S. Fondunaught", ship.group, {
    color: "#ff4fa3",
    focusDist: 12,
    lift: 2.4,
    boopScale: 2,
    reticle: 7,
    minor: true,
    pick: ship.pick,
    squishTarget: ship.wobble,
  });
  addBody("belt", "Parmesan Belt", belt.anchor, {
    color: "#ffe2a0",
    focusDist: 38,
    lift: 4,
    boopScale: 6,
  });
  addBody("boophole", "Boophole", boophole.group, {
    color: "#ff4fa3",
    focusDist: 50,
    lift: 11,
    boopScale: 7,
    reticle: 24,
    pick: boophole.pick,
    squishTarget: boophole.spin,
  });
  addBody("highway", "Grate Galactic Cheese Highway", highway.anchor, {
    color: "#f6c453",
    focusDist: 70,
    lift: 6,
    boopScale: 8,
    pick: highway.tube,
  });
  addBody("orionStar", "Orion’s Star", orion.heart, {
    color: "#ff9fd0",
    far: true,
    focusDist: 1700,
    lift: 90,
    boopScale: 110,
    squishTarget: orion.heart,
  });
  addBody("outerMelt", "The Outer Melt", outerMelt.group, {
    color: "#e2a39b",
    far: true,
    focusDist: 2600,
    lift: 330,
    boopScale: 380,
    squishTarget: outerMelt.group,
  });
}
