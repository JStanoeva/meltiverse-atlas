/**
 * three.js r147 is loaded as a classic <script> from the CDN (see index.html),
 * which puts it on window.THREE together with THREE.OrbitControls.
 *
 * Every module imports THREE from here instead of reaching for the global, so
 * each file states its dependencies. If you ever move to an npm/bundler setup,
 * this is the only line that needs to become `export * as THREE from "three"`.
 */
export const THREE = window.THREE;
