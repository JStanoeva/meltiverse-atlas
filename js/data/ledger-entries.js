/**
 * THE LACTOSE LEDGER
 * Every catalogued place, straight from the Cheese Republic Compendium.
 * Keys match the ids used in js/world/places.js (moons share the "ricotta" entry).
 */
export const INFO = {
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
