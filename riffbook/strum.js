/* Riffbook strumming: record guitar strumming with a count-in and metronome (microphone or keys),
   find the strums, decode the pattern (8ths, even 16ths, triplets, off-beats, 1- or 2-bar patterns, dynamics),
   edit everything, play it on a guitar sound over chords (or your VST), speed-trainer, and put it on chord charts.
   Pattern: { beats, sub, bars, cells } — one cell per grid step:
     D / U  strum down / up        d / u  soft (ghost) strum        x  muted "chuck"        -  no strum
     a '>' after a strum is an accent (D>, U>, x>). */
(function () {
  const M = window.Music, U = window.MusicUI;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const compound = (beats) => beats === 6 || beats === 12; // 6/8, 12/8: the pulse is the eighth note
  const sigLabel = (beats) => (compound(beats) ? beats + '/8' : beats + '/4');

  /* ---------------- cells ---------------- */
  const DIR = (c) => { const t = String(c || '-').replace('>', ''); return t === 'x' || t === 'X' ? 'x' : t === '-' ? '-' : t.toUpperCase(); };
  const ACC = (c) => /\>$/.test(c || '');
  const SOFT = (c) => /^[du]/.test(c || '');
  const DYN = (c) => (ACC(c) ? 'acc' : SOFT(c) ? 'soft' : 'norm');
  const make = (dir, dyn) => {
    if (dir === '-') return '-';
    if (dyn === 'acc') return dir + '>';
    if (dyn === 'soft' && dir !== 'x') return dir.toLowerCase();
    return dir;
  };
  const ARROW = { D: '↓', U: '↑', x: '✕' };

  /* ---------------- patterns ---------------- */
  const P = (name, beats, sub, s, tip) => ({ name, beats, sub, bars: Math.max(1, Math.round(s.split(' ').length / (beats * sub))), cells: s.split(' '), tip });
  const PRESETS = [
    P('Folk / pop — D DU UDU', 4, 2, 'D - D U - U D U', 'The most used pattern in pop, worship and folk. The hand keeps moving down-up; skip the strings on the dashes.'),
    P('Folk with dynamics', 4, 2, 'D> - d U - U D u', 'Same motion: lean into 1, play 2 and the last up strum lightly.'),
    P('Down strokes on the beat', 4, 2, 'D - D - D - D -', 'Start here: one down strum per beat.'),
    P('Straight eighths', 4, 2, 'D U D U D U D U', 'Even down-up strumming — keep the wrist loose.'),
    P('Ballad', 4, 2, 'D> - - - D - D U', 'Let the first strum ring, then a light push into the next bar.'),
    P('Rock drive', 4, 2, 'D> - D U - U D U', 'Folk pattern with a strong accent on 1.'),
    P('Backbeat chuck', 4, 2, 'D - x> U - U x> U', 'Mute the strings with the palm on 2 and 4 (✕) for a snare sound.'),
    P('Reggae / ska off-beat', 4, 2, '- U> - U> - U> - U>', 'Only the "&"s — short, choppy up strums.'),
    P('Off-beat push', 4, 2, 'D - - U - U D -', 'The chord changes early on the "&" of 4 — common in pop.'),
    P('Funk 16ths', 4, 4, 'D> u d U x> u D u d u D U x> u D U', 'Sixteenth-note motion (1 e & a) with ghost strums and chucks on 2 and 4.'),
    P('Worship 16ths', 4, 4, 'D - - - D - U - - U D - U - D U', 'Driving 16th feel for upbeat songs.'),
    P('Syncopated 16ths', 4, 4, 'D> - - U - U D - - U - U D - D U', 'Accents land between the beats — count 1 e & a out loud.'),
    P('Shuffle (triplets)', 4, 3, 'D - U D - U D - U D - U', 'Swung feel: long-short, long-short.'),
    P('Waltz 3/4', 3, 2, 'D> - d U d U', 'Bass-heavy first beat, lighter 2 and 3.'),
    P('6/8 ballad', 6, 1, 'D> - U D - U', 'Two big pulses per bar: 1 and 4.'),
    P('6/8 rolling', 6, 1, 'D D U D D U', 'Keeps the triplet roll going.'),
    P('12/8 slow ballad', 12, 1, 'D> - U D - U D> - U D - U', 'Four big pulses, each with a light up strum before the next.'),
    P('12/8 blues shuffle', 12, 1, 'D - U D - U D - U D - U', 'The classic slow-blues roll: long-short on every beat.'),
    P('Half-time', 4, 2, 'D> - - - - - D U', 'Big, open feel for bridges and intros.'),
    P('Two-bar pop', 4, 2, 'D - D U - U D U D - D U D U D U', 'Bar 2 fills in the gaps — good for verses that build.')
  ];
  function countLabels(beats, sub) {
    const out = [];
    for (let b = 0; b < beats; b++) for (let s = 0; s < sub; s++) {
      if (sub === 3) out.push(s === 0 ? String(b + 1) : s === 1 ? 'trip' : 'let');
      else if (sub === 4) out.push([String(b + 1), 'e', '&', 'a'][s]);
      else if (sub === 2) out.push(s === 0 ? String(b + 1) : '&');
      else out.push(String(b + 1));
    }
    return out;
  }
  const perBar = (p) => p.beats * p.sub;
  const barsOf = (p) => Math.max(1, Math.round(p.cells.length / perBar(p)));
  const textOf = (p) => {
    if (!p || !p.cells) return '';
    const N = perBar(p), out = [];
    for (let k = 0; k < p.cells.length; k += N) out.push(p.cells.slice(k, k + N).join(' '));
    return out.join(' | ');
  };
  const arrowsOf = (p) => (p && p.cells ? p.cells.map((c, k) => (k && k % perBar(p) === 0 ? '| ' : '') + ((ARROW[DIR(c)] || '·') + (ACC(c) ? '>' : SOFT(c) ? 'ᵖ' : ''))).join(' ') : '');
  // Type a pattern: "D - D U - U D U", textbook shorthand "D DU UDU", arrows, and "|" between bars of a 2-bar pattern
  function parse(text, beats) {
    const t = String(text || '').replace(/↓/g, 'D').replace(/↑/g, 'U').replace(/[✕X]/g, 'x').replace(/[·.]/g, '-').trim();
    if (!t || /[^DUdux\-\s|>]/.test(t) || !/[DUdux]/.test(t)) return null; // only pattern letters are allowed
    const barTexts = t.split('|').map((x) => x.trim()).filter(Boolean);
    const bars = barTexts.map((bt) => {
      let cells = bt.split(/\s+/);
      if (cells.some((c) => c.replace(/>/g, '').length > 1)) { // shorthand: letters are back-to-back strums, each space is one skipped strum
        const out = [];
        cells.forEach((g, k) => { if (k) out.push('-'); out.push(...(g.match(/[DUdux-]>?/g) || [])); });
        cells = out;
      }
      return cells.map((c) => (/^[DUdux-]>?$/.test(c) ? c : '-'));
    });
    const sub = Math.max(1, Math.round(bars[0].length / beats));
    const N = beats * sub, cells = [];
    bars.forEach((b) => { const row = b.slice(0, N); while (row.length < N) row.push('-'); cells.push(...row); });
    return { beats, sub, bars: bars.length, cells };
  }
  // Show a pattern on another grid (8ths ↔ 16ths ↔ triplets) without losing strums when it can
  function regrid(p, sub) {
    if (!p || p.sub === sub) return p;
    const nb = barsOf(p), N = p.beats * sub, cells = Array(N * nb).fill('-');
    let lost = 0;
    p.cells.forEach((c, k) => {
      if (DIR(c) === '-') return;
      const bar = Math.floor(k / perBar(p));
      let pos = (k % perBar(p)) / p.sub; // in beats
      const frac = pos - Math.floor(pos);
      if (sub === 3 && Math.abs(frac - 0.5) < 0.01) pos = Math.floor(pos) + 2 / 3; // an "&" swings onto the last triplet
      if (p.sub === 3 && sub !== 3 && Math.abs(frac - 2 / 3) < 0.01) pos = Math.floor(pos) + 0.5; // and back
      const j = Math.round(pos * sub);
      if (Math.abs(pos * sub - j) > 0.01 || cells[bar * N + j] !== '-') lost++;
      cells[bar * N + Math.min(N - 1, j)] = c;
    });
    return { ...p, sub, cells, bars: nb, _lost: lost };
  }

  /* ---------------- hearing the strums (onset detection) ---------------- */
  // Energy-based onset detector working on 256-sample hops. push() returns finished onsets [{t, amp}] (t in seconds).
  function detector(sr) {
    const hop = 256;
    let ema = 0, prev = 0, last = -1, pending = null, carry = new Float32Array(0), carryT = 0, floor = 1e-6;
    return {
      push(x, t0) {
        const buf = new Float32Array(carry.length + x.length); buf.set(carry); buf.set(x, carry.length);
        const tStart = carry.length ? carryT : t0;
        const out = [];
        let i = 0;
        for (; i + hop <= buf.length; i += hop) {
          let e = 0; for (let j = i; j < i + hop; j++) e += buf[j] * buf[j];
          e /= hop;
          const t = tStart + i / sr;
          floor = Math.min(floor * 1.002 + 1e-9, Math.max(e, 1e-9)) || 1e-9;
          if (pending) { pending.peak = Math.max(pending.peak, e); if (t - pending.t > 0.06) { out.push({ t: pending.t, amp: Math.sqrt(pending.peak) }); pending = null; } }
          const rising = e > prev * 1.8 && e > ema * 2.6 && e > Math.max(4e-6, floor * 20);
          if (rising && t - last > 0.075) { pending = { t, peak: e }; last = t; }
          ema = ema * 0.93 + e * 0.07; prev = e;
        }
        carry = buf.slice(i); carryT = tStart + i / sr;
        return out;
      }
    };
  }

  /* ---------------- from strums to a pattern ---------------- */
  const median = (a) => { const v = a.slice().sort((x, y) => x - y); return v.length ? v[Math.floor(v.length / 2)] : 0; };
  // ons: [{b (beats from bar 1), amp, dir?, dyn?}] → pattern, the bars as played, and timing stats
  function extract(ons, beats, subOpt, spb, opts = {}) {
    const hits = ons.filter((o) => o.b > -0.3);
    if (hits.length < 2) return null;
    // Line the take up with each candidate grid. The average position of all strums on the grid (a circular mean, so
    // strums on "e", "&" and "a" all count) gives the shift. A take whose delay was measured from the count-in clicks
    // (or played on the keys) may only move a little, so off-beat-only patterns stay off the beat.
    const circ = (sub) => { let sx = 0, sy = 0; hits.forEach((o) => { const a = 2 * Math.PI * o.b * sub; sx += Math.cos(a); sy += Math.sin(a); }); return Math.atan2(sy, sx) / (2 * Math.PI); };
    const fit = (sub) => {
      let sh = circ(sub);
      if (opts.calibrated) sh = Math.max(-0.06 * sub, Math.min(0.06 * sub, sh));
      const rms = Math.sqrt(hits.reduce((a, o) => { const x = o.b * sub - sh; return a + (x - Math.round(x)) ** 2; }, 0) / hits.length) / sub;
      return { sub, sh, rms };
    };
    const cands = compound(beats) ? [1, 2] : [2, 3, 4];
    let g;
    if (subOpt && subOpt !== 'auto') g = fit(+subOpt);
    else {
      const base = fit(cands[0]);
      g = base;
      if (base.rms > 0.04) { // not a clean 8th-note take: is it 16ths or triplets?
        const best = cands.slice(1).map(fit).sort((a, c) => a.rms - c.rms)[0];
        if (best.rms < base.rms * 0.6) g = best;
      }
    }
    const sub = g.sub, N = beats * sub, shift = g.sh; // shift in steps
    const steps = hits.map((o) => { const x = o.b * sub - shift; return { ...o, step: Math.round(x), dev: x - Math.round(x) }; });
    const nb = Math.max(1, Math.ceil((Math.max(...steps.map((s) => s.step)) + 1) / N));
    const raw = Array.from({ length: nb }, () => Array(N).fill(null));
    steps.forEach((s) => {
      if (s.step < 0) return;
      const bar = Math.floor(s.step / N), k = s.step % N;
      // the strumming hand swings down on the grid and up between; 6/8 eighths go D D U per half bar; triplets D U D
      const auto = sub === 1 && compound(beats) ? (k % 3 === 2 ? 'U' : 'D') : sub === 3 ? (k % 3 === 0 ? 'D' : 'U') : (k % 2 ? 'U' : 'D');
      const prevCell = raw[bar][k];
      raw[bar][k] = { dir: s.dir || auto, amp: Math.max(prevCell ? prevCell.amp : 0, s.amp || 1), dyn: s.dyn };
    });
    const usedIdx = raw.map((r, k) => (r.some(Boolean) ? k : -1)).filter((k) => k >= 0);
    if (!usedIdx.length) return null;
    const first = usedIdx[0], last = usedIdx[usedIdx.length - 1];
    const span = raw.slice(first, last + 1); // keep empty bars in the middle (they are part of the music)
    const medAmp = median(span.flatMap((r) => r.filter(Boolean).map((c) => c.amp))) || 1;
    // dynamics from how hard each strum was played
    const rows = span.map((r) => r.map((c) => {
      if (!c) return '-';
      const dyn = c.dyn || (c.amp > medAmp * 1.45 ? 'acc' : c.amp < medAmp * 0.55 ? 'soft' : 'norm');
      return make(c.dir, dyn);
    }));
    const key = (r) => r.map(DIR).join('');
    // dynamics of a cell = what most of the matching bars did
    const voteDyn = (group, k) => { const d = group.map((r) => r[k]).filter((c) => DIR(c) !== '-'); if (!d.length) return 'norm'; const acc = d.filter(ACC).length, soft = d.filter(SOFT).length; return acc * 2 > d.length ? 'acc' : soft * 2 > d.length ? 'soft' : 'norm'; };
    const tally = (list) => { const t = {}; list.forEach((r) => { t[key(r)] = (t[key(r)] || 0) + 1; }); return Object.entries(t).sort((a, c) => c[1] - a[1])[0]; };
    // 1-bar pattern, unless the take clearly repeats every 2 bars
    const one = tally(rows);
    let cells, patBars = 1, same;
    const pairs = []; for (let k = 0; k + 1 < rows.length; k += 2) pairs.push(rows[k].concat(rows[k + 1]));
    const two = pairs.length >= 2 ? tally(pairs) : null;
    if (two && one[1] / rows.length < 0.6 && two[1] / pairs.length >= 0.66 && two[0].slice(0, N) !== two[0].slice(N)) {
      const group = pairs.filter((r) => key(r) === two[0]);
      cells = group[0].map((c, k) => make(DIR(c), voteDyn(group, k)));
      patBars = 2; same = Math.round((100 * two[1]) / pairs.length);
    } else if (one[1] >= 2 || rows.length === 1) {
      const group = rows.filter((r) => key(r) === one[0]);
      cells = group[0].map((c, k) => make(DIR(c), voteDyn(group, k)));
      same = Math.round((100 * one[1]) / rows.length);
    } else { // every bar different: a beat-by-beat vote
      cells = Array(N).fill('-');
      for (let k = 0; k < N; k++) {
        const v = rows.map((r) => DIR(r[k])).filter((c) => c !== '-');
        if (v.length * 2 >= rows.length) { const c = {}; v.forEach((d) => { c[d] = (c[d] || 0) + 1; }); cells[k] = make(Object.entries(c).sort((a, z) => z[1] - a[1])[0][0], voteDyn(rows, k)); }
      }
      same = Math.round((100 * rows.filter((r) => key(r) === key(cells)).length) / rows.length);
    }
    const spread = Math.sqrt(steps.reduce((s, x) => s + x.dev * x.dev, 0) / steps.length) / sub; // in beats
    const late = steps.reduce((s, x) => s + x.dev, 0) / steps.length / sub;
    const offBeats = cells.filter((c, k) => DIR(c) !== '-' && k % sub !== 0).length;
    return {
      pattern: { beats, sub, bars: patBars, cells }, bars: rows, sub,
      stats: { strums: hits.length, bars: rows.length, match: same, patBars, offBeats, grid: sub, steadyMs: Math.round(spread * spb * 1000), driftMs: Math.round(late * spb * 1000), shiftMs: Math.round((shift / sub) * spb * 1000) }
    };
  }

  /* ---------------- guitar sound ---------------- */
  let gOut = null; const cache = new Map(); let sources = [];
  function out() {
    const c = M.audio();
    if (!gOut || gOut.context !== c) { gOut = c.createGain(); gOut.gain.value = 0.9; const comp = c.createDynamicsCompressor(); gOut.connect(comp); comp.connect(c.destination); }
    return gOut;
  }
  function pluckBuffer(m) {
    const c = M.audio();
    if (cache.has(m)) return cache.get(m);
    const sr = c.sampleRate, len = Math.floor(sr * 2.2), f = 440 * Math.pow(2, (m - 69) / 12), N = Math.max(2, Math.round(sr / f));
    const buf = c.createBuffer(1, len, sr), y = buf.getChannelData(0);
    let lp = 0;
    for (let i = 0; i < N; i++) { lp = lp * 0.5 + (Math.random() * 2 - 1) * 0.5; y[i] = lp; } // soft pick: filtered noise burst
    const decay = 0.996 - Math.max(0, m - 52) * 0.00035;
    for (let i = N; i < len; i++) y[i] = decay * 0.5 * (y[i - N] + y[Math.max(0, i - N - 1)]);
    cache.set(m, buf);
    return buf;
  }
  function pluck(m, when, vel, dur) {
    const c = M.audio(); if (!c) return;
    if (M.outputName && M.outputName()) { M.tone(m, when, dur, { v: Math.max(20, Math.min(127, Math.round(25 + vel * 85))) }); return; } // through your VST
    const s = c.createBufferSource(); s.buffer = pluckBuffer(m);
    const g = c.createGain(); g.gain.setValueAtTime(vel * 0.5, when); g.gain.setValueAtTime(vel * 0.5, when + Math.max(0.05, dur)); g.gain.exponentialRampToValueAtTime(0.0001, when + dur + 0.12);
    s.connect(g); g.connect(out()); s.start(when); s.stop(when + dur + 0.15); sources.push(s);
  }
  function chuck(when, vel) {
    const c = M.audio(); if (!c) return;
    const len = Math.floor(c.sampleRate * 0.05), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const s = c.createBufferSource(); s.buffer = buf;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1400; f.Q.value = 0.8;
    const g = c.createGain(); g.gain.value = vel * 0.9;
    s.connect(f); f.connect(g); g.connect(out()); s.start(when); sources.push(s);
  }
  // Guitar-style voicing of a chord symbol: bass on the low strings, chord tones stacked like an open/barre shape
  function voicing(sym) {
    const ch = M.parseChord(sym); if (!ch) return [];
    const v = M.voice(ch); if (!v.length) return [];
    const pcs = Array.from(new Set(v.map((m) => m % 12)));
    const bassPc = v[0] % 12;
    let bass = 40; while (bass % 12 !== bassPc) bass++;
    const STR = [40, 45, 50, 55, 59, 64];
    const start = bass < 45 ? 0 : 1, res = [bass];
    for (let s = start + 1; s < 6; s++) {
      const target = STR[s], prev = res[res.length - 1];
      let best = null;
      for (let m = Math.max(prev + 1, target - 4); m <= target + 4; m++) if (pcs.includes(m % 12) && (best == null || Math.abs(m - target) < Math.abs(best - target))) best = m;
      if (best != null) res.push(best);
    }
    return res;
  }
  // one strum: down = low→high, up = the top strings high→low; accents louder, soft strums lighter and on fewer strings
  function strum(sym, when, cell, len) {
    const d = DIR(cell), dyn = DYN(cell);
    if (d === '-') return;
    const level = dyn === 'acc' ? 1.35 : dyn === 'soft' ? 0.5 : 1;
    if (d === 'x') { chuck(when, 0.7 * level); return; }
    const notes = voicing(sym); if (!notes.length) { chuck(when, 0.5); return; }
    const vel = (d === 'D' ? 0.72 : 0.55) * level;
    let list = d === 'D' ? notes : notes.slice(-4).reverse();
    if (dyn === 'soft') list = d === 'D' ? notes.slice(1, 4) : notes.slice(-3).reverse();
    list.forEach((m, k) => pluck(m, when + k * (d === 'D' ? 0.012 : 0.009), vel * (1 - k * 0.04), len));
  }
  function stopSound() { sources.forEach((s) => { try { s.stop(); } catch (e) { /* done */ } }); sources = []; }

  /* ---------------- player (loop, metronome, speed trainer, play back the take) ---------------- */
  let view = (sym) => sym; // "View in key": chords are heard in the key being viewed
  const progChords = (txt) => String(txt || '').split(/[\s|]+/).filter((t) => t && t !== '.' && t !== '%').map((c) => { try { return view(c) || c; } catch (e) { return c; } });
  let player = null;
  function highlight(b, k) { $$(`[data-strumgrid="${b.id}"] .sc`).forEach((el) => el.classList.toggle('now', +el.dataset.k === k)); }
  function startClock(b, cue, onEnd) {
    const tick = () => {
      if (!player) return;
      const now = M.audio().currentTime;
      while (cue.length > 1 && cue[1].t <= now) cue.shift();
      const cur = cue[0];
      if (cur && cur.t <= now) {
        highlight(b, cur.k);
        const lab = $(`[data-strumnow="${b.id}"]`); if (lab) lab.textContent = `${cur.sym} · bar ${cur.bar + 1} · ${Math.round(cur.bpm)} bpm${cur.label ? ' · ' + cur.label : ''}`;
      }
      player.raf = requestAnimationFrame(tick);
    };
    player.onEnd = onEnd;
    tick();
  }
  function play(b, opts = {}) {
    stop();
    const p = b.pat; if (!p || !p.cells.length) return;
    const c = M.audio(); if (!c) return;
    const chords = progChords(b.prog).length ? progChords(b.prog) : ['G'];
    let bpm = +b.bpm || 80;
    const N = perBar(p), pb = barsOf(p);
    let next = c.currentTime + 0.12, bar = 0, loops = 0;
    const cue = [];
    const schedule = () => {
      while (next < M.audio().currentTime + 0.25) {
        const spb = 60 / bpm, step = spb / p.sub, sym = chords[bar % chords.length], off = (bar % pb) * N;
        for (let k = 0; k < N; k++) {
          const cell = p.cells[off + k], t = next + k * step;
          let j = k + 1; while (j < N && DIR(p.cells[off + j]) === '-') j++; // a strum rings until the next one
          strum(sym, t, cell, Math.max(0.12, (j - k) * step * 0.98));
          cue.push({ t, k: off + k, bar, sym, bpm });
        }
        if (b.click) for (let q = 0; q < p.beats; q++) M.click(next + q * spb, U.accentOf(q, p.beats));
        next += p.beats * spb; bar++;
        const cycle = Math.max(chords.length, pb);
        if (bar % cycle === 0) {
          loops++;
          if (b.trainer && b.trainer.on && loops % (b.trainer.every || 2) === 0) bpm = Math.min(+b.trainer.target || 140, bpm + (+b.trainer.step || 4));
          if (!b.loop) { player.endAt = next; return; }
        }
      }
    };
    player = { id: b.id, cue, raf: 0, timer: setInterval(() => { if (!player) return; if (player.endAt) { if (M.audio().currentTime > player.endAt + 0.2) { const f = player.onEnd; stop(); f && f(); } return; } schedule(); }, 50) };
    schedule();
    startClock(b, cue, opts.onEnd);
  }
  // Play back what was recorded (each strum at its real time and strength) to compare with the pattern
  function playTake(b, opts = {}) {
    stop();
    const take = b.take; if (!take || !take.list || !take.list.length) return false;
    const c = M.audio(); if (!c) return false;
    const chords = progChords(b.prog).length ? progChords(b.prog) : ['G'];
    const bpm = +take.bpm || +b.bpm || 80, spb = 60 / bpm, beats = take.beats || b.beats || 4, p = b.pat || { sub: 2, beats };
    const sub = p.sub || 2, N = beats * sub, medAmp = median(take.list.map((o) => o.amp || 1)) || 1;
    const minB = Math.min(0, ...take.list.map((o) => o.b));
    const t0 = c.currentTime + 0.15 - minB * spb, cue = [];
    take.list.forEach((o, n) => {
      const t = t0 + o.b * spb, bar = Math.max(0, Math.floor(o.b / beats)), step = Math.round(o.b * sub), k = ((step % N) + N) % N;
      const dir = o.dir || (k % 2 ? 'U' : 'D'), dyn = o.dyn || ((o.amp || 1) > medAmp * 1.45 ? 'acc' : (o.amp || 1) < medAmp * 0.6 ? 'soft' : 'norm');
      const nextT = take.list[n + 1] ? t0 + take.list[n + 1].b * spb : t + spb;
      strum(chords[bar % chords.length], t, make(dir, dyn), Math.max(0.12, Math.min(2, nextT - t)));
      cue.push({ t, k: k + (barsOf(p) > 1 ? (bar % barsOf(p)) * N : 0), bar, sym: chords[bar % chords.length], bpm, label: 'your take' });
    });
    if (b.click) { const endB = Math.max(...take.list.map((o) => o.b)) + 1; for (let q = Math.floor(minB); q < endB; q++) M.click(t0 + q * spb, U.accentOf(((q % beats) + beats) % beats, beats)); }
    const endAt = t0 + (Math.max(...take.list.map((o) => o.b)) + 1) * spb;
    player = { id: b.id, cue, raf: 0, endAt, timer: setInterval(() => { if (player && M.audio().currentTime > player.endAt + 0.2) { const f = player.onEnd; stop(); f && f(); } }, 80) };
    startClock(b, cue, opts.onEnd);
    return true;
  }
  function stop() {
    if (player) { clearInterval(player.timer); cancelAnimationFrame(player.raf); $$('.sc.now').forEach((el) => el.classList.remove('now')); player = null; }
    stopSound(); M.stopAll();
  }
  const playing = (b) => !!(player && player.id === b.id);

  /* ---------------- recording ---------------- */
  let rec = null;
  async function startRec(b, ctx) {
    stop();
    const c = M.audio(); if (!c) return;
    const beats = b.beats || 4, bpm = +b.bpm || 80, spb = 60 / bpm, countBars = b.countBars || 1;
    let stream = null, mode = b.input || 'mic';
    if (mode === 'mic') {
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }); }
      catch (e) { ctx.toast('No microphone here — recording with the keys instead (↓/D, ↑/U, X)'); mode = 'keys'; }
    }
    const t0 = c.currentTime + 0.15, downbeat = t0 + countBars * beats * spb;
    const clicks = [];
    if (!b.silent) for (let k = 0; k < (countBars + 64) * beats; k++) { const t = t0 + k * spb; M.click(t, U.accentOf(k % beats, beats)); clicks.push(t); }
    rec = { id: b.id, raw: [], keys: [], downbeat, spb, beats, clicks, stream, mode, t0, clickAmp: 0, bpm, latency: [] };
    if (stream) {
      const src = c.createMediaStreamSource(stream);
      const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 110;
      const proc = c.createScriptProcessor(1024, 1, 1);
      const det = detector(c.sampleRate), mute = c.createGain(); mute.gain.value = 0;
      proc.onaudioprocess = (e) => {
        if (!rec) return;
        const tIn = e.playbackTime - (2 * proc.bufferSize) / c.sampleRate; // roughly when this audio reached the mic
        det.push(e.inputBuffer.getChannelData(0), tIn).forEach((o) => {
          if (o.t < downbeat - 0.35 * spb) { // during the count-in: learn how loud the metronome is in the mic
            const near = rec.clicks.reduce((a, t) => (Math.abs(t - o.t) < Math.abs(a - o.t) ? t : a), Infinity);
            if (Math.abs(near - o.t) < 0.25) { rec.clickAmp = Math.max(rec.clickAmp, o.amp); rec.latency.push(o.t - near); } // the click heard by the mic tells us the delay
            return;
          }
          rec.raw.push(o); ctx.onCount && ctx.onCount(rec.raw.length + rec.keys.length);
        });
      };
      src.connect(hp); hp.connect(proc); proc.connect(mute); mute.connect(c.destination);
      rec.nodes = [src, hp, proc, mute];
    }
    rec.onKey = (ev) => {
      if (/INPUT|TEXTAREA|SELECT/.test(ev.target.tagName) || ev.target.isContentEditable) return;
      const k = ev.key.toLowerCase(), dir = k === 'arrowdown' || k === 'd' ? 'D' : k === 'arrowup' || k === 'u' ? 'U' : k === 'x' ? 'x' : null;
      if (!dir || ev.repeat) return;
      ev.preventDefault(); ev.stopPropagation();
      const t = M.audio().currentTime, dyn = ev.shiftKey ? 'acc' : ev.altKey ? 'soft' : 'norm';
      rec.keys.push({ t, amp: dyn === 'acc' ? 2 : dyn === 'soft' ? 0.4 : 1, dir, dyn });
      strum('G', t, make(dir, dyn), 0.25);
      ctx.onCount && ctx.onCount(rec.raw.length + rec.keys.length);
    };
    document.addEventListener('keydown', rec.onKey, true);
    rec.timer = setInterval(() => { // beat display
      if (!rec) return;
      const now = M.audio().currentTime, k = Math.floor((now - t0) / spb);
      if (k < 0) return;
      const inCount = now < downbeat, bar = Math.floor((now - downbeat) / (beats * spb));
      const el = $(`[data-strumbeat="${b.id}"]`);
      if (el) el.innerHTML = `<span class="bb-label">${inCount ? 'Count-in' : 'Bar ' + (bar + 1)}</span>${Array.from({ length: beats }, (_, j) => `<span class="bb-dot ${j === k % beats ? 'on' : ''} ${j === 0 ? 'first' : ''} ${inCount ? 'ci' : ''}">${j + 1}</span>`).join('')}`;
    }, 30);
  }
  function stopRec() {
    if (!rec) return null;
    const r = rec; rec = null;
    clearInterval(r.timer); document.removeEventListener('keydown', r.onKey, true);
    (r.nodes || []).forEach((n) => { try { n.disconnect(); } catch (e) { /* ignore */ } });
    if (r.stream) r.stream.getTracks().forEach((t) => t.stop());
    M.stopAll();
    // the metronome leaks into the mic: drop onsets right on a click unless clearly louder than the click itself
    let ons = r.raw.filter((o) => !(r.clickAmp && o.amp < r.clickAmp * 1.6 && r.clicks.some((t) => Math.abs(t - o.t) < 0.05)));
    if (r.keys.length) ons = r.keys; // keys give the strum direction exactly
    // remove the measured delay of speaker + mic (from the count-in clicks), when it could be measured
    const lat = !r.keys.length && r.latency.length >= 2 ? median(r.latency) : null;
    const delay = lat != null && Math.abs(lat) < 0.3 ? lat : 0;
    const list = ons.map((o) => ({ b: +((o.t - delay - r.downbeat) / r.spb).toFixed(4), amp: +(o.amp || 1).toFixed(5), dir: o.dir, dyn: o.dyn }));
    return { list, keys: !!r.keys.length, bpm: r.bpm, beats: r.beats, calibrated: !!r.keys.length || lat != null, delayMs: Math.round(delay * 1000) };
  }
  const recording = (b) => !!(rec && rec.id === b.id);
  const recId = () => (rec ? rec.id : null);
  function decode(b, toast) {
    const t = b.take; if (!t || !t.list) return false;
    const res = extract(t.list, t.beats || b.beats || 4, b.sub || 'auto', 60 / (+t.bpm || +b.bpm || 80), { calibrated: t.calibrated });
    if (!res) { toast && toast('Not enough strums to find a pattern — try a few bars'); return false; }
    b.pat = { ...res.pattern, name: (b.pat && b.pat.name && b.pat.name !== 'My pattern' && b.pat._mine) ? b.pat.name : 'My pattern', _mine: true };
    b.bars = res.bars; b.stats = { ...res.stats, keys: t.keys };
    return true;
  }
  // Stop recording and turn what was heard into the block's pattern
  function finish(b, toast) {
    const r = stopRec();
    if (!r || !r.list.length) { toast('No strums heard — check the microphone, or switch Input to Keys'); return false; }
    b.take = r;
    if (!decode(b, toast)) return false;
    toast(`Pattern found: ${arrowsOf(b.pat)}`);
    return true;
  }

  /* ---------------- colours ---------------- */
  const COLOUR_PRESETS = {
    hands: { label: 'Hand colours (down = RH, up = LH)', v: null },
    classic: { label: 'Blue down / red up', v: { down: '#3b82f6', up: '#ef4444', mute: '#9ca3af', acc: '#f59e0b' } },
    green: { label: 'Green down / orange up', v: { down: '#16a34a', up: '#f97316', mute: '#94a3b8', acc: '#e11d48' } },
    purple: { label: 'Purple down / teal up', v: { down: '#8b5cf6', up: '#14b8a6', mute: '#a1a1aa', acc: '#f43f5e' } },
    print: { label: 'Black & grey (printing)', v: { down: '#111111', up: '#555555', mute: '#888888', acc: '#000000' } }
  };
  const loadColours = () => { try { return JSON.parse(localStorage.getItem('riffbook-strum-colours')) || { preset: 'hands', fill: true }; } catch (e) { return { preset: 'hands', fill: true }; } };
  let colours = loadColours();
  function applyColours() {
    const r = document.documentElement.style, v = colours.preset === 'custom' ? colours.custom : (COLOUR_PRESETS[colours.preset] || {}).v;
    ['down', 'up', 'mute', 'acc'].forEach((k) => { if (v && v[k]) r.setProperty('--st-' + k, v[k]); else r.removeProperty('--st-' + k); });
    document.documentElement.classList.toggle('strum-fill', colours.fill !== false);
  }
  function saveColours() { try { localStorage.setItem('riffbook-strum-colours', JSON.stringify(colours)); } catch (e) { /* private mode */ } applyColours(); }
  const curColour = (k) => { const v = colours.preset === 'custom' ? colours.custom : (COLOUR_PRESETS[colours.preset] || {}).v; return (v && v[k]) || { down: '#f5b942', up: '#6ea8fe', mute: '#9ca3af', acc: '#ff6b6b' }[k]; };
  applyColours();

  /* ---------------- block UI ---------------- */
  function gridHTML(p, id, editable) {
    if (!p || !p.cells) return '';
    const N = perBar(p), nb = barsOf(p), counts = countLabels(p.beats, p.sub);
    let html = '';
    for (let bar = 0; bar < nb; bar++) {
      const cells = p.cells.slice(bar * N, bar * N + N);
      html += `<div class="strum-grid ${editable ? 'editable' : ''} sub-${p.sub}" ${bar === 0 ? '' : 'data-more="1"'} data-strumgrid="${esc(id || '')}" style="--cols:${N}">
        ${nb > 1 ? `<span class="sbar-label">Bar ${bar + 1}</span>` : ''}
        ${cells.map((c) => `<span class="sdyn ${DYN(c)}">${ACC(c) ? '>' : SOFT(c) ? 'p' : ''}</span>`).join('')}
        ${cells.map((c, j) => { const k = bar * N + j, d = DIR(c), cls = d === '-' ? 'rest' : d === 'x' ? 'mute' : d === 'D' ? 'down' : 'up'; const tag = editable ? 'button type="button"' : 'span'; return `<${tag} class="sc ${cls} ${DYN(c)} ${j % p.sub === 0 ? 'on-beat' : ''}" data-k="${k}" ${editable ? 'aria-label="' + (d === '-' ? 'no strum' : d === 'x' ? 'muted strum' : d === 'D' ? 'down strum' : 'up strum') + (ACC(c) ? ', accent' : SOFT(c) ? ', soft' : '') + '"' : ''}>${ARROW[d] || ''}</${editable ? 'button' : 'span'}>`; }).join('')}
        ${counts.map((t, j) => `<span class="scount ${j % p.sub === 0 ? 'on-beat' : ''}">${esc(t)}</span>`).join('')}
      </div>`;
    }
    return html;
  }
  // The strum line on a chord-chart sheet
  function sheetHTML(p) {
    if (!p || !p.cells) return '';
    return `<div class="sh-sec">Strum :${p.name ? ` <span class="sh-strum-name">${esc(p.name)}</span>` : ''}</div>${gridHTML(p, '', false)}<div class="sh-note">↓ down · ↑ up · ✕ muted · &gt; accent · p soft</div>`;
  }
  const BRUSHES = [['cycle', '↻ Cycle', 'Click a cell to go ↓ → ↑ → ✕ → rest'], ['D', '↓', 'Down strum'], ['U', '↑', 'Up strum'], ['x', '✕', 'Muted chuck'], ['-', 'Rest', 'No strum'], ['acc', '> Accent', 'Play it harder'], ['norm', 'Normal', 'Normal strength'], ['soft', 'p Soft', 'Ghost / light strum']];
  const brush = {};
  function blockHTML(n, b, i) {
    const p = b.pat || PRESETS[0];
    const isRec = recording(b), isPlay = playing(b), st = b.stats, br = brush[b.id] || 'cycle';
    const subName = (s) => (s === 4 || (compound(p.beats) && s === 2) ? '16ths' : s === 3 ? 'triplets' : '8ths');
    return `<div class="strum">
      <div class="rec-set row small" role="group" aria-label="Strum recording settings">
        <button class="btn sm rec-btn ${isRec ? 'on' : ''}" data-strec="${i}">${isRec ? '■ Stop' : '● Record strumming'}</button>
        <label>Input <select data-stin="${i}"><option value="mic" ${b.input !== 'keys' ? 'selected' : ''}>🎙 Microphone</option><option value="keys" ${b.input === 'keys' ? 'selected' : ''}>⌨ Keys (↓/D ↑/U X)</option></select></label>
        <label>Time <select data-stbeats="${i}">${[2, 3, 4, 6, 12].map((s) => `<option value="${s}" ${s === (b.beats || 4) ? 'selected' : ''}>${sigLabel(s)}</option>`).join('')}</select></label>
        <label>Tempo <input type="number" data-stbpm="${i}" value="${b.bpm || 80}" min="30" max="260" style="width:62px"></label>
        <label title="Auto picks 8ths, 16ths or triplets from your playing. Changing it re-reads your take (or redraws the pattern on the new grid)">Grid <select data-stsub="${i}"><option value="auto" ${(b.sub || 'auto') === 'auto' ? 'selected' : ''}>Auto${b.sub === 'auto' || !b.sub ? ` (${subName(p.sub)})` : ''}</option>${(compound(b.beats) ? [[1, '8ths'], [2, '16ths']] : [[2, '8ths'], [4, '16ths'], [3, 'Triplets']]).map(([v, l]) => `<option value="${v}" ${String(b.sub) === String(v) ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
        <label>Count-in <select data-stcount="${i}"><option value="1" ${(b.countBars || 1) === 1 ? 'selected' : ''}>1 bar</option><option value="2" ${b.countBars === 2 ? 'selected' : ''}>2 bars</option></select></label>
        <label title="Use this if the click is picked up by the mic and you have no headphones"><input type="checkbox" data-stsilent="${i}" ${b.silent ? 'checked' : ''}> Light-only metronome</label>
      </div>
      ${isRec ? `<div class="beatbox" data-strumbeat="${esc(b.id)}"></div><div class="small muted" data-strumcount="${i}">${b.input === 'keys' ? 'Tap ↓ (or D) for down strums, ↑ (or U) for up, X for a muted chuck — Shift = accent, Alt = soft.' : 'Strum along with the click. Headphones keep the click out of the mic.'}</div>` : ''}
      <div class="strum-brushes row small" role="group" aria-label="Edit cells">
        <span class="muted">Click cells to:</span>${BRUSHES.map(([k, l, t]) => `<button type="button" class="btn sm ${br === k ? 'primary' : 'ghost'}" data-stbrush="${i}:${k}" title="${esc(t)}">${l}</button>`).join('')}
        <span class="muted">Shift+click = accent</span>
      </div>
      ${gridHTML(p, b.id, true)}
      <div class="row small strum-actions">
        <button class="btn sm primary" data-stplay="${i}">${isPlay ? '■ Stop' : '▶ Play pattern'}</button>
        ${b.take && b.take.list && b.take.list.length ? `<button class="btn sm" data-sttake="${i}" title="Hear exactly what you recorded, at its real timing and strength">▶ My take</button>` : ''}
        <label>Chords <input type="text" data-stprog="${i}" value="${esc(b.prog || '')}" placeholder="G D Em C" style="width:150px" title="One chord per bar"></label>
        <label><input type="checkbox" data-stloop="${i}" ${b.loop ? 'checked' : ''}> Loop</label>
        <label><input type="checkbox" data-stclick="${i}" ${b.click ? 'checked' : ''}> Click</label>
        <label title="Speeds up after every few loops — a classic way to build up to tempo"><input type="checkbox" data-sttrain="${i}" ${b.trainer && b.trainer.on ? 'checked' : ''}> Speed trainer</label>
        ${b.trainer && b.trainer.on ? `<span>+<input type="number" data-sttr="step:${i}" value="${b.trainer.step || 4}" min="1" max="20" style="width:44px"> bpm every <input type="number" data-sttr="every:${i}" value="${b.trainer.every || 2}" min="1" max="16" style="width:44px"> loops up to <input type="number" data-sttr="target:${i}" value="${b.trainer.target || Math.round((b.bpm || 80) * 1.4)}" min="40" max="260" style="width:54px"></span>` : ''}
        <span class="muted" data-strumnow="${esc(b.id)}"></span>
      </div>
      <div class="row small strum-actions">
        <label>Pattern <input type="text" data-sttext="${i}" value="${esc(textOf(p))}" style="width:260px" spellcheck="false" title="D down, U up, d/u soft, x muted chuck, - no strum, > after a strum = accent, | between bars. Shorthand like D DU UDU works too"></label>
        <label>Name <input type="text" data-stname="${i}" value="${esc(p.name || '')}" style="width:130px" placeholder="Pattern name"></label>
        <label>Preset <select data-stpreset="${i}"><option value="">Choose…</option>${PRESETS.map((x, k) => `<option value="${k}">${esc(x.name)} (${sigLabel(x.beats)})</option>`).join('')}</select></label>
        <button class="btn sm ghost" data-stbar="${i}:add" title="Make it a longer pattern (copies the last bar)">＋ Bar</button>${barsOf(p) > 1 ? `<button class="btn sm ghost" data-stbar="${i}:del">− Bar</button>` : ''}
        <button class="btn sm" data-stchart="${i}" title="Show this pattern on the note's chord chart (or start a chart with these chords)">＋ Add to chord chart</button>
        <button class="btn sm ghost" data-stcopy="${i}">⧉ Copy</button>
      </div>
      <details class="strum-colours small"><summary>🎨 Colours</summary>
        <div class="row" style="gap:10px;flex-wrap:wrap;margin-top:6px">
          <label>Style <select data-stcolpre="${i}">${Object.entries(COLOUR_PRESETS).map(([k, v]) => `<option value="${k}" ${colours.preset === k ? 'selected' : ''}>${esc(v.label)}</option>`).join('')}<option value="custom" ${colours.preset === 'custom' ? 'selected' : ''}>My colours</option></select></label>
          ${['down', 'up', 'mute', 'acc'].map((k) => `<label>${{ down: '↓ Down', up: '↑ Up', mute: '✕ Muted', acc: '> Accent' }[k]} <input type="color" data-stcol="${k}" value="${curColour(k)}"></label>`).join('')}
          <label><input type="checkbox" data-stfill ${colours.fill !== false ? 'checked' : ''}> Coloured cells</label>
        </div></details>
      ${p.tip ? `<div class="small muted">${esc(p.tip)}</div>` : ''}
      ${st ? `<div class="strum-stats small">Found <b>${st.strums}</b> strums in <b>${st.bars}</b> bar${st.bars > 1 ? 's' : ''} · grid: <b>${subName(st.grid || p.sub)}</b>${st.patBars > 1 ? ' · <b>2-bar</b> pattern' : ''}${st.offBeats ? ` · ${st.offBeats} off-beat strum${st.offBeats > 1 ? 's' : ''}` : ''}${st.bars > 1 ? ` · the pattern matches <b>${st.match}%</b> of ${st.patBars > 1 ? 'bar pairs' : 'bars'}` : ''}${st.keys ? '' : ` · timing spread ±${st.steadyMs} ms${Math.abs(st.driftMs) > 8 ? ` (you tend to be ${st.driftMs > 0 ? 'late' : 'early'})` : ''} · loudness gives the accents (>) and soft strums (p); directions follow the hand motion — click a cell to change anything`}</div>` : ''}
      ${(b.bars || []).length > 1 ? `<details class="strum-bars"><summary class="small">Bars as you played them (${b.bars.length})</summary>${b.bars.map((r, k) => `<div class="row small strum-bar"><span class="muted">Bar ${k + 1}</span><code>${esc(arrowsOf({ beats: p.beats, sub: r.length / p.beats, cells: r }))}</code><button class="btn sm ghost" data-stuse="${i}:${k}">Use</button></div>`).join('')}</details>` : ''}
    </div>`;
  }

  function bind(pane, ctx) {
    const B = (i) => ctx.block(+i);
    view = ctx.view || ((sym) => sym);
    const save = (b, rerender = true) => ctx.save(rerender);
    const setPat = (b, p, rer = true) => { b.pat = { ...b.pat, ...p, bars: barsOf({ ...b.pat, ...p }) }; save(b, rer); };
    $$('[data-strec]', pane).forEach((x) => x.onclick = async () => {
      const b = B(x.dataset.strec);
      if (recording(b)) { finish(b, ctx.toast); save(b); return; }
      if (rec) { ctx.toast('Finish the other recording first'); return; }
      ctx.stopOthers && ctx.stopOthers();
      await startRec(b, { toast: ctx.toast, onCount: (k) => { const el = $(`[data-strumcount="${x.dataset.strec}"]`); if (el) el.textContent = `● ${k} strum${k === 1 ? '' : 's'} heard — press Stop after a few bars`; } });
      save(b);
    });
    $$('[data-stplay]', pane).forEach((x) => x.onclick = () => { const b = B(x.dataset.stplay); if (playing(b)) { stop(); save(b); return; } play(b, { onEnd: () => save(b) }); x.textContent = '■ Stop'; });
    $$('[data-sttake]', pane).forEach((x) => x.onclick = () => { const b = B(x.dataset.sttake); if (playing(b)) { stop(); save(b); return; } if (playTake(b, { onEnd: () => save(b) })) x.textContent = '■ Stop'; });
    const setVal = (attr, field, rer = true) => $$(`[${attr}]`, pane).forEach((x) => x.onchange = () => { const b = B(x.getAttribute(attr)); b[field] = isNaN(+x.value) ? x.value : +x.value; save(b, rer); });
    setVal('data-stbpm', 'bpm', false); setVal('data-stcount', 'countBars', false); setVal('data-stin', 'input');
    $$('[data-stsub]', pane).forEach((x) => x.onchange = () => {
      const b = B(x.dataset.stsub); b.sub = x.value === 'auto' ? 'auto' : +x.value;
      if (b.take && b.take.list) { decode(b, ctx.toast); ctx.toast(`Re-read your take on the ${b.sub === 'auto' ? 'best-fitting' : x.selectedOptions[0].textContent.toLowerCase()} grid`); }
      else if (b.sub !== 'auto' && b.pat) { const r = regrid(b.pat, b.sub); b.pat = { ...r }; if (r._lost) ctx.toast(`${r._lost} strum${r._lost > 1 ? 's' : ''} did not fit the new grid exactly`); delete b.pat._lost; }
      save(b);
    });
    $$('[data-stbeats]', pane).forEach((x) => x.onchange = () => {
      const b = B(x.dataset.stbeats), beats = +x.value; b.beats = beats; b.sub = 'auto';
      const p = PRESETS.find((q) => q.beats === beats) || { beats, sub: compound(beats) ? 1 : 2, cells: Array(beats * (compound(beats) ? 1 : 2)).fill('-').map((c, k) => (k % (compound(beats) ? 1 : 2) === 0 ? 'D' : '-')) };
      if (!b.pat || b.pat.beats !== beats) b.pat = { beats: p.beats, sub: p.sub, bars: 1, cells: p.cells.slice(0, p.beats * p.sub), name: p.name ? p.name.split(' — ')[0] : '' };
      save(b);
    });
    $$('[data-stsilent]', pane).forEach((x) => x.onchange = () => { B(x.dataset.stsilent).silent = x.checked; save(B(x.dataset.stsilent), false); });
    $$('[data-stloop]', pane).forEach((x) => x.onchange = () => { B(x.dataset.stloop).loop = x.checked; save(B(x.dataset.stloop), false); });
    $$('[data-stclick]', pane).forEach((x) => x.onchange = () => { B(x.dataset.stclick).click = x.checked; save(B(x.dataset.stclick), false); });
    $$('[data-sttrain]', pane).forEach((x) => x.onchange = () => { const b = B(x.dataset.sttrain); b.trainer = { step: 4, every: 2, target: Math.round((b.bpm || 80) * 1.4), ...(b.trainer || {}), on: x.checked }; save(b); });
    $$('[data-sttr]', pane).forEach((x) => x.onchange = () => { const [f, i] = x.dataset.sttr.split(':'); const b = B(i); b.trainer[f] = +x.value; save(b, false); });
    $$('[data-stprog]', pane).forEach((x) => x.oninput = () => { B(x.dataset.stprog).prog = x.value; save(B(x.dataset.stprog), false); });
    $$('[data-stname]', pane).forEach((x) => x.oninput = () => { const b = B(x.dataset.stname); b.pat = { ...b.pat, name: x.value }; save(b, false); });
    $$('[data-sttext]', pane).forEach((x) => x.onchange = () => {
      const b = B(x.dataset.sttext); const p = parse(x.value, b.beats || 4);
      if (!p) { if (x.value.trim()) ctx.toast('Use D U d u x - and > (e.g. D - D U - U D U) — the pattern was not changed'); x.value = textOf(b.pat); return; }
      b.sub = p.sub; setPat(b, p);
    });
    $$('[data-stpreset]', pane).forEach((x) => x.onchange = () => { if (x.value === '') return; const b = B(x.dataset.stpreset), p = PRESETS[+x.value]; b.pat = { beats: p.beats, sub: p.sub, bars: p.bars, cells: p.cells.slice(), name: p.name.split(' — ')[0], tip: p.tip }; b.beats = p.beats; b.sub = p.sub; save(b); });
    $$('[data-stuse]', pane).forEach((x) => x.onclick = () => { const [i, k] = x.dataset.stuse.split(':'); const b = B(i); b.pat = { ...b.pat, sub: b.bars[+k].length / b.pat.beats, bars: 1, cells: b.bars[+k].slice() }; save(b); });
    $$('[data-stbar]', pane).forEach((x) => x.onclick = () => {
      const [i, what] = x.dataset.stbar.split(':'), b = B(i), N = perBar(b.pat);
      if (what === 'add') b.pat.cells = b.pat.cells.concat(b.pat.cells.slice(-N)); else if (barsOf(b.pat) > 1) b.pat.cells = b.pat.cells.slice(0, -N);
      b.pat.bars = barsOf(b.pat); save(b);
    });
    $$('[data-stbrush]', pane).forEach((x) => x.onclick = () => { const [i, k] = x.dataset.stbrush.split(':'); brush[B(i).id] = k; save(B(i)); });
    $$('[data-stcopy]', pane).forEach((x) => x.onclick = () => {
      const b = B(x.dataset.stcopy), p = b.pat;
      const txt = `${p.name ? p.name + ' — ' : ''}Strum (${sigLabel(p.beats)}, ${b.bpm || 80} bpm)\n${countLabels(p.beats, p.sub).join(' ')}\n${arrowsOf(p)}\n${textOf(p)}`;
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => ctx.toast('Pattern copied'), () => ctx.toast(textOf(p)));
    });
    $$('[data-stchart]', pane).forEach((x) => x.onclick = () => ctx.toChart(B(x.dataset.stchart)));
    $$('[data-stcolpre]', pane).forEach((x) => x.onchange = () => { colours.preset = x.value; if (x.value === 'custom' && !colours.custom) colours.custom = { down: curColour('down'), up: curColour('up'), mute: curColour('mute'), acc: curColour('acc') }; saveColours(); save(B(x.dataset.stcolpre)); });
    $$('[data-stcol]', pane).forEach((x) => x.oninput = () => { if (colours.preset !== 'custom') colours.custom = { down: curColour('down'), up: curColour('up'), mute: curColour('mute'), acc: curColour('acc') }; colours.preset = 'custom'; colours.custom[x.dataset.stcol] = x.value; saveColours(); const s = $('[data-stcolpre]', pane); if (s) s.value = 'custom'; });
    $$('[data-stfill]', pane).forEach((x) => x.onchange = () => { colours.fill = x.checked; saveColours(); });
    $$('[data-strumgrid] button.sc', pane).forEach((el) => el.onclick = (ev) => {
      const blk = el.closest('[data-i]'); if (!blk) return;
      const b = B(blk.dataset.i), k = +el.dataset.k, c = b.pat.cells[k], d = DIR(c), dyn = DYN(c), br = brush[b.id] || 'cycle';
      let nc = c;
      if (ev.shiftKey) nc = d === '-' ? c : make(d, dyn === 'acc' ? 'norm' : 'acc');
      else if (br === 'cycle') { const order = ['D', 'U', 'x', '-'], nd = order[(order.indexOf(d) + 1) % order.length]; nc = make(nd, nd === 'x' && dyn === 'soft' ? 'norm' : dyn); }
      else if (['D', 'U', 'x', '-'].includes(br)) nc = make(br, br === 'x' && dyn === 'soft' ? 'norm' : dyn);
      else nc = d === '-' ? make(['acc', 'soft'].includes(br) ? 'D' : '-', br) : make(d, br);
      b.pat.cells[k] = nc; b.pat._mine = true;
      const chords = progChords(b.prog);
      strum(chords[Math.floor(k / perBar(b.pat)) % Math.max(1, chords.length)] || 'G', M.audio().currentTime + 0.01, nc, 0.5);
      save(b);
    });
  }

  window.Strum = { PRESETS, countLabels, parse, regrid, textOf, arrowsOf, detector, extract, voicing, strum, play, playTake, stop, playing, recording, recId, finish, decode, stopRec, blockHTML, sheetHTML, gridHTML, bind, sigLabel, DIR, ACC, SOFT };
})();
