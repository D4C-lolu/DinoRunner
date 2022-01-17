import { setUpGround, updateGround } from "./ground.js";
import { setUpDino, updateDino, getDinoRect, setDinoLose } from "./dino.js";
import { setUpCactus, updateCactus, getCactusRects } from "./cactus.js";

//Game Constants
const GAME_WORLD_WIDTH = 100;
const GAME_WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

//Game loop variables
let lastTime;
let speedScale;
let score;

const worldElem = document.querySelector("[data-game-world");
const scoreElement = document.querySelector("[data-score]");
const startScreenElement = document.querySelector("[data-screen]");
//Resize window to keep 10:3 ratio
setPixelToWorldScale();
document.addEventListener("DOMContentLoaded", startup);

/*Function resizes the window and adds event listeners to initiate the game loop*/
function startup() {
  window.addEventListener("resize", setPixelToWorldScale);
  document.addEventListener("keydown", handleStart, { once: true });
  document.addEventListener("touchstart", handleStart, { once: true });
}

/*Resize window */
function setPixelToWorldScale() {
  let worldToPixelScale;
  if (
    window.innerWidth / window.innerHeight <
    GAME_WORLD_WIDTH / GAME_WORLD_HEIGHT
  ) {
    worldToPixelScale = window.innerWidth / GAME_WORLD_WIDTH;
  } else {
    worldToPixelScale = window.innerHeight / GAME_WORLD_HEIGHT;
  }

  worldElem.style.width = `${GAME_WORLD_WIDTH * worldToPixelScale}px`;
  worldElem.style.height = `${GAME_WORLD_HEIGHT * worldToPixelScale}px`;
}

/*Handles initial game loop */
function handleStart() {
  lastTime = null;
  speedScale = 1;
  score = 0;
  setUpGround();
  setUpDino();
  setUpCactus();
  startScreenElement.classList.add("hide");
  window.requestAnimationFrame(update);
}

/*Handles subsequent updates of the screen */
function update(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  const delta = time - lastTime;
  //Change ground image's left position to make the platform seem infinite
  updateGround(delta, speedScale);
  //Update Dinosaur sprite
  updateDino(delta, speedScale);
  //Update Obstacles
  updateCactus(delta, speedScale);
  //Slowly increase game speed
  updateSpeedScale(delta);
  //Increase score
  updateScore(delta);

  //Losing Logi
  if (gameOver()) return handleGameOver();
  lastTime = time;
  window.requestAnimationFrame(update);
}

function gameOver() {
  const dinoRect = getDinoRect();

  return getCactusRects().some((rect) => isCollision(rect, dinoRect));
}

function isCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.height + rect1.y > rect2.y
  );
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
}

function updateScore(delta) {
  score += delta * 0.01;
  scoreElement.textContent = Math.floor(score);
}

function handleGameOver() {
  setDinoLose();
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true });
    document.addEventListener("touchstart", handleStart, { once: true });
    startScreenElement.classList.remove("hide");
  }, 100);
}
