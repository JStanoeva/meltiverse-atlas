/**
 * Entry point. Checks that three.js arrived from the CDN before loading the
 * rest of the atlas, so a missing library or missing WebGL gets a friendly
 * message on the loading screen instead of a blank page.
 */
import { showLoaderError } from "./ui/loader.js";

if (typeof window.THREE === "undefined" || !window.THREE.OrbitControls) {
  showLoaderError(
    "three.js didn’t load, so the map can’t be drawn yet. Check your internet connection and refresh the page.",
  );
} else {
  import("./app.js")
    .then(({ startAtlas }) => startAtlas())
    .catch((err) => {
      if (err && err.name === "WebGLUnavailableError") {
        showLoaderError(
          "This browser couldn’t start WebGL, which the map needs. Try another browser, or turn on hardware acceleration.",
        );
        return;
      }
      console.error(err);
      showLoaderError(
        "Something curdled while drawing the map: " + err.message,
      );
    });
}
