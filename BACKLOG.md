# AI SLOP TSUKUYOMI DEMOSCENE

Status: In progress
Updated: 2026-04-04

## Mission

Собрать браузерную арт-хаус демосцену, которая:

- легко стартует локально;
- выглядит как безумный авторский ритуал, а не шаблонный лендинг;
- говорит про AI slop, сознание и смысл жизни;
- содержит явные, но художественно встроенные отсылки к ScreamLark, GLVM и turborium;
- использует мотивы Tsukuyomi: красная луна, инверсия черного и белого, психологическая ловушка времени, сакральная жестокость пространства.

## Research Notes

### GLVM / ScreamLark

- GLVM расшифровывается как Game Loop Versatile Modules.
- В основе движка ECS-подход, модульность, Vulkan/OpenGL, GLTF/OBJ, базовая физика и свет.
- Важное настроение для оммажа:
  - инженерная прямота;
  - "сделано руками" ощущение;
  - ритуал вокруг game loop, систем, сущностей и модулей.

### turborium / Petr

- В профиле turborium заметны Pascal, BASIC, ретро-эстетика, raylib, ZX Spectrum и чистые маленькие демки.
- PocketGalaxyJs дает важный референс:
  - минимальная формула;
  - из простой математики рождается космос;
  - демосцена не обязана быть тяжелой, она может быть умной, злой и компактной.
- Важное настроение для оммажа:
  - basement coder mysticism;
  - ретро-вычислительная честность;
  - anti-slop ethos.

### Tsukuyomi

- Ключевые опорные черты:
  - зрительный захват;
  - контроль времени внутри иллюзии;
  - красная луна;
  - обратные черно-белые фигуры;
  - пытка восприятием, а не только насилием;
  - ощущение, что секунды снаружи равны годам внутри.

## Creative Direction

### Core statement

AI slop here is not just bad content.
It is an endless genjutsu made of recycled meaning.

### Tone

- blood-red sacred machine;
- cyber-gothic ritual theater;
- diseased elegance;
- terminal poetry plus cathedral violence;
- retro basement brilliance colliding with synthetic overproduction.

### Visual pillars

- crimson lunar skies;
- black cloaked silhouettes and bound central witness;
- recursive eyes, rings, glyphs and mirrors;
- ECS diagrams as occult sigils;
- CRT rust, scanlines, phosphor green, amber code and broken white;
- deep vignette, bloom-like gradients, paper-noise and VHS wounds.

### Narrative arc

1. Invocation: the machine awakens and accuses the viewer.
2. Slop Cathedral: infinite generated sludge floods the sacred space.
3. GLVM Liturgy: engine architecture appears as anti-chaos doctrine.
4. Turborium Basement: tiny formulas create larger truth than synthetic noise.
5. Tsukuyomi Chamber: time stretches, identity fractures, repetition becomes torture.
6. Consciousness Interrogation: the demo asks whether awareness can survive automation.
7. Finale: meaning is not generated, it is suffered, chosen and rendered.

## Production Backlog

### Phase 1. Project scaffold

- [x] Create minimal browser project structure.
- [x] Add package scripts for local start and build.
- [x] Ensure fullscreen canvas layout works on desktop and mobile viewport sizes.
- [x] Add typographic system with non-default serif and code face.
- [x] Add safe boot overlay with explicit click-to-start audio.

### Phase 2. Art direction system

- [x] Define CSS variables for palette, glow, fog, grid and noise.
- [x] Build layered background treatment with gradients and scanlines.
- [x] Add composition frame, corner markers and ritual HUD elements.
- [x] Add responsive intro, captions and credits overlays.

### Phase 3. Renderer architecture

- [x] Create animation loop with time, delta and resize handling.
- [x] Build scene timeline manager with stage transitions.
- [x] Support mouse position, velocity and click pulse as uniforms/signals.
- [ ] Add reduced-motion fallback switch logic if needed.

### Phase 4. Visual systems

- [x] Blood moon and eclipse halo generator.
- [x] Recursive eye and ring sigil renderer.
- [x] Cloaked silhouettes / tribunal figures.
- [x] Central bound witness figure inspired by Tsukuyomi composition.
- [x] Particle storm for AI slop fragments.
- [x] PocketGalaxy-inspired attractor field for turborium section.
- [x] ECS orbit diagrams for GLVM section.
- [x] Mirror corridor and time slicing effect for Tsukuyomi section.
- [x] Consciousness bloom / neuron-vein rendering for finale.
- [x] Grain, chromatic offset, vignette and glitch passes.

### Phase 5. Writing

- [x] Write scene titles.
- [x] Write timed poetic lines in Russian with occasional English technical intrusions.
- [x] Add sharp references to:
  - ScreamLark;
  - GLVM;
  - Game Loop Versatile Modules;
  - ECS;
  - Vulkan/OpenGL;
  - turborium;
  - BASIC/Pascal/raylib;
  - PocketGalaxy-like minimal math ethos.
- [x] Keep references organic, not fan-service spam.

### Phase 6. Audio

- [x] Build Web Audio context boot flow.
- [x] Add drone bed.
- [x] Add pulse/heartbeat sequence.
- [x] Add filtered noise swells on transitions.
- [x] Add pitch/texture changes per scene.
- [x] Keep audio eerie but browser-safe.

### Phase 7. Interaction

- [x] Mouse should disturb particles and gaze lines.
- [x] Click should trigger pulse ripple.
- [x] Keyboard shortcuts:
  - [x] restart timeline;
  - [x] mute/unmute;
  - [x] toggle debug;
  - [x] pause/play.
- [x] Include unobtrusive controls hint.

### Phase 8. Performance

- [x] Keep animation smooth on standard laptop hardware.
- [x] Scale particle counts by device pixel ratio and viewport area.
- [ ] Avoid garbage-heavy allocations in the frame loop.
- [x] Cap expensive post-processing layers.

### Phase 9. Local run and preview

- [x] Install dependencies.
- [x] Start dev server.
- [x] Verify landing, start flow, audio unlock, resizing and keyboard controls.
- [x] Provide local URL for review.

## Scene Board

### Scene 00. Boot Ritual

- Duration target: 0s to 12s
- Purpose:
  - force attention;
  - establish ritual framing;
  - prime audio.
- Elements:
  - black screen breathing into dark crimson;
  - type fragments:
    - ENTER THE GENJUTSU;
    - CONSENT TO TEMPORAL DISTORTION;
    - AI SLOP IS A MIRROR THAT CANNOT THINK.

### Scene 01. Slop Cathedral

- Duration target: 12s to 40s
- Elements:
  - red moon;
  - cloaked jury silhouettes;
  - falling content cards / synthetic debris;
  - central white figure on a harsh cross-like frame;
  - captions about endless derivative output.

### Scene 02. GLVM Liturgy

- Duration target: 40s to 68s
- Elements:
  - modular orbit nodes;
  - labels for ENTITY, COMPONENT, SYSTEM, GLTF, VULKAN, OPENGL, GRAVITY;
  - phrase GAME LOOP VERSATILE MODULES;
  - ScreamLark invocation;
  - feeling of architecture as exorcism.

### Scene 03. Turborium Basement

- Duration target: 68s to 96s
- Elements:
  - CRT green and amber switch;
  - BASIC line numbers;
  - Pascal-like incantations;
  - pocket-galaxy particle formula vibes;
  - anti-slop line:
    - tiny code, huge cosmos.

### Scene 04. Tsukuyomi Time Trap

- Duration target: 96s to 132s
- Elements:
  - mirrored corridors;
  - repeated moons;
  - monochrome inversion around the witness;
  - time stretch text;
  - strong distortion synced to audio swells.

### Scene 05. Consciousness Chamber

- Duration target: 132s to 168s
- Elements:
  - blue-white neural blossoms cutting through red;
  - philosophical captions;
  - viewer-responsive gaze geometry;
  - question of whether awareness is compression-resistant.

### Scene 06. Finale / Verdict

- Duration target: 168s to 190s
- Elements:
  - all systems collide;
  - references return in fragments;
  - final thesis on meaning;
  - graceful loop reset.

## Risks

- Overdesign can make timing unreadable.
- Too much text can kill the demoscene feeling.
- Audio can be annoying if the spectrum is too harsh.
- Canvas effects can become muddy without strict palette discipline.
- References can feel cringe if they are inserted too literally.

## Quality Bar

- Viewer should immediately feel that this is not a stock landing page.
- The first 10 seconds must already have a strong authored identity.
- References must read as homage, not copy-paste fandom.
- The finale should leave one strong line worth remembering.
- Local launch should take one command.

## Done Definition

- Demo runs locally in browser.
- Visual language is consistent and aggressive.
- Narrative arc is legible.
- GLVM, ScreamLark, turborium and Tsukuyomi references are present.
- User can click and preview the work locally without deployment.
