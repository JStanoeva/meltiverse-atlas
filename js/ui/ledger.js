/** The Lactose Ledger panel: each place's entry, its stats, and its boop button. */
import { boopsAt, totalBoops } from "../interaction/boop-tally.js";

const $ = (s) => document.querySelector(s);
export const ledgerPanel = $("#ledger");
let shown = null; // the body whose entry is in the panel

// onBoop(id) runs when the "Boop this world" button is pressed
export function initLedger({ onBoop }) {
  $("#l-close").addEventListener("click", closeLedger);
  $("#l-boop").addEventListener("click", () => {
    if (shown) onBoop(shown.id);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLedger();
  });
}

export function openLedger(b) {
  const info = b.info;
  shown = b;
  $("#l-entry").textContent = "Lactose Ledger, entry " + info.entry;
  $("#l-title").textContent = info.title;
  $("#l-kind").textContent = info.kind;
  const desc = $("#l-desc");
  desc.textContent = "";
  info.desc.forEach((t) => {
    const p = document.createElement("p");
    p.textContent = t;
    desc.appendChild(p);
  });
  const dl = $("#l-stats");
  dl.textContent = "";
  info.stats.forEach(([k, v]) => {
    const dt = document.createElement("dt");
    dt.textContent = k;
    const dd = document.createElement("dd");
    dd.textContent = v;
    dl.append(dt, dd);
  });
  const q = $("#l-quote");
  q.textContent = "";
  if (info.quote) {
    const p = document.createElement("p");
    p.textContent = "“" + info.quote[0] + "”";
    const c = document.createElement("cite");
    c.textContent = info.quote[1];
    q.append(p, c);
    q.hidden = false;
  } else q.hidden = true;
  $("#l-boop").textContent = info.boop || "Boop this world";
  refreshBoopCount();
  ledgerPanel.scrollTop = 0;
  ledgerPanel.classList.add("open");
}

export function closeLedger() {
  ledgerPanel.classList.remove("open");
}

export const isLedgerOpen = () => ledgerPanel.classList.contains("open");

export function refreshBoopCount() {
  if (!shown) return;
  const n = boopsAt(shown.info.entry);
  $("#l-count").textContent =
    n === 0
      ? "No boops here yet. Be the first!"
      : `${n} ${n === 1 ? "boop" : "boops"} delivered here, ${totalBoops()} across the Meltiverse`;
}
