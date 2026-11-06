/** The control dock: home, grand tour, orbit/label toggles, melt speed, and the hint. */
const $ = (s) => document.querySelector(s);
const hint = $("#hint");
const tourBtn = $("#btn-tour");

// a toggle button that keeps its own aria-pressed state
function toggleButton(el, onChange) {
  el.addEventListener("click", () => {
    const on = el.getAttribute("aria-pressed") !== "true";
    el.setAttribute("aria-pressed", String(on));
    onChange(on);
  });
}

export function initDock({
  onHome,
  onTourToggle,
  onOrbitsChange,
  onLabelsChange,
  onSpeedChange,
}) {
  $("#btn-home").addEventListener("click", onHome);
  tourBtn.addEventListener("click", onTourToggle);
  toggleButton($("#btn-orbits"), onOrbitsChange);
  toggleButton($("#btn-labels"), onLabelsChange);

  const speed = $("#speed"),
    speedOut = $("#speed-out");
  speed.addEventListener("input", () => {
    const timeScale = parseFloat(speed.value);
    speedOut.textContent =
      timeScale === 0 ? "paused" : timeScale.toFixed(1).replace(".0", "") + "×";
    onSpeedChange(timeScale);
  });
}

export function setTourPressed(on) {
  tourBtn.setAttribute("aria-pressed", String(on));
  tourBtn.textContent = on ? "⏸ Stop tour" : "✨ Grand tour";
}

export function hideHint() {
  hint.classList.add("gone");
}
