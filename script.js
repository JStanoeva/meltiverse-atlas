(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const loader = $("#loader");
  const loaderMsg = $("#loader-msg");
  const fail = (msg) => {
    loaderMsg.textContent = msg;
    loader.classList.add("failed");
  };

  if (typeof THREE === "undefined" || !THREE.OrbitControls) {
    fail(
      "three.js didn’t load, so the map can’t be drawn yet. Check your internet connection and refresh the page.",
    );
    return;
  }

  const reduceMotion = !!(
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  /* ==========================================================================
     THE LACTOSE LEDGER: every catalogued place, straight from the Compendium
     ========================================================================== */
  const INFO = {
    sun: {
      entry: 1,
      title: "The First Taste",
      kind: "Star of pure flavor, heart of the Cheese Nebula",
      desc: [
        "Before flavor, there was only the Void: tasteless, bland, utterly boring. Then a single spark of umami appeared. It condensed into a brilliant star of pure flavor, and from it the whole Cheese Nebula was born.",
        "Look closely at the surface and you’ll notice the sunspots are round, soft-edged, and suspiciously Swiss.",
      ],
      stats: [
        ["Class", "G-ouda main sequence"],
        ["Surface", "Perfect Melt™, permanently"],
        ["Worlds warmed", "Five, one of them reluctantly"],
        ["Age", "Older than the first curd"],
      ],
      quote: [
        "From that sacred touch came smoochlight, stars, and brie. And She saw that it was melty.",
        "The Cheesible",
      ],
      boop: "Boop the star",
    },
    fondulith: {
      entry: 2,
      title: "Fondulith",
      kind: "Foaming planet, an anomaly world",
      desc: [
        "A frothing world of strange textures and anomalous gravity storms, ethereal and gloriously chaotic. The swirling ring around it is one of those storms, and it never quite settles down.",
        "The name is courtesy of King Orion.",
      ],
      stats: [
        ["Weather", "Gravity storms, frothy"],
        ["Surface", "Foam, still bubbling"],
        ["Named by", "King Orion"],
        ["Recommended gear", "Anti-gravity boots and a fondue fork"],
      ],
      boop: "Boop this world",
    },
    fromaggio: {
      entry: 3,
      title: "Fromaggio Prime",
      kind: "Paradise planet, capital of the Cheese Republic",
      desc: [
        "Home of the Cheese Republic, found by Queen Tora on June 14, 2025: yellow skies, deep golden seas, and yellow grass that glows with smoochlight after dark. Spin around to its night side and watch the meadows shine.",
        "The little pink light on its golden shore is the Parmesan Palace, guarded by an army of smol floofy creatures. The Brievolutionary Archives sit beneath it, and the Grand Library of Cheese Knowledge, where this atlas is kept, glows nearby.",
      ],
      stats: [
        ["Rulers", "Queen Tora and King Orion"],
        ["Government", "Benevolent floofocracy"],
        ["Founded", "December 23, 2024"],
        ["Moons", "The twin ricotta moons"],
        ["Largest sea", "The Great Fondue Sea"],
        ["Motto", "In Cheese We Trust"],
      ],
      quote: ["Make Cheese, Not War!", "The Gouda Proclamation"],
      boop: "Boop this world",
    },
    ricotta: {
      entry: 4,
      title: "The Twin Ricotta Moons",
      kind: "Moons of Fromaggio Prime",
      desc: [
        "Two soft, creamy moons that rise together over the Parmesan Palace. The Constitution of Cheese was ratified beneath their light, and more than one royal ballad was composed under their glow.",
        "Their craters, on close inspection, are Swiss.",
      ],
      stats: [
        ["Composition", "Fresh ricotta, lunar grade"],
        ["Tides", "Gently stir the Great Fondue Sea"],
        ["Best viewed", "At fonduefall"],
      ],
      quote: [
        "Ratified this day under the twin ricotta moons of Fromaggio Prime.",
        "The Constitution of Cheese",
      ],
      boop: "Boop this moon",
    },
    newEarth: {
      entry: 5,
      title: "New Earth",
      kind: "Paradise planet, the quiet neighbor",
      desc: [
        "An Earth-like paradise with no storms at all: deep blue oceans, breathtaking green flora, and a lilac sky. It is the system’s garden, the place to go when the palace gets a little too melty.",
      ],
      stats: [
        ["Sky", "Lilac, always"],
        ["Storms", "None, ever"],
        ["Cheese supply", "Imported daily from Fromaggio Prime"],
      ],
      quote: [
        "A lilac sky so beautiful, I wished Earth’s sky was lilac too.",
        "Queen Tora, the Cheese Republic Compendium",
      ],
      boop: "Boop this world",
    },
    relicotta: {
      entry: 6,
      title: "Relicotta",
      kind: "Overgrown relic planet",
      desc: [
        "Mossy, overgrown ground studded with glowing blue stones and relic-like minerals. Touch one of the stones and it hands you a base decoration blueprint, which is the planet’s way of saying: go build something lovely.",
        "Its name was chosen with King Orion’s help.",
      ],
      stats: [
        ["Glowing stones", "Too many to count (the Archivist tried anyway)"],
        ["Rewards", "Base decoration blueprints"],
        ["Mood", "Ancient, cozy, a little mysterious"],
      ],
      boop: "Boop this world",
    },
    lactoseFree: {
      entry: 7,
      title: "The Lactose-Free Lands",
      kind: "Bladed planet, place of exile",
      desc: [
        "An exotic bladed world with no flora, no fauna, and, most tragically, no cheese. It is where those who reject cheese are sent to reconsider their choices.",
        "Still, it is canonically part of the Cheesiverse, and its exotic base parts are worth collecting. The S.S. Fondunaught keeps a close eye on it.",
      ],
      stats: [
        ["Cheese detected", "0.00%"],
        ["Flora and fauna", "None"],
        ["Collectibles", "Exotic base parts"],
        ["Status", "Canon, begrudgingly"],
      ],
      quote: [
        "A Cheese Knight shall stand guard against those who seek to bring lactose intolerance and low-fat cheese into our lands.",
        "The Royal Cheese Knight Code",
      ],
      boop: "Boop it anyway",
    },
    ship: {
      entry: 8,
      title: "S.S. Fondunaught",
      kind: "Royal flagship, custom corvette",
      desc: [
        "Built by Queen Tora herself on August 28, 2025, the royal corvette patrols the lanes between Fromaggio Prime and the Lactose-Free Lands, guarding the Republic against their dairyless minions.",
        "Its tail fin is a cheese wedge. This is non-negotiable.",
      ],
      stats: [
        ["Captain", "Queen Tora"],
        ["Class", "Corvette"],
        ["Launched", "August 28, 2025"],
        ["Armament", "Cheesebringer™-grade boops"],
      ],
      boop: "Boop the Fondunaught",
    },
    belt: {
      entry: 9,
      title: "The Parmesan Belt",
      kind: "Asteroid belt, newly catalogued",
      desc: [
        "A glittering ring of grated parmesan flakes between Relicotta and the Lactose-Free Lands. The Royal Cheese Archivist entered it into the Lactose Ledger on the day this atlas was drawn.",
        "Every single flake is counted, because wasting parmesan is expressly forbidden.",
      ],
      stats: [
        ["Flakes catalogued", "1,400 and counting"],
        ["Grade", "CosmoCrust Parmesan™"],
        ["Protected by", "The First Commandment of Cheese"],
      ],
      quote: ["Thou shalt not waste parmesan.", "The Commandments of Cheese"],
      boop: "Boop the belt",
    },
    boophole: {
      entry: 10,
      title: "The Boophole",
      kind: "Ancient portal to the Boopstream",
      desc: [
        "Boopholes are ancient portals worn into the Swiss cheese of the Meltiverse. Through this one pours the Boopstream, the river of smoochlight that connects every Cheesiverse, arriving from somewhere far beyond the nebula.",
        "Some Boopholes began life as black holes. Boop one and it blushes, melts, and reveals what was inside all along: finely aged, glowing, flowing cheese.",
      ],
      stats: [
        ["Connects", "Every Cheesiverse in the Meltiverse"],
        ["Carries", "Smoochlight, plus cheese via the Smoochstream"],
        ["Local time", "Measured in boops per second"],
      ],
      quote: ["Time is a function of boops per second.", "Boopstream Dynamics"],
      boop: "Boop the Boophole",
    },
    highway: {
      entry: 11,
      title: "The Grate Galactic Cheese Highway",
      kind: "Interstellar trade route",
      desc: [
        "A sprawling network of cheese trade routes connecting the Cheese Nebula to every corner of the Cheesiverse. The golden lights gliding along it are cheese caravans, heading out full and coming home fuller.",
      ],
      stats: [
        ["Cargo", "Cheese of every kind"],
        ["Busiest day", "Cheese Day, November 7"],
        ["Toll", "One cheese pun, recited under moonlight"],
      ],
      boop: "Boop a caravan",
    },
    orionStar: {
      entry: 12,
      title: "Orion’s Star",
      kind: "The heart star of a familiar constellation",
      desc: [
        "High above the system hangs the constellation of Orion, and at its heart a single star shines brighter than the rest, pulsing gently.",
        "In the old story, a star like this one called to the Queen, and she followed its light into a sky where anything could be imagined.",
      ],
      stats: [
        ["Location", "The heart of Orion"],
        ["Brightness", "Highest when someone is watching"],
        ["Honors", "King Orion, the Floofy Cheese King"],
      ],
      quote: [
        "I think they do. After all, they shine brightest when someone watches them.",
        "Queen Tora, “Orion’s Star”",
      ],
      boop: "Boop the star",
    },
    outerMelt: {
      entry: 13,
      title: "The Outer Melt",
      kind: "Beyond the farthest constellations",
      desc: [
        "Not a destination, but a return. The Outer Melt lies beyond every star map, a realm where galaxies swirl in gentle tides of cheddar and memory, and every cheese entity who was truly loved becomes smoochlight itself.",
        "King Orion rests here, alongside Prince Cheesmos and Sir Cheesecake. There is no pain in the Outer Melt, and no forgetting.",
      ],
      stats: [
        ["Distance", "Beyond every star map"],
        ["Residents", "Every cheese entity who was truly loved"],
        ["Light", "Warm, rose-gold, unending"],
      ],
      quote: ["Love doesn’t end. It changes form.", "The Outer Melt"],
      boop: "Send a boop",
    },
  };

  const WEATHER = [
    "Today: 87% chance of fondue showers over the Great Fondue Sea.",
    "Light parmesan snow expected on the polar caps of Fromaggio Prime.",
    "Gravity storms on Fondulith: frothy, with chaotic spells.",
    "Boopstream traffic is light. The Smoochstream is flowing freely.",
    "Lactose-Free Lands: 0% chance of cheese, as always.",
    "Both ricotta moons rise at fonduefall tonight.",
    "Smoochlight levels across the system: radiant.",
  ];

  /* ==========================================================================
     RENDERER, CAMERA, CONTROLS
     ========================================================================== */
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch (err) {
    fail(
      "This browser couldn’t start WebGL, which the map needs. Try another browser, or turn on hardware acceleration.",
    );
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0a0614, 1);
  $("#scene").appendChild(renderer.domElement);
  const canvas = renderer.domElement;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.5,
    30000,
  );
  const HOME = {
    pos: new THREE.Vector3(0, 64, 228),
    target: new THREE.Vector3(0, 0, 0),
  };
  camera.position.set(-320, 1150, 2700);

  const controls = new THREE.OrbitControls(camera, canvas);
  Object.assign(controls, {
    enableDamping: true,
    dampingFactor: 0.07,
    minDistance: 1.5,
    maxDistance: 7000,
    rotateSpeed: 0.55,
    zoomSpeed: 0.9,
    panSpeed: 0.6,
  });
  controls.enabled = false;

  scene.add(new THREE.AmbientLight(0x6a5886, 0.42));

  const systemRoot = new THREE.Group(); // everything that belongs to the star system
  scene.add(systemRoot);

  // Shared uniforms (one object, many materials)
  const U = {
    time: { value: 0 },
    scale: { value: 1 }, // px-per-world-unit factor for sized particles
    pr: { value: renderer.getPixelRatio() },
  };
  const PU = { uScale: U.scale };

  /* ==========================================================================
     SMALL HELPERS
     ========================================================================== */
  const rand = Math.random;
  const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (e0, e1, x) => {
    const t = clamp01((x - e0) / (e1 - e0));
    return t * t * (3 - 2 * t);
  };
  const gauss = () => (rand() + rand() + rand() + rand() - 2) * 0.87;
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  function randUnit(v) {
    const u = rand() * 2 - 1,
      t = rand() * Math.PI * 2,
      s = Math.sqrt(1 - u * u);
    return v.set(s * Math.cos(t), u, s * Math.sin(t));
  }

  /* ---------- 3D value noise (used to paint every planet) ---------- */
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

  function vnoise(x, y, z) {
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
  function fbm(x, y, z, oct) {
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

  /* ---------- Canvas texture helpers ---------- */
  const MAX_ANISO = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  function toTexture(c) {
    const t = new THREE.CanvasTexture(c);
    t.wrapS = THREE.RepeatWrapping;
    t.anisotropy = MAX_ANISO;
    return t;
  }

  // Paint an equirectangular planet texture by sampling noise on the sphere (no seams!)
  function paintSphere(w, h, painter, withGlow) {
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

  const glowTex = iconTexture(256, (g, S) => {
    const grd = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.18, "rgba(255,255,255,0.6)");
    grd.addColorStop(0.45, "rgba(255,255,255,0.14)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, S, S);
  });

  function makeGlow(color, size, opacity) {
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTex,
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    s.scale.set(size, size, 1);
    return s;
  }

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
  const heartTex = iconTexture(128, (g, S) => {
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
  const wedgeTex = iconTexture(128, (g) => {
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
  const sparkleTex = iconTexture(128, (g, S) => {
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
  const reticleTex = iconTexture(256, (g, S) => {
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

  function nebulaTexture(seed) {
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

  /* ==========================================================================
     SHADERS
     ========================================================================== */
  const NOISE_GLSL = `
    float hash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
    float noise(vec3 x){
      vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
      return mix(mix(mix(hash(i + vec3(0.0,0.0,0.0)), hash(i + vec3(1.0,0.0,0.0)), f.x),
                     mix(hash(i + vec3(0.0,1.0,0.0)), hash(i + vec3(1.0,1.0,0.0)), f.x), f.y),
                 mix(mix(hash(i + vec3(0.0,0.0,1.0)), hash(i + vec3(1.0,0.0,1.0)), f.x),
                     mix(hash(i + vec3(0.0,1.0,1.0)), hash(i + vec3(1.0,1.0,1.0)), f.x), f.y), f.z);
    }
    float fbm(vec3 p){ float s = 0.0; float a = 0.5; for (int i = 0; i < 5; i++){ s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }
    vec3 hash3(vec3 p){
      p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
      return fract(sin(p) * 43758.5453);
    }
    // round Swiss-cheese holes: distance to the nearest (randomly kept) cell point
    float swiss(vec3 p){
      vec3 i = floor(p); vec3 f = fract(p); float d = 1.0;
      for (int x = -1; x <= 1; x++) for (int y = -1; y <= 1; y++) for (int z = -1; z <= 1; z++) {
        vec3 g = vec3(float(x), float(y), float(z));
        vec3 h = hash3(i + g);
        if (h.z > 0.45) { vec3 r = g + h * 0.8 + 0.1 - f; d = min(d, dot(r, r)); }
      }
      return sqrt(d);
    }
  `;

  // The First Taste: a churning star of pure flavor with Swiss sunspots
  const SUN_VS = `
    varying vec3 vPos; varying vec3 vN; varying vec3 vV;
    void main(){
      vPos = position;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }`;
  const SUN_FS = `
    uniform float uTime; varying vec3 vPos; varying vec3 vN; varying vec3 vV;
    ${NOISE_GLSL}
    void main(){
      vec3 p = normalize(vPos) * 2.4;
      float n = fbm(p + vec3(uTime * 0.05, -uTime * 0.03, uTime * 0.04));
      float n2 = fbm(p * 2.3 - vec3(uTime * 0.07));
      vec3 col = mix(vec3(0.93, 0.52, 0.12), vec3(1.0, 0.8, 0.32), smoothstep(0.3, 0.65, n));
      col = mix(col, vec3(1.0, 0.97, 0.82), smoothstep(0.5, 0.78, n2) * 0.75);
      float hd = swiss(normalize(vPos) * 3.2 + vec3(0.0, uTime * 0.03, 0.0));
      float holes = 1.0 - smoothstep(0.16, 0.24, hd);
      float rimH = smoothstep(0.12, 0.2, hd) * (1.0 - smoothstep(0.2, 0.27, hd));
      col = mix(col, vec3(0.84, 0.42, 0.16), holes * 0.6);
      col += vec3(1.0, 0.9, 0.6) * rimH * 0.25;
      float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.2);
      col += vec3(1.0, 0.55, 0.62) * f * 0.7;
      gl_FragColor = vec4(col, 1.0);
    }`;

  // Soft fresnel atmosphere shell
  const ATMO_VS = `
    varying vec3 vN; varying vec3 vV;
    void main(){
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }`;
  const ATMO_FS = `
    uniform vec3 uColor; uniform float uIntensity; uniform float uPower;
    varying vec3 vN; varying vec3 vV;
    void main(){
      float f = pow(1.0 - clamp(dot(vN, vV), 0.0, 1.0), uPower);
      gl_FragColor = vec4(uColor * f * uIntensity, 1.0);
    }`;

  // Background stars: fixed pixel size, gentle twinkle
  const STAR_VS = `
    attribute float aSize; attribute vec3 aColor; attribute float aAlpha; attribute float aPhase;
    uniform float uTime; uniform float uPR;
    varying vec3 vColor; varying float vAlpha;
    void main(){
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mv;
      float tw = 0.7 + 0.3 * sin(uTime * (0.6 + fract(aPhase) * 1.8) + aPhase * 6.2831);
      vAlpha = aAlpha * tw; vColor = aColor;
      gl_PointSize = aSize * uPR;
    }`;
  // World-sized glowing particles (storms, streams, caravans, dust)
  const PART_VS = `
    attribute float aSize; attribute vec3 aColor; attribute float aAlpha;
    uniform float uScale;
    varying vec3 vColor; varying float vAlpha;
    void main(){
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = clamp(aSize * uScale / max(-mv.z, 0.001), 0.0, 90.0);
      vColor = aColor; vAlpha = aAlpha;
    }`;
  const POINT_FS = `
    varying vec3 vColor; varying float vAlpha;
    void main(){
      float d = length(gl_PointCoord - 0.5);
      float a = 1.0 - smoothstep(0.0, 0.5, d);
      a *= a;
      gl_FragColor = vec4(vColor * a * vAlpha, 1.0);
    }`;

  function makePoints(n, vs, uniforms) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3),
      col = new Float32Array(n * 3),
      size = new Float32Array(n),
      alpha = new Float32Array(n);
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    geo.setAttribute("aAlpha", new THREE.BufferAttribute(alpha, 1));
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vs,
      fragmentShader: POINT_FS,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    return { points, geo, pos, col, size, alpha };
  }
  const setCol = (arr, i, c) => {
    arr[i * 3] = c.r;
    arr[i * 3 + 1] = c.g;
    arr[i * 3 + 2] = c.b;
  };
  const palette = (hexes) => hexes.map((h) => new THREE.Color(h));

  function makeAtmosphere(radius, color, intensity, power) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, 48, 32),
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uIntensity: { value: intensity },
          uPower: { value: power },
        },
        vertexShader: ATMO_VS,
        fragmentShader: ATMO_FS,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
  }

  const orbitLines = [];
  function orbitLine(r, incl, color, opacity) {
    const pts = [];
    for (let i = 0; i <= 256; i++) {
      const a = (i / 256) * Math.PI * 2;
      pts.push(V(Math.cos(a) * r, Math.sin(a) * r * incl, Math.sin(a) * r));
    }
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineDashedMaterial({
        color,
        dashSize: Math.max(0.5, r * 0.035),
        gapSize: Math.max(0.4, r * 0.025),
        transparent: true,
        opacity,
        depthWrite: false,
      }),
    );
    line.computeLineDistances();
    orbitLines.push(line);
    return line;
  }

  /* ==========================================================================
     PLANET PAINTERS (each one straight out of the Compendium)
     ========================================================================== */
  // Fromaggio Prime: deep golden seas, yellow grass that glows at night, parmesan snow caps
  function paintFromaggio(x, y, z, o) {
    const n = fbm(x * 1.7 + 3.1, y * 1.7 + 7.7, z * 1.7 + 1.3, 6);
    const g = fbm(x * 6 + 20, y * 6 + 4, z * 6 - 3, 4);
    const land = smooth(0.5, 0.525, n);
    const depth = clamp01((0.51 - n) / 0.2);
    let r = lerp(lerp(255, 208, depth), lerp(230, 252, g), land);
    let gr = lerp(lerp(196, 118, depth), lerp(222, 242, g), land);
    let b = lerp(lerp(72, 18, depth), lerp(96, 142, g), land);
    const cap = smooth(0.8, 0.9, Math.abs(y) + (g - 0.5) * 0.2);
    r = lerp(r, 255, cap);
    gr = lerp(gr, 247, cap);
    b = lerp(b, 226, cap);
    o[0] = r;
    o[1] = gr;
    o[2] = b;
    const glow = land * (1 - cap) * (0.45 + 0.55 * g);
    const coast = smooth(0.475, 0.5, n) * (1 - smooth(0.5, 0.525, n));
    o[4] = 255 * glow + 255 * coast * 0.7;
    o[5] = 200 * glow + 120 * coast * 0.7;
    o[6] = 90 * glow + 190 * coast * 0.7;
  }
  // New Earth: blue oceans, green flora (the lilac sky is its atmosphere)
  function paintNewEarth(x, y, z, o) {
    const n = fbm(x * 2 + 40, y * 2 + 11, z * 2 + 5, 6);
    const g = fbm(x * 7 + 9, y * 7 - 2, z * 7 + 6, 4);
    const land = smooth(0.52, 0.545, n);
    const depth = clamp01((0.53 - n) / 0.2);
    const r = lerp(lerp(52, 12, depth), lerp(48, 128, g), land);
    const gr = lerp(lerp(132, 46, depth), lerp(132, 196, g), land);
    const b = lerp(lerp(222, 140, depth), lerp(70, 104, g), land);
    const cap = smooth(0.82, 0.92, Math.abs(y) + (g - 0.5) * 0.2);
    o[0] = lerp(r, 245, cap);
    o[1] = lerp(gr, 248, cap);
    o[2] = lerp(b, 255, cap);
  }
  // Fondulith: teal world laced with pink foam and bubbles
  function paintFondulith(x, y, z, o) {
    const w = fbm(x * 2 + 5, y * 2 + 5, z * 2 + 5, 3);
    const n = fbm(x * 3 + w * 2.6, y * 3 - w * 2.2, z * 3 + w * 1.8, 5);
    const ridge = Math.pow(1 - Math.abs(n * 2 - 1), 12);
    const bub = smooth(0.66, 0.74, vnoise(x * 16 + 1, y * 16 + 2, z * 16 + 3));
    const t = clamp01(ridge * 0.95 + bub * 0.7);
    o[0] = lerp(lerp(34, 96, n), 255, t);
    o[1] = lerp(lerp(150, 214, n), 214, t);
    o[2] = lerp(lerp(170, 206, n), 234, t);
    o[4] = 255 * t * 0.5;
    o[5] = 110 * t * 0.5;
    o[6] = 190 * t * 0.5;
  }
  // Relicotta: overgrown moss and rock, dotted with glowing blue stones
  function paintRelicotta(x, y, z, o) {
    const n = fbm(x * 2.4 + 70, y * 2.4 + 3, z * 2.4 + 9, 6);
    const m = fbm(x * 8 + 5, y * 8 + 5, z * 8 + 5, 4);
    const rock = smooth(0.54, 0.6, n);
    const r = lerp(lerp(24, 70, m), lerp(92, 128, m), rock);
    const g = lerp(lerp(60, 130, m), lerp(86, 112, m), rock);
    const b = lerp(lerp(42, 66, m), lerp(76, 104, m), rock);
    const s = vnoise(x * 24 + 3, y * 24 + 3, z * 24 + 3);
    const glow = smooth(0.8, 0.87, s) * (0.35 + 0.65 * rock);
    o[0] = lerp(r, 120, glow);
    o[1] = lerp(g, 236, glow);
    o[2] = lerp(b, 255, glow);
    o[4] = 116 * glow;
    o[5] = 215 * glow;
    o[6] = 255 * glow;
  }
  // The Lactose-Free Lands: cracked grey nothing
  function paintLactoseFree(x, y, z, o) {
    const n = fbm(x * 3 + 90, y * 3 + 1, z * 3 - 7, 6);
    const c = Math.abs(fbm(x * 7 + 2, y * 7 + 2, z * 7 + 2, 3) * 2 - 1);
    const k = 1 - (1 - smooth(0.0, 0.05, c)) * 0.55;
    o[0] = lerp(70, 158, n) * k;
    o[1] = lerp(72, 160, n) * k;
    o[2] = lerp(84, 172, n) * k;
  }
  // Ricotta moons: creamy, with Swiss craters
  const paintRicotta = (seed) => (x, y, z, o) => {
    const n = fbm(x * 5 + seed, y * 5 - seed, z * 5, 5);
    const k =
      1 - smooth(0.7, 0.76, vnoise(x * 9 + seed, y * 9, z * 9 - seed)) * 0.2;
    o[0] = lerp(232, 255, n) * k;
    o[1] = lerp(224, 250, n) * k;
    o[2] = lerp(204, 236, n) * k;
  };
  const paintClouds = (tint, seed, cover) => (x, y, z, o) => {
    const n = fbm(x * 2.2 + seed, y * 4.2 + seed * 0.5, z * 2.2 - seed, 5);
    o[0] = tint[0];
    o[1] = tint[1];
    o[2] = tint[2];
    o[3] = 205 * smooth(cover, cover + 0.2, n);
  };

  /* ==========================================================================
     BUILDERS
     ========================================================================== */
  const nebulae = [];
  function buildStars() {
    const N = 7500,
      DUST = 2600;
    const s = makePoints(N + DUST, STAR_VS, { uTime: U.time, uPR: U.pr });
    const phase = new Float32Array(N + DUST);
    s.geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    const band = V(0.28, 1, 0.12).normalize(); // the plane of the Milky Whey
    const tints = palette([
      0xfff4e0, 0xffe2a0, 0xcfe6ff, 0xffc7d6, 0xbfefff, 0xffffff,
    ]);
    const dustTints = palette([0xffe2a0, 0xe2a39b, 0xfff1d6, 0xc7a8ff]);
    const v = new THREE.Vector3();
    for (let i = 0; i < N + DUST; i++) {
      randUnit(v);
      const isDust = i >= N;
      if (isDust || rand() < 0.42) {
        const d = v.dot(band);
        v.addScaledVector(band, -d * (isDust ? 0.93 : 0.86)).normalize();
      }
      const r = isDust ? 8200 + rand() * 600 : 7000 + rand() * 2200;
      s.pos[i * 3] = v.x * r;
      s.pos[i * 3 + 1] = v.y * r;
      s.pos[i * 3 + 2] = v.z * r;
      if (isDust) {
        setCol(s.col, i, dustTints[i % 4]);
        s.size[i] = 14 + rand() * 26;
        s.alpha[i] = 0.05 + rand() * 0.08;
      } else {
        const big = rand() < 0.025;
        setCol(s.col, i, tints[(rand() * tints.length) | 0]);
        s.size[i] = big
          ? 3.2 + rand() * 2.6
          : 0.9 + Math.pow(rand(), 2.5) * 2.4;
        s.alpha[i] = big ? 1 : 0.55 + rand() * 0.45;
      }
      phase[i] = rand() * 10;
    }
    scene.add(s.points);
  }

  function buildNebula() {
    const texes = [nebulaTexture(1.7), nebulaTexture(9.3), nebulaTexture(21.1)];
    const clusters = [
      { dir: [-0.7, 0.25, -0.65], cols: [0xff4fa3, 0xe2a39b, 0x8a5cff] },
      { dir: [0.8, -0.1, -0.5], cols: [0x3ad7ff, 0x8a5cff, 0xc7a8ff] },
      { dir: [0.1, 0.55, 0.8], cols: [0xf6c453, 0xe2a39b, 0xff4fa3] },
      { dir: [-0.5, -0.45, 0.7], cols: [0xf6c453, 0x3ad7ff, 0xffe2a0] },
      { dir: [0.35, -0.7, -0.3], cols: [0xff4fa3, 0xf6c453, 0x8a5cff] },
    ];
    clusters.forEach((cl, ci) => {
      const base = V(cl.dir[0], cl.dir[1], cl.dir[2]).normalize();
      for (let k = 0; k < 7; k++) {
        const sp = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: texes[(ci + k) % 3],
            color: cl.cols[k % 3],
            transparent: true,
            opacity: 0.1 + rand() * 0.14,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            rotation: rand() * Math.PI * 2,
          }),
        );
        const d = base
          .clone()
          .add(
            V((rand() - 0.5) * 0.7, (rand() - 0.5) * 0.5, (rand() - 0.5) * 0.7),
          )
          .normalize();
        sp.position.copy(d.multiplyScalar(4800 + rand() * 1600));
        const sc = 2200 + rand() * 2600;
        sp.scale.set(sc, sc, 1);
        sp.userData.spin = (rand() - 0.5) * 0.01;
        scene.add(sp);
        nebulae.push(sp);
      }
    });
    systemRoot.add(makeGlow(0xf6c453, 900, 0.05)); // we live *inside* the Cheese Nebula
  }

  function buildSun() {
    const group = new THREE.Group();
    systemRoot.add(group);
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(10, 64, 48),
      new THREE.ShaderMaterial({
        uniforms: { uTime: U.time },
        vertexShader: SUN_VS,
        fragmentShader: SUN_FS,
      }),
    );
    group.add(mesh);
    group.add(makeGlow(0xfff3d0, 34, 0.95));
    group.add(makeGlow(0xf6c453, 90, 0.5));
    group.add(makeGlow(0xe2a39b, 220, 0.16));
    group.add(makeGlow(0xff4fa3, 460, 0.06));
    group.add(new THREE.PointLight(0xfff1dc, 1.15, 0));
    return { group, mesh };
  }

  const planets = [];
  const orbitGroup = new THREE.Group();
  systemRoot.add(orbitGroup);
  function positionPlanet(p) {
    p.anchor.position.set(
      Math.cos(p.angle) * p.orbit,
      Math.sin(p.angle) * p.orbit * p.incl,
      Math.sin(p.angle) * p.orbit,
    );
  }
  function makePlanet(o) {
    const anchor = new THREE.Object3D();
    systemRoot.add(anchor);
    const tilt = new THREE.Object3D();
    tilt.rotation.z = o.tilt;
    anchor.add(tilt);
    const mat = new THREE.MeshStandardMaterial({
      map: o.tex.map,
      roughness: o.roughness ?? 0.9,
      metalness: o.metalness ?? 0,
    });
    if (o.tex.glow) {
      mat.emissiveMap = o.tex.glow;
      mat.emissive = new THREE.Color(0xffffff);
      mat.emissiveIntensity = o.emissive ?? 0.35;
    }
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(o.radius, 72, 48),
      mat,
    );
    tilt.add(mesh);
    let clouds = null;
    if (o.clouds) {
      clouds = new THREE.Mesh(
        new THREE.SphereGeometry(o.radius * 1.022, 72, 48),
        new THREE.MeshStandardMaterial({
          map: o.clouds,
          transparent: true,
          depthWrite: false,
          roughness: 1,
        }),
      );
      tilt.add(clouds);
    }
    tilt.add(
      makeAtmosphere(o.radius * 1.1, o.atmo, o.atmoI ?? 1.2, o.atmoP ?? 2.6),
    );
    if (o.halo) anchor.add(makeGlow(o.atmo, o.radius * 5, o.halo));
    orbitGroup.add(orbitLine(o.orbit, o.incl, o.lineColor ?? 0xf6c453, 0.32));
    const p = Object.assign({}, o, {
      anchor,
      tilt,
      mesh,
      clouds,
      angle: o.phase,
    });
    positionPlanet(p);
    planets.push(p);
    return p;
  }

  const moons = [];
  function makeMoon(parent, o) {
    const pivot = new THREE.Object3D();
    pivot.rotation.set(o.incl, 0, o.incl * 0.5);
    parent.anchor.add(pivot);
    const spin = new THREE.Object3D();
    spin.rotation.y = o.phase;
    pivot.add(spin);
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(o.radius, 48, 32),
      new THREE.MeshStandardMaterial({ map: o.tex, roughness: 0.95 }),
    );
    mesh.position.x = o.dist;
    spin.add(mesh);
    const ring = orbitLine(o.dist, 0, 0xfff1d6, 0.22);
    pivot.add(ring);
    const m = { spin, mesh, speed: o.speed };
    moons.push(m);
    return m;
  }

  function scatterOnSurface(mesh, radius, count, geo, mat, minLen, maxLen) {
    const inst = new THREE.InstancedMesh(geo, mat, count);
    const up = V(0, 1, 0),
      n = new THREE.Vector3(),
      q = new THREE.Quaternion(),
      m4 = new THREE.Matrix4(),
      sc = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      randUnit(n);
      q.setFromUnitVectors(up, n);
      const len = minLen + rand() * (maxLen - minLen);
      sc.set(1, len, 1);
      m4.compose(n.clone().multiplyScalar(radius * 0.97), q, sc);
      inst.setMatrixAt(i, m4);
    }
    mesh.add(inst);
    return inst;
  }

  let storm = null;
  function buildStorm(p) {
    const N = 700;
    const s = makePoints(N, PART_VS, PU);
    const cols = palette([0x7ff5e0, 0xff9fd0, 0xfff1d6]);
    const data = [];
    for (let i = 0; i < N; i++) {
      const base = p.radius * 1.45 + rand() * p.radius * 1.4;
      data.push({
        a: rand() * Math.PI * 2,
        r: base,
        sp: (0.4 + rand() * 0.9) * (base < p.radius * 2 ? 1.5 : 1),
        h: (rand() - 0.5) * p.radius * 0.5,
        ph: rand() * 6.28,
      });
      setCol(s.col, i, cols[i % 3]);
      s.size[i] = 0.12 + rand() * 0.28;
      s.alpha[i] = 0.35 + rand() * 0.5;
    }
    s.points.rotation.set(0.45, 0, -0.2);
    p.anchor.add(s.points);
    storm = { s, data };
  }
  function updateStorm(sdt, t) {
    if (!storm) return;
    const { s, data } = storm;
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      d.a += d.sp * sdt;
      const r = d.r + Math.sin(t * 1.7 + d.ph) * 0.25;
      s.pos[i * 3] = Math.cos(d.a) * r;
      s.pos[i * 3 + 1] = d.h + Math.sin(d.a * 3 + d.ph) * 0.18;
      s.pos[i * 3 + 2] = Math.sin(d.a) * r;
    }
    s.geo.attributes.position.needsUpdate = true;
  }

  function buildBelt() {
    const group = new THREE.Group();
    systemRoot.add(group);
    const COUNT = 1400;
    const inst = new THREE.InstancedMesh(
      new THREE.DodecahedronGeometry(0.42, 0),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.92,
        flatShading: true,
      }),
      COUNT,
    );
    const dummy = new THREE.Object3D(),
      c = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      const a = rand() * Math.PI * 2,
        r = 112 + gauss() * 4.5;
      dummy.position.set(Math.cos(a) * r, gauss() * 1.2, Math.sin(a) * r);
      dummy.rotation.set(rand() * 6.28, rand() * 6.28, rand() * 6.28);
      const s = 0.3 + Math.pow(rand(), 2.2) * 1.5;
      dummy.scale.set(s, s * (0.35 + rand() * 0.45), s * (0.6 + rand() * 0.6));
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
      c.setHSL(
        0.11 + rand() * 0.035,
        0.5 + rand() * 0.25,
        0.72 + rand() * 0.16,
      );
      inst.setColorAt(i, c);
    }
    group.add(inst);
    // freshly grated parmesan dust
    const D = 1800;
    const dust = makePoints(D, PART_VS, PU);
    const cols = palette([0xfff1d6, 0xffe2a0, 0xf6c453]);
    for (let i = 0; i < D; i++) {
      const a = rand() * Math.PI * 2,
        r = 112 + gauss() * 7;
      dust.pos[i * 3] = Math.cos(a) * r;
      dust.pos[i * 3 + 1] = gauss() * 2;
      dust.pos[i * 3 + 2] = Math.sin(a) * r;
      setCol(dust.col, i, cols[i % 3]);
      dust.size[i] = 0.15 + rand() * 0.35;
      dust.alpha[i] = 0.3 + rand() * 0.5;
    }
    group.add(dust.points);
    const anchor = new THREE.Object3D();
    anchor.position.set(Math.cos(0.9) * 112, 2, Math.sin(0.9) * 112);
    group.add(anchor);
    return { group, anchor };
  }

  function buildShip() {
    const ship = new THREE.Group();
    const wobble = new THREE.Group();
    ship.add(wobble);
    const model = new THREE.Group();
    model.scale.setScalar(0.9);
    wobble.add(model);
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0xfff1d6,
      metalness: 0.35,
      roughness: 0.35,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf6c453,
      metalness: 0.6,
      roughness: 0.3,
      emissive: 0x5a3a00,
      emissiveIntensity: 0.5,
    });
    const roseMat = new THREE.MeshStandardMaterial({
      color: 0xe2a39b,
      metalness: 0.5,
      roughness: 0.35,
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x3ad7ff,
      emissive: 0x3ad7ff,
      emissiveIntensity: 0.8,
      roughness: 0.1,
    });

    const hull = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.5, 2.4, 16),
      hullMat,
    );
    hull.rotation.x = Math.PI / 2;
    model.add(hull);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.9, 16), roseMat);
    nose.rotation.x = Math.PI / 2;
    nose.position.z = 1.65;
    model.add(nose);
    const cockpit = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 16, 12),
      glassMat,
    );
    cockpit.position.set(0, 0.3, 0.7);
    cockpit.scale.set(1, 0.7, 1.6);
    model.add(cockpit);
    const wing = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.07, 0.8), goldMat);
    wing.position.z = -0.3;
    model.add(wing);
    [-1, 1].forEach((s) => {
      const pod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.9, 10),
        roseMat,
      );
      pod.rotation.x = Math.PI / 2;
      pod.position.set(1.5 * s, 0, -0.3);
      model.add(pod);
    });
    // The tail fin is a cheese wedge. Non-negotiable.
    const wedge = new THREE.Shape();
    wedge.moveTo(0, 0);
    wedge.lineTo(0.9, 0);
    wedge.lineTo(0, 0.7);
    wedge.lineTo(0, 0);
    const fin = new THREE.Mesh(
      new THREE.ExtrudeGeometry(wedge, { depth: 0.08, bevelEnabled: false }),
      goldMat,
    );
    fin.rotation.y = -Math.PI / 2;
    fin.position.set(0.04, 0.3, -1.25);
    model.add(fin);
    const e1 = makeGlow(0xff4fa3, 1.8, 0.95);
    e1.position.z = -1.35;
    model.add(e1);
    const e2 = makeGlow(0xffffff, 0.6, 0.9);
    e2.position.z = -1.3;
    model.add(e2);
    const pick = new THREE.Mesh(
      new THREE.SphereGeometry(3.2, 8, 8),
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    ship.add(pick);
    systemRoot.add(ship);
    return { ship, wobble, pick };
  }

  function buildBoophole() {
    const g = new THREE.Group();
    g.position.set(178, 16, -92);
    systemRoot.add(g);
    g.lookAt(0, 0, 0);
    const spin = new THREE.Group();
    g.add(spin);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(7, 0.55, 20, 120),
      new THREE.MeshStandardMaterial({
        color: 0xffc9e3,
        emissive: 0xff4fa3,
        emissiveIntensity: 0.9,
        metalness: 0.6,
        roughness: 0.3,
      }),
    );
    spin.add(ring);
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(7.9, 0.12, 8, 120),
      new THREE.MeshStandardMaterial({
        color: 0xbff4ff,
        emissive: 0x3ad7ff,
        emissiveIntensity: 1.2,
      }),
    );
    spin.add(ring2);
    // Swiss holes around the rim
    for (let k = 0; k < 9; k++) {
      const a = (k / 9) * Math.PI * 2;
      const hole = new THREE.Mesh(
        new THREE.SphereGeometry(0.34, 12, 8),
        new THREE.MeshBasicMaterial({ color: 0x3b0f2a }),
      );
      hole.position.set(Math.cos(a) * 7, Math.sin(a) * 7, 0.42);
      spin.add(hole);
    }
    const disk = new THREE.Mesh(
      new THREE.CircleGeometry(6.8, 96),
      new THREE.ShaderMaterial({
        uniforms: { uTime: U.time },
        vertexShader:
          "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: `
          uniform float uTime; varying vec2 vUv;
          void main(){
            vec2 p = vUv - 0.5; float r = length(p) * 2.0; float a = atan(p.y, p.x);
            float s = 0.5 + 0.5 * sin(a * 5.0 + r * 16.0 - uTime * 2.6);
            float s2 = 0.5 + 0.5 * sin(a * 3.0 - r * 9.0 + uTime * 1.3);
            vec3 col = mix(vec3(1.0, 0.31, 0.64), vec3(0.23, 0.84, 1.0), s);
            col = mix(col, vec3(1.0, 0.86, 0.5), (1.0 - smoothstep(0.0, 0.35, r)) * 0.9);
            float alpha = (1.0 - smoothstep(0.75, 1.0, r)) * (0.35 + 0.5 * s * s2 + 0.4 * (1.0 - smoothstep(0.0, 0.4, r)));
            gl_FragColor = vec4(col * alpha, 1.0);
          }`,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    g.add(disk);
    g.add(makeGlow(0xff4fa3, 44, 0.45));
    g.add(makeGlow(0x3ad7ff, 26, 0.35));
    return { group: g, spin, pick: [ring, disk] };
  }

  function buildBoopstream(origin) {
    const out = origin.clone().normalize();
    const up = V(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(out, up).normalize();
    const at = (d, s, u) =>
      origin
        .clone()
        .addScaledVector(out, d)
        .addScaledVector(side, s)
        .addScaledVector(up, u);
    const curve = new THREE.CatmullRomCurve3([
      origin.clone(),
      at(60, 25, 12),
      at(260, -70, 70),
      at(700, 140, 40),
      at(1400, -80, 260),
      at(2400, 200, 380),
    ]);
    const table = curve.getSpacedPoints(1499);
    const N = 1300;
    const s = makePoints(N, PART_VS, PU);
    const cols = palette([0xff4fa3, 0x3ad7ff, 0xffe2a0, 0xff9fd0]);
    const data = [];
    for (let i = 0; i < N; i++) {
      data.push({
        t: rand(),
        off: randUnit(new THREE.Vector3()).multiplyScalar(rand()),
        sp: 0.012 + rand() * 0.01,
        size: 0.9 + rand() * 1.6,
        a: 0.4 + rand() * 0.6,
      });
      setCol(s.col, i, cols[i % 4]);
    }
    systemRoot.add(s.points);
    return { s, data, table };
  }
  function updateStream(st, sdt) {
    const { s, data, table } = st;
    const last = table.length - 1;
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      d.t -= d.sp * sdt;
      if (d.t < 0) d.t += 1;
      const p = table[Math.floor(d.t * last)];
      const spread = 1.2 + d.t * 70;
      s.pos[i * 3] = p.x + d.off.x * spread;
      s.pos[i * 3 + 1] = p.y + d.off.y * spread;
      s.pos[i * 3 + 2] = p.z + d.off.z * spread;
      s.size[i] = d.size * (1 + d.t * 9);
      s.alpha[i] = d.a * smooth(0, 0.03, d.t) * (1 - smooth(0.8, 1, d.t));
    }
    s.geo.attributes.position.needsUpdate = true;
    s.geo.attributes.aSize.needsUpdate = true;
    s.geo.attributes.aAlpha.needsUpdate = true;
  }

  function buildHighway() {
    const pts = [
      V(-165, -8, 100),
      V(-270, -26, 215),
      V(-480, -55, 350),
      V(-840, -35, 660),
      V(-1450, 25, 1080),
      V(-2300, 90, 1600),
    ];
    const curve = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 600, 1.4, 10, false),
      new THREE.ShaderMaterial({
        uniforms: { uTime: U.time },
        vertexShader:
          "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: `
          uniform float uTime; varying vec2 vUv;
          void main(){
            float d = fract(vUv.x * 160.0 - uTime * 0.6);
            float dash = smoothstep(0.0, 0.08, d) * (1.0 - smoothstep(0.45, 0.55, d));
            float fade = smoothstep(0.0, 0.03, vUv.x) * (1.0 - smoothstep(0.55, 1.0, vUv.x));
            vec3 col = mix(vec3(0.89, 0.64, 0.61), vec3(0.96, 0.77, 0.33), dash);
            gl_FragColor = vec4(col * (0.16 + 0.6 * dash) * fade, 1.0);
          }`,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    systemRoot.add(tube);
    const beacon = makeGlow(0xf6c453, 18, 0.6);
    beacon.position.copy(pts[0]);
    systemRoot.add(beacon);
    const table = curve.getSpacedPoints(999);
    const N = 70;
    const s = makePoints(N, PART_VS, PU);
    const cols = palette([0xffe2a0, 0xf6c453, 0xe2a39b]);
    const data = [];
    for (let i = 0; i < N; i++) {
      data.push({
        t: rand(),
        dir: rand() < 0.5 ? 1 : -1,
        sp: 0.006 + rand() * 0.006,
      });
      setCol(s.col, i, cols[i % 3]);
      s.size[i] = 2.4 + rand() * 1.4;
    }
    systemRoot.add(s.points);
    const anchor = new THREE.Object3D();
    anchor.position.copy(pts[0]).add(V(0, 4, 0));
    systemRoot.add(anchor);
    return { tube, anchor, caravans: { s, data, table } };
  }
  function updateCaravans(c, sdt) {
    const { s, data, table } = c;
    const last = table.length - 1;
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      d.t += d.sp * d.dir * sdt;
      if (d.t > 1) d.t -= 1;
      if (d.t < 0) d.t += 1;
      const p = table[Math.floor(d.t * last)];
      s.pos[i * 3] = p.x;
      s.pos[i * 3 + 1] = p.y + 0.6;
      s.pos[i * 3 + 2] = p.z;
      s.alpha[i] = smooth(0, 0.02, d.t) * (1 - smooth(0.5, 0.95, d.t));
    }
    s.geo.attributes.position.needsUpdate = true;
    s.geo.attributes.aAlpha.needsUpdate = true;
  }

  function buildOuterMelt() {
    const g = new THREE.Group();
    g.position.set(-1400, 620, -3600);
    scene.add(g);
    g.add(makeGlow(0xfff1d6, 260, 0.95));
    g.add(makeGlow(0xffd9b0, 620, 0.55));
    g.add(makeGlow(0xe2a39b, 1300, 0.35));
    g.add(makeGlow(0xff4fa3, 2400, 0.12));
    g.add(makeGlow(0x8a5cff, 3600, 0.07));
    // gentle tides of cheddar and memory
    const tilt = new THREE.Group();
    tilt.rotation.set(0.9, 0, 0.3);
    g.add(tilt);
    const N = 900;
    const s = makePoints(N, PART_VS, PU);
    const cols = palette([0xfff1d6, 0xffe2a0, 0xe2a39b, 0xff9fd0]);
    for (let i = 0; i < N; i++) {
      const r = 120 + Math.pow(rand(), 0.7) * 900;
      const a = rand() * Math.PI * 2 + r * 0.004 + (i % 2) * Math.PI;
      s.pos[i * 3] = Math.cos(a) * r;
      s.pos[i * 3 + 1] = gauss() * 40 * (1 - r / 1100);
      s.pos[i * 3 + 2] = Math.sin(a) * r;
      setCol(s.col, i, cols[i % 4]);
      s.size[i] = 6 + rand() * 16;
      s.alpha[i] = 0.2 + rand() * 0.5;
    }
    tilt.add(s.points);
    return { group: g, disc: s.points };
  }

  function buildConstellation() {
    const g = new THREE.Group();
    scene.add(g);
    const dir = V(0.42, 0.1, -1).normalize();
    const center = dir.clone().multiplyScalar(5200);
    const right = new THREE.Vector3().crossVectors(dir, V(0, 1, 0)).normalize();
    const upv = new THREE.Vector3().crossVectors(right, dir).normalize();
    const S = 250;
    const at = (xy) =>
      center
        .clone()
        .addScaledVector(right, xy[0] * S)
        .addScaledVector(upv, xy[1] * S);
    const stars = {
      meissa: [0.05, 2.05],
      betelgeuse: [-1.05, 1.35],
      bellatrix: [0.95, 1.2],
      mintaka: [0.38, 0.05],
      alnilam: [0.0, -0.12],
      alnitak: [-0.36, -0.3],
      saiph: [-0.85, -1.55],
      rigel: [1.0, -1.35],
    };
    const tint = { betelgeuse: 0xffb38a, rigel: 0xcfe8ff };
    Object.keys(stars).forEach((k) => {
      const p = at(stars[k]);
      const big = k === "betelgeuse" || k === "rigel";
      const a = makeGlow(tint[k] || 0xe8f0ff, big ? 110 : 75, 0.95);
      a.position.copy(p);
      g.add(a);
      const b = makeGlow(0xffffff, big ? 30 : 20, 1);
      b.position.copy(p);
      g.add(b);
    });
    const LINES = [
      ["meissa", "betelgeuse"],
      ["meissa", "bellatrix"],
      ["betelgeuse", "alnitak"],
      ["bellatrix", "mintaka"],
      ["mintaka", "alnilam"],
      ["alnilam", "alnitak"],
      ["alnitak", "saiph"],
      ["mintaka", "rigel"],
    ];
    const seg = [];
    LINES.forEach(([a, b]) => {
      seg.push(at(stars[a]), at(stars[b]));
    });
    g.add(
      new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(seg),
        new THREE.LineBasicMaterial({
          color: 0xf6c453,
          transparent: true,
          opacity: 0.22,
          depthWrite: false,
        }),
      ),
    );
    // the heart star
    const heart = new THREE.Group();
    heart.position.copy(at([0.0, 0.66]));
    g.add(heart);
    const hGlow = makeGlow(0xff4fa3, 230, 0.8);
    heart.add(hGlow);
    const hGold = makeGlow(0xffe2a0, 90, 0.9);
    heart.add(hGold);
    const hShape = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: heartTex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    hShape.scale.set(70, 70, 1);
    heart.add(hShape);
    return { group: g, heart, hGlow, hShape };
  }

  /* ==========================================================================
     BODIES: everything you can click, label, and boop
     ========================================================================== */
  const bodies = {};
  const pickables = [];
  function addBody(id, name, obj, opts) {
    bodies[id] = Object.assign(
      {
        id,
        name,
        obj,
        color: "#f6c453",
        focusDist: 14,
        lift: 3,
        boopScale: 3,
        far: false,
        reticle: 0,
        minor: false,
        maxDist: 0,
        squish: 0,
        squishTarget: null,
      },
      opts,
      { info: INFO[opts.info || id] },
    );
    if (opts.pick)
      [].concat(opts.pick).forEach((m) => {
        m.userData.bodyId = id;
        pickables.push(m);
      });
  }

  /* ==========================================================================
     UI: labels, atlas, ledger
     ========================================================================== */
  const labelsLayer = $("#labels");
  const ledger = $("#ledger");
  let labelsOn = true;
  let focusId = null;
  let panelId = null;
  const boopCounts = {};
  let totalBoops = 0;

  function makeLabels() {
    Object.values(bodies).forEach((b) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "tag off" + (b.minor ? " minor" : "");
      el.style.setProperty("--c", b.color);
      const dot = document.createElement("i");
      const txt = document.createElement("span");
      txt.textContent = b.name;
      el.append(dot, txt);
      el.addEventListener("click", () => {
        stopTour();
        focusOn(b.id);
      });
      labelsLayer.appendChild(el);
      b.label = el;
      b.labelShown = false;
    });
  }

  const NAV = {
    worlds: [
      ["sun", "The First Taste"],
      ["fondulith", "Fondulith"],
      ["fromaggio", "Fromaggio Prime"],
      ["ricotta1", "Twin Ricotta Moons"],
      ["newEarth", "New Earth"],
      ["relicotta", "Relicotta"],
      ["lactoseFree", "Lactose-Free Lands"],
    ],
    wonders: [
      ["ship", "S.S. Fondunaught"],
      ["belt", "Parmesan Belt"],
      ["boophole", "The Boophole"],
      ["highway", "Cheese Highway"],
      ["orionStar", "Orion’s Star"],
      ["outerMelt", "The Outer Melt"],
    ],
  };
  const navButtons = {};
  function makeNav() {
    [
      ["worlds", "#nav-worlds"],
      ["wonders", "#nav-wonders"],
    ].forEach(([key, sel]) => {
      const list = $(sel);
      NAV[key].forEach(([id, text]) => {
        const b = document.createElement("button");
        b.type = "button";
        b.style.setProperty("--c", bodies[id].color);
        const dot = document.createElement("i");
        b.append(dot, document.createTextNode(text));
        b.addEventListener("click", () => {
          stopTour();
          focusOn(id);
        });
        list.appendChild(b);
        navButtons[id] = b;
      });
    });
  }

  function setActive(id) {
    const infoKey = id ? bodies[id].info : null;
    Object.keys(navButtons).forEach((k) => {
      const on = !!id && bodies[k].info === infoKey;
      navButtons[k].classList.toggle("active", on);
      if (on) navButtons[k].setAttribute("aria-current", "true");
      else navButtons[k].removeAttribute("aria-current");
    });
    Object.values(bodies).forEach(
      (b) => b.label && b.label.classList.toggle("active", b.id === id),
    );
  }

  function openLedger(b) {
    const info = b.info;
    panelId = b.id;
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
    updateBoopCount();
    ledger.scrollTop = 0;
    ledger.classList.add("open");
  }
  function closeLedger() {
    ledger.classList.remove("open");
  }

  function updateBoopCount() {
    if (!panelId) return;
    const key = bodies[panelId].info.entry;
    const n = boopCounts[key] || 0;
    $("#l-count").textContent =
      n === 0
        ? "No boops here yet. Be the first!"
        : `${n} ${n === 1 ? "boop" : "boops"} delivered here, ${totalBoops} across the Meltiverse`;
  }

  /* ==========================================================================
     CAMERA FLIGHTS
     ========================================================================== */
  let fly = null;
  const easeInOut = (k) =>
    k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  function startFly(endFn, dur) {
    fly = {
      t: 0,
      dur: reduceMotion ? 0.001 : dur,
      fromPos: camera.position.clone(),
      fromTarget: controls.target.clone(),
      endFn,
    };
    controls.enabled = false;
  }
  function updateFly(dt) {
    if (!fly) return;
    fly.t += dt / fly.dur;
    const k = Math.min(fly.t, 1),
      e = easeInOut(k);
    const end = fly.endFn();
    const dist = fly.fromPos.distanceTo(end.pos);
    camera.position.lerpVectors(fly.fromPos, end.pos, e);
    camera.position.y += Math.sin(Math.PI * e) * dist * 0.12;
    controls.target.lerpVectors(fly.fromTarget, end.target, e);
    if (k >= 1) {
      fly = null;
      controls.enabled = true;
    }
  }

  const tmpF = new THREE.Vector3(),
    tmpD = new THREE.Vector3();
  function updateFollow() {
    if (fly || !focusId) return;
    const b = bodies[focusId];
    if (b.far) return;
    b.obj.getWorldPosition(tmpF);
    tmpD.subVectors(tmpF, controls.target);
    camera.position.add(tmpD);
    controls.target.copy(tmpF);
  }

  function focusOn(id) {
    const b = bodies[id];
    if (!b) return;
    focusId = id;
    const p = b.obj.getWorldPosition(new THREE.Vector3());
    const dir = camera.position.clone().sub(p);
    if (dir.lengthSq() < 1e-6) dir.set(0, 0.3, 1);
    dir.normalize();
    if (!b.far) {
      dir.y = Math.max(dir.y, 0.22);
      dir.normalize();
    }
    // narrow portrait screens get a little more breathing room
    const roomy =
      camera.aspect < 1 ? Math.sqrt(Math.min(2.2, 0.95 / camera.aspect)) : 1;
    const offset = dir.multiplyScalar(b.focusDist * roomy);
    const travel = camera.position.distanceTo(p.clone().add(offset));
    const dur = Math.min(
      3.6,
      Math.max(1.6, 1.3 + Math.log10(travel + 1) * 0.6),
    );
    startFly(() => {
      const t = b.obj.getWorldPosition(new THREE.Vector3());
      return { target: t, pos: t.clone().add(offset) };
    }, dur);
    openLedger(b);
    setActive(id);
  }

  const viewShift = { x: 0, y: 0 };
  function updateViewShift(dt) {
    const w = window.innerWidth,
      h = window.innerHeight;
    let tx = 0,
      ty = 0;
    if (ledger.classList.contains("open")) {
      if (w > 760) tx = (ledger.offsetWidth + 18) / 2;
      else ty = (Math.min(ledger.offsetHeight, h * 0.56) + 68) / 2;
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

  function goHome(dur) {
    focusId = null;
    setActive(null);
    closeLedger();
    startFly(
      () => ({ pos: HOME.pos.clone(), target: HOME.target.clone() }),
      dur,
    );
  }

  /* ---------- Grand tour ---------- */
  const TOUR = [
    "sun",
    "fromaggio",
    "ricotta1",
    "fondulith",
    "newEarth",
    "relicotta",
    "belt",
    "ship",
    "lactoseFree",
    "boophole",
    "highway",
    "orionStar",
    "outerMelt",
  ];
  const tourBtn = $("#btn-tour");
  let tourTimer = null,
    tourIdx = 0;
  function nextTourStop() {
    focusOn(TOUR[tourIdx % TOUR.length]);
    tourIdx++;
  }
  function startTour() {
    tourIdx = 0;
    nextTourStop();
    tourTimer = setInterval(nextTourStop, 9000);
    tourBtn.setAttribute("aria-pressed", "true");
    tourBtn.textContent = "⏸ Stop tour";
  }
  function stopTour() {
    if (!tourTimer) return;
    clearInterval(tourTimer);
    tourTimer = null;
    tourBtn.setAttribute("aria-pressed", "false");
    tourBtn.textContent = "✨ Grand tour";
  }

  /* ==========================================================================
     BOOPS 😚👆
     ========================================================================== */
  const boopTex = [heartTex, wedgeTex, sparkleTex];
  const boopParticles = [];
  function boop(id) {
    const b = bodies[id];
    if (!b) return;
    const origin = b.obj.getWorldPosition(new THREE.Vector3());
    const base = b.boopScale;
    for (let i = 0; i < 24; i++) {
      const s = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: boopTex[i % 3],
          transparent: true,
          depthWrite: false,
        }),
      );
      s.position.copy(origin);
      const v = randUnit(new THREE.Vector3()).multiplyScalar(
        base * (0.8 + rand() * 1.2),
      );
      v.y += base * 0.6;
      s.userData = {
        v,
        life: 0,
        max: 1.4 + rand() * 0.8,
        size: base * (0.25 + rand() * 0.3),
      };
      s.scale.set(0.001, 0.001, 1);
      scene.add(s);
      boopParticles.push(s);
    }
    b.squish = 1;
    const key = b.info.entry;
    boopCounts[key] = (boopCounts[key] || 0) + 1;
    totalBoops++;
    updateBoopCount();
  }
  function updateBoops(dt) {
    for (let i = boopParticles.length - 1; i >= 0; i--) {
      const s = boopParticles[i],
        u = s.userData;
      u.life += dt;
      const k = u.life / u.max;
      if (k >= 1) {
        scene.remove(s);
        s.material.dispose();
        boopParticles.splice(i, 1);
        continue;
      }
      s.position.addScaledVector(u.v, dt);
      u.v.multiplyScalar(Math.pow(0.2, dt));
      s.material.opacity = 1 - k * k;
      const sc = u.size * (k < 0.15 ? k / 0.15 : 1);
      s.scale.set(sc, sc, 1);
    }
  }
  function updateSquish(dt, t) {
    Object.values(bodies).forEach((b) => {
      if (!b.squishTarget || b.squish <= 0) return;
      b.squish *= Math.pow(0.015, dt);
      if (b.squish < 0.01) {
        b.squish = 0;
        b.squishTarget.scale.setScalar(1);
        return;
      }
      const s = 1 + Math.sin(t * 24) * 0.1 * b.squish;
      b.squishTarget.scale.set(s, 2 - s, s);
    });
  }

  /* ==========================================================================
     LABEL PLACEMENT (world → screen)
     ========================================================================== */
  const tmpW = new THREE.Vector3(),
    tmpP = new THREE.Vector3(),
    camDir = new THREE.Vector3(),
    toObj = new THREE.Vector3();
  function showLabel(b, on) {
    if (b.labelShown === on) return;
    b.labelShown = on;
    b.label.classList.toggle("off", !on);
  }
  function updateLabels() {
    const w = window.innerWidth,
      h = window.innerHeight;
    camera.getWorldDirection(camDir);
    Object.values(bodies).forEach((b) => {
      if (!b.label) return;
      if (!labelsOn) {
        showLabel(b, false);
        return;
      }
      b.obj.getWorldPosition(tmpW);
      const dist = tmpW.distanceTo(camera.position);
      if (b.maxDist && dist > b.maxDist) {
        showLabel(b, false);
        return;
      }
      toObj.subVectors(tmpW, camera.position);
      if (toObj.dot(camDir) <= 0) {
        showLabel(b, false);
        return;
      }
      tmpP.copy(tmpW);
      tmpP.y += b.lift;
      tmpP.project(camera);
      const x = (tmpP.x * 0.5 + 0.5) * w,
        y = (-tmpP.y * 0.5 + 0.5) * h;
      if (x < -150 || x > w + 150 || y < -60 || y > h + 60) {
        showLabel(b, false);
        return;
      }
      b.label.style.transform = `translate3d(${x.toFixed(1)}px, ${(y - 4).toFixed(1)}px, 0) translate(-50%, -100%)`;
      showLabel(b, true);
    });
  }

  /* ==========================================================================
     INPUT
     ========================================================================== */
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  function pick(cx, cy) {
    const r = canvas.getBoundingClientRect();
    ndc.set(
      ((cx - r.left) / r.width) * 2 - 1,
      -((cy - r.top) / r.height) * 2 + 1,
    );
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(pickables, false);
    return hits.length ? hits[0].object.userData.bodyId : null;
  }

  const hint = $("#hint");
  let down = null;
  canvas.addEventListener("pointerdown", (e) => {
    down = { x: e.clientX, y: e.clientY, t: performance.now() };
    stopTour();
    hint.classList.add("gone");
  });
  canvas.addEventListener("pointerup", (e) => {
    if (!down) return;
    const dx = e.clientX - down.x,
      dy = e.clientY - down.y;
    const quick = performance.now() - down.t < 600;
    down = null;
    if (dx * dx + dy * dy > 36 || !quick) return;
    const id = pick(e.clientX, e.clientY);
    if (!id) return;
    if (id === focusId && !fly) boop(id);
    else focusOn(id);
  });

  let hoverId = null,
    hoverQueued = false,
    lastMove = null;
  canvas.addEventListener("pointermove", (e) => {
    if (e.buttons) return;
    lastMove = e;
    if (hoverQueued) return;
    hoverQueued = true;
    requestAnimationFrame(() => {
      hoverQueued = false;
      const id = pick(lastMove.clientX, lastMove.clientY);
      if (id === hoverId) return;
      if (hoverId && bodies[hoverId].label)
        bodies[hoverId].label.classList.remove("hot");
      hoverId = id;
      if (id && bodies[id].label) bodies[id].label.classList.add("hot");
      canvas.classList.toggle("pointing", !!id);
    });
  });

  $("#l-close").addEventListener("click", closeLedger);
  $("#l-boop").addEventListener("click", () => {
    if (panelId) boop(panelId);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLedger();
  });

  $("#btn-home").addEventListener("click", () => {
    stopTour();
    goHome(2.4);
  });
  tourBtn.addEventListener("click", () => {
    if (tourTimer) stopTour();
    else startTour();
  });
  const orbitsBtn = $("#btn-orbits");
  orbitsBtn.addEventListener("click", () => {
    const on = orbitsBtn.getAttribute("aria-pressed") !== "true";
    orbitsBtn.setAttribute("aria-pressed", String(on));
    orbitLines.forEach((l) => {
      l.visible = on;
    });
  });
  const labelsBtn = $("#btn-labels");
  labelsBtn.addEventListener("click", () => {
    labelsOn = !labelsOn;
    labelsBtn.setAttribute("aria-pressed", String(labelsOn));
  });
  let timeScale = 1;
  const speed = $("#speed"),
    speedOut = $("#speed-out");
  speed.addEventListener("input", () => {
    timeScale = parseFloat(speed.value);
    speedOut.textContent =
      timeScale === 0 ? "paused" : timeScale.toFixed(1).replace(".0", "") + "×";
  });

  // SBS weather ticker
  const tickerText = $("#ticker-text");
  let wIdx = 0;
  setInterval(() => {
    tickerText.classList.add("fade");
    setTimeout(() => {
      wIdx = (wIdx + 1) % WEATHER.length;
      tickerText.textContent = WEATHER[wIdx];
      tickerText.classList.remove("fade");
    }, 500);
  }, 7000);

  function onResize() {
    const w = window.innerWidth,
      h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    U.pr.value = renderer.getPixelRatio();
    U.scale.value =
      canvas.height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    const portrait = w / h < 0.8;
    HOME.pos.set(0, portrait ? 130 : 64, portrait ? 420 : 228);
  }
  window.addEventListener("resize", onResize);

  /* ==========================================================================
     INIT: paint the worlds, then swoop in
     ========================================================================== */
  let sun,
    fromaggio,
    fondulith,
    newEarth,
    relicotta,
    lactoseFree,
    belt,
    shipParts,
    boophole,
    stream,
    highway,
    outerMelt,
    orion,
    palaceGlow,
    reticle;
  const moonList = [];
  let shipT = 0.8;
  const TRAIL = 80;
  let trail = null;

  function shipPos(t, out) {
    return out.set(
      Math.cos(t) * 108 + 16,
      Math.sin(t * 2) * 6 + 4,
      Math.sin(t) * 82,
    );
  }

  async function init() {
    const step = (msg) =>
      new Promise((res) => {
        loaderMsg.textContent = msg;
        requestAnimationFrame(() => setTimeout(res, 0));
      });

    await step("Curdling the Cheese Nebula…");
    buildStars();
    buildNebula();
    sun = buildSun();

    await step("Aging Fromaggio Prime…");
    const texFrom = paintSphere(512, 256, paintFromaggio, true);
    const cloudFrom = paintSphere(
      512,
      256,
      paintClouds([255, 236, 170], 12.3, 0.56),
      false,
    ).map;
    fromaggio = makePlanet({
      radius: 4.2,
      orbit: 46,
      speed: 0.07,
      phase: 0.6,
      incl: 0.02,
      tilt: 0.28,
      spin: 0.12,
      tex: texFrom,
      clouds: cloudFrom,
      emissive: 0.4,
      atmo: 0xffd36b,
      atmoI: 1.05,
      halo: 0.16,
      roughness: 0.75,
    });
    // the Parmesan Palace, a tiny pink light on the golden shore
    const palace = new THREE.Group();
    const lat = 0.42,
      lon = 1.1,
      pr = fromaggio.radius * 1.004;
    palace.position.set(
      Math.cos(lat) * Math.cos(lon) * pr,
      Math.sin(lat) * pr,
      Math.cos(lat) * Math.sin(lon) * pr,
    );
    palaceGlow = makeGlow(0xff7fc0, 1.5, 0.95);
    palace.add(palaceGlow);
    palace.add(makeGlow(0xfff1d6, 0.45, 1));
    fromaggio.mesh.add(palace);

    await step("Whipping the twin ricotta moons…");
    moonList.push(
      makeMoon(fromaggio, {
        radius: 0.85,
        dist: 8,
        speed: 0.35,
        phase: 0.4,
        incl: 0.18,
        tex: paintSphere(256, 128, paintRicotta(3.3), false).map,
      }),
    );
    moonList.push(
      makeMoon(fromaggio, {
        radius: 0.68,
        dist: 11,
        speed: 0.22,
        phase: 3.1,
        incl: -0.12,
        tex: paintSphere(256, 128, paintRicotta(8.8), false).map,
      }),
    );

    await step("Painting New Earth’s lilac sky…");
    newEarth = makePlanet({
      radius: 3.4,
      orbit: 68,
      speed: 0.045,
      phase: 3.9,
      incl: 0.03,
      tilt: 0.4,
      spin: 0.1,
      tex: paintSphere(512, 256, paintNewEarth, false),
      clouds: paintSphere(
        512,
        256,
        paintClouds([255, 255, 255], 30.1, 0.54),
        false,
      ).map,
      atmo: 0xc7a8ff,
      atmoI: 1.6,
      halo: 0.15,
      roughness: 0.7,
    });

    await step("Foaming Fondulith…");
    fondulith = makePlanet({
      radius: 2.6,
      orbit: 26,
      speed: 0.16,
      phase: 2.4,
      incl: -0.04,
      tilt: 0.5,
      spin: 0.3,
      tex: paintSphere(512, 256, paintFondulith, true),
      emissive: 0.5,
      atmo: 0x7ff5e0,
      atmoI: 1.1,
      halo: 0.12,
    });
    buildStorm(fondulith);

    await step("Polishing Relicotta’s blue stones…");
    relicotta = makePlanet({
      radius: 3.0,
      orbit: 90,
      speed: 0.03,
      phase: 5.2,
      incl: -0.025,
      tilt: 0.15,
      spin: 0.09,
      tex: paintSphere(512, 256, paintRelicotta, true),
      emissive: 0.9,
      atmo: 0x5fe0ff,
      atmoI: 1.0,
      halo: 0.1,
    });
    scatterOnSurface(
      relicotta.mesh,
      relicotta.radius,
      60,
      new THREE.IcosahedronGeometry(0.13, 0),
      new THREE.MeshStandardMaterial({
        color: 0x9ff0ff,
        emissive: 0x3ad7ff,
        emissiveIntensity: 1.3,
        flatShading: true,
      }),
      0.8,
      1.8,
    );

    await step("Sharpening the Lactose-Free Lands…");
    lactoseFree = makePlanet({
      radius: 2.6,
      orbit: 140,
      speed: 0.014,
      phase: 1.4,
      incl: 0.05,
      tilt: 0.7,
      spin: 0.05,
      tex: paintSphere(512, 256, paintLactoseFree, false),
      atmo: 0x9aa0aa,
      atmoI: 0.45,
      lineColor: 0x8d929c,
      roughness: 0.6,
      metalness: 0.3,
    });
    const bladeGeo = new THREE.ConeGeometry(0.11, 1, 4);
    bladeGeo.translate(0, 0.5, 0);
    scatterOnSurface(
      lactoseFree.mesh,
      lactoseFree.radius,
      90,
      bladeGeo,
      new THREE.MeshStandardMaterial({
        color: 0xa3a8b3,
        metalness: 0.75,
        roughness: 0.3,
        flatShading: true,
      }),
      0.4,
      1.4,
    );

    await step("Grating the Parmesan Belt…");
    belt = buildBelt();

    await step("Fueling the S.S. Fondunaught…");
    shipParts = buildShip();
    shipPos(shipT, shipParts.ship.position);
    shipParts.ship.updateMatrixWorld(true);
    trail = makePoints(TRAIL, PART_VS, PU);
    const tc1 = new THREE.Color(0xff4fa3),
      tc2 = new THREE.Color(0x3ad7ff),
      tc = new THREE.Color();
    for (let i = 0; i < TRAIL; i++) {
      const k = i / (TRAIL - 1);
      tc.copy(tc1).lerp(tc2, k);
      setCol(trail.col, i, tc);
      trail.size[i] = lerp(1.1, 0.15, k);
      trail.alpha[i] = Math.pow(1 - k, 1.5) * 0.85;
      trail.pos[i * 3] = shipParts.ship.position.x;
      trail.pos[i * 3 + 1] = shipParts.ship.position.y;
      trail.pos[i * 3 + 2] = shipParts.ship.position.z;
    }
    systemRoot.add(trail.points);

    await step("Opening the Boophole…");
    boophole = buildBoophole();
    stream = buildBoopstream(boophole.group.position.clone());
    highway = buildHighway();

    await step("Lighting the way to the Outer Melt…");
    outerMelt = buildOuterMelt();
    orion = buildConstellation();

    reticle = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: reticleTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.85,
      }),
    );
    reticle.visible = false;
    scene.add(reticle);

    /* ----- register every clickable place ----- */
    addBody("sun", "The First Taste", sun.mesh, {
      color: "#ffd36b",
      focusDist: 62,
      lift: 14,
      boopScale: 9,
      reticle: 30,
      pick: sun.mesh,
      squishTarget: sun.group,
    });
    addBody("fondulith", "Fondulith", fondulith.anchor, {
      color: "#7ff5e0",
      focusDist: 17,
      lift: 4.2,
      boopScale: 3,
      reticle: 11,
      pick: fondulith.mesh,
      squishTarget: fondulith.tilt,
    });
    addBody("fromaggio", "Fromaggio Prime", fromaggio.anchor, {
      color: "#f6c453",
      focusDist: 30,
      lift: 6.2,
      boopScale: 4.5,
      reticle: 13,
      pick: fromaggio.mesh,
      squishTarget: fromaggio.tilt,
    });
    addBody("ricotta1", "Ricotta I", moonList[0].mesh, {
      info: "ricotta",
      color: "#fff1d6",
      focusDist: 7.5,
      lift: 1.4,
      boopScale: 1.2,
      reticle: 3,
      minor: true,
      maxDist: 110,
      pick: moonList[0].mesh,
      squishTarget: moonList[0].mesh,
    });
    addBody("ricotta2", "Ricotta II", moonList[1].mesh, {
      info: "ricotta",
      color: "#fff1d6",
      focusDist: 7,
      lift: 1.2,
      boopScale: 1,
      reticle: 2.6,
      minor: true,
      maxDist: 110,
      pick: moonList[1].mesh,
      squishTarget: moonList[1].mesh,
    });
    addBody("newEarth", "New Earth", newEarth.anchor, {
      color: "#c7a8ff",
      focusDist: 21,
      lift: 5,
      boopScale: 3.6,
      reticle: 11,
      pick: newEarth.mesh,
      squishTarget: newEarth.tilt,
    });
    addBody("relicotta", "Relicotta", relicotta.anchor, {
      color: "#5fe0ff",
      focusDist: 19,
      lift: 4.6,
      boopScale: 3.2,
      reticle: 10,
      pick: relicotta.mesh,
      squishTarget: relicotta.tilt,
    });
    addBody("lactoseFree", "Lactose-Free Lands", lactoseFree.anchor, {
      color: "#a3a8b3",
      focusDist: 17,
      lift: 4.6,
      boopScale: 3,
      reticle: 10,
      pick: lactoseFree.mesh,
      squishTarget: lactoseFree.tilt,
    });
    addBody("ship", "S.S. Fondunaught", shipParts.ship, {
      color: "#ff4fa3",
      focusDist: 12,
      lift: 2.4,
      boopScale: 2,
      reticle: 7,
      minor: true,
      pick: shipParts.pick,
      squishTarget: shipParts.wobble,
    });
    addBody("belt", "Parmesan Belt", belt.anchor, {
      color: "#ffe2a0",
      focusDist: 38,
      lift: 4,
      boopScale: 6,
    });
    addBody("boophole", "Boophole", boophole.group, {
      color: "#ff4fa3",
      focusDist: 50,
      lift: 11,
      boopScale: 7,
      reticle: 24,
      pick: boophole.pick,
      squishTarget: boophole.spin,
    });
    addBody("highway", "Grate Galactic Cheese Highway", highway.anchor, {
      color: "#f6c453",
      focusDist: 70,
      lift: 6,
      boopScale: 8,
      pick: highway.tube,
    });
    addBody("orionStar", "Orion’s Star", orion.heart, {
      color: "#ff9fd0",
      far: true,
      focusDist: 1700,
      lift: 90,
      boopScale: 110,
      squishTarget: orion.heart,
    });
    addBody("outerMelt", "The Outer Melt", outerMelt.group, {
      color: "#e2a39b",
      far: true,
      focusDist: 2600,
      lift: 330,
      boopScale: 380,
      squishTarget: outerMelt.group,
    });

    makeLabels();
    makeNav();
    onResize();

    loader.classList.add("done");
    document.body.classList.add("ready");
    startFly(
      () => ({ pos: HOME.pos.clone(), target: HOME.target.clone() }),
      4.6,
    );
    requestAnimationFrame(tick);
  }

  /* ==========================================================================
     THE MELT LOOP
     ========================================================================== */
  const clock = new THREE.Clock();
  let elapsed = 0;
  const tmpA = new THREE.Vector3(),
    tmpB = new THREE.Vector3();

  function tick() {
    requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    elapsed += dt;
    const sdt = dt * timeScale;
    U.time.value = elapsed;

    sun.mesh.rotation.y += 0.02 * dt;
    planets.forEach((p) => {
      p.angle += p.speed * sdt;
      positionPlanet(p);
      p.mesh.rotation.y += p.spin * sdt;
      if (p.clouds) p.clouds.rotation.y += p.spin * 1.3 * sdt;
    });
    moons.forEach((m) => {
      m.spin.rotation.y += m.speed * sdt;
      m.mesh.rotation.y += 0.2 * sdt;
    });
    belt.group.rotation.y += 0.012 * sdt;
    updateStorm(sdt, elapsed);
    updateStream(stream, sdt);
    updateCaravans(highway.caravans, sdt);

    // the S.S. Fondunaught on patrol
    const ship = shipParts.ship;
    shipT += sdt * 0.05;
    shipPos(shipT, ship.position);
    shipPos(shipT + 0.02, tmpA);
    ship.lookAt(tmpA);
    ship.rotateZ(Math.sin(shipT * 2) * 0.25);
    ship.updateMatrixWorld(true);
    ship.localToWorld(tmpB.set(0, 0, -1.3));
    trail.pos.copyWithin(3, 0, (TRAIL - 1) * 3);
    trail.pos[0] = tmpB.x;
    trail.pos[1] = tmpB.y;
    trail.pos[2] = tmpB.z;
    trail.geo.attributes.position.needsUpdate = true;

    boophole.spin.rotation.z += 0.3 * dt;
    outerMelt.disc.rotation.y += 0.015 * dt;
    const pulse = 1 + 0.22 * Math.sin(elapsed * 2.2);
    orion.hGlow.scale.set(230 * pulse, 230 * pulse, 1);
    orion.hShape.material.opacity = 0.75 + 0.25 * Math.sin(elapsed * 2.2);
    palaceGlow.material.opacity = 0.7 + 0.3 * Math.sin(elapsed * 3);
    nebulae.forEach((n) => {
      n.material.rotation += n.userData.spin * dt;
    });

    updateBoops(dt);
    updateSquish(dt, elapsed);

    scene.updateMatrixWorld();
    updateFly(dt);
    updateFollow();
    controls.update();
    updateViewShift(dt);
    camera.updateMatrixWorld();

    if (focusId && bodies[focusId].reticle) {
      bodies[focusId].obj.getWorldPosition(reticle.position);
      const r = bodies[focusId].reticle;
      reticle.scale.set(r, r, 1);
      reticle.material.rotation += dt * 0.35;
      reticle.material.opacity = fly ? 0.25 : 0.7;
      reticle.visible = true;
    } else reticle.visible = false;

    updateLabels();
    renderer.render(scene, camera);
  }

  init().catch((err) => {
    console.error(err);
    fail("Something curdled while drawing the map: " + err.message);
  });
})();
