const Sounds = (() => {
  let ctx = null;
  let bgInterval = null;
  let bgPlaying = false;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctx;
  }

  function playNote(freq, duration, type, volume, delay) {
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type || 'square';
      osc.frequency.setValueAtTime(freq, c.currentTime + (delay || 0));
      gain.gain.setValueAtTime((volume || 0.15) * 0.3, c.currentTime + (delay || 0));
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + (delay || 0) + duration);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(c.currentTime + (delay || 0));
      osc.stop(c.currentTime + (delay || 0) + duration);
    } catch (e) {}
  }

  function playJump() {
    playNote(300, 0.08, 'square', 0.2, 0);
    playNote(500, 0.08, 'square', 0.2, 0.05);
    playNote(700, 0.1, 'square', 0.15, 0.1);
  }

  function playHit() {
    playNote(200, 0.15, 'sawtooth', 0.25, 0);
    playNote(150, 0.2, 'sawtooth', 0.2, 0.1);
    playNote(100, 0.3, 'sawtooth', 0.15, 0.2);
  }

  function playRuby() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => playNote(f, 0.12, 'square', 0.15, i * 0.08));
  }

  function playMedal() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((f, i) => playNote(f, 0.15, 'square', 0.18, i * 0.1));
    playNote(523, 0.4, 'triangle', 0.1, 0.5);
  }

  function playCup() {
    const notes = [523, 659, 784, 1047, 1319, 1568];
    notes.forEach((f, i) => playNote(f, 0.15, 'square', 0.2, i * 0.1));
    playNote(1047, 0.3, 'triangle', 0.15, 0.6);
    playNote(1568, 0.5, 'triangle', 0.12, 0.7);
  }

  function playEpicWin() {
    const melody = [
      [523, 0.2], [659, 0.2], [784, 0.2], [1047, 0.4],
      [784, 0.2], [1047, 0.6],
      [1319, 0.2], [1568, 0.2], [1319, 0.2], [1047, 0.6],
      [1568, 0.3], [2093, 0.8]
    ];
    let t = 0;
    melody.forEach(([freq, dur]) => {
      playNote(freq, dur * 0.9, 'square', 0.18, t);
      playNote(freq * 0.5, dur * 0.9, 'triangle', 0.08, t);
      t += dur;
    });
  }

  const bgMelody = [
    262, 294, 330, 349, 392, 349, 330, 294,
    262, 330, 392, 523, 392, 330, 294, 262,
    349, 392, 440, 392, 349, 330, 294, 330,
    262, 294, 330, 392, 330, 294, 262, 294,
  ];
  let bgIndex = 0;

  function startBackground() {
    if (bgPlaying) return;
    bgPlaying = true;
    bgIndex = 0;
    bgInterval = setInterval(() => {
      if (!bgPlaying) return;
      const freq = bgMelody[bgIndex % bgMelody.length];
      playNote(freq, 0.18, 'triangle', 0.06, 0);
      playNote(freq * 0.5, 0.18, 'sine', 0.04, 0);
      bgIndex++;
    }, 200);
  }

  function stopBackground() {
    bgPlaying = false;
    if (bgInterval) {
      clearInterval(bgInterval);
      bgInterval = null;
    }
  }

  return {
    playJump,
    playHit,
    playRuby,
    playMedal,
    playCup,
    playEpicWin,
    startBackground,
    stopBackground,
    getCtx,
  };
})();
