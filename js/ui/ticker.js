/** The Smoochlight Broadcasting Service weather ticker. */
import { WEATHER } from "../data/weather.js";

export function startWeatherTicker() {
  const tickerText = document.querySelector("#ticker-text");
  let wIdx = 0;
  setInterval(() => {
    tickerText.classList.add("fade");
    setTimeout(() => {
      wIdx = (wIdx + 1) % WEATHER.length;
      tickerText.textContent = WEATHER[wIdx];
      tickerText.classList.remove("fade");
    }, 500);
  }, 7000);
}
