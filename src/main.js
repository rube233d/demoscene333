import "./style.css";

import { createAudioEngine } from "./audio.js";
import { formatTime } from "./content.js";
import { Demoscene } from "./demo.js";

const canvas = document.querySelector("#scene");
const intro = document.querySelector("#intro");
const startButton = document.querySelector("#startButton");
const captionKicker = document.querySelector("#captionKicker");
const captionTitle = document.querySelector("#captionTitle");
const captionBody = document.querySelector("#captionBody");
const hudStage = document.querySelector("#hudStage");
const hudTime = document.querySelector("#hudTime");
const hudMode = document.querySelector("#hudMode");
const hudDebugWrap = document.querySelector("#hudDebugWrap");
const hudDebug = document.querySelector("#hudDebug");

const demo = new Demoscene(canvas);
const audio = createAudioEngine();
const searchParams = new URLSearchParams(window.location.search);

let started = false;

function updateUi(state) {
  captionKicker.textContent = state.caption.kicker;
  captionTitle.textContent = state.caption.title;
  captionBody.textContent = state.caption.body;
  hudStage.textContent = state.stage.label;
  hudTime.textContent = `${formatTime(state.time)} / ${formatTime(state.duration)}`;
  hudMode.textContent = !started ? "STANDBY" : state.paused ? "PAUSED" : audio.muted ? "RUNNING / MUTE" : "RUNNING";
  hudDebugWrap.hidden = !state.debug;
  hudDebug.textContent = `stage=${state.stage.key} weight=${state.intensity.toFixed(2)} progress=${state.stageProgress.toFixed(2)}`;

  document.documentElement.style.setProperty("--accent", state.stage.accent);
  document.documentElement.style.setProperty("--accent-soft", state.stage.accentSoft);
}

async function startExperience(options = {}) {
  const { skipAudio = false } = options;

  if (!started) {
    if (!skipAudio) {
      await audio.start();
    }
    started = true;
    document.body.classList.add("started");
  }

  demo.restart();
  intro.classList.add("intro--hidden");
}

startButton.addEventListener("click", () => {
  void startExperience();
});

window.addEventListener("keydown", async (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    if (!started) {
      await startExperience();
      return;
    }
    demo.togglePause();
    return;
  }

  if (event.key.toLowerCase() === "r") {
    if (!started) {
      await startExperience();
      return;
    }
    demo.restart();
    return;
  }

  if (event.key.toLowerCase() === "m") {
    if (!started) {
      await audio.start();
      started = true;
      document.body.classList.add("started");
      intro.classList.add("intro--hidden");
    }
    audio.toggleMute();
    return;
  }

  if (event.key.toLowerCase() === "d") {
    demo.toggleDebug();
  }
});

window.addEventListener("resize", () => demo.resize());
window.addEventListener("pointermove", (event) => demo.pointerMove(event.clientX, event.clientY));
window.addEventListener("pointerdown", (event) => demo.pointerDown(event.clientX, event.clientY));

if (searchParams.get("autostart") === "1") {
  void startExperience({ skipAudio: searchParams.get("mute") === "1" });
}

function loop(now) {
  const state = demo.tick(now);
  if (started) {
    audio.sync(state);
  }
  updateUi(state);
  window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
