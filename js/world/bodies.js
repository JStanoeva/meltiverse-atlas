/**
 * BODIES: the registry of everything you can click, label, and boop.
 * Places are added by js/world/places.js; the camera, labels, atlas list,
 * ledger, and boops all look places up here by id.
 */
import { INFO } from "../data/ledger-entries.js";

export const bodies = {};
export const pickables = [];

export function addBody(id, name, obj, opts) {
  bodies[id] = Object.assign(
    {
      id,
      name,
      obj, // the Object3D the camera flies to and the label follows
      color: "#f6c453",
      focusDist: 14, // how far away the camera parks
      lift: 3, // how high above the object its label floats
      boopScale: 3, // how big the boop burst is
      far: false, // far-away places aren't followed as they move
      reticle: 0, // size of the focus ring (0 = no ring)
      minor: false, // smaller label
      maxDist: 0, // hide the label beyond this distance (0 = always show)
      squish: 0,
      squishTarget: null, // what wobbles when booped
    },
    opts,
    { info: INFO[opts.info || id] },
  );
  if (opts.pick)
    [].concat(opts.pick).forEach((m) => {
      m.userData.bodyId = id;
      pickables.push(m);
    });
}
