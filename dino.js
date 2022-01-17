import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js";

const dinoELement = document.querySelector("[data-dino]");

const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015;
const FRAME_COUNT = 2;
const FRAME_TIME = 100;

let isJumping;
let dinoFrame;
let currentFrameTime;
let yVelocity;

export function setUpDino() {
  isJumping = false;
  dinoFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  setCustomProperty(dinoELement, "--bottom", 0);
  //Remove previous event listeners
  document.removeEventListener("touchstart", jump);
  document.removeEventListener("keydown", onJump);

  //handle screen touch
  document.addEventListener("touchstart", jump);
  //handle key down
  document.addEventListener("keydown", onJump);
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
}

export function getDinoRect() {
  return dinoELement.getBoundingClientRect();
}

export function setDinoLose() {
  dinoELement.src = "imgs/dino-lose.png";
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoELement.src = "imgs/dino-stationary.png";
    return;
  }

  //cycles dinosaur frame number
  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % FRAME_COUNT;
    //Update dinosaur sprite
    dinoELement.src = `imgs/dino-run-${dinoFrame}.png`;
    currentFrameTime -= FRAME_TIME;
  }
  currentFrameTime += delta * speedScale;
}

function handleJump(delta) {
  if (!isJumping) return;

  incrementCustomProperty(
    dinoELement,
    "--bottom",
    parseFloat(yVelocity * delta)
  );

  if (getCustomProperty(dinoELement, "--bottom") <= 0) {
    setCustomProperty(dinoELement, "--bottom", 0);
    isJumping = false;
  }

  yVelocity -= GRAVITY * delta;
}

function jump() {
  if (isJumping) return;
  yVelocity = JUMP_SPEED;
  isJumping = true;
}

function onJump(e) {
  if (e.code !== "Space") return;

  jump();
}
