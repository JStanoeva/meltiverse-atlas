/**
 * THE FROMAGGIO PRIME SYSTEM
 * Builds every world and wonder, one loader step at a time, and returns
 * the pieces plus a single update(frame) that animates all of them.
 */
import { createStars } from "./stars.js";
import { createNebula } from "./nebula.js";
import { createSun } from "./sun.js";
import {
  createFromaggioPrime,
  createParmesanPalace,
} from "./fromaggio-prime.js";
import { createRicottaMoons } from "./ricotta-moons.js";
import { createNewEarth } from "./new-earth.js";
import { createFondulith, createGravityStorm } from "./fondulith.js";
import { createRelicotta } from "./relicotta.js";
import { createLactoseFreeLands } from "./lactose-free-lands.js";
import { createParmesanBelt } from "./parmesan-belt.js";
import { createFondunaught } from "./fondunaught.js";
import { createBoophole } from "./boophole.js";
import { createBoopstream } from "./boopstream.js";
import { createCheeseHighway } from "./cheese-highway.js";
import { createOuterMelt } from "./outer-melt.js";
import { createOrionConstellation } from "./orion-constellation.js";
import { createReticle } from "./reticle.js";

// step(message): shows a loader message and lets the browser paint it
export async function buildSolarSystem(step) {
  await step("Curdling the Cheese Nebula…");
  createStars();
  const nebula = createNebula();
  const sun = createSun();

  await step("Aging Fromaggio Prime…");
  const fromaggio = createFromaggioPrime();
  const palace = createParmesanPalace(fromaggio);

  await step("Whipping the twin ricotta moons…");
  const moons = createRicottaMoons(fromaggio);

  await step("Painting New Earth’s lilac sky…");
  const newEarth = createNewEarth();

  await step("Foaming Fondulith…");
  const fondulith = createFondulith();
  const storm = createGravityStorm(fondulith);

  await step("Polishing Relicotta’s blue stones…");
  const relicotta = createRelicotta();

  await step("Sharpening the Lactose-Free Lands…");
  const lactoseFree = createLactoseFreeLands();

  await step("Grating the Parmesan Belt…");
  const belt = createParmesanBelt();

  await step("Fueling the S.S. Fondunaught…");
  const ship = createFondunaught();

  await step("Opening the Boophole…");
  const boophole = createBoophole();
  const stream = createBoopstream(boophole.group.position.clone());
  const highway = createCheeseHighway();

  await step("Lighting the way to the Outer Melt…");
  const outerMelt = createOuterMelt();
  const orion = createOrionConstellation();

  const reticle = createReticle();

  // everything with an update(frame) that moves on its own
  const animated = [
    nebula,
    sun,
    fromaggio,
    palace,
    ...moons,
    newEarth,
    fondulith,
    storm,
    relicotta,
    lactoseFree,
    belt,
    ship,
    boophole,
    stream,
    highway,
    outerMelt,
    orion,
  ];

  return {
    parts: {
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
    },
    reticle,
    update(frame) {
      for (const thing of animated) thing.update(frame);
    },
  };
}
