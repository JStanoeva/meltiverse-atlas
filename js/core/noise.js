/**
 * 3D value noise, used to paint every planet.
 * The permutation table is seeded, so the worlds look the same on every visit.
 */

const perm = new Uint8Array(512);
(function seed() {
  let s = 20241223; // Cheese Independence Day
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    const t = p[i];
    p[i] = p[j];
    p[j] = t;
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
})();

export function vnoise(x, y, z) {
  const xi = Math.floor(x),
    yi = Math.floor(y),
    zi = Math.floor(z);
  const xf = x - xi,
    yf = y - yi,
    zf = z - zi;
  const u = xf * xf * (3 - 2 * xf),
    v = yf * yf * (3 - 2 * yf),
    w = zf * zf * (3 - 2 * zf);
  const X = xi & 255,
    Y = yi & 255,
    Z = zi & 255;
  const A = perm[X] + Y,
    B = perm[X + 1] + Y;
  const AA = perm[A] + Z,
    AB = perm[A + 1] + Z,
    BA = perm[B] + Z,
    BB = perm[B + 1] + Z;
  const n000 = perm[AA],
    n100 = perm[BA],
    n010 = perm[AB],
    n110 = perm[BB];
  const n001 = perm[AA + 1],
    n101 = perm[BA + 1],
    n011 = perm[AB + 1],
    n111 = perm[BB + 1];
  const x00 = n000 + (n100 - n000) * u,
    x10 = n010 + (n110 - n010) * u;
  const x01 = n001 + (n101 - n001) * u,
    x11 = n011 + (n111 - n011) * u;
  const y0 = x00 + (x10 - x00) * v,
    y1 = x01 + (x11 - x01) * v;
  return (y0 + (y1 - y0) * w) / 255;
}
export function fbm(x, y, z, oct) {
  let s = 0,
    a = 0.5,
    n = 0;
  for (let i = 0; i < oct; i++) {
    s += a * vnoise(x, y, z);
    n += a;
    a *= 0.5;
    x *= 2.03;
    y *= 2.03;
    z *= 2.03;
  }
  return s / n;
}
