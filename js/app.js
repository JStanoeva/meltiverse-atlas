/**
 * THE ATLAS: wires the components together and starts the show.
 * UI components only know about their own bit of the page; this is the one
 * place that decides what a click on each of them should do.
 */
import { onResize, homeView } from "./core/stage.js";
import { setOrbitsVisible } from "./graphics/primitives.js";
import { buildSolarSystem } from "./world/solar-system.js";
import { registerPlaces } from "./world/places.js";
import { startFly } from "./camera/flights.js";
import { focusOn, goHome } from "./camera/focus.js";
import { stopTour, toggleTour } from "./camera/tour.js";
import { boop } from "./interaction/boops.js";
import { initPointer } from "./interaction/pointer.js";
import { showLoadingStep, hideLoader } from "./ui/loader.js";
import { initLedger } from "./ui/ledger.js";
import { createLabels, setLabelsVisible } from "./ui/labels.js";
import { createAtlasNav } from "./ui/atlas-nav.js";
import { initDock } from "./ui/dock.js";
import { startWeatherTicker } from "./ui/ticker.js";
import { setTimeScale, startLoop } from "./loop.js";

// what happens when you pick a place from a label or the atlas list
function selectPlace(id) {
  stopTour();
  focusOn(id);
}

export async function startAtlas() {
  initPointer();
  initLedger({ onBoop: boop });
  initDock({
    onHome: () => {
      stopTour();
      goHome(2.4);
    },
    onTourToggle: toggleTour,
    onOrbitsChange: setOrbitsVisible,
    onLabelsChange: setLabelsVisible,
    onSpeedChange: setTimeScale,
  });
  startWeatherTicker();
  window.addEventListener("resize", onResize);

  // paint the worlds, then swoop in
  const world = await buildSolarSystem(showLoadingStep);
  registerPlaces(world.parts);
  createLabels({ onSelect: selectPlace });
  createAtlasNav({ onSelect: selectPlace });
  onResize();

  hideLoader();
  document.body.classList.add("ready");
  startFly(homeView, 4.6);
  startLoop(world);
}
