import {
  FINALE_WORDS,
  GLVM_LABELS,
  STAGES,
  TOTAL_DURATION,
  TURBORIUM_TERMINAL_LINES,
  clamp,
  fract,
  getCaptionAt,
  getStageAt,
  lerp,
  smoothstep
} from "./content.js";

const TAU = Math.PI * 2;

function mixColor(from, to, amount) {
  const a = parseInt(from.slice(1), 16);
  const b = parseInt(to.slice(1), 16);
  const r = Math.round(lerp((a >> 16) & 255, (b >> 16) & 255, amount));
  const g = Math.round(lerp((a >> 8) & 255, (b >> 8) & 255, amount));
  const bValue = Math.round(lerp(a & 255, b & 255, amount));
  return `rgb(${r}, ${g}, ${bValue})`;
}

function seeded(index) {
  return fract(Math.sin(index * 214.3487) * 5742.833);
}

export class Demoscene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.time = 0;
    this.lastNow = performance.now();
    this.playing = true;
    this.debug = false;
    this.width = 1;
    this.height = 1;
    this.dpr = 1;
    this.pointer = {
      x: 0.5,
      y: 0.5,
      tx: 0.5,
      ty: 0.5,
      pulse: 0,
      trail: []
    };
    this.stageFlash = 0;
    this.lastStageKey = "boot";

    this.slopParticles = Array.from({ length: 180 }, (_, index) => ({
      angle: seeded(index + 1) * TAU,
      speed: 0.04 + seeded(index + 11) * 0.09,
      depth: seeded(index + 21),
      width: 32 + seeded(index + 31) * 130,
      height: 10 + seeded(index + 41) * 36,
      offset: seeded(index + 51) * 17,
      word: ["slop", "prompt", "echo", "feed", "mask", "noise", "trend", "copy"][index % 8]
    }));

    this.jury = Array.from({ length: 10 }, (_, index) => ({
      x: seeded(index + 61),
      y: seeded(index + 71),
      scale: 0.7 + seeded(index + 81) * 1.15,
      tilt: -0.2 + seeded(index + 91) * 0.4
    }));

    this.orbitNodes = GLVM_LABELS.map((label, index) => ({
      label,
      radius: 0.2 + (index % 3) * 0.085 + seeded(index + 101) * 0.02,
      angle: (index / GLVM_LABELS.length) * TAU,
      speed: 0.2 + seeded(index + 111) * 0.35,
      size: 16 + seeded(index + 121) * 26
    }));

    this.galaxySeeds = Array.from({ length: 24 }, (_, index) => ({
      x: seeded(index + 131),
      y: seeded(index + 141),
      hue: 80 + Math.floor(seeded(index + 151) * 70)
    }));

    this.neuralBranches = Array.from({ length: 34 }, (_, index) => ({
      angle: (index / 34) * TAU + seeded(index + 161) * 0.4,
      length: 0.14 + seeded(index + 171) * 0.32,
      bend: -0.45 + seeded(index + 181) * 0.9,
      nodes: 3 + Math.floor(seeded(index + 191) * 4)
    }));

    this.finaleWords = FINALE_WORDS.map((word, index) => ({
      word,
      angle: (index / FINALE_WORDS.length) * TAU,
      radius: 0.24 + seeded(index + 201) * 0.18
    }));

    this.resize();
  }

  restart() {
    this.time = 0;
    this.playing = true;
    this.stageFlash = 1;
  }

  togglePause() {
    this.playing = !this.playing;
    return this.playing;
  }

  toggleDebug() {
    this.debug = !this.debug;
    return this.debug;
  }

  pointerMove(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.tx = clamp((clientX - rect.left) / rect.width, 0, 1);
    this.pointer.ty = clamp((clientY - rect.top) / rect.height, 0, 1);
  }

  pointerDown(clientX, clientY) {
    this.pointerMove(clientX, clientY);
    this.pointer.pulse = 1;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    this.width = Math.max(1, Math.floor(rect.width * this.dpr));
    this.height = Math.max(1, Math.floor(rect.height * this.dpr));
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  getStageWeight(stage, time, overlap = 8) {
    const enter = smoothstep(stage.start - overlap, stage.start + overlap, time);
    const exit = 1 - smoothstep(stage.end - overlap, stage.end + overlap, time);
    return clamp(enter * exit, 0, 1);
  }

  tick(now) {
    const rawDelta = (now - this.lastNow) / 1000;
    const delta = clamp(rawDelta, 0, 0.05);
    this.lastNow = now;

    if (this.playing) {
      this.time += delta;
      if (this.time >= TOTAL_DURATION) {
        this.time -= TOTAL_DURATION;
      }
    }

    this.pointer.x = lerp(this.pointer.x, this.pointer.tx, 0.08);
    this.pointer.y = lerp(this.pointer.y, this.pointer.ty, 0.08);
    this.pointer.pulse *= 0.92;
    this.stageFlash *= 0.95;

    this.pointer.trail.push({ x: this.pointer.x, y: this.pointer.y });
    if (this.pointer.trail.length > 24) {
      this.pointer.trail.shift();
    }

    const stage = getStageAt(this.time);
    if (stage.key !== this.lastStageKey) {
      this.stageFlash = 1;
      this.lastStageKey = stage.key;
    }

    const caption = getCaptionAt(this.time);
    const stageProgress = clamp((this.time - stage.start) / (stage.end - stage.start), 0, 1);
    const weights = Object.fromEntries(STAGES.map((item) => [item.key, this.getStageWeight(item, this.time)]));

    this.render(stage, stageProgress, weights);

    return {
      time: this.time,
      duration: TOTAL_DURATION,
      caption,
      stage,
      stageProgress,
      weights,
      intensity: Math.max(...Object.values(weights)),
      paused: !this.playing,
      debug: this.debug
    };
  }

  render(stage, stageProgress, weights) {
    const ctx = this.ctx;
    const width = this.width;
    const height = this.height;

    ctx.clearRect(0, 0, width, height);
    this.drawBackdrop(stage, weights);

    this.drawBoot(weights.boot);
    this.drawCathedral(weights.cathedral);
    this.drawGLVM(weights.glvm);
    this.drawTurborium(weights.turborium);
    this.drawTsukuyomi(weights.tsukuyomi);
    this.drawConsciousness(weights.consciousness);
    this.drawFinale(weights.finale);
    this.drawPointerEcho();
    this.drawFlash();

    if (this.debug) {
      this.drawDebug(stage, stageProgress);
    }
  }

  drawBackdrop(stage, weights) {
    const ctx = this.ctx;
    const width = this.width;
    const height = this.height;
    const current = stage.accent;
    const secondary = mixColor(stage.accentSoft, "#050505", 0.15);

    const base = ctx.createLinearGradient(0, 0, 0, height);
    base.addColorStop(0, current);
    base.addColorStop(0.35, secondary);
    base.addColorStop(1, "#020202");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);

    const halo = ctx.createRadialGradient(
      width * (0.52 + (this.pointer.x - 0.5) * 0.05),
      height * (0.28 + (this.pointer.y - 0.5) * 0.02),
      0,
      width * 0.5,
      height * 0.4,
      Math.max(width, height) * 0.8
    );
    halo.addColorStop(0, "rgba(255,255,255,0.22)");
    halo.addColorStop(0.25, "rgba(255,255,255,0.08)");
    halo.addColorStop(0.75, "rgba(0,0,0,0.0)");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.05 + weights.glvm * 0.1 + weights.consciousness * 0.1;
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = Math.max(1, this.dpr);
    const gridSize = 42 * this.dpr;
    for (let x = -gridSize; x < width + gridSize; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x + (this.time * 22 * this.dpr) % gridSize, 0);
      ctx.lineTo(x - height * 0.16, height);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.04 + weights.turborium * 0.12;
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    for (let index = 0; index < 90; index += 1) {
      const x = seeded(index + Math.floor(this.time * 12)) * width;
      const y = seeded(index + 9 + Math.floor(this.time * 14)) * height;
      const size = (1 + seeded(index + 21) * 2) * this.dpr;
      ctx.fillRect(x, y, size, size);
    }
    ctx.restore();

    ctx.save();
    const floor = ctx.createLinearGradient(0, height * 0.56, 0, height);
    floor.addColorStop(0, "rgba(0,0,0,0)");
    floor.addColorStop(1, "rgba(0,0,0,0.64)");
    ctx.fillStyle = floor;
    ctx.fillRect(0, height * 0.56, width, height * 0.44);
    ctx.restore();
  }

  drawMoon(x, y, radius, alpha, eclipse = 0) {
    const ctx = this.ctx;

    ctx.save();
    ctx.globalAlpha = alpha;

    const glow = ctx.createRadialGradient(x, y, radius * 0.1, x, y, radius * 1.8);
    glow.addColorStop(0, "rgba(255,245,236,0.95)");
    glow.addColorStop(0.18, "rgba(255,128,96,0.82)");
    glow.addColorStop(0.45, "rgba(190,20,10,0.55)");
    glow.addColorStop(1, "rgba(190,20,10,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(x - radius * 2, y - radius * 2, radius * 4, radius * 4);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fillStyle = "rgba(245, 232, 220, 0.85)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + radius * 0.16 * eclipse, y - radius * 0.05, radius * 0.8, 0, TAU);
    ctx.fillStyle = "rgba(12, 4, 8, 0.92)";
    ctx.fill();

    ctx.lineWidth = this.dpr * 2;
    ctx.strokeStyle = "rgba(255, 220, 200, 0.4)";
    ctx.beginPath();
    ctx.arc(x, y, radius * 1.13, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  drawSigil(x, y, radius, alpha, rotation) {
    const ctx = this.ctx;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "rgba(255, 238, 220, 0.75)";
    ctx.lineWidth = Math.max(1.2, this.dpr * 1.4);

    for (let ring = 0; ring < 4; ring += 1) {
      ctx.beginPath();
      ctx.arc(0, 0, radius * (0.4 + ring * 0.22), 0, TAU);
      ctx.stroke();
    }

    for (let spoke = 0; spoke < 12; spoke += 1) {
      ctx.rotate(TAU / 12);
      ctx.beginPath();
      ctx.moveTo(radius * 0.25, 0);
      ctx.lineTo(radius * 1.1, 0);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 0.65, radius * 0.28, 0, 0, TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.12, 0, TAU);
    ctx.fillStyle = "rgba(255, 242, 228, 0.9)";
    ctx.fill();
    ctx.restore();
  }

  drawCloak(x, y, scale, alpha) {
    const ctx = this.ctx;
    const width = 92 * scale * this.dpr;
    const height = 212 * scale * this.dpr;

    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;

    ctx.beginPath();
    ctx.moveTo(0, -height * 0.58);
    ctx.quadraticCurveTo(width * 0.34, -height * 0.5, width * 0.34, -height * 0.25);
    ctx.quadraticCurveTo(width * 0.48, height * 0.15, width * 0.58, height * 0.62);
    ctx.quadraticCurveTo(0, height * 0.78, -width * 0.58, height * 0.62);
    ctx.quadraticCurveTo(-width * 0.48, height * 0.15, -width * 0.34, -height * 0.25);
    ctx.quadraticCurveTo(-width * 0.34, -height * 0.5, 0, -height * 0.58);
    ctx.closePath();
    ctx.fillStyle = "rgba(5, 5, 8, 0.92)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, -height * 0.42, width * 0.16, 0, TAU);
    ctx.fillStyle = "rgba(238, 238, 235, 0.72)";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-width * 0.16, height * 0.05);
    ctx.quadraticCurveTo(0, -height * 0.06, width * 0.16, height * 0.05);
    ctx.quadraticCurveTo(0, height * 0.14, -width * 0.16, height * 0.05);
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = this.dpr;
    ctx.stroke();

    ctx.restore();
  }

  drawWitness(x, y, scale, alpha, inverted = false) {
    const ctx = this.ctx;
    const s = scale * this.dpr;

    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;

    ctx.lineWidth = 10 * s;
    ctx.strokeStyle = inverted ? "rgba(248, 246, 240, 0.95)" : "rgba(8, 4, 6, 0.8)";
    ctx.beginPath();
    ctx.moveTo(0, -160 * s);
    ctx.lineTo(0, 190 * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-170 * s, -80 * s);
    ctx.lineTo(170 * s, -80 * s);
    ctx.stroke();

    ctx.fillStyle = inverted ? "rgba(248, 246, 240, 0.95)" : "rgba(12, 8, 10, 0.82)";
    ctx.strokeStyle = inverted ? "rgba(5, 4, 6, 0.95)" : "rgba(245, 240, 232, 0.45)";
    ctx.lineWidth = 2 * s;

    ctx.beginPath();
    ctx.arc(0, -108 * s, 28 * s, 0, TAU);
    ctx.fill();
    ctx.stroke();

    ctx.fillRect(-30 * s, -70 * s, 60 * s, 140 * s);

    ctx.beginPath();
    ctx.moveTo(-150 * s, -52 * s);
    ctx.lineTo(150 * s, -52 * s);
    ctx.lineWidth = 12 * s;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-18 * s, 70 * s);
    ctx.lineTo(-12 * s, 185 * s);
    ctx.moveTo(18 * s, 70 * s);
    ctx.lineTo(12 * s, 185 * s);
    ctx.stroke();

    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(side * 154 * s, -52 * s, 14 * s, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(side * 32 * s, 155 * s, 14 * s, 0, TAU);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawBoot(weight) {
    if (weight < 0.01) {
      return;
    }

    const ctx = this.ctx;
    const width = this.width;
    const height = this.height;
    const centerX = width * 0.5;
    const centerY = height * 0.4;

    this.drawMoon(centerX, centerY, Math.min(width, height) * 0.16, weight * 0.6, 0.65);
    this.drawSigil(centerX, centerY, Math.min(width, height) * 0.16, weight * 0.55, this.time * 0.2);

    ctx.save();
    ctx.globalAlpha = weight * 0.48;
    ctx.strokeStyle = "rgba(255, 240, 220, 0.45)";
    ctx.lineWidth = Math.max(1, this.dpr);
    for (let index = 0; index < 11; index += 1) {
      const x = width * (0.14 + index * 0.07) + Math.sin(this.time * 0.8 + index) * 12 * this.dpr;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawCathedral(weight) {
    if (weight < 0.01) {
      return;
    }

    const ctx = this.ctx;
    const width = this.width;
    const height = this.height;

    this.drawMoon(width * 0.5, height * 0.22, Math.min(width, height) * 0.18, weight, 0.42 + Math.sin(this.time * 0.7) * 0.18);

    for (let index = 0; index < this.jury.length; index += 1) {
      const figure = this.jury[index];
      const x = width * (0.05 + figure.x * 0.9);
      const y = height * (0.58 + figure.y * 0.28);
      const alpha = weight * (0.45 + figure.scale * 0.16);
      this.drawCloak(x, y, figure.scale, alpha);
    }

    this.drawWitness(width * 0.5, height * 0.57, 1.1, weight * 0.96, true);

    ctx.save();
    for (const particle of this.slopParticles) {
      const depth = fract(particle.depth + this.time * particle.speed + particle.offset * 0.03);
      const radius = lerp(Math.min(width, height) * 0.5, Math.min(width, height) * 0.06, depth);
      const angle = particle.angle + this.time * 0.08 + depth * 0.8;
      const x = width * 0.5 + Math.cos(angle) * radius;
      const y = height * 0.44 + Math.sin(angle * 1.3 + depth) * radius * 0.54;
      const rectWidth = particle.width * (1.2 - depth) * this.dpr * 0.55;
      const rectHeight = particle.height * (1.4 - depth) * this.dpr * 0.55;
      ctx.globalAlpha = weight * (0.08 + (1 - depth) * 0.22);
      ctx.fillStyle = "rgba(255, 244, 236, 0.85)";
      ctx.fillRect(x, y, rectWidth, rectHeight);
      ctx.fillStyle = "rgba(12, 8, 8, 0.75)";
      ctx.font = `${10 * this.dpr}px "Literata", serif`;
      ctx.fillText(particle.word, x + 5 * this.dpr, y + rectHeight - 3 * this.dpr);
    }
    ctx.restore();
  }

  drawGLVM(weight) {
    if (weight < 0.01) {
      return;
    }

    const ctx = this.ctx;
    const width = this.width;
    const height = this.height;
    const centerX = width * 0.5;
    const centerY = height * 0.52;
    const radius = Math.min(width, height) * 0.16;

    this.drawSigil(centerX, centerY, radius, weight * 0.45, -this.time * 0.18);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.globalAlpha = weight;

    ctx.fillStyle = "rgba(12, 10, 8, 0.65)";
    ctx.strokeStyle = "rgba(255, 218, 182, 0.7)";
    ctx.lineWidth = 2 * this.dpr;
    ctx.beginPath();
    ctx.roundRect(-90 * this.dpr, -34 * this.dpr, 180 * this.dpr, 68 * this.dpr, 18 * this.dpr);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 240, 224, 0.9)";
    ctx.font = `${18 * this.dpr}px "Literata", serif`;
    ctx.textAlign = "center";
    ctx.fillText("GLVM", 0, 6 * this.dpr);

    ctx.font = `${11 * this.dpr}px "Literata", serif`;
    ctx.fillStyle = "rgba(255, 220, 188, 0.65)";
    ctx.fillText("GAME LOOP VERSATILE MODULES", 0, 26 * this.dpr);

    for (const node of this.orbitNodes) {
      const angle = node.angle + this.time * node.speed + this.pointer.x * 0.4;
      const distance = radius * (1.1 + node.radius);
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance * 0.78;

      ctx.strokeStyle = "rgba(255, 214, 168, 0.4)";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.fillStyle = "rgba(6, 4, 3, 0.75)";
      ctx.strokeStyle = "rgba(255, 228, 204, 0.72)";
      ctx.beginPath();
      ctx.roundRect(
        x - node.size * this.dpr * 1.6,
        y - node.size * this.dpr * 0.72,
        node.size * this.dpr * 3.2,
        node.size * this.dpr * 1.45,
        10 * this.dpr
      );
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 239, 220, 0.92)";
      ctx.font = `${11 * this.dpr}px "Cascadia Mono", "Courier New", monospace`;
      ctx.fillText(node.label, x, y + 4 * this.dpr);
    }

    ctx.restore();
  }

  drawTurborium(weight) {
    if (weight < 0.01) {
      return;
    }

    const ctx = this.ctx;
    const width = this.width;
    const height = this.height;

    ctx.save();
    ctx.globalAlpha = weight * 0.28;
    ctx.strokeStyle = "rgba(166, 230, 146, 0.6)";
    ctx.lineWidth = Math.max(1, this.dpr);
    const gap = 36 * this.dpr;
    for (let x = 0; x < width; x += gap) {
      ctx.beginPath();
      ctx.moveTo(x, height * 0.18);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = height * 0.2; y < height; y += gap) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = weight * 0.74;
    for (const seed of this.galaxySeeds) {
      let x = seed.x;
      let y = seed.y;
      for (let index = 0; index < 70; index += 1) {
        x = fract(x + Math.cos(y * TAU + this.time * 0.04) * 0.081);
        y = fract(y + Math.sin(x * TAU - this.time * 0.03) * 0.081);
        const px = x * width;
        const py = height * 0.12 + y * height * 0.56;
        const size = (1.1 + index / 70) * this.dpr;
        ctx.fillStyle = `hsla(${seed.hue}, 72%, ${48 + (index % 12)}%, 0.14)`;
        ctx.fillRect(px, py, size, size);
      }
    }
    ctx.restore();

    ctx.save();
    const panelX = width * 0.08;
    const panelY = height * 0.64;
    const panelW = width * 0.44;
    const panelH = height * 0.2;
    ctx.globalAlpha = weight;
    ctx.fillStyle = "rgba(6, 14, 8, 0.76)";
    ctx.strokeStyle = "rgba(194, 249, 170, 0.65)";
    ctx.lineWidth = 2 * this.dpr;
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelW, panelH, 18 * this.dpr);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(213, 249, 195, 0.88)";
    ctx.font = `${12 * this.dpr}px "Cascadia Mono", "Courier New", monospace`;
    ctx.textAlign = "left";
    TURBORIUM_TERMINAL_LINES.forEach((line, index) => {
      ctx.fillText(line, panelX + 18 * this.dpr, panelY + (28 + index * 22) * this.dpr);
    });
    ctx.restore();
  }

  drawTsukuyomi(weight) {
    if (weight < 0.01) {
      return;
    }

    const ctx = this.ctx;
    const width = this.width;
    const height = this.height;
    const centerX = width * 0.5;
    const centerY = height * 0.49;

    this.drawMoon(centerX, height * 0.18, Math.min(width, height) * 0.17, weight * 0.82, 0.12);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.globalAlpha = weight;
    ctx.strokeStyle = "rgba(255, 244, 236, 0.52)";
    ctx.lineWidth = Math.max(1, this.dpr);
    for (let index = 0; index < 10; index += 1) {
      const depth = 1 - index / 10;
      const wave = Math.sin(this.time * 1.2 + index * 0.7) * 12 * this.dpr;
      ctx.strokeRect(
        -width * 0.34 * depth + wave * 0.15,
        -height * 0.24 * depth,
        width * 0.68 * depth,
        height * 0.48 * depth
      );
    }
    ctx.restore();

    for (let index = 0; index < 5; index += 1) {
      const scale = 0.95 - index * 0.12;
      const alpha = weight * (0.72 - index * 0.12);
      this.drawWitness(centerX, height * (0.58 - index * 0.028), scale, alpha, index % 2 === 0);
    }

    ctx.save();
    ctx.globalAlpha = weight * 0.24;
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillRect(width * 0.42, 0, width * 0.16, height);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = weight * 0.42;
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    for (let index = 0; index < 28; index += 1) {
      const y = height * (0.16 + index * 0.026);
      const length = width * (0.08 + (index % 5) * 0.02);
      ctx.beginPath();
      ctx.moveTo(centerX - length, y + Math.sin(this.time * 0.7 + index) * 14 * this.dpr);
      ctx.lineTo(centerX + length, y - Math.sin(this.time * 0.7 + index) * 14 * this.dpr);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawConsciousness(weight) {
    if (weight < 0.01) {
      return;
    }

    const ctx = this.ctx;
    const width = this.width;
    const height = this.height;
    const centerX = width * lerp(0.48, 0.55, this.pointer.x);
    const centerY = height * lerp(0.47, 0.53, this.pointer.y);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = weight;
    for (const branch of this.neuralBranches) {
      const steps = branch.nodes;
      let prevX = centerX;
      let prevY = centerY;

      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      for (let step = 1; step <= steps; step += 1) {
        const progress = step / steps;
        const angle = branch.angle + branch.bend * progress + Math.sin(this.time + branch.angle * 3) * 0.18;
        const distance = Math.min(width, height) * branch.length * progress * (1 + this.pointer.pulse * 0.08);
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance * 0.82;
        ctx.lineTo(x, y);
        prevX = x;
        prevY = y;
      }
      ctx.strokeStyle = "rgba(162, 236, 255, 0.24)";
      ctx.lineWidth = (1.2 + branch.length * 3.5) * this.dpr;
      ctx.stroke();

      ctx.fillStyle = "rgba(230, 249, 255, 0.75)";
      ctx.beginPath();
      ctx.arc(prevX, prevY, (2 + branch.length * 8) * this.dpr, 0, TAU);
      ctx.fill();
    }
    ctx.restore();

    this.drawSigil(centerX, centerY, Math.min(width, height) * 0.12, weight * 0.32, this.time * 0.28);

    ctx.save();
    ctx.globalAlpha = weight * 0.58;
    ctx.fillStyle = "rgba(232, 248, 255, 0.9)";
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 66 * this.dpr, 28 * this.dpr, 0, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      centerX + (this.pointer.x - 0.5) * 22 * this.dpr,
      centerY + (this.pointer.y - 0.5) * 12 * this.dpr,
      11 * this.dpr,
      0,
      TAU
    );
    ctx.fillStyle = "rgba(0, 14, 20, 0.94)";
    ctx.fill();
    ctx.restore();
  }

  drawFinale(weight) {
    if (weight < 0.01) {
      return;
    }

    const ctx = this.ctx;
    const width = this.width;
    const height = this.height;
    const centerX = width * 0.5;
    const centerY = height * 0.48;

    this.drawMoon(centerX, height * 0.22, Math.min(width, height) * 0.15, weight * 0.72, 0.3);
    this.drawSigil(centerX, centerY, Math.min(width, height) * 0.22, weight * 0.42, -this.time * 0.16);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.globalAlpha = weight * 0.92;
    ctx.textAlign = "center";
    for (const item of this.finaleWords) {
      const angle = item.angle + this.time * 0.11;
      const radius = Math.min(width, height) * item.radius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.82;
      ctx.fillStyle = "rgba(255, 238, 220, 0.68)";
      ctx.font = `${13 * this.dpr}px "Cascadia Mono", "Courier New", monospace`;
      ctx.fillText(item.word, x, y);
    }
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = weight * 0.2;
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fillRect(0, height * 0.5 - 1.5 * this.dpr, width, 3 * this.dpr);
    ctx.fillRect(width * 0.5 - 1.5 * this.dpr, 0, 3 * this.dpr, height);
    ctx.restore();
  }

  drawPointerEcho() {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    this.pointer.trail.forEach((entry, index) => {
      const weight = index / this.pointer.trail.length;
      ctx.globalAlpha = weight * 0.18;
      ctx.beginPath();
      ctx.arc(entry.x * this.width, entry.y * this.height, (3 + weight * 10) * this.dpr, 0, TAU);
      ctx.fillStyle = "rgba(244, 242, 236, 0.85)";
      ctx.fill();
    });
    ctx.restore();
  }

  drawFlash() {
    if (this.stageFlash < 0.01 && this.pointer.pulse < 0.01) {
      return;
    }

    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = this.stageFlash * 0.08 + this.pointer.pulse * 0.06;
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();
  }

  drawDebug(stage, stageProgress) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.fillRect(22 * this.dpr, 22 * this.dpr, 260 * this.dpr, 72 * this.dpr);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = `${12 * this.dpr}px "Cascadia Mono", "Courier New", monospace`;
    ctx.textAlign = "left";
    ctx.fillText(`stage=${stage.key}`, 34 * this.dpr, 48 * this.dpr);
    ctx.fillText(`time=${this.time.toFixed(2)}`, 34 * this.dpr, 68 * this.dpr);
    ctx.fillText(`progress=${stageProgress.toFixed(2)}`, 34 * this.dpr, 88 * this.dpr);
    ctx.restore();
  }
}
