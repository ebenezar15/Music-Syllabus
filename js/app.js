/* Syllabus Studio — UI */
(function () {
  const M = window.Music;
  const TOPICS = window.TOPICS;
  const MODULES = window.MODULES.slice().sort((a, b) => a.order - b.order);
  const byId = Object.fromEntries(TOPICS.map((t) => [t.id, t]));
  const modById = Object.fromEntries(MODULES.map((m) => [m.id, m]));
  const LEVEL_NAMES = { 1: 'Beginner', 2: 'Elementary', 3: 'Intermediate', 4: 'Advanced' };
  const THEMES = [
    { id: 'sunrise', name: 'Sunrise', c: ['#e8664a', '#f2a541'] },
    { id: 'midnight', name: 'Midnight Keys', c: ['#0e1424', '#f5c451'] },
    { id: 'ocean', name: 'Ocean', c: ['#0e8fa3', '#36c2b4'] },
    { id: 'forest', name: 'Forest', c: ['#3f7d3a', '#b8a046'] },
    { id: 'royal', name: 'Royal Worship', c: ['#231b42', '#b388ff'] },
    { id: 'rose', name: 'Rose', c: ['#c2577a', '#d9a066'] },
    { id: 'studio', name: 'Studio Mono', c: ['#161616', '#ff5a36'] },
    { id: 'neon', name: 'Neon Groove', c: ['#0b0b12', '#ff3ea5'] },
    { id: 'ember', name: 'Ember', c: ['#2a1d19', '#ff8a3d'] }
  ];

  /* ---------------- State (persisted per browser) ---------------- */
  const STORE_KEY = 'syllabus-studio-v1';
  const defaults = {
    theme: 'sunrise', autoTheme: false, key: 0, done: {}, notes: {}, checks: {},
    program: 'level1', start: '', lessonDays: [2], schedDone: {}, plan: [], planName: 'My teaching plan',
    routineMins: 30, routineLevel: 1, lastTopic: null, filterLevel: 0, filterModule: ''
  };
  let S = Object.assign({}, defaults);
  try { Object.assign(S, JSON.parse(localStorage.getItem(STORE_KEY) || '{}')); } catch (e) { /* storage unavailable */ }
  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const view = $('#view');
  const keyObj = () => M.KEYS[S.key];
  const toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 1800); };
  const lvlPill = (n) => `<span class="pill lvl-${n}">${LEVEL_NAMES[n] || ''}</span>`;
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

  /* ---------------- Themes ---------------- */
  function applyTheme(id) {
    S.theme = id; save();
    document.documentElement.setAttribute('data-scheme', id);
    $$('#themes .swatch').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.theme === id)));
  }
  function nextTheme(random) {
    const i = THEMES.findIndex((t) => t.id === S.theme);
    let n = (i + 1) % THEMES.length;
    if (random) { do { n = Math.floor(Math.random() * THEMES.length); } while (n === i); }
    applyTheme(THEMES[n].id);
    toast('🎨 ' + THEMES[n].name);
  }
  $('#themes').innerHTML = THEMES.map((t) => `<button class="swatch" data-theme="${t.id}" title="${t.name}" aria-label="${t.name} colour scheme" style="background:linear-gradient(135deg,${t.c[0]} 50%,${t.c[1]} 50%)"></button>`).join('');
  $('#themes').addEventListener('click', (e) => { const b = e.target.closest('.swatch'); if (b) { applyTheme(b.dataset.theme); toast('🎨 ' + b.title); } });
  $('#shuffle-theme').onclick = () => nextTheme(true);
  $('#theme-btn').onclick = () => nextTheme(false);
  $('#auto-theme').checked = !!S.autoTheme;
  $('#auto-theme').onchange = (e) => { S.autoTheme = e.target.checked; save(); };
  if (S.autoTheme) { const i = THEMES.findIndex((t) => t.id === S.theme); S.theme = THEMES[(i + 1) % THEMES.length].id; }
  applyTheme(S.theme);

  /* ---------------- Sidebar ---------------- */
  $('#module-nav').innerHTML = MODULES.map((m) => `<a href="#/module/${m.id}"><span class="ico">${m.icon}</span>${esc(m.nav || m.title)}</a>`).join('');
  const sidebar = $('#sidebar'), scrim = $('#scrim');
  const closeMenu = () => { sidebar.classList.remove('open'); scrim.classList.remove('show'); };
  $('#menu-btn').onclick = () => { sidebar.classList.add('open'); scrim.classList.add('show'); };
  scrim.onclick = closeMenu;

  /* ---------------- Shared widgets ---------------- */
  const keyChooser = (cls = '') => `<div class="keybar ${cls}" role="group" aria-label="Choose key">${M.KEYS.map((k, i) => `<button data-key="${i}" class="${i === S.key ? 'on' : ''}">${M.pretty(k.name)}</button>`).join('')}</div>`;
  function bindKeyChooser(root, onChange) {
    $$('.keybar button', root).forEach((b) => b.onclick = () => {
      S.key = +b.dataset.key; save();
      $$('.keybar button', root).forEach((x) => x.classList.toggle('on', +x.dataset.key === S.key));
      onChange && onChange();
    });
  }

  // Piano keyboard: midi range [from, to]
  function pianoHTML(from = 48, to = 83, small = false) {
    let whites = '', blacks = '', wi = 0;
    const WHITE = [0, 2, 4, 5, 7, 9, 11];
    const w = small ? 24 : 34, bw = small ? 15 : 22;
    for (let m = from; m <= to; m++) {
      const pc = m % 12, name = M.SHARPS[pc] + (Math.floor(m / 12) - 1);
      if (WHITE.includes(pc)) {
        whites += `<div class="w ${m === 60 ? 'mc' : ''}" data-midi="${m}" title="${name}">${pc === 0 ? name : ''}</div>`;
        wi++;
      } else {
        blacks += `<div class="b" data-midi="${m}" title="${M.SHARPS[pc]}/${M.FLATS[pc]}" style="left:${wi * w - bw / 2}px"></div>`;
      }
    }
    return `<div class="piano-wrap"><div class="piano ${small ? 'small' : ''}">${whites}${blacks}</div></div>`;
  }
  function bindPiano(root, opts = {}) {
    $$('.piano [data-midi]', root).forEach((k) => k.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const m = +k.dataset.midi;
      M.tone(m, 0, 0.9);
      k.classList.add('on'); setTimeout(() => k.classList.remove('on'), 350);
      opts.onKey && opts.onKey(m);
    }));
  }
  function highlight(root, midis, pcsOnly) {
    const set = new Set(midis);
    const pcs = new Set(midis.map((m) => m % 12));
    $$('.piano [data-midi]', root).forEach((k) => {
      const m = +k.dataset.midi;
      k.classList.toggle('on', pcsOnly ? pcs.has(m % 12) : set.has(m));
    });
  }

  // Render a progression string as chips, transposed to the current key
  function progChips(prog, fixed, keyIdx = S.key) {
    const k = M.KEYS[keyIdx];
    return prog.trim().split(/\s+/).map((tok) => {
      if (tok === '|') return '<span class="chip bar">|</span>';
      const sym = fixed ? tok : M.transposeChord(tok, k.pc, k.flat);
      const ch = M.parseChord(sym);
      return `<button class="chip" data-chord="${esc(sym)}" title="${ch ? esc(ch.notes.join(' ')) : ''}">${esc(M.pretty(sym))}</button>`;
    }).join('');
  }
  function bindChips(root, pianoRoot) {
    $$('.chip[data-chord]', root).forEach((c) => c.onclick = () => {
      $$('.chip', root).forEach((x) => x.classList.remove('on'));
      c.classList.add('on');
      const midis = M.playChord(c.dataset.chord, { dur: 1.6 });
      if (pianoRoot) highlight(pianoRoot, midis);
    });
  }

  /* ---------------- Router ---------------- */
  const routes = {
    home: renderHome, syllabus: renderSyllabus, module: renderModule, topic: renderTopic,
    schedule: renderSchedule, planner: renderPlanner, tools: renderTools, resources: renderResources
  };
  function route() {
    M.stopAll();
    const [name, arg] = (location.hash.replace(/^#\/?/, '') || 'home').split('/');
    (routes[name] || renderHome)(arg && decodeURIComponent(arg));
    $$('#nav a, #module-nav a').forEach((a) => {
      const h = a.getAttribute('href').slice(2);
      a.classList.toggle('active', h === name || h === `${name}/${arg}` || (name === 'topic' && byId[arg] && h === 'module/' + byId[arg].module));
    });
    closeMenu();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);

  /* ---------------- Dashboard ---------------- */
  function renderHome() {
    const doneCount = TOPICS.filter((t) => S.done[t.id]).length;
    const nextUp = TOPICS.slice().sort((a, b) => modById[a.module].order - modById[b.module].order).find((t) => !S.done[t.id]);
    const last = S.lastTopic && byId[S.lastTopic];
    const prog = window.PROGRAMS.find((p) => p.id === S.program) || window.PROGRAMS[0];
    const sd = S.schedDone[prog.id] || [];
    const levelStats = [1, 2, 3, 4].map((l) => { const ts = TOPICS.filter((t) => t.level === l); return { l, n: ts.length, d: ts.filter((t) => S.done[t.id]).length }; });
    view.innerHTML = `
      <section class="hero">
        <div class="hero-keys" aria-hidden="true">🎹</div>
        <h1>Your music teaching studio</h1>
        <p>${TOPICS.length} lessons across ${MODULES.length} modules — each with theory, application, playable examples, exercises and an assignment — organised from beginner to advanced, plus ready-made schedules and crash courses.</p>
        <div class="row">
          <a class="btn" href="#/syllabus">📚 Open the syllabus</a>
          <a class="btn ghost" href="#/schedule">🗓️ Schedules & crash courses</a>
          <button class="btn ghost" id="hero-theme">🎨 Change colours</button>
        </div>
      </section>
      <div class="grid grid-3">
        <div class="card"><div class="muted small">Lessons completed</div><div class="stat">${doneCount} / ${TOPICS.length}</div><div class="progress"><i style="width:${pct(doneCount, TOPICS.length)}%"></i></div></div>
        <div class="card"><div class="muted small">Active schedule</div><div class="stat" style="font-size:1.15rem">${esc(prog.title)}</div><div class="progress" style="margin-top:8px"><i style="width:${pct(sd.length, prog.sessions.length)}%"></i></div><div class="small muted" style="margin-top:6px">${sd.length} of ${prog.sessions.length} ${(prog.unit || 'week').toLowerCase()}s done · <a href="#/schedule">open</a></div></div>
        <div class="card"><div class="muted small">${last ? 'Continue where you left off' : 'Suggested next lesson'}</div>${(last || nextUp) ? `<h3 style="margin:6px 0">${esc((last || nextUp).title)}</h3><a class="btn sm primary" href="#/topic/${(last || nextUp).id}">Open lesson →</a>` : '<p>Everything done! 🎉</p>'}</div>
      </div>
      <h2 style="margin-top:30px">The learning ladder</h2>
      <p class="muted">Learn the alphabet → words → sentences → stories. Every level builds on the one before.</p>
      <div class="ladder">${levelStats.map((s) => `<div class="rung"><span class="pill lvl-${s.l}">Level ${s.l}</span><b style="margin-top:8px">${LEVEL_NAMES[s.l]}</b><div class="small muted">${s.d}/${s.n} lessons</div><div class="progress" style="margin-top:8px"><i style="width:${pct(s.d, s.n)}%"></i></div></div>`).join('')}</div>
      <h2 style="margin-top:30px">Modules</h2>
      <div class="grid grid-3">${MODULES.map((m) => {
        const ts = TOPICS.filter((t) => t.module === m.id), d = ts.filter((t) => S.done[t.id]).length;
        return `<a class="topic-card" href="#/module/${m.id}" style="--h:${m.hue}"><div class="row"><span class="module-icon" style="--h:${m.hue}">${m.icon}</span><h3>${esc(m.title)}</h3></div><p>${esc(m.subtitle)}</p><div class="progress"><i style="width:${pct(d, ts.length)}%"></i></div><span class="small muted">${d}/${ts.length} lessons</span></a>`;
      }).join('')}</div>`;
    $('#hero-theme').onclick = () => nextTheme(true);
  }

  /* ---------------- Syllabus ---------------- */
  function topicCard(t) {
    const m = modById[t.module];
    return `<a class="topic-card" href="#/topic/${t.id}" style="--h:${m.hue}">
      ${S.done[t.id] ? '<span class="done-badge" title="Completed">✓</span>' : ''}
      <div class="row">${lvlPill(t.level)}<span class="pill">⏱ ${t.mins || 45} min</span></div>
      <h3>${esc(t.title)}</h3><p>${esc(t.summary || '')}</p></a>`;
  }
  function renderSyllabus() {
    view.innerHTML = `
      <h1>Syllabus</h1>
      <p class="muted">Every topic, organised in teaching order. Filter by level, module or search for a word.</p>
      <div class="filters no-print">
        <input type="search" id="q" placeholder="Search topics — e.g. slash, modulation, pads, strumming…" aria-label="Search topics">
        <select id="fl" aria-label="Level"><option value="0">All levels</option>${[1, 2, 3, 4].map((l) => `<option value="${l}" ${S.filterLevel == l ? 'selected' : ''}>${LEVEL_NAMES[l]}</option>`).join('')}</select>
        <select id="fm" aria-label="Module"><option value="">All modules</option>${MODULES.map((m) => `<option value="${m.id}" ${S.filterModule === m.id ? 'selected' : ''}>${esc(m.title)}</option>`).join('')}</select>
        <label class="row small"><input type="checkbox" id="hide-done"> Hide completed</label>
      </div>
      <div id="list"></div>`;
    const draw = () => {
      const q = $('#q').value.trim().toLowerCase(), fl = +$('#fl').value, fm = $('#fm').value, hd = $('#hide-done').checked;
      S.filterLevel = fl; S.filterModule = fm; save();
      const html = MODULES.filter((m) => !fm || m.id === fm).map((m) => {
        const ts = TOPICS.filter((t) => t.module === m.id && (!fl || t.level === fl) && (!hd || !S.done[t.id]) &&
          (!q || (t.title + ' ' + t.summary + ' ' + (t.theory || []).join(' ')).toLowerCase().includes(q)));
        if (!ts.length) return '';
        return `<div class="module-head"><span class="module-icon" style="--h:${m.hue}">${m.icon}</span><div><h2 style="margin:0"><a href="#/module/${m.id}" style="color:inherit">${esc(m.title)}</a></h2><div class="muted small">${esc(m.subtitle)}</div></div></div>
          <div class="grid grid-3">${ts.map(topicCard).join('')}</div>`;
      }).join('');
      $('#list').innerHTML = html || '<div class="empty">No topics match. Try another word.</div>';
    };
    ['q', 'fl', 'fm', 'hide-done'].forEach((id) => $('#' + id).addEventListener('input', draw));
    draw();
  }

  function renderModule(id) {
    const m = modById[id];
    if (!m) return renderSyllabus();
    const ts = TOPICS.filter((t) => t.module === id);
    const d = ts.filter((t) => S.done[t.id]).length;
    const mins = ts.reduce((a, t) => a + (t.mins || 45), 0);
    view.innerHTML = `
      <div class="crumbs"><a href="#/syllabus">Syllabus</a> / ${esc(m.title)}</div>
      <div class="topic-hero" style="--h:${m.hue}">
        <div class="row"><span class="module-icon" style="--h:${m.hue}">${m.icon}</span><h1 style="margin:0">${esc(m.title)}</h1></div>
        <p class="muted">${esc(m.subtitle)}</p>
        <div class="row"><span class="pill">${ts.length} lessons</span><span class="pill">≈ ${Math.round(mins / 60)} hours of lessons</span><span class="pill">${d} completed</span></div>
        <div class="progress" style="margin-top:12px"><i style="width:${pct(d, ts.length)}%"></i></div>
      </div>
      <div class="section"><h2>Lesson order</h2><ol>${ts.map((t) => `<li><a href="#/topic/${t.id}">${esc(t.title)}</a> ${S.done[t.id] ? '✅' : ''} <span class="muted small">— ${esc(t.summary || '')}</span></li>`).join('')}</ol></div>
      <div class="grid grid-3">${ts.map(topicCard).join('')}</div>`;
  }

  /* ---------------- Topic page ---------------- */
  function renderTopic(id) {
    const t = byId[id];
    if (!t) return renderSyllabus();
    S.lastTopic = id; save();
    const m = modById[t.module];
    const siblings = TOPICS.filter((x) => x.module === t.module);
    const i = siblings.indexOf(t);
    const prev = siblings[i - 1], next = siblings[i + 1];
    const checks = S.checks[id] || [];
    const tools = t.tools || [];
    const hasPlayable = (t.examples || []).some((e) => e && (e.prog || e.melody));
    const list = (arr) => `<ul>${arr.map((x) => `<li>${x}</li>`).join('')}</ul>`;
    let n = 0;
    const sec = (title, body, icon) => `<div class="section"><h2><span class="num">${icon || ++n}</span>${title}</h2>${body}</div>`;

    const examples = (t.examples || []).map((e, idx) => {
      if (typeof e === 'string') return `<div class="ex">${e}</div>`;
      if (e.prog) return `<div class="ex" data-ex="${idx}"><div class="spread"><span class="ex-label">${esc(e.label || 'Progression')}</span><span class="row"><button class="btn sm" data-play="${idx}">▶ Play</button>${e.fixed ? '<span class="pill">fixed key</span>' : ''}</span></div>${e.note ? `<div class="small muted">${e.note}</div>` : ''}<div class="chips">${progChips(e.prog, e.fixed)}</div></div>`;
      if (e.melody) return `<div class="ex" data-ex="${idx}"><div class="spread"><span class="ex-label">${esc(e.label || 'Melody')}</span><button class="btn sm" data-play="${idx}">▶ Play</button></div>${e.note ? `<div class="small muted">${e.note}</div>` : ''}<div class="small muted" style="margin-top:6px">${esc(e.melody)}</div></div>`;
      return '';
    }).join('');

    view.innerHTML = `
      <div class="crumbs"><a href="#/syllabus">Syllabus</a> / <a href="#/module/${m.id}">${esc(m.title)}</a> / Lesson ${i + 1} of ${siblings.length}</div>
      <div class="topic-hero" style="--h:${m.hue}">
        <div class="row">${lvlPill(t.level)}<span class="pill">⏱ ${t.mins || 45} min</span><span class="pill">${m.icon} ${esc(m.title)}</span></div>
        <h1 style="margin:10px 0 6px">${esc(t.title)}</h1>
        <p style="margin:0" class="muted">${esc(t.summary || '')}</p>
      </div>
      <div class="topic-layout">
        <div>
          ${sec('Theory', list(t.theory || []))}
          ${t.application ? sec('Application — where you use it', list(t.application)) : ''}
          ${t.examples && t.examples.length ? sec('Examples', `${hasPlayable ? `<p class="small muted">Tap a chord to hear it and see it on the keyboard. Examples are shown in the key of <b>${M.pretty(keyObj().name)}</b> — change the key on the right to practise in all 12.</p>` : ''}${examples}${hasPlayable ? `<div style="margin-top:14px">${pianoHTML(36, 84, true)}</div>` : ''}`) : ''}
          ${t.exercises ? sec('Exercises', `<ul class="checklist">${t.exercises.map((x, j) => `<li><input type="checkbox" data-check="${j}" ${checks[j] ? 'checked' : ''} aria-label="Exercise ${j + 1} done"><span>${x}</span></li>`).join('')}</ul>`) : ''}
          ${t.assignment ? sec('Assignment', `<div class="callout">📝 ${t.assignment}</div>`) : ''}
          ${t.mistakes && t.mistakes.length ? sec('Common mistakes', `<div class="callout warn">${list(t.mistakes)}</div>`, '!') : ''}
          ${t.tips && t.tips.length ? sec('Teacher tips', list(t.tips), '★') : ''}
          ${tools.length ? `<div id="tool-mount"></div>` : ''}
          <div class="pager no-print">${prev ? `<a class="btn" href="#/topic/${prev.id}">← ${esc(prev.title)}</a>` : '<span></span>'}${next ? `<a class="btn primary" href="#/topic/${next.id}">${esc(next.title)} →</a>` : '<span></span>'}</div>
        </div>
        <aside class="side-panel">
          <div class="card">
            <label class="row" style="font-weight:600"><input type="checkbox" id="done" ${S.done[id] ? 'checked' : ''}> Lesson completed</label>
            <div class="row" style="margin-top:12px">
              <button class="btn sm" id="add-plan">➕ Add to my plan</button>
              <button class="btn sm print-only" onclick="window.print()">🖨 Print</button>
            </div>
          </div>
          ${hasPlayable ? `<div class="card"><h3>Practise in any key</h3>${keyChooser()}<label class="small muted row" style="margin-top:10px">Tempo <input type="range" id="tempo" min="50" max="140" value="80"> <span id="tempo-v">80</span> bpm</label><label class="small muted row">Style <select id="style"><option value="block">Block</option><option value="broken">Broken</option><option value="arp">Arpeggio</option><option value="pad">Pad</option></select></label></div>` : ''}
          ${t.related && t.related.length ? `<div class="card"><h3>Related lessons</h3><div class="stack small">${t.related.filter((r) => byId[r]).map((r) => `<div><a href="#/topic/${r}">${esc(byId[r].title)}</a></div>`).join('')}</div></div>` : ''}
          <div class="card"><h3>My teaching notes</h3><textarea id="notes" placeholder="Students, songs to use, what worked…">${esc(S.notes[id] || '')}</textarea></div>
        </aside>
      </div>`;

    $('#done').onchange = (e) => { S.done[id] = e.target.checked; if (!e.target.checked) delete S.done[id]; save(); toast(e.target.checked ? '✅ Lesson completed' : 'Marked as not done'); };
    $('#notes').oninput = (e) => { S.notes[id] = e.target.value; save(); };
    $('#add-plan').onclick = () => { S.plan.push({ id, mins: t.mins || 45 }); save(); toast('Added to your plan'); };
    $$('[data-check]').forEach((c) => c.onchange = () => { const arr = S.checks[id] || []; arr[+c.dataset.check] = c.checked; S.checks[id] = arr; save(); });

    const pianoRoot = view;
    bindChips(view, pianoRoot);
    bindPiano(view);
    if (hasPlayable) {
      const rerender = () => {
        $$('.ex[data-ex]').forEach((el) => {
          const e = t.examples[+el.dataset.ex];
          if (e.prog) { $('.chips', el).innerHTML = progChips(e.prog, e.fixed); }
        });
        bindChips(view, pianoRoot);
        const p = $('.section p.small b'); if (p) p.textContent = M.pretty(keyObj().name);
      };
      bindKeyChooser(view, rerender);
      $('#tempo').oninput = (e) => { $('#tempo-v').textContent = e.target.value; };
      $$('[data-play]').forEach((b) => b.onclick = () => {
        const e = t.examples[+b.dataset.play];
        const el = b.closest('.ex');
        const bpm = +$('#tempo').value;
        if (e.prog) {
          const chips = $$('.chip[data-chord]', el);
          M.playProgression(chips.map((c) => c.dataset.chord), {
            bpm, beats: 4, style: $('#style').value,
            onStep: (k, midis) => { chips.forEach((c, j) => c.classList.toggle('on', j === k)); highlight(pianoRoot, midis); },
            onEnd: () => chips.forEach((c) => c.classList.remove('on'))
          });
        } else {
          const semis = e.fixed ? 0 : (keyObj().pc > 6 ? keyObj().pc - 12 : keyObj().pc);
          M.playMelody(e.melody, { bpm: bpm + 20, semis, onStep: (k, midis) => highlight(pianoRoot, midis) });
        }
      });
    }
    $$('.section table', view).forEach((tb) => { if (!tb.parentElement.classList.contains('table-wrap')) { const w = document.createElement('div'); w.className = 'table-wrap'; tb.replaceWith(w); w.appendChild(tb); } });
    if (tools.length) mountTools($('#tool-mount'), tools);
  }

  /* ---------------- Tools ---------------- */
  function mountTools(el, list) {
    const parts = { keyboard: keyboardTool, chordlab: chordLabTool, circle: circleTool, metronome: metronomeTool };
    list.forEach((name) => {
      if (!parts[name]) return;
      const div = document.createElement('div');
      div.className = 'section';
      el.appendChild(div);
      parts[name](div);
    });
  }

  function keyboardTool(el) {
    el.innerHTML = `<h2>🎹 Interactive keyboard</h2>
      <p class="small muted">Play the keys, or build any chord or scale to see it highlighted.</p>
      <div class="row"><input type="text" id="kb-chord" placeholder="Chord e.g. Gsus4, F#m7, C/E" style="width:200px"><button class="btn sm" id="kb-show">Show chord</button>
      <select id="kb-scale-root">${M.KEYS.map((k) => `<option>${k.name}</option>`).join('')}</select>
      <select id="kb-scale">${Object.entries(M.SCALES).map(([k, s]) => `<option value="${k}">${s.name}</option>`).join('')}</select><button class="btn sm" id="kb-scale-btn">Show scale</button></div>
      <div id="kb-info" class="small" style="margin:10px 0;min-height:1.4em"></div>
      ${pianoHTML(48, 83)}`;
    bindPiano(el, { onKey: (m) => { $('#kb-info', el).innerHTML = `<b>${M.SHARPS[m % 12]}${M.SHARPS[m % 12].length > 1 ? ' / ' + M.FLATS[m % 12] : ''}</b> · octave ${Math.floor(m / 12) - 1} · ${M.freq(m).toFixed(2)} Hz`; } });
    $('#kb-show', el).onclick = () => {
      const ch = M.parseChord($('#kb-chord', el).value.trim());
      if (!ch) { $('#kb-info', el).textContent = 'Could not read that chord — try C, Cm, C7, Cmaj7, Csus4, C/E…'; return; }
      const midis = M.playChord(ch);
      highlight(el, midis);
      $('#kb-info', el).innerHTML = `<b>${M.pretty(ch.symbol)}</b> — ${ch.type.name}: ${ch.notes.map(M.pretty).join(' – ')} <span class="muted">(formula ${ch.type.text})</span>`;
    };
    $('#kb-scale-btn', el).onclick = () => {
      const root = $('#kb-scale-root', el).value, id = $('#kb-scale', el).value;
      const notes = M.scaleNotes(root, id);
      const base = 60 + M.pcOf(root);
      const midis = M.SCALES[id].formula.map((f) => base + f.semis).concat([base + 12]);
      highlight(el, midis);
      $('#kb-info', el).innerHTML = `<b>${M.pretty(root)} ${M.SCALES[id].name}</b>: ${notes.map(M.pretty).join(' – ')} <span class="muted">(${M.SCALES[id].text})</span>`;
      M.playMelody(midis.map((m) => M.SHARPS[m % 12] + (Math.floor(m / 12) - 1)).join(' '), { bpm: 160 });
    };
  }

  function chordLabTool(el) {
    let minor = false, sevenths = false;
    el.innerHTML = `<h2>🧪 Chord Lab</h2><p class="small muted">Every chord family, number and substitution in any key. Tap a chord to hear it.</p>
      ${keyChooser()}
      <div class="row" style="margin:12px 0"><div class="tabs" style="margin:0"><button class="tab" data-mode="maj" aria-selected="true">Major key</button><button class="tab" data-mode="min" aria-selected="false">Relative minor</button></div><label class="row small"><input type="checkbox" id="cl-7"> Show 7th chords</label></div>
      <div id="cl-body"></div>${pianoHTML(36, 84, true)}`;
    const draw = () => {
      const k = keyObj();
      const root = minor ? M.spell(k.name, 9, 5) : k.name;
      const dia = M.diatonic(root, minor, sevenths);
      const tile = (sym, sub, cls = '') => `<button class="chord-tile ${cls}" data-chord="${esc(sym)}"><div class="nm">${M.pretty(sym)}</div><div class="rn">${sub}</div></button>`;
      const scale = M.scaleNotes(root, minor ? 'minor' : 'major');
      const flat = k.flat;
      const secDom = minor ? [] : [2, 3, 4, 5, 6].map((d) => {
        const target = dia[d - 1];
        const r = M.nameOf(M.pcOf(target.root) + 7, flat);
        return { sym: r + '7', label: `V7/${target.roman}`, target: target.symbol, tt: M.nameOf(M.pcOf(target.root) + 1, true) + '7' };
      });
      const borrowed = minor ? [] : [['iv', 5, 'm'], ['♭VI', 8, ''], ['♭VII', 10, ''], ['♭III', 3, ''], ['ii°', 2, 'dim'], ['v', 7, 'm']].map(([rn, s, suf]) => ({ sym: M.nameOf(k.pc + s, true) + suf, rn }));
      const neg = minor ? [] : dia.map((c) => {
        const ch = M.parseChord(c.symbol);
        const mirrored = ch.pcs.map((p) => M.mod(7 - (p - k.pc)) + k.pc);
        return { from: c, to: M.identify(mirrored, true) };
      });
      const progs = window.PROGRESSIONS.map((p) => ({ name: p.name, note: p.note, chords: p.nums.split(' ').map((nn) => M.numberToChord(nn, k.name)) }));
      $('#cl-body', el).innerHTML = `
        <div class="legend"><span><i style="background:var(--t)"></i>Tonic (rest)</span><span><i style="background:var(--s)"></i>Subdominant (movement)</span><span><i style="background:var(--d)"></i>Dominant (tension)</span></div>
        <p class="small"><b>Scale of ${M.pretty(root)} ${minor ? 'minor' : 'major'}:</b> ${scale.map(M.pretty).join(' – ')}</p>
        <h3>Chord family (diatonic chords)</h3>
        <div class="chord-grid">${dia.map((c) => tile(c.symbol, `${c.degree} · ${c.roman}`, c.func)).join('')}</div>
        ${minor ? '' : `
        <div class="grid grid-2" style="margin-top:14px">
          <div><h3>Primary chords</h3><div class="chord-grid">${[0, 3, 4].map((j) => tile(dia[j].symbol, `${dia[j].degree} · ${dia[j].roman}`, dia[j].func)).join('')}</div></div>
          <div><h3>Secondary chords</h3><div class="chord-grid">${[1, 2, 5].map((j) => tile(dia[j].symbol, `${dia[j].degree} · ${dia[j].roman}`, dia[j].func)).join('')}</div></div>
        </div>
        <h3 style="margin-top:14px">Relative substitutions (share 2 notes)</h3>
        <div class="chord-grid">${[[0, 5], [3, 1], [4, 6], [0, 2]].map(([a, b]) => tile(dia[b].symbol, `replaces ${M.pretty(dia[a].symbol)} (${dia[b].roman} for ${dia[a].roman})`, dia[b].func)).join('')}</div>
        <h3 style="margin-top:14px">Secondary dominants & tritone subs</h3>
        <div class="chord-grid">${secDom.map((s) => tile(s.sym, `${s.label} → ${M.pretty(s.target)}`, 'D') + tile(s.tt, `tritone sub of ${M.pretty(s.sym)}`)).join('')}</div>
        <h3 style="margin-top:14px">Borrowed chords (from ${M.pretty(k.name)} minor)</h3>
        <div class="chord-grid">${borrowed.map((b) => tile(b.sym, b.rn)).join('')}</div>
        <h3 style="margin-top:14px">Negative harmony mirror</h3>
        <div class="chord-grid">${neg.map((x) => tile(x.to, `mirror of ${M.pretty(x.from.symbol)}`)).join('')}</div>`}
        <h3 style="margin-top:14px">Common progressions in ${M.pretty(k.name)}</h3>
        <div class="stack">${progs.map((p, j) => `<div class="ex"><div class="spread"><span class="ex-label">${esc(p.name)} <span class="small muted">— ${esc(p.note)}</span></span><button class="btn sm" data-pp="${j}">▶</button></div><div class="chips">${p.chords.map((c) => `<button class="chip" data-chord="${esc(c)}">${M.pretty(c)}</button>`).join('')}</div></div>`).join('')}</div>
        ${minor ? '' : transitionFinderHTML()}`;
      $$('.chord-tile', el).forEach((b) => b.onclick = () => highlight(el, M.playChord(b.dataset.chord)));
      bindChips(el, el);
      $$('[data-pp]', el).forEach((b) => b.onclick = () => {
        const chips = $$('.chip', b.closest('.ex'));
        M.playProgression(chips.map((c) => c.dataset.chord), { bpm: 80, beats: 4, onStep: (q, midis) => { chips.forEach((c, j) => c.classList.toggle('on', j === q)); highlight(el, midis); } });
      });
      bindTransitionFinder(el);
    };
    bindKeyChooser(el, draw);
    $$('[data-mode]', el).forEach((b) => b.onclick = () => { minor = b.dataset.mode === 'min'; $$('[data-mode]', el).forEach((x) => x.setAttribute('aria-selected', String(x === b))); draw(); });
    $('#cl-7', el).onchange = (e) => { sevenths = e.target.checked; draw(); };
    bindPiano(el);
    draw();
  }

  function transitionFinderHTML() {
    return `<h3 style="margin-top:18px">Key transition finder</h3>
      <div class="row small">From <b>${M.pretty(keyObj().name)}</b> to <select id="tf-to">${M.KEYS.map((k, i) => `<option value="${i}" ${i === (S.key + 2) % 12 ? 'selected' : ''}>${k.name}</option>`).join('')}</select></div>
      <div id="tf-out" class="stack" style="margin-top:10px"></div>`;
  }
  function bindTransitionFinder(el) {
    const sel = $('#tf-to', el); if (!sel) return;
    const draw = () => {
      const a = keyObj(), b = M.KEYS[+sel.value];
      const da = M.diatonic(a.name, false, false).map((c) => c.symbol), db = M.diatonic(b.name, false, false);
      const pcSig = (s) => { const c = M.parseChord(s); return c.pcs.join(','); };
      const sigA = new Set(da.map(pcSig));
      const common = db.filter((c) => sigA.has(pcSig(c.symbol)));
      const n = (x) => M.numberToChord(x, b.name);
      const routes = [
        { name: '5sus → 5 → 1 (dominant approach)', chords: [da[0], n('5sus4'), n('5'), n('1')] },
        { name: '4/6 → 5/7 → 1 (rising bass 6-7-1)', chords: [da[0], n('4/6'), n('5/7'), n('1')] },
        { name: '2 – 5 – 1 of the new key', chords: [da[0], n('2m7'), n('57'), n('1')] }
      ];
      if (common.length) routes.push({ name: `Pivot through a common chord (${common.map((c) => M.pretty(c.symbol)).join(', ')})`, chords: [da[0], common[0].symbol, n('5'), n('1')] });
      $('#tf-out', el).innerHTML = routes.map((r, j) => `<div class="ex"><div class="spread"><span class="ex-label">${esc(r.name)}</span><button class="btn sm" data-tf="${j}">▶</button></div><div class="chips">${r.chords.map((c) => `<button class="chip" data-chord="${esc(c)}">${M.pretty(c)}</button>`).join('')}</div></div>`).join('') +
        `<p class="small muted">Common chords between ${M.pretty(a.name)} and ${M.pretty(b.name)}: ${common.length ? common.map((c) => `${M.pretty(c.symbol)} (${c.degree} in new key)`).join(', ') : 'none — use the dominant (5sus → 5) approach.'}</p>`;
      bindChips($('#tf-out', el), el);
      $$('[data-tf]', el).forEach((btn) => btn.onclick = () => {
        const chips = $$('.chip', btn.closest('.ex'));
        M.playProgression(chips.map((c) => c.dataset.chord), { bpm: 76, beats: 4, onStep: (q, midis) => { chips.forEach((c, j) => c.classList.toggle('on', j === q)); highlight(el, midis); } });
      });
    };
    sel.onchange = draw; draw();
  }

  function circleTool(el) {
    el.innerHTML = `<h2>⭕ Circle of 5ths & 4ths</h2><p class="small muted">Clockwise = up a 5th (adds a ♯). Anticlockwise = up a 4th (adds a ♭). Tap a key to select it — neighbours are its closest relatives.</p>
      <div class="grid grid-2"><div id="circle"></div><div id="circle-info"></div></div>`;
    const draw = () => {
      const cx = 210, cy = 210, R1 = 200, R2 = 140, R3 = 88;
      const sel = S.key;
      const selPos = M.CIRCLE_ORDER.indexOf(M.KEYS[sel].pc);
      const arc = (r1, r2, a0, a1) => {
        const p = (r, a) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
        const [x1, y1] = p(r1, a0), [x2, y2] = p(r1, a1), [x3, y3] = p(r2, a1), [x4, y4] = p(r2, a0);
        return `M${x1},${y1} A${r1},${r1} 0 0 1 ${x2},${y2} L${x3},${y3} A${r2},${r2} 0 0 0 ${x4},${y4} Z`;
      };
      let svg = '';
      M.CIRCLE_ORDER.forEach((pc, i) => {
        const a0 = (i - 0.5) * Math.PI / 6, a1 = (i + 0.5) * Math.PI / 6, am = i * Math.PI / 6;
        const k = M.KEYS.find((x) => x.pc === pc);
        const isSel = i === selPos, near = Math.abs(((i - selPos + 18) % 12) - 6) === 5;
        const acc = i <= 6 ? (i ? i + '♯' : '') : (12 - i) + '♭';
        svg += `<path class="seg ${isSel ? 'sel' : near ? 'near' : ''}" d="${arc(R1, R2, a0, a1)}" data-pc="${pc}"/>`;
        svg += `<path class="seg ${isSel ? 'sel' : near ? 'near' : ''}" d="${arc(R2, R3, a0, a1)}" data-pc="${pc}"/>`;
        svg += `<text x="${cx + 170 * Math.sin(am)}" y="${cy - 170 * Math.cos(am) + 7}" text-anchor="middle" font-size="20" font-weight="700" class="${isSel ? 'on' : ''}">${M.pretty(k.name)}</text>`;
        svg += `<text x="${cx + 170 * Math.sin(am)}" y="${cy - 170 * Math.cos(am) + 22}" text-anchor="middle" font-size="10" class="${isSel ? 'on' : ''}" opacity=".7">${acc}</text>`;
        svg += `<text x="${cx + 114 * Math.sin(am)}" y="${cy - 114 * Math.cos(am) + 5}" text-anchor="middle" font-size="13" class="${isSel ? 'on' : ''}">${M.pretty(k.minor)}</text>`;
      });
      svg += `<circle cx="${cx}" cy="${cy}" r="${R3 - 4}" fill="var(--surface)" stroke="var(--line)"/><text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="26" font-weight="700">${M.pretty(M.KEYS[sel].name)}</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="12" opacity=".7">major</text>`;
      $('#circle', el).innerHTML = `<svg class="circle-svg" viewBox="0 0 420 420" role="img" aria-label="Circle of fifths">${svg}</svg>`;
      $$('.seg', el).forEach((p) => p.onclick = () => { S.key = M.KEYS.findIndex((k) => k.pc === +p.dataset.pc); save(); M.playChord(M.KEYS[S.key].name); draw(); });
      const k = M.KEYS[sel];
      const up5 = M.KEYS.find((x) => x.pc === M.mod(k.pc + 7)), up4 = M.KEYS.find((x) => x.pc === M.mod(k.pc + 5));
      const dia = M.diatonic(k.name, false, false);
      const cyc = (dir) => { const out = []; let p = k.pc; for (let j = 0; j < 12; j++) { out.push(M.KEYS.find((x) => x.pc === p).name); p = M.mod(p + dir); } return out; };
      $('#circle-info', el).innerHTML = `
        <h3>${M.pretty(k.name)} major / ${M.pretty(k.minor)}</h3>
        <p class="small">Key signature: <b>${(() => { const i = M.CIRCLE_ORDER.indexOf(k.pc); return i === 0 ? 'no sharps or flats' : i <= 6 ? i + ' sharp' + (i > 1 ? 's' : '') : (12 - i) + ' flat' + (12 - i > 1 ? 's' : ''); })()}</b></p>
        <p class="small">Neighbours: <b>${M.pretty(up4.name)}</b> (4 chord) and <b>${M.pretty(up5.name)}</b> (5 chord). Relative minor: <b>${M.pretty(k.minor)}</b>.</p>
        <p class="small">Chord family: ${dia.map((c) => `<b>${M.pretty(c.symbol)}</b>`).join(' · ')}</p>
        <div class="small"><b>Drill — cycle of 4ths:</b> ${cyc(5).map(M.pretty).join(' → ')}</div>
        <div class="small" style="margin-top:6px"><b>Drill — cycle of 5ths:</b> ${cyc(7).map(M.pretty).join(' → ')}</div>
        <div class="row" style="margin-top:10px"><button class="btn sm" id="cyc4">▶ Play cycle of 4ths</button><button class="btn sm" id="cyc5">▶ Cycle of 5ths</button><button class="btn sm" id="cycstop">■</button></div>`;
      $('#cyc4', el).onclick = () => M.playProgression(cyc(5), { bpm: 90, beats: 2 });
      $('#cyc5', el).onclick = () => M.playProgression(cyc(7), { bpm: 90, beats: 2 });
      $('#cycstop', el).onclick = () => M.stopAll();
    };
    draw();
  }

  function metronomeTool(el) {
    let bpm = 80, sig = 4, running = false, timer = null, next = 0, beat = 0, taps = [];
    el.innerHTML = `<h2>⏱ Metronome</h2>
      <div class="spread"><div><div class="bpm"><span id="mt-bpm">80</span> <span class="small muted">bpm</span></div></div>
      <div class="row"><select id="mt-sig"><option value="2">2/4</option><option value="3">3/4</option><option value="4" selected>4/4</option><option value="6">6/8</option></select>
      <button class="btn" id="mt-tap">Tap</button><button class="btn primary" id="mt-go">▶ Start</button></div></div>
      <input type="range" id="mt-range" min="40" max="200" value="80" style="width:100%;margin-top:10px" aria-label="Tempo">
      <div class="beats" id="mt-beats"></div>
      <p class="small muted">Tip: start slow enough to play perfectly, then raise by 4 bpm each day.</p>`;
    const dots = () => { $('#mt-beats', el).innerHTML = Array.from({ length: sig }, (_, i) => `<span class="beat ${i === 0 ? 'first' : ''}"></span>`).join(''); };
    const setBpm = (v) => { bpm = Math.max(40, Math.min(200, Math.round(v))); $('#mt-bpm', el).textContent = bpm; $('#mt-range', el).value = bpm; };
    const tick = () => {
      const c = M.audio();
      while (next < c.currentTime + 0.12) {
        const b = beat % sig, when = next;
        M.click(when, b === 0);
        setTimeout(() => { $$('.beat', el).forEach((d, i) => d.classList.toggle('on', i === b)); }, Math.max(0, (when - c.currentTime) * 1000));
        next += (60 / bpm) * (sig === 6 ? 0.5 : 1);
        beat++;
      }
    };
    $('#mt-go', el).onclick = (e) => {
      running = !running;
      e.target.textContent = running ? '■ Stop' : '▶ Start';
      if (running) { const c = M.audio(); next = c.currentTime + 0.05; beat = 0; timer = setInterval(tick, 25); }
      else { clearInterval(timer); $$('.beat', el).forEach((d) => d.classList.remove('on')); }
    };
    $('#mt-range', el).oninput = (e) => setBpm(+e.target.value);
    $('#mt-sig', el).onchange = (e) => { sig = +e.target.value; dots(); };
    $('#mt-tap', el).onclick = () => {
      const now = performance.now(); taps = taps.filter((t) => now - t < 2500); taps.push(now);
      if (taps.length > 1) setBpm(60000 / ((taps[taps.length - 1] - taps[0]) / (taps.length - 1)));
    };
    dots();
    window.addEventListener('hashchange', () => clearInterval(timer), { once: true });
  }

  function renderTools() {
    view.innerHTML = `<h1>Practice tools</h1><p class="muted">Use these in lessons or send students here for practice. The key you choose is remembered across the app.</p>
      <div class="tabs" role="tablist">${[['chordlab', '🧪 Chord Lab'], ['keyboard', '🎹 Keyboard'], ['circle', '⭕ Circle of 5ths'], ['metronome', '⏱ Metronome'], ['tracks', '🥁 Practice tracks']].map(([k, l], i) => `<button class="tab" data-tool="${k}" aria-selected="${i === 0}">${l}</button>`).join('')}</div>
      <div id="tool-area"></div>`;
    const show = (name) => {
      M.stopAll();
      const area = $('#tool-area'); area.innerHTML = '';
      if (name === 'tracks') { const d = document.createElement('div'); d.className = 'section'; area.appendChild(d); tracksTool(d); }
      else mountTools(area, [name]);
      $$('[data-tool]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tool === name)));
    };
    $$('[data-tool]').forEach((b) => b.onclick = () => show(b.dataset.tool));
    show('chordlab');
  }

  function tracksTool(el) {
    el.innerHTML = `<h2>🥁 Practice tracks</h2><p class="small muted">Create a backing loop for songs, melodies or solo practice. Pick a progression (or type your own in numbers or chords), a key, tempo and feel.</p>
      <div class="grid grid-2">
        <div class="stack">
          <label class="small">Progression<br><select id="tr-prog" style="width:100%">${window.PROGRESSIONS.map((p, i) => `<option value="${i}">${esc(p.name)}</option>`).join('')}<option value="custom">Custom…</option></select></label>
          <label class="small" id="tr-custom-wrap" style="display:none">Custom (numbers like <code>1 5 6m 4</code> or chords like <code>C G Am F</code>)<br><input type="text" id="tr-custom" style="width:100%" value="1 5/7 6m 4"></label>
          <div class="small">Key</div>${keyChooser()}
        </div>
        <div class="stack">
          <label class="small row">Tempo <input type="range" id="tr-bpm" min="50" max="150" value="84"> <b id="tr-bpm-v">84</b></label>
          <label class="small row">Beats per chord <select id="tr-beats"><option>2</option><option selected>4</option><option>8</option></select></label>
          <label class="small row">Feel <select id="tr-style"><option value="block">Block piano</option><option value="broken">Broken</option><option value="arp">Arpeggio</option><option value="pad">Worship pad</option></select></label>
          <label class="small row"><input type="checkbox" id="tr-drums" checked> Drums</label>
          <label class="small row">Loops <select id="tr-loops"><option>2</option><option selected>4</option><option>8</option><option>16</option></select></label>
          <div class="row"><button class="btn primary" id="tr-play">▶ Play track</button><button class="btn" id="tr-stop">■ Stop</button></div>
        </div>
      </div>
      <div class="chips" id="tr-chips" style="margin-top:14px"></div>
      <div style="margin-top:12px">${pianoHTML(36, 84, true)}</div>`;
    const chords = () => {
      const v = $('#tr-prog', el).value, k = keyObj();
      const src = v === 'custom' ? $('#tr-custom', el).value : window.PROGRESSIONS[+v].nums;
      return src.trim().split(/\s+/).filter((x) => x && x !== '|').map((tok) => (/^[b#]?[1-7]/.test(tok) ? M.numberToChord(tok, k.name) : tok)).filter((c) => M.parseChord(c));
    };
    const drawChips = () => { $('#tr-chips', el).innerHTML = chords().map((c) => `<button class="chip" data-chord="${esc(c)}">${M.pretty(c)}</button>`).join(''); bindChips($('#tr-chips', el), el); };
    $('#tr-prog', el).onchange = (e) => { $('#tr-custom-wrap', el).style.display = e.target.value === 'custom' ? '' : 'none'; drawChips(); };
    $('#tr-custom', el).oninput = drawChips;
    $('#tr-bpm', el).oninput = (e) => { $('#tr-bpm-v', el).textContent = e.target.value; };
    bindKeyChooser(el, drawChips);
    $('#tr-play', el).onclick = () => {
      const chips = $$('#tr-chips .chip', el);
      M.playProgression(chords(), {
        bpm: +$('#tr-bpm', el).value, beats: +$('#tr-beats', el).value, style: $('#tr-style', el).value, drums: $('#tr-drums', el).checked, loops: +$('#tr-loops', el).value,
        onStep: (i, midis) => { chips.forEach((c, j) => c.classList.toggle('on', j === i)); highlight(el, midis); }
      });
    };
    $('#tr-stop', el).onclick = () => M.stopAll();
    bindPiano(el);
    drawChips();
  }

  /* ---------------- Schedules ---------------- */
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fixedDays = (prog) => prog.badge === '2 days' || prog.unit === 'Day';
  function sessionDates(prog) {
    if (!S.start) return [];
    const start = new Date(S.start + 'T12:00:00');
    const days = S.lessonDays && S.lessonDays.length ? S.lessonDays : [start.getDay()];
    const out = [], d = new Date(start);
    for (let guard = 0; out.length < prog.sessions.length && guard < 1000; guard++) {
      if (prog.badge === '2 days') { out.push(new Date(start.getTime() + Math.floor(out.length / 4) * 864e5)); continue; }
      const ok = prog.unit === 'Day' ? d.getDay() !== 0 && d.getDay() !== 6 : days.includes(d.getDay());
      if (ok) out.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return out;
  }
  function renderSchedule() {
    const groups = [['pathway', 'Full pathway · Beginner → Advanced'], ['track', 'Specialist tracks'], ['crash', 'Crash courses']];
    const prog = window.PROGRAMS.find((p) => p.id === S.program) || window.PROGRAMS[0];
    const done = S.schedDone[prog.id] || [];
    const dates = sessionDates(prog);
    const unit = prog.unit || 'Week';
    const totalMins = prog.sessions.reduce((a, s) => a + s.topics.reduce((b, id) => b + (byId[id].mins || 45), 0), 0);
    view.innerHTML = `
      <h1>Schedules & crash courses</h1>
      <p class="muted">Pick a programme. Set a start date and lesson day to get dated lessons. Tick each ${unit.toLowerCase()} off as you teach it.</p>
      ${groups.map(([g, label]) => `<h3 style="margin-top:18px">${label}</h3><div class="grid grid-4">${window.PROGRAMS.filter((p) => p.group === g).map((p) => `<button class="program-card" data-prog="${p.id}" aria-pressed="${p.id === prog.id}"><span class="pill">${esc(p.badge)}</span><h3 style="margin:8px 0 4px">${esc(p.title)}</h3><div class="small muted">${p.sessions.length} ${(p.unit || 'week').toLowerCase()}s</div><div class="progress" style="margin-top:8px"><i style="width:${pct((S.schedDone[p.id] || []).length, p.sessions.length)}%"></i></div></button>`).join('')}</div>`).join('')}
      ${g4Overview()}
      <div class="section" style="margin-top:24px">
        <div class="spread"><div><h2 style="margin:0">${esc(prog.title)}</h2><p class="muted" style="margin:4px 0 0">${esc(prog.desc)}</p></div>
          <div class="row no-print"><button class="btn sm" id="sched-plan">🧩 Copy to my planner</button><button class="btn sm print-only" onclick="window.print()">🖨 Print</button></div></div>
        <div class="row small" style="margin-top:12px">
          <span class="pill">${prog.sessions.length} ${unit.toLowerCase()}s</span><span class="pill">≈ ${Math.round(totalMins / 60)} h of lesson content</span><span class="pill">${done.length} done</span>
        </div>
        <div class="row no-print" style="margin-top:12px">
          <label class="small">Start date <input type="date" id="sd-start" value="${S.start || ''}"></label>
          ${fixedDays(prog) ? '' : `<span class="small">Lesson day(s)${prog.perWeek > 1 ? ` (pick ${prog.perWeek})` : ''}: ${DAY_NAMES.map((d, i) => `<label class="pill" style="cursor:pointer"><input type="checkbox" data-day="${i}" ${S.lessonDays.includes(i) ? 'checked' : ''} style="width:14px;height:14px"> ${d}</label>`).join(' ')}</span>`}
        </div>
      </div>
      <div id="weeks">${prog.sessions.map((s, i) => `
        <div class="week ${done.includes(i) ? 'done' : ''}">
          <div class="week-no">${unit} ${i + 1}${dates[i] ? `<small>${dates[i].toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</small>` : ''}</div>
          <div><b>${esc(s.title)}</b><div class="links">${s.topics.map((id) => `<a href="#/topic/${id}">${S.done[id] ? '✓ ' : ''}${esc(byId[id].title)}</a>`).join('')}</div>
            <div class="small"><span class="muted">Focus:</span> ${esc(s.focus)}</div><div class="small"><span class="muted">Practice:</span> ${esc(s.practice)}</div></div>
          <label class="row small no-print"><input type="checkbox" data-wk="${i}" ${done.includes(i) ? 'checked' : ''}> Taught</label>
        </div>`).join('')}</div>`;
    $$('[data-prog]').forEach((b) => b.onclick = () => { S.program = b.dataset.prog; save(); renderSchedule(); });
    $('#sd-start').onchange = (e) => { S.start = e.target.value; if (S.start && !S.lessonDays.length) S.lessonDays = [new Date(S.start + 'T12:00:00').getDay()]; save(); renderSchedule(); };
    $$('[data-day]').forEach((c) => c.onchange = () => { S.lessonDays = $$('[data-day]').filter((x) => x.checked).map((x) => +x.dataset.day); save(); renderSchedule(); });
    $$('[data-wk]').forEach((c) => c.onchange = () => {
      const arr = new Set(S.schedDone[prog.id] || []);
      c.checked ? arr.add(+c.dataset.wk) : arr.delete(+c.dataset.wk);
      S.schedDone[prog.id] = Array.from(arr); save();
      c.closest('.week').classList.toggle('done', c.checked);
    });
    $('#sched-plan').onclick = () => {
      prog.sessions.forEach((s) => s.topics.forEach((id) => S.plan.push({ id, mins: byId[id].mins || 45, note: `${unit}: ${s.title}` })));
      S.planName = prog.title; save(); toast('Copied to your planner'); location.hash = '#/planner';
    };
  }
  function g4Overview() {
    const path = window.PROGRAMS.filter((p) => p.group === 'pathway');
    const total = path.reduce((a, p) => a + p.sessions.length, 0);
    return `<div class="card" style="margin-top:18px"><h3>Beginner → Advanced at a glance</h3>
      <p class="small muted">${total} weekly lessons ≈ ${Math.round(total / 4.3)} months. Run the Melody and Worship tracks alongside Levels 2–3, and the Guitar course on its own.</p>
      <div class="ladder">${path.map((p, i) => `<div class="rung"><span class="pill lvl-${i + 1}">${esc(p.badge)}</span><b style="margin-top:6px">${esc(p.title.split('·')[1] || p.title)}</b><span class="small muted">${p.sessions.length} weeks</span></div>`).join('')}</div></div>`;
  }

  /* ---------------- Planner ---------------- */
  function renderPlanner() {
    const total = S.plan.reduce((a, p) => a + (+p.mins || 0), 0);
    view.innerHTML = `
      <h1>Routine planner</h1>
      <p class="muted">Arrange your own teaching order: add lessons, drag to reorder, set minutes. Below, generate a daily practice routine for any student level.</p>
      <div class="grid grid-2">
        <div class="section">
          <div class="spread"><input type="text" id="plan-name" value="${esc(S.planName)}" style="font-weight:700;font-size:1.1rem;flex:1" aria-label="Plan name"><span class="pill">${S.plan.length} items · ${Math.floor(total / 60)}h ${total % 60}m</span></div>
          <input type="search" id="plan-q" placeholder="Search a topic to add…" style="width:100%;margin-top:12px" aria-label="Search topics to add">
          <div class="search-results" id="plan-res" hidden></div>
          <div id="plan-list" style="margin-top:12px">${S.plan.length ? S.plan.map((p, i) => planItem(p, i)).join('') : '<div class="empty">Your plan is empty. Search above, use “Add to my plan” on a lesson, or copy a schedule.</div>'}</div>
          <div class="row no-print" style="margin-top:12px">
            <button class="btn sm" id="plan-sort">Sort by level</button>
            <button class="btn sm print-only" id="plan-export">⬇ Export</button>
            <label class="btn sm">⬆ Import<input type="file" id="plan-import" accept=".json" hidden></label>
            <button class="btn sm print-only" onclick="window.print()">🖨 Print</button>
            <button class="btn sm ghost" id="plan-clear">Clear</button>
          </div>
        </div>
        <div class="section">
          <h2>Daily practice routine</h2>
          <div class="row"><label class="small">Minutes per day <select id="rt-mins">${[15, 20, 30, 45, 60, 90].map((m) => `<option ${m === S.routineMins ? 'selected' : ''}>${m}</option>`).join('')}</select></label>
          <label class="small">Student level <select id="rt-level">${[1, 2, 3, 4].map((l) => `<option value="${l}" ${l === S.routineLevel ? 'selected' : ''}>${LEVEL_NAMES[l]}</option>`).join('')}</select></label></div>
          <div id="routine" style="margin-top:12px"></div>
          <p class="small muted" style="margin-top:12px">Rule of thumb: little and often beats long and rare. Same time every day, metronome on, finish with something fun.</p>
        </div>
      </div>`;
    const drawRoutine = () => {
      const mins = +$('#rt-mins').value, lvl = +$('#rt-level').value;
      S.routineMins = mins; S.routineLevel = lvl; save();
      $('#routine').innerHTML = window.ROUTINE_BLOCKS.map((b) => `<div class="routine-block"><div class="mins">${Math.max(2, Math.round(mins * b.pct))}′</div><div><b>${b.name}</b><div class="small muted">${b.ideas[lvl]}</div></div></div>`).join('');
    };
    $('#rt-mins').onchange = drawRoutine; $('#rt-level').onchange = drawRoutine; drawRoutine();
    $('#plan-name').oninput = (e) => { S.planName = e.target.value; save(); };
    const q = $('#plan-q'), res = $('#plan-res');
    q.oninput = () => {
      const s = q.value.trim().toLowerCase();
      if (!s) { res.hidden = true; return; }
      const hits = TOPICS.filter((t) => (t.title + ' ' + t.summary).toLowerCase().includes(s)).slice(0, 12);
      res.hidden = false;
      res.innerHTML = hits.map((t) => `<button data-add="${t.id}"><span>${esc(t.title)}</span>${lvlPill(t.level)}</button>`).join('') || '<div class="empty">No match</div>';
      $$('[data-add]', res).forEach((b) => b.onclick = () => { S.plan.push({ id: b.dataset.add, mins: byId[b.dataset.add].mins || 45 }); save(); renderPlanner(); });
    };
    $$('[data-mins]').forEach((inp) => inp.onchange = () => { S.plan[+inp.dataset.mins].mins = +inp.value; save(); renderPlanner(); });
    $$('[data-del]').forEach((b) => b.onclick = () => { S.plan.splice(+b.dataset.del, 1); save(); renderPlanner(); });
    $$('[data-up]').forEach((b) => b.onclick = () => { const i = +b.dataset.up; if (i > 0) { [S.plan[i - 1], S.plan[i]] = [S.plan[i], S.plan[i - 1]]; save(); renderPlanner(); } });
    $$('[data-down]').forEach((b) => b.onclick = () => { const i = +b.dataset.down; if (i < S.plan.length - 1) { [S.plan[i + 1], S.plan[i]] = [S.plan[i], S.plan[i + 1]]; save(); renderPlanner(); } });
    // drag & drop reorder
    let dragFrom = null;
    $$('.plan-item').forEach((row) => {
      row.addEventListener('dragstart', () => { dragFrom = +row.dataset.i; row.classList.add('dragging'); });
      row.addEventListener('dragend', () => row.classList.remove('dragging'));
      row.addEventListener('dragover', (e) => e.preventDefault());
      row.addEventListener('drop', (e) => { e.preventDefault(); const to = +row.dataset.i; if (dragFrom === null || dragFrom === to) return; const [it] = S.plan.splice(dragFrom, 1); S.plan.splice(to, 0, it); save(); renderPlanner(); });
    });
    $('#plan-sort').onclick = () => { S.plan.sort((a, b) => byId[a.id].level - byId[b.id].level || modById[byId[a.id].module].order - modById[byId[b.id].module].order); save(); renderPlanner(); };
    $('#plan-clear').onclick = (e) => {
      if (e.target.dataset.armed) { S.plan = []; save(); renderPlanner(); toast('Plan cleared'); return; }
      e.target.dataset.armed = '1'; e.target.textContent = 'Tap again to clear';
      setTimeout(() => { delete e.target.dataset.armed; e.target.textContent = 'Clear'; }, 3000);
    };
    $('#plan-export').onclick = () => {
      const blob = new Blob([JSON.stringify({ name: S.planName, plan: S.plan, notes: S.notes, done: S.done }, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = (S.planName || 'plan').replace(/\W+/g, '-') + '.json'; a.click();
    };
    $('#plan-import').onchange = (e) => {
      const f = e.target.files[0]; if (!f) return;
      f.text().then((txt) => {
        try { const d = JSON.parse(txt); S.plan = (d.plan || []).filter((p) => byId[p.id]); S.planName = d.name || S.planName; Object.assign(S.notes, d.notes || {}); Object.assign(S.done, d.done || {}); save(); renderPlanner(); toast('Plan imported'); }
        catch (err) { toast('That file could not be read'); }
      });
    };
  }
  function planItem(p, i) {
    const t = byId[p.id]; if (!t) return '';
    return `<div class="plan-item" draggable="true" data-i="${i}">
      <span class="handle" title="Drag to reorder">⠿</span>
      <div><a href="#/topic/${t.id}"><b>${i + 1}. ${esc(t.title)}</b></a><div class="small muted">${lvlPill(t.level)} ${p.note ? esc(p.note) : esc(modById[t.module].title)}</div></div>
      <label class="small row"><input type="number" min="5" step="5" value="${p.mins}" data-mins="${i}" aria-label="Minutes"> min</label>
      <span class="row" style="gap:4px"><button class="icon-btn" data-up="${i}" aria-label="Move up">↑</button><button class="icon-btn" data-down="${i}" aria-label="Move down">↓</button><button class="icon-btn" data-del="${i}" aria-label="Remove">✕</button></span>
    </div>`;
  }

  /* ---------------- Resources / cheat sheets ---------------- */
  function renderResources(tab) {
    const tabs = [['lh', 'LH accompaniment'], ['chords', 'Major & minor chords'], ['inversions', 'Inversions'], ['scales', 'Scales & formulas'], ['degrees', 'Scale degrees'], ['families', 'Chord families'], ['circles', 'Circles'], ['time', 'Time exercises'], ['tracks', 'Practice tracks'], ['fretboard', 'Guitar fretboard']];
    const cur = tabs.some((t) => t[0] === tab) ? tab : 'lh';
    view.innerHTML = `<h1>Cheat sheets</h1><p class="muted">Printable reference sheets — generated for all 12 keys.</p>
      <div class="tabs no-print">${tabs.map(([k, l]) => `<a class="tab" href="#/resources/${k}" aria-selected="${k === cur}" style="color:inherit;text-decoration:none">${l}</a>`).join('')}</div>
      <div class="section" id="sheet"></div>`;
    const el = $('#sheet');
    const K = M.KEYS;
    const sheets = {
      lh() {
        const L = window.LH_SHEET;
        const tbl = (rows) => `<div class="table-wrap"><table><tr><th>Pattern</th><th>How</th><th>Use it for</th></tr>${rows.map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td class="muted">${r[2]}</td></tr>`).join('')}</table></div>`;
        el.innerHTML = `<h2>Left-hand accompaniment cheat sheet</h2><h3>Single-note patterns</h3>${tbl(L.single)}<h3 style="margin-top:16px">Multi-note patterns</h3>${tbl(L.multi)}<h3 style="margin-top:16px">Golden rules</h3><ul>${L.rules.map((r) => `<li>${r}</li>`).join('')}</ul>`;
      },
      chords() {
        el.innerHTML = `<h2>Major & minor chord sheet</h2><p class="small muted">Formula — major: 1 3 5 (4 + 3 semitones). Minor: 1 ♭3 5 (3 + 4 semitones). Tap to hear.</p>
          <div class="table-wrap"><table class="sheet-table"><tr><th>Root</th><th>Major</th><th>Minor</th><th>Dom 7</th><th>Maj 7</th><th>Min 7</th><th>Sus4</th></tr>
          ${K.map((k) => `<tr><td><b>${M.pretty(k.name)}</b></td>${['', 'm', '7', 'maj7', 'm7', 'sus4'].map((s) => { const c = M.parseChord(k.name + s); return `<td><button class="chip" data-chord="${k.name + s}">${M.pretty(k.name + s)}<small>${c.notes.map(M.pretty).join(' ')}</small></button></td>`; }).join('')}</tr>`).join('')}</table></div>`;
        bindChips(el);
      },
      inversions() {
        el.innerHTML = `<h2>Inversions</h2><p class="small muted">Root position (1-3-5) → 1st inversion (3-5-1) → 2nd inversion (5-1-3).</p>
          <div class="table-wrap"><table class="sheet-table"><tr><th>Chord</th><th>Root position</th><th>1st inversion</th><th>2nd inversion</th><th>Minor root</th><th>Minor 1st</th><th>Minor 2nd</th></tr>
          ${K.map((k) => { const a = M.parseChord(k.name).notes.map(M.pretty), b = M.parseChord(k.name + 'm').notes.map(M.pretty); const inv = (n, i) => n.slice(i).concat(n.slice(0, i)).join(' – '); return `<tr><td><b>${M.pretty(k.name)}</b></td><td>${inv(a, 0)}</td><td>${inv(a, 1)}</td><td>${inv(a, 2)}</td><td>${inv(b, 0)}</td><td>${inv(b, 1)}</td><td>${inv(b, 2)}</td></tr>`; }).join('')}</table></div>`;
      },
      scales() {
        const ids = ['major', 'minor', 'harmonic', 'melodic', 'majpent', 'minpent', 'blues'];
        el.innerHTML = `<h2>Major & minor scales with formula</h2>
          <p class="small"><b>Major:</b> W – W – H – W – W – W – H &nbsp;·&nbsp; <b>Natural minor:</b> W – H – W – W – H – W – W &nbsp;·&nbsp; <b>Harmonic minor:</b> raise the 7th &nbsp;·&nbsp; <b>Melodic minor:</b> raise 6th & 7th going up</p>
          <div class="row" style="margin:10px 0"><select id="sc-type">${ids.map((i) => `<option value="${i}">${M.SCALES[i].name}</option>`).join('')}</select><span class="small muted" id="sc-form"></span></div>
          <div id="sc-table"></div>`;
        const draw = () => {
          const id = $('#sc-type').value;
          $('#sc-form').textContent = 'Degrees: ' + M.SCALES[id].text;
          const roots = id === 'minor' || id === 'harmonic' || id === 'melodic' || id === 'minpent' || id === 'blues' ? M.MINOR_KEYS.map((m) => m.root) : K.map((k) => k.name);
          $('#sc-table').innerHTML = `<div class="table-wrap"><table class="sheet-table">${roots.map((r) => `<tr><td><b>${M.pretty(r)}</b></td>${M.scaleNotes(r, id).map((n) => `<td>${M.pretty(n)}</td>`).join('')}</tr>`).join('')}</table></div>`;
        };
        $('#sc-type').onchange = draw; draw();
      },
      degrees() {
        const names = ['Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant', 'Leading tone'];
        const feel = ['Home, rest', 'Moving, hopeful', 'Sweet, defines major', 'Lifting away', 'Strong, wants home', 'Tender, emotional', 'Tense, pulls up to 1'];
        el.innerHTML = `<h2>Scale degrees</h2><div class="no-print">${keyChooser()}</div><div id="deg" style="margin-top:12px"></div>`;
        const draw = () => {
          const k = keyObj(), sc = M.scaleNotes(k.name, 'major'), dia = M.diatonic(k.name, false, false), d7 = M.diatonic(k.name, false, true);
          $('#deg', el).innerHTML = `<div class="table-wrap"><table><tr><th>Degree</th><th>Name</th><th>Note</th><th>Solfa</th><th>Triad</th><th>7th chord</th><th>Function</th><th>Feel</th></tr>${sc.map((n, i) => `<tr><td><b>${i + 1}</b> (${dia[i].roman})</td><td>${names[i]}</td><td>${M.pretty(n)}</td><td>${['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Ti'][i]}</td><td>${M.pretty(dia[i].symbol)}</td><td>${M.pretty(d7[i].symbol)}</td><td>${{ T: 'Tonic', S: 'Subdominant', D: 'Dominant' }[dia[i].func]}</td><td class="muted">${feel[i]}</td></tr>`).join('')}</table></div>`;
        };
        bindKeyChooser(el, draw); draw();
      },
      families() {
        el.innerHTML = `<h2>Chord families — all 12 keys</h2><p class="small muted">Pattern in every major key: Maj – min – min – Maj – Maj – min – dim. Primary chords (1 4 5) in bold.</p>
          <div class="table-wrap"><table class="sheet-table"><tr><th>Key</th>${['1', '2m', '3m', '4', '5', '6m', '7°'].map((h) => `<th>${h}</th>`).join('')}<th>Relative minor</th></tr>
          ${K.map((k) => `<tr><td><b>${M.pretty(k.name)}</b></td>${M.diatonic(k.name, false, false).map((c, i) => `<td>${[0, 3, 4].includes(i) ? '<b>' : ''}${M.pretty(c.symbol)}${[0, 3, 4].includes(i) ? '</b>' : ''}</td>`).join('')}<td>${M.pretty(k.minor)}</td></tr>`).join('')}</table></div>`;
      },
      circles() { circleTool(el); },
      time() {
        el.innerHTML = `<h2>Time exercise sheets</h2><p class="small muted">Count out loud and clap the coloured boxes. Press play to hear it with a click. Each row is one bar.</p>
          <label class="small row no-print">Tempo <input type="range" id="tm-bpm" min="50" max="140" value="72"> <b id="tm-v">72</b></label>
          <div class="stack" style="margin-top:12px">${window.RHYTHM_SHEETS.map((r, i) => {
            const per = r.sig === '6/8' ? 2 : 4;
            return `<div class="ex"><div class="spread"><span class="ex-label">${esc(r.name)} <span class="pill">${r.sig}</span> ${lvlPill(r.level)}</span><button class="btn sm" data-rh="${i}">▶</button></div>
            <div class="small muted">Count: ${esc(r.count)}</div>
            <div class="rhythm" style="grid-template-columns:repeat(${r.pattern.length},1fr)">${r.pattern.split('').map((c, j) => `<span class="${c === 'x' ? 'x' : ''} ${j % per === 0 ? 'beatstart' : ''}"></span>`).join('')}</div></div>`;
          }).join('')}</div>`;
        $('#tm-bpm').oninput = (e) => { $('#tm-v').textContent = e.target.value; };
        $$('[data-rh]', el).forEach((b) => b.onclick = () => {
          M.stopAll();
          const r = window.RHYTHM_SHEETS[+b.dataset.rh], bpm = +$('#tm-bpm').value;
          const per = r.sig === '6/8' ? 2 : 4;
          const step = (60 / bpm) / per * (r.sig === '6/8' ? 1 : 1);
          const c = M.audio(); let t = c.currentTime + 0.1;
          const cells = $$('.rhythm span', b.closest('.ex'));
          for (let bar = 0; bar < 2; bar++) r.pattern.split('').forEach((ch, j) => {
            if (j % per === 0) M.click(t, j === 0);
            if (ch === 'x') M.tone(72, t, 0.12, { vel: 0.3 });
            const when = t, idx = j;
            setTimeout(() => cells.forEach((cc, q) => cc.classList.toggle('now', q === idx)), (when - c.currentTime) * 1000);
            t += step;
          });
          setTimeout(() => cells.forEach((cc) => cc.classList.remove('now')), (t - c.currentTime) * 1000);
        });
      },
      tracks() { tracksTool(el); },
      fretboard() { fretboardSheet(el); }
    };
    sheets[cur]();
  }

  function fretboardSheet(el) {
    const STRINGS = [{ n: 'E', midi: 64 }, { n: 'B', midi: 59 }, { n: 'G', midi: 55 }, { n: 'D', midi: 50 }, { n: 'A', midi: 45 }, { n: 'E', midi: 40 }]; // high → low
    const PAIRS = { '4ths': [[3, 2], [4, 3], [5, 4], [1, 0]], '5ths': [[4, 3], [5, 4], [3, 2]], '6ths': [[2, 0], [3, 1], [4, 2]], '3rds': [[2, 1], [1, 0], [3, 2]] };
    el.innerHTML = `<h2>Guitar fretboard chart</h2><p class="small muted">Scale notes of the chosen key on all strings, plus diatonic double stops (two notes played together) in 3rds, 4ths, 5ths and 6ths.</p>
      <div class="no-print">${keyChooser()}</div>
      <div class="row no-print" style="margin:12px 0">
        <label class="small">Show <select id="fb-mode"><option value="scale">Scale notes</option><option value="all">All notes</option><option value="natural">Natural notes only</option></select></label>
        <label class="small">Double stops <select id="fb-ds"><option value="">None</option><option>3rds</option><option>4ths</option><option>5ths</option><option>6ths</option></select></label>
        <label class="small">String pair <select id="fb-pair"></select></label>
      </div>
      <div class="table-wrap"><div id="fb"></div></div><div id="fb-note" class="small muted" style="margin-top:8px"></div>`;
    const fillPairs = () => {
      const ds = $('#fb-ds', el).value;
      $('#fb-pair', el).innerHTML = ds ? PAIRS[ds].map((p, i) => `<option value="${i}">${STRINGS[p[0]].n} & ${STRINGS[p[1]].n} strings</option>`).join('') : '<option>—</option>';
    };
    const draw = () => {
      const k = keyObj(), scale = M.scaleNotes(k.name, 'major'), scalePcs = scale.map(M.pcOf);
      const mode = $('#fb-mode', el).value, ds = $('#fb-ds', el).value;
      const frets = 15, W = 54, H = 30, x0 = 40, y0 = 30;
      let svg = '';
      for (let f = 0; f <= frets; f++) {
        const x = x0 + f * W;
        svg += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + 5 * H}" stroke="var(--line)" stroke-width="${f === 0 ? 6 : 2}"/>`;
        svg += `<text x="${x - W / 2}" y="${y0 + 5 * H + 24}" text-anchor="middle" font-size="11" fill="var(--muted)">${f || ''}</text>`;
        if ([3, 5, 7, 9, 15].includes(f)) svg += `<circle cx="${x - W / 2}" cy="${y0 + 2.5 * H}" r="5" fill="var(--line)"/>`;
        if (f === 12) svg += `<circle cx="${x - W / 2}" cy="${y0 + 1.5 * H}" r="5" fill="var(--line)"/><circle cx="${x - W / 2}" cy="${y0 + 3.5 * H}" r="5" fill="var(--line)"/>`;
      }
      STRINGS.forEach((s, si) => {
        const y = y0 + si * H;
        svg += `<line x1="${x0}" y1="${y}" x2="${x0 + frets * W}" y2="${y}" stroke="var(--muted)" stroke-width="${1 + si * 0.35}"/>`;
        svg += `<text x="14" y="${y + 4}" font-size="13" font-weight="700" fill="var(--text)">${s.n}</text>`;
      });
      const pos = (si, f) => [f === 0 ? x0 - 14 : x0 + f * W - W / 2, y0 + si * H];
      const pairs = [];
      if (ds) {
        const [lo, hi] = PAIRS[ds][+$('#fb-pair', el).value || 0];
        const steps = { '3rds': 2, '4ths': 3, '5ths': 4, '6ths': 5 }[ds];
        for (let f = 0; f <= frets; f++) {
          const pc = M.mod(STRINGS[lo].midi + f);
          const d = scalePcs.indexOf(pc); if (d < 0) continue;
          const targetPc = scalePcs[(d + steps) % 7];
          for (let g = Math.max(0, f - 4); g <= Math.min(frets, f + 4); g++) {
            const m1 = STRINGS[lo].midi + f, m2 = STRINGS[hi].midi + g;
            if (M.mod(m2) === targetPc && m2 > m1 && m2 - m1 <= 12) { pairs.push([lo, f, hi, g, d]); break; }
          }
        }
        pairs.forEach(([a, f, b, g]) => { const [x1, y1] = pos(a, f), [x2, y2] = pos(b, g); svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--accent-2)" stroke-width="5" stroke-linecap="round" opacity=".7"/>`; });
      }
      STRINGS.forEach((s, si) => {
        for (let f = 0; f <= frets; f++) {
          const pc = M.mod(s.midi + f);
          const inScale = scalePcs.includes(pc);
          const natural = M.SHARPS[pc].length === 1;
          if (mode === 'scale' && !inScale) continue;
          if (mode === 'natural' && !natural) continue;
          const [x, y] = pos(si, f);
          const isRoot = pc === k.pc;
          const label = inScale ? scale[scalePcs.indexOf(pc)] : M.nameOf(pc, k.flat);
          svg += `<g data-m="${s.midi + f}" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="11" fill="${isRoot ? 'var(--accent)' : inScale ? 'var(--surface)' : 'var(--surface-2)'}" stroke="${inScale ? 'var(--accent)' : 'var(--line)'}" stroke-width="2"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="10" font-weight="700" fill="${isRoot ? 'var(--accent-ink)' : 'var(--text)'}">${M.pretty(label)}</text></g>`;
        }
      });
      $('#fb', el).innerHTML = `<svg class="fret-svg" viewBox="0 0 ${x0 + frets * W + 10} ${y0 + 5 * H + 36}" role="img" aria-label="Guitar fretboard">${svg}</svg>`;
      $$('[data-m]', el).forEach((g) => g.onclick = () => M.tone(+g.dataset.m, 0, 1));
      $('#fb-note', el).innerHTML = ds ? `${pairs.length} diatonic ${ds} in ${M.pretty(k.name)} major on this string pair (shapes shown with lines). ${{ '4ths': 'Mostly the same fret on adjacent strings (one fret higher onto the B string).', '5ths': 'Power-chord shape: two frets up on the next string (three onto B).', '6ths': 'Skip a string — classic soul/country/worship fill sound.', '3rds': 'Sweet harmony lines — slide them up the neck.' }[ds]}` : `Accent = root (${M.pretty(k.name)}). Tap any dot to hear it.`;
    };
    bindKeyChooser(el, draw);
    $('#fb-mode', el).onchange = draw;
    $('#fb-ds', el).onchange = () => { fillPairs(); draw(); };
    $('#fb-pair', el).onchange = draw;
    fillPairs(); draw();
  }

  // Inside an embedded viewer, printing and file downloads are blocked — hide those buttons
  const embedded = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
  if (embedded) document.documentElement.classList.add('embedded');

  route();
})();
