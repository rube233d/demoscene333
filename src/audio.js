const PROFILES = {
  boot: { root: 42, drone: 0.12, air: 0.03, noise: 0.02, filter: 520, beat: 0.7, pulse: 0.06 },
  cathedral: { root: 48, drone: 0.16, air: 0.05, noise: 0.05, filter: 680, beat: 1.1, pulse: 0.09 },
  glvm: { root: 55, drone: 0.15, air: 0.04, noise: 0.03, filter: 920, beat: 1.4, pulse: 0.07 },
  turborium: { root: 64, drone: 0.11, air: 0.03, noise: 0.045, filter: 1240, beat: 1.8, pulse: 0.05 },
  tsukuyomi: { root: 38, drone: 0.18, air: 0.07, noise: 0.08, filter: 520, beat: 0.95, pulse: 0.12 },
  consciousness: { root: 74, drone: 0.12, air: 0.08, noise: 0.03, filter: 1800, beat: 1.0, pulse: 0.08 },
  finale: { root: 58, drone: 0.15, air: 0.06, noise: 0.05, filter: 1400, beat: 1.3, pulse: 0.1 }
};

function createNoiseBuffer(context) {
  const length = context.sampleRate * 2;
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let index = 0; index < length; index += 1) {
    channel[index] = Math.random() * 2 - 1;
  }
  return buffer;
}

export function createAudioEngine() {
  const state = {
    context: null,
    master: null,
    atmosphere: null,
    noiseMix: null,
    droneA: null,
    droneB: null,
    shimmer: null,
    filter: null,
    noiseFilter: null,
    muted: false,
    started: false,
    lastBeat: -1,
    lastStageKey: ""
  };

  function ensureStarted() {
    if (state.started) {
      return state.context;
    }

    const context = new window.AudioContext();
    const master = context.createGain();
    const compressor = context.createDynamicsCompressor();
    const filter = context.createBiquadFilter();
    const atmosphere = context.createGain();
    const noiseMix = context.createGain();
    const airMix = context.createGain();

    compressor.threshold.value = -18;
    compressor.knee.value = 20;
    compressor.ratio.value = 5;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.24;

    filter.type = "lowpass";
    filter.frequency.value = 640;
    filter.Q.value = 0.4;

    master.gain.value = 0.48;
    atmosphere.gain.value = 0.1;
    noiseMix.gain.value = 0.02;
    airMix.gain.value = 0.03;

    master.connect(compressor);
    compressor.connect(context.destination);
    atmosphere.connect(filter);
    noiseMix.connect(filter);
    airMix.connect(filter);
    filter.connect(master);

    const droneA = context.createOscillator();
    const droneB = context.createOscillator();
    const shimmer = context.createOscillator();
    const droneAGain = context.createGain();
    const droneBGain = context.createGain();
    const shimmerGain = context.createGain();

    droneA.type = "sawtooth";
    droneB.type = "triangle";
    shimmer.type = "sine";

    droneA.frequency.value = 42;
    droneB.frequency.value = 63;
    shimmer.frequency.value = 196;

    droneAGain.gain.value = 0.08;
    droneBGain.gain.value = 0.05;
    shimmerGain.gain.value = 0.025;

    droneA.connect(droneAGain);
    droneB.connect(droneBGain);
    shimmer.connect(shimmerGain);
    droneAGain.connect(atmosphere);
    droneBGain.connect(atmosphere);
    shimmerGain.connect(airMix);

    const noiseSource = context.createBufferSource();
    const noiseFilter = context.createBiquadFilter();
    noiseSource.buffer = createNoiseBuffer(context);
    noiseSource.loop = true;
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 720;
    noiseFilter.Q.value = 0.5;
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseMix);

    const wobble = context.createOscillator();
    const wobbleGain = context.createGain();
    wobble.type = "sine";
    wobble.frequency.value = 0.11;
    wobbleGain.gain.value = 9;
    wobble.connect(wobbleGain);
    wobbleGain.connect(droneA.detune);

    const shimmerLfo = context.createOscillator();
    const shimmerLfoGain = context.createGain();
    shimmerLfo.type = "triangle";
    shimmerLfo.frequency.value = 0.07;
    shimmerLfoGain.gain.value = 45;
    shimmerLfo.connect(shimmerLfoGain);
    shimmerLfoGain.connect(shimmer.frequency);

    droneA.start();
    droneB.start();
    shimmer.start();
    noiseSource.start();
    wobble.start();
    shimmerLfo.start();

    state.context = context;
    state.master = master;
    state.atmosphere = atmosphere;
    state.noiseMix = noiseMix;
    state.droneA = { osc: droneA, gain: droneAGain };
    state.droneB = { osc: droneB, gain: droneBGain };
    state.shimmer = { osc: shimmer, gain: shimmerGain };
    state.filter = filter;
    state.noiseFilter = noiseFilter;
    state.started = true;

    return context;
  }

  function setMuted(muted) {
    state.muted = muted;
    if (!state.started) {
      return;
    }

    const now = state.context.currentTime;
    state.master.gain.setTargetAtTime(muted ? 0 : 0.48, now, 0.08);
  }

  function triggerPulse(amount, root) {
    if (!state.started || state.muted) {
      return;
    }

    const now = state.context.currentTime;
    const osc = state.context.createOscillator();
    const gain = state.context.createGain();
    const tone = state.context.createBiquadFilter();

    osc.type = "square";
    osc.frequency.setValueAtTime(root * 2, now);
    osc.frequency.exponentialRampToValueAtTime(root * 0.75, now + 0.18);

    tone.type = "lowpass";
    tone.frequency.value = 1200;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.03 + amount, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(tone);
    tone.connect(gain);
    gain.connect(state.master);

    osc.start(now);
    osc.stop(now + 0.24);
  }

  function sync(sceneState) {
    if (!state.started) {
      return;
    }

    const profile = PROFILES[sceneState.stage.key];
    const now = state.context.currentTime;
    const energy = 0.65 + sceneState.intensity * 0.45;

    state.filter.frequency.setTargetAtTime(profile.filter + sceneState.stageProgress * 300, now, 0.25);
    state.noiseFilter.frequency.setTargetAtTime(profile.filter * 0.9, now, 0.2);

    state.droneA.osc.frequency.setTargetAtTime(profile.root, now, 0.2);
    state.droneB.osc.frequency.setTargetAtTime(profile.root * 1.51, now, 0.2);
    state.shimmer.osc.frequency.setTargetAtTime(profile.root * 4.1, now, 0.25);

    state.droneA.gain.gain.setTargetAtTime(profile.drone * energy, now, 0.3);
    state.droneB.gain.gain.setTargetAtTime(profile.drone * 0.72 * energy, now, 0.3);
    state.shimmer.gain.gain.setTargetAtTime(profile.air * (0.8 + sceneState.stageProgress * 0.4), now, 0.25);
    state.noiseMix.gain.setTargetAtTime(profile.noise * energy, now, 0.18);

    const beatIndex = Math.floor(sceneState.time * profile.beat);
    if (beatIndex !== state.lastBeat && !sceneState.paused) {
      state.lastBeat = beatIndex;
      triggerPulse(profile.pulse * (0.6 + sceneState.intensity * 0.8), profile.root);
    }

    if (sceneState.stage.key !== state.lastStageKey) {
      state.lastStageKey = sceneState.stage.key;
      triggerPulse(profile.pulse * 1.5, profile.root * 1.4);
    }
  }

  return {
    async start() {
      const context = ensureStarted();
      if (context.state === "suspended") {
        await context.resume();
      }
      return context;
    },
    sync,
    setMuted,
    toggleMute() {
      setMuted(!state.muted);
      return state.muted;
    },
    get muted() {
      return state.muted;
    },
    get started() {
      return state.started;
    }
  };
}
