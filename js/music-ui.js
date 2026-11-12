/* Shared music UI: keyboard diagrams, piano rolls, playback and live note input.
   Used by the Chord Library (Syllabus Studio) and Riffbook. Depends on window.Music. */
(function () {
  const M = window.Music;
  const WHITE = [0, 2, 4, 5, 7, 9, 11];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const noteName = (m, flat) => M.nameOf(m % 12, flat) + (Math.floor(m / 12) - 1);

  // Keyboard diagram. e = {lh:[midi], rh:[midi]}; opts.fingers = {midi: '1'..'5'} draws finger numbers
  function voicingSVG(e, opts = {}) {
    const lh = e.lh || [], rh = e.rh || [], all = lh.concat(rh);
    let lo = all.length ? Math.min(...all) : 48, hi = all.length ? Math.max(...all) : 72;
    lo = Math.floor(lo / 12) * 12; hi = Math.ceil((hi + 1) / 12) * 12 - 1;
    if (opts.from) { lo = opts.from; hi = opts.to; }
    const ww = opts.w || 14, wh = opts.h || 54;
    const fingers = opts.fingers || {};
    let x = 0, whites = '', blacks = '', marks = '';
    const pos = {};
    for (let m = lo; m <= hi; m++) { if (WHITE.includes(m % 12)) { pos[m] = x + ww / 2; x += ww; } else pos[m] = x; }
    for (let m = lo; m <= hi; m++) {
      const isL = lh.includes(m), isR = rh.includes(m), white = WHITE.includes(m % 12);
      const fill = isL ? 'var(--s)' : isR ? 'var(--accent)' : white ? 'var(--key-white)' : 'var(--key-black)';
      if (white) {
        whites += `<rect data-m="${m}" x="${pos[m] - ww / 2}" y="0" width="${ww}" height="${wh}" rx="2" fill="${fill}" stroke="var(--line)"/>`;
        if (m % 12 === 0 && opts.labels !== false && !fingers[m]) whites += `<text x="${pos[m]}" y="${wh - 4}" text-anchor="middle" font-size="${ww * 0.5}" fill="${isL || isR ? 'var(--accent-ink)' : '#888'}" pointer-events="none">C${Math.floor(m / 12) - 1}</text>`;
      } else {
        blacks += `<rect data-m="${m}" x="${pos[m] - ww * 0.32}" y="0" width="${ww * 0.64}" height="${wh * 0.6}" rx="1.5" fill="${fill}"/>`;
      }
      if (fingers[m] && (isL || isR)) {
        const fy = white ? wh - ww * 0.55 : wh * 0.6 - ww * 0.45;
        marks += `<circle cx="${pos[m]}" cy="${fy}" r="${ww * 0.36}" fill="var(--surface)" pointer-events="none"/><text x="${pos[m]}" y="${fy + ww * 0.16}" text-anchor="middle" font-size="${ww * 0.46}" font-weight="700" fill="${isL ? 'var(--s)' : 'var(--accent)'}" pointer-events="none">${esc(fingers[m])}</text>`;
      }
      if (opts.names && (isL || isR)) {
        const label = opts.speller ? opts.speller(m % 12) : M.nameOf(m % 12, opts.flat);
        marks += `<text x="${pos[m]}" y="${wh + 13}" text-anchor="middle" font-size="10" font-weight="700" fill="${isL ? 'var(--s)' : 'var(--accent)'}" pointer-events="none">${M.pretty(label)}</text>`;
      }
    }
    const label = all.map((m) => noteName(m, opts.flat)).join(' ');
    return `<svg class="mini-kb" viewBox="0 0 ${x} ${wh + (opts.names ? 18 : 0)}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Keyboard: ${esc(label || 'no notes')}">${whites}${blacks}${marks}</svg>`;
  }

  // Piano roll. roll = {bpm, events:[{m, t, d, v}]} — t and d in beats
  function rollSVG(roll, opts = {}) {
    const ev = (roll && roll.events) || [];
    if (!ev.length) return '<div class="empty small">No notes captured yet.</div>';
    const lo = Math.min(...ev.map((e) => e.m)) - 2, hi = Math.max(...ev.map((e) => e.m)) + 2;
    const len = Math.max(4, Math.ceil(Math.max(...ev.map((e) => e.t + e.d)) / 4) * 4);
    const row = opts.row || 9, ppb = opts.ppb || 36, gutter = 34;
    const H = (hi - lo + 1) * row, W = gutter + len * ppb;
    const split = opts.split || 60;
    let g = '';
    for (let m = lo; m <= hi; m++) {
      const y = (hi - m) * row;
      g += `<rect x="${gutter}" y="${y}" width="${len * ppb}" height="${row}" fill="${WHITE.includes(m % 12) ? 'var(--surface)' : 'var(--surface-2)'}"/>`;
      if (m % 12 === 0) g += `<text x="2" y="${y + row - 1}" font-size="${Math.min(10, row + 1)}" fill="var(--muted)">C${Math.floor(m / 12) - 1}</text><line x1="${gutter}" x2="${W}" y1="${y + row}" y2="${y + row}" stroke="var(--line)"/>`;
    }
    for (let b = 0; b <= len; b++) g += `<line x1="${gutter + b * ppb}" x2="${gutter + b * ppb}" y1="0" y2="${H}" stroke="var(--line)" stroke-width="${b % 4 === 0 ? 1.4 : 0.5}"/>`;
    ev.forEach((e) => {
      g += `<rect x="${gutter + e.t * ppb + 0.5}" y="${(hi - e.m) * row + 1}" width="${Math.max(3, e.d * ppb - 1)}" height="${row - 2}" rx="2" fill="${e.m < split ? 'var(--s)' : 'var(--accent)'}" opacity="${0.55 + (e.v || 90) / 300}"><title>${noteName(e.m)} · beat ${(e.t + 1).toFixed(2)}</title></rect>`;
    });
    g += `<line class="playhead" x1="${gutter}" x2="${gutter}" y1="0" y2="${H}" stroke="var(--accent-2)" stroke-width="2" opacity="0"/>`;
    return `<div class="roll-wrap"><svg class="roll-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" data-ppb="${ppb}" data-gutter="${gutter}" role="img" aria-label="Piano roll, ${ev.length} notes">${g}</svg></div>`;
  }

  let rollAnim = null;
  function playRoll(roll, svgEl, semis = 0, opts = {}) {
    M.stopAll(); cancelAnimationFrame(rollAnim);
    const c = M.audio(); if (!c || !roll.events || !roll.events.length) return;
    const bpm = opts.bpm || roll.bpm || 90, spb = 60 / bpm, t0 = c.currentTime + 0.08;
    roll.events.forEach((e) => M.tone(e.m + semis, t0 + e.t * spb, Math.max(0.1, e.d * spb), { vel: 0.12 + (e.v || 90) / 700 }));
    const end = Math.max(...roll.events.map((e) => e.t + e.d));
    const ph = svgEl && svgEl.querySelector('.playhead');
    if (!ph) return;
    const ppb = +svgEl.dataset.ppb, gut = +svgEl.dataset.gutter;
    ph.setAttribute('opacity', '1');
    const step = () => {
      const beat = (c.currentTime - t0) / spb;
      if (beat > end + 0.5) { ph.setAttribute('opacity', '0'); return; }
      const x = gut + Math.max(0, beat) * ppb;
      ph.setAttribute('x1', x); ph.setAttribute('x2', x);
      rollAnim = requestAnimationFrame(step);
    };
    step();
  }

  function playVoicing(lh, rh, style) {
    const c = M.audio(); if (!c) return;
    M.stopAll();
    const t = c.currentTime + 0.03;
    const all = lh.concat(rh).sort((a, b) => a - b);
    if (style === 'roll') { all.forEach((m, i) => M.tone(m, t + i * 0.07, 2, { vel: 0.17 })); return; }
    if (style === 'arp') { all.forEach((m, i) => M.tone(m, t + i * 0.18, 1.6, { vel: 0.18 })); return; }
    lh.forEach((m) => M.tone(m, t, 2, { vel: 0.18, pad: style === 'pad' }));
    rh.forEach((m) => M.tone(m, t, 2, { vel: 0.14, pad: style === 'pad' }));
  }

  // Spell pitch classes the way a chord symbol spells them (Cm9 gives Eb, Bb), else by key preference
  function spellerFor(sym, flat) {
    const map = {};
    const ch = sym && M.parseChord(sym);
    if (ch) { ch.notes.forEach((n) => { map[M.pcOf(n)] = n; }); if (ch.bass) map[M.pcOf(ch.bass)] = ch.bass; }
    return (pc) => map[pc] || M.nameOf(pc, flat);
  }

  // Name a set of notes (lowest = bass), e.g. "Cmaj7/E"
  function detectName(midis, flat) {
    const s = midis.slice().sort((a, b) => a - b);
    if (s.length < 2) return '';
    const bass = s[0] % 12;
    let name = M.identify(s.map((m) => m % 12), flat, bass);
    if (name.includes('-')) {
      const up = M.identify(s.slice(1).map((m) => m % 12), flat);
      return up.includes('-') ? '' : up + '/' + M.nameOf(bass, flat);
    }
    const ch = M.parseChord(name);
    if (ch && M.pcOf(ch.root) !== bass) name += '/' + M.nameOf(bass, flat);
    return name;
  }

  /* Live note input from the computer keyboard and MIDI.
     handlers: {on(midi, vel), off(midi)}. Returns {connectMidi(), setOctave(n), destroy()} */
  const KEYMAP = { a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11, k: 12, o: 13, l: 14, p: 15, ';': 16 };
  function noteInput(handlers, opts = {}) {
    let octave = 0, midi = null;
    const down = new Set();
    const typing = (el) => el && (/INPUT|TEXTAREA|SELECT/.test(el.tagName) || el.isContentEditable);
    const kd = (ev) => {
      if (typing(ev.target) || ev.metaKey || ev.ctrlKey || ev.altKey || ev.repeat) return;
      if (opts.enabled && !opts.enabled()) return;
      const k = ev.key.toLowerCase();
      if (k === 'z' || k === 'x') { octave = Math.max(-2, Math.min(2, octave + (k === 'z' ? -1 : 1))); handlers.octave && handlers.octave(4 + octave); return; }
      if (k in KEYMAP) { ev.preventDefault(); const m = 60 + octave * 12 + KEYMAP[k]; down.add(k + ':' + m); handlers.on(m, 96); }
    };
    const ku = (ev) => {
      const k = ev.key.toLowerCase();
      Array.from(down).filter((x) => x.startsWith(k + ':')).forEach((x) => { down.delete(x); handlers.off(+x.split(':')[1]); });
    };
    document.addEventListener('keydown', kd);
    document.addEventListener('keyup', ku);
    return {
      async connectMidi() {
        if (!navigator.requestMIDIAccess) return { ok: false, message: 'This browser has no MIDI support. Try Chrome or Edge, or use the computer keys.' };
        try {
          midi = await navigator.requestMIDIAccess();
          const hook = () => {
            midi.inputs.forEach((inp) => {
              inp.onmidimessage = (msg) => {
                const [st, note, vel] = msg.data; const cmd = st & 0xf0;
                if (cmd === 0x90 && vel > 0) handlers.on(note, vel); else if (cmd === 0x80 || (cmd === 0x90 && vel === 0)) handlers.off(note);
              };
            });
          };
          midi.onstatechange = () => { hook(); handlers.midiChange && handlers.midiChange(Array.from(midi.inputs.values()).map((i) => i.name)); };
          hook();
          const names = Array.from(midi.inputs.values()).map((i) => i.name);
          return { ok: true, message: names.length ? 'Connected: ' + names.join(', ') : 'No MIDI keyboard found. Plug one in and it connects automatically.' };
        } catch (e) { return { ok: false, message: 'MIDI access is blocked here. Use the computer keys or the on-screen keyboard.' }; }
      },
      destroy() {
        document.removeEventListener('keydown', kd); document.removeEventListener('keyup', ku);
        if (midi) midi.inputs.forEach((i) => { i.onmidimessage = null; });
      }
    };
  }

  /* Piano-roll recorder: count-in, optional click, quantise. */
  function rollRecorder() {
    const r = { on: false, start: 0, bpm: 80, active: new Map(), events: [], timer: null, onChange: null };
    r.noteOn = (m, v) => { if (r.on) r.active.set(m, { t: performance.now(), v: v || 96 }); };
    r.noteOff = (m) => {
      if (!r.on || !r.active.has(m)) return;
      const a = r.active.get(m); r.active.delete(m);
      const spb = 60000 / r.bpm;
      r.events.push({ m, t: Math.max(0, (a.t - r.start) / spb), d: Math.max(0.05, (performance.now() - a.t) / spb), v: a.v });
      r.onChange && r.onChange();
    };
    r.begin = (bpm, click, onStarted) => {
      const c = M.audio(); if (!c) return;
      r.bpm = bpm; r.events = [];
      const spb = 60 / bpm, t0 = c.currentTime + 0.1;
      for (let i = 0; i < 4; i++) M.click(t0 + i * spb, i === 0);
      r.pending = setTimeout(() => {
        r.on = true; r.start = performance.now();
        if (click) {
          let next = M.audio().currentTime + 0.02, beat = 0;
          r.timer = setInterval(() => { const cc = M.audio(); while (next < cc.currentTime + 0.1) { M.click(next, beat % 4 === 0); next += spb; beat++; } }, 25);
        }
        onStarted && onStarted();
      }, (t0 - c.currentTime + 4 * spb) * 1000);
    };
    r.stop = () => {
      clearTimeout(r.pending); clearInterval(r.timer);
      Array.from(r.active.keys()).forEach(r.noteOff);
      r.on = false;
    };
    r.quantised = (q) => (q ? r.events.map((x) => ({ m: x.m, v: x.v, t: Math.round(x.t / q) * q, d: Math.max(q, Math.round(x.d / q) * q) }))
      : r.events.map((x) => ({ ...x, t: +x.t.toFixed(3), d: +x.d.toFixed(3) })));
    return r;
  }

  window.MusicUI = { WHITE, esc, noteName, voicingSVG, rollSVG, playRoll, playVoicing, spellerFor, detectName, noteInput, rollRecorder, KEYMAP };
})();
