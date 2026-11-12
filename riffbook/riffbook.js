/* Riffbook — a personal notebook for improvisations, chord movements and hand placements */
(function () {
  const M = window.Music, U = window.MusicUI;
  const { esc } = U;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const DAY = 864e5;
  const embedded = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
  if (embedded) document.documentElement.classList.add('embedded');

  const TYPES = {
    improv: { label: 'Improvisation', icon: '✦' },
    movement: { label: 'Chord movement', icon: '⇄' },
    placement: { label: 'Placement', icon: '✋' },
    lick: { label: 'Lick / run', icon: '〰' },
    idea: { label: 'Idea', icon: '💡' },
    song: { label: 'Song arrangement', icon: '♫' }
  };
  const STATUS = { idea: 'New idea', practising: 'Practising', ready: 'Ready to use', mastered: 'Mastered' };
  const MOODS = { '': 'Note', idea: '💡 Idea', works: '✅ Works', tricky: '⚠️ Tricky', love: '❤️ Love it', question: '❓ Question' };
  const THEMES = [['midnight', 'Midnight Keys', '#0e1424', '#f5c451'], ['sunrise', 'Sunrise', '#e8664a', '#f2a541'], ['ocean', 'Ocean', '#0e8fa3', '#36c2b4'], ['forest', 'Forest', '#3f7d3a', '#b8a046'], ['royal', 'Royal Worship', '#231b42', '#b388ff'], ['rose', 'Rose', '#c2577a', '#d9a066'], ['studio', 'Studio Mono', '#161616', '#ff5a36'], ['neon', 'Neon Groove', '#0b0b12', '#ff3ea5'], ['ember', 'Ember', '#2a1d19', '#ff8a3d']];

  /* ---------- per-browser UI preferences ---------- */
  const PREF_KEY = 'riffbook-ui-v1';
  const ui = { theme: 'midnight', list: 'all', notebook: '', tag: '', type: '', q: '', sort: 'updated', selected: null, viewKey: null };
  try { Object.assign(ui, JSON.parse(localStorage.getItem(PREF_KEY) || '{}')); } catch (e) { /* ignore */ }
  const savePrefs = () => { try { localStorage.setItem(PREF_KEY, JSON.stringify({ ...ui, viewKey: null })); } catch (e) { /* ignore */ } };

  const toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 1800); };

  /* ======================= Storage ======================= */
  const Store = (() => {
    let mode = 'loading', cloud = null, assets = null, idbP = null, notes = [];
    const listeners = new Set();
    const urlCache = new Map();
    const emit = (remote) => listeners.forEach((f) => f(!!remote));
    function idb() {
      if (!idbP) idbP = new Promise((res, rej) => {
        const r = indexedDB.open('riffbook', 1);
        r.onupgradeneeded = () => { r.result.createObjectStore('notes', { keyPath: 'id' }); r.result.createObjectStore('media', { keyPath: 'id' }); };
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
      });
      return idbP;
    }
    async function tx(store, fn, write) {
      const db = await idb();
      return new Promise((res, rej) => {
        const t = db.transaction(store, write ? 'readwrite' : 'readonly');
        const req = fn(t.objectStore(store));
        t.oncomplete = () => res(req && req.result); t.onerror = () => rej(t.error);
      });
    }
    async function initLocal() {
      try {
        notes = (await tx('notes', (s) => s.getAll())) || [];
        let seeded = false;
        try { seeded = localStorage.getItem('riffbook-seeded') === '1'; } catch (e) { /* ignore */ }
        if (!notes.length && !seeded) {
          notes = exampleNotes();
          for (const n of notes) await tx('notes', (s) => s.put(n), true);
          try { localStorage.setItem('riffbook-seeded', '1'); } catch (e) { /* ignore */ }
        }
        mode = 'local';
      } catch (e) { mode = 'memory'; notes = exampleNotes(); }
      emit();
    }
    async function initCloud(db, user) {
      const id = await user.id().catch(() => null);
      if (!id) return false;
      mode = 'cloud';
      cloud = db.collection('data/users/' + id);
      assets = await window.claude.use('assets').catch(() => null);
      const timer = setTimeout(() => { Store.note = 'Your notebook is taking a while to load — showing what is cached.'; emit(); }, 10000);
      cloud.onSnapshot((snap) => {
        if (!snap.metadata.fromCache) { clearTimeout(timer); Store.note = ''; }
        const fresh = snap.docs.filter((d) => d.exists && d.id.startsWith('note-')).map((d) => Object.assign(JSON.parse(JSON.stringify(d.data())), { id: d.id }));
        // Merge into the existing objects so the open note keeps its identity; never overwrite unsaved edits
        const have = new Map(notes.map((n) => [n.id, n]));
        notes = fresh.map((f) => {
          const ex = have.get(f.id);
          if (!ex) return f;
          if (ex._dirty) return ex;
          Object.keys(ex).forEach((k) => { if (!(k in f) && !k.startsWith('_')) delete ex[k]; });
          return Object.assign(ex, f);
        });
        emit(true);
      }, (e) => { clearTimeout(timer); Store.note = 'Could not load your notebook (' + ((e && e.code) || 'error') + ').'; emit(); });
      return true;
    }
    async function init() {
      if (window.claude && typeof window.claude.use === 'function') {
        const [db, user] = await Promise.all([window.claude.use('db').catch(() => null), window.claude.use('user').catch(() => null)]);
        if (db && user && await initCloud(db, user)) return;
      }
      if (window.indexedDB) return initLocal();
      mode = 'memory'; notes = exampleNotes(); emit();
    }
    const clean = (n) => { const c = JSON.parse(JSON.stringify(n)); delete c._dirty; return c; };
    return {
      note: '',
      get mode() { return mode; },
      get canUpload() { return mode === 'local' || (mode === 'cloud' && !!assets); },
      init, on: (f) => { listeners.add(f); return () => listeners.delete(f); },
      all: () => notes, get: (id) => notes.find((n) => n.id === id),
      add(n) { notes.push(n); return this.save(n); },
      async save(n) {
        n.updated = Date.now();
        delete n._dirty;
        if (mode === 'cloud') { const { id, ...body } = clean(n); await cloud.doc(id).set(body); }
        else if (mode === 'local') await tx('notes', (s) => s.put(clean(n)), true);
        emit();
      },
      async remove(id) {
        const n = notes.find((x) => x.id === id);
        notes = notes.filter((x) => x.id !== id);
        if (mode === 'cloud') await cloud.doc(id).delete();
        else if (mode === 'local') await tx('notes', (s) => s.delete(id), true);
        if (n) for (const b of n.blocks || []) if (b.ref) await this.removeMedia(b.ref).catch(() => {});
        emit();
      },
      async putMedia(blob) {
        if (mode === 'cloud') {
          if (!assets) throw { message: 'File uploads are not available to you on this notebook.' };
          let type = (blob.type || '').split(';')[0];
          if (/^audio\/(webm|ogg)/.test(type)) type = 'video/webm';
          else if (/^audio\/(mp4|x-m4a|m4a|aac)/.test(type)) type = 'video/mp4';
          return 'asset:' + (await assets.upload(blob, { type })).id;
        }
        const id = uid('m');
        if (mode === 'local') await tx('media', (s) => s.put({ id, blob }), true);
        else urlCache.set('idb:' + id, URL.createObjectURL(blob));
        return 'idb:' + id;
      },
      async url(ref) {
        if (urlCache.has(ref)) return urlCache.get(ref);
        let u = '';
        if (ref.startsWith('asset:')) u = '/_blob/' + ref.slice(6);
        else if (mode === 'local') { const r = await tx('media', (s) => s.get(ref.slice(4))); if (r) u = URL.createObjectURL(r.blob); }
        urlCache.set(ref, u); return u;
      },
      async blob(ref) { if (mode !== 'local' || !ref.startsWith('idb:')) return null; const r = await tx('media', (s) => s.get(ref.slice(4))); return r && r.blob; },
      async removeMedia(ref) {
        if (ref.startsWith('asset:') && assets) await assets.delete(ref.slice(6)).catch(() => {});
        else if (ref.startsWith('idb:') && mode === 'local') await tx('media', (s) => s.delete(ref.slice(4)), true);
      }
    };
  })();

  /* ======================= Example notes (first run, local only) ======================= */
  function exampleNotes() {
    const N = (s) => s.split(' ').map((x) => M.parseNote(x).midi);
    const now = Date.now();
    const log = (daysAgo, mins, bpm, note) => ({ id: uid('p'), at: now - daysAgo * DAY, mins, bpm, note });
    const improvRoll = { bpm: 84, events: [] };
    [['E5', 0, 0.5], ['D5', 0.5, 0.5], ['C5', 1, 1], ['A4', 2, 0.5], ['G4', 2.5, 1.5], ['E4', 4, 0.5], ['G4', 4.5, 0.5], ['A4', 5, 1], ['C5', 6, 2], ['D5', 8, 0.5], ['E5', 8.5, 0.5], ['G5', 9, 1], ['E5', 10, 0.5], ['D5', 10.5, 0.5], ['C5', 11, 1], ['A4', 12, 0.5], ['C5', 12.5, 0.5], ['D5', 13, 3]]
      .forEach(([n, t, d]) => improvRoll.events.push({ m: M.parseNote(n).midi, t, d, v: 90 }));
    [['C3', 0], ['G2', 4], ['A2', 8], ['F2', 12]].forEach(([n, t]) => improvRoll.events.push({ m: M.parseNote(n).midi, t, d: 3.8, v: 80 }));
    return [
      {
        id: 'note-example-walkup', title: 'Gospel walk-up into the 4 chord', type: 'movement', notebook: 'Church band', tags: ['gospel', 'passing chords', 'example'],
        key: 'C', bpm: 72, status: 'practising', pinned: true, favourite: false, created: now - 20 * DAY, updated: now - 2 * DAY,
        body: '# The move\nGoing from **1 to 4**, walk the bass up chromatically and put a passing diminished chord on the way: [C] [C/E] [F] [F#dim7] [C/G] [A7] [Dm7] [G7sus4] [G7] [C]\n\n- Keep the RH on top of the chord and move the *inner voices* only\n- The F#dim7 is the magic: every note leans into C/G\n- Use it at the end of a verse before the chorus lift\n\nRelated: [[Right-hand placement for add9 pads]]',
        blocks: [
          { id: 'b1', kind: 'chords', label: 'Full walk-up', prog: 'C C/E F F#dim7 C/G A7 Dm7 G7sus4 G7 C', beats: 2 },
          { id: 'b2', kind: 'placement', label: 'F#dim7 — where my hands sit', symbol: 'F#dim7', lh: N('F#2 F#3'), rh: N('A3 C4 D#4 F#4'), fingers: { 42: '5', 54: '1', 57: '1', 60: '2', 63: '3', 66: '5' } }
        ],
        comments: [
          { id: 'c1', at: now - 9 * DAY, mood: 'tricky', text: 'LH jump from F to F#3 is clumsy at 80 bpm — try playing just F#2.', blockId: 'b2' },
          { id: 'c2', at: now - 2 * DAY, mood: 'works', text: 'Used it on Sunday going into the last chorus. Sounded great with the bass player walking with me.' }
        ],
        practice: [log(14, 15, 60, 'slow, hands separate'), log(9, 10, 66), log(6, 20, 70, 'all keys round the circle — got to Eb'), log(2, 15, 76)],
        links: []
      },
      {
        id: 'note-example-improv', title: 'Pentatonic improv over 1-5-6-4', type: 'improv', notebook: 'Improvisation', tags: ['pentatonic', 'interlude', 'example'],
        key: 'C', bpm: 84, status: 'idea', pinned: false, favourite: true, created: now - 6 * DAY, updated: now - 1 * DAY,
        body: 'Captured this while vamping. The **C major pentatonic** (C D E G A) never clashes with any chord in the loop.\n\n- Phrase 1 answers itself: down, then back up\n- Land on the **3rd of each chord** on beat 1 (E over C, B over G, C over Am, A over F)\n- Leave space! Bar 4 is mostly a held note',
        blocks: [
          { id: 'b1', kind: 'chords', label: 'The loop', prog: 'C G Am F', beats: 4 },
          { id: 'b2', kind: 'roll', label: 'First take', roll: improvRoll },
          { id: 'b3', kind: 'checklist', label: 'Next steps', items: [{ t: 'Play it in G and D', done: true }, { t: 'Add a grace note into the E', done: false }, { t: 'Try the same shape with the minor pentatonic over Am', done: false }] }
        ],
        comments: [{ id: 'c1', at: now - 1 * DAY, mood: 'love', text: 'The held D at the end makes it sound unfinished in a good way — perfect before a key change.', blockId: 'b2' }],
        practice: [log(5, 10, 72), log(3, 15, 80), log(1, 10, 84)],
        links: []
      },
      {
        id: 'note-example-placement', title: 'Right-hand placement for add9 pads', type: 'placement', notebook: 'Church band', tags: ['pads', 'worship', 'example'],
        key: 'C', bpm: 64, status: 'ready', pinned: false, favourite: false, created: now - 30 * DAY, updated: now - 12 * DAY,
        body: 'The RH stays in **one place** while the LH changes root. Thumb on the 2nd, 2 on the 3rd, 4 on the 5th. Common tones are the secret.\n\n[Cadd9] [G/B] [Am7] [Fmaj9]',
        blocks: [
          { id: 'b1', kind: 'placement', label: 'Home position', symbol: 'Cadd9', lh: N('C2 G2 C3'), rh: N('D4 E4 G4'), fingers: { 36: '5', 43: '2', 48: '1', 62: '1', 64: '2', 67: '4' } },
          { id: 'b2', kind: 'chords', label: 'Moving the LH only', prog: 'Cadd9 G/B Am7 Fmaj9', beats: 4 }
        ],
        comments: [], practice: [log(30, 10, 60), log(25, 10, 64)], links: []
      }
    ];
  }

  /* ======================= Helpers ======================= */
  const keyIdx = (name) => Math.max(0, M.KEYS.findIndex((k) => k.name === name));
  const shiftBetween = (from, to) => { let d = M.mod(M.KEYS[keyIdx(to)].pc - M.KEYS[keyIdx(from)].pc); return d > 6 ? d - 12 : d; };
  const viewShift = (n) => (ui.viewKey && n.key ? shiftBetween(n.key, ui.viewKey) : 0);
  const keyFlat = (name) => { const k = M.KEYS[keyIdx(name)]; return k.flat || k.pc === 0; };
  const tr = (sym, semis, key) => (semis ? M.transposeChord(sym, semis, keyFlat(key)) : sym);
  const lastPractised = (n) => Math.max(0, ...(n.practice || []).map((p) => p.at));
  const totalMins = (n) => (n.practice || []).reduce((a, p) => a + (+p.mins || 0), 0);
  const ago = (t) => {
    if (!t) return 'never';
    const d = Math.floor((Date.now() - t) / DAY);
    return d <= 0 ? 'today' : d === 1 ? 'yesterday' : d < 7 ? d + ' days ago' : d < 60 ? Math.floor(d / 7) + ' wk ago' : new Date(t).toLocaleDateString();
  };
  const needsReview = (n) => n.status !== 'mastered' && (Date.now() - (lastPractised(n) || n.created || 0)) > 7 * DAY;

  // Markdown-lite with [Chord] chips and [[Note links]]
  function renderBody(text, n) {
    const semis = viewShift(n);
    const inline = (s) => esc(s)
      .replace(/\[\[([^\]]+)\]\]/g, (m, t) => { const target = Store.all().find((x) => x.title.toLowerCase() === t.trim().toLowerCase()); return target ? `<a href="#" class="wikilink" data-open="${esc(target.id)}">${esc(t)}</a>` : `<span class="wikilink missing" title="No note with this title yet">${esc(t)}</span>`; })
      .replace(/\[([A-G][#b]?[^\]\s]{0,10})\]/g, (m, c) => (M.parseChord(c) ? `<button class="chip inline" data-chord="${esc(tr(c, semis, ui.viewKey))}">${esc(M.pretty(tr(c, semis, ui.viewKey)))}</button>` : m))
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*]+)\*/g, '<i>$1</i>').replace(/`([^`]+)`/g, '<code>$1</code>');
    const out = []; let list = null;
    (text || '').split('\n').forEach((line) => {
      const li = /^\s*[-*]\s+(.*)$/.exec(line);
      if (li) { (list = list || []).push(`<li>${inline(li[1])}</li>`); return; }
      if (list) { out.push(`<ul>${list.join('')}</ul>`); list = null; }
      const h = /^(#{1,3})\s+(.*)$/.exec(line);
      if (h) out.push(`<h${h[1].length + 2}>${inline(h[2])}</h${h[1].length + 2}>`);
      else if (line.trim()) out.push(`<p>${inline(line)}</p>`);
    });
    if (list) out.push(`<ul>${list.join('')}</ul>`);
    return out.join('') || '<p class="muted">Nothing written yet. Tap to write.</p>';
  }

  /* ======================= Filtering ======================= */
  const SMART = {
    all: { label: 'All notes', icon: '▤', test: () => true },
    pinned: { label: 'Pinned', icon: '📌', test: (n) => n.pinned },
    favourite: { label: 'Favourites', icon: '★', test: (n) => n.favourite },
    practising: { label: 'Practising', icon: '◔', test: (n) => n.status === 'practising' },
    review: { label: 'Revisit', icon: '↻', test: needsReview, hint: 'Not practised for over a week' },
    mastered: { label: 'Mastered', icon: '✓', test: (n) => n.status === 'mastered' }
  };
  function filtered() {
    const q = ui.q.trim().toLowerCase();
    let list = Store.all().filter((n) => (SMART[ui.list] || SMART.all).test(n) &&
      (!ui.notebook || n.notebook === ui.notebook) && (!ui.tag || (n.tags || []).includes(ui.tag)) && (!ui.type || n.type === ui.type) &&
      (!q || [n.title, n.body, n.notebook, (n.tags || []).join(' '), (n.comments || []).map((c) => c.text).join(' '), (n.blocks || []).map((b) => (b.label || '') + ' ' + (b.prog || '') + ' ' + (b.symbol || '')).join(' ')].join(' ').toLowerCase().includes(q)));
    const sorters = {
      updated: (a, b) => (b.updated || 0) - (a.updated || 0),
      created: (a, b) => (b.created || 0) - (a.created || 0),
      title: (a, b) => (a.title || '').localeCompare(b.title || ''),
      practised: (a, b) => lastPractised(b) - lastPractised(a)
    };
    list.sort(sorters[ui.sort] || sorters.updated);
    return list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }

  /* ======================= Rail ======================= */
  function renderRail() {
    const all = Store.all();
    const nbs = {}, tags = {};
    all.forEach((n) => { if (n.notebook) nbs[n.notebook] = (nbs[n.notebook] || 0) + 1; (n.tags || []).forEach((t) => { tags[t] = (tags[t] || 0) + 1; }); });
    const item = (attrs, on, icon, label, count) => `<button class="rail-item ${on ? 'on' : ''}" ${attrs}><span class="ri-icon">${icon}</span><span class="ri-label">${esc(label)}</span>${count != null ? `<b>${count}</b>` : ''}</button>`;
    $('#rail').innerHTML = `
      <div class="brand"><div class="brand-mark">✎</div><div>Riffbook<small>${Store.mode === 'cloud' ? 'Private to you' : Store.mode === 'local' ? 'Saved in this browser' : Store.mode === 'memory' ? 'Not saved' : 'Loading…'}</small></div></div>
      <div class="rail-actions">
        <button class="btn primary" id="new-note">＋ New note</button>
        <button class="btn" id="quick-audio" title="Record an audio idea straight into a new note">🎙 Quick idea</button>
      </div>
      <div class="rail-sec">Library</div>
      ${Object.entries(SMART).map(([k, s]) => item(`data-list="${k}" title="${esc(s.hint || '')}"`, ui.list === k && !ui.notebook && !ui.tag && !ui.type, s.icon, s.label, all.filter(s.test).length)).join('')}
      <div class="rail-sec">Types</div>
      ${Object.entries(TYPES).map(([k, t]) => item(`data-type="${k}"`, ui.type === k, t.icon, t.label, all.filter((n) => n.type === k).length)).join('')}
      <div class="rail-sec">Notebooks</div>
      ${Object.keys(nbs).sort().map((k) => item(`data-nb="${esc(k)}"`, ui.notebook === k, '▣', k, nbs[k])).join('') || '<div class="small muted rail-empty">Set a notebook on a note to group it here.</div>'}
      <div class="rail-sec">Tags</div>
      <div class="tag-cloud">${Object.keys(tags).sort().map((t) => `<button class="tag-btn ${ui.tag === t ? 'on' : ''}" data-tag="${esc(t)}">#${esc(t)}</button>`).join('') || '<span class="small muted">No tags yet.</span>'}</div>
      <div class="rail-sec">Practice · last 12 weeks</div>
      ${heatmap(all)}
      <div class="rail-foot">
        <div class="themes">${THEMES.map(([id, name, a, b]) => `<button class="swatch" data-theme="${id}" title="${name}" aria-label="${name} colour scheme" aria-pressed="${ui.theme === id}" style="background:linear-gradient(135deg,${a} 50%,${b} 50%)"></button>`).join('')}</div>
        ${Store.mode === 'local' ? `<div class="row" style="margin-top:10px"><button class="btn sm print-only" id="backup">⬇ Back up</button><label class="btn sm">⬆ Restore<input type="file" id="restore" accept=".json" hidden></label></div>` : ''}
        <a class="small" href="../index.html" style="display:block;margin-top:10px">← Syllabus Studio</a>
      </div>`;
    const reset = () => { ui.notebook = ''; ui.tag = ''; ui.type = ''; };
    $$('[data-list]', $('#rail')).forEach((b) => b.onclick = () => { reset(); ui.list = b.dataset.list; refresh(true); });
    $$('[data-type]', $('#rail')).forEach((b) => b.onclick = () => { const t = b.dataset.type; reset(); ui.list = 'all'; ui.type = t; refresh(true); });
    $$('[data-nb]', $('#rail')).forEach((b) => b.onclick = () => { const v = b.dataset.nb; reset(); ui.list = 'all'; ui.notebook = v; refresh(true); });
    $$('[data-tag]', $('#rail')).forEach((b) => b.onclick = () => { const v = b.dataset.tag; const was = ui.tag === v; reset(); ui.list = 'all'; ui.tag = was ? '' : v; refresh(true); });
    $$('[data-theme]', $('#rail')).forEach((b) => b.onclick = () => setTheme(b.dataset.theme));
    $('#new-note').onclick = () => openTemplates();
    $('#quick-audio').onclick = quickAudio;
    if ($('#backup')) { $('#backup').onclick = backup; $('#restore').onchange = (e) => restore(e.target.files[0]); }
  }
  function heatmap(all) {
    const days = 84, cell = 11, gap = 3;
    const byDay = {};
    all.forEach((n) => (n.practice || []).forEach((p) => { const d = Math.floor((Date.now() - p.at) / DAY); if (d < days) byDay[d] = (byDay[d] || 0) + (+p.mins || 0); }));
    const max = Math.max(15, ...Object.values(byDay));
    const total = Object.values(byDay).reduce((a, b) => a + b, 0);
    let g = '';
    const todayDow = new Date().getDay();
    for (let d = 0; d < days; d++) {
      const col = 11 - Math.floor((d + (6 - todayDow)) / 7), row = M.mod(todayDow - d, 7);
      if (col < 0) continue;
      const v = byDay[d] || 0;
      g += `<rect x="${col * (cell + gap)}" y="${row * (cell + gap)}" width="${cell}" height="${cell}" rx="2.5" fill="${v ? 'var(--accent)' : 'var(--surface-2)'}" opacity="${v ? 0.35 + 0.65 * Math.min(1, v / max) : 1}" stroke="var(--line)" stroke-width="${v ? 0 : 1}"><title>${new Date(Date.now() - d * DAY).toLocaleDateString()}: ${v} min</title></rect>`;
    }
    return `<svg class="heat" viewBox="0 0 ${12 * (cell + gap)} ${7 * (cell + gap)}" role="img" aria-label="Practice minutes over the last 12 weeks: ${total} minutes">${g}</svg><div class="small muted">${total} min practised · ${Object.keys(byDay).length} days</div>`;
  }

  /* ======================= Note list ======================= */
  function renderList() {
    const list = filtered();
    const title = ui.type ? TYPES[ui.type].label : ui.notebook ? ui.notebook : ui.tag ? '#' + ui.tag : (SMART[ui.list] || SMART.all).label;
    $('#list-pane').innerHTML = `
      <div class="list-head">
        <div class="spread"><h2 style="margin:0">${esc(title)}</h2><button class="icon-btn mobile-only" id="menu-btn" aria-label="Open menu">☰</button></div>
        <input type="search" id="q" placeholder="Search notes, chords, comments…" value="${esc(ui.q)}" aria-label="Search notes">
        <div class="spread small"><span class="muted">${list.length} note${list.length === 1 ? '' : 's'}</span>
          <label class="muted">Sort <select id="sort">${[['updated', 'Last edited'], ['created', 'Newest'], ['practised', 'Last practised'], ['title', 'Title']].map(([k, l]) => `<option value="${k}" ${ui.sort === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label></div>
        ${Store.note ? `<div class="small" style="color:var(--d)">${esc(Store.note)}</div>` : ''}
      </div>
      <div class="note-list" role="list">${list.map((n) => {
        const t = TYPES[n.type] || TYPES.idea;
        const snippet = (n.body || '').replace(/[#*`[\]]/g, '').replace(/\s+/g, ' ').slice(0, 90);
        return `<button class="note-row ${n.id === ui.selected ? 'on' : ''}" data-id="${esc(n.id)}" role="listitem">
          <div class="nr-top"><span class="nr-type" title="${t.label}">${t.icon}</span><b class="nr-title">${esc(n.title || 'Untitled')}</b>${n.pinned ? '<span title="Pinned">📌</span>' : ''}${n.favourite ? '<span class="star" title="Favourite">★</span>' : ''}</div>
          <div class="nr-snip">${esc(snippet) || '<span class="muted">No text</span>'}</div>
          <div class="nr-meta"><span>${ago(n.updated)}</span>${n.key ? `<span>Key ${esc(M.pretty(n.key))}</span>` : ''}<span class="st st-${n.status || 'idea'}">${STATUS[n.status || 'idea']}</span>${(n.comments || []).length ? `<span>💬 ${n.comments.length}</span>` : ''}${needsReview(n) ? '<span class="due">↻ revisit</span>' : ''}</div>
        </button>`;
      }).join('') || `<div class="empty">${Store.mode === 'loading' ? 'Loading your notes…' : Store.all().length ? 'No notes match.' : 'No notes yet. Tap <b>＋ New note</b> to capture your first idea.'}</div>`}</div>`;
    $('#q').oninput = (e) => { ui.q = e.target.value; savePrefs(); renderList(); $('#q').focus(); $('#q').setSelectionRange(ui.q.length, ui.q.length); };
    $('#sort').onchange = (e) => { ui.sort = e.target.value; savePrefs(); renderList(); };
    $$('.note-row').forEach((r) => r.onclick = () => select(r.dataset.id));
    $('#menu-btn').onclick = () => document.body.classList.add('rail-open');
  }

  /* ======================= Editor ======================= */
  let current = null, saveTimer = null, cleanup = [];
  const markDirty = (rerender) => {
    if (!current) return;
    current._dirty = true;
    $('#save-state') && ($('#save-state').textContent = 'Editing…');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => Store.save(current).then(() => { if ($('#save-state')) $('#save-state').textContent = 'Saved'; }).catch((e) => { if ($('#save-state')) $('#save-state').textContent = 'Not saved: ' + (e.message || e.code || 'error'); }), 600);
    if (rerender) renderEditor();
  };
  const flush = () => { if (current && current._dirty) { clearTimeout(saveTimer); return Store.save(current); } return Promise.resolve(); };

  function select(id) {
    flush();
    ui.selected = id; ui.viewKey = null; savePrefs();
    current = Store.get(id) || null;
    document.body.classList.add('note-open');
    renderList(); renderEditor();
    $('#note-pane').scrollTop = 0;
  }

  function renderEditor() {
    cleanup.forEach((f) => f()); cleanup = [];
    const pane = $('#note-pane');
    const n = current;
    if (!n) {
      pane.innerHTML = `<div class="empty-note"><div class="big-icon">✎</div><h2>Your musical notebook</h2><p class="muted">Write down improvisations, chord movements and hand placements, then attach chords you can play, keyboard diagrams with fingering, piano-roll takes, recordings and your own comments.</p><button class="btn primary" id="empty-new">＋ New note</button></div>`;
      $('#empty-new').onclick = () => openTemplates();
      return;
    }
    const semis = viewShift(n);
    const stats = { mins: totalMins(n), sessions: (n.practice || []).length, best: Math.max(0, ...(n.practice || []).map((p) => +p.bpm || 0)), last: lastPractised(n) };
    const backlinks = Store.all().filter((x) => x.id !== n.id && ((x.links || []).includes(n.id) || (x.body || '').toLowerCase().includes('[[' + (n.title || '').toLowerCase() + ']]')));
    pane.innerHTML = `
      <div class="ed-top">
        <button class="btn sm ghost mobile-only" id="back">← Notes</button>
        <span class="small muted" id="save-state">${n._dirty ? 'Editing…' : 'Saved'}</span>
        <div class="row" style="gap:6px;margin-left:auto">
          <button class="icon-btn ${n.pinned ? 'on' : ''}" id="pin" title="Pin" aria-pressed="${!!n.pinned}">📌</button>
          <button class="icon-btn ${n.favourite ? 'on' : ''}" id="fav" title="Favourite" aria-pressed="${!!n.favourite}">★</button>
          <button class="btn sm primary" id="practice-btn">▶ Practice mode</button>
          <button class="btn sm ghost" id="more">⋯</button>
        </div>
      </div>
      <div id="more-menu" class="more-menu" hidden>
        <button id="dup">Duplicate note</button><button id="copy-text">Copy as text</button><button id="del" class="danger">Delete note</button>
      </div>
      <input class="title-input" id="title" value="${esc(n.title || '')}" placeholder="Title — e.g. 'Walk-up into the bridge'" aria-label="Title">
      <div class="meta-row">
        <label>Type <select id="m-type">${Object.entries(TYPES).map(([k, t]) => `<option value="${k}" ${k === n.type ? 'selected' : ''}>${t.icon} ${t.label}</option>`).join('')}</select></label>
        <label>Status <select id="m-status">${Object.entries(STATUS).map(([k, l]) => `<option value="${k}" ${k === (n.status || 'idea') ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
        <label>Key <select id="m-key"><option value="">—</option>${M.KEYS.map((k) => `<option ${k.name === n.key ? 'selected' : ''}>${k.name}</option>`).join('')}</select></label>
        <label>Tempo <input type="number" id="m-bpm" min="30" max="240" value="${n.bpm || ''}" placeholder="bpm"></label>
        <label>Notebook <input type="text" id="m-nb" list="nb-list" value="${esc(n.notebook || '')}" placeholder="e.g. Church band"><datalist id="nb-list">${Array.from(new Set(Store.all().map((x) => x.notebook).filter(Boolean))).map((x) => `<option value="${esc(x)}">`).join('')}</datalist></label>
        <label class="grow">Tags <input type="text" id="m-tags" value="${esc((n.tags || []).join(', '))}" placeholder="gospel, interlude, ending"></label>
      </div>
      ${n.key ? `<div class="transpose-bar"><span class="small muted">View in key</span><div class="keybar">${M.KEYS.map((k) => `<button data-vk="${k.name}" class="${(ui.viewKey || n.key) === k.name ? 'on' : ''}">${M.pretty(k.name)}</button>`).join('')}</div>${semis ? `<button class="btn sm" id="apply-key">Make ${M.pretty(ui.viewKey)} the note's key</button>` : ''}</div>` : ''}

      <section class="body-sec">
        <div class="spread"><h3>Notes</h3><div class="seg"><button id="mode-read" aria-pressed="${!n._editBody}">Read</button><button id="mode-write" aria-pressed="${!!n._editBody}">Write</button></div></div>
        ${n._editBody ? `<textarea id="body" rows="10" placeholder="Write freely. Tips: # Heading · **bold** · - list · [Cmaj7] makes a playable chord · [[Note title]] links a note">${esc(n.body || '')}</textarea><div class="small muted">Write <code>[C]</code> <code>[G/B]</code> for chords you can tap, <code>[[Title]]</code> to link another note.</div>`
          : `<div class="prose body-read" id="body-read" tabindex="0" title="Tap to write">${renderBody(n.body, n)}</div>`}
      </section>

      <section>
        <div class="spread"><h3>Blocks</h3>
          <div class="add-blocks" role="group" aria-label="Add a block">
            <button data-add="chords">♫ Chords</button><button data-add="placement">✋ Placement</button><button data-add="roll">▦ Piano roll</button><button data-add="audio">🎙 Audio</button><button data-add="image">🖼 Image</button><button data-add="checklist">☑ Checklist</button>
          </div></div>
        <div id="blocks">${(n.blocks || []).map((b, i) => blockHTML(n, b, i, semis)).join('') || '<p class="small muted">Add a block to attach chords, a hand placement, a piano-roll take, a recording, an image or a checklist.</p>'}</div>
      </section>

      <section class="two-col">
        <div>
          <h3>My comments <span class="muted small">(${(n.comments || []).length})</span></h3>
          <form id="c-form" class="comment-form">
            <textarea id="c-text" rows="2" placeholder="What did you notice? What to try next?"></textarea>
            <div class="row small"><select id="c-mood" aria-label="Kind of comment">${Object.entries(MOODS).map(([k, l]) => `<option value="${k}">${l}</option>`).join('')}</select>
              <select id="c-block" aria-label="About which block"><option value="">Whole note</option>${(n.blocks || []).map((b) => `<option value="${esc(b.id)}">${esc(b.label || blockName(b.kind))}</option>`).join('')}</select>
              <button class="btn sm primary" type="submit">Add comment</button></div>
          </form>
          <div class="comments">${(n.comments || []).slice().sort((a, b) => b.at - a.at).map((c) => {
            const blk = (n.blocks || []).find((b) => b.id === c.blockId);
            return `<div class="comment mood-${c.mood || 'none'}"><div class="spread small"><span><b>${MOODS[c.mood || '']}</b>${blk ? ` · on <a href="#" data-goto="${esc(blk.id)}">${esc(blk.label || blockName(blk.kind))}</a>` : ''}</span><span class="muted">${new Date(c.at).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} <button class="x" data-cdel="${esc(c.id)}" aria-label="Delete comment">✕</button></span></div><div>${esc(c.text).replace(/\n/g, '<br>')}</div></div>`;
          }).join('') || '<p class="small muted">No comments yet — add your thoughts as you practise.</p>'}</div>
        </div>
        <div>
          <h3>Practice log</h3>
          <div class="stat-row"><div><b>${stats.mins}</b><span>minutes</span></div><div><b>${stats.sessions}</b><span>sessions</span></div><div><b>${stats.best || '—'}</b><span>best bpm</span></div><div><b>${ago(stats.last)}</b><span>last</span></div></div>
          ${tempoChart(n)}
          <form id="p-form" class="row small" style="margin-top:8px">
            <label>Min <input type="number" id="p-mins" min="1" max="600" value="10" style="width:64px"></label>
            <label>bpm <input type="number" id="p-bpm" min="20" max="300" value="${n.bpm || ''}" style="width:64px"></label>
            <input type="text" id="p-note" placeholder="How did it go?" style="flex:1;min-width:120px">
            <button class="btn sm" type="submit">Log</button>
          </form>
          <div class="plog">${(n.practice || []).slice().sort((a, b) => b.at - a.at).slice(0, 8).map((p) => `<div class="small"><span class="muted">${new Date(p.at).toLocaleDateString()}</span> · ${p.mins} min${p.bpm ? ' @ ' + p.bpm + ' bpm' : ''}${p.note ? ' — ' + esc(p.note) : ''} <button class="x" data-pdel="${esc(p.id)}" aria-label="Remove session">✕</button></div>`).join('')}</div>
          <h3 style="margin-top:18px">Linked notes</h3>
          <div class="row" style="gap:6px">${(n.links || []).map((id) => Store.get(id)).filter(Boolean).map((x) => `<span class="pill"><a href="#" data-open="${esc(x.id)}">${esc(x.title)}</a> <button class="x" data-unlink="${esc(x.id)}" aria-label="Unlink">✕</button></span>`).join('')}
            <select id="link-add" aria-label="Link another note"><option value="">＋ Link a note…</option>${Store.all().filter((x) => x.id !== n.id && !(n.links || []).includes(x.id)).map((x) => `<option value="${esc(x.id)}">${esc(x.title)}</option>`).join('')}</select></div>
          ${backlinks.length ? `<div class="small" style="margin-top:8px"><span class="muted">Linked from:</span> ${backlinks.map((x) => `<a href="#" data-open="${esc(x.id)}">${esc(x.title)}</a>`).join(', ')}</div>` : ''}
          <div class="small muted" style="margin-top:14px">Created ${new Date(n.created).toLocaleDateString()} · edited ${ago(n.updated)}</div>
        </div>
      </section>`;
    bindEditor(n, semis);
  }

  const blockName = (k) => ({ chords: 'Chords', placement: 'Placement', roll: 'Piano roll', audio: 'Recording', image: 'Image', checklist: 'Checklist' }[k] || 'Block');

  function blockHTML(n, b, i, semis) {
    const head = `<div class="blk-head"><input class="blk-label" data-label="${i}" value="${esc(b.label || '')}" placeholder="${blockName(b.kind)}" aria-label="Block name">
      <span class="blk-tools"><button data-up="${i}" title="Move up" aria-label="Move up">↑</button><button data-down="${i}" title="Move down" aria-label="Move down">↓</button><button data-bdel="${i}" title="Delete block" aria-label="Delete block">✕</button></span></div>`;
    const comments = (n.comments || []).filter((c) => c.blockId === b.id).length;
    const foot = comments ? `<div class="small muted blk-foot">💬 ${comments} comment${comments > 1 ? 's' : ''}</div>` : '';
    let body = '';
    if (b.kind === 'chords') {
      const chips = (b.prog || '').trim().split(/\s+/).filter(Boolean).map((c) => (c === '|' ? '<span class="chip bar">|</span>' : `<button class="chip" data-chord="${esc(tr(c, semis, ui.viewKey))}">${esc(M.pretty(tr(c, semis, ui.viewKey)))}</button>`)).join('');
      body = `<div class="chips">${chips || '<span class="small muted">Type chords below.</span>'}</div>
        <div class="row small" style="margin-top:8px"><input type="text" data-prog="${i}" value="${esc(b.prog || '')}" placeholder="C G/B Am7 Fmaj9" style="flex:1;min-width:160px" aria-label="Chords">
        <label>Beats <select data-beats="${i}">${[1, 2, 4, 8].map((x) => `<option ${x === (b.beats || 4) ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
        <select data-style="${i}" aria-label="Style"><option value="block">Block</option><option value="broken">Broken</option><option value="arp">Arpeggio</option><option value="pad">Pad</option></select>
        <button class="btn sm" data-playprog="${i}">▶ Play</button></div>`;
    } else if (b.kind === 'placement') {
      const lh = (b.lh || []).map((m) => m + semis), rh = (b.rh || []).map((m) => m + semis);
      const fingers = {}; Object.entries(b.fingers || {}).forEach(([m, f]) => { fingers[+m + semis] = f; });
      const sym = b.symbol ? tr(b.symbol, semis, ui.viewKey) : '';
      const guess = U.detectName(lh.concat(rh), keyFlat(ui.viewKey || n.key || 'C'));
      body = `<div class="place-kb" data-placekb="${i}">${U.voicingSVG({ lh, rh }, { from: 36, to: 95, w: 18, h: 78, fingers, names: true, speller: U.spellerFor(sym || guess, keyFlat(ui.viewKey || n.key || 'C')) })}</div>
        <div class="row small" style="margin-top:8px">
          <span class="seg" role="group" aria-label="Hand"><button data-hand="lh" aria-pressed="${placeTool.hand === 'lh'}">Left hand</button><button data-hand="rh" aria-pressed="${placeTool.hand === 'rh'}">Right hand</button></span>
          <span class="seg" role="group" aria-label="Finger">${['1', '2', '3', '4', '5', ''].map((f) => `<button data-finger="${f}" aria-pressed="${placeTool.finger === f}">${f || 'No #'}</button>`).join('')}</span>
          <button class="btn sm" data-playplace="${i}">▶ Hear</button>
        </div>
        <div class="row small" style="margin-top:6px"><label>Chord <input type="text" data-symbol="${i}" value="${esc(b.symbol || '')}" placeholder="${esc(guess || 'e.g. Cadd9')}" style="width:110px"></label>${guess ? `<span class="muted">Sounds like <b>${esc(M.pretty(guess))}</b></span>` : '<span class="muted">Tap keys to place notes; tap again to remove.</span>'}${semis ? '<span class="muted">· shown transposed (editing is off)</span>' : ''}</div>`;
    } else if (b.kind === 'roll') {
      const roll = b.roll || { bpm: n.bpm || 80, events: [] };
      const shown = semis ? { ...roll, events: roll.events.map((e) => ({ ...e, m: e.m + semis })) } : roll;
      body = `${U.rollSVG(shown, { row: 7, ppb: 28 })}
        <div class="row small" style="margin-top:8px"><button class="btn sm" data-playroll="${i}" ${roll.events.length ? '' : 'disabled'}>▶ Play</button>
        <button class="btn sm" data-recroll="${i}">${rollRec.block === b.id ? '■ Stop' : '● Record a take'}</button>
        <label>Tempo <input type="number" data-rollbpm="${i}" value="${roll.bpm || n.bpm || 80}" min="40" max="220" style="width:64px"></label>
        <label>Quantise <select data-rollq="${i}"><option value="0">Off</option><option value="0.25">1/16</option><option value="0.5" selected>1/8</option></select></label>
        <button class="btn sm ghost" data-midi="${i}">🎹 MIDI</button><span class="muted" data-rollstatus="${i}">${rollRec.block === b.id ? rollRec.status : 'Play with computer keys A W S E D F T G Y H U J K (Z/X octave) or a MIDI keyboard.'}</span></div>
        ${rollRec.block === b.id ? `<div class="mini-input">${U.voicingSVG({ lh: [], rh: [] }, { from: 48, to: 83, w: 22, h: 70 })}</div>` : ''}`;
    } else if (b.kind === 'audio') {
      body = b.ref ? `<audio controls preload="none" data-ref="${esc(b.ref)}"></audio>`
        : `<div class="row small"><button class="btn sm" data-mic="${i}">${micRec.block === b.id ? '■ Stop recording' : '🎙 Record'}</button><label class="btn sm">⬆ Upload<input type="file" data-upaudio="${i}" accept="audio/*,video/webm,video/mp4,.m4a,.webm" hidden></label><span class="muted" data-mstatus="${i}">${micRec.block === b.id ? '● Recording…' : ''}</span></div>`;
    } else if (b.kind === 'image') {
      body = b.ref ? `<img class="blk-img" alt="${esc(b.label || 'Image')}" data-ref="${esc(b.ref)}">`
        : `<label class="btn sm">⬆ Choose an image<input type="file" data-upimg="${i}" accept="image/png,image/jpeg,image/gif,image/webp" hidden></label> <span class="small muted">A photo of a chart, or a screenshot of your DAW piano roll.</span>`;
    } else if (b.kind === 'checklist') {
      body = `<div class="checks">${(b.items || []).map((it, j) => `<label class="check"><input type="checkbox" data-chk="${i}:${j}" ${it.done ? 'checked' : ''}><input type="text" data-chktxt="${i}:${j}" value="${esc(it.t)}" aria-label="Item"><button class="x" data-chkdel="${i}:${j}" aria-label="Remove item">✕</button></label>`).join('')}</div>
        <button class="btn sm ghost" data-chkadd="${i}">＋ Item</button>`;
    }
    return `<div class="blk blk-${b.kind}" id="blk-${esc(b.id)}" data-i="${i}">${head}${body}${foot}</div>`;
  }

  const placeTool = { hand: 'rh', finger: '' };
  const rollRec = { block: null, status: '', rec: null, input: null };
  const micRec = { block: null, mr: null };

  function tempoChart(n) {
    const pts = (n.practice || []).filter((p) => +p.bpm).sort((a, b) => a.at - b.at);
    if (pts.length < 2) return '';
    const W = 260, H = 54, lo = Math.min(...pts.map((p) => +p.bpm)) - 4, hi = Math.max(...pts.map((p) => +p.bpm)) + 4;
    const t0 = pts[0].at, t1 = pts[pts.length - 1].at || t0 + 1;
    const xy = pts.map((p) => [6 + ((p.at - t0) / Math.max(1, t1 - t0)) * (W - 12), H - 8 - ((+p.bpm - lo) / Math.max(1, hi - lo)) * (H - 16)]);
    const line = xy.map((p) => p.join(',')).join(' ');
    const last = xy[xy.length - 1];
    return `<svg class="tempo-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tempo progress from ${pts[0].bpm} to ${pts[pts.length - 1].bpm} bpm"><polyline points="6,${H - 4} ${line} ${last[0]},${H - 4}" fill="var(--accent)" opacity=".12"/><polyline points="${line}" fill="none" stroke="var(--accent)" stroke-width="2"/>${xy.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="2.5" fill="var(--accent)"/>`).join('')}<text x="${last[0]}" y="${Math.max(10, last[1] - 6)}" text-anchor="end" font-size="10" fill="var(--text)" font-weight="700">${pts[pts.length - 1].bpm} bpm</text></svg>`;
  }

  function bindEditor(n, semis) {
    const pane = $('#note-pane');
    $('#back') && ($('#back').onclick = () => { flush(); document.body.classList.remove('note-open'); });
    $('#title').oninput = (e) => { n.title = e.target.value; markDirty(); };
    $('#title').onblur = () => renderList();
    $('#m-type').onchange = (e) => { n.type = e.target.value; markDirty(); renderList(); renderRail(); };
    $('#m-status').onchange = (e) => { n.status = e.target.value; markDirty(); renderList(); renderRail(); };
    $('#m-key').onchange = (e) => { n.key = e.target.value; ui.viewKey = null; markDirty(true); };
    $('#m-bpm').oninput = (e) => { n.bpm = +e.target.value || null; markDirty(); };
    $('#m-nb').onchange = (e) => { n.notebook = e.target.value.trim(); markDirty(); renderRail(); };
    $('#m-tags').onchange = (e) => { n.tags = e.target.value.split(',').map((t) => t.trim().toLowerCase().replace(/^#/, '')).filter(Boolean); markDirty(); renderRail(); };
    $('#pin').onclick = () => { n.pinned = !n.pinned; markDirty(true); renderList(); renderRail(); };
    $('#fav').onclick = () => { n.favourite = !n.favourite; markDirty(true); renderList(); renderRail(); };
    $('#more').onclick = () => { $('#more-menu').hidden = !$('#more-menu').hidden; };
    $('#dup').onclick = () => { const c = JSON.parse(JSON.stringify(n)); delete c._dirty; Object.assign(c, { id: 'note-' + uid(''), title: n.title + ' (copy)', created: Date.now(), comments: [], practice: [] }); c.blocks = (c.blocks || []).filter((b) => !b.ref); Store.add(c).then(() => select(c.id)); };
    $('#copy-text').onclick = () => {
      const text = `${n.title}\n${n.key ? 'Key ' + n.key + ' · ' : ''}${n.bpm ? n.bpm + ' bpm' : ''}\n\n${n.body || ''}\n\n${(n.blocks || []).filter((b) => b.prog || b.symbol).map((b) => (b.label ? b.label + ': ' : '') + (b.prog || b.symbol)).join('\n')}`;
      const done = () => toast('Copied');
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(done).catch(() => { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) { toast('Copy not available here'); } ta.remove(); });
      $('#more-menu').hidden = true;
    };
    $('#del').onclick = (e) => {
      if (!e.target.dataset.armed) { e.target.dataset.armed = '1'; e.target.textContent = 'Tap again to delete'; return; }
      const id = n.id; current = null; ui.selected = null; savePrefs();
      Store.remove(id).then(() => { toast('Note deleted'); document.body.classList.remove('note-open'); refresh(); });
    };
    $$('[data-vk]').forEach((b) => b.onclick = () => { ui.viewKey = b.dataset.vk === n.key ? null : b.dataset.vk; renderEditor(); });
    if ($('#apply-key')) $('#apply-key').onclick = () => {
      const s = viewShift(n), to = ui.viewKey, fl = keyFlat(to);
      n.blocks.forEach((b) => {
        if (b.prog) b.prog = b.prog.split(/\s+/).map((c) => (c === '|' ? c : M.transposeChord(c, s, fl))).join(' ');
        if (b.symbol) b.symbol = M.transposeChord(b.symbol, s, fl);
        if (b.lh) b.lh = b.lh.map((m) => m + s);
        if (b.rh) b.rh = b.rh.map((m) => m + s);
        if (b.fingers) { const f = {}; Object.entries(b.fingers).forEach(([m, v]) => { f[+m + s] = v; }); b.fingers = f; }
        if (b.roll) b.roll.events = b.roll.events.map((e) => ({ ...e, m: e.m + s }));
      });
      n.body = (n.body || '').replace(/\[([A-G][#b]?[^\]\s]{0,10})\]/g, (m, c) => (M.parseChord(c) ? '[' + M.transposeChord(c, s, fl) + ']' : m));
      n.key = to; ui.viewKey = null; markDirty(true); toast('Moved to ' + M.pretty(to));
    };
    // body
    $('#mode-read').onclick = () => { delete n._editBody; renderEditor(); };
    $('#mode-write').onclick = () => { n._editBody = true; renderEditor(); setTimeout(() => $('#body') && $('#body').focus(), 0); };
    if ($('#body')) $('#body').oninput = (e) => { n.body = e.target.value; markDirty(); };
    if ($('#body-read')) {
      $('#body-read').onclick = (e) => { if (e.target.closest('.chip,[data-open]')) return; n._editBody = true; renderEditor(); setTimeout(() => $('#body') && $('#body').focus(), 0); };
    }
    $$('.chip[data-chord]', pane).forEach((c) => c.onclick = (e) => { e.stopPropagation(); M.playChord(c.dataset.chord, { dur: 1.6 }); });
    $$('[data-open]', pane).forEach((a) => a.onclick = (e) => { e.preventDefault(); e.stopPropagation(); select(a.dataset.open); });
    // blocks
    $$('[data-add]').forEach((b) => b.onclick = () => {
      const kind = b.dataset.add;
      const blk = { id: uid('b'), kind, label: '' };
      if (kind === 'chords') Object.assign(blk, { prog: '', beats: 4 });
      if (kind === 'placement') Object.assign(blk, { lh: [], rh: [], fingers: {}, symbol: '' });
      if (kind === 'roll') blk.roll = { bpm: n.bpm || 80, events: [] };
      if (kind === 'checklist') blk.items = [{ t: '', done: false }];
      n.blocks = (n.blocks || []).concat([blk]); markDirty(true);
      setTimeout(() => { const el = $('#blk-' + blk.id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 30);
    });
    const B = (i) => n.blocks[+i];
    $$('[data-label]').forEach((inp) => inp.oninput = () => { B(inp.dataset.label).label = inp.value; markDirty(); });
    $$('[data-up]').forEach((x) => x.onclick = () => { const i = +x.dataset.up; if (i > 0) { [n.blocks[i - 1], n.blocks[i]] = [n.blocks[i], n.blocks[i - 1]]; markDirty(true); } });
    $$('[data-down]').forEach((x) => x.onclick = () => { const i = +x.dataset.down; if (i < n.blocks.length - 1) { [n.blocks[i + 1], n.blocks[i]] = [n.blocks[i], n.blocks[i + 1]]; markDirty(true); } });
    $$('[data-bdel]').forEach((x) => x.onclick = () => {
      if (!x.dataset.armed) { x.dataset.armed = '1'; x.textContent = 'Delete?'; setTimeout(() => { if (x.isConnected) { delete x.dataset.armed; x.textContent = '✕'; } }, 2500); return; }
      const [b] = n.blocks.splice(+x.dataset.bdel, 1); if (b.ref) Store.removeMedia(b.ref);
      n.comments = (n.comments || []).map((c) => (c.blockId === b.id ? { ...c, blockId: null } : c)); markDirty(true);
    });
    // chords
    $$('[data-prog]').forEach((inp) => { inp.oninput = () => { B(inp.dataset.prog).prog = inp.value; markDirty(); }; inp.onchange = () => renderEditor(); });
    $$('[data-beats]').forEach((s) => s.onchange = () => { B(s.dataset.beats).beats = +s.value; markDirty(); });
    $$('[data-playprog]').forEach((x) => x.onclick = () => {
      const i = +x.dataset.playprog, el = x.closest('.blk'), chips = $$('.chip[data-chord]', el);
      M.playProgression(chips.map((c) => c.dataset.chord), { bpm: n.bpm || 80, beats: B(i).beats || 4, style: $(`[data-style="${i}"]`).value, onStep: (k) => chips.forEach((c, j) => c.classList.toggle('on', j === k)), onEnd: () => chips.forEach((c) => c.classList.remove('on')) });
    });
    // placement
    $$('[data-hand]').forEach((x) => x.onclick = () => { placeTool.hand = x.dataset.hand; $$('[data-hand]').forEach((y) => y.setAttribute('aria-pressed', String(y.dataset.hand === placeTool.hand))); });
    $$('[data-finger]').forEach((x) => x.onclick = () => { placeTool.finger = x.dataset.finger; $$('[data-finger]').forEach((y) => y.setAttribute('aria-pressed', String(y.dataset.finger === placeTool.finger))); });
    $$('[data-placekb]').forEach((wrap) => {
      const b = B(wrap.dataset.placekb);
      $$('rect[data-m]', wrap).forEach((r) => r.addEventListener('click', () => {
        const m = +r.dataset.m;
        M.tone(m + semis, 0, 0.9);
        if (semis) { toast('Switch back to the note\'s key to edit the placement'); return; }
        const inL = b.lh.includes(m), inR = b.rh.includes(m), hand = placeTool.hand;
        b.fingers = b.fingers || {};
        const same = (hand === 'lh' ? inL : inR) && (b.fingers[m] || '') === placeTool.finger;
        b.lh = b.lh.filter((x) => x !== m); b.rh = b.rh.filter((x) => x !== m); delete b.fingers[m];
        if (!same) { b[hand].push(m); b[hand].sort((a, c) => a - c); if (placeTool.finger) b.fingers[m] = placeTool.finger; }
        markDirty(true);
      }));
    });
    $$('[data-symbol]').forEach((inp) => inp.onchange = () => { B(inp.dataset.symbol).symbol = inp.value.trim(); markDirty(true); });
    $$('[data-playplace]').forEach((x) => x.onclick = () => { const b = B(x.dataset.playplace); U.playVoicing(b.lh.map((m) => m + semis), b.rh.map((m) => m + semis)); });
    // roll
    $$('[data-playroll]').forEach((x) => x.onclick = () => { const b = B(x.dataset.playroll); U.playRoll(b.roll, x.closest('.blk').querySelector('.roll-svg'), semis); });
    $$('[data-rollbpm]').forEach((inp) => inp.onchange = () => { B(inp.dataset.rollbpm).roll.bpm = +inp.value || 80; markDirty(); });
    $$('[data-midi]').forEach((x) => x.onclick = async () => {
      ensureInput();
      const r = await rollRec.input.connectMidi();
      const st = $(`[data-rollstatus="${x.dataset.midi}"]`); if (st) st.textContent = r.message;
    });
    $$('[data-recroll]').forEach((x) => x.onclick = () => toggleRollRecord(n, B(x.dataset.recroll), x.dataset.recroll));
    if (rollRec.block) $$('.mini-input rect[data-m]', pane).forEach((r) => {
      const m = +r.dataset.m;
      r.addEventListener('pointerdown', (e) => { e.preventDefault(); liveOn(m, 96); });
      ['pointerup', 'pointerleave'].forEach((ev) => r.addEventListener(ev, () => liveOff(m)));
    });
    // audio & images
    $$('[data-ref]', pane).forEach(async (el) => { const u = await Store.url(el.dataset.ref); if (u) el.src = u; });
    $$('[data-upaudio]').forEach((inp) => inp.onchange = () => attachFile(n, B(inp.dataset.upaudio), inp.files[0], `[data-mstatus="${inp.dataset.upaudio}"]`));
    $$('[data-upimg]').forEach((inp) => inp.onchange = () => attachFile(n, B(inp.dataset.upimg), inp.files[0]));
    $$('[data-mic]').forEach((x) => x.onclick = () => toggleMic(n, B(x.dataset.mic), x.dataset.mic));
    // checklist
    $$('[data-chk]').forEach((c) => c.onchange = () => { const [i, j] = c.dataset.chk.split(':'); B(i).items[+j].done = c.checked; markDirty(); });
    $$('[data-chktxt]').forEach((c) => c.oninput = () => { const [i, j] = c.dataset.chktxt.split(':'); B(i).items[+j].t = c.value; markDirty(); });
    $$('[data-chkdel]').forEach((c) => c.onclick = (e) => { e.preventDefault(); const [i, j] = c.dataset.chkdel.split(':'); B(i).items.splice(+j, 1); markDirty(true); });
    $$('[data-chkadd]').forEach((c) => c.onclick = () => { B(c.dataset.chkadd).items.push({ t: '', done: false }); markDirty(true); setTimeout(() => { const all = $$(`[data-chktxt^="${c.dataset.chkadd}:"]`); all.length && all[all.length - 1].focus(); }, 0); });
    // comments
    $('#c-form').onsubmit = (e) => {
      e.preventDefault();
      const text = $('#c-text').value.trim(); if (!text) return;
      n.comments = (n.comments || []).concat([{ id: uid('c'), at: Date.now(), mood: $('#c-mood').value, text, blockId: $('#c-block').value || null }]);
      markDirty(true); renderList(); toast('Comment added');
    };
    $$('[data-cdel]').forEach((x) => x.onclick = () => { n.comments = n.comments.filter((c) => c.id !== x.dataset.cdel); markDirty(true); });
    $$('[data-goto]').forEach((a) => a.onclick = (e) => { e.preventDefault(); const el = $('#blk-' + a.dataset.goto); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1200); } });
    // practice
    $('#p-form').onsubmit = (e) => { e.preventDefault(); logPractice(n, +$('#p-mins').value || 0, +$('#p-bpm').value || null, $('#p-note').value.trim()); };
    $$('[data-pdel]').forEach((x) => x.onclick = () => { n.practice = n.practice.filter((p) => p.id !== x.dataset.pdel); markDirty(true); renderRail(); });
    $('#practice-btn').onclick = () => practiceMode(n);
    // links
    $('#link-add').onchange = (e) => { if (e.target.value) { n.links = (n.links || []).concat([e.target.value]); markDirty(true); } };
    $$('[data-unlink]').forEach((x) => x.onclick = () => { n.links = n.links.filter((l) => l !== x.dataset.unlink); markDirty(true); });
  }

  function logPractice(n, mins, bpm, note) {
    if (!mins) return;
    n.practice = (n.practice || []).concat([{ id: uid('p'), at: Date.now(), mins, bpm, note }]);
    if ((n.status || 'idea') === 'idea') n.status = 'practising';
    markDirty(true); renderRail(); renderList(); toast(`Logged ${mins} min`);
  }

  /* ---------- live input for piano-roll takes ---------- */
  function liveOn(m, v) {
    M.tone(m, 0, 1.0, { vel: 0.08 + v / 700 });
    if (rollRec.rec) rollRec.rec.noteOn(m, v);
    const k = $(`.mini-input rect[data-m="${m}"]`); if (k) k.style.filter = 'brightness(.75)';
  }
  function liveOff(m) {
    if (rollRec.rec) rollRec.rec.noteOff(m);
    const k = $(`.mini-input rect[data-m="${m}"]`); if (k) k.style.filter = '';
  }
  function ensureInput() {
    if (!rollRec.input) rollRec.input = U.noteInput({ on: liveOn, off: liveOff, octave: (o) => toast('Octave ' + o) }, { enabled: () => !!rollRec.block });
  }
  function toggleRollRecord(n, b, i) {
    ensureInput();
    if (rollRec.block === b.id) {
      rollRec.rec.stop();
      const q = +$(`[data-rollq="${i}"]`).value;
      const events = rollRec.rec.quantised(q);
      if (events.length) { b.roll = { bpm: rollRec.rec.bpm, events, recorded: Date.now() }; toast(`Saved a take with ${events.length} notes`); }
      rollRec.block = null; rollRec.rec = null;
      markDirty(true); return;
    }
    if (rollRec.block) { toast('Finish the other take first'); return; }
    rollRec.rec = U.rollRecorder();
    rollRec.block = b.id; rollRec.status = 'Count-in…';
    rollRec.rec.onChange = () => { const st = $(`[data-rollstatus="${i}"]`); if (st) st.textContent = `● Recording · ${rollRec.rec.events.length} notes`; };
    const bpm = +$(`[data-rollbpm="${i}"]`).value || n.bpm || 80;
    renderEditor();
    rollRec.rec.begin(bpm, true, () => { rollRec.status = '● Recording · play now'; const st = $(`[data-rollstatus="${i}"]`); if (st) st.textContent = rollRec.status; });
  }

  /* ---------- audio, images ---------- */
  async function attachFile(n, b, file, statusSel) {
    if (!file) return;
    try {
      b.ref = await Store.putMedia(file);
      b.type = file.type; if (!b.label) b.label = file.name.replace(/\.[^.]+$/, '');
      markDirty(true);
    } catch (err) {
      const why = err && err.code === 'unsupported_type' ? 'That file type is not supported here. Use WebM or M4A audio, or PNG/JPEG/WebP images.' : err && err.code === 'too_large' ? 'That file is over 20 MB.' : (err && err.message) || 'Could not save the file.';
      const st = statusSel && $(statusSel); if (st) st.textContent = why; else toast(why);
    }
  }
  async function toggleMic(n, b, i) {
    if (micRec.mr) { micRec.mr.stop(); return; }
    const st = $(`[data-mstatus="${i}"]`);
    if (!navigator.mediaDevices || !window.MediaRecorder) { st.textContent = 'This browser cannot record audio. Upload a file instead.'; return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks = [];
      const mr = new MediaRecorder(stream);
      micRec.mr = mr; micRec.block = b.id;
      mr.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        micRec.mr = null; micRec.block = null;
        const blob = new Blob(chunks, { type: (mr.mimeType || 'audio/webm').split(';')[0] });
        if (!b.label) b.label = 'Recording ' + new Date().toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
        await attachFile(n, b, blob, `[data-mstatus="${i}"]`);
      };
      mr.start();
      renderEditor();
    } catch (e) {
      st.textContent = embedded ? 'The microphone is not available in this viewer. Record on your phone and upload the file.' : 'Microphone access was refused. Allow it in your browser, or upload a file.';
    }
  }

  /* ---------- quick capture ---------- */
  async function quickAudio() {
    const n = newNote('idea');
    n.title = 'Idea ' + new Date().toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    const b = { id: uid('b'), kind: 'audio', label: '' };
    n.blocks = [b];
    await Store.add(n);
    select(n.id);
    toggleMic(n, b, 0);
  }

  /* ---------- templates ---------- */
  const TEMPLATES = [
    { id: 'improv', icon: '✦', name: 'Improvisation', desc: 'A loop to play over, a piano-roll take, and notes on what worked.', make: (n) => { n.type = 'improv'; n.body = '# Over what?\nThe loop: [C] [G] [Am] [F]\n\n# What I played\n- Scale / notes I used:\n- Rhythm idea:\n\n# Try next\n- '; n.blocks = [{ id: uid('b'), kind: 'chords', label: 'Loop', prog: 'C G Am F', beats: 4 }, { id: uid('b'), kind: 'roll', label: 'Take 1', roll: { bpm: n.bpm || 80, events: [] } }]; } },
    { id: 'movement', icon: '⇄', name: 'Chord movement', desc: 'A progression with the voicing that makes it move.', make: (n) => { n.type = 'movement'; n.body = '# The movement\nFrom [C] to [F] via …\n\n- Where I use it:\n- Bass line:\n- Inner voice that moves:'; n.blocks = [{ id: uid('b'), kind: 'chords', label: 'Movement', prog: 'C C/E F G', beats: 2 }, { id: uid('b'), kind: 'placement', label: 'Key voicing', lh: [], rh: [], fingers: {}, symbol: '' }]; } },
    { id: 'placement', icon: '✋', name: 'Hand placement', desc: 'A keyboard diagram with fingering for both hands.', make: (n) => { n.type = 'placement'; n.body = 'Where my hands sit, which fingers, and why.'; n.blocks = [{ id: uid('b'), kind: 'placement', label: 'Placement', lh: [], rh: [], fingers: {}, symbol: '' }]; } },
    { id: 'lick', icon: '〰', name: 'Lick or run', desc: 'Capture a fill or run and a checklist to learn it in all keys.', make: (n) => { n.type = 'lick'; n.body = 'Where it fits: between vocal lines over [C]'; n.blocks = [{ id: uid('b'), kind: 'roll', label: 'The lick', roll: { bpm: n.bpm || 80, events: [] } }, { id: uid('b'), kind: 'checklist', label: 'Learn it', items: ['C', 'G', 'F', 'D', 'Bb'].map((k) => ({ t: 'Play it in ' + k, done: false })) }]; } },
    { id: 'song', icon: '♫', name: 'Song arrangement', desc: 'Sections, chords and cues for a song you play.', make: (n) => { n.type = 'song'; n.body = '# Intro\n# Verse\n# Chorus\n# Bridge\n# Ending'; n.blocks = [{ id: uid('b'), kind: 'chords', label: 'Verse', prog: '', beats: 4 }, { id: uid('b'), kind: 'chords', label: 'Chorus', prog: '', beats: 4 }]; } },
    { id: 'blank', icon: '✎', name: 'Blank note', desc: 'Just write.', make: (n) => { n.type = 'idea'; } }
  ];
  function newNote(type) {
    return { id: 'note-' + uid(''), title: '', type: type || 'idea', notebook: ui.notebook || '', tags: ui.tag ? [ui.tag] : [], key: 'C', bpm: 80, status: 'idea', pinned: false, favourite: false, body: '', blocks: [], comments: [], practice: [], links: [], created: Date.now(), updated: Date.now() };
  }
  function openTemplates() {
    const dlg = $('#templates');
    dlg.innerHTML = `<div class="dlg-card" role="dialog" aria-modal="true" aria-labelledby="tpl-title"><div class="spread"><h2 id="tpl-title" style="margin:0">New note</h2><button class="icon-btn" id="tpl-close" aria-label="Close">✕</button></div>
      <div class="tpl-grid">${TEMPLATES.map((t) => `<button class="tpl" data-tpl="${t.id}"><span class="tpl-icon">${t.icon}</span><b>${t.name}</b><span class="small muted">${t.desc}</span></button>`).join('')}</div></div>`;
    dlg.hidden = false;
    const close = () => { dlg.hidden = true; };
    $('#tpl-close').onclick = close;
    dlg.onclick = (e) => { if (e.target === dlg) close(); };
    $$('[data-tpl]', dlg).forEach((b) => b.onclick = async () => {
      const t = TEMPLATES.find((x) => x.id === b.dataset.tpl);
      const n = newNote(); t.make(n); n._editBody = true;
      close();
      await Store.add(n);
      select(n.id);
      setTimeout(() => $('#title') && $('#title').focus(), 0);
    });
  }

  /* ---------- practice mode ---------- */
  function practiceMode(n) {
    const ov = $('#practice');
    const chordsBlocks = (n.blocks || []).filter((b) => b.kind === 'chords' && (b.prog || '').trim());
    const semis = viewShift(n);
    let bpm = n.bpm || 80, running = false, timer = null, start = Date.now(), elapsedTimer = null, loopIdx = 0;
    ov.innerHTML = `<div class="pm">
      <div class="spread"><div><div class="small muted">Practice mode</div><h1 style="margin:4px 0">${esc(n.title || 'Untitled')}</h1></div><button class="btn" id="pm-close">Finish</button></div>
      <div class="pm-time" id="pm-time">0:00</div>
      ${chordsBlocks.length ? `<label class="small">Loop <select id="pm-block">${chordsBlocks.map((b, i) => `<option value="${i}">${esc(b.label || 'Chords ' + (i + 1))}</option>`).join('')}</select></label><div class="chips pm-chips" id="pm-chips"></div>` : '<p class="muted">Add a chords block to loop it here. The metronome still runs.</p>'}
      <div class="row" style="justify-content:center;margin:18px 0">
        <button class="btn" id="pm-slower">−5</button><div class="pm-bpm"><b id="pm-bpm">${bpm}</b><span>bpm</span></div><button class="btn" id="pm-faster">+5</button>
      </div>
      <div class="row" style="justify-content:center"><button class="btn primary" id="pm-go">▶ Start</button><label class="small"><input type="checkbox" id="pm-chords" ${chordsBlocks.length ? 'checked' : 'disabled'}> Play chords</label></div>
      <div class="beats" id="pm-beats" style="justify-content:center"><span class="beat first"></span><span class="beat"></span><span class="beat"></span><span class="beat"></span></div>
      <p class="small muted" style="text-align:center">Tip: when it feels easy three times in a row, go up 5 bpm.</p></div>`;
    ov.hidden = false;
    const chipsFor = () => { const b = chordsBlocks[+($('#pm-block') || { value: 0 }).value]; return b ? b.prog.split(/\s+/).filter((c) => c !== '|').map((c) => tr(c, semis, ui.viewKey)) : []; };
    const drawChips = () => { if ($('#pm-chips')) $('#pm-chips').innerHTML = chipsFor().map((c) => `<span class="chip">${esc(M.pretty(c))}</span>`).join(''); };
    drawChips();
    if ($('#pm-block')) $('#pm-block').onchange = () => { loopIdx = 0; drawChips(); };
    const setBpm = (v) => { bpm = Math.max(30, Math.min(240, v)); $('#pm-bpm').textContent = bpm; };
    $('#pm-slower').onclick = () => setBpm(bpm - 5);
    $('#pm-faster').onclick = () => setBpm(bpm + 5);
    elapsedTimer = setInterval(() => { const s = Math.floor((Date.now() - start) / 1000); $('#pm-time').textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }, 500);
    let next = 0, beat = 0;
    const tick = () => {
      const c = M.audio();
      while (next < c.currentTime + 0.12) {
        const b = beat % 4, when = next;
        M.click(when, b === 0);
        const chords = chipsFor(), b0 = chordsBlocks[+($('#pm-block') || { value: 0 }).value];
        const per = (b0 && b0.beats) || 4;
        if ($('#pm-chords') && $('#pm-chords').checked && chords.length && beat % per === 0) {
          const idx = loopIdx % chords.length; loopIdx++;
          M.playChord(chords[idx], { when, dur: (60 / bpm) * per * 0.95, style: 'block' });
          setTimeout(() => $$('#pm-chips .chip').forEach((el, j) => el.classList.toggle('on', j === idx)), Math.max(0, (when - c.currentTime) * 1000));
        }
        setTimeout(() => $$('#pm-beats .beat').forEach((d, i) => d.classList.toggle('on', i === b)), Math.max(0, (when - c.currentTime) * 1000));
        next += 60 / bpm; beat++;
      }
    };
    $('#pm-go').onclick = (e) => {
      running = !running; e.target.textContent = running ? '■ Pause' : '▶ Start';
      if (running) { next = M.audio().currentTime + 0.05; beat = 0; timer = setInterval(tick, 25); } else { clearInterval(timer); M.stopAll(); }
    };
    $('#pm-close').onclick = () => {
      clearInterval(timer); clearInterval(elapsedTimer); M.stopAll();
      const mins = Math.round((Date.now() - start) / 60000);
      ov.innerHTML = `<div class="pm"><h2>Nice work 👏</h2><p>You practised for <b>${Math.max(1, mins)} min</b>. Log it?</p>
        <div class="row"><label>Minutes <input type="number" id="pmf-mins" value="${Math.max(1, mins)}" min="1" style="width:70px"></label><label>Reached <input type="number" id="pmf-bpm" value="${bpm}" style="width:70px"> bpm</label></div>
        <input type="text" id="pmf-note" placeholder="How did it go?" style="width:100%;margin-top:10px">
        <div class="row" style="margin-top:14px"><button class="btn primary" id="pmf-log">Log session</button><button class="btn ghost" id="pmf-skip">Don't log</button></div></div>`;
      $('#pmf-log').onclick = () => { ov.hidden = true; logPractice(n, +$('#pmf-mins').value || 1, +$('#pmf-bpm').value || null, $('#pmf-note').value.trim()); };
      $('#pmf-skip').onclick = () => { ov.hidden = true; };
    };
  }

  /* ---------- backup ---------- */
  async function backup() {
    const notes = JSON.parse(JSON.stringify(Store.all()));
    for (const n of notes) for (const b of n.blocks || []) {
      if (b.ref) { const blob = await Store.blob(b.ref); if (blob) b.data = await new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); }); }
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify({ app: 'riffbook', version: 1, exported: new Date().toISOString(), notes })], { type: 'application/json' }));
    a.download = 'riffbook-backup-' + new Date().toISOString().slice(0, 10) + '.json'; a.click();
    toast('Backup saved');
  }
  async function restore(file) {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data.app !== 'riffbook') throw new Error('not a backup');
      for (const n of data.notes || []) {
        for (const b of n.blocks || []) if (b.data) { b.ref = await Store.putMedia(await (await fetch(b.data)).blob()); delete b.data; }
        const existing = Store.get(n.id);
        if (existing) Object.assign(existing, n); else Store.all().push(n);
        await Store.save(Store.get(n.id));
      }
      toast(`Restored ${(data.notes || []).length} notes`); refresh();
    } catch (e) { toast('That file is not a Riffbook backup'); }
  }

  /* ---------- theme ---------- */
  function setTheme(id) {
    ui.theme = id; savePrefs();
    document.documentElement.setAttribute('data-scheme', id);
    $$('[data-theme]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.theme === id)));
  }

  /* ---------- app shell ---------- */
  function refresh(fromRail) {
    if (fromRail) { savePrefs(); document.body.classList.remove('rail-open'); }
    renderRail(); renderList();
    if (current && !Store.get(current.id)) { current = null; renderEditor(); }
  }
  document.addEventListener('keydown', (e) => {
    if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
    if (rollRec.block) return;
    if (e.key === 'n') { e.preventDefault(); openTemplates(); }
    if (e.key === '/') { e.preventDefault(); $('#q') && $('#q').focus(); }
    if (e.key === 'Escape') { $('#templates').hidden = true; document.body.classList.remove('rail-open'); }
  });
  $('#scrim').onclick = () => document.body.classList.remove('rail-open');
  window.addEventListener('beforeunload', () => { flush(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });

  setTheme(ui.theme);
  renderRail(); renderList(); renderEditor();
  Store.on((remote) => {
    const sel = (ui.selected && Store.get(ui.selected)) || null;
    const pane = $('#note-pane');
    const typing = pane.contains(document.activeElement) && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if (sel !== current) { current = sel; renderEditor(); }
    else if (remote && current && !current._dirty && !typing && !rollRec.block && !micRec.mr) renderEditor();
    renderRail();
    if (!$('#list-pane').contains(document.activeElement)) renderList();
  });
  Store.init();
  window.Riffbook = { exampleNotes };
})();
