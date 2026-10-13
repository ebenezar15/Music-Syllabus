/* Curriculum structure: modules, levels, programs (schedules) and crash courses */
window.LEVELS = [
  { n: 1, name: 'Beginner', short: 'Beg' },
  { n: 2, name: 'Elementary', short: 'Elem' },
  { n: 3, name: 'Intermediate', short: 'Int' },
  { n: 4, name: 'Advanced', short: 'Adv' }
];

window.MODULES = [
  { id: 'foundations', title: 'Foundations', subtitle: 'The musical alphabet — keys, notes, rhythm, intervals, scales', icon: '🔤', hue: 205, order: 1 },
  { id: 'beginner1', nav: 'Beginner · Level 1', title: 'Beginner Piano · Level 1', subtitle: 'Words — first chords, chord families, charts, LH and songs', icon: '🎹', hue: 160, order: 2 },
  { id: 'beginner2', nav: 'Worship Piano · Level 2', title: 'Beginner Worship Piano · Level 2', subtitle: 'Sentences — inversions, numbers, all keys, styles, fills', icon: '🙌', hue: 130, order: 3 },
  { id: 'flexibility', title: 'Chord Flexibility Lab', subtitle: 'Every chord, inversion and movement in all 12 keys', icon: '🔁', hue: 95, order: 4 },
  { id: 'intermediate', nav: 'Int–Adv · Level 1', title: 'Intermediate–Advanced · Level 1', subtitle: 'Harmony — function, 7ths, substitution, passing chords, voicing', icon: '🎼', hue: 35, order: 5 },
  { id: 'advanced', nav: 'Int–Adv · Level 2', title: 'Intermediate–Advanced · Level 2', subtitle: 'Colour — extensions, voice leading, modulation, reharmonisation', icon: '💎', hue: 330, order: 6 },
  { id: 'melody', title: 'All Things Melody', subtitle: 'Scales, phrasing, hooks, improvisation and composing', icon: '🎶', hue: 265, order: 7 },
  { id: 'worship', nav: 'Worship Background', title: 'Worship & Sermon Background', subtitle: 'Atmosphere, pads, transitions and playing under the Word', icon: '🕊️', hue: 280, order: 8 },
  { id: 'band', title: 'Band & Ministry', subtitle: 'Ethics, roles, dynamics and serving together', icon: '🤝', hue: 10, order: 9 },
  { id: 'guitar', nav: 'Acoustic Guitar', title: 'Acoustic Guitar · Beginner', subtitle: 'Fretboard, strumming, CAGED and first songs', icon: '🎸', hue: 20, order: 10 }
];

/* A week/session: { title, topics: [ids], focus, practice } */
window.PROGRAMS = [
  {
    id: 'level1', group: 'pathway', title: 'Level 1 · Beginner Piano', badge: 'Beginner', weeks: 12, perWeek: 1,
    desc: 'From "where is C?" to playing simple songs with both hands. One 45–60 min lesson per week + 20 min daily practice.',
    sessions: [
      { title: 'The keyboard map', topics: ['piano-layout', 'notes-sharps-flats'], focus: 'Find every C, name every key, black-key groups.', practice: 'Name 20 random keys a day; play all Cs, Fs and Gs.' },
      { title: 'Tones & semitones', topics: ['tones-semitones', 'finger-exercises'], focus: 'Half/whole steps, finger numbers, posture.', practice: 'Five-finger pattern in C, G, F — hands separate, slowly.' },
      { title: 'Rhythm & counting', topics: ['rhythm-basics'], focus: 'Whole/half/quarter/eighth notes; 4/4 and 3/4.', practice: 'Clap and count the time sheets with the metronome at 60.' },
      { title: 'Major & minor scales (by feel)', topics: ['major-minor-scales'], focus: 'Hear happy vs sad; C, G, F major and A, D, E minor.', practice: 'One octave hands separate; "hold one note, play the others".' },
      { title: 'First chords', topics: ['triads'], focus: 'Major and minor triads; 1-3-5 shape.', practice: 'All white-key triads up and down; name each as major/minor.' },
      { title: 'Chord families', topics: ['chord-families'], focus: 'Primary (1 4 5) and secondary (2 3 6) chords in C, G, F.', practice: 'Play the family of C, G and F; sing the root.' },
      { title: 'Changing chords', topics: ['chord-changing'], focus: 'Smooth changes, nearest notes, no stopping.', practice: '1-4-5-1 and 1-6-4-5 in C and G, 4 beats each, then 2.' },
      { title: 'Reading chord charts', topics: ['reading-charts'], focus: 'Song forms, where a song starts, repeat signs.', practice: 'Mark the form of 2 songs you know (V, C, B).' },
      { title: 'Left-hand accompaniment', topics: ['lh-accompaniment'], focus: 'Root, octave, root-5th; keyboard vs piano.', practice: 'LH patterns under 1-5-6-4 in C, 5 minutes daily.' },
      { title: 'Dynamics & expression', topics: ['dynamics'], focus: 'Soft/loud, crescendo, playing for the singer.', practice: 'Play one song at p, mf and f — record yourself.' },
      { title: 'Intros & endings', topics: ['intros-endings'], focus: 'Simple intros, 4-5-1 endings, little fills.', practice: 'Write an intro and ending for your song.' },
      { title: 'Songs & assessment', topics: ['first-songs'], focus: 'Put it all together — mini recital.', practice: 'Perform 2 songs hands together with intro and ending.' }
    ]
  },
  {
    id: 'level2', group: 'pathway', title: 'Level 2 · Beginner Worship Piano', badge: 'Elementary', weeks: 14, perWeek: 1,
    desc: 'Ready for the worship team: numbers, inversions, all keys, playing styles, fills and the sustain pedal.',
    sessions: [
      { title: 'Inversions', topics: ['inversions'], focus: 'Root, 1st, 2nd inversion; nearest-note voicing.', practice: 'All major triads in 3 inversions, C → G → D → A.' },
      { title: 'Intervals & scale degrees', topics: ['intervals', 'scale-degrees'], focus: 'Hear and name intervals; numbers of the scale.', practice: 'Interval ear quiz; sing 1-3-5-8.' },
      { title: 'Nashville number system', topics: ['nashville'], focus: 'Think in numbers, not letters.', practice: 'Write 3 songs as numbers; play them in 2 keys.' },
      { title: 'Chord–scale relationship', topics: ['chord-scale'], focus: 'Which chords live in which scale and why.', practice: 'Build all 7 chords of G and D from their scales.' },
      { title: 'Circle of 4ths & 5ths', topics: ['circle-of-fifths', 'all-keys'], focus: 'Key signatures, neighbour keys, learning order.', practice: 'Major triads around the circle of 4ths daily.' },
      { title: 'Playing styles', topics: ['playing-styles'], focus: 'Broken, block, arpeggio and combinations.', practice: 'One progression in 4 styles, metronome 70.' },
      { title: 'Slash chords', topics: ['slash-chords'], focus: 'Bass control, walking basslines.', practice: '1 – 1/3 – 4 – 5 walk-ups in C, G, D.' },
      { title: 'Progressions & vamping', topics: ['common-progressions', 'vamping'], focus: 'The 6 progressions behind most worship songs.', practice: 'Vamp 1-4 and 1-5-6-4 for 3 minutes without stopping.' },
      { title: 'Sus chords', topics: ['sus-chords'], focus: 'sus2, sus4, 5sus → 5.', practice: 'Add sus resolutions to your progressions.' },
      { title: 'Dominant 7th chords', topics: ['dom7-chords'], focus: 'The 5-7 pull to 1; 1-7 to 4.', practice: '5⁷ → 1 in all keys around the circle.' },
      { title: 'Fills, licks, riffs & grooves', topics: ['fills-licks-riffs'], focus: 'Vocabulary between vocal lines.', practice: 'Learn 3 licks, play them in 3 keys.' },
      { title: 'Sustain pedal & worship heart', topics: ['sustain-pedal', 'worship-theology'], focus: 'Clean legato pedalling; why we play.', practice: 'Pedal-change drill on 1-5-6-4.' },
      { title: 'Chord flexibility lab', topics: ['flex-circle-drills'], focus: 'Every triad and inversion in 12 keys.', practice: 'Circle drill 10 min daily — track your tempo.' },
      { title: 'Worship set & assessment', topics: ['worship-progressions'], focus: 'Lead a 3-song set with intro, transitions and ending.', practice: 'Play a full set in different keys.' }
    ]
  },
  {
    id: 'level3', group: 'pathway', title: 'Level 3 · Intermediate (Int–Adv 1)', badge: 'Intermediate', weeks: 18, perWeek: 1,
    desc: 'Real harmony: chord quality, function, 7ths, substitution, passing chords, voicing, soloing and background playing.',
    sessions: [
      { title: 'How chord quality works', topics: ['chord-quality'], focus: 'Stacking 3rds on scale degrees.', practice: 'Build triads on every degree of 4 keys.' },
      { title: 'Functional harmony & cadences', topics: ['functional-harmony', 'cadences'], focus: 'Tonic, subdominant, dominant; how music breathes.', practice: 'Play all 4 cadence types in 6 keys.' },
      { title: 'add9 & 7th chords', topics: ['add9-chords', 'seventh-chords'], focus: 'Colour without changing function.', practice: 'Diatonic 7ths in C, G, F, D.' },
      { title: 'Augmented & diminished', topics: ['aug-dim-chords'], focus: 'Tension chords and where they lead.', practice: '1 – 1+ – 6m and 1 – #1° – 2m.' },
      { title: 'Chord substitution', topics: ['chord-substitution'], focus: 'Smart chords, not many chords.', practice: 'The 5-step substitution drill on 1-4-5-1.' },
      { title: 'Passing chords', topics: ['passing-chords'], focus: 'Secondary dominants, dim, 2-5-1, chromatic.', practice: 'Add a passing chord to every chord change in one song.' },
      { title: 'Passing & grace notes', topics: ['passing-notes', 'melody-with-chords'], focus: 'Decorating melodies; octaves and 3-1 RH.', practice: 'Play a hymn melody in octaves with grace notes.' },
      { title: 'Syncopation & groove', topics: ['syncopation-groove'], focus: 'Pushes, anticipations, feel.', practice: 'Groove patterns over 1-5-6-4 at 3 tempos.' },
      { title: 'Basic voicing', topics: ['basic-voicing'], focus: 'Close, open and cluster voicings.', practice: 'Revoice a song three ways.' },
      { title: 'Chord movements', topics: ['chord-movements'], focus: 'Inner movements, chromatic and octave movements.', practice: '1 – 1sus – 1 and 5-6-5 inner lines in 4 keys.' },
      { title: 'Relative movement & pedal chords', topics: ['relative-pedal', 'connecting-chords'], focus: 'Motion types; pedal points; connecting chords.', practice: 'Pedal-point vamp under a moving RH.' },
      { title: 'Arpeggios', topics: ['arpeggios'], focus: 'Fluent arpeggios for intros and ballads.', practice: '2-octave arpeggios, 4 keys, metronome 60–90.' },
      { title: 'Soloing & interludes', topics: ['solo-interlude', 'chords-for-melody'], focus: 'Target tones, phrasing over changes.', practice: '8-bar interlude over 1-5-6-4.' },
      { title: 'Diamonds, hits & band life', topics: ['diamonds', 'band-ethics'], focus: 'Reading band cues, serving the team.', practice: 'Run a chart with hits and stops with a track.' },
      { title: 'Finding the key', topics: ['find-the-key'], focus: 'Find the key by ear; follow a singer who shifts.', practice: 'Find the key of 5 songs on the radio.' },
      { title: 'Background playing & atmosphere', topics: ['background-playing', 'atmosphere', 'tones-layers'], focus: 'Playing under prayer and sermon.', practice: '10-minute pad + piano background, one key.' },
      { title: 'Blues, walking bass & salsa', topics: ['styles-blues-salsa'], focus: 'Style vocabulary that strengthens worship playing.', practice: '12-bar blues in C and F.' },
      { title: 'Counter-melodies & flexibility', topics: ['counter-melodies', 'flex-progression-drills', 'song-transitions'], focus: 'Answering the singer; 2-5-1 everywhere.', practice: '3-6-2-5-1 in all keys; transition between 2 songs.' }
    ]
  },
  {
    id: 'level4', group: 'pathway', title: 'Level 4 · Advanced (Int–Adv 2)', badge: 'Advanced', weeks: 16, perWeek: 1,
    desc: 'Professional colour: extensions, advanced voicings, voice leading, borrowed chords, negative harmony, modulation, reharmonisation.',
    sessions: [
      { title: '9ths, m6 & 7sus4', topics: ['extended-chords'], focus: 'Rich chord vocabulary.', practice: 'Diatonic 9ths in 4 keys.' },
      { title: 'Quartal voicing', topics: ['quartal-voicing'], focus: 'Open, modern sounds in 4ths.', practice: 'Quartal pads over a 1-4 vamp.' },
      { title: 'Runs', topics: ['runs'], focus: 'Gospel and pentatonic runs into chords.', practice: '3 runs × 3 keys, slow to fast.' },
      { title: 'dim7, aug7 & m7♭5', topics: ['dim7-aug7-m7b5'], focus: 'Advanced tension chords.', practice: '7-3-6 with m7♭5 in all keys.' },
      { title: 'Advanced voicing', topics: ['advanced-voicing'], focus: 'Drop-2, rootless, split, poly chords, melody on top.', practice: 'Rootless 2-5-1 in 12 keys.' },
      { title: 'Voice leading', topics: ['voice-leading'], focus: 'Every voice moves the shortest distance.', practice: 'Voice-lead a hymn in 4 parts.' },
      { title: '3rds & 6ths double stops', topics: ['double-stops'], focus: 'Harmonised fills and lines.', practice: 'Scale in 3rds and 6ths, 4 keys.' },
      { title: 'Borrowed chords', topics: ['borrowed-chords'], focus: 'Modal interchange & accidental chords.', practice: 'Add ♭VI–♭VII–I to an ending.' },
      { title: 'Negative harmony', topics: ['negative-harmony'], focus: 'Mirror harmony for fresh colours.', practice: 'Re-colour a progression with its negative.' },
      { title: 'Chromatic mediants', topics: ['chromatic-mediants'], focus: 'Cinematic third-relation chords.', practice: 'Compose a 4-chord mediant pad.' },
      { title: 'Key transitions', topics: ['key-transitions'], focus: '5sus, 4/6–5/7–1, common chords.', practice: 'Transition between every pair of keys a step apart.' },
      { title: 'Modulation & when to change key', topics: ['modulation', 'key-change-timing'], focus: 'Lydian, ♭7, −2; timing the lift.', practice: 'Plan key changes for a 4-song set.' },
      { title: 'Re-harmonisation', topics: ['reharmonisation'], focus: 'Re-harmonise a hymn; importance of tones.', practice: 'Two reharms of Amazing Grace.' },
      { title: 'Band dynamics & levels', topics: ['band-dynamics'], focus: 'Frequency space, builds, drops.', practice: 'Map dynamics 1–10 for a full song.' },
      { title: 'Composing with chords & melody', topics: ['compose-melody'], focus: 'Chord – scale – melody – scale degree.', practice: 'Write a 16-bar chorus.' },
      { title: 'Capstone', topics: ['reharmonisation', 'song-transitions', 'background-playing'], focus: 'Lead a full service flow: set, transitions, background.', practice: 'Record a 20-minute worship flow.' }
    ]
  },
  {
    id: 'melody-track', group: 'track', title: 'Melody & Improvisation Track', badge: 'Track', weeks: 9, perWeek: 1,
    desc: 'Runs alongside Level 2–3. Scales, phrasing, hooks, tone character, soloing and composing.',
    sessions: [
      { title: 'Scales & their types', topics: ['scale-types'], focus: 'Modes, pentatonics, blues colours.', practice: 'One new scale a day in 3 keys.' },
      { title: 'Intervals for melody', topics: ['intervals'], focus: 'Steps vs leaps; singing intervals.', practice: 'Interval songs, ear drills.' },
      { title: 'Structure, phrasing & hooks', topics: ['melody-structure'], focus: 'Motif → phrase → period.', practice: 'Analyse 3 hooks.' },
      { title: 'Melodic devices', topics: ['melodic-devices'], focus: 'Trills, repetition, space, rhythm.', practice: 'Vary one motif 5 ways.' },
      { title: 'Ideas, humming & improv', topics: ['melodic-ideas'], focus: 'Sing it, then play it.', practice: 'Voice-memo 3 ideas a week.' },
      { title: 'Right tones & character', topics: ['tone-character'], focus: 'Chord tones, tensions, landing notes.', practice: 'Land on 3rds over 1-4-5.' },
      { title: 'Soloing & finding chords', topics: ['chords-for-melody'], focus: 'Solo over chords / chords under a solo.', practice: 'Harmonise a hymn melody.' },
      { title: 'Common melodies', topics: ['common-melodies'], focus: 'Learning tunes by ear in any key.', practice: '2 melodies by ear in 3 keys.' },
      { title: 'Assignments & composing', topics: ['melody-assignments', 'compose-melody'], focus: 'Write and perform your own melody.', practice: 'Compose an 8-bar melody with chords.' }
    ]
  },
  {
    id: 'worship-track', group: 'track', title: 'Worship & Sermon Background Track', badge: 'Track', weeks: 8, perWeek: 1,
    desc: 'For keys players serving in church: theology, numbers, background playing, layers and transitions.',
    sessions: [
      { title: 'Why we play', topics: ['worship-theology'], focus: 'Praise vs worship; serving, not performing.', practice: 'Reflect & journal; pick 3 praise + 3 worship songs.' },
      { title: 'Chord families & numbers', topics: ['chord-families', 'nashville'], focus: 'Hear and call numbers.', practice: 'Number-chart 3 songs.' },
      { title: 'What to play in the background', topics: ['background-playing'], focus: 'Under prayer, sermon and altar call.', practice: '10-min background drill.' },
      { title: 'Melody with chords', topics: ['melody-with-chords'], focus: 'Octaves and 3-1 RH.', practice: 'Play 2 melodies in octaves with LH roots.' },
      { title: 'Connecting chords & progressions', topics: ['connecting-chords', 'worship-progressions'], focus: 'Flow without gaps.', practice: 'Connect 1-4-5 with passing chords.' },
      { title: 'Voices and layers', topics: ['tones-layers'], focus: 'Pads, piano, strings; splits and layers.', practice: 'Build 3 patches: intimate, building, full.' },
      { title: 'Atmosphere, not distraction', topics: ['atmosphere'], focus: 'Space, register, restraint.', practice: 'Play a whole song using only 2–3 notes per chord.' },
      { title: 'Transitions between songs', topics: ['song-transitions', 'key-transitions'], focus: 'Seamless flow across keys.', practice: 'Plan transitions for a 4-song set.' }
    ]
  },
  {
    id: 'guitar-track', group: 'track', title: 'Acoustic Guitar Beginner Course', badge: 'Guitar', weeks: 11, perWeek: 1,
    desc: 'From holding the guitar to strumming worship songs with open chords and CAGED awareness.',
    sessions: [
      { title: 'Guitar basics', topics: ['guitar-basics'], focus: 'Parts, tuning, posture.', practice: 'Tune daily; fretting drill.' },
      { title: 'Holding a pick', topics: ['guitar-pick'], focus: 'Grip and alternate picking.', practice: 'Open-string alternate picking, 5 min.' },
      { title: 'Basic theory', topics: ['guitar-theory'], focus: 'Frets as semitones, numbers, capo.', practice: 'Find the major scale on one string.' },
      { title: 'Time signatures', topics: ['guitar-time'], focus: 'Counting with strums.', practice: 'Down-strums in 4/4 and 3/4 with metronome.' },
      { title: 'Strumming patterns', topics: ['guitar-strumming'], focus: 'D DU UDU and friends.', practice: 'Pattern on G–C–D, 5 min daily.' },
      { title: 'Minor chords', topics: ['guitar-minor'], focus: 'Am, Em, Dm.', practice: 'One-minute changes Em ↔ Am.' },
      { title: 'Exercises', topics: ['guitar-exercises'], focus: 'Spider, changes per minute.', practice: 'Log your changes-per-minute.' },
      { title: 'Learning the fretboard', topics: ['guitar-fretboard'], focus: 'Notes on E and A strings; double stops.', practice: 'Name notes on E/A strings daily.' },
      { title: 'CAGED', topics: ['guitar-caged'], focus: 'Five shapes, one chord.', practice: 'C chord in all 5 shapes.' },
      { title: 'Bonus chords', topics: ['guitar-bonus'], focus: 'E family, sus, dom7 colours.', practice: 'Swap in sus/7 chords on 2 songs.' },
      { title: 'Songs', topics: ['guitar-songs'], focus: 'Play through a full song list.', practice: 'Perform 3 songs.' }
    ]
  },

  /* ---------------- Crash courses ---------------- */
  {
    id: 'crash-weekend', group: 'crash', title: 'Worship Keys in a Weekend', badge: '2 days', weeks: 8, perWeek: 4, unit: 'Session',
    desc: '8 sessions over 2 days (≈60 min each) for a new keys player who must play on Sunday.',
    sessions: [
      { title: 'Day 1 · Map the keyboard', topics: ['piano-layout', 'tones-semitones'], focus: '12 notes repeating; half & whole steps.', practice: 'Find all keys blindfolded-ish.' },
      { title: 'Day 1 · Major scale & triads', topics: ['major-minor-scales', 'triads'], focus: 'W-W-H-W-W-W-H; 1-3-5.', practice: 'Triads in the Sunday key.' },
      { title: 'Day 1 · Chord family & numbers', topics: ['chord-families', 'nashville'], focus: '1 4 5 6 in the Sunday key.', practice: 'Number-chart the Sunday songs.' },
      { title: 'Day 1 · Inversions for smooth changes', topics: ['inversions', 'chord-changing'], focus: 'Nearest-note voicing.', practice: 'Loop 1-5-6-4 with inversions.' },
      { title: 'Day 2 · LH & styles', topics: ['lh-accompaniment', 'playing-styles'], focus: 'Root/octave LH, block vs broken RH.', practice: 'Play the songs block, then broken.' },
      { title: 'Day 2 · Progressions & vamp', topics: ['common-progressions', 'vamping'], focus: 'The 4 progressions you\'ll meet.', practice: 'Vamp for 3 minutes.' },
      { title: 'Day 2 · Intro, ending, dynamics', topics: ['intros-endings', 'dynamics'], focus: 'Start and finish with confidence.', practice: 'Intro + ending for each song.' },
      { title: 'Day 2 · Run the set', topics: ['worship-theology', 'band-ethics'], focus: 'Serve the team; run songs with a track.', practice: 'Full run-through ×2.' }
    ]
  },
  {
    id: 'crash-2wk', group: 'crash', title: '2-Week Worship Ready', badge: '2 weeks', weeks: 10, perWeek: 5, unit: 'Day',
    desc: '10 weekday sessions (45 min) — a fast track through Level 1 essentials and Level 2 worship skills.',
    sessions: [
      { title: 'Keyboard map & rhythm', topics: ['piano-layout', 'rhythm-basics'], focus: 'Notes and counting.', practice: 'Time sheets with metronome.' },
      { title: 'Scales & finger work', topics: ['major-minor-scales', 'finger-exercises'], focus: 'C, G, D, F majors.', practice: '10 min scales.' },
      { title: 'Triads & chord families', topics: ['triads', 'chord-families'], focus: 'Build every chord in a key.', practice: 'Families in 4 keys.' },
      { title: 'Nashville numbers', topics: ['nashville', 'reading-charts'], focus: 'Read charts in numbers.', practice: 'Chart 3 songs.' },
      { title: 'Inversions', topics: ['inversions', 'chord-changing'], focus: 'Smooth voice movement.', practice: 'Inversion ladders.' },
      { title: 'LH & playing styles', topics: ['lh-accompaniment', 'playing-styles'], focus: 'Accompaniment patterns.', practice: 'Two styles per song.' },
      { title: 'Slash & sus chords', topics: ['slash-chords', 'sus-chords'], focus: 'Bass walks and sus colour.', practice: 'Walk-ups in 3 keys.' },
      { title: 'Progressions, vamping, pedal', topics: ['common-progressions', 'vamping', 'sustain-pedal'], focus: 'Flow.', practice: 'Vamp with clean pedalling.' },
      { title: 'Fills & background', topics: ['fills-licks-riffs', 'background-playing'], focus: 'Simple fills; under prayer.', practice: '5-min background pad.' },
      { title: 'Transitions & set', topics: ['song-transitions', 'intros-endings'], focus: 'Lead a full set.', practice: 'Record your set.' }
    ]
  },
  {
    id: 'crash-bootcamp', group: 'crash', title: '4-Week Church Keys Bootcamp', badge: '4 weeks', weeks: 12, perWeek: 3, unit: 'Session',
    desc: '3 sessions a week (60 min). Beginner → confident team member with dom7, passing chords and transitions.',
    sessions: [
      { title: 'Keyboard, notes & rhythm', topics: ['piano-layout', 'notes-sharps-flats', 'rhythm-basics'], focus: 'Foundations fast.', practice: 'Daily note naming.' },
      { title: 'Scales, intervals & degrees', topics: ['major-minor-scales', 'intervals', 'scale-degrees'], focus: 'The scale as numbers.', practice: 'Scales in 4 keys.' },
      { title: 'Chords & families', topics: ['triads', 'chord-families'], focus: 'Primary & secondary chords.', practice: 'Families in 4 keys.' },
      { title: 'Numbers & charts', topics: ['nashville', 'reading-charts'], focus: 'Number charts.', practice: '3 charts.' },
      { title: 'Inversions & changes', topics: ['inversions', 'chord-changing'], focus: 'Smooth voicing.', practice: 'Circle of 4ths triads.' },
      { title: 'LH & styles', topics: ['lh-accompaniment', 'playing-styles'], focus: 'Patterns.', practice: 'Song in 3 styles.' },
      { title: 'Circle & all keys', topics: ['circle-of-fifths', 'all-keys'], focus: 'Learn keys in order.', practice: 'Circle drill.' },
      { title: 'Slash, sus & dom7', topics: ['slash-chords', 'sus-chords', 'dom7-chords'], focus: 'Colour chords.', practice: '5sus–5⁷–1 in all keys.' },
      { title: 'Progressions & vamping', topics: ['common-progressions', 'vamping'], focus: 'Worship loops.', practice: 'Vamp 3 min.' },
      { title: 'Passing chords & fills', topics: ['passing-chords', 'fills-licks-riffs'], focus: 'Movement between chords.', practice: 'One passing chord per change.' },
      { title: 'Background & atmosphere', topics: ['background-playing', 'atmosphere', 'tones-layers'], focus: 'Under the Word.', practice: 'Pad + piano drill.' },
      { title: 'Transitions & band', topics: ['song-transitions', 'band-ethics', 'band-dynamics'], focus: 'Play as a team.', practice: 'Full set with transitions.' }
    ]
  },
  {
    id: 'crash-melody', group: 'crash', title: '4-Week Melody & Improv Intensive', badge: '4 weeks', weeks: 8, perWeek: 2, unit: 'Session',
    desc: '2 sessions a week for players who know chords but freeze when asked to solo or write.',
    sessions: [
      { title: 'Scales & intervals', topics: ['scale-types', 'intervals'], focus: 'Colours and distances.', practice: 'Pentatonic in 4 keys.' },
      { title: 'Chord–scale relationship', topics: ['chord-scale', 'tone-character'], focus: 'Which notes sound right where.', practice: 'Target 3rds over changes.' },
      { title: 'Phrasing & hooks', topics: ['melody-structure', 'melodic-devices'], focus: 'Say something musical.', practice: 'Question/answer phrases.' },
      { title: 'Ideas & improvisation', topics: ['melodic-ideas', 'fills-licks-riffs'], focus: 'Sing → play; build licks.', practice: 'Lick of the day.' },
      { title: 'Soloing over chords', topics: ['chords-for-melody', 'solo-interlude'], focus: 'Interludes and solos.', practice: '8-bar solo over 1-5-6-4.' },
      { title: 'Counter-melodies & runs', topics: ['counter-melodies', 'runs'], focus: 'Answer the singer.', practice: 'Fills between vocal lines.' },
      { title: 'Common melodies', topics: ['common-melodies'], focus: 'Ear training with real tunes.', practice: '2 tunes by ear.' },
      { title: 'Compose & perform', topics: ['compose-melody', 'melody-assignments'], focus: 'Your own melody with chords.', practice: 'Perform your piece.' }
    ]
  },
  {
    id: 'crash-harmony', group: 'crash', title: '4-Week Advanced Harmony Masterclass', badge: '4 weeks', weeks: 8, perWeek: 2, unit: 'Session',
    desc: 'For intermediate players: substitution, passing chords, voicings, borrowed & negative harmony, modulation, reharm.',
    sessions: [
      { title: 'Function & substitution', topics: ['functional-harmony', 'chord-substitution'], focus: 'Smart chord choices.', practice: '5-step substitution drill.' },
      { title: 'Passing chords & 2-5-1s', topics: ['passing-chords', 'flex-progression-drills'], focus: 'Movement everywhere.', practice: '3-6-2-5-1 in 12 keys.' },
      { title: 'Voicing & voice leading', topics: ['advanced-voicing', 'voice-leading'], focus: 'Pro sounds.', practice: 'Rootless 2-5-1s.' },
      { title: 'Extensions & quartal', topics: ['extended-chords', 'quartal-voicing'], focus: 'Modern colour.', practice: 'Quartal pads.' },
      { title: 'Borrowed & negative harmony', topics: ['borrowed-chords', 'negative-harmony'], focus: 'Dark/bright colour swaps.', practice: 'Rewrite an ending.' },
      { title: 'Mediants & modulation', topics: ['chromatic-mediants', 'modulation'], focus: 'Surprise and lift.', practice: 'Modulate 4 ways from C.' },
      { title: 'Transitions & timing', topics: ['key-transitions', 'key-change-timing'], focus: 'When and how.', practice: 'Plan a set.' },
      { title: 'Reharmonisation', topics: ['reharmonisation'], focus: 'Put it all together.', practice: 'Reharm a hymn and a modern song.' }
    ]
  },
  {
    id: 'crash-sermon', group: 'crash', title: 'Sermon Background Crash Course', badge: '1 week', weeks: 3, perWeek: 3, unit: 'Session',
    desc: '3 focused sessions for keys players asked to play under preaching, prayer and altar calls.',
    sessions: [
      { title: 'Heart & role', topics: ['worship-theology', 'atmosphere'], focus: 'Support, never distract.', practice: 'Listen to 3 sermons with background.' },
      { title: 'What to play', topics: ['background-playing', 'vamping', 'tones-layers'], focus: 'Pads, loops, register.', practice: '10 minutes in one key, no repetition fatigue.' },
      { title: 'Follow the preacher', topics: ['dynamics', 'song-transitions'], focus: 'Build, drop, and land into the response song.', practice: 'Practise with a recorded sermon.' }
    ]
  },
  {
    id: 'crash-guitar', group: 'crash', title: '6-Week Guitar Starter', badge: '6 weeks', weeks: 6, perWeek: 1,
    desc: 'Weekly lessons for complete beginners who want to strum worship songs fast.',
    sessions: [
      { title: 'Basics, tuning & pick', topics: ['guitar-basics', 'guitar-pick'], focus: 'Set-up and comfort.', practice: 'Tune + picking 10 min.' },
      { title: 'First chords & time', topics: ['guitar-theory', 'guitar-time'], focus: 'G, C, D, Em; counting.', practice: 'Down-strums on G–C–D.' },
      { title: 'Strumming', topics: ['guitar-strumming'], focus: 'Two essential patterns.', practice: 'Pattern on songs.' },
      { title: 'Minor chords & exercises', topics: ['guitar-minor', 'guitar-exercises'], focus: 'Am, Em, Dm; changes.', practice: 'One-minute changes.' },
      { title: 'Bonus chords', topics: ['guitar-bonus'], focus: 'Sus/7 colours.', practice: 'Swap in colours.' },
      { title: 'Songs', topics: ['guitar-songs'], focus: 'Play a set.', practice: 'Perform 3 songs.' }
    ]
  }
];

/* Daily practice routine templates — percentages of total time */
window.ROUTINE_BLOCKS = [
  { id: 'warm', name: 'Warm-up & technique', pct: 0.2, ideas: { 1: 'Five-finger patterns, hold-one-note drill', 2: 'Scales hands together, inversions ladder', 3: '2-octave arpeggios, 3rds/6ths', 4: 'Runs, double stops, voicing drills' } },
  { id: 'flex', name: 'Chord flexibility (all keys)', pct: 0.2, ideas: { 1: 'Triads in C, G, F', 2: 'Triads round the circle of 4ths', 3: '2-5-1 and 7-3-6 in 6 keys', 4: '3-6-2-5-1 rootless in 12 keys' } },
  { id: 'theory', name: 'This week\'s topic', pct: 0.25, ideas: { 1: 'Work the current lesson\'s exercises', 2: 'Work the current lesson\'s exercises', 3: 'Work the current lesson\'s exercises', 4: 'Work the current lesson\'s exercises' } },
  { id: 'songs', name: 'Songs & repertoire', pct: 0.25, ideas: { 1: 'One song hands together', 2: 'Play your set in 2 keys', 3: 'Apply substitutions/passing chords to a song', 4: 'Reharmonise a section' } },
  { id: 'create', name: 'Ear & improvisation', pct: 0.1, ideas: { 1: 'Copy a melody by ear', 2: 'Vamp + make up a fill', 3: 'Solo over a backing loop', 4: 'Free worship flow with a pad' } }
];

/* Left-hand accompaniment cheat sheet */
window.LH_SHEET = {
  single: [
    ['Root (whole note)', 'Hold the root for the whole bar.', 'Slow worship, intimate verses'],
    ['Root – root', 'Root on beats 1 and 3.', 'Ballads, steady 4/4'],
    ['Octave', 'Root + root an octave lower together.', 'Choruses, building sections'],
    ['Octave walk', 'Low root on 1, high root on 3 (or & of 2).', 'Mid-tempo pop/worship'],
    ['Root – 5th', 'Root on 1, 5th on 3.', 'Country, hymns, 2-feel'],
    ['Root – 5 – 8 – 5', 'Broken pattern in eighths/quarters.', 'Ballads, 6/8 feel'],
    ['Walking bass', 'Root – passing note – target root (stepwise).', 'Gospel, blues, connecting chords'],
    ['Pedal tone', 'Keep one bass note (often 1 or 5) under changing chords.', 'Background, intros, building tension']
  ],
  multi: [
    ['Root + 5th', 'Open 5th — strong and clear.', 'Most worship; avoids muddy 3rds low'],
    ['1 – 5 – 8', 'Root, 5th, octave — big and full.', 'Choruses, piano-only settings'],
    ['1 – 5 – 10', 'Root, 5th, 10th (3rd an octave up) — warm spread.', 'Ballads, hymn arrangements'],
    ['Shell 1 – 7', 'Root + 7th (for 7th chords).', 'Jazz/gospel, leaves room for RH'],
    ['1 – 3 (10th)', 'Root + 10th for colour.', 'Soft sections, solo piano'],
    ['Stride (bass – chord)', 'Low bass on 1 & 3, mid chord on 2 & 4.', 'Upbeat hymns, ragtime/gospel']
  ],
  rules: [
    'Keep the left hand below middle C, but avoid close 3rds below C3 — they sound muddy.',
    'On a keyboard with a bass player: play lighter LH (or none) — stay out of the bass player\'s range.',
    'On acoustic piano alone: your LH IS the bass player — use octaves and root-5ths.',
    'Match the LH rhythm to the drummer\'s kick drum.'
  ]
};

/* Rhythm/time exercise sheets: 16 steps per bar (sixteenths). x = hit, . = rest */
window.RHYTHM_SHEETS = [
  { name: 'Quarter notes', level: 1, sig: '4/4', pattern: 'x...x...x...x...', count: '1 2 3 4' },
  { name: 'Half notes', level: 1, sig: '4/4', pattern: 'x.......x.......', count: '1 (2) 3 (4)' },
  { name: 'Eighth notes', level: 1, sig: '4/4', pattern: 'x.x.x.x.x.x.x.x.', count: '1 & 2 & 3 & 4 &' },
  { name: 'Quarter + eighths', level: 1, sig: '4/4', pattern: 'x...x.x.x...x.x.', count: '1 2 & 3 4 &' },
  { name: 'Waltz', level: 1, sig: '3/4', pattern: 'x...x...x...', count: '1 2 3' },
  { name: 'Dotted quarter + eighth', level: 2, sig: '4/4', pattern: 'x.....x.x.....x.', count: '1 (2) & 3 (4) &' },
  { name: 'Push on the & of 2', level: 2, sig: '4/4', pattern: 'x.....x.....x...', count: '1 (2) & (3 &) 4' },
  { name: '3-3-2 (worship pop)', level: 2, sig: '4/4', pattern: 'x..x..x.x..x..x.', count: '1 . . 2 . . 3 . | repeat' },
  { name: '6/8 ballad', level: 2, sig: '6/8', pattern: 'x.x.x.x.x.x.', count: '1 2 3 4 5 6' },
  { name: 'Sixteenths', level: 3, sig: '4/4', pattern: 'xxxxxxxxxxxxxxxx', count: '1 e & a 2 e & a…' },
  { name: 'Gallop', level: 3, sig: '4/4', pattern: 'x.xxx.xxx.xxx.xx', count: '1 & a 2 & a…' },
  { name: 'Clave 3-2', level: 3, sig: '4/4', pattern: 'x..x...x..x.x...', count: 'son clave (salsa)' },
  { name: 'Syncopated funk', level: 4, sig: '4/4', pattern: 'x..x..x...x.x..x', count: 'anticipations & ghost space' }
];

/* Common progressions in Nashville numbers (used by the chord lab and practice tracks) */
window.PROGRESSIONS = [
  { name: '1 – 4 – 5 – 1', nums: '1 4 5 1', note: 'Hymns, beginner songs' },
  { name: '1 – 5 – 6 – 4', nums: '1 5 6 4', note: 'The modern worship / pop loop' },
  { name: '1 – 6 – 4 – 5', nums: '1 6 4 5', note: '50s / doo-wop, many worship songs' },
  { name: '6 – 4 – 1 – 5', nums: '6 4 1 5', note: 'Minor-feel version of the loop' },
  { name: '4 – 1 – 5 – 6', nums: '4 1 5 6', note: 'Starts away from home' },
  { name: '1 – 4 (vamp)', nums: '1 4 1 4', note: 'Prayer / background vamp' },
  { name: '2 – 5 – 1', nums: '2m7 57 1maj7', note: 'The most important cadence in jazz & gospel' },
  { name: '1 – 6 – 2 – 5', nums: '1 6m7 2m7 57', note: 'Turnaround' },
  { name: '3 – 6 – 2 – 5 – 1', nums: '3m7 6m7 2m7 57 1', note: 'Gospel/jazz circle movement' },
  { name: '7 – 3 – 6', nums: '7m7b5 37 6m', note: 'Minor 2-5-1 to the relative minor' },
  { name: '1 – 1/3 – 4 – 5', nums: '1 1/3 4 5', note: 'Bass walk-up with slash chord' },
  { name: '4 – 5 – 3 – 6', nums: '4 5 3m 6m', note: 'Royal Road (J-pop / worship)' },
  { name: '1 – 7 – 3 – 6 – 2 – 5 – 1', nums: '1 7m7b5 37 6m 27 5sus4 5 1', note: 'Gospel cycle with secondary dominants' },
  { name: '4/6 – 5/7 – 1 (key lift)', nums: '5sus4 4/6 5/7 1', note: 'Rising bass 6-7-1 into a key' },
  { name: '♭6 – ♭7 – 1', nums: 'b6 b7 1', note: 'Borrowed "victory" ending' }
];
