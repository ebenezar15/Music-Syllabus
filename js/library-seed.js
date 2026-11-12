/* Starter chord library — loaded into an empty local library (and used to seed the shared one) */
(function () {
  const N = (s) => s.trim().split(/\s+/).filter(Boolean).map((n) => window.Music.parseNote(n).midi);
  // Build a piano-roll capture from a list of [lh, rh, beats]
  function roll(bpm, steps, style) {
    const events = [];
    let t = 0;
    steps.forEach(([lh, rh, beats]) => {
      N(lh).forEach((m) => events.push({ m, t, d: beats * 0.95, v: 90 }));
      const r = N(rh);
      if (style === 'arp') r.forEach((m, i) => events.push({ m, t: t + i * 0.5, d: beats - i * 0.5 - 0.05, v: 80 }));
      else r.forEach((m) => events.push({ m, t, d: beats * 0.95, v: 80 }));
      t += beats;
    });
    return { id: 'r' + Math.random().toString(36).slice(2, 8), name: 'Demo', bpm, events, created: Date.now() };
  }
  const E = (o) => Object.assign({ kind: 'voicing', tags: [], level: 2, notes: '', application: '', progression: '', rolls: [], media: [], related: [] }, o, { lh: N(o.lh || ''), rh: N(o.rh || '') });

  window.LIBRARY_SEED = () => [
    E({ name: 'C major — close root position', symbol: 'C', voicingType: 'Close', category: 'Triad', level: 1,
      lh: 'C3', rh: 'C4 E4 G4', tags: ['beginner', 'foundation'],
      notes: 'The first shape every student learns: 1-3-5 stacked in thirds, LH root an octave below.',
      application: 'Hymns, first songs, learning the chord family. Use as the reference for every inversion.', related: ['triads', 'inversions'] }),
    E({ name: 'C/E — first inversion over the 3rd', symbol: 'C/E', voicingType: 'Slash', category: 'Slash chord', level: 2,
      lh: 'E2 E3', rh: 'G3 C4 E4', tags: ['bass walk', 'worship'],
      notes: 'Same C chord, but the bass plays the 3rd (E). Smooth step between C and F.',
      application: 'Walk-ups: C – C/E – F. Supports a singer climbing into the chorus.', progression: 'C C/E F G',
      related: ['slash-chords', 'connecting-chords'] }),
    E({ name: 'Cadd9 — open worship spread', symbol: 'Cadd9', voicingType: 'Open', category: 'Add / Sus', level: 2,
      lh: 'C2 G2 C3', rh: 'D4 E4 G4', tags: ['worship', 'pad', 'ballad'],
      notes: 'LH 1-5-8 for weight, RH 9-3-5 with the 2nd and 3rd rubbing a whole step apart. This is "the worship sound".',
      application: 'Intimate verses, prayer backgrounds, intros. Keep the RH shape and move the LH root under 1-5-6-4.',
      related: ['add9-chords', 'background-playing', 'atmosphere'],
      rolls: [] }),
    E({ name: '1-5-6-4 with the add9 spread', symbol: 'Cadd9', kind: 'progression', voicingType: 'Open', category: 'Progression', level: 2,
      lh: 'C2 G2 C3', rh: 'D4 E4 G4', tags: ['worship', 'vamp'],
      notes: 'Keep the RH almost still (common tones G and D) while the LH moves C – G – A – F. Very little hand movement, a big sound.',
      application: 'The modern worship loop. Vamp it under prayer, altar calls and transitions.', progression: 'Cadd9 G/B Am7 Fmaj9',
      related: ['common-progressions', 'vamping', 'worship-progressions'] }),
    E({ name: 'G7sus4 → G7 — the 5sus resolution', symbol: 'G7sus4', voicingType: 'Close', category: 'Add / Sus', level: 2,
      lh: 'G2 D3', rh: 'F4 G4 C5', tags: ['ending', 'transition', 'gospel'],
      notes: 'The 4th (C) hangs above, then drops to the 3rd (B) on G7. Tension → release before going home.',
      application: 'Before the last chorus, endings, and setting up a new key (5sus of the new key).', progression: 'G7sus4 G7 C',
      related: ['sus-chords', 'key-transitions', 'cadences'] }),
    E({ name: 'Dm9 – G13 – Cmaj9 — rootless 2-5-1', symbol: 'Dm9', kind: 'progression', voicingType: 'Rootless', category: 'Progression', level: 4,
      lh: 'D3', rh: 'F3 A3 C4 E4', tags: ['jazz', 'gospel', 'neo-soul'],
      notes: 'RH plays 3-5-7-9 (A-form). Each next chord moves only one or two notes by a step: F-A-C-E → F-A-B-E → E-G-B-D.',
      application: 'Turnarounds, interludes, sophisticated endings. Learn it in all 12 keys around the circle.', progression: 'Dm9 G13 Cmaj9',
      related: ['advanced-voicing', 'voice-leading', 'flex-progression-drills'] }),
    E({ name: 'Cmaj7 — drop 2', symbol: 'Cmaj7', voicingType: 'Drop 2', category: '7th chord', level: 4,
      lh: 'C3 G3', rh: 'C4 E4 B4', tags: ['jazz', 'ballad'],
      notes: 'Take close C-E-G-B, drop the 2nd voice from the top (G) an octave. Wider, smoother, sounds like a horn section.',
      application: 'Ballads, solo piano, voice-led harmonised melodies.', related: ['advanced-voicing'] }),
    E({ name: 'Quartal pad over C', symbol: 'C69', voicingType: 'Quartal', category: 'Extended', level: 4,
      lh: 'C2 C3', rh: 'E4 A4 D5 G5', tags: ['pad', 'modern worship', 'atmosphere'],
      notes: 'Stacked 4ths (E-A-D-G) over C: a 6/9 colour with no "major/minor" weight. Floats.',
      application: 'Sermon backgrounds, spontaneous worship, intros. Slide the same shape up a step for movement.',
      related: ['quartal-voicing', 'atmosphere', 'tones-layers'] }),
    E({ name: 'C cluster — 2-3-5 rub', symbol: 'Cadd9', voicingType: 'Cluster', category: 'Add / Sus', level: 3,
      lh: 'C3 G3', rh: 'D4 E4 G4 C5', tags: ['pad', 'texture'],
      notes: 'Notes packed a step apart (D-E) make a warm cluster. Keep clusters in the middle register, never low.',
      application: 'Soft pads and swells; adds shimmer without changing the chord.', related: ['basic-voicing'] }),
    E({ name: 'D/C — polychord (Lydian sound)', symbol: 'D/C', voicingType: 'Polychord', category: 'Slash chord', level: 4,
      lh: 'C2 C3', rh: 'D4 F#4 A4', tags: ['cinematic', 'lydian', 'modulation'],
      notes: 'A D triad over C bass = Cmaj7#11 sound. The F# is the bright Lydian #4.',
      application: 'Cinematic lifts, the Lydian modulation pivot, building into a big chorus.', progression: 'C D/C G/B C',
      related: ['modulation', 'advanced-voicing'] }),
    E({ name: 'E7 – A7 – Dm — the 3-6-2 chain', symbol: 'E7', kind: 'progression', voicingType: 'Shell', category: 'Progression', level: 3,
      lh: 'E2 D3', rh: 'G#3 B3 E4', tags: ['gospel', 'secondary dominant'],
      notes: 'Secondary dominants pulling round the circle: V/vi → V/ii → ii. Shells (1-7 in LH) keep it clean.',
      application: 'Gospel turnarounds and "church endings"; lead into the 2-5-1.', progression: 'C E7 A7 Dm7 G7 C',
      related: ['passing-chords', 'chord-substitution'] }),
    E({ name: 'C#dim7 — passing diminished', symbol: 'C#dim7', voicingType: 'Close', category: 'Passing chord', level: 3,
      lh: 'C#3', rh: 'E4 G4 A#4 C#5', tags: ['passing', 'gospel'],
      notes: 'Connects C to Dm by a chromatic bass step (C – C# – D). Every note leans toward Dm.',
      application: 'Walk between 1 and 2, or 4 and 5 (F – F#dim7 – G).', progression: 'C C#dim7 Dm7 G7',
      related: ['passing-chords', 'aug-dim-chords', 'dim7-aug7-m7b5'] }),
    E({ name: 'Db7 — tritone substitute for G7', symbol: 'Db7', voicingType: 'Shell', category: '7th chord', level: 4,
      lh: 'Db3', rh: 'F4 B4', tags: ['jazz', 'neo-soul', 'substitution'],
      notes: 'G7 and Db7 share the tritone B/F (Cb = B). The bass slides Db → C chromatically.',
      application: 'Replace any V7 → I for a smoother, darker cadence.', progression: 'Dm7 Db7 Cmaj7',
      related: ['chord-substitution'] }),
    E({ name: 'Fm6 — negative of G7 (minor plagal)', symbol: 'Fm6', voicingType: 'Close', category: 'Borrowed', level: 4,
      lh: 'F2 C3', rh: 'Ab3 D4 F4', tags: ['negative harmony', 'borrowed', 'ending'],
      notes: 'Mirror G7 around the C–G axis and you get Fm6. Resolves to C with a tender, "Amen" feel.',
      application: 'Emotional endings; replace the V with iv(6).', progression: 'C Fm6 C',
      related: ['negative-harmony', 'borrowed-chords'] }),
    E({ name: 'Ab – Bb – C — the ♭6-♭7-1 victory ending', symbol: 'Ab', kind: 'progression', voicingType: 'Open', category: 'Progression', level: 3,
      lh: 'Ab2 Eb3', rh: 'C4 Eb4 Ab4', tags: ['borrowed', 'ending', 'praise'],
      notes: 'Both chords are borrowed from C minor; the rising bass Ab → Bb → C feels triumphant.',
      application: 'Big praise endings and final choruses.', progression: 'Ab Bb C',
      related: ['borrowed-chords', 'intros-endings'] }),
    E({ name: 'F/A – G/B – C — 4/6 – 5/7 – 1 key lift', symbol: 'F/A', kind: 'progression', voicingType: 'Slash', category: 'Progression', level: 3,
      lh: 'A2', rh: 'C4 F4 A4', tags: ['transition', 'key change'],
      notes: 'Rising bass 6-7-1 of the target key. Play it in the NEW key to land a modulation.',
      application: 'Song-to-song transitions and key lifts before a last chorus.', progression: 'G7sus4 F/A G/B C',
      related: ['key-transitions', 'song-transitions', 'modulation'] }),
    E({ name: 'Octave melody with 3rd fill (3-1 RH)', symbol: 'C', kind: 'lick', voicingType: 'Octave melody', category: 'Lick / fill', level: 2,
      lh: 'C2 C3', rh: 'C4 E4 C5', tags: ['melody', 'worship'],
      notes: 'Thumb and pinky play the melody in octaves; the middle finger adds the 3rd below the top note.',
      application: 'Playing the melody for congregational singing, instrumental verses.', related: ['melody-with-chords'] })
  ].map((e, i) => {
    e.id = 'seed-' + String(i + 1).padStart(2, '0');
    e.created = e.updated = Date.UTC(2026, 10, 1) + i * 60000;
    return e;
  });

  // Demo piano-roll captures for the progression entries
  window.LIBRARY_SEED_ROLLS = {
    'seed-04': () => roll(72, [['C2 G2 C3', 'D4 E4 G4', 4], ['B1 G2 B2', 'D4 G4', 4], ['A1 E2 A2', 'C4 E4 G4', 4], ['F1 C2 F2', 'C4 E4 G4 A4', 4]], 'arp'),
    'seed-06': () => roll(84, [['D3', 'F3 A3 C4 E4', 4], ['G2', 'F3 A3 B3 E4', 4], ['C3', 'E3 G3 B3 D4', 8]]),
    'seed-15': () => roll(96, [['Ab2 Eb3', 'C4 Eb4 Ab4', 2], ['Bb2 F3', 'D4 F4 Bb4', 2], ['C2 C3 G3', 'C4 E4 G4 C5', 8]]),
    'seed-16': () => roll(76, [['G2 D3', 'F4 G4 C5', 4], ['A2', 'C4 F4 A4', 2], ['B2', 'D4 G4 B4', 2], ['C2 C3', 'C4 E4 G4 C5', 8]])
  };
})();
