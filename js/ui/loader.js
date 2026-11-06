/** The loading screen: progress messages, the failure message, and the fade-out. */
const loader = document.querySelector("#loader");
const loaderMsg = document.querySelector("#loader-msg");

export function showLoaderError(msg) {
  loaderMsg.textContent = msg;
  loader.classList.add("failed");
}

// Shows a progress message, then waits a frame so the browser can paint it
// before the next (heavy) bit of world-building starts.
export function showLoadingStep(msg) {
  return new Promise((res) => {
    loaderMsg.textContent = msg;
    requestAnimationFrame(() => setTimeout(res, 0));
  });
}

export function hideLoader() {
  loader.classList.add("done");
}
