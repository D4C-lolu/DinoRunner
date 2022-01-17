import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js";

const SPEED = 0.05;
const CACTUS_MIN_INTERVAL = 500;
const CACTUS_MAX_INTERVAL = 2000;

const worldElem = document.querySelector("[data-game-world]");

let nextCactusTime;

export function setUpCactus() {
  nextCactusTime = CACTUS_MIN_INTERVAL;
  document
    .querySelectorAll("[data-cactus]")
    .forEach((cactus) => cactus.remove());
}

export function updateCactus(delta, speedScale) {
  document.querySelectorAll("[data-cactus]").forEach((cactus) => {
    incrementCustomProperty(cactus, "--left", delta * speedScale * SPEED * -1);
    if (getCustomProperty(cactus, "--left") <= -100) {
      cactus.remove();
    }
  });

  if (nextCactusTime <= 0) {
    createCactus();
    nextCactusTime =
      randomNumber(CACTUS_MIN_INTERVAL, CACTUS_MAX_INTERVAL) / speedScale;
  }
  nextCactusTime -= delta;
}

export function getCactusRects() {
  return [...document.querySelectorAll("[data-cactus]")].map((cactus) => {
    return cactus.getBoundingClientRect();
  });
}

function createCactus() {
  const cactus = document.createElement("img");
  cactus.dataset.cactus = true;
  cactus.src = "imgs/cactus.png";
  cactus.classList.add("cactus");
  setCustomProperty(cactus, "--left", 100);
  worldElem.append(cactus);
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
