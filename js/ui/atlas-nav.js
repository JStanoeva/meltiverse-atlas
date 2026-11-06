/** The atlas index in the left column: the "Worlds" and "Wonders" lists. */
import { NAV } from "../data/navigation.js";
import { bodies } from "../world/bodies.js";

const navButtons = {};

// onSelect(id) runs when a list item is clicked
export function createAtlasNav({ onSelect }) {
  [
    ["worlds", "#nav-worlds"],
    ["wonders", "#nav-wonders"],
  ].forEach(([key, sel]) => {
    const list = document.querySelector(sel);
    NAV[key].forEach(([id, text]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.style.setProperty("--c", bodies[id].color);
      const dot = document.createElement("i");
      b.append(dot, document.createTextNode(text));
      b.addEventListener("click", () => onSelect(id));
      list.appendChild(b);
      navButtons[id] = b;
    });
  });
}

// Highlights the list item for a place. Both moons share one ledger entry,
// so focusing either one lights up "Twin Ricotta Moons".
export function setActiveNav(id) {
  const infoKey = id ? bodies[id].info : null;
  Object.keys(navButtons).forEach((k) => {
    const on = !!id && bodies[k].info === infoKey;
    navButtons[k].classList.toggle("active", on);
    if (on) navButtons[k].setAttribute("aria-current", "true");
    else navButtons[k].removeAttribute("aria-current");
  });
}
