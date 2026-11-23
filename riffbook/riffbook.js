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
  const PREF_KEY = 'riffbook-ui-v2';
  const ui = { theme: 'midnight', list: 'home', topic: '', tag: '', type: '', q: '', sort: 'updated', selected: null, viewKey: null, collapsed: [], lastKey: 'C' };
  try { Object.assign(ui, JSON.parse(localStorage.getItem(PREF_KEY) || '{}')); } catch (e) { /* ignore */ }
  const savePrefs = () => { try { localStorage.setItem(PREF_KEY, JSON.stringify({ ...ui, viewKey: null, findChord: null, q: '' })); } catch (e) { /* ignore */ } };

  const toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 1800); };

  /* ======================= Storage ======================= */
  const Store = (() => {
    let mode = 'loading', cloud = null, assets = null, idbP = null, notes = [], topicList = null;
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
        const rows = (await tx('notes', (s) => s.getAll())) || [];
        const meta = rows.find((r) => r.id === 'meta-topics');
        topicList = meta ? meta.paths || [] : null;
        notes = rows.filter((r) => String(r.id).startsWith('note-'));
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
        const meta = snap.docs.find((d) => d.exists && d.id === 'meta-topics');
        topicList = meta ? ((meta.data() || {}).paths || []).slice() : null;
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
      topics: () => topicList || DEFAULT_TOPICS,
      async saveTopics(paths) {
        topicList = Array.from(new Set(paths.filter(Boolean)));
        if (mode === 'cloud') await cloud.doc('meta-topics').set({ paths: topicList });
        else if (mode === 'local') await tx('notes', (s) => s.put({ id: 'meta-topics', paths: topicList }), true);
        emit();
      },
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
        id: 'note-example-6-1', title: '6 to 1 through 5/7', type: 'movement', topic: 'Movements/6-1', tags: ['worship', 'bass walk', 'example'],
        key: 'C', bpm: 76, status: 'ready', pinned: false, favourite: true, created: now - 4 * DAY, updated: now - 3 * DAY,
        body: 'Coming home from the **6 chord**: let the bass step up 6 – 7 – 1 with a slash chord in the middle: [Am] [G/B] [C]\n\n- RH can hold E and G the whole way; only the bass and one note move\n- Slower songs: stretch it to [Am7] [G/B] [Cadd9]\n- Works at the end of a bridge, landing on the chorus',
        blocks: [
          { id: 'b1', kind: 'chords', label: 'Basic', prog: 'Am G/B C', beats: 2 },
          { id: 'b2', kind: 'chords', label: 'With colour', prog: 'Am7 G/B Cadd9', beats: 2 }
        ],
        comments: [{ id: 'c1', at: now - 3 * DAY, mood: 'works', text: 'Add the 4 before it for a full line: F – Am – G/B – C.' }],
        practice: [log(4, 10, 70), log(3, 10, 76)], links: []
      },
      {
        id: 'note-example-walkup', title: 'Gospel walk-up into the 4 chord', type: 'movement', topic: 'Passing chords/Diminished', tags: ['gospel', 'walk-up', 'example'],
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
        id: 'note-example-improv', title: 'Pentatonic improv over 1-5-6-4', type: 'improv', topic: 'Improvisation', tags: ['pentatonic', 'interlude', 'example'],
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
        id: 'note-example-placement', title: 'Right-hand placement for add9 pads', type: 'placement', topic: 'Voicings/Open', tags: ['pads', 'worship', 'example'],
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
      .replace(/\[([A-G][#b]?[^\]\s]{0,10})\]/g, (m, c) => (M.parseChord(c) ? `<button class="chip inline" data-chord="${esc(tr(c, semis, ui.viewKey))}">${esc(chordLabel(c, n, semis))}</button>` : m))
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

  /* ======================= Topics ======================= */
  const DEFAULT_TOPICS = [
    'Movements', 'Movements/6-1', 'Movements/2-5-1', 'Movements/4-5-1', 'Movements/1-4', 'Movements/3-6-2-5-1', 'Movements/7-3-6',
    'Passing chords', 'Passing chords/Diminished', 'Passing chords/Secondary dominants', 'Passing chords/Chromatic',
    'Progressions',
    'Substitutions', 'Substitutions/Tritone', 'Substitutions/Relative minor', 'Substitutions/Borrowed chords',
    'Voicings', 'Voicings/Open', 'Voicings/Rootless', 'Voicings/Quartal', 'Voicings/Clusters',
    'Licks & runs', 'Intros & endings', 'Improvisation', 'Songs'
  ];
  const topicOf = (n) => (n.topic || n.notebook || '').trim();
  const inTopic = (n, path) => { const t = topicOf(n); return t === path || t.startsWith(path + '/'); };
  const leaf = (path) => path.split('/').pop();
  const parentOf = (path) => path.split('/').slice(0, -1).join('/');
  const hueOf = (path) => { const top = path.split('/')[0]; let h = 0; for (let i = 0; i < top.length; i++) h = (h * 31 + top.charCodeAt(i)) % 360; return h; };
  // Every topic path that exists: saved topics, topics used by notes, and their parents — in saved order
  function topicPaths() {
    const out = [], seen = new Set();
    const add = (p) => { const parts = p.split('/').map((x) => x.trim()).filter(Boolean); for (let i = 1; i <= parts.length; i++) { const q = parts.slice(0, i).join('/'); if (!seen.has(q)) { seen.add(q); out.push(q); } } };
    Store.topics().forEach(add);
    Store.all().map(topicOf).filter(Boolean).sort().forEach(add);
    return out;
  }
  const childrenOf = (path, paths) => (paths || topicPaths()).filter((p) => parentOf(p) === path && p !== path);
  const countIn = (path) => Store.all().filter((n) => inTopic(n, path)).length;
  function typeForTopic(path) {
    const top = (path || '').split('/')[0].toLowerCase();
    if (/voicing|placement/.test(top)) return 'placement';
    if (/lick|run|fill/.test(top)) return 'lick';
    if (/improv/.test(top)) return 'improv';
    if (/song/.test(top)) return 'song';
    if (/movement|passing|progression|substitution|intro|ending/.test(top)) return 'movement';
    return 'idea';
  }
  async function addTopic(path) {
    path = path.split('/').map((x) => x.trim()).filter(Boolean).join('/');
    if (!path) return '';
    if (!topicPaths().includes(path)) await Store.saveTopics(Store.topics().concat([path]));
    return path;
  }
  async function renameTopic(from, to) {
    to = to.split('/').map((x) => x.trim()).filter(Boolean).join('/');
    if (!to || to === from) return from;
    const swap = (p) => (p === from ? to : p.startsWith(from + '/') ? to + p.slice(from.length) : p);
    await Store.saveTopics(topicPaths().map(swap));
    for (const n of Store.all().filter((x) => inTopic(x, from))) { n.topic = swap(topicOf(n)); delete n.notebook; await Store.save(n); }
    return to;
  }
  async function deleteTopic(path) {
    const parent = parentOf(path);
    for (const n of Store.all().filter((x) => inTopic(x, path))) { n.topic = parent; delete n.notebook; await Store.save(n); }
    await Store.saveTopics(topicPaths().filter((p) => p !== path && !p.startsWith(path + '/')));
  }

  /* ======================= Filtering ======================= */
  const SMART = {
    all: { label: 'All notes', icon: '▤', test: () => true },
    pinned: { label: 'Pinned', icon: '📌', test: (n) => n.pinned },
    favourite: { label: 'Favourites', icon: '★', test: (n) => n.favourite },
    charts: { label: 'Charts & melodies', icon: '📄', test: (n) => (n.blocks || []).some((b) => b.kind === 'chart' || b.kind === 'melody') },
    practising: { label: 'Practising', icon: '◔', test: (n) => n.status === 'practising' },
    review: { label: 'Revisit', icon: '↻', test: needsReview, hint: 'Not practised for over a week' },
    mastered: { label: 'Mastered', icon: '✓', test: (n) => n.status === 'mastered' }
  };
  const isHome = () => !ui.topic && ui.list === 'home' && !ui.tag && !ui.type && !ui.q.trim() && !ui.findChord;
  function filtered() {
    const q = ui.q.trim().toLowerCase();
    const list = Store.all().filter((n) => (SMART[ui.list] || SMART.all).test(n) &&
      (q || !ui.topic || inTopic(n, ui.topic)) && (!ui.tag || (n.tags || []).includes(ui.tag)) && (!ui.type || n.type === ui.type) && (!ui.findChord || noteHasChord(n, ui.findChord.key)) &&
      (!q || [n.title, n.body, topicOf(n), (n.tags || []).join(' '), (n.comments || []).map((c) => c.text).join(' '), (n.blocks || []).map((b) => (b.label || '') + ' ' + (b.prog || '') + ' ' + (b.symbol || '')).join(' ')].join(' ').toLowerCase().includes(q)));
    const sorters = {
      updated: (a, b) => (b.updated || 0) - (a.updated || 0),
      created: (a, b) => (b.created || 0) - (a.created || 0),
      title: (a, b) => (a.title || '').localeCompare(b.title || ''),
      practised: (a, b) => lastPractised(b) - lastPractised(a)
    };
    list.sort(sorters[ui.sort] || sorters.updated);
    return list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }
  const go = (patch) => {
    flush();
    Object.assign(ui, { topic: '', tag: '', type: '', q: '', list: 'all', findChord: null }, patch);
    topicEdit = null; railAdding = null;
    document.body.classList.remove('note-open', 'rail-open');
    savePrefs(); renderRail(); renderList();
    $('#list-pane').scrollTop = 0; window.scrollTo(0, 0);
  };

  /* ======================= Rail ======================= */
  let railAdding = null; // parent path ('' = top level) while the "new topic" box is open
  let topicEdit = null;  // 'rename' | 'sub' | 'delete' on the topic page
  function renderRail() {
    const all = Store.all(), paths = topicPaths();
    const tags = {};
    all.forEach((n) => (n.tags || []).forEach((t) => { tags[t] = (tags[t] || 0) + 1; }));
    const collapsed = new Set(ui.collapsed || []);
    const addBox = (parent) => `<form class="topic-add" data-addform="${esc(parent)}"><input type="text" placeholder="${parent ? 'New topic in ' + esc(leaf(parent)) : 'New topic'}" aria-label="New topic name"><button class="btn sm primary" type="submit">Add</button></form>`;
    const node = (path, depth) => {
      const kids = childrenOf(path, paths), open = !collapsed.has(path);
      const on = ui.topic === path;
      return `<div class="tree-row ${on ? 'on' : ''}" style="--d:${depth}">
          ${kids.length ? `<button class="caret" data-caret="${esc(path)}" aria-label="${open ? 'Collapse' : 'Expand'} ${esc(leaf(path))}" aria-expanded="${open}">${open ? '▾' : '▸'}</button>` : '<span class="caret-gap"></span>'}
          <button class="tree-link" data-topic="${esc(path)}"><span class="dot" style="--h:${hueOf(path)}"></span><span class="ri-label">${esc(leaf(path))}</span><b>${countIn(path) || ''}</b></button>
          <button class="tree-add" data-addsub="${esc(path)}" title="Add a topic inside ${esc(leaf(path))}" aria-label="Add a topic inside ${esc(leaf(path))}">＋</button>
        </div>${railAdding === path ? addBox(path) : ''}${kids.length && open ? kids.map((k) => node(k, depth + 1)).join('') : ''}`;
    };
    const item = (attrs, on, icon, label, count) => `<button class="rail-item ${on ? 'on' : ''}" ${attrs}><span class="ri-icon">${icon}</span><span class="ri-label">${esc(label)}</span>${count != null ? `<b>${count}</b>` : ''}</button>`;
    const plain = !ui.topic && !ui.tag && !ui.type;
    $('#rail').innerHTML = `
      <div class="brand"><div class="brand-mark">✎</div><div>Riffbook<small>${Store.mode === 'cloud' ? 'Private to you' : Store.mode === 'local' ? 'Saved in this browser' : Store.mode === 'memory' ? 'Not saved' : 'Loading…'}</small></div></div>
      <div class="rail-actions">
        <button class="btn primary" id="new-note">＋ New note</button>
        <div class="rail-two"><button class="btn sm" id="quick-audio" title="Record an audio idea straight into a new note">🎙 Idea</button>
        <button class="btn sm" id="midi-capture" title="Record what you play on your MIDI keyboard into a new note — chords are named for you">🎹 MIDI</button></div>
      </div>
      <div class="midi-panel">${midiState.connected
        ? `<div class="spread small"><span><span class="rec-dot"></span> Listening</span><span class="muted" id="rw-count">${rewind.notes.length} notes kept</span></div>
           <div class="small muted" style="padding:0">Played something good? Save the last…</div>
           <div class="rw-btns"><button data-rw="30">30 s</button><button data-rw="120">2 min</button><button data-rw="300">5 min</button></div>`
        : `<button class="btn sm" id="midi-connect" style="width:100%;justify-content:center">🎹 Connect MIDI keyboard</button>`}
        <div class="row small" style="gap:6px;margin-top:6px"><button class="btn sm ghost" data-metro title="Metronome at ${recCfg().bpm} bpm in ${sigLabel(recCfg().beats)} (change in any recording settings)">${metro.on ? '■ Metronome' : '♩ Metronome'}</button><span class="metro-dots" id="metro-dots" ${metro.on ? '' : 'hidden'}></span></div>
        <label class="small row" style="gap:6px;margin-top:6px"><input type="checkbox" id="app-sound" ${ui.sound !== false ? 'checked' : ''} style="width:15px;height:15px"> App plays sound when I play</label>
      </div>
      ${item('data-home="1"', isHome(), '⌂', 'Library home', null)}
      ${item('data-list="all"', plain && ui.list === 'all' && !isHome(), '▤', 'All notes', all.length)}
      <div class="rail-sec spread"><span>Topics</span><button class="sec-add" id="add-top" title="New topic" aria-label="New topic">＋</button></div>
      ${railAdding === '' ? addBox('') : ''}
      <div class="tree">${childrenOf('', paths).map((p) => node(p, 0)).join('')}</div>
      <div class="rail-sec">Shortcuts</div>
      ${Object.entries(SMART).filter(([k]) => k !== 'all').map(([k, s]) => item(`data-list="${k}" title="${esc(s.hint || '')}"`, plain && ui.list === k, s.icon, s.label, all.filter(s.test).length)).join('')}
      <div class="rail-sec">Tags</div>
      <div class="tag-cloud">${Object.keys(tags).sort().map((t) => `<button class="tag-btn ${ui.tag === t ? 'on' : ''}" data-tag="${esc(t)}">#${esc(t)}</button>`).join('') || '<span class="small muted">No tags yet.</span>'}</div>
      <div class="rail-sec">Practice · last 12 weeks</div>
      ${heatmap(all)}
      <div class="rail-foot">
        <div class="themes">${THEMES.map(([id, name, a, b]) => `<button class="swatch" data-theme="${id}" title="${name}" aria-label="${name} colour scheme" aria-pressed="${ui.theme === id}" style="background:linear-gradient(135deg,${a} 50%,${b} 50%)"></button>`).join('')}</div>
        ${Store.mode === 'local' ? `<div class="row" style="margin-top:10px"><button class="btn sm print-only" id="backup">⬇ Back up</button><label class="btn sm">⬆ Restore<input type="file" id="restore" accept=".json" hidden></label></div>` : ''}
        <a class="small" href="../index.html" style="display:block;margin-top:10px">← Syllabus Studio</a>
      </div>`;
    const rail = $('#rail');
    $('[data-home]', rail).onclick = () => go({ list: 'home' });
    $$('[data-list]', rail).forEach((b) => b.onclick = () => go({ list: b.dataset.list }));
    $$('[data-topic]', rail).forEach((b) => b.onclick = () => go({ topic: b.dataset.topic }));
    $$('[data-tag]', rail).forEach((b) => b.onclick = () => go({ tag: ui.tag === b.dataset.tag ? '' : b.dataset.tag }));
    $$('[data-caret]', rail).forEach((b) => b.onclick = () => { const s = new Set(ui.collapsed || []); s.has(b.dataset.caret) ? s.delete(b.dataset.caret) : s.add(b.dataset.caret); ui.collapsed = Array.from(s); savePrefs(); renderRail(); });
    const openAdd = (parent) => { railAdding = railAdding === parent ? null : parent; if (parent) ui.collapsed = (ui.collapsed || []).filter((x) => x !== parent); renderRail(); const inp = $('.topic-add input', $('#rail')); inp && inp.focus(); };
    $('#add-top').onclick = () => openAdd('');
    $$('[data-addsub]', rail).forEach((b) => b.onclick = () => openAdd(b.dataset.addsub));
    $$('[data-addform]', rail).forEach((f) => {
      f.onsubmit = async (e) => {
        e.preventDefault();
        const name = $('input', f).value.replace(/\//g, '-').trim(); if (!name) return;
        const path = await addTopic((f.dataset.addform ? f.dataset.addform + '/' : '') + name);
        railAdding = null; go({ topic: path }); toast('Topic added');
      };
      $('input', f).onkeydown = (e) => { if (e.key === 'Escape') { railAdding = null; renderRail(); } };
    });
    $$('[data-theme]', rail).forEach((b) => b.onclick = () => setTheme(b.dataset.theme));
    $('#new-note').onclick = () => openTemplates();
    $('#quick-audio').onclick = quickAudio;
    $('#midi-capture').onclick = midiCapture;
    if ($('#midi-connect')) $('#midi-connect').onclick = () => connectMidi();
    $$('[data-metro]', rail).forEach((x) => x.onclick = toggleMetro);
    $$('[data-rw]', rail).forEach((b) => b.onclick = () => saveRewind(+b.dataset.rw));
    $('#app-sound').onchange = (e) => { ui.sound = e.target.checked; savePrefs(); };
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

  /* ======================= Library: home, topic pages, note cards ======================= */
  let spotId = null;
  const firstChords = (n) => (n.blocks || []).find((b) => b.kind === 'chords' && (b.prog || '').trim());
  const bodyChords = (n) => { const out = []; (n.body || '').replace(/\[([A-G][#b]?[^\]\s]{0,10})\]/g, (m, c) => { if (M.parseChord(c)) out.push(c); return m; }); return out; };
  function cardChords(n) { const b = firstChords(n); return b ? b.prog.trim().split(/\s+/).filter((c) => c !== '|') : bodyChords(n); }
  function noteCard(n, opts = {}) {
    const t = TYPES[n.type] || TYPES.idea;
    const chords = cardChords(n).slice(0, 10);
    const place = !chords.length && (n.blocks || []).find((b) => b.kind === 'placement' && ((b.lh || []).length + (b.rh || []).length));
    const snippet = (n.body || '').replace(/\[\[|\]\]/g, '').replace(/[#*`]/g, '').replace(/\[([^\]]+)\]/g, '$1').replace(/\s+/g, ' ').trim().slice(0, opts.big ? 220 : 120);
    const tp = topicOf(n);
    const where = tp && tp !== ui.topic ? (ui.topic && tp.startsWith(ui.topic + '/') ? tp.slice(ui.topic.length + 1) : tp).split('/').join(' › ') : '';
    const has = (k) => (n.blocks || []).some((b) => b.kind === k && (k !== 'roll' || (b.roll && b.roll.events.length)) && (k !== 'audio' || b.ref));
    return `<article class="ncard ${opts.big ? 'big' : ''}" data-card="${esc(n.id)}" style="--h:${hueOf(tp || t.label)}" tabindex="0" role="link" aria-label="Open ${esc(n.title || 'Untitled')}">
      <div class="nc-top"><span class="nr-type" title="${t.label}">${t.icon}</span>${where ? `<span class="nc-where">${esc(where)}</span>` : `<span class="nc-where">${t.label}</span>`}
        <span class="nc-flags">${n.pinned ? '📌' : ''}<button class="star-btn ${n.favourite ? 'on' : ''}" data-star="${esc(n.id)}" aria-label="Favourite" aria-pressed="${!!n.favourite}">★</button></span></div>
      <h3>${esc(n.title || 'Untitled')}</h3>
      ${snippet ? `<p>${esc(snippet)}</p>` : ''}
      ${chords.length ? `<div class="nc-chords"><button class="play-dot" data-playcard="${esc(n.id)}" aria-label="Play these chords">▶</button><div class="chips">${chords.map((c) => `<button class="chip" data-chord="${esc(c)}">${esc(chordLabel(c, n, 0))}</button>`).join('')}</div></div>` : ''}
      ${place ? `<div class="nc-kb">${U.voicingSVG(place, { w: 11, h: 40, labels: false })}</div>` : ''}
      <div class="nr-meta">${n.key ? `<span>Key ${esc(M.pretty(n.key))}</span>` : ''}<span class="st st-${n.status || 'idea'}">${STATUS[n.status || 'idea']}</span>${has('roll') ? '<span title="Piano-roll take">▦</span>' : ''}${has('audio') ? '<span title="Recording">🎙</span>' : ''}${(n.comments || []).length ? `<span>💬 ${n.comments.length}</span>` : ''}<span>${ago(n.updated)}</span>${needsReview(n) ? '<span class="due">↻ revisit</span>' : ''}</div>
    </article>`;
  }
  function bindCards(root) {
    $$('[data-card]', root).forEach((c) => {
      c.onclick = () => select(c.dataset.card);
      c.onkeydown = (e) => { if (e.key === 'Enter' && e.target === c) select(c.dataset.card); };
    });
    $$('.ncard .chip[data-chord]', root).forEach((c) => c.onclick = (e) => { e.stopPropagation(); M.playChord(c.dataset.chord, { dur: 1.6 }); });
    $$('[data-playcard]', root).forEach((b) => b.onclick = (e) => {
      e.stopPropagation();
      const n = Store.get(b.dataset.playcard), blk = firstChords(n), chips = $$('.chip', b.closest('.nc-chords'));
      M.playProgression(chips.map((c) => c.dataset.chord), { bpm: n.bpm || 80, beats: (blk && blk.beats) || 2, onStep: (k) => chips.forEach((c, j) => c.classList.toggle('on', j === k)), onEnd: () => chips.forEach((c) => c.classList.remove('on')) });
    });
    $$('[data-star]', root).forEach((b) => b.onclick = (e) => { e.stopPropagation(); const n = Store.get(b.dataset.star); n.favourite = !n.favourite; Store.save(n).then(() => { renderRail(); renderList(); }); });
  }
  function pickRandom(pool, not) { const p = pool.filter((n) => n.id !== not); const from = p.length ? p : pool; return from.length ? from[Math.floor(Math.random() * from.length)] : null; }

  function renderList() {
    const pane = $('#list-pane');
    const all = Store.all(), paths = topicPaths();
    const bar = `<div class="lib-bar">
        <button class="icon-btn mobile-only" id="menu-btn" aria-label="Open menu">☰</button>
        <input type="search" id="q" placeholder="Search your library — titles, chords, comments…" value="${esc(ui.q)}" aria-label="Search your library">
        <button class="btn ${finder.on ? 'primary' : ''}" id="find-play" title="Hold a chord on your keyboard to find every note that uses it">${finder.on ? '🎹 Listening…' : '🎹 Find by playing'}</button>
        <button class="btn" id="num-toggle" aria-pressed="${!!ui.numbers}" title="Show chords as numbers (1 4 5)">${ui.numbers ? 'C F G' : '1 4 5'}</button>
        <button class="btn" id="inspire" title="Open a random note${ui.topic ? ' from this topic' : ''}">🎲 Inspire me</button>
        <button class="btn primary" id="bar-new">＋ New note</button>
      </div>${Store.note ? `<div class="small" style="color:var(--d);margin-bottom:8px">${esc(Store.note)}</div>` : ''}`;
    let html = '';
    if (isHome()) {
      if (!Store.get(spotId)) { const s = pickRandom(all.filter((n) => cardChords(n).length), null) || pickRandom(all, null); spotId = s ? s.id : null; }
      const spot = Store.get(spotId);
      const tops = childrenOf('', paths);
      html = `<header class="lib-head"><h1>Your library</h1><p class="muted">${all.length} note${all.length === 1 ? '' : 's'} in ${tops.length} topics. Open a topic and keep adding to it; come back any time for something to play.</p></header>
        ${spot ? `<section class="spot"><div class="spread"><span class="eyebrow">Try this today</span><button class="btn sm ghost" id="spot-next">🎲 Another</button></div>${noteCard(spot, { big: true })}</section>` : ''}
        <section><div class="spread"><h2>Topics</h2><button class="btn sm" id="home-add-topic">＋ New topic</button></div>
          <div class="topic-grid">${tops.map((p) => {
            const kids = childrenOf(p, paths), c = countIn(p);
            return `<button class="tcard" data-topic="${esc(p)}" style="--h:${hueOf(p)}"><span class="tc-count">${c}</span><b>${esc(p)}</b><span class="small muted">${kids.length ? esc(kids.slice(0, 4).map(leaf).join(' · ')) + (kids.length > 4 ? ' …' : '') : c ? 'note' + (c === 1 ? '' : 's') : 'Empty — add your first note'}</span></button>`;
          }).join('')}</div></section>
        ${all.length ? `<section><h2>Recently edited</h2><div class="ncards">${all.slice().sort((a, b) => (b.updated || 0) - (a.updated || 0)).slice(0, 6).map((n) => noteCard(n)).join('')}</div></section>` : ''}`;
    } else {
      const list = filtered();
      const kids = ui.topic && !ui.q.trim() ? childrenOf(ui.topic, paths) : [];
      const searching = !!ui.q.trim();
      const title = ui.findChord ? 'Notes using ' + M.pretty(ui.findChord.name) : searching ? 'Search results' : ui.topic ? leaf(ui.topic) : ui.tag ? '#' + ui.tag : (SMART[ui.list] || SMART.all).label;
      const crumbs = ['<a href="#" data-home="1">Library</a>'].concat(ui.topic && !searching ? ui.topic.split('/').map((seg, i, arr) => (i === arr.length - 1 ? `<span>${esc(seg)}</span>` : `<a href="#" data-topic="${esc(arr.slice(0, i + 1).join('/'))}">${esc(seg)}</a>`)) : [`<span>${esc(title)}</span>`]).join(' <span class="sep">›</span> ');
      const typesHere = Object.keys(TYPES).filter((k) => Store.all().some((n) => n.type === k && (!ui.topic || inTopic(n, ui.topic))));
      html = `<nav class="crumbs" aria-label="Breadcrumb">${crumbs}</nav>
        <header class="lib-head topic-head" style="--h:${hueOf(ui.topic || title)}">
          ${topicEdit === 'rename' ? `<form id="t-rename" class="row"><input type="text" id="t-name" value="${esc(leaf(ui.topic))}" aria-label="Topic name"><button class="btn sm primary" type="submit">Save</button><button class="btn sm ghost" type="button" id="t-cancel">Cancel</button></form>`
            : `<div class="spread"><h1>${esc(title)}</h1>${ui.topic && !searching ? `<div class="row t-actions"><button class="btn sm" id="t-sub">＋ Subtopic</button><button class="btn sm ghost" id="t-ren">Rename</button><button class="btn sm ghost" id="t-del">${topicEdit === 'delete' ? 'Tap again — notes move up a level' : 'Delete topic'}</button></div>` : ''}</div>`}
          ${topicEdit === 'sub' ? `<form id="t-subform" class="row" style="margin-top:8px"><input type="text" id="t-subname" placeholder="New topic inside ${esc(leaf(ui.topic))}, e.g. 6-1" aria-label="Subtopic name"><button class="btn sm primary" type="submit">Add</button><button class="btn sm ghost" type="button" id="t-cancel">Cancel</button></form>` : ''}
          ${kids.length ? `<div class="subtopics">${kids.map((k) => `<button class="subchip" data-topic="${esc(k)}">${esc(leaf(k))} <b>${countIn(k)}</b></button>`).join('')}</div>` : ''}
        </header>
        ${ui.findChord ? `<p class="muted">Every note in your library with this chord in its progressions, text or placements. <button class="btn sm" id="find-clear">Clear</button></p>` : ''}
        ${ui.list === 'all' && !ui.q.trim() && !ui.tag && !ui.findChord ? `<form id="qa" class="composer">
          <input type="text" id="qa-title" placeholder="${ui.topic ? 'Add to ' + esc(leaf(ui.topic)) + ' — name the idea…' : 'Add a note — name the idea…'}" aria-label="Note title">
          <input type="text" id="qa-chords" placeholder="Chords, if any — e.g. Am G/B C" aria-label="Chords">
          <textarea id="qa-body" rows="2" placeholder="What is it, where does it fit, how does it feel?" aria-label="Notes"></textarea>
          <div class="row small"><label>Key <select id="qa-key">${M.KEYS.map((k) => `<option ${k.name === (ui.lastKey || 'C') ? 'selected' : ''}>${k.name}</option>`).join('')}</select></label>
            <button class="btn sm primary" type="submit">Add note</button><span class="muted">It stays on this page, so you can keep adding.</span></div>
        </form>` : ''}
        <div class="spread list-tools"><div class="row" style="gap:6px">${typesHere.length > 1 ? `<button class="subchip ${!ui.type ? 'on' : ''}" data-typef="">All</button>` + typesHere.map((k) => `<button class="subchip ${ui.type === k ? 'on' : ''}" data-typef="${k}">${TYPES[k].icon} ${TYPES[k].label}</button>`).join('') : ''}</div>
          <span class="small muted">${list.length} note${list.length === 1 ? '' : 's'} · <label>Sort <select id="sort">${[['updated', 'Last edited'], ['created', 'Newest'], ['practised', 'Last practised'], ['title', 'Title']].map(([k, l]) => `<option value="${k}" ${ui.sort === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label></span></div>
        <div class="ncards">${list.map((n) => noteCard(n)).join('') || `<div class="empty">${Store.mode === 'loading' ? 'Loading your notes…' : ui.q.trim() ? 'Nothing matches that search.' : ui.topic ? 'No notes here yet. Use the box above to add the first one.' : 'No notes here yet.'}</div>`}</div>`;
    }
    pane.innerHTML = `<div class="lib-wrap">${bar}${html}</div>`;
    // top bar
    $('#menu-btn').onclick = () => document.body.classList.add('rail-open');
    $('#q').oninput = (e) => { ui.q = e.target.value; if (ui.list === 'home') ui.list = 'all'; savePrefs(); renderList(); const q = $('#q'); q.focus(); q.setSelectionRange(ui.q.length, ui.q.length); };
    $('#bar-new').onclick = () => openTemplates();
    $('#find-play').onclick = toggleFinder;
    $('#num-toggle').onclick = () => { ui.numbers = !ui.numbers; savePrefs(); renderList(); };
    if ($('#find-clear')) $('#find-clear').onclick = () => go({ list: 'all' });
    $('#inspire').onclick = () => { const pool = ui.topic ? Store.all().filter((n) => inTopic(n, ui.topic)) : Store.all(); const n = pickRandom(pool.length ? pool : Store.all(), ui.selected); if (n) select(n.id); else toast('Add a note first'); };
    $$('[data-home]', pane).forEach((a) => a.onclick = (e) => { e.preventDefault(); go({ list: 'home' }); });
    $$('[data-topic]', pane).forEach((a) => a.onclick = (e) => { e.preventDefault(); go({ topic: a.dataset.topic }); });
    bindCards(pane);
    if ($('#spot-next')) $('#spot-next').onclick = () => { const s = pickRandom(Store.all(), spotId); spotId = s && s.id; renderList(); };
    if ($('#home-add-topic')) $('#home-add-topic').onclick = () => { railAdding = ''; document.body.classList.add('rail-open'); renderRail(); const inp = $('.topic-add input', $('#rail')); inp && inp.focus(); };
    if ($('#sort')) $('#sort').onchange = (e) => { ui.sort = e.target.value; savePrefs(); renderList(); };
    $$('[data-typef]', pane).forEach((b) => b.onclick = () => { ui.type = b.dataset.typef; savePrefs(); renderList(); });
    // topic actions
    const cancel = $('#t-cancel'); if (cancel) cancel.onclick = () => { topicEdit = null; renderList(); };
    if ($('#t-sub')) $('#t-sub').onclick = () => { topicEdit = 'sub'; renderList(); $('#t-subname').focus(); };
    if ($('#t-ren')) $('#t-ren').onclick = () => { topicEdit = 'rename'; renderList(); $('#t-name').select(); };
    if ($('#t-del')) $('#t-del').onclick = async () => {
      if (topicEdit !== 'delete') { topicEdit = 'delete'; renderList(); return; }
      const parent = parentOf(ui.topic); await deleteTopic(ui.topic); toast('Topic deleted'); go(parent ? { topic: parent } : { list: 'home' });
    };
    if ($('#t-subform')) $('#t-subform').onsubmit = async (e) => { e.preventDefault(); const name = $('#t-subname').value.replace(/\//g, '-').trim(); if (!name) return; const p = await addTopic(ui.topic + '/' + name); go({ topic: p }); };
    if ($('#t-rename')) $('#t-rename').onsubmit = async (e) => { e.preventDefault(); const name = $('#t-name').value.replace(/\//g, '-').trim(); if (!name) return; const parent = parentOf(ui.topic); const p = await renameTopic(ui.topic, (parent ? parent + '/' : '') + name); go({ topic: p }); toast('Renamed'); };
    // quick add: stays on the page
    if ($('#qa')) {
      const submit = async (e) => {
        e && e.preventDefault();
        const title = $('#qa-title').value.trim(), chords = $('#qa-chords').value.trim(), body = $('#qa-body').value.trim();
        if (!title && !chords && !body) { $('#qa-title').focus(); return; }
        const n = newNote(typeForTopic(ui.topic));
        n.title = title || chords || body.slice(0, 40); n.body = body; n.key = $('#qa-key').value; ui.lastKey = n.key;
        if (chords) n.blocks.push({ id: uid('b'), kind: 'chords', label: '', prog: chords, beats: 2 });
        await Store.add(n);
        savePrefs(); renderRail(); renderList(); toast('Added to ' + (ui.topic ? leaf(ui.topic) : 'your library'));
        $('#qa-title').focus();
      };
      $('#qa').onsubmit = submit;
      $('#qa-body').onkeydown = (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(e); };
    }
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

  function closeNote() {
    flush(); stopChart(); follow.on = false;
    if (rollRec.block || micRec.mr) { toast('Stop the recording first'); return; }
    document.body.classList.remove('note-open');
    renderRail(); renderList();
  }
  function select(id) {
    flush(); stopChart(); follow.on = false;
    ui.selected = id; ui.viewKey = null; savePrefs();
    current = Store.get(id) || null;
    document.body.classList.add('note-open');
    renderRail(); renderEditor();
    $('#note-pane').scrollTop = 0; window.scrollTo(0, 0);
  }

  function renderEditor() {
    cleanup.forEach((f) => f()); cleanup = [];
    const pane = $('#note-pane');
    const n = current;
    if (n && migrateNote(n)) markDirty();
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
        <button class="btn sm ghost" id="back" title="Back to the library (Esc)">← ${esc(topicOf(n) ? topicOf(n).split('/').join(' › ') : 'Library')}</button>
        <span class="small muted" id="save-state">${n._dirty ? 'Editing…' : 'Saved'}</span>
        <span class="live-pill" id="live-top" ${rollRec.live ? '' : 'hidden'}>${rollRec.live ? '🎹 ' + esc(rollRec.live) : ''}</span>
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
        <label>Topic <select id="m-topic"><option value="">— No topic —</option>${topicPaths().map((t) => `<option value="${esc(t)}" ${t === topicOf(n) ? 'selected' : ''}>${esc(t.split('/').map((x, i, arr) => (i < arr.length - 1 ? '\u00a0\u00a0' : x)).join(''))}</option>`).join('')}<option value="__new">＋ New topic…</option></select></label>
        <label id="m-newtopic-wrap" hidden>New topic <input type="text" id="m-newtopic" placeholder="e.g. Movements/6-1"></label>
        <label class="grow">Tags <input type="text" id="m-tags" value="${esc((n.tags || []).join(', '))}" placeholder="gospel, interlude, ending"></label>
      </div>
      ${n.key ? `<div class="transpose-bar"><span class="small muted">View in key</span><div class="keybar">${M.KEYS.map((k) => `<button data-vk="${k.name}" class="${(ui.viewKey || n.key) === k.name ? 'on' : ''}">${M.pretty(k.name)}</button>`).join('')}</div><button class="btn sm ghost" id="ed-num" aria-pressed="${!!ui.numbers}">${ui.numbers ? 'Show letters' : 'Show numbers'}</button>${semis ? `<button class="btn sm" id="apply-key">Make ${M.pretty(ui.viewKey)} the note's key</button>` : ''}</div>` : ''}

      <section class="body-sec">
        <div class="spread"><h3>Notes</h3><div class="seg"><button id="mode-read" aria-pressed="${!n._editBody}">Read</button><button id="mode-write" aria-pressed="${!!n._editBody}">Write</button></div></div>
        ${n._editBody ? `<textarea id="body" rows="10" placeholder="Write freely. Tips: # Heading · **bold** · - list · [Cmaj7] makes a playable chord · [[Note title]] links a note">${esc(n.body || '')}</textarea><div class="small muted">Write <code>[C]</code> <code>[G/B]</code> for chords you can tap, <code>[[Title]]</code> to link another note.</div>`
          : `<div class="prose body-read" id="body-read" tabindex="0" title="Tap to write">${renderBody(n.body, n)}</div>`}
      </section>

      <section>
        <div class="spread"><h3>Blocks</h3>
          <div class="add-blocks" role="group" aria-label="Add a block">
            <button data-add="chart">📄 Chart</button><button data-add="melody">🎼 Melody</button><button data-add="chords">♫ Chords</button><button data-add="placement">✋ Placement</button><button data-add="roll">▦ Piano roll</button><button data-add="audio">🎙 Audio</button><button data-add="image">🖼 Image</button><button data-add="checklist">☑ Checklist</button>
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

  const blockName = (k) => ({ chords: 'Chords', placement: 'Placement', roll: 'Piano roll', audio: 'Recording', image: 'Image', checklist: 'Checklist', chart: 'Chord chart', melody: 'Melody' }[k] || 'Block');

  function blockHTML(n, b, i, semis) {
    const head = `<div class="blk-head"><input class="blk-label" data-label="${i}" value="${esc(b.label || '')}" placeholder="${blockName(b.kind)}" aria-label="Block name">
      <span class="blk-tools"><button data-up="${i}" title="Move up" aria-label="Move up">↑</button><button data-down="${i}" title="Move down" aria-label="Move down">↓</button><button data-bdel="${i}" title="Delete block" aria-label="Delete block">✕</button></span></div>`;
    const comments = (n.comments || []).filter((c) => c.blockId === b.id).length;
    const foot = comments ? `<div class="small muted blk-foot">💬 ${comments} comment${comments > 1 ? 's' : ''}</div>` : '';
    let body = '';
    if (b.kind === 'chords') {
      const chips = (b.prog || '').trim().split(/\s+/).filter(Boolean).map((c) => (c === '|' ? '<span class="chip bar">|</span>' : `<button class="chip" data-chord="${esc(tr(c, semis, ui.viewKey))}">${esc(chordLabel(c, n, semis))}</button>`)).join('');
      body = `<div class="chips">${chips || '<span class="small muted">Type chords below.</span>'}</div>
        <div class="row small" style="margin-top:8px"><input type="text" data-prog="${i}" value="${esc(b.prog || '')}" placeholder="C G/B Am7 Fmaj9" style="flex:1;min-width:160px" aria-label="Chords">
        <label>Beats <select data-beats="${i}">${[1, 2, 4, 8].map((x) => `<option ${x === (b.beats || 4) ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
        <select data-style="${i}" aria-label="Style"><option value="block">Block</option><option value="broken">Broken</option><option value="arp">Arpeggio</option><option value="pad">Pad</option></select>
        <button class="btn sm" data-playprog="${i}">▶ Play</button><button class="btn sm" data-drill="${i}" title="Practise this in all 12 keys — it listens and moves on when you play each chord">⟳ 12 keys</button></div>`;
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
          <button class="btn sm ${grab.block === b.id ? 'primary' : ''}" data-grab="${i}" title="Hold a chord on your MIDI or computer keys; it is captured when you let go">${grab.block === b.id ? '🎹 Holding… let go to capture' : '🎹 Grab what I hold'}</button>
        </div>
        <div class="row small" style="margin-top:6px"><label>Chord <input type="text" data-symbol="${i}" value="${esc(b.symbol || '')}" placeholder="${esc(guess || 'e.g. Cadd9')}" style="width:110px"></label>${guess ? `<span class="muted">Sounds like <b>${esc(M.pretty(guess))}</b></span>` : '<span class="muted">Tap keys to place notes; tap again to remove.</span>'}${semis ? '<span class="muted">· shown transposed (editing is off)</span>' : ''}</div>`;
    } else if (b.kind === 'roll') {
      const roll = b.roll || { bpm: n.bpm || 80, events: [] };
      const shown = semis ? { ...roll, events: roll.events.map((e) => ({ ...e, m: e.m + semis })) } : roll;
      const recording = rollRec.block === b.id;
      const segs = recording ? [] : U.segmentChords(shown.events, { flat: keyFlat(ui.viewKey || n.key || 'C') });
      const info = roll.events.length ? (roll.clicked ? `Recorded with the count-in at ${roll.bpm} bpm in ${sigLabel(roll.beats)}${roll.downbeat ? ', with a pickup' : ''}.` : 'Recorded in free time; the tempo and bars are worked out when you transcribe.') : '';
      body = `${recording ? `<div class="live-chord" data-live="${i}" aria-live="polite">${esc(rollRec.live || (rollRec.rec && rollRec.rec.armed ? 'Waiting — start playing' : 'Play…'))}</div><div class="beatbox" data-beatbox="${i}"></div>` : ''}${U.rollSVG(shown, { row: 7, ppb: 28, segments: segs })}
        ${info ? `<div class="small muted" style="margin-top:4px">${info}</div>` : ''}
        <div class="row small" style="margin-top:8px"><button class="btn sm" data-playroll="${i}" ${roll.events.length ? '' : 'disabled'}>▶ Play</button>${roll.events.length ? `<button class="btn sm ghost print-only" data-mid="${i}" title="Save this take as a MIDI file for your DAW">⬇ .mid</button>` : ''}
        <button class="btn sm" data-recroll="${i}">${rollRec.block === b.id ? '■ Stop' : '● Record a take'}</button>
        <label title="Snap notes to the grid when recording with the count-in">Quantise <select data-rollq="${i}"><option value="0">Off</option><option value="0.25">1/16</option><option value="0.5" selected>1/8</option></select></label>
        <button class="btn sm ghost" data-midi="${i}">${midiState.connected ? '🎹 MIDI on' : '🎹 Connect MIDI'}</button><span class="muted" data-rollstatus="${i}">${rollRec.block === b.id ? rollRec.status : 'Play with computer keys A W S E D F T G Y H U J K (Z/X octave) or a MIDI keyboard.'}</span></div>
        ${recording ? `<div class="mini-input">${U.voicingSVG({ lh: [], rh: [] }, { from: 48, to: 83, w: 22, h: 70 })}</div>` : recSettingsHTML(i)}
        ${!recording && roll.events.length ? `<div class="analysis">${segs.length ? `<div class="small muted">Chords found in this take (${segs.length}) — tap to hear</div>
          <div class="chips">${segs.map((sg, j) => `<button class="chip" data-segplay="${i}:${j}" title="${esc(sg.notes.map((m) => U.noteName(m, keyFlat(ui.viewKey || n.key || 'C'))).join(' '))}">${esc(sg.name ? M.pretty(sg.name) : '?')}<small>beat ${+(sg.t + 1).toFixed(2)}</small></button>`).join('')}</div>
          <div class="row small" style="margin-top:8px"><button class="btn sm" data-seg2prog="${i}">＋ Add as chord progression</button><button class="btn sm" data-seg2place="${i}">＋ Add voicings as placements</button></div>` : '<div class="small muted">No chords in this take — it looks like a single line.</div>'}
          <div class="row small" style="margin-top:8px">${segs.length ? `<button class="btn sm primary" data-seg2chart="${i}" title="Work out tempo, bars, time signature, key, chords and the rhythm pattern">📄 Write chord chart</button>` : ''}<button class="btn sm ${segs.length ? '' : 'primary'}" data-seg2mel="${i}" title="Write the top line as letters with counts">🎼 Transcribe melody</button></div></div>` : ''}`;
    } else if (b.kind === 'audio') {
      body = b.ref ? `<audio controls preload="none" data-ref="${esc(b.ref)}"></audio>`
        : `<div class="row small"><button class="btn sm" data-mic="${i}">${micRec.block === b.id ? '■ Stop recording' : '🎙 Record'}</button><label class="btn sm">⬆ Upload<input type="file" data-upaudio="${i}" accept="audio/*,video/webm,video/mp4,.m4a,.webm" hidden></label><span class="muted" data-mstatus="${i}">${micRec.block === b.id ? '● Recording…' : ''}</span></div>`;
    } else if (b.kind === 'image') {
      body = b.ref ? `<img class="blk-img" alt="${esc(b.label || 'Image')}" data-ref="${esc(b.ref)}">`
        : `<label class="btn sm">⬆ Choose an image<input type="file" data-upimg="${i}" accept="image/png,image/jpeg,image/gif,image/webp" hidden></label> <span class="small muted">A photo of a chart, or a screenshot of your DAW piano roll.</span>`;
    } else if (b.kind === 'chart') {
      body = chartBlockHTML(n, b, i, semis);
    } else if (b.kind === 'melody') {
      body = melodyBlockHTML(n, b, i, semis);
    } else if (b.kind === 'checklist') {
      body = `<div class="checks">${(b.items || []).map((it, j) => `<label class="check"><input type="checkbox" data-chk="${i}:${j}" ${it.done ? 'checked' : ''}><input type="text" data-chktxt="${i}:${j}" value="${esc(it.t)}" aria-label="Item"><button class="x" data-chkdel="${i}:${j}" aria-label="Remove item">✕</button></label>`).join('')}</div>
        <button class="btn sm ghost" data-chkadd="${i}">＋ Item</button>`;
    }
    return `<div class="blk blk-${b.kind}" id="blk-${esc(b.id)}" data-i="${i}">${head}${body}${foot}</div>`;
  }

  /* ======================= Chord charts, melodies, recording settings ======================= */
  const TX = window.Transcribe;
  const chartPlay = { timers: [], block: null };
  const follow = { on: false, block: null, notes: [], idx: 0, n: null };
  const SIGS = [2, 3, 4, 5, 6, 12];
  const sigLabel = (b) => (b === 6 || b === 12 ? b + '/8' : (b || 4) + '/4');
  const keyOfBlock = (n, b) => b.key || n.key || 'C';
  const chartLabel = (tok, key) => (TX.isHold(tok) || tok === '%' || tok === 'N.C.' ? tok : ui.numbers ? toNumber(tok, key) : M.pretty(tok));
  const recCfg = () => Object.assign({ mode: 'count', beats: 4, bpm: 80, countBars: 1, click: true }, ui.rec || {});
  function shownChart(n, b, semis) {
    const key = keyOfBlock(n, b), sh = semis && ui.viewKey ? shiftBetween(key, ui.viewKey) : 0; // shift from this block's own key
    if (!sh) return { key: semis ? ui.viewKey : key, text: b.text || '' };
    return { key: ui.viewKey, text: TX.mapChartChords(b.text, (c) => M.transposeChord(c, sh, keyFlat(ui.viewKey))) };
  }
  function shownMelody(n, b, semis) {
    const key = keyOfBlock(n, b), notes = b.notes || [], sh = semis && ui.viewKey ? shiftBetween(key, ui.viewKey) : 0;
    return semis ? { key: ui.viewKey, notes: notes.map((x) => ({ ...x, m: x.m + sh })) } : { key, notes };
  }
  // Octave numbers next to scale-degree digits would read as one number, so degrees and solfa use ' and , marks
  function melodyOpts(b, key) { const names = b.names || 'letters', oct = b.octaves || 'number'; return { key, names, octaves: names !== 'letters' && oct === 'number' ? 'marks' : oct }; }
  function noteHTML(m, opts) {
    const l = TX.noteLabel(m, opts);
    return `<span class="lbl">${opts.octaves === 'number' ? `${esc(l.text)}<sub>${l.octText}</sub>` : esc(l.text + l.octText)}</span>`;
  }
  const metaLine = (key, b) => `Key - ${esc(M.pretty(key))} | ${sigLabel(b.beats)} | T - ${b.bpm || 80}bpm`;

  /* ---------- chord chart sheet ---------- */
  function chartSheetHTML(n, b, i, semis) {
    const { key, text } = shownChart(n, b, semis);
    const parsed = TX.parseChart(text, b.beats || 4);
    let html = `<div class="sheet" data-sheet="${i}">
      <div class="sh-title">${esc(b.label || n.title || 'Untitled')}</div>
      <div class="sh-meta">${metaLine(key, b)}</div>`;
    parsed.sections.forEach((s, si) => {
      if (s.name) html += `<div class="sh-sec">${esc(s.name)} :</div>`;
      s.lines.forEach((l, li) => {
        if (!l.bars) { html += `<div class="sh-text">${esc(l.text)}</div>`; return; }
        html += `<div class="sh-line">| ${l.bars.map((bar, bi) => `<span class="sh-bar" data-ref="${si}:${li}:${bi}">${esc((bar.raw || '').split(/\s+/).filter(Boolean).map((t) => chartLabel(t, key)).join(' ') || '.')}</span>`).join(' | ')} |${l.times > 1 ? ` <span class="sh-rep">×${l.times}</span>` : ''}</div>`;
      });
    });
    if (!parsed.sections.length) html += '<p class="sh-text">Empty chart — press ✎ Edit chart to write it.</p>';
    if (b.rhythm && b.showRhythm !== false) {
      const r = b.rhythm, cells = r.grid.split('');
      html += `<div class="sh-sec">Rhythm :</div><div class="sh-rhythm" style="--cols:${cells.length}">${cells.map((c, k) => `<span class="rc ${c === 'x' ? 'hit' : ''} ${k % r.sub === 0 ? 'on-beat' : ''}" aria-label="${c === 'x' ? 'play' : 'rest'}"></span>`).join('')}${r.counts.map((c) => `<span class="rcount">${esc(c)}</span>`).join('')}</div>
        <div class="sh-note">Count it: ${r.counts.map((c, k) => (cells[k] === 'x' ? `<b>${esc(c)}</b>` : `(${esc(c)})`)).join(' ')}${r.share < 1 ? ` · used in ${Math.round(r.share * 100)}% of bars` : ''}</div>`;
    }
    if (parsed.unknown.length) html += `<div class="sh-warn no-print">Not a chord I know: ${parsed.unknown.map((u) => `<code>${esc(u)}</code>`).join(' ')}</div>`;
    return html + '</div>';
  }

  /* ---------- melody sheet ---------- */
  function melodyLinesHTML(notes, b, opts) {
    const beats = b.beats || 4, q = b.q || 0.5;
    const grid = TX.melodyGrid(notes, beats, q);
    const syl = TX.syllables(b.lyrics);
    let html = '';
    for (let k = 0; k < grid.length; k += 4) {
      html += `<div class="mel-line">${grid.slice(k, k + 4).map((bar) => `<span class="mel-bar ${bar.bar < 0 ? 'pickup' : ''}">${bar.beats.map((bt) => {
        const lyr = bt.tokens.filter((t) => t.i != null).map((t) => syl[t.i] || '').join(' ').trim();
        return `<span class="mel-beat"><span class="mel-notes">${bt.tokens.map((t) => (t.hold ? '<span class="mh">–</span>' : t.rest ? '<span class="mr">·</span>' : `<span class="mn" data-mi="${t.i}">${noteHTML(t.m, opts)}</span>`)).join('')}</span>${b.showCounts !== false ? `<span class="mel-count">${esc(bt.count)}</span>` : ''}${syl.length ? `<span class="mel-lyr">${esc(lyr) || '&nbsp;'}</span>` : ''}</span>`;
      }).join('')}</span>`).join('')}</div>`;
    }
    return html;
  }
  function melodySheetHTML(n, b, i, semis) {
    const { key, notes } = shownMelody(n, b, semis);
    const opts = melodyOpts(b, key);
    let html = `<div class="sheet mel-sheet ${b.ear ? 'ear' : ''}" data-sheet="${i}">
      <div class="sh-title">${esc(b.label || n.title || 'Melody')}</div>
      <div class="sh-meta">${metaLine(key, b)}</div>
      <div class="sh-sec">Melody :</div>`;
    html += notes.length ? melodyLinesHTML(notes, b, opts) : '<p class="sh-text">No notes yet — record the melody, or press ✎ Edit melody and type it, e.g. <b>| G | C CB A G |</b></p>';
    if (notes.length) html += `<div class="sh-note">Notes in one beat are written together (CC = two quick notes). – holds the note, · is a rest.${opts.octaves === 'number' ? ' Small numbers are the octave (C4 = middle C).' : opts.octaves === 'marks' ? " ' = octave up, , = octave down from middle C." : ''}${b.ear ? ' Ear training: the notes appear as you play them.' : ''}</div>`;
    return html + '</div>';
  }

  /* ---------- shared recording settings ---------- */
  function recSettingsHTML(i) {
    const c = recCfg();
    return `<div class="rec-set row small" role="group" aria-label="Recording settings">
      <label>Start <select data-rec="mode"><option value="count" ${c.mode === 'count' ? 'selected' : ''}>Count-in + metronome</option><option value="free" ${c.mode === 'free' ? 'selected' : ''}>When I start playing</option></select></label>
      <label>Time <select data-rec="beats">${SIGS.map((s) => `<option value="${s}" ${s === c.beats ? 'selected' : ''}>${sigLabel(s)}</option>`).join('')}</select></label>
      <label>Tempo <input type="number" data-rec="bpm" value="${c.bpm}" min="30" max="260" style="width:62px"></label><button class="btn sm ghost" data-rectap title="Tap this button in time to set the tempo">Tap</button>
      ${c.mode === 'count' ? `<label>Count-in <select data-rec="countBars"><option value="1" ${c.countBars === 1 ? 'selected' : ''}>1 bar</option><option value="2" ${c.countBars === 2 ? 'selected' : ''}>2 bars</option></select></label>
      <label><input type="checkbox" data-rec="click" ${c.click ? 'checked' : ''}> Metronome while recording</label>` : '<span class="muted">Tempo and bars are worked out from your playing.</span>'}
      <button class="btn sm ghost" data-metro>${metro.on ? '■ Metronome' : '♩ Metronome'}</button>
    </div>`;
  }
  // Standalone metronome using the recording settings (tempo changes apply on the next beat)
  const metro = { on: false, timer: null, next: 0, beat: 0 };
  function toggleMetro() {
    if (metro.on) { clearInterval(metro.timer); metro.on = false; $$('[data-metro]').forEach((x) => { x.textContent = '♩ Metronome'; }); $$('.metro-dots').forEach((x) => { x.hidden = true; }); return; }
    metro.on = true; metro.next = M.audio().currentTime + 0.05; metro.beat = 0;
    $$('[data-metro]').forEach((x) => { x.textContent = '■ Metronome'; });
    metro.timer = setInterval(() => {
      const c = recCfg(), cc = M.audio();
      while (metro.next < cc.currentTime + 0.1) {
        const k = metro.beat % c.beats, when = metro.next;
        M.click(when, U.accentOf(k, c.beats));
        setTimeout(() => { const d = $('#metro-dots'); if (d) { d.hidden = false; d.innerHTML = Array.from({ length: c.beats }, (_, j) => `<span class="${j === k ? 'on' : ''} ${j === 0 ? 'first' : ''}"></span>`).join(''); } }, Math.max(0, (when - cc.currentTime) * 1000));
        metro.next += 60 / c.bpm; metro.beat++;
      }
    }, 25);
  }
  const taps = [];
  function tapTempo() {
    const now = performance.now();
    while (taps.length && now - taps[0] > 3000) taps.shift();
    taps.push(now);
    if (taps.length < 2) { toast('Keep tapping…'); return; }
    const bpm = Math.round(60000 / ((taps[taps.length - 1] - taps[0]) / (taps.length - 1)));
    ui.rec = Object.assign(recCfg(), { bpm: Math.max(30, Math.min(260, bpm)) }); savePrefs();
    $$('[data-rec="bpm"]').forEach((x) => { x.value = ui.rec.bpm; });
    toast(ui.rec.bpm + ' bpm');
  }
  function bindRecSettings(root) {
    $$('[data-rec]', root).forEach((x) => x.onchange = () => {
      const f = x.dataset.rec, c = recCfg();
      c[f] = x.type === 'checkbox' ? x.checked : f === 'mode' ? x.value : Math.max(f === 'bpm' ? 30 : 0, Math.min(f === 'bpm' ? 260 : 12, +x.value || c[f]));
      ui.rec = c; savePrefs();
      if (f === 'mode') renderEditor();
    });
    $$('[data-rectap]', root).forEach((x) => x.onclick = tapTempo);
    $$('[data-metro]', root).forEach((x) => x.onclick = toggleMetro);
  }

  /* ---------- block bodies ---------- */
  const takeOf = (n, b) => b.take || (b.src && ((n.blocks || []).find((x) => x.id === b.src.roll && x.roll) || {}).roll) || null;
  function retxHTML(n, b, i, what) {
    if (!takeOf(n, b) || !b.src) return '';
    return `<div class="row small retx"><span class="muted">${b.src.counted ? 'Recorded with the count-in, so bars and tempo are exact' : `Worked out from free playing${b.src.conf != null ? ` · tempo confidence ${Math.round(b.src.conf * 100)}%` : ''}`}. Fix it:</span>
      <button class="btn sm ghost" data-rtx="half:${i}" title="The tempo came out twice as fast as it should be">½ tempo</button><button class="btn sm ghost" data-rtx="double:${i}" title="The tempo came out half as fast as it should be">2× tempo</button>
      <button class="btn sm ghost" data-rtx="left:${i}" title="Move bar lines one beat earlier">◀ Bar line</button><button class="btn sm ghost" data-rtx="right:${i}" title="Move bar lines one beat later">Bar line ▶</button>
      <span class="muted">This replaces edits to the ${what}.</span></div>`;
  }
  function chartBlockHTML(n, b, i, semis) {
    const key = keyOfBlock(n, b), playing = chartPlay.block === b.id;
    return `${chartSheetHTML(n, b, i, semis)}
      <div class="chart-tools no-print">
        <div class="row small">
          <button class="btn sm primary" data-chplay="${i}">${playing ? '■ Stop' : '▶ Play chart'}</button>
          <label><input type="checkbox" data-chloop="${i}" ${b.loop ? 'checked' : ''}> Loop</label>
          <label><input type="checkbox" data-chclick="${i}" ${b.click !== false ? 'checked' : ''}> Click</label>
          <label>Key <select data-chkey="${i}" ${semis ? 'disabled title="Switch the view back to the note\'s key to change this"' : ''}>${M.KEYS.map((k) => `<option ${k.name === key ? 'selected' : ''}>${k.name}</option>`).join('')}</select></label>
          <label>Time <select data-chbeats="${i}">${SIGS.map((s) => `<option value="${s}" ${s === (b.beats || 4) ? 'selected' : ''}>${sigLabel(s)}</option>`).join('')}</select></label>
          <label>Tempo <input type="number" data-chbpm="${i}" value="${b.bpm || 80}" min="30" max="260" style="width:62px"></label>
          <button class="btn sm" data-chedit="${i}">${b.editing ? '✓ Done editing' : '✎ Edit chart'}</button>
          <button class="btn sm ghost" data-copy="${i}">⧉ Copy</button>
          <button class="btn sm ghost print-only" data-print="${i}" title="Print, or choose Save as PDF in the print dialog">🖨 Print / PDF</button>
          <button class="btn sm ghost print-only" data-txt="${i}">⬇ .txt</button>
        </div>
        ${b.editing ? `<textarea class="chart-text" data-chtext="${i}" rows="${Math.min(18, Math.max(6, (b.text || '').split('\n').length + 2))}" spellcheck="false" aria-label="Chart text">${esc(b.text || '')}</textarea>
          <div class="small muted">Write a section as <code>Verse :</code>, then bars between <code>|</code>. One chord fills the bar; otherwise one chord or <code>.</code> per beat (<code>Gm . . Eb</code> = Gm for 3 beats, Eb for 1). Slash chords like <code>Bb/D</code>, <code>%</code> repeats the bar, <code>x2</code> at the end repeats the line.</div>` : ''}
        ${retxHTML(n, b, i, 'chart')}
        ${b.rhythm ? `<label class="small"><input type="checkbox" data-rshow="${i}" ${b.showRhythm !== false ? 'checked' : ''}> Show rhythm pattern on sheet</label>` : ''}
      </div>`;
  }
  function melodyBlockHTML(n, b, i, semis) {
    const key = keyOfBlock(n, b), following = follow.on && follow.block === b.id, recording = rollRec.block === b.id;
    const has = (b.notes || []).length > 0;
    return `${recording ? `<div class="live-chord" data-live="${i}" aria-live="polite">${esc(rollRec.live || '')}</div><div class="beatbox" data-beatbox="${i}"></div>` : ''}
      ${melodySheetHTML(n, b, i, semis)}
      <div class="chart-tools no-print">
        <div class="row small">
          <button class="btn sm ${recording ? 'primary' : ''}" data-mrec="${i}">${recording ? '■ Stop recording' : '● Record melody'}</button>
          ${has ? `<button class="btn sm primary" data-mplay="${i}">${chartPlay.block === b.id ? '■ Stop' : '▶ Play'}</button>
          <label>Speed <select data-mspeed="${i}">${[0.5, 0.75, 1].map((s) => `<option value="${s}" ${(b.speed || 1) === s ? 'selected' : ''}>${s * 100}%</option>`).join('')}</select></label>
          <label><input type="checkbox" data-mclick="${i}" ${b.click ? 'checked' : ''}> Click</label>
          <button class="btn sm ${following ? 'primary' : ''}" data-mfollow="${i}" title="Play the melody on your keyboard; it waits for each right note">${following ? '■ Stop play-along' : '🎹 Play along'}</button>
          <label title="Hide the notes; each one appears when you play it right"><input type="checkbox" data-mear="${i}" ${b.ear ? 'checked' : ''}> Ear training</label>` : ''}
          <button class="btn sm" data-medit="${i}">${b.editing ? '✓ Done editing' : '✎ Edit melody'}</button>
          ${has ? `<button class="btn sm ghost" data-copy="${i}">⧉ Copy</button><button class="btn sm ghost print-only" data-print="${i}">🖨 Print / PDF</button><button class="btn sm ghost print-only" data-txt="${i}">⬇ .txt</button>` : ''}
        </div>
        ${recording ? '' : recSettingsHTML(i)}
        ${has ? `<div class="row small mel-tools">
          <label>Show <select data-mnames="${i}"><option value="letters" ${(b.names || 'letters') === 'letters' ? 'selected' : ''}>Letters (C D E)</option><option value="degree" ${b.names === 'degree' ? 'selected' : ''}>Numbers (1 2 3)</option><option value="solfa" ${b.names === 'solfa' ? 'selected' : ''}>Solfa (Do Re Mi)</option></select></label>
          <label>Octave <select data-moct="${i}"><option value="number" ${(b.octaves || 'number') === 'number' ? 'selected' : ''}>C4 numbers</option><option value="marks" ${b.octaves === 'marks' ? 'selected' : ''}>C' marks</option><option value="none" ${b.octaves === 'none' ? 'selected' : ''}>Hide</option></select></label>
          <label><input type="checkbox" data-mcounts="${i}" ${b.showCounts !== false ? 'checked' : ''}> Counts</label>
          <label>Key <select data-mkey="${i}" ${semis ? 'disabled' : ''}>${M.KEYS.map((k) => `<option ${k.name === key ? 'selected' : ''}>${k.name}</option>`).join('')}</select></label>
          <label>Time <select data-mbeats="${i}">${SIGS.map((s) => `<option value="${s}" ${s === (b.beats || 4) ? 'selected' : ''}>${sigLabel(s)}</option>`).join('')}</select></label>
          <label>Tempo <input type="number" data-mbpm="${i}" value="${b.bpm || 80}" min="30" max="260" style="width:62px"></label>
          <label class="grow">Lyrics <input type="text" data-mlyrics="${i}" value="${esc(b.lyrics || '')}" placeholder="One syllable per note: O come all ye faith-ful"></label>
        </div>` : ''}
        ${b.editing ? `<textarea class="chart-text" data-mtext="${i}" rows="5" spellcheck="false" aria-label="Melody in letters">${esc(b.text != null ? b.text : TX.melodyText(TX.melodyGrid(b.notes || [], b.beats || 4, b.q || 0.5), { key, octaves: 'number' }))}</textarea>
          <div class="small muted">Bars between <code>|</code>, beats separated by spaces. Notes in one beat share it: <code>CC</code> = two eighths, <code>CDEF</code> = four sixteenths. <code>–</code> holds, <code>·</code> rests. Add an octave (<code>C5</code>) or leave it off and the nearest one is used. A short first bar is a pickup.</div>` : ''}
        ${retxHTML(n, b, i, 'melody')}
      </div>`;
  }

  /* ---------- playback & practice ---------- */
  function stopChart() { chartPlay.timers.forEach(clearTimeout); chartPlay.timers = []; chartPlay.block = null; M.stopAll(); $$('.sh-bar.on, .mn.on').forEach((e) => e.classList.remove('on')); }
  const later = (when, fn) => chartPlay.timers.push(setTimeout(fn, Math.max(0, (when - M.audio().currentTime) * 1000)));
  function playChart(n, b, i, semis) {
    if (chartPlay.block === b.id) { stopChart(); renderEditor(); return; }
    stopChart();
    const { text } = shownChart(n, b, semis);
    const beats = b.beats || 4;
    const tl = TX.chartTimeline(TX.parseChart(text, beats));
    if (!tl.length) { toast('Add some bars first'); return; }
    chartPlay.block = b.id; renderEditor();
    const P = 60 / (b.bpm || 80);
    const run = (start) => {
      for (let k = 0; k < beats; k++) M.click(start + k * P, U.accentOf(k, beats)); // one bar count-in
      const t0 = start + beats * P;
      tl.forEach((x, k) => {
        const when = t0 + k * P;
        if (b.click !== false) M.click(when, U.accentOf(x.beat, beats));
        if (x.isNew && x.chord) { let len = 1; while (tl[k + len] && !tl[k + len].isNew) len++; M.playChord(x.chord, { when, dur: len * P * 0.95, style: 'block' }); }
        if (x.beat === 0) later(when, () => { $$('.sh-bar.on').forEach((e) => e.classList.remove('on')); const el = $(`#blk-${CSS.escape(b.id)} .sh-bar[data-ref="${x.ref}"]`); if (el) { el.classList.add('on'); el.scrollIntoView({ block: 'nearest' }); } });
      });
      later(t0 + tl.length * P, () => {
        if (chartPlay.block !== b.id) return;
        if (b.loop) { chartPlay.timers = []; run(M.audio().currentTime + 0.05); } else { stopChart(); renderEditor(); }
      });
    };
    run(M.audio().currentTime + 0.1);
  }
  function playMelody(n, b, semis) {
    if (chartPlay.block === b.id) { stopChart(); renderEditor(); return; }
    stopChart();
    const { notes } = shownMelody(n, b, semis);
    if (!notes.length) return;
    chartPlay.block = b.id; renderEditor();
    const beats = b.beats || 4, P = 60 / (b.bpm || 80) / (b.speed || 1);
    const lo = Math.min(...notes.map((x) => x.t));
    const first = b.click ? Math.floor(lo / beats) * beats : lo; // with the click, start from the top of the first bar
    const t0 = M.audio().currentTime + 0.15;
    const last = Math.max(...notes.map((x) => x.t + x.d));
    if (b.click) for (let k = 0; first + k < last; k++) M.click(t0 + k * P, U.accentOf(M.mod(first + k, beats), beats));
    notes.forEach((x, k) => {
      const when = t0 + (x.t - first) * P;
      M.tone(x.m, when, Math.max(0.1, x.d * P * 0.95), { vel: 0.25 });
      later(when, () => { $$('.mn.on').forEach((e) => e.classList.remove('on')); const el = $(`#blk-${CSS.escape(b.id)} .mn[data-mi="${k}"]`); if (el) el.classList.add('on'); });
    });
    later(t0 + (last - first) * P + 0.3, () => { if (chartPlay.block === b.id) { stopChart(); renderEditor(); } });
  }
  // Play-along: highlights the next melody note and waits until it is played
  function startFollow(n, b, semis) {
    if (follow.on) { follow.on = false; renderEditor(); return; }
    stopChart();
    ensureInput();
    if (!midiState.connected && navigator.requestMIDIAccess && !embedded) connectMidi();
    Object.assign(follow, { on: true, block: b.id, notes: shownMelody(n, b, semis).notes, idx: 0, n, start: Date.now(), misses: 0 });
    renderEditor();
    toast(b.ear ? 'Ear training: find each note by ear — any octave counts' : 'Play the highlighted note — any octave counts');
  }
  function markFollow() {
    $$('.mn').forEach((e) => e.classList.remove('on', 'done', 'miss'));
    const sheet = follow.on && $(`#blk-${CSS.escape(follow.block)} .sheet`); if (!sheet) return;
    for (let k = 0; k < follow.idx; k++) { const el = $(`.mn[data-mi="${k}"]`, sheet); if (el) el.classList.add('done'); }
    const cur = $(`.mn[data-mi="${follow.idx}"]`, sheet); if (cur) { cur.classList.add('on'); cur.scrollIntoView({ block: 'nearest' }); }
  }
  function followCheck(m) {
    const want = follow.notes[follow.idx]; if (!want) return;
    if (m % 12 === want.m % 12) {
      follow.idx++;
      if (follow.idx >= follow.notes.length) {
        const mins = Math.max(1, Math.round((Date.now() - follow.start) / 60000)), n = follow.n;
        follow.on = false; renderEditor();
        toast(`Melody complete${follow.misses ? ` · ${follow.misses} wrong notes` : ' · no mistakes!'}`);
        logPractice(n, mins, null, `Melody play-along${follow.misses ? `, ${follow.misses} wrong notes` : ', no mistakes'}`);
        return;
      }
      markFollow();
    } else {
      follow.misses++;
      const el = $(`#blk-${CSS.escape(follow.block)} .mn[data-mi="${follow.idx}"]`); if (el) { el.classList.add('miss'); setTimeout(() => el.classList.remove('miss'), 300); }
    }
  }

  /* ---------- text, copy, print ---------- */
  function blockPlainText(n, b) {
    const key = keyOfBlock(n, b);
    let out = `${b.label || n.title || 'Untitled'}\nKey - ${key} | ${sigLabel(b.beats)} | T - ${b.bpm || 80}bpm\n\n`;
    if (b.kind === 'chart') {
      out += b.text || '';
      if (b.rhythm) out += `\n\nRhythm : ${b.rhythm.counts.map((c, k) => (b.rhythm.grid[k] === 'x' ? c : '(' + c + ')')).join(' ')}`;
    } else {
      out += 'Melody :\n' + TX.melodyText(TX.melodyGrid(b.notes || [], b.beats || 4, b.q || 0.5), melodyOpts(b, key));
      if (b.lyrics) out += '\n\nLyrics : ' + b.lyrics;
    }
    return out;
  }
  // Print just the sheet: copy it into its own top-level container so nothing else takes up the page
  function printSheet(el) {
    let root = $('#print-root');
    if (!root) { root = document.createElement('div'); root.id = 'print-root'; document.body.appendChild(root); }
    root.innerHTML = ''; root.appendChild(el.cloneNode(true));
    $$('.on, .done, .miss', root).forEach((x) => x.classList.remove('on', 'done', 'miss'));
    $$('.ear', root).forEach((x) => x.classList.remove('ear'));
    document.body.classList.add('printing-sheet');
    const done = () => { document.body.classList.remove('printing-sheet'); root.innerHTML = ''; window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    window.print();
    setTimeout(done, 1500);
  }
  function copyText(text, what) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => toast(what + ' copied')).catch(() => {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast(what + ' copied'); } catch (e) { toast('Copy is not available here'); }
      ta.remove();
    });
  }

  /* ---------- transcription into blocks ---------- */
  function chartFields(take, rollId, opts = {}) {
    const r = TX.transcribeChords(take, opts); if (!r) return null;
    return { key: r.key, beats: r.beatsPerBar, bpm: r.bpm, text: r.text, rhythm: r.rhythm, src: { roll: rollId, bpm: r.bpm, t0: r.t0, shift: opts.shift || 0, conf: r.confidence, counted: r.counted }, _detected: r.keyLabel, _chords: r.chords };
  }
  function melodyFields(take, rollId, opts = {}) {
    const r = TX.transcribeMelody(take, opts); if (!r) return null;
    return { key: r.key, beats: r.beatsPerBar, bpm: r.bpm, notes: r.notes, q: r.q, text: null, src: { roll: rollId, bpm: r.bpm, t0: r.t0, shift: opts.shift || 0, conf: r.confidence, counted: r.counted }, _detected: r.keyLabel };
  }
  const clean = (o) => { Object.keys(o).forEach((k) => { if (k[0] === '_') delete o[k]; }); return o; };
  // Older notes kept the melody inside the chart; give it its own Melody block
  function migrateNote(n) {
    let changed = false;
    (n.blocks || []).slice().forEach((b) => {
      if (b.kind === 'chart' && b.melody) {
        const m = { id: uid('b'), kind: 'melody', label: b.label || n.title || 'Melody', key: b.key, beats: b.beats, bpm: b.bpm, notes: b.melody.notes || [], q: b.melody.q || 0.5, names: b.names, octaves: b.octaves, showCounts: b.showCounts, speed: b.speed, src: b.src };
        n.blocks.splice(n.blocks.indexOf(b) + 1, 0, m);
        ['melody', 'names', 'octaves', 'showCounts', 'speed', 'showMelody'].forEach((k) => delete b[k]);
        changed = true;
      }
    });
    return changed;
  }

  function bindCharts(n, semis, B) {
    const pane = $('#note-pane');
    bindRecSettings(pane);
    const addAfter = (i, blk) => { n.blocks.splice(+i + 1, 0, blk); markDirty(true); setTimeout(() => { const el = $('#blk-' + CSS.escape(blk.id)); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); };
    $$('[data-seg2chart]', pane).forEach((x) => x.onclick = () => {
      const rb = B(x.dataset.seg2chart), c = chartFields(rb.roll, rb.id);
      if (!c) { toast('Nothing to transcribe yet'); return; }
      const msg = `Chart written: ${c.bpm} bpm, ${sigLabel(c.beats)}, key ${c._detected}`;
      addAfter(x.dataset.seg2chart, clean(Object.assign({ id: uid('b'), kind: 'chart', label: n.title || 'Chart' }, c)));
      if (!n.bpm || n.bpm === 80) n.bpm = c.bpm;
      toast(msg);
    });
    $$('[data-seg2mel]', pane).forEach((x) => x.onclick = () => {
      const rb = B(x.dataset.seg2mel), m = melodyFields(rb.roll, rb.id);
      if (!m || !m.notes.length) { toast('No melody found in this take'); return; }
      const msg = `Melody written: ${m.notes.length} notes, ${m.bpm} bpm, ${sigLabel(m.beats)}`;
      addAfter(x.dataset.seg2mel, clean(Object.assign({ id: uid('b'), kind: 'melody', label: n.title || 'Melody' }, m)));
      toast(msg);
    });
    // chart controls
    $$('[data-chplay]', pane).forEach((x) => x.onclick = () => playChart(n, B(x.dataset.chplay), +x.dataset.chplay, semis));
    $$('[data-chloop]', pane).forEach((x) => x.onchange = () => { B(x.dataset.chloop).loop = x.checked; markDirty(); });
    $$('[data-chclick]', pane).forEach((x) => x.onchange = () => { B(x.dataset.chclick).click = x.checked; markDirty(); });
    $$('[data-chbpm], [data-mbpm]', pane).forEach((x) => x.onchange = () => { B(x.dataset.chbpm || x.dataset.mbpm).bpm = Math.max(30, Math.min(260, +x.value || 80)); markDirty(true); });
    $$('[data-chbeats], [data-mbeats]', pane).forEach((x) => x.onchange = () => {
      const b = B(x.dataset.chbeats || x.dataset.mbeats), beats = +x.value, take = takeOf(n, b);
      if (take && b.src && !(b.kind === 'melody' && b.text != null)) {
        const f = (b.kind === 'chart' ? chartFields : melodyFields)(take, b.src.roll, { bpm: b.src.bpm, t0: b.src.t0, shift: b.src.shift, beatsPerBar: beats });
        Object.assign(b, clean(f), { src: { ...f.src, t0: b.src.t0, shift: b.src.shift, counted: b.src.counted } });
      } else b.beats = beats;
      markDirty(true);
    });
    $$('[data-chkey], [data-mkey]', pane).forEach((x) => x.onchange = () => {
      const b = B(x.dataset.chkey || x.dataset.mkey), from = keyOfBlock(n, b), to = x.value;
      const s = shiftBetween(from, to), fl = keyFlat(to);
      if (b.kind === 'chart') b.text = TX.mapChartChords(b.text, (c) => M.transposeChord(c, s, fl));
      else { b.notes = (b.notes || []).map((y) => ({ ...y, m: y.m + s })); b.text = null; }
      b.key = to; markDirty(true); toast('Moved to ' + M.pretty(to));
    });
    $$('[data-chedit]', pane).forEach((x) => x.onclick = () => { const b = B(x.dataset.chedit); b.editing = !b.editing; markDirty(true); if (b.editing) setTimeout(() => { const t = $(`[data-chtext="${x.dataset.chedit}"]`); t && t.focus(); }, 0); });
    $$('[data-chtext]', pane).forEach((t) => {
      t.oninput = () => {
        const i = t.dataset.chtext, b = B(i);
        b.text = t.value; markDirty();
        const sheet = $(`[data-sheet="${i}"]`, pane);
        if (sheet) { const tmp = document.createElement('div'); tmp.innerHTML = chartSheetHTML(n, b, i, semis); sheet.replaceWith(tmp.firstElementChild); }
      };
    });
    // melody controls
    $$('[data-medit]', pane).forEach((x) => x.onclick = () => {
      const b = B(x.dataset.medit);
      b.editing = !b.editing;
      if (!b.editing) b.text = null; // after editing, the notes are the source again
      markDirty(true);
      if (b.editing) setTimeout(() => { const t = $(`[data-mtext="${x.dataset.medit}"]`); t && t.focus(); }, 0);
    });
    $$('[data-mtext]', pane).forEach((t) => {
      t.oninput = () => {
        const i = t.dataset.mtext, b = B(i);
        const p = TX.parseMelodyText(t.value, b.beats || 4);
        b.text = t.value; b.notes = p.notes; b.q = p.q; markDirty();
        const sheet = $(`[data-sheet="${i}"]`, pane);
        if (sheet) { const tmp = document.createElement('div'); tmp.innerHTML = melodySheetHTML(n, b, i, semis); sheet.replaceWith(tmp.firstElementChild); }
        t.classList.toggle('bad', p.bad.length > 0); t.title = p.bad.length ? 'Not understood: ' + p.bad.join(' ') : '';
      };
    });
    $$('[data-mlyrics]', pane).forEach((x) => x.oninput = () => {
      const i = x.dataset.mlyrics, b = B(i); b.lyrics = x.value; markDirty();
      const sheet = $(`[data-sheet="${i}"]`, pane);
      if (sheet) { const tmp = document.createElement('div'); tmp.innerHTML = melodySheetHTML(n, b, i, semis); sheet.replaceWith(tmp.firstElementChild); }
    });
    $$('[data-mrec]', pane).forEach((x) => x.onclick = () => toggleRollRecord(n, B(x.dataset.mrec), x.dataset.mrec));
    $$('[data-mplay]', pane).forEach((x) => x.onclick = () => playMelody(n, B(x.dataset.mplay), semis));
    $$('[data-mfollow]', pane).forEach((x) => x.onclick = () => startFollow(n, B(x.dataset.mfollow), semis));
    const setOpt = (attr, key, val) => $$(`[${attr}]`, pane).forEach((x) => x.onchange = () => { B(x.getAttribute(attr))[key] = val(x); markDirty(true); });
    setOpt('data-mnames', 'names', (x) => x.value);
    setOpt('data-moct', 'octaves', (x) => x.value);
    setOpt('data-mcounts', 'showCounts', (x) => x.checked);
    setOpt('data-mspeed', 'speed', (x) => +x.value);
    setOpt('data-mclick', 'click', (x) => x.checked);
    setOpt('data-mear', 'ear', (x) => x.checked);
    setOpt('data-rshow', 'showRhythm', (x) => x.checked);
    // shared: copy, print, .txt, re-transcribe
    $$('[data-copy]', pane).forEach((x) => x.onclick = () => { const b = B(x.dataset.copy); copyText(blockPlainText(n, b), b.kind === 'chart' ? 'Chart' : 'Melody'); });
    $$('[data-print]', pane).forEach((x) => x.onclick = () => printSheet($(`[data-sheet="${x.dataset.print}"]`, pane)));
    $$('[data-txt]', pane).forEach((x) => x.onclick = () => {
      const b = B(x.dataset.txt), a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([blockPlainText(n, b)], { type: 'text/plain' }));
      a.download = (b.label || n.title || b.kind).replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') + '.txt'; a.click();
    });
    $$('[data-rtx]', pane).forEach((x) => x.onclick = () => {
      const [act, i] = x.dataset.rtx.split(':'), b = B(i), take = takeOf(n, b);
      if (!take) return;
      const s = { ...b.src };
      if (act === 'half') s.bpm = Math.max(30, Math.round(s.bpm / 2));
      if (act === 'double') s.bpm = Math.min(260, Math.round(s.bpm * 2));
      if (act === 'left') s.shift = (s.shift || 0) - 1;
      if (act === 'right') s.shift = (s.shift || 0) + 1;
      const f = (b.kind === 'chart' ? chartFields : melodyFields)(take, s.roll, { bpm: s.bpm, t0: s.t0, shift: s.shift, beatsPerBar: b.beats });
      Object.assign(b, clean(f), { src: { ...f.src, t0: s.t0, shift: s.shift, counted: s.counted } });
      if (b.kind === 'melody') b.text = null;
      markDirty(true); toast(`Now ${b.bpm} bpm`);
    });
    if (follow.on) markFollow();
  }

  const placeTool = { hand: 'rh', finger: '' };
  const rollRec = { block: null, status: '', rec: null, input: null, live: '' };
  const midiState = { connected: false, message: '' };
  const live = { held: new Set(), sustained: new Set(), pedal: false, grabbed: new Set() };
  const grab = { block: null };
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
    $('#back').onclick = closeNote;
    $('#title').oninput = (e) => { n.title = e.target.value; markDirty(); };
    $('#title').onblur = () => renderList();
    $('#m-type').onchange = (e) => { n.type = e.target.value; markDirty(); renderList(); renderRail(); };
    $('#m-status').onchange = (e) => { n.status = e.target.value; markDirty(); renderList(); renderRail(); };
    $('#m-key').onchange = (e) => { n.key = e.target.value; ui.viewKey = null; markDirty(true); };
    $('#m-bpm').oninput = (e) => { n.bpm = +e.target.value || null; markDirty(); };
    const setTopic = (t) => { n.topic = t; delete n.notebook; markDirty(true); renderRail(); };
    $('#m-topic').onchange = (e) => { if (e.target.value === '__new') { $('#m-newtopic-wrap').hidden = false; $('#m-newtopic').focus(); } else setTopic(e.target.value); };
    $('#m-newtopic').onchange = async (e) => { const t = await addTopic(e.target.value); if (t) setTopic(t); };
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
      Store.remove(id).then(() => { toast('Note deleted'); document.body.classList.remove('note-open'); renderRail(); renderList(); });
    };
    $$('[data-vk]').forEach((b) => b.onclick = () => { ui.viewKey = b.dataset.vk === n.key ? null : b.dataset.vk; renderEditor(); });
    if ($('#ed-num')) $('#ed-num').onclick = () => { ui.numbers = !ui.numbers; savePrefs(); renderEditor(); };
    if ($('#apply-key')) $('#apply-key').onclick = () => {
      const s = viewShift(n), to = ui.viewKey, fl = keyFlat(to);
      n.blocks.forEach((b) => {
        if (b.prog) b.prog = b.prog.split(/\s+/).map((c) => (c === '|' ? c : M.transposeChord(c, s, fl))).join(' ');
        if (b.symbol) b.symbol = M.transposeChord(b.symbol, s, fl);
        if (b.lh) b.lh = b.lh.map((m) => m + s);
        if (b.rh) b.rh = b.rh.map((m) => m + s);
        if (b.fingers) { const f = {}; Object.entries(b.fingers).forEach(([m, v]) => { f[+m + s] = v; }); b.fingers = f; }
        if (b.roll) b.roll.events = b.roll.events.map((e) => ({ ...e, m: e.m + s }));
        if (b.kind === 'chart') { b.text = TX.mapChartChords(b.text, (c) => M.transposeChord(c, shiftBetween(keyOfBlock(n, b), to), fl)); b.key = to; }
        if (b.kind === 'melody') { const t = shiftBetween(keyOfBlock(n, b), to); b.notes = (b.notes || []).map((e) => ({ ...e, m: e.m + t })); if (b.take) b.take = { ...b.take, events: b.take.events.map((e) => ({ ...e, m: e.m + t })) }; b.key = to; b.text = null; }
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
      if (kind === 'melody') { const rc = recCfg(); Object.assign(blk, { label: n.title || '', key: n.key || 'C', beats: rc.beats, bpm: rc.bpm, notes: [], q: 0.5, editing: true, text: '' }); }
      if (kind === 'chart') Object.assign(blk, { label: n.title || '', key: n.key || 'C', beats: 4, bpm: n.bpm || 80, text: 'Verse :\n| C | G | Am | F |\n| C | G | F . G . | C |', editing: true });
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
    $$('[data-drill]').forEach((x) => x.onclick = () => startDrill(n, B(x.dataset.drill)));
    $$('[data-mid]').forEach((x) => x.onclick = () => downloadMidi(n, B(x.dataset.mid)));
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
    $$('[data-midi]').forEach((x) => x.onclick = async () => {
      const r = await connectMidi();
      renderEditor();
      const st = $(`[data-rollstatus="${x.dataset.midi}"]`); if (st) st.textContent = r.message;
    });
    const segsOf = (i) => U.segmentChords(B(i).roll.events, { flat: keyFlat(n.key || 'C') });
    $$('[data-segplay]').forEach((x) => x.onclick = () => { const [i, j] = x.dataset.segplay.split(':'); const sg = U.segmentChords(B(i).roll.events.map((e) => ({ ...e, m: e.m + semis })))[+j]; if (sg) U.playVoicing(sg.lh, sg.rh); });
    $$('[data-seg2prog]').forEach((x) => x.onclick = () => {
      const segs = segsOf(x.dataset.seg2prog).filter((sg) => sg.name && M.parseChord(sg.name));
      if (!segs.length) { toast('No nameable chords in this take'); return; }
      const ds = segs.map((sg) => sg.d).sort((a, c) => a - c), med = ds[Math.floor(ds.length / 2)];
      const beats = [1, 2, 4, 8].reduce((best, v) => (Math.abs(v - med) < Math.abs(best - med) ? v : best), 4);
      n.blocks.splice(+x.dataset.seg2prog + 1, 0, { id: uid('b'), kind: 'chords', label: 'Chords from ' + (B(x.dataset.seg2prog).label || 'take'), prog: segs.map((sg) => sg.name).join(' '), beats });
      markDirty(true); toast('Added ' + segs.length + ' chords');
    });
    bindCharts(n, semis, B);
    $$('[data-seg2place]').forEach((x) => x.onclick = () => {
      const seen = new Set(), add = [];
      segsOf(x.dataset.seg2place).forEach((sg) => { const k = sg.notes.join(','); if (!seen.has(k) && add.length < 8) { seen.add(k); add.push({ id: uid('b'), kind: 'placement', label: sg.name || 'Voicing', symbol: sg.name || '', lh: sg.lh, rh: sg.rh, fingers: {} }); } });
      n.blocks.splice(+x.dataset.seg2place + 1, 0, ...add);
      markDirty(true); toast('Added ' + add.length + ' voicings');
    });
    $$('[data-grab]').forEach((x) => x.onclick = async () => {
      const b = B(x.dataset.grab);
      if (grab.block === b.id) { grab.block = null; renderEditor(); return; }
      if (semis) { toast('Switch back to the note\'s key to capture a placement'); return; }
      ensureInput();
      if (!midiState.connected && navigator.requestMIDIAccess) await connectMidi();
      grab.block = b.id; live.grabbed.clear();
      renderEditor();
      toast('Hold the chord, then let go');
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
  const liveFlat = () => keyFlat((current && (ui.viewKey || current.key)) || 'C');
  function showLive() {
    const name = U.liveName(new Set([...live.held, ...live.sustained]), liveFlat());
    rollRec.live = name;
    $$('[data-live]').forEach((el) => { el.textContent = name || (rollRec.rec && rollRec.rec.armed ? 'Waiting — start playing' : '…'); });
    const top = $('#live-top'); if (top) { top.textContent = name ? '🎹 ' + name : ''; top.hidden = !name; }
  }
  function liveOn(m, v) {
    if (ui.sound !== false) M.tone(m, 0, 1.0, { vel: 0.08 + v / 700 });
    if (rollRec.rec) rollRec.rec.noteOn(m, v);
    rwOn(m, v);
    live.held.add(m); live.sustained.delete(m); live.grabbed.add(m);
    if (drill.on) drill.check();
    if (follow.on) followCheck(m);
    const k = $(`.mini-input rect[data-m="${m}"]`); if (k) k.style.filter = 'brightness(.75)';
    showLive();
  }
  function liveOff(m) {
    if (rollRec.rec) rollRec.rec.noteOff(m);
    rwOff(m);
    live.held.delete(m);
    if (live.pedal) live.sustained.add(m);
    const k = $(`.mini-input rect[data-m="${m}"]`); if (k) k.style.filter = '';
    if (!live.held.size) {
      if (finder.on && live.grabbed.size > 1) finishFinder(Array.from(live.grabbed));
      else if (grab.block && live.grabbed.size > 1) applyGrab(Array.from(live.grabbed));
      live.grabbed.clear();
    }
    showLive();
  }
  function livePedal(down) {
    live.pedal = down;
    rwPedal(down);
    if (rollRec.rec) rollRec.rec.pedal(down);
    if (!down) live.sustained.clear();
    showLive();
  }
  function applyGrab(notes) {
    const n = current; if (!n) return;
    const b = (n.blocks || []).find((x) => x.id === grab.block);
    grab.block = null;
    if (!b) return;
    const s = notes.slice().sort((a, c) => a - c);
    const split = s.length > 1 && s[0] < 60 ? 60 : s[0] + 1;
    b.lh = s.filter((m) => m < split); b.rh = s.filter((m) => m >= split); b.fingers = {};
    if (!b.lh.length && b.rh.length > 1) b.lh = [b.rh.shift()];
    const name = U.detectName(s, liveFlat());
    if (name) { b.symbol = name; if (!b.label) b.label = name; }
    toast('Captured ' + (name ? M.pretty(name) : s.length + ' notes'));
    markDirty(true);
  }
  function ensureInput() {
    if (!rollRec.input) rollRec.input = U.noteInput({ on: liveOn, off: liveOff, pedal: livePedal, octave: (o) => toast('Octave ' + o), midiChange: (names) => { midiState.connected = names.length > 0; renderRail(); } }, { enabled: () => !!rollRec.block || !!grab.block || finder.on || drill.on || follow.on });
  }
  let silentMidi = false;
  async function connectMidi() {
    ensureInput();
    const r = await rollRec.input.connectMidi();
    midiState.connected = r.ok && !/No MIDI/.test(r.message);
    midiState.message = r.message;
    if (midiState.connected) { ui.midiAuto = true; savePrefs(); }
    if (!silentMidi) toast(r.message);
    renderRail();
    return r;
  }
  function showBeat(i, bar, k, countIn) {
    const box = $(`[data-beatbox="${i}"]`); if (!box) return;
    const beats = rollRec.beats || 4;
    box.innerHTML = `<span class="bb-label">${countIn ? 'Count-in' : 'Bar ' + (bar + 1)}</span>${Array.from({ length: beats }, (_, j) => `<span class="bb-dot ${j === k ? 'on' : ''} ${j === 0 ? 'first' : ''} ${countIn ? 'ci' : ''}">${j + 1}</span>`).join('')}`;
    const st = $(`[data-rollstatus="${i}"]`); if (st && countIn) st.textContent = 'Count-in… start on bar 1 (a pickup during the count-in is kept)';
  }
  function toggleRollRecord(n, b, i) {
    ensureInput();
    if (rollRec.block === b.id) {
      rollRec.rec.stop();
      const take = rollRec.rec.take(rollRec.free ? 0 : (($(`[data-rollq="${i}"]`) || {}).value != null ? +$(`[data-rollq="${i}"]`).value : 0.5));
      const roll = { bpm: rollRec.rec.bpm, events: take.events, recorded: Date.now(), clicked: !rollRec.free, beats: rollRec.beats, downbeat: take.downbeat };
      rollRec.block = null; rollRec.rec = null;
      if (!roll.events.length) { renderEditor(); toast('Nothing recorded'); return; }
      if (b.kind === 'melody') {
        const f = melodyFields(roll, null);
        if (!f || !f.notes.length) { renderEditor(); toast('No melody found in that take'); return; }
        Object.assign(b, clean(f), { take: roll, editing: false, text: null });
        toast(`Melody written: ${b.notes.length} notes`);
      } else { b.roll = roll; toast(`Saved a take with ${roll.events.length} notes`); }
      markDirty(true); return;
    }
    if (rollRec.block) { toast('Finish the other take first'); return; }
    stopChart(); follow.on = false;
    if (metro.on) toggleMetro();
    const c = recCfg();
    rollRec.rec = U.rollRecorder();
    rollRec.block = b.id; rollRec.beats = c.beats; rollRec.free = c.mode === 'free'; rollRec.live = '';
    rollRec.rec.onChange = () => { const st = $(`[data-rollstatus="${i}"]`); if (st) st.textContent = `● Recording · ${rollRec.rec.events.length} notes`; };
    const started = () => { rollRec.status = '● Recording · press Stop when you finish'; const st = $(`[data-rollstatus="${i}"]`); if (st) st.textContent = rollRec.status; showLive(); };
    if (rollRec.free) { rollRec.rec.arm(c.bpm, started); rollRec.status = 'Waiting — recording starts on your first note'; renderEditor(); return; }
    rollRec.status = 'Count-in…';
    renderEditor();
    rollRec.rec.begin({ bpm: c.bpm, beats: c.beats, countBars: c.countBars, click: c.click, onStarted: started, onBeat: (bar, k, ci) => showBeat(i, bar, k, ci) });
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

  async function midiCapture() {
    if (rollRec.block) { toast('Finish the current take first'); return; }
    const r = await connectMidi();
    const n = newNote('improv');
    n.title = 'MIDI capture ' + new Date().toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    n.body = 'Captured from my keyboard. Chords found in the take are listed under it.';
    const b = { id: uid('b'), kind: 'roll', label: 'Take 1', roll: { bpm: n.bpm || 80, events: [] } };
    n.blocks = [b];
    await Store.add(n);
    select(n.id);
    toggleRollRecord(n, b, 0);
    if (!r.ok || !midiState.connected) toast('No MIDI keyboard found — you can play on the computer keys (A S D F…)');
  }

  /* ======================= Rewind: always listening, save what you just played ======================= */
  const KEEP_MS = 5 * 60 * 1000;
  const rewind = { notes: [], open: new Map(), sustained: new Set(), pedal: false };
  function rwEnd(m) {
    const a = rewind.open.get(m); if (!a) return;
    rewind.open.delete(m); rewind.sustained.delete(m);
    a.off = performance.now(); rewind.notes.push(a);
    const cut = a.off - KEEP_MS;
    while (rewind.notes.length && rewind.notes[0].off < cut) rewind.notes.shift();
    const el = $('#rw-count'); if (el) el.textContent = rewind.notes.length + ' notes kept';
  }
  function rwOn(m, v) { if (rewind.open.has(m)) rwEnd(m); rewind.open.set(m, { m, on: performance.now(), v }); }
  function rwOff(m) { if (rewind.pedal && rewind.open.has(m)) rewind.sustained.add(m); else rwEnd(m); }
  function rwPedal(down) { rewind.pedal = down; if (!down) Array.from(rewind.sustained).forEach(rwEnd); }
  async function saveRewind(seconds) {
    const now = performance.now(), from = now - seconds * 1000;
    const raw = rewind.notes.concat(Array.from(rewind.open.values()).map((a) => ({ ...a, off: now }))).filter((a) => a.off > from);
    if (!raw.length) { toast('Nothing played in the last ' + (seconds < 60 ? seconds + ' seconds' : seconds / 60 + ' minutes')); return; }
    const bpm = 80, t0 = Math.max(from, Math.min(...raw.map((a) => a.on)));
    const events = raw.map((a) => ({ m: a.m, v: a.v || 90, t: +(Math.max(0, a.on - t0) / 1000 * bpm / 60).toFixed(3), d: +Math.max(0.05, (a.off - Math.max(a.on, t0)) / 1000 * bpm / 60).toFixed(3) }));
    const n = newNote(ui.topic ? typeForTopic(ui.topic) : 'improv');
    n.title = 'Played ' + new Date().toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    n.bpm = bpm;
    n.blocks = [{ id: uid('b'), kind: 'roll', label: 'What I played', roll: { bpm, events, recorded: Date.now() } }];
    const segs = U.segmentChords(events, { flat: keyFlat(n.key) }).filter((sg) => sg.name && M.parseChord(sg.name));
    if (segs.length > 1) n.blocks.push({ id: uid('b'), kind: 'chords', label: 'Chords I played', prog: segs.map((sg) => sg.name).join(' '), beats: 2 });
    await Store.add(n);
    select(n.id);
    toast('Saved ' + events.length + ' notes from the last ' + (seconds < 60 ? seconds + ' s' : seconds / 60 + ' min'));
  }

  /* ======================= Find by playing ======================= */
  const finder = { on: false };
  const pcsKey = (pcs) => Array.from(new Set(pcs.map((p) => M.mod(p)))).sort((a, b) => a - b).join(',');
  const symKey = (sym) => { const ch = M.parseChord(sym); return ch ? pcsKey(ch.pcs) : ''; };
  function noteChordSyms(n) {
    const out = bodyChords(n);
    (n.blocks || []).forEach((b) => {
      if (b.kind === 'chords') out.push(...(b.prog || '').split(/\s+/).filter((c) => c && c !== '|'));
      if (b.kind === 'placement') { if (b.symbol) out.push(b.symbol); }
    });
    return out;
  }
  function noteHasChord(n, key) {
    if (noteChordSyms(n).some((c) => symKey(c) === key)) return true;
    return (n.blocks || []).some((b) => b.kind === 'placement' && pcsKey((b.lh || []).concat(b.rh || [])) === key);
  }
  async function toggleFinder() {
    if (finder.on) { finder.on = false; renderList(); return; }
    ensureInput();
    if (!midiState.connected && navigator.requestMIDIAccess && !embedded) await connectMidi();
    finder.on = true; live.grabbed.clear();
    renderList();
    toast('Hold a chord, then let go');
  }
  function finishFinder(notes) {
    finder.on = false;
    const name = U.detectName(notes, liveFlat());
    const key = pcsKey(notes);
    go({ list: 'all', findChord: { key, name: name || notes.slice().sort((a, b) => a - b).map((m) => M.nameOf(m % 12, liveFlat())).join(' ') } });
  }

  /* ======================= Number view (Nashville numbers) ======================= */
  const DEG = ['1', '♭2', '2', '♭3', '3', '4', '♯4', '5', '♭6', '6', '♭7', '7'];
  function toNumber(sym, key) {
    const ch = M.parseChord(sym); if (!ch) return M.pretty(sym);
    const k = M.KEYS[keyIdx(key)].pc;
    return DEG[M.mod(M.pcOf(ch.root) - k)] + M.pretty(ch.suffix) + (ch.bass ? '/' + DEG[M.mod(M.pcOf(ch.bass) - k)] : '');
  }
  const chordLabel = (c, n, semis) => (ui.numbers && n && n.key ? toNumber(c, n.key) : M.pretty(tr(c, semis || 0, ui.viewKey)));

  /* ======================= Export a take as a MIDI file ======================= */
  function midiFile(roll) {
    const tpq = 480, ev = [];
    (roll.events || []).forEach((e) => { ev.push([Math.round(e.t * tpq), 0x90, e.m, Math.max(1, Math.min(127, e.v || 90))]); ev.push([Math.round((e.t + e.d) * tpq), 0x80, e.m, 0]); });
    ev.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const vlq = (n) => { const out = [n & 0x7f]; while ((n >>= 7)) out.unshift((n & 0x7f) | 0x80); return out; };
    const us = Math.round(60000000 / (roll.bpm || 80));
    const trk = [0, 0xff, 0x51, 3, (us >> 16) & 255, (us >> 8) & 255, us & 255];
    let last = 0;
    ev.forEach(([t, st, m, v]) => { trk.push(...vlq(t - last), st, m, v); last = t; });
    trk.push(0, 0xff, 0x2f, 0);
    const len = trk.length;
    return new Uint8Array([0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 1, tpq >> 8, tpq & 255, 0x4d, 0x54, 0x72, 0x6b, (len >>> 24) & 255, (len >> 16) & 255, (len >> 8) & 255, len & 255].concat(trk));
  }
  function downloadMidi(n, b) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([midiFile(b.roll)], { type: 'audio/midi' }));
    a.download = ((n.title || 'take') + (b.label ? ' - ' + b.label : '')).replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') + '.mid';
    a.click(); toast('MIDI file saved');
  }

  /* ======================= 12-key drill: plays through every key and checks what you play ======================= */
  const drill = { on: false };
  function startDrill(n, b) {
    const base = (b.prog || '').split(/\s+/).filter((c) => c && c !== '|' && M.parseChord(c));
    if (!base.length) { toast('Add some chords first'); return; }
    ensureInput();
    const startPc = M.KEYS[keyIdx(n.key || 'C')].pc;
    const keys = Array.from({ length: 12 }, (_, i) => M.KEYS.find((k) => k.pc === M.mod(startPc + i * 5)));
    Object.assign(drill, { on: true, n, base, keys, ki: 0, ci: 0, start: Date.now(), hits: 0, skipped: 0 });
    const ov = $('#practice'); ov.hidden = false;
    const chordsIn = (ki) => { const k = drill.keys[ki]; let s = M.mod(k.pc - startPc); if (s > 6) s -= 12; return drill.base.map((c) => M.transposeChord(c, s, k.flat || k.pc === 0)); };
    drill.chordsIn = chordsIn;
    const draw = () => {
      const k = drill.keys[drill.ki], cs = chordsIn(drill.ki), nextK = drill.keys[drill.ki + 1];
      ov.innerHTML = `<div class="pm">
        <div class="spread"><div><div class="small muted">12-key drill · circle of 4ths</div><h1 style="margin:4px 0">${esc(n.title || 'Untitled')}</h1></div><button class="btn" id="dr-close">Finish</button></div>
        <div class="dr-keys">${drill.keys.map((x, i) => `<span class="dr-key ${i < drill.ki ? 'done' : i === drill.ki ? 'now' : ''}">${M.pretty(x.name)}</span>`).join('')}</div>
        <div class="dr-now">Key of <b>${M.pretty(k.name)}</b> <span class="muted small">· ${drill.ki + 1} of 12</span></div>
        <div class="chips pm-chips">${cs.map((c, i) => `<span class="chip ${i === drill.ci ? 'on' : i < drill.ci ? 'hit' : ''}">${esc(M.pretty(c))}<small>${esc(toNumber(drill.base[i], n.key || 'C'))}</small></span>`).join('')}</div>
        <p class="dr-status" id="dr-status">${midiState.connected ? 'Play each chord — any voicing. It moves on when it hears the right notes.' : 'No MIDI keyboard connected: play it, then press Space (or tap Next).'}</p>
        <div class="row" style="justify-content:center"><button class="btn" id="dr-hear">▶ Hear it</button><button class="btn primary" id="dr-next">Next chord</button><button class="btn ghost" id="dr-skip">Skip key</button>${midiState.connected ? '' : '<button class="btn ghost" id="dr-midi">🎹 Connect MIDI</button>'}</div>
        ${nextK ? `<p class="small muted" style="text-align:center;margin-top:16px">Next key: ${M.pretty(nextK.name)} — ${chordsIn(drill.ki + 1).map(M.pretty).join('  ')}</p>` : '<p class="small muted" style="text-align:center;margin-top:16px">Last key!</p>'}
      </div>`;
      $('#dr-close').onclick = finish;
      $('#dr-next').onclick = () => advance(false);
      $('#dr-skip').onclick = () => { drill.skipped++; drill.ci = 0; drill.ki++; drill.ki >= 12 ? finish() : draw(); };
      $('#dr-hear').onclick = () => M.playProgression(cs, { bpm: n.bpm || 80, beats: 2 });
      if ($('#dr-midi')) $('#dr-midi').onclick = async () => { await connectMidi(); draw(); };
    };
    const advance = (heard) => {
      if (heard) drill.hits++;
      drill.ci++;
      if (drill.ci >= drill.base.length) { drill.ci = 0; drill.ki++; if (drill.ki >= 12) { finish(); return; } M.click(M.audio().currentTime + 0.02, true); }
      draw();
    };
    const onKey = (e) => { if (!drill.on) return; if (e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); advance(false); } if (e.key === 'Escape') finish(); };
    document.addEventListener('keydown', onKey);
    function finish() {
      document.removeEventListener('keydown', onKey);
      drill.on = false; M.stopAll();
      const mins = Math.max(1, Math.round((Date.now() - drill.start) / 60000));
      const keysDone = Math.min(12, drill.ki) - drill.skipped;
      ov.innerHTML = `<div class="pm"><h2>${keysDone >= 12 ? 'All 12 keys — done! 🎉' : 'Drill finished'}</h2><p>You played it in <b>${Math.max(0, keysDone)}</b> of 12 keys in about <b>${mins} min</b>${drill.hits ? `, with ${drill.hits} chords heard correctly` : ''}.</p>
        <div class="row" style="margin-top:14px"><button class="btn primary" id="dr-log">Log this practice</button><button class="btn ghost" id="dr-nolog">Don't log</button></div></div>`;
      $('#dr-log').onclick = () => { ov.hidden = true; logPractice(n, mins, n.bpm || null, `12-key drill: ${Math.max(0, keysDone)}/12 keys`); };
      $('#dr-nolog').onclick = () => { ov.hidden = true; };
    }
    // called on every note-on while the drill runs
    drill.check = () => {
      const target = M.parseChord(chordsIn(drill.ki)[drill.ci]); if (!target) return;
      const heldPcs = new Set([...live.held, ...live.sustained].map((m) => m % 12));
      let need = Array.from(new Set(target.pcs.map((p) => M.mod(p))));
      if (need.length >= 4) { const fifth = M.mod(M.pcOf(target.root) + 7); need = need.filter((p) => p !== fifth); } // the 5th may be left out of bigger chords
      if (need.every((p) => heldPcs.has(p))) {
        const st = $('#dr-status'); if (st) st.textContent = '✓ ' + M.pretty(target.symbol);
        clearTimeout(drill.t); drill.t = setTimeout(() => advance(true), 350);
      }
    };
    draw();
  }

  /* ---------- templates ---------- */
  const TEMPLATES = [
    { id: 'improv', icon: '✦', name: 'Improvisation', desc: 'A loop to play over, a piano-roll take, and notes on what worked.', make: (n) => { n.type = 'improv'; n.body = '# Over what?\nThe loop: [C] [G] [Am] [F]\n\n# What I played\n- Scale / notes I used:\n- Rhythm idea:\n\n# Try next\n- '; n.blocks = [{ id: uid('b'), kind: 'chords', label: 'Loop', prog: 'C G Am F', beats: 4 }, { id: uid('b'), kind: 'roll', label: 'Take 1', roll: { bpm: n.bpm || 80, events: [] } }]; } },
    { id: 'movement', icon: '⇄', name: 'Chord movement', desc: 'A progression with the voicing that makes it move.', make: (n) => { n.type = 'movement'; n.body = '# The movement\nFrom [C] to [F] via …\n\n- Where I use it:\n- Bass line:\n- Inner voice that moves:'; n.blocks = [{ id: uid('b'), kind: 'chords', label: 'Movement', prog: 'C C/E F G', beats: 2 }, { id: uid('b'), kind: 'placement', label: 'Key voicing', lh: [], rh: [], fingers: {}, symbol: '' }]; } },
    { id: 'placement', icon: '✋', name: 'Hand placement', desc: 'A keyboard diagram with fingering for both hands.', make: (n) => { n.type = 'placement'; n.body = 'Where my hands sit, which fingers, and why.'; n.blocks = [{ id: uid('b'), kind: 'placement', label: 'Placement', lh: [], rh: [], fingers: {}, symbol: '' }]; } },
    { id: 'lick', icon: '〰', name: 'Lick or run', desc: 'Capture a fill or run and a checklist to learn it in all keys.', make: (n) => { n.type = 'lick'; n.body = 'Where it fits: between vocal lines over [C]'; n.blocks = [{ id: uid('b'), kind: 'roll', label: 'The lick', roll: { bpm: n.bpm || 80, events: [] } }, { id: uid('b'), kind: 'checklist', label: 'Learn it', items: ['C', 'G', 'F', 'D', 'Bb'].map((k) => ({ t: 'Play it in ' + k, done: false })) }]; } },
    { id: 'melody', icon: '🎼', name: 'Melody', desc: 'Record a tune with the count-in, or type it in letters, for students to read and play along.', make: (n) => { n.type = 'song'; n.body = ''; const rc = recCfg(); n.blocks = [{ id: uid('b'), kind: 'melody', label: '', key: 'C', beats: rc.beats, bpm: rc.bpm, q: 0.5, editing: true, text: '| G | C CB A G | EF G – C | A – – · |', notes: TX.parseMelodyText('| G | C CB A G | EF G – C | A – – · |', rc.beats).notes }]; } },
    { id: 'chart', icon: '📄', name: 'Chord chart', desc: 'A song chart like a PDF lead sheet: key, time, tempo, sections and bars. Print it or play along.', make: (n) => { n.type = 'song'; n.body = ''; n.blocks = [{ id: uid('b'), kind: 'chart', label: '', key: 'C', beats: 4, bpm: 80, editing: true, text: 'Verse :\n| C | G | Am . . F | C . G . |\n| Am | Dm | G | C |\n\nChorus :\n| F | G | Em Am | F . G . |' }]; } },
    { id: 'song', icon: '♫', name: 'Song arrangement', desc: 'Sections, chords and cues for a song you play.', make: (n) => { n.type = 'song'; n.body = '# Intro\n# Verse\n# Chorus\n# Bridge\n# Ending'; n.blocks = [{ id: uid('b'), kind: 'chords', label: 'Verse', prog: '', beats: 4 }, { id: uid('b'), kind: 'chords', label: 'Chorus', prog: '', beats: 4 }]; } },
    { id: 'blank', icon: '✎', name: 'Blank note', desc: 'Just write.', make: (n) => { n.type = 'idea'; } }
  ];
  function newNote(type) {
    return { id: 'note-' + uid(''), title: '', type: type || 'idea', topic: ui.topic || '', tags: ui.tag ? [ui.tag] : [], key: 'C', bpm: 80, status: 'idea', pinned: false, favourite: false, body: '', blocks: [], comments: [], practice: [], links: [], created: Date.now(), updated: Date.now() };
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
    a.href = URL.createObjectURL(new Blob([JSON.stringify({ app: 'riffbook', version: 2, exported: new Date().toISOString(), topics: Store.topics(), notes })], { type: 'application/json' }));
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
      if (data.topics) await Store.saveTopics(Store.topics().concat(data.topics));
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
    if (rollRec.block || drill.on || finder.on || follow.on) return;
    if (e.key === 'n') { e.preventDefault(); openTemplates(); }
    if (e.key === '/') { e.preventDefault(); $('#q') && $('#q').focus(); }
    if (e.key === 'Escape') { if (!$('#practice').hidden) { const c = $('#pm-close') || $('#dr-close') || $('#pmf-skip') || $('#dr-nolog'); if (c) c.click(); else $('#practice').hidden = true; return; } if (!$('#templates').hidden) { $('#templates').hidden = true; return; } if (document.body.classList.contains('rail-open')) { document.body.classList.remove('rail-open'); return; } if (document.body.classList.contains('note-open')) closeNote(); }
  });
  $('#scrim').onclick = () => document.body.classList.remove('rail-open');
  window.addEventListener('beforeunload', () => { flush(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });

  setTheme(ui.theme);
  ui.selected = null; ui.q = '';
  renderRail(); renderList(); renderEditor();
  Store.on((remote) => {
    const sel = (ui.selected && Store.get(ui.selected)) || null;
    const pane = $('#note-pane');
    const typing = pane.contains(document.activeElement) && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if (sel !== current) { current = sel; renderEditor(); }
    else if (remote && current && !current._dirty && !typing && !rollRec.block && !micRec.mr) renderEditor();
    if (!$('#rail').contains(document.activeElement) || document.activeElement.tagName !== 'INPUT') renderRail();
    const a = document.activeElement;
    if (!document.body.classList.contains('note-open') && !($('#list-pane').contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName))) renderList();
  });
  Store.init();
  if (ui.midiAuto && !embedded && navigator.requestMIDIAccess) { silentMidi = true; connectMidi().catch(() => {}).then(() => { silentMidi = false; }); }
  if (!embedded && 'serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => {});
  window.Riffbook = { exampleNotes, DEFAULT_TOPICS };
})();
