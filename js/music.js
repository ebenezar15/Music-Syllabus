/* Music engine: note spelling, chord parsing, transposition, keys, audio playback */
(function () {
  const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const LETTER_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  // The 12 keys as students usually name them
  const KEYS = [
    { name: 'C', pc: 0, flat: false, minor: 'Am' },
    { name: 'Db', pc: 1, flat: true, minor: 'Bbm' },
    { name: 'D', pc: 2, flat: false, minor: 'Bm' },
    { name: 'Eb', pc: 3, flat: true, minor: 'Cm' },
    { name: 'E', pc: 4, flat: false, minor: 'C#m' },
    { name: 'F', pc: 5, flat: true, minor: 'Dm' },
    { name: 'F#', pc: 6, flat: false, minor: 'D#m' },
    { name: 'G', pc: 7, flat: false, minor: 'Em' },
    { name: 'Ab', pc: 8, flat: true, minor: 'Fm' },
    { name: 'A', pc: 9, flat: false, minor: 'F#m' },
    { name: 'Bb', pc: 10, flat: true, minor: 'Gm' },
    { name: 'B', pc: 11, flat: false, minor: 'G#m' }
  ];
  const MINOR_KEYS = [
    { name: 'Cm', root: 'C', pc: 0 }, { name: 'C#m', root: 'C#', pc: 1 }, { name: 'Dm', root: 'D', pc: 2 },
    { name: 'Ebm', root: 'Eb', pc: 3 }, { name: 'Em', root: 'E', pc: 4 }, { name: 'Fm', root: 'F', pc: 5 },
    { name: 'F#m', root: 'F#', pc: 6 }, { name: 'Gm', root: 'G', pc: 7 }, { name: 'G#m', root: 'G#', pc: 8 },
    { name: 'Am', root: 'A', pc: 9 }, { name: 'Bbm', root: 'Bb', pc: 10 }, { name: 'Bm', root: 'B', pc: 11 }
  ];
  const CIRCLE_ORDER = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5]; // pcs around the circle of 5ths

  const mod = (n, m = 12) => ((n % m) + m) % m;

  function parseNote(name) {
    const m = /^([A-Ga-g])(#{1,2}|b{1,2}|x)?(-?\d)?$/.exec(name.trim());
    if (!m) return null;
    const letter = m[1].toUpperCase();
    let acc = 0;
    if (m[2]) acc = m[2] === 'x' ? 2 : (m[2][0] === '#' ? m[2].length : -m[2].length);
    const pc = mod(LETTER_PC[letter] + acc);
    const octave = m[3] !== undefined ? parseInt(m[3], 10) : null;
    return { letter, acc, pc, octave, midi: octave !== null ? 12 * (octave + 1) + LETTER_PC[letter] + acc : null };
  }
  const pcOf = (name) => (parseNote(name) || { pc: 0 }).pc;
  const nameOf = (pc, flat) => (flat ? FLATS : SHARPS)[mod(pc)];
  const accStr = (a) => (a > 0 ? '#'.repeat(a) : 'b'.repeat(-a));
  const pretty = (s) => String(s).replace(/##/g, '𝄪').replace(/bb(?![a-z])/g, '𝄫').replace(/#/g, '♯').replace(/([A-G])b/g, '$1♭').replace(/\bb([0-9])/g, '♭$1').replace(/\(b/g, '(♭');

  // Correct letter spelling: root name + interval (semitones) + generic step (0=unison,1=2nd,...)
  function spell(rootName, semis, step) {
    const r = parseNote(rootName);
    const letter = LETTERS[(LETTERS.indexOf(r.letter) + step) % 7];
    const target = mod(r.pc + semis);
    let acc = mod(target - LETTER_PC[letter]);
    if (acc > 6) acc -= 12;
    if (Math.abs(acc) > 2) return nameOf(target, r.acc < 0);
    return letter + accStr(acc);
  }

  // Degree formula → [{semis, step}]
  const DEG_SEMIS = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11, 9: 14, 11: 17, 13: 21 };
  function parseFormula(f) {
    return f.split(' ').map((d) => {
      const m = /^(bb|b|#)?(\d+)$/.exec(d);
      const deg = parseInt(m[2], 10);
      const shift = m[1] === 'bb' ? -2 : m[1] === 'b' ? -1 : m[1] === '#' ? 1 : 0;
      return { semis: DEG_SEMIS[deg] + shift, step: (deg - 1) % 7, label: d };
    });
  }

  // Chord dictionary: suffix → { formula, name }
  const CHORDS = {
    '': ['1 3 5', 'major'], m: ['1 b3 5', 'minor'], dim: ['1 b3 b5', 'diminished'], aug: ['1 3 #5', 'augmented'],
    sus2: ['1 2 5', 'suspended 2nd'], sus4: ['1 4 5', 'suspended 4th'], 5: ['1 5', 'power chord'],
    7: ['1 3 5 b7', 'dominant 7th'], maj7: ['1 3 5 7', 'major 7th'], m7: ['1 b3 5 b7', 'minor 7th'],
    mMaj7: ['1 b3 5 7', 'minor-major 7th'], dim7: ['1 b3 b5 bb7', 'diminished 7th'], m7b5: ['1 b3 b5 b7', 'half-diminished'],
    aug7: ['1 3 #5 b7', 'augmented 7th'], '7sus4': ['1 4 5 b7', 'dominant 7 sus4'], 6: ['1 3 5 6', 'major 6th'],
    m6: ['1 b3 5 6', 'minor 6th'], 69: ['1 3 5 6 9', 'six-nine'], add9: ['1 3 5 9', 'add 9'], madd9: ['1 b3 5 9', 'minor add 9'],
    9: ['1 3 5 b7 9', 'dominant 9th'], maj9: ['1 3 5 7 9', 'major 9th'], m9: ['1 b3 5 b7 9', 'minor 9th'],
    11: ['1 5 b7 9 11', 'dominant 11th'], m11: ['1 b3 5 b7 9 11', 'minor 11th'], 13: ['1 3 b7 9 13', 'dominant 13th'],
    '7b9': ['1 3 5 b7 b9', 'dominant 7 flat 9'], '7#9': ['1 3 5 b7 #9', 'dominant 7 sharp 9']
  };
  const ALIASES = {
    M: '', maj: '', min: 'm', '-': 'm', mi: 'm', o: 'dim', '°': 'dim', o7: 'dim7', '°7': 'dim7', '+': 'aug', '+7': 'aug7',
    M7: 'maj7', 'Δ': 'maj7', 'Δ7': 'maj7', ma7: 'maj7', min7: 'm7', '-7': 'm7', 'ø': 'm7b5', 'ø7': 'm7b5', 'm7-5': 'm7b5',
    sus: 'sus4', '7sus': '7sus4', '9sus4': '7sus4', '6/9': '69', 'm(add9)': 'madd9', 'add2': 'add9', '2': 'sus2', 4: 'sus4', 'mM7': 'mMaj7', 'maj13': 'maj9'
  };
  Object.keys(CHORDS).forEach((k) => { CHORDS[k] = { formula: parseFormula(CHORDS[k][0]), text: CHORDS[k][0], name: CHORDS[k][1] }; });

  function parseChord(sym) {
    const m = /^([A-G])(#|b)?([^/]*)(?:\/([A-G](?:#|b)?))?$/.exec(String(sym).trim());
    if (!m) return null;
    const root = m[1] + (m[2] || '');
    let suffix = m[3] || '';
    if (!(suffix in CHORDS)) suffix = ALIASES[suffix] !== undefined ? ALIASES[suffix] : null;
    if (suffix === null) return null;
    const type = CHORDS[suffix];
    const notes = type.formula.map((f) => spell(root, f.semis, f.step));
    return {
      symbol: sym, root, suffix, bass: m[4] || null, type, notes,
      pcs: type.formula.map((f) => mod(pcOf(root) + f.semis)),
      semis: type.formula.map((f) => f.semis)
    };
  }

  function transposeName(name, semis, flat) {
    const n = parseNote(name);
    return nameOf(n.pc + semis, flat);
  }
  function transposeChord(sym, semis, flat) {
    if (!semis) return sym;
    const m = /^([A-G](?:#|b)?)([^/]*)(?:\/([A-G](?:#|b)?))?$/.exec(sym);
    if (!m) return sym;
    return transposeName(m[1], semis, flat) + m[2] + (m[3] ? '/' + transposeName(m[3], semis, flat) : '');
  }

  // Simple, readable voicing: bass note around C3, chord tones close above C4
  function voice(ch) {
    if (!ch) return [];
    const rootPc = pcOf(ch.root);
    const bassPc = ch.bass ? pcOf(ch.bass) : rootPc;
    const bass = 36 + bassPc + (bassPc > 7 ? 0 : 12);
    let base = 60 + rootPc;
    if (base > 66) base -= 12;
    const upper = ch.semis.map((s) => base + (s > 12 ? s - 12 : s));
    return [bass].concat(upper);
  }

  // Identify a chord from pitch classes (used by negative harmony etc.)
  const ID_ORDER = ['', 'm', 'dim', 'aug', 'sus4', 'sus2', '7', 'maj7', 'm7', 'm6', '6', 'm7b5', 'dim7', 'mMaj7', '7sus4', 'aug7', 'add9', 'madd9'];
  function identify(pcs, flat, preferRoot) {
    const set = Array.from(new Set(pcs.map((p) => mod(p))));
    const roots = preferRoot !== undefined ? [preferRoot].concat(set) : set;
    for (const suf of ID_ORDER) {
      const want = CHORDS[suf].formula.map((f) => mod(f.semis)).sort((a, b) => a - b).join(',');
      for (const r of roots) {
        if (!set.includes(r)) continue;
        const got = set.map((p) => mod(p - r)).sort((a, b) => a - b).join(',');
        if (got === want) return nameOf(r, flat) + suf;
      }
    }
    return set.map((p) => nameOf(p, flat)).join('-');
  }

  // Scales
  const SCALES = {
    major: ['Major (Ionian)', '1 2 3 4 5 6 7'],
    minor: ['Natural minor (Aeolian)', '1 2 b3 4 5 b6 b7'],
    harmonic: ['Harmonic minor', '1 2 b3 4 5 b6 7'],
    melodic: ['Melodic minor (ascending)', '1 2 b3 4 5 6 7'],
    majpent: ['Major pentatonic', '1 2 3 5 6'],
    minpent: ['Minor pentatonic', '1 b3 4 5 b7'],
    blues: ['Blues', '1 b3 4 b5 5 b7'],
    dorian: ['Dorian', '1 2 b3 4 5 6 b7'],
    phrygian: ['Phrygian', '1 b2 b3 4 5 b6 b7'],
    lydian: ['Lydian', '1 2 3 #4 5 6 7'],
    mixolydian: ['Mixolydian', '1 2 3 4 5 6 b7'],
    locrian: ['Locrian', '1 b2 b3 4 b5 b6 b7']
  };
  Object.keys(SCALES).forEach((k) => { SCALES[k] = { name: SCALES[k][0], text: SCALES[k][1], formula: parseFormula(SCALES[k][1]) }; });
  const scaleNotes = (root, id) => SCALES[id].formula.map((f) => spell(root, f.semis, f.step));

  // Diatonic chords of a major or minor key
  const ROMAN_MAJ = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
  const ROMAN_MIN = ['i', 'ii°', '♭III', 'iv', 'v', '♭VI', '♭VII'];
  const FUNC_MAJ = ['T', 'S', 'T', 'S', 'D', 'T', 'D'];
  const FUNC_MIN = ['T', 'S', 'T', 'S', 'D', 'S', 'D'];
  function diatonic(root, minor, sevenths) {
    const scale = SCALES[minor ? 'minor' : 'major'].formula;
    const names = scaleNotes(root, minor ? 'minor' : 'major');
    return scale.map((f, i) => {
      const third = mod(scale[(i + 2) % 7].semis - f.semis);
      const fifth = mod(scale[(i + 4) % 7].semis - f.semis);
      const seventh = mod(scale[(i + 6) % 7].semis - f.semis);
      let suf = third === 4 ? (fifth === 8 ? 'aug' : '') : (fifth === 6 ? 'dim' : 'm');
      if (sevenths) {
        if (suf === '') suf = seventh === 11 ? 'maj7' : '7';
        else if (suf === 'm') suf = seventh === 10 ? 'm7' : 'mMaj7';
        else if (suf === 'dim') suf = seventh === 10 ? 'm7b5' : 'dim7';
      }
      return {
        degree: i + 1, symbol: names[i] + suf, root: names[i],
        roman: (minor ? ROMAN_MIN : ROMAN_MAJ)[i], func: (minor ? FUNC_MIN : FUNC_MAJ)[i]
      };
    });
  }

  // Roman / Nashville number → chord in key  (e.g. "4/6", "2m7", "b7", "5sus4")
  function numberToChord(num, key) {
    const k = KEYS.find((x) => x.name === key) || KEYS[0];
    const m = /^(b|#)?([1-7])([^/]*)(?:\/(b|#)?([1-7]))?$/.exec(num);
    if (!m) return num;
    const deg = (acc, d) => mod(k.pc + SCALES.major.formula[d - 1].semis + (acc === 'b' ? -1 : acc === '#' ? 1 : 0));
    const dia = diatonic(k.name, false, false);
    let suffix = m[3];
    if (suffix === '' && !m[1]) suffix = dia[parseInt(m[2], 10) - 1].symbol.replace(/^[A-G][#b]?/, '');
    const fl = (acc) => (acc === 'b' ? true : acc === '#' ? false : k.flat);
    const root = nameOf(deg(m[1], parseInt(m[2], 10)), fl(m[1]));
    const bass = m[5] ? '/' + nameOf(deg(m[4], parseInt(m[5], 10)), fl(m[4])) : '';
    return root + suffix + bass;
  }

  /* ---------------- Audio ---------------- */
  let ctx = null, master = null, playing = [];
  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      const comp = ctx.createDynamicsCompressor();
      master.connect(comp); comp.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  const freq = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

  function tone(midi, when, dur, opts = {}) {
    const c = audio(); if (!c) return;
    const t = when || c.currentTime;
    const vel = opts.vel || 0.22;
    const g = c.createGain();
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(opts.pad ? 1400 : 3200, t);
    f.frequency.exponentialRampToValueAtTime(opts.pad ? 900 : 700, t + dur);
    const o1 = c.createOscillator(), o2 = c.createOscillator();
    o1.type = opts.pad ? 'sawtooth' : 'triangle';
    o2.type = 'sine';
    o1.frequency.value = freq(midi);
    o2.frequency.value = freq(midi) * (opts.pad ? 1.003 : 2);
    const g2 = c.createGain(); g2.gain.value = opts.pad ? 0.6 : 0.25;
    o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(f); f.connect(master);
    if (opts.pad) {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vel * 0.5, t + 0.35);
      g.gain.setValueAtTime(vel * 0.5, t + Math.max(0.4, dur - 0.3));
      g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.4);
    } else {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vel, t + 0.012);
      g.gain.exponentialRampToValueAtTime(vel * 0.35, t + 0.4);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.25);
    }
    const end = t + dur + 0.5;
    o1.start(t); o2.start(t); o1.stop(end); o2.stop(end);
    playing.push(o1, o2);
  }

  function click(when, accent) {
    const c = audio(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.frequency.value = accent ? 1600 : 1000;
    g.gain.setValueAtTime(accent ? 0.5 : 0.28, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.06);
    o.connect(g); g.connect(master); o.start(when); o.stop(when + 0.07);
    playing.push(o);
  }
  function drum(kind, when) {
    const c = audio(); if (!c) return;
    if (kind === 'kick') {
      const o = c.createOscillator(), g = c.createGain();
      o.frequency.setValueAtTime(140, when); o.frequency.exponentialRampToValueAtTime(45, when + 0.15);
      g.gain.setValueAtTime(0.9, when); g.gain.exponentialRampToValueAtTime(0.0001, when + 0.3);
      o.connect(g); g.connect(master); o.start(when); o.stop(when + 0.32); playing.push(o);
      return;
    }
    const len = kind === 'hat' ? 0.05 : 0.18;
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * len), c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource(); s.buffer = buf;
    const f = c.createBiquadFilter(); f.type = kind === 'hat' ? 'highpass' : 'bandpass'; f.frequency.value = kind === 'hat' ? 7000 : 1800;
    const g = c.createGain(); g.gain.setValueAtTime(kind === 'hat' ? 0.18 : 0.45, when); g.gain.exponentialRampToValueAtTime(0.0001, when + len);
    s.connect(f); f.connect(g); g.connect(master); s.start(when); playing.push(s);
  }

  const timers = [];
  function stopAll() {
    playing.forEach((n) => { try { n.stop(); } catch (e) { /* already stopped */ } });
    playing = [];
    timers.splice(0).forEach(clearTimeout);
  }
  function at(when, fn) {
    const c = audio();
    timers.push(setTimeout(fn, Math.max(0, (when - c.currentTime) * 1000)));
  }

  function playChord(sym, opts = {}) {
    const ch = typeof sym === 'string' ? parseChord(sym) : sym;
    if (!ch) return [];
    const c = audio(); if (!c) return [];
    const midis = voice(ch);
    const t = opts.when || c.currentTime + 0.02;
    const dur = opts.dur || 1.4;
    const style = opts.style || 'block';
    if (style === 'arp' || style === 'broken') {
      const step = style === 'arp' ? dur / (midis.length + 1) : dur / 4;
      tone(midis[0], t, dur, { vel: 0.2 });
      const up = midis.slice(1);
      const seq = style === 'arp' ? up.concat([up[0] + 12]) : [up[0], up[up.length - 1], up[1] || up[0], up[up.length - 1]];
      seq.forEach((m, i) => tone(m, t + step * (i + (style === 'arp' ? 1 : 0)), Math.max(0.3, dur - step * i), { vel: 0.16 }));
    } else {
      midis.forEach((m, i) => tone(m, t + (opts.strum ? i * 0.02 : 0), dur, { vel: i === 0 ? 0.2 : 0.15, pad: style === 'pad' }));
    }
    return midis;
  }

  // Play a list of chord symbols; onStep(i, midis) called as each chord sounds
  function playProgression(syms, opts = {}) {
    stopAll();
    const c = audio(); if (!c) return;
    const bpm = opts.bpm || 80, beats = opts.beats || 2;
    const spb = 60 / bpm, dur = spb * beats;
    let t = c.currentTime + 0.08;
    const loops = opts.loops || 1;
    const list = syms.filter((s) => s !== '|');
    for (let l = 0; l < loops; l++) {
      list.forEach((s, i) => {
        const ch = parseChord(s);
        const midis = playChord(ch, { when: t, dur: dur * 0.98, style: opts.style });
        if (opts.drums) {
          for (let b = 0; b < beats; b++) {
            const bt = t + b * spb;
            drum(b % 2 === 0 ? 'kick' : 'snare', bt);
            drum('hat', bt); drum('hat', bt + spb / 2);
          }
        } else if (opts.click) {
          for (let b = 0; b < beats; b++) click(t + b * spb, b === 0);
        }
        const idx = i, when = t;
        if (opts.onStep) at(when, () => opts.onStep(idx, midis));
        t += dur;
      });
    }
    if (opts.onEnd) at(t, opts.onEnd);
  }

  function parseMelody(str, semis) {
    return str.trim().split(/\s+/).map((tok) => {
      if (tok === '_') return { rest: true, beats: 1 };
      const m = /^([A-G](?:#|b)?-?\d)(-*)$/.exec(tok);
      if (!m) return { rest: true, beats: 1 };
      const n = parseNote(m[1]);
      return { midi: n.midi + (semis || 0), beats: 1 + m[2].length };
    });
  }
  function playMelody(str, opts = {}) {
    stopAll();
    const c = audio(); if (!c) return;
    const spb = 60 / (opts.bpm || 100);
    let t = c.currentTime + 0.08;
    parseMelody(str, opts.semis).forEach((n, i) => {
      if (!n.rest) {
        tone(n.midi, t, n.beats * spb * 0.95, { vel: 0.25 });
        const when = t, midi = n.midi;
        if (opts.onStep) at(when, () => opts.onStep(i, [midi]));
      }
      t += n.beats * spb;
    });
    if (opts.onEnd) at(t, opts.onEnd);
  }

  window.Music = {
    LETTERS, SHARPS, FLATS, KEYS, MINOR_KEYS, CIRCLE_ORDER, CHORDS, SCALES,
    mod, parseNote, pcOf, nameOf, pretty, spell, parseFormula, parseChord, transposeChord, transposeName,
    voice, identify, scaleNotes, diatonic, numberToChord, freq,
    audio, tone, click, drum, playChord, playProgression, playMelody, parseMelody, stopAll
  };
})();
