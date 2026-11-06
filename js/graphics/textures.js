/**
 * CANVAS TEXTURES
 * Everything here is painted at load time with the 2D canvas API, so the map
 * ships with no image files at all.
 */
import { THREE } from "../core/three.js";
import { renderer } from "../core/stage.js";
import { fbm } from "../core/noise.js";
import { smooth } from "../core/math.js";

const MAX_ANISO = Math.min(8, renderer.capabilities.getMaxAnisotropy());
function toTexture(c) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.anisotropy = MAX_ANISO;
  return t;
}

// Paint an equirectangular planet texture by sampling noise on the sphere (no seams!)
export function paintSphere(w, h, painter, withGlow) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(w, h);
  const d = img.data;
  let gc = null,
    gimg = null;
  if (withGlow) {
    gc = document.createElement("canvas");
    gc.width = w;
    gc.height = h;
    gimg = gc.getContext("2d").createImageData(w, h);
  }
  const o = new Float32Array(7);
  for (let j = 0; j < h; j++) {
    const lat = (0.5 - (j + 0.5) / h) * Math.PI,
      cl = Math.cos(lat),
      y = Math.sin(lat);
    for (let i = 0; i < w; i++) {
      const lon = ((i + 0.5) / w) * Math.PI * 2;
      const x = cl * Math.cos(lon),
        z = cl * Math.sin(lon);
      o[3] = 255;
      o[4] = 0;
      o[5] = 0;
      o[6] = 0;
      painter(x, y, z, o);
      const k = (j * w + i) * 4;
      d[k] = o[0];
      d[k + 1] = o[1];
      d[k + 2] = o[2];
      d[k + 3] = o[3];
      if (gimg) {
        const g = gimg.data;
        g[k] = o[4];
        g[k + 1] = o[5];
        g[k + 2] = o[6];
        g[k + 3] = 255;
      }
    }
  }
  ctx.putImageData(img, 0, 0);
  if (gc) gc.getContext("2d").putImageData(gimg, 0, 0);
  return { map: toTexture(c), glow: gc ? toTexture(gc) : null };
}

function iconTexture(size, draw) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  draw(c.getContext("2d"), size);
  return new THREE.CanvasTexture(c);
}

export const glowTex = iconTexture(256, (g, S) => {
  const grd = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.18, "rgba(255,255,255,0.6)");
  grd.addColorStop(0.45, "rgba(255,255,255,0.14)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, S, S);
});

function heartPath(g, cx, cy, s) {
  g.beginPath();
  g.moveTo(cx, cy + s * 0.9);
  g.bezierCurveTo(
    cx - s * 0.3,
    cy + s * 0.65,
    cx - s * 1.3,
    cy + s * 0.1,
    cx - s * 1.0,
    cy - s * 0.55,
  );
  g.bezierCurveTo(
    cx - s * 0.75,
    cy - s * 1.15,
    cx - s * 0.1,
    cy - s * 1.05,
    cx,
    cy - s * 0.45,
  );
  g.bezierCurveTo(
    cx + s * 0.1,
    cy - s * 1.05,
    cx + s * 0.75,
    cy - s * 1.15,
    cx + s * 1.0,
    cy - s * 0.55,
  );
  g.bezierCurveTo(
    cx + s * 1.3,
    cy + s * 0.1,
    cx + s * 0.3,
    cy + s * 0.65,
    cx,
    cy + s * 0.9,
  );
  g.closePath();
}
export const heartTex = iconTexture(128, (g, S) => {
  g.shadowColor = "rgba(255,79,163,0.95)";
  g.shadowBlur = 18;
  heartPath(g, S / 2, S / 2 + 4, S * 0.34);
  g.fillStyle = "#ff62b0";
  g.fill();
  g.shadowBlur = 0;
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.beginPath();
  g.ellipse(S / 2 - 18, S / 2 - 12, 9, 5, -0.6, 0, Math.PI * 2);
  g.fill();
});
export const wedgeTex = iconTexture(128, (g) => {
  g.shadowColor = "rgba(246,196,83,0.9)";
  g.shadowBlur = 16;
  g.beginPath();
  g.moveTo(18, 92);
  g.lineTo(112, 92);
  g.lineTo(112, 40);
  g.closePath();
  g.fillStyle = "#f6c453";
  g.fill();
  g.shadowBlur = 0;
  g.beginPath();
  g.moveTo(18, 92);
  g.lineTo(112, 40);
  g.lineTo(104, 30);
  g.lineTo(10, 82);
  g.closePath();
  g.fillStyle = "#ffe2a0";
  g.fill();
  g.fillStyle = "#d8962a";
  [
    [92, 76, 8],
    [104, 58, 4.5],
    [70, 84, 4],
  ].forEach(([x, y, r]) => {
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  });
});
export const sparkleTex = iconTexture(128, (g, S) => {
  const c = S / 2;
  g.shadowColor = "rgba(58,215,255,0.95)";
  g.shadowBlur = 14;
  g.fillStyle = "#eafcff";
  g.beginPath();
  g.moveTo(c, 12);
  g.quadraticCurveTo(c + 6, c - 6, S - 12, c);
  g.quadraticCurveTo(c + 6, c + 6, c, S - 12);
  g.quadraticCurveTo(c - 6, c + 6, 12, c);
  g.quadraticCurveTo(c - 6, c - 6, c, 12);
  g.fill();
});
export const reticleTex = iconTexture(256, (g, S) => {
  const c = S / 2;
  g.strokeStyle = "rgba(255,226,160,0.8)";
  g.lineWidth = 1.6;
  g.setLineDash([4, 7]);
  g.beginPath();
  g.arc(c, c, S * 0.43, 0, Math.PI * 2);
  g.stroke();
  g.setLineDash([]);
  g.strokeStyle = "rgba(255,79,163,0.95)";
  g.lineWidth = 2.6;
  g.lineCap = "round";
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2 + Math.PI / 4;
    g.beginPath();
    g.moveTo(c + Math.cos(a) * S * 0.405, c + Math.sin(a) * S * 0.405);
    g.lineTo(c + Math.cos(a) * S * 0.455, c + Math.sin(a) * S * 0.455);
    g.stroke();
  }
});

export function nebulaTexture(seed) {
  const S = 256,
    c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  const img = g.createImageData(S, S);
  const d = img.data;
  for (let j = 0; j < S; j++) {
    for (let i = 0; i < S; i++) {
      const u = (i / S) * 2 - 1,
        v = (j / S) * 2 - 1,
        r = Math.sqrt(u * u + v * v);
      const n = fbm(u * 1.8 + seed, v * 1.8 - seed, seed * 0.37, 5);
      const n2 = fbm(u * 4.1 - seed, v * 4.1 + seed, seed, 3);
      const a =
        Math.pow(Math.max(0, 1 - r), 1.4) *
        smooth(0.36, 0.7, n) *
        (0.55 + 0.45 * n2);
      const k = (j * S + i) * 4;
      d[k] = d[k + 1] = d[k + 2] = 255;
      d[k + 3] = a * 255;
    }
  }
  g.putImageData(img, 0, 0);
  return new THREE.CanvasTexture(c);
}
