/* Chord Library — notes, voicings, recordings and piano-roll captures */
window.LibraryModule = function (App) {
  const M = window.Music;
  const { $, $$, esc, toast } = App;
  const LEVELS = App.LEVEL_NAMES;
  const CATEGORIES = ['Triad', '7th chord', 'Extended', 'Add / Sus', 'Altered', 'Slash chord', 'Passing chord', 'Borrowed', 'Progression', 'Lick / fill', 'Other'];
  const VOICINGS = ['Close', 'Open', 'Shell', 'Rootless', 'Drop 2', 'Quartal', 'Cluster', 'Slash', 'Split', 'Polychord', 'Octave melody', 'Other'];
  const KINDS = { voicing: 'Voicing', progression: 'Progression', lick: 'Lick / fill' };
  const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const noteName = (m, flat) => M.nameOf(m % 12, flat) + (Math.floor(m / 12) - 1);
  const embedded = document.documentElement.classList.contains('embedded');

  /* ======================= Storage ======================= */
  const Store = (() => {
    let mode = 'loading', cloudColl = null, assets = null, idbP = null;
    let cache = [];
    const listeners = new Set();
    const emit = () => listeners.forEach((fn) => fn(cache));
    const urlCache = new Map();

    // --- IndexedDB (local mode) ---
    function idb() {
      if (idbP) return idbP;
      idbP = new Promise((res, rej) => {
        const r = indexedDB.open('syllabus-chord-library', 1);
        r.onupgradeneeded = () => { r.result.createObjectStore('entries', { keyPath: 'id' }); r.result.createObjectStore('media', { keyPath: 'id' }); };
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
      return idbP;
    }
    async function tx(store, fn, write) {
      const db = await idb();
      return new Promise((res, rej) => {
        const t = db.transaction(store, write ? 'readwrite' : 'readonly');
        const req = fn(t.objectStore(store));
        t.oncomplete = () => res(req && req.result);
        t.onerror = () => rej(t.error);
      });
    }
    const sortCache = () => cache.sort((a, b) => (b.updated || 0) - (a.updated || 0));

    async function initLocal() {
      mode = 'local';
      try {
        cache = (await tx('entries', (s) => s.getAll())) || [];
        let seeded = false;
        try { seeded = localStorage.getItem('chord-library-seeded') === '1'; } catch (e) { /* ignore */ }
        if (!cache.length && !seeded && window.LIBRARY_SEED) {
          const seed = window.LIBRARY_SEED();
          seed.forEach((e) => { const r = window.LIBRARY_SEED_ROLLS[e.id]; if (r) e.rolls = [r()]; });
          for (const e of seed) await tx('entries', (s) => s.put(e), true);
          cache = seed;
          try { localStorage.setItem('chord-library-seeded', '1'); } catch (e) { /* ignore */ }
        }
      } catch (err) {
        mode = 'memory';
        cache = window.LIBRARY_SEED ? window.LIBRARY_SEED() : [];
      }
      sortCache(); emit();
    }

    async function initCloud(db) {
      mode = 'cloud';
      cloudColl = db.collection('library');
      assets = await window.claude.use('assets').catch(() => null);
      let timer = setTimeout(() => { Store.loadNote = 'The shared library is taking a while to load — showing what is cached.'; emit(); }, 10000);
      cloudColl.onSnapshot((snap) => {
        if (!snap.metadata.fromCache) { clearTimeout(timer); Store.loadNote = ''; }
        cache = snap.docs.filter((d) => d.exists).map((d) => Object.assign(JSON.parse(JSON.stringify(d.data())), { id: d.id }));
        sortCache(); emit();
      }, (e) => { clearTimeout(timer); Store.loadNote = 'Could not load the shared library (' + (e && e.code || 'error') + ').'; emit(); });
    }

    async function init() {
      if (window.claude && typeof window.claude.use === 'function') {
        const db = await window.claude.use('db').catch(() => null);
        if (db) return initCloud(db);
      }
      if (window.indexedDB) return initLocal();
      mode = 'memory'; cache = window.LIBRARY_SEED ? window.LIBRARY_SEED() : []; emit();
    }

    const clean = (e) => JSON.parse(JSON.stringify(e));
    return {
      loadNote: '',
      get mode() { return mode; },
      get canUploadMedia() { return mode === 'local' || (mode === 'cloud' && !!assets); },
      ready: null,
      init() { this.ready = this.ready || init(); return this.ready; },
      all: () => cache,
      get: (id) => cache.find((e) => e.id === id),
      on(fn) { listeners.add(fn); return () => listeners.delete(fn); },
      async put(entry) {
        entry.updated = Date.now();
        if (!entry.created) entry.created = entry.updated;
        const i = cache.findIndex((e) => e.id === entry.id);
        if (i >= 0) cache[i] = entry; else cache.push(entry);
        sortCache();
        if (mode === 'cloud') { const { id, ...body } = clean(entry); await cloudColl.doc(id).set(body); }
        else if (mode === 'local') await tx('entries', (s) => s.put(clean(entry)), true);
        emit();
      },
      async remove(id) {
        const e = cache.find((x) => x.id === id);
        cache = cache.filter((x) => x.id !== id);
        if (mode === 'cloud') await cloudColl.doc(id).delete();
        else if (mode === 'local') await tx('entries', (s) => s.delete(id), true);
        if (e) for (const m of e.media || []) await this.removeMedia(m).catch(() => {});
        emit();
      },
      // Media: returns a ref string to keep on the entry
      async putMedia(blob, kind) {
        if (mode === 'cloud') {
          if (!assets) throw { code: 'not_granted', message: 'Only editors of this library can upload files.' };
          let type = (blob.type || '').split(';')[0];
          if (/^audio\/(webm|ogg)/.test(blob.type) || type === 'audio/webm') type = 'video/webm';
          else if (/^audio\/(mp4|x-m4a|m4a|aac)/.test(type)) type = 'video/mp4';
          const res = await assets.upload(blob, { type });
          return 'asset:' + res.id;
        }
        const id = uid('m');
        if (mode === 'local') await tx('media', (s) => s.put({ id, blob, kind }), true);
        else urlCache.set('idb:' + id, URL.createObjectURL(blob));
        return 'idb:' + id;
      },
      async mediaURL(ref) {
        if (urlCache.has(ref)) return urlCache.get(ref);
        let url = '';
        if (ref.startsWith('asset:')) url = '/_blob/' + ref.slice(6);
        else if (ref.startsWith('idb:') && mode === 'local') {
          const rec = await tx('media', (s) => s.get(ref.slice(4)));
          if (rec) url = URL.createObjectURL(rec.blob);
        }
        urlCache.set(ref, url);
        return url;
      },
      async mediaBlob(ref) {
        if (ref.startsWith('idb:') && mode === 'local') { const rec = await tx('media', (s) => s.get(ref.slice(4))); return rec && rec.blob; }
        return null;
      },
      async removeMedia(m) {
        if (m.ref.startsWith('asset:') && assets) await assets.delete(m.ref.slice(6)).catch(() => {});
        else if (m.ref.startsWith('idb:') && mode === 'local') await tx('media', (s) => s.delete(m.ref.slice(4)), true);
      }
    };
  })();
  App.LibraryStore = Store;

  /* ======================= Music helpers ======================= */
  const notesOf = (e) => (e.lh || []).concat(e.rh || []).slice().sort((a, b) => a - b);
  function rootPcOf(e) {
    const ch = e.symbol && M.parseChord(e.symbol);
    if (ch) return M.pcOf(ch.root);
    const n = notesOf(e);
    return n.length ? n[0] % 12 : 0;
  }
  // Suggest a chord name from the notes (bass = lowest note)
  function detectName(midis, flat) {
    const s = midis.slice().sort((a, b) => a - b);
    if (s.length < 2) return '';
    const bass = s[0] % 12;
    const pcs = s.map((m) => m % 12);
    let name = M.identify(pcs, flat, bass);
    if (name.includes('-')) {
      const upper = s.slice(1).map((m) => m % 12);
      const up = M.identify(upper, flat);
      name = up.includes('-') ? '' : up + '/' + M.nameOf(bass, flat);
    } else {
      const ch = M.parseChord(name);
      if (ch && M.pcOf(ch.root) !== bass) name += '/' + M.nameOf(bass, flat);
    }
    return name;
  }
  // Voicing presets from a chord symbol
  const PRESETS = {
    'Close (LH root)': (r, s) => ({ lh: [r - 12], rh: s.map((x) => r + (x > 12 ? x - 12 : x)) }),
    'Open 1-5-10': (r, s) => ({ lh: [r - 12, r - 5], rh: s.filter((x) => x !== 0 && x !== 7).map((x) => r + (x % 12)).concat(s.includes(4) || s.includes(3) ? [] : [r + 12]) }),
    'Worship spread (1-5-8 + 9-3-5)': (r, s) => ({ lh: [r - 24, r - 17, r - 12], rh: [r + 2, r + (s.includes(3) ? 3 : 4), r + 7] }),
    'Shell (1-3-7)': (r, s) => ({ lh: [r - 12], rh: [r + (s.includes(3) ? 3 : 4), r + (s.find((x) => x === 10 || x === 11 || x === 9) || 10)] }),
    'Rootless (3-5-7-9)': (r, s) => ({ lh: [r - 12], rh: [r + (s.includes(3) ? 3 : 4), r + (s.includes(6) ? 6 : 7), r + (s.find((x) => x === 10 || x === 11 || x === 9) || 10), r + 14] }),
    'Drop 2': (r, s) => {
      const close = s.slice(0, 4).map((x) => r + (x % 12)).sort((a, b) => a - b);
      if (close.length < 4) return PRESETS['Close (LH root)'](r, s);
      const drop = close[2] - 12;
      return { lh: [r - 12], rh: [drop, close[0], close[1], close[3]].sort((a, b) => a - b) };
    },
    'Quartal (4ths from the 3rd)': (r, s) => { const t = r + (s.includes(3) ? 3 : 4); return { lh: [r - 12], rh: [t, t + 5, t + 10, t + 15] }; },
    'Cluster (2-3-5)': (r, s) => ({ lh: [r - 12, r - 5], rh: [r + 2, r + (s.includes(3) ? 3 : 4), r + 7] })
  };
  function applyPreset(symbol, preset) {
    const ch = M.parseChord(symbol);
    if (!ch) return null;
    const r = 60 + M.pcOf(ch.root) - (M.pcOf(ch.root) > 6 ? 12 : 0);
    const v = PRESETS[preset](r, ch.semis);
    if (ch.bass) v.lh = [36 + M.pcOf(ch.bass) + (M.pcOf(ch.bass) > 7 ? 0 : 12)];
    return v;
  }
  // Spell pitch classes the way the chord symbol spells them (Cm9 gives Eb, Bb), else by key preference
  function spellerFor(sym, flat) {
    const map = {};
    const ch = sym && M.parseChord(sym);
    if (ch) { ch.notes.forEach((n) => { map[M.pcOf(n)] = n; }); if (ch.bass) map[M.pcOf(ch.bass)] = ch.bass; }
    return (pc) => map[pc] || M.nameOf(pc, flat);
  }
  const shiftFor = (fromPc, toPc) => { let d = M.mod(toPc - fromPc); return d > 6 ? d - 12 : d; };

  /* ======================= Drawing ======================= */
  const WHITE = [0, 2, 4, 5, 7, 9, 11];
  // Compact SVG keyboard with LH / RH dots
  function voicingSVG(e, opts = {}) {
    const lh = e.lh || [], rh = e.rh || [], all = lh.concat(rh);
    let lo = all.length ? Math.min(...all) : 48, hi = all.length ? Math.max(...all) : 72;
    lo = Math.floor(lo / 12) * 12; hi = Math.ceil((hi + 1) / 12) * 12 - 1;
    if (opts.from) { lo = opts.from; hi = opts.to; }
    const ww = opts.w || 14, wh = opts.h || 54;
    let x = 0, whites = '', blacks = '', dots = '';
    const pos = {};
    for (let m = lo; m <= hi; m++) { if (WHITE.includes(m % 12)) { pos[m] = x + ww / 2; x += ww; } else pos[m] = x; }
    const width = x;
    for (let m = lo; m <= hi; m++) {
      const isL = lh.includes(m), isR = rh.includes(m);
      if (WHITE.includes(m % 12)) {
        whites += `<rect x="${pos[m] - ww / 2}" y="0" width="${ww}" height="${wh}" rx="2" fill="${isL ? 'var(--s)' : isR ? 'var(--accent)' : 'var(--key-white)'}" stroke="var(--line)"/>`;
        if (m % 12 === 0 && opts.labels !== false) whites += `<text x="${pos[m]}" y="${wh - 4}" text-anchor="middle" font-size="${ww * 0.5}" fill="${isL || isR ? 'var(--accent-ink)' : '#888'}">C${Math.floor(m / 12) - 1}</text>`;
      } else {
        blacks += `<rect x="${pos[m] - ww * 0.32}" y="0" width="${ww * 0.64}" height="${wh * 0.6}" rx="1.5" fill="${isL ? 'var(--s)' : isR ? 'var(--accent)' : 'var(--key-black)'}"/>`;
      }
      if (opts.names && (isL || isR)) dots += `<text x="${pos[m]}" y="${wh + 13}" text-anchor="middle" font-size="10" font-weight="700" fill="${isL ? 'var(--s)' : 'var(--accent)'}">${M.pretty(opts.speller ? opts.speller(m % 12) : M.nameOf(m % 12, opts.flat))}</text>`;
    }
    return `<svg class="mini-kb" viewBox="0 0 ${width} ${wh + (opts.names ? 18 : 0)}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Voicing: ${esc(all.map((m) => noteName(m, opts.flat)).join(' '))}">${whites}${blacks}${dots}</svg>`;
  }

  // Piano roll as SVG
  function rollSVG(roll, opts = {}) {
    const ev = roll.events || [];
    if (!ev.length) return '<div class="empty small">No notes captured yet.</div>';
    let lo = Math.min(...ev.map((e) => e.m)) - 2, hi = Math.max(...ev.map((e) => e.m)) + 2;
    const len = Math.max(4, Math.ceil(Math.max(...ev.map((e) => e.t + e.d)) / 4) * 4);
    const row = opts.row || 9, ppb = opts.ppb || 36, gutter = 34;
    const H = (hi - lo + 1) * row, W = gutter + len * ppb;
    const split = opts.split || 60;
    let g = '';
    for (let m = lo; m <= hi; m++) {
      const y = (hi - m) * row;
      const black = !WHITE.includes(m % 12);
      g += `<rect x="${gutter}" y="${y}" width="${len * ppb}" height="${row}" fill="${black ? 'var(--surface-2)' : 'var(--surface)'}"/>`;
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
  function playRoll(roll, svgEl, semis = 0) {
    M.stopAll(); cancelAnimationFrame(rollAnim);
    const c = M.audio(); if (!c) return;
    const spb = 60 / (roll.bpm || 90), t0 = c.currentTime + 0.08;
    (roll.events || []).forEach((e) => M.tone(e.m + semis, t0 + e.t * spb, Math.max(0.1, e.d * spb), { vel: 0.12 + (e.v || 90) / 700 }));
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
    if (style === 'roll') { lh.concat(rh).sort((a, b) => a - b).forEach((m, i) => M.tone(m, t + i * 0.07, 2, { vel: 0.17 })); return; }
    if (style === 'arp') { const all = lh.concat(rh).sort((a, b) => a - b); all.forEach((m, i) => M.tone(m, t + i * 0.18, 1.6, { vel: 0.18 })); return; }
    lh.forEach((m) => M.tone(m, t, 2, { vel: 0.18, pad: style === 'pad' }));
    rh.forEach((m) => M.tone(m, t, 2, { vel: 0.14, pad: style === 'pad' }));
  }

  /* ======================= Directory ======================= */
  const GROUPS = {
    root: { label: 'Chord root', key: (e) => { const ch = M.parseChord(e.symbol || ''); return ch ? M.nameOf(M.pcOf(ch.root), /b/.test(ch.root)) : 'No symbol'; }, order: (a, b) => M.pcOf(a) - M.pcOf(b) },
    category: { label: 'Chord type', key: (e) => e.category || 'Other', order: (a, b) => CATEGORIES.indexOf(a) - CATEGORIES.indexOf(b) },
    voicing: { label: 'Voicing', key: (e) => e.voicingType || 'Other', order: (a, b) => VOICINGS.indexOf(a) - VOICINGS.indexOf(b) },
    tag: { label: 'Application tag', multi: (e) => (e.tags && e.tags.length ? e.tags : ['untagged']), order: (a, b) => a.localeCompare(b) },
    lesson: { label: 'Syllabus lesson', multi: (e) => (e.related && e.related.length ? e.related.filter((r) => App.byId[r]) : ['none']), name: (k) => (App.byId[k] ? App.byId[k].title : 'Not linked'), order: (a, b) => (App.byId[a] ? App.byId[a].title : 'zz').localeCompare(App.byId[b] ? App.byId[b].title : 'zz') },
    level: { label: 'Level', key: (e) => String(e.level || 1), name: (k) => LEVELS[k], order: (a, b) => a - b }
  };
  const ui = { group: 'category', groupVal: '', q: '', kind: '' };
  try { Object.assign(ui, JSON.parse(localStorage.getItem('chord-library-ui') || '{}')); } catch (e) { /* ignore */ }
  const saveUi = () => { try { localStorage.setItem('chord-library-ui', JSON.stringify(ui)); } catch (e) { /* ignore */ } };
  const keysOf = (e, g) => (GROUPS[g].multi ? GROUPS[g].multi(e) : [GROUPS[g].key(e)]);

  function card(e) {
    const media = e.media || [];
    const audio = media.filter((m) => m.kind === 'audio').length, img = media.filter((m) => m.kind === 'image').length, rolls = (e.rolls || []).length;
    return `<a class="lib-card" href="#/library/${encodeURIComponent(e.id)}">
      <div class="lib-kb">${voicingSVG(e, { w: 12, h: 46, labels: false })}</div>
      <div class="lib-card-body">
        <div class="row" style="gap:6px"><span class="sym">${esc(M.pretty(e.symbol || '—'))}</span><span class="pill">${esc(KINDS[e.kind] || 'Voicing')}</span>${e.voicingType ? `<span class="pill">${esc(e.voicingType)}</span>` : ''}</div>
        <h3>${esc(e.name || 'Untitled')}</h3>
        ${e.application ? `<p>${esc(e.application.slice(0, 110))}${e.application.length > 110 ? '…' : ''}</p>` : ''}
        <div class="lib-meta">${rolls ? `<span title="Piano-roll captures">▦ ${rolls}</span>` : ''}${audio ? `<span title="Recordings">🎙 ${audio}</span>` : ''}${img ? `<span title="Images">🖼 ${img}</span>` : ''}${(e.tags || []).slice(0, 3).map((t) => `<span class="tag">#${esc(t)}</span>`).join('')}</div>
      </div></a>`;
  }

  function modeBadge() {
    const m = Store.mode;
    return m === 'cloud' ? '<span class="pill" title="Entries are saved in this artifact\'s shared library">☁ Shared library</span>'
      : m === 'local' ? '<span class="pill" title="Entries, recordings and captures are saved in this browser">💾 Saved in this browser</span>'
        : m === 'memory' ? '<span class="pill" style="color:var(--d)">Not saved — storage unavailable</span>' : '<span class="pill">Loading…</span>';
  }

  function renderDirectory() {
    const v = App.view;
    v.innerHTML = `
      <div class="spread"><div><h1 style="margin-bottom:4px">Chord Library</h1><p class="muted" style="margin:0">Your directory of chords, voicings, licks and progressions, with notes, recordings and piano-roll captures.</p></div>
        <div class="row">${modeBadge()}<a class="btn primary" href="#/library/new">＋ New entry</a></div></div>
      <div id="lib-note" class="small muted" style="margin-top:6px"></div>
      <div class="lib-layout">
        <aside class="lib-tree card">
          <label class="small muted" for="lib-group">Organise by</label>
          <select id="lib-group" style="width:100%;margin:6px 0 10px">${Object.entries(GROUPS).map(([k, g]) => `<option value="${k}" ${k === ui.group ? 'selected' : ''}>${g.label}</option>`).join('')}</select>
          <div id="lib-groups" class="lib-groups"></div>
          ${Store.mode === 'local' && !embedded ? `<div class="lib-io"><button class="btn sm" id="lib-export">⬇ Back up library</button><label class="btn sm">⬆ Restore<input type="file" id="lib-import" accept=".json" hidden></label></div>` : ''}
        </aside>
        <section>
          <div class="filters">
            <input type="search" id="lib-q" placeholder="Search name, chord, notes, application…" value="${esc(ui.q)}" aria-label="Search the library">
            <select id="lib-kind" aria-label="Entry type"><option value="">All types</option>${Object.entries(KINDS).map(([k, n]) => `<option value="${k}" ${k === ui.kind ? 'selected' : ''}>${n}</option>`).join('')}</select>
          </div>
          <div id="lib-heading" class="small muted" style="margin:6px 0 12px"></div>
          <div id="lib-grid" class="lib-grid"></div>
        </section>
      </div>`;
    const draw = () => {
      const all = Store.all();
      $('#lib-note').textContent = Store.loadNote || '';
      const g = GROUPS[ui.group];
      const counts = {};
      all.forEach((e) => keysOf(e, ui.group).forEach((k) => { counts[k] = (counts[k] || 0) + 1; }));
      const keys = Object.keys(counts).sort(g.order);
      if (ui.groupVal && !counts[ui.groupVal]) ui.groupVal = '';
      $('#lib-groups').innerHTML = `<button class="lib-group ${!ui.groupVal ? 'on' : ''}" data-g="">All entries <b>${all.length}</b></button>` +
        keys.map((k) => `<button class="lib-group ${k === ui.groupVal ? 'on' : ''}" data-g="${esc(k)}">${esc(g.name ? g.name(k) : (ui.group === 'root' ? M.pretty(k) : k))} <b>${counts[k]}</b></button>`).join('');
      $$('#lib-groups [data-g]').forEach((b) => b.onclick = () => { ui.groupVal = b.dataset.g; saveUi(); draw(); });
      const q = ui.q.trim().toLowerCase();
      const list = all.filter((e) => (!ui.kind || (e.kind || 'voicing') === ui.kind) &&
        (!ui.groupVal || keysOf(e, ui.group).includes(ui.groupVal)) &&
        (!q || [e.name, e.symbol, e.notes, e.application, e.progression, e.voicingType, e.category, (e.tags || []).join(' ')].join(' ').toLowerCase().includes(q)));
      $('#lib-heading').textContent = `${list.length} ${list.length === 1 ? 'entry' : 'entries'}${ui.groupVal ? ' · ' + (g.name ? g.name(ui.groupVal) : ui.groupVal) : ''}`;
      $('#lib-grid').innerHTML = list.length ? list.map(card).join('') : (Store.mode === 'loading' ? '<div class="empty">Loading your library…</div>'
        : all.length ? '<div class="empty">Nothing matches. Clear the search or pick another group.</div>'
          : '<div class="empty"><b>Your library is empty.</b><br>Add your first chord with <a href="#/library/new">＋ New entry</a>: build a voicing, record yourself or capture a piano roll.</div>');
    };
    $('#lib-group').onchange = (e) => { ui.group = e.target.value; ui.groupVal = ''; saveUi(); draw(); };
    $('#lib-q').oninput = (e) => { ui.q = e.target.value; saveUi(); draw(); };
    $('#lib-kind').onchange = (e) => { ui.kind = e.target.value; saveUi(); draw(); };
    if ($('#lib-export')) {
      $('#lib-export').onclick = exportLibrary;
      $('#lib-import').onchange = (e) => importLibrary(e.target.files[0]).then(draw);
    }
    const off = Store.on(draw);
    window.addEventListener('hashchange', off, { once: true });
    draw();
  }

  async function exportLibrary() {
    const entries = JSON.parse(JSON.stringify(Store.all()));
    for (const e of entries) for (const m of e.media || []) {
      const blob = await Store.mediaBlob(m.ref);
      if (blob) m.data = await new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); });
    }
    const blob = new Blob([JSON.stringify({ app: 'syllabus-studio-chord-library', version: 1, exported: new Date().toISOString(), entries })], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'chord-library-backup.json'; a.click();
    toast('Library backed up');
  }
  async function importLibrary(file) {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      for (const e of data.entries || []) {
        for (const m of e.media || []) {
          if (m.data) { const blob = await (await fetch(m.data)).blob(); m.ref = await Store.putMedia(blob, m.kind); delete m.data; }
        }
        await Store.put(e);
      }
      toast(`Restored ${(data.entries || []).length} entries`);
    } catch (err) { toast('That file is not a chord library backup'); }
  }

  /* ======================= Detail ======================= */
  function renderDetail(id) {
    const v = App.view;
    const draw = () => {
      const e = Store.get(id);
      if (!e) { v.innerHTML = Store.mode === 'loading' ? '<div class="empty">Loading…</div>' : '<div class="empty">This entry was not found. <a href="#/library">Back to the library</a></div>'; return; }
      const rootPc = rootPcOf(e);
      const k = M.KEYS[App.state.key];
      const semis = App.state.libTranspose ? shiftFor(rootPc, k.pc) : 0;
      const kFlat = k.flat || k.pc === 0;
      const lh = (e.lh || []).map((m) => m + semis), rh = (e.rh || []).map((m) => m + semis);
      const sym = semis && e.symbol ? M.transposeChord(e.symbol, semis, kFlat) : e.symbol;
      const flat = semis ? kFlat : /b/.test(e.symbol || '');
      const spellPc = spellerFor(sym, flat);
      const nm = (m) => M.pretty(spellPc(m % 12) + (Math.floor(m / 12) - 1));
      const prog = (e.progression || '').trim();
      const audio = (e.media || []).filter((m) => m.kind === 'audio'), imgs = (e.media || []).filter((m) => m.kind === 'image');
      v.innerHTML = `
        <div class="crumbs"><a href="#/library">Chord Library</a> / ${esc(e.category || 'Entry')}</div>
        <div class="topic-hero lib-hero" style="--h:200">
          <div class="spread">
            <div><div class="row"><span class="pill">${esc(KINDS[e.kind] || 'Voicing')}</span>${e.voicingType ? `<span class="pill">${esc(e.voicingType)}</span>` : ''}${e.category ? `<span class="pill">${esc(e.category)}</span>` : ''}<span class="pill lvl-${e.level || 1}">${LEVELS[e.level || 1]}</span></div>
              <h1 style="margin:10px 0 4px">${esc(e.name)}</h1>
              <div class="sym big">${esc(M.pretty(sym || '—'))}</div></div>
            <div class="row no-print"><a class="btn" href="#/library/edit/${encodeURIComponent(e.id)}">✎ Edit</a><button class="btn ghost" id="lib-del">Delete</button></div>
          </div>
        </div>
        <div class="topic-layout">
          <div>
            <div class="section">
              <div class="spread"><h2 style="margin:0">Voicing</h2>
                <div class="row"><button class="btn sm primary" data-pv="block">▶ Play</button><button class="btn sm" data-pv="roll">Roll</button><button class="btn sm" data-pv="arp">Arpeggio</button><button class="btn sm" data-pv="pad">Pad</button></div></div>
              <div class="lib-big-kb">${voicingSVG({ lh, rh }, { w: 26, h: 110, names: true, flat, speller: spellPc })}</div>
              <div class="row small" style="margin-top:8px"><span><span class="hand-dot lh"></span>Left hand: <b>${lh.map(nm).join(' · ') || '—'}</b></span><span><span class="hand-dot rh"></span>Right hand: <b>${rh.map(nm).join(' · ') || '—'}</b></span></div>
              <div class="callout" style="margin-top:12px">
                <label class="row small"><input type="checkbox" id="lib-tr" ${App.state.libTranspose ? 'checked' : ''}> Transpose this entry to the key of <b>${M.pretty(k.name)}</b></label>
                <div style="margin-top:8px">${App.keyChooser()}</div>
              </div>
            </div>
            ${e.notes ? `<div class="section"><h2>Notes</h2><div class="prose">${fmt(e.notes)}</div></div>` : ''}
            ${e.application || prog ? `<div class="section"><h2>Application</h2>${e.application ? `<div class="prose">${fmt(e.application)}</div>` : ''}
              ${prog ? `<div class="ex" style="margin-top:12px"><div class="spread"><span class="ex-label">In context</span><button class="btn sm" id="lib-prog-play">▶ Play</button></div><div class="chips" id="lib-prog">${prog.split(/\s+/).map((c) => { const s = semis ? M.transposeChord(c, semis, kFlat) : c; return c === '|' ? '<span class="chip bar">|</span>' : `<button class="chip" data-chord="${esc(s)}">${esc(M.pretty(s))}</button>`; }).join('')}</div></div>` : ''}
            </div>` : ''}
            <div class="section"><div class="spread"><h2 style="margin:0">Piano-roll captures</h2><a class="btn sm no-print" href="#/library/edit/${encodeURIComponent(e.id)}#capture">＋ Capture</a></div>
              ${(e.rolls || []).length ? e.rolls.map((r, i) => `<div class="roll-item"><div class="spread"><span class="ex-label">${esc(r.name || 'Capture ' + (i + 1))} <span class="small muted">· ${r.events.length} notes · ${r.bpm} bpm</span></span><button class="btn sm" data-roll="${i}">▶ Play</button></div>${rollSVG(semis ? { ...r, events: r.events.map((x) => ({ ...x, m: x.m + semis })) } : r)}</div>`).join('') : '<p class="muted small">No captures yet. Play the voicing or progression into the editor to save a piano roll.</p>'}
            </div>
            <div class="section"><div class="spread"><h2 style="margin:0">Recordings</h2><a class="btn sm no-print" href="#/library/edit/${encodeURIComponent(e.id)}#media">＋ Add</a></div>
              ${audio.length ? audio.map((m) => `<div class="media-row"><div class="small"><b>${esc(m.name || 'Recording')}</b> <span class="muted">${m.created ? new Date(m.created).toLocaleDateString() : ''}</span></div><audio controls preload="none" data-ref="${esc(m.ref)}"></audio></div>`).join('') : '<p class="muted small">No recordings yet.</p>'}
              ${imgs.length ? `<h3 style="margin-top:14px">Images</h3><div class="img-grid">${imgs.map((m) => `<figure><img alt="${esc(m.name || 'Image')}" data-ref="${esc(m.ref)}"><figcaption class="small muted">${esc(m.name || '')}</figcaption></figure>`).join('')}</div>` : ''}
            </div>
          </div>
          <aside class="side-panel">
            <div class="card"><h3>Details</h3><div class="small stack">
              <div><span class="muted">Chord:</span> ${esc(M.pretty(e.symbol || '—'))}${(() => { const ch = M.parseChord(e.symbol || ''); return ch ? ` <span class="muted">(${ch.type.name}: ${ch.notes.map(M.pretty).join(' ')})</span>` : ''; })()}</div>
              <div><span class="muted">Updated:</span> ${e.updated ? new Date(e.updated).toLocaleString() : '—'}</div>
              ${(e.tags || []).length ? `<div class="row" style="gap:6px">${e.tags.map((t) => `<span class="tag">#${esc(t)}</span>`).join('')}</div>` : ''}
            </div></div>
            ${(e.related || []).filter((r) => App.byId[r]).length ? `<div class="card"><h3>Syllabus lessons</h3><div class="stack small">${e.related.filter((r) => App.byId[r]).map((r) => `<div><a href="#/topic/${r}">${esc(App.byId[r].title)}</a></div>`).join('')}</div></div>` : ''}
            <div class="card"><h3>Similar entries</h3><div class="stack small">${Store.all().filter((x) => x.id !== e.id && (x.voicingType === e.voicingType || (x.tags || []).some((t) => (e.tags || []).includes(t)))).slice(0, 5).map((x) => `<div><a href="#/library/${encodeURIComponent(x.id)}">${esc(x.name)}</a></div>`).join('') || '<span class="muted">None yet</span>'}</div></div>
          </aside>
        </div>`;
      $$('[data-pv]').forEach((b) => b.onclick = () => playVoicing(lh, rh, b.dataset.pv));
      $$('[data-roll]').forEach((b) => b.onclick = () => playRoll(e.rolls[+b.dataset.roll], b.closest('.roll-item').querySelector('svg'), semis));
      $('#lib-tr').onchange = (ev) => { App.state.libTranspose = ev.target.checked; App.save(); draw(); };
      App.bindKeyChooser(v, () => { App.state.libTranspose = true; App.save(); draw(); });
      if ($('#lib-prog')) {
        App.bindChips($('#lib-prog'));
        $('#lib-prog-play').onclick = () => { const chips = $$('#lib-prog .chip[data-chord]'); M.playProgression(chips.map((c) => c.dataset.chord), { bpm: 76, beats: 4, onStep: (i) => chips.forEach((c, j) => c.classList.toggle('on', i === j)) }); };
      }
      $$('[data-ref]').forEach(async (el) => { const url = await Store.mediaURL(el.dataset.ref); if (url) el.src = url; });
      $('#lib-del').onclick = (ev) => {
        if (!ev.target.dataset.armed) { ev.target.dataset.armed = '1'; ev.target.textContent = 'Tap again to delete'; setTimeout(() => { if (ev.target.isConnected) { delete ev.target.dataset.armed; ev.target.textContent = 'Delete'; } }, 3000); return; }
        Store.remove(e.id).then(() => { toast('Entry deleted'); location.hash = '#/library'; }).catch((err) => toast('Could not delete: ' + (err.message || err.code || 'error')));
      };
    };
    let shown = null;
    const draw0 = draw;
    const off = Store.on(() => { const cur = Store.get(id); const stamp = cur ? cur.updated : 'none'; if (stamp !== shown) { shown = stamp; draw0(); } });
    shown = Store.get(id) ? Store.get(id).updated : (Store.mode === 'loading' ? undefined : 'none');
    window.addEventListener('hashchange', off, { once: true });
    draw();
  }
  const fmt = (t) => esc(t).split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');

  /* ======================= Editor ======================= */
  const KEYMAP = { a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11, k: 12, o: 13, l: 14, p: 15, ';': 16 };

  function renderEditor(id) {
    const v = App.view;
    const existing = id && Store.get(id);
    if (id && !existing) {
      v.innerHTML = Store.mode === 'loading' ? '<div class="empty">Loading…</div>' : '<div class="empty">Entry not found. <a href="#/library">Back to the library</a></div>';
      if (Store.mode === 'loading') { const off = Store.on(() => { off(); renderEditor(id); }); }
      return;
    }
    const e = existing ? JSON.parse(JSON.stringify(existing)) : { id: uid('e'), kind: 'voicing', name: '', symbol: '', category: 'Triad', voicingType: 'Close', level: 2, lh: [], rh: [], tags: [], notes: '', application: '', progression: '', rolls: [], media: [], related: [] };
    let split = 60, octave = 0, mode = 'build', held = new Set(), grabbed = new Set();
    const rec = { on: false, start: 0, active: new Map(), events: [], bpm: 80, metro: true, timer: null };
    let midiAccess = null, mediaRec = null;
    let dirty = false;
    const markDirty = () => { dirty = true; };

    v.innerHTML = `
      <div class="crumbs"><a href="#/library">Chord Library</a> / ${existing ? 'Edit entry' : 'New entry'}</div>
      <div class="spread"><h1 style="margin:0">${existing ? 'Edit entry' : 'New entry'}</h1>
        <div class="row"><a class="btn ghost" href="${existing ? '#/library/' + encodeURIComponent(e.id) : '#/library'}">Cancel</a><button class="btn primary" id="ed-save">Save entry</button></div></div>
      <div id="ed-err" class="small" style="color:var(--d);margin-top:6px"></div>
      <div class="section" style="margin-top:14px">
        <h2>About this entry</h2>
        <div class="form-grid">
          <label class="fld wide"><span>Name</span><input type="text" id="ed-name" value="${esc(e.name)}" placeholder="e.g. Cadd9 — open worship spread"></label>
          <label class="fld"><span>Chord symbol</span><input type="text" id="ed-symbol" value="${esc(e.symbol)}" placeholder="Cadd9, F/A, Dm9…"><small id="ed-sym-help" class="muted"></small></label>
          <label class="fld"><span>Type</span><select id="ed-kind">${Object.entries(KINDS).map(([k, n]) => `<option value="${k}" ${k === e.kind ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
          <label class="fld"><span>Chord type</span><select id="ed-category">${CATEGORIES.map((c) => `<option ${c === e.category ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
          <label class="fld"><span>Voicing</span><select id="ed-voicing">${VOICINGS.map((c) => `<option ${c === e.voicingType ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
          <label class="fld"><span>Level</span><select id="ed-level">${[1, 2, 3, 4].map((l) => `<option value="${l}" ${l === e.level ? 'selected' : ''}>${LEVELS[l]}</option>`).join('')}</select></label>
          <label class="fld wide"><span>Tags <small class="muted">(comma-separated: worship, ending, pad…)</small></span><input type="text" id="ed-tags" value="${esc((e.tags || []).join(', '))}"></label>
        </div>
      </div>

      <div class="section">
        <div class="spread"><h2 style="margin:0">Voicing</h2>
          <div class="row"><button class="btn sm" id="ed-play">▶ Hear it</button><button class="btn sm ghost" id="ed-clear">Clear notes</button></div></div>
        <p class="small muted">Tap keys to add or remove notes. Notes below the split point are the left hand (blue), above it the right hand. You can also hold a chord on your computer keys or MIDI keyboard; it's grabbed when you let go.</p>
        <div class="row small" style="margin-bottom:10px">
          <label>Split at <select id="ed-split">${[48, 53, 55, 57, 60, 62, 64].map((m) => `<option value="${m}" ${m === 60 ? 'selected' : ''}>${noteName(m)}</option>`).join('')}</select></label>
          <label>Build from symbol <select id="ed-preset"><option value="">Choose a voicing style…</option>${Object.keys(PRESETS).map((p) => `<option>${p}</option>`).join('')}</select></label>
          <span id="ed-detect" class="muted"></span>
        </div>
        <div class="lib-input-kb" id="ed-kb">${App.pianoHTML(36, 96)}</div>
        <div id="ed-notes" class="small" style="margin-top:8px"></div>
      </div>

      <div class="section" id="capture">
        <div class="spread"><h2 style="margin:0">Piano-roll capture</h2><span class="small muted" id="cap-status">Ready</span></div>
        <p class="small muted">Press Record, then play: tap the keyboard above, use your computer keys (<code>A W S E D F T G Y H U J K</code> = one octave from C, <code>Z</code>/<code>X</code> shift octave), or a MIDI keyboard. A one-bar count-in plays first.</p>
        <div class="row small">
          <button class="btn primary" id="cap-rec">● Record</button>
          <label>Tempo <input type="number" id="cap-bpm" value="80" min="40" max="200" style="width:74px"> bpm</label>
          <label><input type="checkbox" id="cap-metro" checked> Click</label>
          <label>Quantise <select id="cap-q"><option value="0">Off</option><option value="0.25">1/16</option><option value="0.5" selected>1/8</option><option value="1">1/4</option></select></label>
          <button class="btn sm" id="midi-btn">🎹 Connect MIDI keyboard</button>
          <span id="midi-status" class="muted"></span>
        </div>
        <div id="cap-preview" style="margin-top:12px"></div>
        <div id="ed-rolls" style="margin-top:12px"></div>
      </div>

      <div class="section" id="media">
        <h2>Recordings & images</h2>
        <div class="row small">
          <button class="btn" id="mic-btn">🎙 Record from microphone</button>
          <label class="btn">⬆ Upload audio<input type="file" id="up-audio" accept="audio/*,video/webm,video/mp4,.m4a,.webm" hidden></label>
          <label class="btn">🖼 Add image<input type="file" id="up-img" accept="image/png,image/jpeg,image/gif,image/webp" hidden></label>
          <span id="media-status" class="muted"></span>
        </div>
        <p class="small muted">Images can be photos of a chart or screenshots of a piano roll from your DAW.${Store.mode === 'cloud' ? ' Audio uploads here must be WebM or M4A/MP4 files.' : ''}</p>
        <div id="ed-media" style="margin-top:10px"></div>
      </div>

      <div class="section">
        <h2>Notes & application</h2>
        <label class="fld wide"><span>Notes — theory, fingering, how it's built</span><textarea id="ed-notes-txt" rows="5">${esc(e.notes || '')}</textarea></label>
        <label class="fld wide" style="margin-top:12px"><span>Application — where and when to use it</span><textarea id="ed-app" rows="4">${esc(e.application || '')}</textarea></label>
        <label class="fld wide" style="margin-top:12px"><span>Progression in context <small class="muted">(chord symbols separated by spaces — playable and transposable)</small></span><input type="text" id="ed-prog" value="${esc(e.progression || '')}" placeholder="Cadd9 G/B Am7 Fmaj9"></label>
        <div class="fld wide" style="margin-top:12px"><span>Linked syllabus lessons</span>
          <div class="row"><select id="ed-rel-sel" style="flex:1;min-width:0"><option value="">Add a lesson…</option>${App.TOPICS.map((t) => `<option value="${t.id}">${esc(t.title)}</option>`).join('')}</select></div>
          <div id="ed-rel" class="row" style="margin-top:8px;gap:6px"></div></div>
      </div>
      <div class="row" style="justify-content:flex-end"><button class="btn primary" id="ed-save2">Save entry</button></div>`;

    const kbRoot = $('#ed-kb');
    kbRoot.addEventListener('pointerdown', () => { const a = document.activeElement; if (a && a !== document.body && a.blur) a.blur(); });
    const flat = () => /b/.test(($('#ed-symbol').value || '').slice(0, 2));
    function drawVoicing() {
      const all = notesOf(e);
      App.highlight(kbRoot, []);
      $$('.piano [data-midi]', kbRoot).forEach((k) => { const m = +k.dataset.midi; k.classList.toggle('on', all.includes(m)); k.classList.toggle('lhk', (e.lh || []).includes(m)); });
      $('#ed-notes').innerHTML = all.length ? `<span class="hand-dot lh"></span>LH <b>${(e.lh || []).map((m) => M.pretty(noteName(m, flat()))).join(' · ') || '—'}</b> &nbsp; <span class="hand-dot rh"></span>RH <b>${(e.rh || []).map((m) => M.pretty(noteName(m, flat()))).join(' · ') || '—'}</b>` : '<span class="muted">No notes yet.</span>';
      const guess = detectName(all, flat());
      $('#ed-detect').innerHTML = guess ? `Sounds like <b>${esc(M.pretty(guess))}</b>${$('#ed-symbol').value.trim() !== guess ? ` <button class="btn sm" id="ed-use">Use name</button>` : ''}` : '';
      if ($('#ed-use')) $('#ed-use').onclick = () => { $('#ed-symbol').value = guess; symHelp(); drawVoicing(); markDirty(); };
    }
    function setNotes(midis) {
      const s = Array.from(new Set(midis)).sort((a, b) => a - b);
      e.lh = s.filter((m) => m < split); e.rh = s.filter((m) => m >= split);
      markDirty(); drawVoicing();
    }
    function symHelp() {
      const s = $('#ed-symbol').value.trim();
      const ch = s && M.parseChord(s);
      $('#ed-sym-help').textContent = !s ? '' : ch ? `${ch.type.name}: ${ch.notes.join(' ')}` : 'Not a chord symbol the app knows (still saved as text)';
    }
    function drawRolls() {
      $('#ed-rolls').innerHTML = (e.rolls || []).map((r, i) => `<div class="roll-item"><div class="spread"><input type="text" value="${esc(r.name || 'Capture ' + (i + 1))}" data-rname="${i}" aria-label="Capture name" style="flex:1;min-width:0"><span class="row"><button class="btn sm" data-rplay="${i}">▶</button><button class="btn sm ghost" data-rdel="${i}">Remove</button></span></div>${rollSVG(r, { row: 7, ppb: 28 })}</div>`).join('');
      $$('[data-rplay]').forEach((b) => b.onclick = () => playRoll(e.rolls[+b.dataset.rplay], b.closest('.roll-item').querySelector('svg')));
      $$('[data-rdel]').forEach((b) => b.onclick = () => { e.rolls.splice(+b.dataset.rdel, 1); markDirty(); drawRolls(); });
      $$('[data-rname]').forEach((inp) => inp.oninput = () => { e.rolls[+inp.dataset.rname].name = inp.value; markDirty(); });
    }
    async function drawMedia() {
      $('#ed-media').innerHTML = (e.media || []).map((m, i) => `<div class="media-row"><div class="row" style="gap:8px">${m.kind === 'image' ? '🖼' : '🎙'}<input type="text" value="${esc(m.name || '')}" data-mname="${i}" aria-label="Name" style="flex:1;min-width:0"><button class="btn sm ghost" data-mdel="${i}">Remove</button></div>${m.kind === 'image' ? `<img alt="" data-ref="${esc(m.ref)}" style="max-height:160px;border-radius:8px;margin-top:6px">` : `<audio controls preload="none" data-ref="${esc(m.ref)}"></audio>`}</div>`).join('') || '<p class="muted small">Nothing added yet.</p>';
      $$('[data-mname]').forEach((inp) => inp.oninput = () => { e.media[+inp.dataset.mname].name = inp.value; markDirty(); });
      $$('[data-mdel]').forEach((b) => b.onclick = () => { const [m] = e.media.splice(+b.dataset.mdel, 1); e._removed = (e._removed || []).concat([m]); markDirty(); drawMedia(); });
      $$('#ed-media [data-ref]').forEach(async (el) => { const url = await Store.mediaURL(el.dataset.ref); if (url) el.src = url; });
    }
    function drawRelated() {
      $('#ed-rel').innerHTML = (e.related || []).filter((r) => App.byId[r]).map((r) => `<span class="pill">${esc(App.byId[r].title)} <button class="x" data-relx="${r}" aria-label="Remove">✕</button></span>`).join('') || '<span class="small muted">None linked.</span>';
      $$('[data-relx]').forEach((b) => b.onclick = () => { e.related = e.related.filter((r) => r !== b.dataset.relx); markDirty(); drawRelated(); });
    }

    /* --- note input: on-screen, computer keys, MIDI --- */
    function noteOn(m, vel = 96) {
      M.tone(m, 0, 1.1, { vel: 0.08 + vel / 700 });
      const key = $(`.piano [data-midi="${m}"]`, kbRoot); if (key) key.classList.add('hit');
      if (rec.on) rec.active.set(m, { t: performance.now(), v: vel });
      held.add(m); grabbed.add(m);
    }
    function noteOff(m) {
      const key = $(`.piano [data-midi="${m}"]`, kbRoot); if (key) key.classList.remove('hit');
      held.delete(m);
      if (rec.on && rec.active.has(m)) {
        const a = rec.active.get(m); rec.active.delete(m);
        const spb = 60000 / rec.bpm;
        rec.events.push({ m, t: Math.max(0, (a.t - rec.start) / spb), d: Math.max(0.05, (performance.now() - a.t) / spb), v: a.v });
        drawPreview();
      }
      if (!rec.on && held.size === 0 && grabbed.size > 1) { setNotes(Array.from(grabbed)); toast('Voicing grabbed'); }
      if (held.size === 0) grabbed.clear();
    }
    // On-screen keyboard: tap toggles notes in the voicing; while recording it plays notes into the roll
    $$('.piano [data-midi]', kbRoot).forEach((k) => {
      const m = +k.dataset.midi;
      k.addEventListener('pointerdown', (ev) => {
        ev.preventDefault();
        if (rec.on) { noteOn(m); k.setPointerCapture && k.setPointerCapture(ev.pointerId); return; }
        M.tone(m, 0, 0.9);
        const all = notesOf(e);
        setNotes(all.includes(m) ? all.filter((x) => x !== m) : all.concat([m]));
      });
      const up = () => { if (rec.on && rec.active.has(m)) noteOff(m); };
      k.addEventListener('pointerup', up); k.addEventListener('pointercancel', up);
    });
    const onKeyDown = (ev) => {
      if (/INPUT|TEXTAREA|SELECT/.test((ev.target.tagName || '')) || ev.metaKey || ev.ctrlKey || ev.altKey || ev.repeat) return;
      const kk = ev.key.toLowerCase();
      if (kk === 'z') { octave = Math.max(-2, octave - 1); toast('Octave ' + (4 + octave)); return; }
      if (kk === 'x') { octave = Math.min(2, octave + 1); toast('Octave ' + (4 + octave)); return; }
      if (kk in KEYMAP) { ev.preventDefault(); noteOn(60 + octave * 12 + KEYMAP[kk]); }
    };
    const onKeyUp = (ev) => { const kk = ev.key.toLowerCase(); if (kk in KEYMAP) noteOff(60 + octave * 12 + KEYMAP[kk]); };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    $('#midi-btn').onclick = async () => {
      if (!navigator.requestMIDIAccess) { $('#midi-status').textContent = 'This browser has no MIDI support. Try Chrome or Edge, or use the computer keys.'; return; }
      try {
        midiAccess = await navigator.requestMIDIAccess();
        const hook = () => {
          let n = 0;
          midiAccess.inputs.forEach((inp) => { n++; inp.onmidimessage = (msg) => { const [st, note, vel] = msg.data; const cmd = st & 0xf0; if (cmd === 0x90 && vel > 0) noteOn(note, vel); else if (cmd === 0x80 || (cmd === 0x90 && vel === 0)) noteOff(note); }; });
          $('#midi-status').textContent = n ? `Connected: ${Array.from(midiAccess.inputs.values()).map((i) => i.name).join(', ')}` : 'No MIDI keyboard found. Plug one in and it will connect.';
        };
        midiAccess.onstatechange = hook; hook();
      } catch (err) { $('#midi-status').textContent = 'MIDI access is blocked here. Use the computer keys or the on-screen keyboard.'; }
    };

    /* --- piano-roll recording --- */
    function quantise(events) {
      const q = +$('#cap-q').value;
      if (!q) return events.map((x) => ({ ...x, t: +x.t.toFixed(3), d: +x.d.toFixed(3) }));
      return events.map((x) => ({ m: x.m, v: x.v, t: Math.round(x.t / q) * q, d: Math.max(q, Math.round(x.d / q) * q) }));
    }
    function drawPreview() {
      if (!rec.events.length && !rec.on) { $('#cap-preview').innerHTML = ''; return; }
      $('#cap-preview').innerHTML = `<div class="roll-item recording"><div class="small muted">${rec.on ? '● Recording…' : 'Take ready'} · ${rec.events.length} notes</div>${rollSVG({ events: rec.events, bpm: rec.bpm }, { row: 7, ppb: 28 })}
        ${!rec.on && rec.events.length ? `<div class="row" style="margin-top:8px"><button class="btn sm" id="take-play">▶ Play take</button><button class="btn sm primary" id="take-keep">Keep capture</button><button class="btn sm" id="take-voicing">Use first chord as voicing</button><button class="btn sm ghost" id="take-drop">Discard</button></div>` : ''}</div>`;
      if ($('#take-play')) {
        $('#take-play').onclick = () => playRoll({ events: quantise(rec.events), bpm: rec.bpm }, $('#cap-preview svg'));
        $('#take-keep').onclick = () => { e.rolls = (e.rolls || []).concat([{ id: uid('r'), name: 'Capture ' + ((e.rolls || []).length + 1), bpm: rec.bpm, events: quantise(rec.events), created: Date.now() }]); rec.events = []; markDirty(); drawPreview(); drawRolls(); toast('Capture added — save the entry to keep it'); };
        $('#take-voicing').onclick = () => { const first = Math.min(...rec.events.map((x) => x.t)); setNotes(rec.events.filter((x) => x.t - first < 0.35).map((x) => x.m)); };
        $('#take-drop').onclick = () => { rec.events = []; drawPreview(); };
      }
    }
    $('#cap-rec').onclick = () => {
      if (rec.on) {
        rec.on = false; clearInterval(rec.timer);
        Array.from(rec.active.keys()).forEach(noteOff);
        $('#cap-rec').textContent = '● Record'; $('#cap-status').textContent = 'Stopped';
        drawPreview(); return;
      }
      const c = M.audio();
      rec.bpm = Math.max(40, Math.min(200, +$('#cap-bpm').value || 80)); rec.metro = $('#cap-metro').checked; rec.events = [];
      const spb = 60 / rec.bpm;
      const t0 = c.currentTime + 0.1;
      for (let i = 0; i < 4; i++) M.click(t0 + i * spb, i === 0);
      $('#cap-status').textContent = 'Count-in…'; $('#cap-rec').textContent = '■ Stop';
      setTimeout(() => {
        rec.on = true; rec.start = performance.now();
        $('#cap-status').textContent = '● Recording';
        drawPreview();
        if (rec.metro) {
          let next = M.audio().currentTime + 0.02, beat = 0;
          rec.timer = setInterval(() => { const cc = M.audio(); while (next < cc.currentTime + 0.1) { M.click(next, beat % 4 === 0); next += spb; beat++; } }, 25);
        }
      }, (t0 - c.currentTime + 4 * spb) * 1000);
    };

    /* --- audio & images --- */
    async function addMedia(blob, kind, name) {
      $('#media-status').textContent = 'Saving…';
      try {
        const ref = await Store.putMedia(blob, kind);
        e.media = (e.media || []).concat([{ id: uid('m'), kind, name, ref, type: blob.type, created: Date.now() }]);
        markDirty(); $('#media-status').textContent = 'Added — save the entry to keep it.'; drawMedia();
      } catch (err) {
        const why = err && err.code === 'unsupported_type' ? 'That file type is not supported here. Use WebM or M4A audio, or PNG/JPEG/WebP images.'
          : err && err.code === 'too_large' ? 'That file is over 20 MB.' : (err && err.message) || 'Could not save the file.';
        $('#media-status').textContent = why;
      }
    }
    $('#up-audio').onchange = (ev) => { const f = ev.target.files[0]; if (f) addMedia(f, 'audio', f.name.replace(/\.[^.]+$/, '')); ev.target.value = ''; };
    $('#up-img').onchange = (ev) => { const f = ev.target.files[0]; if (f) addMedia(f, 'image', f.name.replace(/\.[^.]+$/, '')); ev.target.value = ''; };
    $('#mic-btn').onclick = async () => {
      if (mediaRec) { mediaRec.stop(); return; }
      if (!navigator.mediaDevices || !window.MediaRecorder) { $('#media-status').textContent = 'This browser cannot record audio. Upload a file instead.'; return; }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const chunks = [];
        mediaRec = new MediaRecorder(stream);
        mediaRec.ondataavailable = (ev) => ev.data.size && chunks.push(ev.data);
        mediaRec.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(chunks, { type: (mediaRec.mimeType || 'audio/webm').split(';')[0] });
          mediaRec = null; $('#mic-btn').textContent = '🎙 Record from microphone'; $('#mic-btn').classList.remove('primary');
          addMedia(blob, 'audio', 'Recording ' + new Date().toLocaleString());
        };
        mediaRec.start();
        $('#mic-btn').textContent = '■ Stop recording'; $('#mic-btn').classList.add('primary'); $('#media-status').textContent = '● Recording from the microphone…';
      } catch (err) {
        $('#media-status').textContent = embedded ? 'The microphone is not available in this viewer. Record on your phone and upload the file, or open the app from the repository.' : 'Microphone access was refused. Allow it in the browser, or upload a file instead.';
      }
    };

    /* --- form wiring --- */
    ['ed-name', 'ed-tags', 'ed-notes-txt', 'ed-app', 'ed-prog'].forEach((i) => { $('#' + i).oninput = markDirty; });
    ['ed-kind', 'ed-category', 'ed-voicing', 'ed-level'].forEach((i) => { $('#' + i).onchange = markDirty; });
    $('#ed-symbol').oninput = () => { symHelp(); drawVoicing(); markDirty(); };
    $('#ed-split').onchange = (ev) => { split = +ev.target.value; setNotes(notesOf(e)); };
    $('#ed-preset').onchange = (ev) => {
      const s = $('#ed-symbol').value.trim();
      if (!ev.target.value) return;
      const vv = applyPreset(s || 'C', ev.target.value);
      if (!vv) { $('#ed-err').textContent = 'Type a chord symbol first (e.g. Cmaj7) to build a voicing from it.'; ev.target.value = ''; return; }
      if (!s) $('#ed-symbol').value = 'C';
      e.lh = vv.lh.sort((a, b) => a - b); e.rh = vv.rh.sort((a, b) => a - b);
      const vt = ev.target.value.split(' ')[0];
      if (VOICINGS.includes(vt)) $('#ed-voicing').value = vt;
      ev.target.value = ''; markDirty(); symHelp(); drawVoicing(); playVoicing(e.lh, e.rh);
    };
    $('#ed-play').onclick = () => playVoicing(e.lh || [], e.rh || []);
    $('#ed-clear').onclick = () => setNotes([]);
    $('#ed-rel-sel').onchange = (ev) => { const r = ev.target.value; if (r && !(e.related || []).includes(r)) { e.related = (e.related || []).concat([r]); markDirty(); drawRelated(); } ev.target.value = ''; };

    async function save() {
      const name = $('#ed-name').value.trim();
      if (!name) { $('#ed-err').textContent = 'Give the entry a name before saving.'; $('#ed-name').focus(); return; }
      Object.assign(e, {
        name, symbol: $('#ed-symbol').value.trim(), kind: $('#ed-kind').value, category: $('#ed-category').value,
        voicingType: $('#ed-voicing').value, level: +$('#ed-level').value,
        tags: $('#ed-tags').value.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
        notes: $('#ed-notes-txt').value, application: $('#ed-app').value, progression: $('#ed-prog').value.trim()
      });
      const removed = e._removed || []; delete e._removed;
      $('#ed-save').disabled = $('#ed-save2').disabled = true;
      try {
        await Store.put(e);
        for (const m of removed) await Store.removeMedia(m).catch(() => {});
        dirty = false; toast('Saved'); location.hash = '#/library/' + encodeURIComponent(e.id);
      } catch (err) {
        $('#ed-err').textContent = 'Could not save: ' + ((err && (err.message || err.code)) || 'unknown error') + (Store.mode === 'cloud' ? ' — you may only have view access to this library.' : '');
        $('#ed-save').disabled = $('#ed-save2').disabled = false;
      }
    }
    $('#ed-save').onclick = save; $('#ed-save2').onclick = save;

    const cleanup = () => {
      document.removeEventListener('keydown', onKeyDown); document.removeEventListener('keyup', onKeyUp);
      clearInterval(rec.timer); if (mediaRec) mediaRec.stop();
      if (midiAccess) midiAccess.inputs.forEach((i) => { i.onmidimessage = null; });
    };
    window.addEventListener('hashchange', cleanup, { once: true });
    window.addEventListener('beforeunload', (ev) => { if (dirty) { ev.preventDefault(); ev.returnValue = ''; } });

    symHelp(); drawVoicing(); drawRolls(); drawMedia(); drawRelated();
    if (!existing && App.state.libDraftRelated) { e.related = [App.state.libDraftRelated]; delete App.state.libDraftRelated; drawRelated(); }
    if (!existing && App.state.libDraftSymbol) {
      const s = App.state.libDraftSymbol; delete App.state.libDraftSymbol;
      $('#ed-symbol').value = s; $('#ed-name').value = s + ' — '; symHelp();
      const vv = applyPreset(s, 'Close (LH root)'); if (vv) { e.lh = vv.lh; e.rh = vv.rh; drawVoicing(); }
    }
    if (location.hash.endsWith('#capture') || location.hash.endsWith('#media')) { const t = location.hash.split('#').pop(); setTimeout(() => $('#' + t).scrollIntoView(), 50); }
  }

  /* ======================= Routes & hooks ======================= */
  App.routes.library = (arg) => {
    Store.init();
    const parts = (arg || '').split('#')[0].split('/');
    if (!parts[0]) return renderDirectory();
    if (parts[0] === 'new') return renderEditor(null);
    if (parts[0] === 'edit') return renderEditor(decodeURIComponent(parts[1] || ''));
    return renderDetail(decodeURIComponent(parts[0]));
  };

  // On lesson pages, list library entries linked to that lesson
  App.topicHooks.push((topicId, mount) => {
    Store.init().then(() => {
      const draw = () => {
        const list = Store.all().filter((e) => (e.related || []).includes(topicId));
        mount.innerHTML = `<div class="card"><h3>In your chord library</h3>${list.length ? `<div class="stack small">${list.map((e) => `<div><a href="#/library/${encodeURIComponent(e.id)}">${esc(e.name)}</a></div>`).join('')}</div>` : '<p class="small muted" style="margin:0">No entries linked to this lesson yet.</p>'}<a class="btn sm" style="margin-top:10px" href="#/library/new" id="lib-new-from-topic">＋ Add an entry</a></div>`;
        $('#lib-new-from-topic', mount).onclick = () => { App.state.libDraftRelated = topicId; };
      };
      const off = Store.on(draw);
      window.addEventListener('hashchange', off, { once: true });
      draw();
    });
  });

  // Chord Lab → "Save to library": any chord tile can start a new entry
  App.saveChordToLibrary = (symbol) => { App.state.libDraftSymbol = symbol; location.hash = '#/library/new'; };
};
