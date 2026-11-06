/**
 * Slides the picture sideways (or up, on phones) while the ledger is open,
 * so the focused world stays visible next to the panel instead of under it.
 */
import { camera } from "../core/stage.js";
import { ledgerPanel, isLedgerOpen } from "../ui/ledger.js";

const viewShift = { x: 0, y: 0 };

export function updateViewShift(dt) {
  const w = window.innerWidth,
    h = window.innerHeight;
  let tx = 0,
    ty = 0;
  if (isLedgerOpen()) {
    if (w > 760) tx = (ledgerPanel.offsetWidth + 18) / 2;
    else ty = (Math.min(ledgerPanel.offsetHeight, h * 0.56) + 68) / 2;
  }
  const k = 1 - Math.pow(0.004, dt);
  viewShift.x += (tx - viewShift.x) * k;
  viewShift.y += (ty - viewShift.y) * k;
  if (
    tx === 0 &&
    ty === 0 &&
    Math.abs(viewShift.x) < 0.5 &&
    Math.abs(viewShift.y) < 0.5
  ) {
    viewShift.x = viewShift.y = 0;
    if (camera.view && camera.view.enabled) camera.clearViewOffset();
  } else {
    camera.setViewOffset(w, h, viewShift.x, viewShift.y, w, h);
  }
}
