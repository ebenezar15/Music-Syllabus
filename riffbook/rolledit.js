/* Riffbook piano-roll editor: draw, move, resize, erase, hand assignment, quantise, transpose, undo, playback.
   RollEditor.open({ title, events, bpm, beats, downbeat, split, actions: [{ label, primary, run(events) }], onSave(events) }) */
(function () {
  const M = window.Music, U = window.MusicUI;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = U.esc;
  const WHITE = [0, 2, 4, 5, 7, 9, 11];
  const ROW = 14, GUT = 46, RUL = 18; // RUL: the ruler strip on top where the marker is set

  function open(cfg) {
    const ov = document.getElementById('roll-editor') || Object.assign(document.createElement('div'), { id: 'roll-editor', className: 'overlay roll-ed-ov' });
    if (!ov.parentNode) document.body.appendChild(ov);
    const split = cfg.split || 60;
    const st = {
      notes: (cfg.events || []).map((e, k) => ({ id: k + 1, m: e.m, t: e.t, d: e.d, v: e.v || 90, h: e.h || (e.m < split ? 'L' : 'R') })),
      nextId: (cfg.events || []).length + 1, sel: new Set(), tool: 'select', snap: 0.25, len: 1, hand: 'auto',
      ppb: 56, undo: [], redo: [], dirty: false, speed: 1, loop: false, click: false, playing: null, playStart: 0, cursor: 0, recMode: 'replace'
    };
    const bpm = cfg.bpm || 80, beats = cfg.beats || 4, downbeat = cfg.downbeat || 0;
    const snapT = (t) => (st.snap ? Math.round(t / st.snap) * st.snap : t);
    const snapFloor = (t) => (st.snap ? Math.floor(t / st.snap + 1e-6) * st.snap : t);
    const range = () => {
      if (st.frozen) return st.frozen; // the view stays still while a drag is in progress
      const ms = st.notes.map((n) => n.m);
      let lo = ms.length ? Math.min(...ms) - 4 : 48, hi = ms.length ? Math.max(...ms) + 4 : 76;
      if (hi - lo < 28) { const c = Math.round((hi + lo) / 2); lo = c - 14; hi = c + 14; }
      return { lo: Math.max(21, lo), hi: Math.min(108, hi) };
    };
    const lengthBeats = () => Math.max(beats * 4, Math.ceil((Math.max(0, ...st.notes.map((n) => n.t + n.d)) + beats * 2) / beats) * beats);
    const snapshot = () => JSON.stringify(st.notes);
    const push = () => { st.undo.push(snapshot()); if (st.undo.length > 100) st.undo.shift(); st.redo = []; st.dirty = true; };
    const restore = (s) => { st.notes = JSON.parse(s); st.sel.clear(); draw(); };
    const label = (m) => U.noteName(m, false);

    ov.innerHTML = `<div class="re">
      <div class="re-top">
        <div><div class="small muted">Piano-roll editor</div><h2 style="margin:0">${esc(cfg.title || 'Take')}</h2></div>
        <div class="row" style="gap:6px">${(cfg.actions || []).map((a, k) => `<button class="btn ${a.primary ? 'primary' : ''}" data-act="${k}">${esc(a.label)}</button>`).join('')}
          <button class="btn primary" id="re-save">Save</button><button class="btn ghost" id="re-cancel">Cancel</button></div>
      </div>
      <div class="re-tools row small">
        <span class="seg" role="group" aria-label="Tool"><button data-tool="select" title="Select, move (drag) and resize (drag the right edge) — V">↖ Select</button><button data-tool="draw" title="Click to add a note, drag to set its length — D">✎ Draw</button><button data-tool="erase" title="Click notes to delete them — E">⌫ Erase</button></span>
        <label>Snap <select id="re-snap"><option value="1">1/4</option><option value="0.5">1/8</option><option value="0.25" selected>1/16</option><option value="0.3333">1/8 triplet</option><option value="0">Off</option></select></label>
        <label>New note <select id="re-len"><option value="0.25">1/16</option><option value="0.5">1/8</option><option value="1" selected>1/4</option><option value="2">1/2</option><option value="4">Whole</option></select></label>
        <label>Hand <select id="re-hand"><option value="auto">By split (${esc(label(split))})</option><option value="R">Right</option><option value="L">Left</option></select></label>
        <span class="re-sep"></span>
        <button class="btn sm ghost" id="re-toR" title="Make the selected notes right hand">→ <span class="hand-dot rh"></span>RH</button><button class="btn sm ghost" id="re-toL" title="Make the selected notes left hand">→ <span class="hand-dot lh"></span>LH</button>
        <button class="btn sm ghost" id="re-q" title="Snap selected notes (or all) to the grid — Q">Quantise</button>
        <button class="btn sm ghost" id="re-up" title="Up a semitone — ↑ (Shift+↑ octave)">▲</button><button class="btn sm ghost" id="re-down" title="Down a semitone — ↓">▼</button>
        <button class="btn sm ghost" id="re-del" title="Delete selected — Delete">Delete</button>
        <span class="re-sep"></span>
        <button class="btn sm ghost" id="re-undo" title="Undo — Ctrl/Cmd+Z">↶</button><button class="btn sm ghost" id="re-redo" title="Redo — Ctrl/Cmd+Shift+Z">↷</button>
        <button class="btn sm ghost" id="re-zo" title="Zoom out">−</button><button class="btn sm ghost" id="re-zi" title="Zoom in">+</button>
      </div>
      <div class="re-tools row small">
        <button class="btn sm ghost" id="re-home" title="Marker back to the start — Home">⏮</button>
        <button class="btn sm primary" id="re-play" title="Play from the marker — Space. Click the ruler (or an empty spot) to move the marker">▶ Play</button>
        ${cfg.input ? `<button class="btn sm rec-btn" id="re-rec" title="Record from the marker with a one-bar lead-in — R">● Record</button>
        <select id="re-recmode" aria-label="Recording mode" title="Retake replaces what you play over (only the chosen hand if Hand is set); Add keeps the old notes"><option value="replace">Retake (replace)</option><option value="add">Add (overdub)</option></select>` : ''}
        <span class="small muted" id="re-pos"></span>
        <label>Speed <select id="re-speed"><option value="0.5">50%</option><option value="0.75">75%</option><option value="1" selected>100%</option></select></label>
        <label><input type="checkbox" id="re-loop"> Loop</label><label><input type="checkbox" id="re-click"> Click</label>
        <span class="muted" id="re-info"></span>
      </div>
      <div class="re-canvas" id="re-canvas" tabindex="0" aria-label="Piano roll — notes can be edited with the mouse and keyboard"></div>
      <div class="small muted re-help">Click the ruler or an empty spot to move the ▼ marker — Play and Record start there. Drag notes to move them, drag a note's right edge to change its length, drag on empty space to select several. Keys: Delete removes, ↑↓ moves by a semitone (Shift = octave), ←→ moves by the snap, Ctrl/Cmd+A selects all, Space plays. ${downbeat ? 'The grey area before bar 1 is the pickup.' : ''}</div>
    </div>`;
    ov.hidden = false;
    const canvas = $('#re-canvas', ov);

    function draw() {
      const { lo, hi } = range(), L = lengthBeats(), W = GUT + L * st.ppb, H = (hi - lo + 1) * ROW;
      let g = '', ruler = `<rect class="re-ruler" x="${GUT}" y="0" width="${L * st.ppb}" height="${RUL}" fill="var(--surface-2)"/>`;
      for (let m = lo; m <= hi; m++) {
        const y = (hi - m) * ROW, black = !WHITE.includes(m % 12);
        g += `<rect x="${GUT}" y="${y}" width="${L * st.ppb}" height="${ROW}" fill="${black ? 'var(--surface-2)' : 'var(--surface)'}"/>`;
        g += `<rect class="re-key" data-key="${m}" x="0" y="${y}" width="${GUT - 2}" height="${ROW}" fill="${black ? 'var(--key-black)' : 'var(--key-white)'}" stroke="var(--line)"/>`;
        if (m % 12 === 0) g += `<text x="4" y="${y + ROW - 3}" font-size="10" fill="#555" pointer-events="none">C${Math.floor(m / 12) - 1}</text><line x1="${GUT}" x2="${W}" y1="${y + ROW}" y2="${y + ROW}" stroke="var(--line)"/>`;
        if (m === split) g += `<line x1="${GUT}" x2="${W}" y1="${y + ROW}" y2="${y + ROW}" stroke="var(--muted)" stroke-dasharray="4 4" opacity=".6"/>`;
      }
      if (downbeat) g += `<rect x="${GUT}" y="0" width="${downbeat * st.ppb}" height="${H}" fill="var(--muted)" opacity=".08"/>`;
      const sub = st.snap || 1;
      for (let x = 0; x <= L + 1e-6; x += sub) {
        const beat = x - downbeat, isBar = Math.abs(beat / beats - Math.round(beat / beats)) < 1e-6, isBeat = Math.abs(x - Math.round(x)) < 1e-6;
        g += `<line x1="${GUT + x * st.ppb}" x2="${GUT + x * st.ppb}" y1="0" y2="${H}" stroke="var(--line)" stroke-width="${isBar ? 1.6 : isBeat ? 0.8 : 0.35}" opacity="${isBar || isBeat ? 1 : 0.7}"/>`;
        if (isBar && beat >= 0) ruler += `<text x="${GUT + x * st.ppb + 3}" y="13" font-size="10" fill="var(--muted)" pointer-events="none">${Math.round(beat / beats) + 1}</text>`;
        if (isBeat) ruler += `<line x1="${GUT + x * st.ppb}" x2="${GUT + x * st.ppb}" y1="${isBar ? 0 : RUL - 5}" y2="${RUL}" stroke="var(--line)" pointer-events="none"/>`;
      }
      (rec ? rec.out : []).forEach((n) => { g += `<rect x="${GUT + n.t * st.ppb}" y="${(hi - n.m) * ROW + 1}" width="${Math.max(4, n.d * st.ppb - 1)}" height="${ROW - 2}" rx="3" fill="var(--accent-2)" opacity=".75"/>`; });
      st.notes.forEach((n) => {
        const x = GUT + n.t * st.ppb, y = (hi - n.m) * ROW, w = Math.max(4, n.d * st.ppb - 1), sel = st.sel.has(n.id);
        g += `<g class="re-note ${sel ? 'sel' : ''}" data-id="${n.id}"><rect x="${x + 0.5}" y="${y + 1}" width="${w}" height="${ROW - 2}" rx="3" fill="${n.h === 'L' ? 'var(--lh, var(--s))' : 'var(--rh, var(--accent))'}" stroke="${sel ? 'var(--text)' : 'rgba(0,0,0,.25)'}" stroke-width="${sel ? 2 : 1}"/>${w > 26 ? `<text x="${x + 4}" y="${y + ROW - 4}" font-size="9" fill="#fff" pointer-events="none">${esc(label(n.m))}</text>` : ''}<rect class="re-edge" x="${x + w - 5}" y="${y + 1}" width="6" height="${ROW - 2}" fill="transparent"/></g>`;
      });
      g += `<rect id="re-marq" fill="var(--accent)" opacity=".12" stroke="var(--accent)" width="0" height="0"/>`;
      const cx = GUT + st.cursor * st.ppb;
      const top = `<g id="re-cur" transform="translate(${cx},0)" pointer-events="none"><path d="M-6 0 L6 0 L0 9 Z" fill="var(--accent)"/><line x1="0" x2="0" y1="0" y2="${H + RUL}" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="5 4"/></g>
        <line id="re-ph" x1="${GUT}" x2="${GUT}" y1="0" y2="${H + RUL}" stroke="var(--accent-2)" stroke-width="2" opacity="0" pointer-events="none"/>`;
      const keepX = canvas.scrollLeft, keepY = canvas.scrollTop;
      canvas.innerHTML = `<svg class="re-svg" width="${W}" height="${H + RUL}" viewBox="0 0 ${W} ${H + RUL}">${ruler}<g transform="translate(0,${RUL})">${g}</g>${top}</svg>`;
      showPos();
      canvas.scrollLeft = keepX; canvas.scrollTop = keepY;
      $$('[data-tool]', ov).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tool === st.tool)));
      canvas.dataset.tool = st.tool;
      const nR = st.notes.filter((n) => n.h === 'R').length;
      $('#re-info', ov).textContent = `${st.notes.length} notes (${nR} right hand, ${st.notes.length - nR} left) · ${bpm} bpm · ${beats === 6 || beats === 12 ? beats + '/8' : beats + '/4'}${st.sel.size ? ` · ${st.sel.size} selected` : ''}`;
      $('#re-undo', ov).disabled = !st.undo.length; $('#re-redo', ov).disabled = !st.redo.length;
    }
    const barBeat = (t) => { const b = t - downbeat, bar = Math.floor(b / beats + 1e-6); return `bar ${bar + 1}, beat ${+(b - bar * beats + 1).toFixed(2)}`; };
    function showPos() { const el = $('#re-pos', ov); if (el) el.textContent = `▼ ${barBeat(st.cursor)}`; }
    function setCursor(t, keepPlaying = true) {
      st.cursor = Math.max(0, +snapFloor(t).toFixed(4));
      const c = $('#re-cur', canvas); if (c) c.setAttribute('transform', `translate(${GUT + st.cursor * st.ppb},0)`);
      showPos();
      if (keepPlaying && st.playing) { stop(); play(); }
    }
    function scrollToNotes() {
      const { hi } = range();
      if (!st.notes.length) return;
      const top = Math.max(...st.notes.map((n) => n.m));
      canvas.scrollTop = Math.max(0, (hi - top - 3) * ROW);
    }

    // ---------- pointer editing ----------
    const pos = (ev) => { const r = canvas.querySelector('svg').getBoundingClientRect(); const { hi } = range(); const x = ev.clientX - r.left, y = ev.clientY - r.top - RUL; return { x, y, t: (x - GUT) / st.ppb, m: hi - Math.floor(y / ROW) }; };
    let drag = null;
    canvas.addEventListener('pointerdown', (ev) => {
      if (ev.button !== 0) return;
      canvas.focus();
      const keyEl = ev.target.closest('.re-key');
      if (keyEl) { M.tone(+keyEl.dataset.key, 0, 0.7); return; }
      const p = pos(ev);
      if (p.x < GUT) return;
      if (p.y < 0) { setCursor(p.t); drag = { mode: 'cursor' }; canvas.setPointerCapture(ev.pointerId); return; }
      if (rec) return; // no editing while recording
      const g = ev.target.closest('.re-note');
      const note = g && st.notes.find((n) => n.id === +g.dataset.id);
      if (st.tool === 'erase') { if (note) { push(); st.notes = st.notes.filter((n) => n !== note); st.sel.delete(note.id); draw(); } drag = { erase: true }; canvas.setPointerCapture(ev.pointerId); return; }
      if (note) {
        if (!st.sel.has(note.id)) { if (!ev.shiftKey) st.sel.clear(); st.sel.add(note.id); } else if (ev.shiftKey) { st.sel.delete(note.id); draw(); return; }
        M.tone(note.m, 0, 0.5, { vel: 0.18 });
        const edge = ev.target.classList.contains('re-edge');
        drag = { mode: edge ? 'resize' : 'move', start: p, orig: st.notes.filter((n) => st.sel.has(n.id)).map((n) => ({ ...n })), pushed: false };
      } else if (st.tool === 'draw') {
        push();
        const t = Math.max(0, snapFloor(p.t)), hand = st.hand === 'auto' ? (p.m < split ? 'L' : 'R') : st.hand;
        const n = { id: st.nextId++, m: p.m, t: +t.toFixed(4), d: st.len, v: 90, h: hand };
        st.notes.push(n); st.sel = new Set([n.id]);
        M.tone(n.m, 0, 0.5, { vel: 0.18 });
        drag = { mode: 'resize', start: p, orig: [{ ...n }], pushed: true };
      } else {
        if (!ev.shiftKey) st.sel.clear();
        drag = { mode: 'marquee', start: p };
      }
      st.frozen = range();
      canvas.setPointerCapture(ev.pointerId);
      draw();
    });
    canvas.addEventListener('pointermove', (ev) => {
      if (!drag) return;
      const p = pos(ev);
      if (drag.mode === 'cursor') { setCursor(p.t, false); return; }
      if (drag.erase) { const g = document.elementFromPoint(ev.clientX, ev.clientY); const el = g && g.closest && g.closest('.re-note'); if (el) { const id = +el.dataset.id; st.notes = st.notes.filter((n) => n.id !== id); draw(); } return; }
      if (drag.mode === 'marquee') {
        const x0 = Math.min(drag.start.x, p.x), y0 = Math.min(drag.start.y, p.y), w = Math.abs(p.x - drag.start.x), h = Math.abs(p.y - drag.start.y);
        const mq = $('#re-marq', canvas); mq.setAttribute('x', x0); mq.setAttribute('y', y0); mq.setAttribute('width', w); mq.setAttribute('height', h);
        const { hi } = range();
        st.notes.forEach((n) => { const nx = GUT + n.t * st.ppb, ny = (hi - n.m) * ROW; const inside = nx + n.d * st.ppb > x0 && nx < x0 + w && ny + ROW > y0 && ny < y0 + h; if (inside) st.sel.add(n.id); });
        return;
      }
      const dt = p.t - drag.start.t, dm = p.m - drag.start.m;
      if (!drag.pushed && (Math.abs(dt) * st.ppb > 3 || dm)) { push(); drag.pushed = true; }
      if (!drag.pushed) return;
      drag.orig.forEach((o) => {
        const n = st.notes.find((x) => x.id === o.id); if (!n) return;
        if (drag.mode === 'move') { n.t = +Math.max(0, snapT(o.t + dt)).toFixed(4); n.m = Math.max(21, Math.min(108, o.m + dm)); }
        else n.d = +Math.max(st.snap || 0.05, snapT(o.d + dt) || st.snap || 0.05).toFixed(4);
      });
      draw();
    });
    const endDrag = (ev) => {
      if (drag && drag.mode === 'cursor') { drag = null; if (st.playing) { stop(); play(); } return; }
      if (drag && drag.mode === 'marquee' && ev && ev.clientX != null) { const p = pos(ev); if (Math.abs(p.x - drag.start.x) < 4 && Math.abs(p.y - drag.start.y) < 4) setCursor(p.t); }
      if (drag && drag.mode === 'move' && drag.pushed) { const moved = st.notes.find((n) => st.sel.has(n.id)); if (moved) M.tone(moved.m, 0, 0.4, { vel: 0.15 }); }
      drag = null; st.frozen = null; draw();
    };
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);

    // ---------- commands ----------
    const selected = () => st.notes.filter((n) => st.sel.has(n.id));
    const targets = () => (st.sel.size ? selected() : st.notes);
    const cmd = {
      del() { if (!st.sel.size) return; push(); st.notes = st.notes.filter((n) => !st.sel.has(n.id)); st.sel.clear(); draw(); },
      shift(dm) { if (!st.sel.size) return; push(); selected().forEach((n) => { n.m = Math.max(21, Math.min(108, n.m + dm)); }); draw(); const f = selected()[0]; if (f) M.tone(f.m, 0, 0.4, { vel: 0.15 }); },
      move(dt) { if (!st.sel.size) return; push(); selected().forEach((n) => { n.t = +Math.max(0, n.t + dt).toFixed(4); }); draw(); },
      hand(h) { if (!st.sel.size) { toastLocal('Select some notes first'); return; } push(); selected().forEach((n) => { n.h = h; }); draw(); },
      quantise() { const q = st.snap || 0.25; push(); targets().forEach((n) => { n.t = +(Math.round(n.t / q) * q).toFixed(4); n.d = +Math.max(q, Math.round(n.d / q) * q).toFixed(4); }); draw(); toastLocal(`Quantised ${st.sel.size ? 'selected notes' : 'all notes'} to the grid`); },
      undo() { if (!st.undo.length) return; st.redo.push(snapshot()); restore(st.undo.pop()); },
      redo() { if (!st.redo.length) return; st.undo.push(snapshot()); restore(st.redo.pop()); },
      zoom(f) { st.ppb = Math.max(18, Math.min(160, Math.round(st.ppb * f))); draw(); }
    };
    function toastLocal(msg) { const t = document.getElementById('toast'); if (t) { t.textContent = msg; t.classList.add('show'); clearTimeout(toastLocal.t); toastLocal.t = setTimeout(() => t.classList.remove('show'), 1600); } }
    $$('[data-tool]', ov).forEach((b) => b.onclick = () => { st.tool = b.dataset.tool; draw(); });
    $('#re-snap', ov).onchange = (e) => { st.snap = +e.target.value; draw(); };
    $('#re-len', ov).onchange = (e) => { st.len = +e.target.value; };
    $('#re-hand', ov).onchange = (e) => { st.hand = e.target.value; };
    $('#re-toR', ov).onclick = () => cmd.hand('R');
    $('#re-toL', ov).onclick = () => cmd.hand('L');
    $('#re-q', ov).onclick = cmd.quantise;
    $('#re-up', ov).onclick = () => cmd.shift(1);
    $('#re-down', ov).onclick = () => cmd.shift(-1);
    $('#re-del', ov).onclick = cmd.del;
    $('#re-undo', ov).onclick = cmd.undo;
    $('#re-redo', ov).onclick = cmd.redo;
    $('#re-zi', ov).onclick = () => cmd.zoom(1.3);
    $('#re-zo', ov).onclick = () => cmd.zoom(1 / 1.3);
    $('#re-speed', ov).onchange = (e) => { st.speed = +e.target.value; };
    $('#re-loop', ov).onchange = (e) => { st.loop = e.target.checked; };
    $('#re-click', ov).onchange = (e) => { st.click = e.target.checked; };

    // ---------- playback ----------
    let timers = [], raf = null;
    function stop() { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); M.stopAll(); st.playing = null; const ph = $('#re-ph', canvas); if (ph) ph.setAttribute('opacity', '0'); const b = $('#re-play', ov); if (b) b.textContent = '▶ Play'; }
    function play() {
      if (st.playing) { stop(); return; }
      if (!st.notes.length) return;
      const c = M.audio(), spb = 60 / bpm / st.speed, t0 = c.currentTime + 0.1;
      const from = st.cursor;
      const end = Math.max(...st.notes.map((n) => n.t + n.d));
      if (from >= end) { setCursor(0, false); return play(); }
      st.notes.filter((n) => n.t + n.d > from).forEach((n) => M.tone(n.m, t0 + Math.max(0, n.t - from) * spb, Math.max(0.08, (n.t + n.d - Math.max(n.t, from)) * spb * 0.97), { vel: 0.1 + (n.v || 90) / 700 }));
      if (st.click) for (let b = Math.ceil(from); b < end; b++) M.click(t0 + (b - from) * spb, U.accentOf(M.mod(b - downbeat, beats), beats));
      st.playing = { t0, from, spb, end };
      $('#re-play', ov).textContent = '■ Stop';
      const ph = $('#re-ph', canvas); ph.setAttribute('opacity', '1');
      const tick = () => {
        if (!st.playing) return;
        const beat = from + (M.audio().currentTime - t0) / spb;
        if (beat > end + 0.25) { stop(); if (st.loop) play(); return; }
        const x = GUT + Math.max(from, beat) * st.ppb, p2 = $('#re-ph', canvas);
        if (p2) { p2.setAttribute('x1', x); p2.setAttribute('x2', x); }
        if (x > canvas.scrollLeft + canvas.clientWidth - 60) canvas.scrollLeft = x - 80;
        raf = requestAnimationFrame(tick);
      };
      tick();
    }
    $('#re-play', ov).onclick = () => (rec ? recStop() : play());
    $('#re-home', ov).onclick = () => { setCursor(0); canvas.scrollLeft = 0; };

    // ---------- recording / retakes from the marker ----------
    let rec = null;
    function recStart() {
      if (rec) return recStop();
      if (st.playing) stop();
      cfg.input.ensure && cfg.input.ensure();
      const c = M.audio(); if (!c) return;
      const spb = 60 / bpm / st.speed, pre = beats, from = st.cursor, startBeat = from - pre;
      const t0 = c.currentTime + 0.12, tm = t0 + pre * spb;
      // lead-in: one bar of clicks, and you hear what comes before the marker (and after it when adding)
      for (let k = 0; k < pre; k++) M.click(t0 + k * spb, U.accentOf(M.mod(Math.round(startBeat + k - downbeat), beats), beats));
      st.notes.filter((n) => n.t + n.d > startBeat && (st.recMode === 'add' || n.t < from)).forEach((n) => {
        const s0 = Math.max(n.t, startBeat), e0 = st.recMode === 'add' ? n.t + n.d : Math.min(n.t + n.d, from);
        if (e0 > s0) M.tone(n.m, t0 + (s0 - startBeat) * spb, Math.max(0.06, (e0 - s0) * spb * 0.97), { vel: 0.08 + (n.v || 90) / 900 });
      });
      if (st.click) for (let b = Math.ceil(from); b < from + 400; b++) M.click(tm + (b - from) * spb, U.accentOf(M.mod(b - downbeat, beats), beats));
      const beatAt = () => from + (M.audio().currentTime - tm) / spb;
      rec = { from, tm, spb, out: [], active: new Map(), pedal: false, held: new Set(), beatAt };
      const end = (m) => { const a = rec.active.get(m); if (!a) return; rec.active.delete(m); rec.held.delete(m); rec.out.push({ m, t: +Math.max(0, a.t).toFixed(4), d: +Math.max(0.05, beatAt() - a.t).toFixed(4), v: a.v }); draw(); };
      rec.end = end;
      rec.unlisten = cfg.input.listen({
        on: (m, v) => { if (!rec) return; if (rec.active.has(m)) end(m); rec.active.set(m, { t: beatAt(), v: v || 90 }); },
        off: (m) => { if (!rec || !rec.active.has(m)) return; if (rec.pedal) rec.held.add(m); else end(m); },
        pedal: (d) => { if (!rec) return; rec.pedal = d; if (!d) Array.from(rec.held).forEach(end); }
      });
      const b = $('#re-rec', ov); b.textContent = '■ Stop recording'; b.classList.add('on');
      $('#re-play', ov).textContent = '■ Stop';
      const ph = $('#re-ph', canvas); if (ph) ph.setAttribute('opacity', '1');
      const tick = () => {
        if (!rec) return;
        const beat = startBeat + (M.audio().currentTime - t0) / spb, x = GUT + Math.max(0, beat) * st.ppb, p2 = $('#re-ph', canvas);
        if (p2) { p2.setAttribute('x1', x); p2.setAttribute('x2', x); p2.setAttribute('stroke', beat < from ? 'var(--muted)' : 'var(--rec, #e5484d)'); p2.setAttribute('opacity', '1'); }
        if (x > canvas.scrollLeft + canvas.clientWidth - 60) canvas.scrollLeft = x - 80;
        raf = requestAnimationFrame(tick);
      };
      tick();
      toastLocal(`Recording from ${barBeat(from)} after one bar — ${st.recMode === 'add' ? 'adding to' : 'replacing'} ${st.hand === 'auto' ? 'the notes' : st.hand === 'R' ? 'the right hand' : 'the left hand'}`);
    }
    function recStop() {
      if (!rec) return;
      const r = rec;
      Array.from(r.active.keys()).forEach(r.end);
      const stopBeat = Math.max(r.beatAt(), ...r.out.map((n) => n.t + n.d));
      r.unlisten && r.unlisten();
      rec = null;
      stop();
      const b = $('#re-rec', ov); if (b) { b.textContent = '● Record'; b.classList.remove('on'); }
      const kept = r.out.filter((n) => n.t + n.d > r.from - 0.5); // ignore warm-up notes long before the marker
      if (!kept.length) { draw(); toastLocal('Nothing recorded'); return; }
      push();
      const handOf = (m) => (st.hand === 'auto' ? (m < split ? 'L' : 'R') : st.hand);
      if (st.recMode === 'replace') {
        const lo = Math.min(r.from, ...kept.map((n) => n.t));
        st.notes = st.notes.filter((n) => !(n.t >= lo - 1e-6 && n.t < stopBeat && (st.hand === 'auto' || n.h === st.hand)));
      }
      const added = kept.map((n) => ({ id: st.nextId++, m: n.m, t: n.t, d: n.d, v: n.v, h: handOf(n.m) }));
      st.notes.push(...added);
      st.sel = new Set(added.map((n) => n.id));
      draw();
      toastLocal(`${added.length} notes recorded — they are selected (Q quantises them, Ctrl/Cmd+Z undoes the take)`);
    }
    if (cfg.input) {
      $('#re-rec', ov).onclick = recStart;
      $('#re-recmode', ov).onchange = (e) => { st.recMode = e.target.value; };
    }

    // ---------- keyboard ----------
    const onKey = (ev) => {
      if (ov.hidden) return;
      if (/INPUT|SELECT|TEXTAREA/.test(ev.target.tagName)) return;
      const k = ev.key, mod = ev.metaKey || ev.ctrlKey;
      if (rec) { if (k === ' ' || k === 'Escape' || k.toLowerCase() === 'r') { ev.preventDefault(); ev.stopPropagation(); recStop(); } return; } // other keys may be notes on the computer keyboard
      if (k === 'Home' || k === 'Enter') { ev.preventDefault(); setCursor(0); canvas.scrollLeft = 0; return; }
      if (k.toLowerCase() === 'r' && !mod && cfg.input) { ev.preventDefault(); recStart(); return; }
      if (mod && k.toLowerCase() === 'z') { ev.preventDefault(); ev.shiftKey ? cmd.redo() : cmd.undo(); return; }
      if (mod && k.toLowerCase() === 'y') { ev.preventDefault(); cmd.redo(); return; }
      if (mod && k.toLowerCase() === 'a') { ev.preventDefault(); st.sel = new Set(st.notes.map((n) => n.id)); draw(); return; }
      if (mod) return;
      if (k === 'Delete' || k === 'Backspace') { ev.preventDefault(); cmd.del(); }
      else if (k === 'ArrowUp') { ev.preventDefault(); cmd.shift(ev.shiftKey ? 12 : 1); }
      else if (k === 'ArrowDown') { ev.preventDefault(); cmd.shift(ev.shiftKey ? -12 : -1); }
      else if (k === 'ArrowLeft') { ev.preventDefault(); cmd.move(-(st.snap || 0.25)); }
      else if (k === 'ArrowRight') { ev.preventDefault(); cmd.move(st.snap || 0.25); }
      else if (k === ' ') { ev.preventDefault(); play(); }
      else if (k === 'Escape') { ev.preventDefault(); ev.stopPropagation(); if (st.sel.size) { st.sel.clear(); draw(); } else cancel(); }
      else if (k.toLowerCase() === 'v') { st.tool = 'select'; draw(); }
      else if (k.toLowerCase() === 'd') { st.tool = 'draw'; draw(); }
      else if (k.toLowerCase() === 'e') { st.tool = 'erase'; draw(); }
      else if (k.toLowerCase() === 'q') cmd.quantise();
    };
    document.addEventListener('keydown', onKey, true);

    // ---------- save / cancel ----------
    const result = () => st.notes.slice().sort((a, b) => a.t - b.t || a.m - b.m).map((n) => ({ m: n.m, t: +n.t.toFixed(3), d: +n.d.toFixed(3), v: n.v, h: n.h }));
    function close() { recStop(); stop(); document.removeEventListener('keydown', onKey, true); ov.hidden = true; ov.innerHTML = ''; if (cfg.onClose) cfg.onClose(); }
    let armedCancel = false;
    function cancel() {
      if (st.dirty && !armedCancel) { armedCancel = true; const b = $('#re-cancel', ov); b.textContent = 'Discard changes?'; setTimeout(() => { armedCancel = false; if (b.isConnected) b.textContent = 'Cancel'; }, 2500); return; }
      close();
    }
    $('#re-cancel', ov).onclick = cancel;
    $('#re-save', ov).onclick = () => { recStop(); const ev = result(); close(); cfg.onSave && cfg.onSave(ev); };
    $$('[data-act]', ov).forEach((b) => b.onclick = () => { recStop(); const ev = result(); const a = cfg.actions[+b.dataset.act]; close(); cfg.onSave && cfg.onSave(ev); a.run(ev); });

    draw(); scrollToNotes();
    if (!st.notes.length) { st.tool = 'draw'; draw(); }
    canvas.focus();
    return { close };
  }

  window.RollEditor = { open };
})();
