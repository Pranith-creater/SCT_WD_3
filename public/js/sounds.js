const SoundFX = (() => {
  let ctx = null;

  const getCtx = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  };

  const playTone = (freq, duration, type = 'sine', volume = 0.15) => {
    try {
      const audio = getCtx();
      if (audio.state === 'suspended') audio.resume();
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audio.currentTime);
      gain.gain.setValueAtTime(volume, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start(audio.currentTime);
      osc.stop(audio.currentTime + duration);
    } catch (_) {}
  };

  return {
    correct: () => {
      playTone(523, 0.12);
      setTimeout(() => playTone(659, 0.12), 80);
      setTimeout(() => playTone(784, 0.18), 160);
    },
    wrong: () => {
      playTone(200, 0.25, 'sawtooth', 0.1);
      setTimeout(() => playTone(150, 0.3, 'sawtooth', 0.08), 100);
    },
    tick: () => playTone(800, 0.05, 'square', 0.06),
    timeout: () => playTone(120, 0.4, 'triangle', 0.12),
    click: () => playTone(440, 0.06, 'sine', 0.08),
    streak: (n) => {
      const base = 440 + Math.min(n, 8) * 40;
      playTone(base, 0.1);
      setTimeout(() => playTone(base + 120, 0.15), 60);
    },
    combo: () => {
      [659, 784, 988].forEach((f, i) => setTimeout(() => playTone(f, 0.1), i * 70));
    },
    powerup: () => {
      playTone(330, 0.08);
      setTimeout(() => playTone(494, 0.12), 80);
    },
    countdown: (n) => playTone(n === 0 ? 880 : 520 + n * 80, n === 0 ? 0.25 : 0.12),
    victory: () => {
      [523, 659, 784, 1047].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.2), i * 120);
      });
    },
  };
})();
