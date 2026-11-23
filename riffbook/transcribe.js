/* Riffbook transcription: chord charts and letter-notation melodies from MIDI takes.
   Pure functions (no DOM) — shared by the app and its tests. Depends on window.Music and window.MusicUI. */
(function () {
  const M = window.Music, U = window.MusicUI;

  /* ---------------- tempo, downbeat, metre, key ---------------- */

  // events: [{m, t, d, v}] in beats of the recording tempo `recBpm`. Returns {bpm, t0} with t0 in seconds (the first downbeat).
  function estimateTempo(events, recBpm, opts = {}) {
    const sec = 60 / recBpm;
    const segs = U.segmentChords(events, { split: opts.split || 60 });
    const groups = [];
    events.slice().sort((a, b) => a.t - b.t).forEach((e) => {
      const ts = e.t * sec, g = groups[groups.length - 1];
      if (g && ts - g.t < 0.06) g.w += 1; else groups.push({ t: ts, w: 1 });
    });
    segs.forEach((s) => { const ts = s.t * sec; const g = groups.reduce((b, x) => (Math.abs(x.t - ts) < Math.abs(b.t - ts) ? x : b), groups[0]); g.w += 3; g.chord = true; });
    const anchor = segs.length ? segs[0].t * sec : groups[0].t;
    if (groups.length < 4) return { bpm: Math.round(opts.fallback || recBpm), t0: anchor, confidence: 0 };
    const total = groups.reduce((a, g) => a + g.w, 0);
    let best = { score: -1 };
    for (let bpm = 48; bpm <= 200; bpm += 0.5) {
      const P = 60 / bpm;
      let score = 0;
      for (const g of groups) {
        const x = (g.t - anchor) / P * 2; // position in eighth notes from the first chord
        const r = Math.round(x), dev = Math.abs(x - r);
        score += g.w * Math.exp(-(dev * dev) / (2 * 0.11 * 0.11)) * (r % 2 === 0 ? 1 : g.chord ? 0.35 : 0.7);
      }
      score /= total;
      score *= Math.exp(-Math.pow(Math.log2(bpm / 92), 2) / (2 * 0.55 * 0.55)); // gentle preference for everyday tempos
      if (score > best.score) best = { score, bpm };
    }
    return { bpm: Math.round(best.bpm), t0: anchor, confidence: +best.score.toFixed(2) };
  }

  // Re-time events into beats of `bpm`, so that beat 0 is the downbeat at t0 seconds. Notes before it get negative beats (a pickup).
  function retime(events, recBpm, bpm, t0) {
    const sec = 60 / recBpm, P = 60 / bpm;
    return events.map((e) => ({ ...e, t: (e.t * sec - t0) / P, d: (e.d * sec) / P }));
  }

  function detectMeter(segs) {
    const starts = segs.map((s) => Math.round(s.t)).filter((b) => b >= 0);
    if (starts.length < 3) return 4;
    const fit = (B) => starts.filter((b) => b % B === 0).length / starts.length;
    const f4 = fit(4), f3 = fit(3);
    return f3 > f4 + 0.15 ? 3 : 4;
  }

  // Krumhansl–Schmuckler key finding on duration-weighted pitch classes
  const MAJ = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
  const MIN = [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];
  function detectKey(events, segs) {
    const h = new Array(12).fill(0);
    events.forEach((e) => { h[e.m % 12] += Math.min(e.d, 4) + 0.25; });
    (segs || []).forEach((s) => { h[s.notes[0] % 12] += 1.5; });
    const corr = (prof, k) => {
      const mx = h.reduce((a, b) => a + b, 0) / 12, mp = prof.reduce((a, b) => a + b, 0) / 12;
      let num = 0, dx = 0, dy = 0;
      for (let i = 0; i < 12; i++) { const x = h[(i + k) % 12] - mx, y = prof[i] - mp; num += x * y; dx += x * x; dy += y * y; }
      return num / Math.sqrt(dx * dy || 1);
    };
    let best = { r: -2 };
    for (let k = 0; k < 12; k++) {
      const rM = corr(MAJ, k), rm = corr(MIN, k);
      if (rM > best.r) best = { r: rM, pc: k, minor: false };
      if (rm > best.r) best = { r: rm, pc: k, minor: true };
    }
    // Charts are written in the major key; a minor result is shown with its relative major for spelling
    const majPc = best.minor ? (best.pc + 3) % 12 : best.pc;
    const key = M.KEYS.find((k) => k.pc === majPc);
    return { key: key.name, pc: majPc, minor: best.minor, label: best.minor ? M.nameOf(best.pc, key.flat) + 'm' : key.name };
  }

  /* ---------------- chord chart ---------------- */

  // segs: chord segments in beats (downbeat at 0). Returns bars: [[chord per beat]]
  function barsFromSegments(segs, beatsPerBar, totalBeats) {
    const starts = [];
    segs.forEach((s) => {
      const b = Math.max(0, Math.round(s.t));
      const prev = starts[starts.length - 1];
      if (prev && prev.b === b) { if (s.d > prev.d) Object.assign(prev, { name: s.name, d: s.d }); return; }
      starts.push({ b, name: s.name || '?', d: s.d });
    });
    const nBars = Math.max(1, Math.ceil(totalBeats / beatsPerBar));
    const bars = [];
    let si = -1;
    for (let bar = 0; bar < nBars; bar++) {
      const slots = [];
      for (let j = 0; j < beatsPerBar; j++) {
        const beat = bar * beatsPerBar + j;
        while (si + 1 < starts.length && starts[si + 1].b <= beat) si++;
        slots.push(si >= 0 ? starts[si].name : 'N.C.');
      }
      bars.push(slots);
    }
    return bars;
  }

  // One bar → "Bb" (whole bar) or "Gm . . Eb" (one slot per beat; "." holds the chord)
  function barText(slots, prevLast) {
    const out = slots.map((c, j) => (j === 0 ? c : c === slots[j - 1] ? '.' : c));
    if (out.slice(1).every((x) => x === '.')) return out[0];
    return out.join(' ');
  }
  function chartText(bars, opts = {}) {
    const perLine = opts.perLine || 4;
    const lines = [(opts.section || 'Verse') + ' :'];
    for (let i = 0; i < bars.length; i += perLine) lines.push('| ' + bars.slice(i, i + perLine).map((b) => barText(b)).join(' | ') + ' |');
    return lines.join('\n');
  }

  // Comping rhythm: the most common pattern of attacks per bar, on an eighth (or sixteenth) grid
  function rhythmPattern(events, beatsPerBar, opts = {}) {
    const sub = opts.sub || 2, split = opts.split || 60;
    const onsets = [];
    const groups = {};
    events.forEach((e) => { if (e.t < -0.01) return; const k = Math.round(e.t * sub); (groups[k] = groups[k] || []).push(e); });
    Object.keys(groups).forEach((k) => { const g = groups[k]; if (g.some((e) => e.m < split) || g.length >= 2) onsets.push(+k); });
    if (onsets.length < 3) return null;
    const per = beatsPerBar * sub, counts = {};
    const maxBar = Math.max(...onsets.map((o) => Math.floor(o / per)));
    for (let bar = 0; bar <= maxBar; bar++) {
      const cells = new Array(per).fill('.');
      onsets.filter((o) => Math.floor(o / per) === bar).forEach((o) => { cells[o % per] = 'x'; });
      const key = cells.join('');
      if (key.replace(/\./g, '').length) counts[key] = (counts[key] || 0) + 1;
    }
    const [grid, n] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || [];
    if (!grid) return null;
    return { grid, sub, bars: maxBar + 1, share: +(n / (maxBar + 1)).toFixed(2), counts: countLabels(beatsPerBar, sub) };
  }
  function countLabels(beatsPerBar, sub) {
    const tail = sub === 4 ? ['e', '&', 'a'] : sub === 3 ? ['&', 'a'] : sub === 2 ? ['&'] : [];
    const out = [];
    for (let b = 1; b <= beatsPerBar; b++) { out.push(String(b)); out.push(...tail); }
    return out;
  }

  /* ---------------- melody ---------------- */

  // Skyline: the highest right-hand line, ignoring inner chord tones under a held melody note
  function melodyLine(events, opts = {}) {
    const split = opts.split || 60;
    const rh = events.filter((e) => e.m >= split);
    const pool = (rh.length >= 3 ? rh : events).slice().sort((a, b) => a.t - b.t || b.m - a.m);
    const groups = [];
    pool.forEach((e) => { const g = groups[groups.length - 1]; if (g && e.t - g.t < 0.12) g.notes.push(e); else groups.push({ t: e.t, notes: [e] }); });
    const line = [];
    groups.forEach((g) => {
      const top = g.notes.reduce((a, b) => (b.m > a.m ? b : a));
      const prev = line[line.length - 1];
      if (prev && prev.t + prev.d > top.t + 0.15 && top.m < prev.m && g.notes.length === 1) return; // inner voice under a held note
      if (prev && prev.t + prev.d > top.t) prev.d = Math.max(0.05, top.t - prev.t);
      line.push({ m: top.m, t: top.t, d: top.d, v: top.v, src: top });
    });
    return line;
  }

  function quantiseMelody(line, opts = {}) {
    if (!line.length) return { notes: [], q: 0.5 };
    const iois = line.slice(1).map((n, i) => n.t - line[i].t).filter((x) => x > 0.05);
    const short = iois.filter((x) => x < 0.375).length / Math.max(1, iois.length);
    const q = opts.q || (short > 0.2 ? 0.25 : 0.5);
    const notes = line.map((n) => ({ m: n.m, t: Math.round(n.t / q) * q, end: Math.round((n.t + n.d) / q) * q }));
    for (let i = 0; i < notes.length; i++) {
      const next = notes[i + 1];
      if (next && next.t <= notes[i].t) { next.t = notes[i].t + q; }
      if (next && notes[i].end > next.t) notes[i].end = next.t;
      if (next && next.t - notes[i].end <= q && next.t - notes[i].end > 0) notes[i].end = next.t; // tiny gaps read as legato
      notes[i].d = Math.max(q, notes[i].end - notes[i].t);
      delete notes[i].end;
    }
    return { notes, q };
  }

  // Lay notes out bar by bar and beat by beat.
  // Returns [{bar, beats:[{tokens:[{m}|{rest}|{hold}], count:'1 &'}]}]; bar index may be -1 for a pickup.
  function melodyGrid(notes, beatsPerBar, q) {
    if (!notes.length) return [];
    const sub = Math.round(1 / q);
    const first = Math.floor(Math.min(...notes.map((n) => n.t)) / beatsPerBar);
    const last = Math.floor((Math.max(...notes.map((n) => n.t + n.d)) - 0.001) / beatsPerBar);
    const bars = [];
    const tail = sub === 4 ? ['e', '&', 'a'] : ['&'];
    for (let bar = first; bar <= last; bar++) {
      const beats = [];
      for (let j = 0; j < beatsPerBar; j++) {
        const b0 = bar * beatsPerBar + j;
        const starts = notes.filter((n) => n.t >= b0 - 1e-6 && n.t < b0 + 1 - 1e-6);
        const soundingAt = (t) => notes.some((n) => n.t < t - 1e-6 && n.t + n.d > t + 1e-6);
        const tokens = [], count = [];
        if (!starts.length) {
          tokens.push(soundingAt(b0 + 0.001) || notes.some((n) => Math.abs(n.t - b0) < 1e-6) ? { hold: true } : { rest: true });
          count.push(String(j + 1));
        } else {
          if (starts[0].t > b0 + 1e-6) { tokens.push(soundingAt(b0 + 0.001) ? { hold: true } : { rest: true }); count.push(String(j + 1)); }
          starts.forEach((n) => {
            tokens.push({ m: n.m, d: n.d, i: notes.indexOf(n) });
            const pos = Math.round((n.t - b0) * sub);
            count.push(pos === 0 ? String(j + 1) : tail[Math.min(tail.length - 1, sub === 4 ? pos - 1 : 0)]);
          });
        }
        beats.push({ tokens, count: count.join(' ') });
      }
      bars.push({ bar, beats });
    }
    // A leading pickup bar: drop the empty beats before the first note
    if (bars.length && bars[0].bar < 0) bars[0].beats = bars[0].beats.slice(bars[0].beats.findIndex((b) => b.tokens.some((t) => t.m != null)));
    return bars;
  }

  // Name one melody note for students: letter + accidental, octave as number / marks / none, or a scale degree / solfa
  const SOLFA = ['Do', 'Di', 'Re', 'Ri', 'Mi', 'Fa', 'Fi', 'Sol', 'Si', 'La', 'Te', 'Ti'];
  const DEG = ['1', '♭2', '2', '♭3', '3', '4', '♯4', '5', '♭6', '6', '♭7', '7'];
  function noteLabel(m, opts = {}) {
    const key = M.KEYS.find((k) => k.name === (opts.key || 'C')) || M.KEYS[0];
    const flat = key.flat || key.pc === 0 && opts.preferFlat;
    const oct = Math.floor(m / 12) - 1;
    if (opts.names === 'degree') return { text: DEG[M.mod(m - key.pc)], oct, octText: opts.octaves === 'none' ? '' : octMark(oct, opts.octaves) };
    if (opts.names === 'solfa') return { text: SOLFA[M.mod(m - key.pc)], oct, octText: opts.octaves === 'none' ? '' : octMark(oct, opts.octaves) };
    const name = M.nameOf(m % 12, flat);
    return { text: M.pretty(name), oct, octText: opts.octaves === 'none' ? '' : octMark(oct, opts.octaves) };
  }
  function octMark(oct, mode) {
    if (mode === 'marks') return oct >= 5 ? "'".repeat(oct - 4) : oct <= 3 ? ','.repeat(4 - oct) : '';
    return String(oct);
  }
  // Plain-text melody, e.g. "| CC A C E |" — beats separated by spaces, notes in one beat joined, "–" held, "·" rest
  function melodyText(grid, opts = {}) {
    const beat = (b) => b.tokens.map((t) => (t.hold ? '–' : t.rest ? '·' : (() => { const l = noteLabel(t.m, opts); return l.text + (opts.octaves === 'number' ? l.octText : l.octText); })())).join('');
    const perLine = opts.perLine || 4;
    const lines = [];
    for (let i = 0; i < grid.length; i += perLine) lines.push('| ' + grid.slice(i, i + perLine).map((bar) => bar.beats.map(beat).join(' ')).join(' | ') + ' |');
    return lines.join('\n');
  }

  /* ---------------- whole take → chart + melody ---------------- */
  // roll: {bpm, events, clicked}. opts: {bpm, beatsPerBar, shift, split, section}
  function transcribe(roll, opts = {}) {
    const recBpm = roll.bpm || 80;
    const events = roll.events || [];
    if (!events.length) return null;
    let bpm, t0, confidence = 1;
    if (opts.bpm) {
      bpm = opts.bpm;
      const est = roll.clicked ? { t0: 0 } : estimateTempo(events, recBpm, { split: opts.split });
      t0 = opts.t0 != null ? opts.t0 : est.t0;
    } else if (roll.clicked) {
      bpm = recBpm;
      const segs0 = U.segmentChords(events, { split: opts.split });
      t0 = segs0.length ? Math.round(segs0[0].t) * 60 / recBpm : 0;
    } else {
      const est = estimateTempo(events, recBpm, { split: opts.split });
      bpm = est.bpm; t0 = est.t0; confidence = est.confidence;
    }
    const P = 60 / bpm;
    t0 += (opts.shift || 0) * P;
    const ev = retime(events, recBpm, bpm, t0);
    const inTime = ev.filter((e) => e.t > -0.3);
    const line = melodyLine(ev, { split: opts.split });
    const segs = U.segmentChords(inTime, { split: opts.split || 60 }).filter((s) => s.name);
    const beatsPerBar = opts.beatsPerBar || detectMeter(segs);
    const key = detectKey(ev, segs);
    const flat = key.pc === 0 ? true : (M.KEYS.find((k) => k.pc === key.pc) || {}).flat;
    // Name each chord from the accompaniment: leave out a melody note sounding on top only when
    // the other notes still make a full chord (otherwise the top note is part of the voicing)
    segs.forEach((s) => {
      const mel = new Set(line.filter((x) => x.t <= s.t + 0.35 && x.t + x.d > s.t + 0.05).map((x) => x.m));
      const acc = s.notes.filter((m) => !mel.has(m));
      const accPcs = new Set(acc.map((m) => m % 12)).size;
      let name = (accPcs >= 3 && U.detectName(acc, flat)) || U.detectName(s.notes, flat) || s.name;
      name = name.replace(/^([A-G][#b]?)5(\/|$)/, '$1$2'); // a bare 5th is written as the plain chord
      s.name = name;
    });
    const end = Math.max(...ev.map((e) => e.t + e.d));
    const bars = barsFromSegments(segs, beatsPerBar, Math.ceil(end - 0.25));
    const rhythm = rhythmPattern(ev, beatsPerBar, { split: opts.split });
    const mel = quantiseMelody(line, {});
    return {
      bpm, beatsPerBar, key: key.key, keyLabel: key.label, t0, confidence,
      text: chartText(bars, { section: opts.section || 'Verse' }),
      bars, rhythm, melody: mel.notes.length >= 3 ? { notes: mel.notes, q: mel.q } : null
    };
  }

  /* ---------------- reading and writing chart text ---------------- */
  const isHold = (t) => t === '.' || t === '/' || t === '-';
  // Parse "Verse :" headers, "| Bb | F . . Eb |" bar lines (optional "x2" at the end), and free text lines
  function parseChart(text, beatsPerBar = 4) {
    const sections = [];
    let cur = null;
    const ensure = () => { if (!cur) { cur = { name: '', lines: [] }; sections.push(cur); } };
    const bad = new Set();
    (text || '').split('\n').forEach((raw) => {
      const line = raw.trim();
      if (!line) return;
      const head = /^([^|]+?)\s*:\s*$/.exec(line);
      if (head && !line.includes('|')) { cur = { name: head[1].trim(), lines: [] }; sections.push(cur); return; }
      ensure();
      if (!line.includes('|')) { cur.lines.push({ text: line }); return; }
      const rep = /\s[x×](\d+)\s*$/i.exec(line);
      const body = rep ? line.slice(0, rep.index) : line;
      const cells = body.split('|').map((c) => c.trim());
      if (cells[0] === '') cells.shift();
      if (cells.length && cells[cells.length - 1] === '') cells.pop();
      const bars = [];
      cells.forEach((cell) => {
        let toks = cell.split(/\s+/).filter(Boolean);
        if (toks.length === 1 && toks[0] === '%' && bars.length) { bars.push({ slots: bars[bars.length - 1].slots.slice(), repeat: true }); return; }
        if (!toks.length) toks = ['.'];
        const slots = [];
        const each = toks.length === 1 ? beatsPerBar : beatsPerBar / toks.length;
        toks.forEach((t) => {
          if (!isHold(t) && t !== 'N.C.' && !M.parseChord(t)) bad.add(t);
          const n = Math.max(1, Math.round(each));
          for (let i = 0; i < n; i++) slots.push(i === 0 ? t : '.');
        });
        bars.push({ slots: slots.slice(0, Math.max(beatsPerBar, slots.length)), raw: cell });
      });
      cur.lines.push({ bars, times: rep ? +rep[1] : 1 });
    });
    return { sections, unknown: Array.from(bad) };
  }
  // The sounding chord on every beat of every bar, in order (for playback)
  function chartTimeline(parsed) {
    const out = [];
    let last = null, barNo = 0;
    parsed.sections.forEach((s, si) => s.lines.forEach((l, li) => {
      if (!l.bars) return;
      for (let r = 0; r < l.times; r++) l.bars.forEach((b, bi) => {
        b.slots.forEach((t, j) => {
          const chord = isHold(t) ? last : t === 'N.C.' ? null : t;
          const isNew = !isHold(t);
          last = chord;
          out.push({ chord, isNew, bar: barNo, ref: si + ':' + li + ':' + bi, beat: j });
        });
        barNo++;
      });
    }));
    return out;
  }
  // Apply fn to every chord token in bar lines, leaving section names and free text alone
  function mapChartChords(text, fn) {
    return (text || '').split('\n').map((line) => {
      if (!line.includes('|')) return line;
      return line.replace(/(^|[\s|])([A-G][#b]?[^\s|]*)/g, (m, pre, tok) => (M.parseChord(tok) ? pre + fn(tok) : m));
    }).join('\n');
  }

  window.Transcribe = {
    estimateTempo, retime, detectMeter, detectKey, barsFromSegments, barText, chartText, rhythmPattern, countLabels,
    melodyLine, quantiseMelody, melodyGrid, noteLabel, melodyText, transcribe, parseChart, chartTimeline, mapChartChords, isHold
  };
})();
