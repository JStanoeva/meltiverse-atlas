/** ✨ The Grand tour: visits every place in turn, 9 seconds each. */
import { TOUR } from "../data/navigation.js";
import { focusOn } from "./focus.js";
import { setTourPressed } from "../ui/dock.js";

let tourTimer = null,
  tourIdx = 0;

function nextTourStop() {
  focusOn(TOUR[tourIdx % TOUR.length]);
  tourIdx++;
}

export function startTour() {
  tourIdx = 0;
  nextTourStop();
  tourTimer = setInterval(nextTourStop, 9000);
  setTourPressed(true);
}

export function stopTour() {
  if (!tourTimer) return;
  clearInterval(tourTimer);
  tourTimer = null;
  setTourPressed(false);
}

export function toggleTour() {
  if (tourTimer) stopTour();
  else startTour();
}
