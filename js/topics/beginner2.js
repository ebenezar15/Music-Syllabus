/* Beginner Worship Piano · Level 2 topics */
(window.TOPICS = window.TOPICS || []).push(
{
  id: "inversions",
  module: "beginner2",
  title: "Inversions",
  level: 2,
  mins: 50,
  summary: "Rearrange the notes of a chord so your hands move less and your chords flow smoothly.",
  theory: [
    "An <b>inversion</b> is the same chord with a different note on the bottom. The notes do not change — only their order.",
    "<table><tr><th>Position</th><th>C major</th><th>Bottom note</th></tr><tr><td>Root position</td><td>C – E – G</td><td>Root (1)</td></tr><tr><td>1st inversion</td><td>E – G – C</td><td>3rd</td></tr><tr><td>2nd inversion</td><td>G – C – E</td><td>5th</td></tr></table>",
    "To find the next inversion, take the bottom note and move it up an octave. Do it three times and you are back in root position, one octave higher.",
    "Minor chords work the same way: A minor = A–C–E → C–E–A → E–A–C.",
    "Shape clues: root position has two stacked 3rds. In 1st inversion the <b>gap</b> (a 4th) is at the top; in 2nd inversion the gap is at the bottom. The top note of the gap is always the root.",
    "Inversions let you practise <b>voice leading</b>: keep common notes where they are and move the others by the smallest step. C (C–E–G) to F becomes C–F–A — the C stays, E goes up to F, G goes up to A.",
    "Fingering (right hand): root position 1-3-5. For 1st inversion use 1-2-5; for 2nd inversion use 1-3-5. Left hand mirrors this (5-3-1, 5-3-1, 5-2-1)."
  ],
  application: [
    "Worship pads and keys parts sit in one comfortable area of the piano — inversions keep your right hand in the middle register instead of jumping around.",
    "Smooth inversions sound professional and leave space for the guitar and vocals.",
    "Choosing which note is on top lets you follow or support the melody the congregation is singing.",
    "Inversions are the first step to slash chords: a 1st inversion C with an E in the bass is C/E."
  ],
  examples: [
    { prog: "C F/C G/B C", label: "1-4-5-1 with smooth inversions", note: "Right hand barely moves: C-E-G, C-F-A, B-D-G, C-E-G." },
    { prog: "C G/B Am F/A", label: "1-5-6-4 voice-led", note: "Common worship loop kept in one hand position." },
    { prog: "C C/E C/G C", label: "C major through all inversions (bass shows the bottom note)" },
    { melody: "C4 E4 G4 E4 G4 C5 G4 C5 E5 C5 G4 E4", label: "Climbing the C chord through its inversions (broken)" }
  ],
  exercises: [
    "Right hand: play C major in root, 1st and 2nd inversion and back down, 4 times. Say the position aloud as you play.",
    "Repeat with F, G and Am. Then do the same with the left hand alone.",
    "Play 1-4-1-5-1 in C using only inversions that keep your thumb between middle C and the G above it. Metronome at 60 bpm, one chord per bar.",
    "Play C – Am – F – G with the closest inversion each time (no note should move more than a 3rd). Then start the loop from 1st inversion and from 2nd inversion.",
    "Take the same loop to G and F major. Metronome 70–80 bpm, 2 beats per chord."
  ],
  assignment: "Record yourself playing C – G – Am – F three times, each time starting from a different inversion of C, with the left hand playing roots. Keep every change smooth at 70 bpm.",
  mistakes: [
    "Jumping to root position every time out of habit.",
    "Moving all three fingers when one or two notes could stay still.",
    "Losing track of the root — always know which note names the chord."
  ],
  tips: [
    "Pick a 'home zone' (roughly middle C to the C above) and force every chord to fit inside it."
  ],
  related: ["triads", "slash-chords", "chord-changing", "basic-voicing"],
  tools: ["keyboard"]
},
{
  id: "nashville",
  module: "beginner2",
  title: "Nashville Number System",
  level: 2,
  mins: 45,
  summary: "Name chords by numbers instead of letters so you can play any song in any key.",
  theory: [
    "The <b>Nashville Number System</b> numbers each chord by its position in the key's major scale. In C: C=1, D=2, E=3, F=4, G=5, A=6, B=7.",
    "<table><tr><th>Number</th><th>1</th><th>2m</th><th>3m</th><th>4</th><th>5</th><th>6m</th><th>7°</th></tr><tr><td>Key of C</td><td>C</td><td>Dm</td><td>Em</td><td>F</td><td>G</td><td>Am</td><td>B°</td></tr><tr><td>Key of G</td><td>G</td><td>Am</td><td>Bm</td><td>C</td><td>D</td><td>Em</td><td>F#°</td></tr></table>",
    "A plain number means a major chord. Add <b>m</b> or a minus sign for minor (6m or 6-), ° for diminished, and 7, maj7, sus etc. as needed: 5<sup>7</sup>, 4maj7, 5sus.",
    "Slash numbers show the bass: <b>1/3</b> = the 1 chord with the 3rd note in the bass (C/E in C). <b>4/5</b> = F/G in C.",
    "Chords outside the key get accidentals: <b>♭7</b> = B♭ in C, <b>♭6</b> = A♭ in C. A major 2 or 3 chord is written 2 or 3 (D or E major in C).",
    "Rhythm shorthand on charts: each number usually = one bar. Underlined or bracketed numbers share a bar; a diamond ◇ means hit and hold.",
    "Roman numerals (I, ii, iii, IV, V, vi, vii°) say the same thing. Worship teams mostly use Nashville numbers because they are faster to write and call out."
  ],
  application: [
    "When the worship leader says 'Take it down to the 4', the whole band knows where to go in any key.",
    "If the leader changes key for a singer, a number chart still works — nothing has to be rewritten.",
    "Musical directors call out numbers with hand signs (1 finger = 1, 4 fingers = 4) during spontaneous worship.",
    "You start to hear songs as patterns (1-5-6-4), which makes learning new songs much faster."
  ],
  examples: [
    { prog: "C G Am F", label: "1 – 5 – 6m – 4", note: "Switch the key in Chord Lab and watch the numbers stay the same." },
    { prog: "C F C G", label: "1 – 4 – 1 – 5 (hymn style)" },
    { prog: "Dm7 G7 C", label: "2m7 – 5⁷ – 1" },
    { prog: "C C/E F G", label: "1 – 1/3 – 4 – 5 (slash numbers)" },
    "Chart example: | 1 | 5/7 | 6m | 4 | → in G that is G – D/F# – Em – C."
  ],
  exercises: [
    "Write out the numbers 1–7 with chord names for C, G, D and F major (include m and °).",
    "Play 1-4-5-1 in C, G, F and D. Say the numbers aloud as you change.",
    "Have a partner call random numbers (1, 4, 5, 6m, 2m) every 4 beats at 70 bpm in C; play them instantly. Then do it in G.",
    "Take two songs you know and rewrite their chords as numbers. Play them in a new key from the number chart only.",
    "Add slash numbers: play 1 – 5/7 – 6m – 4 – 1/3 – 4 – 5 in C, G and D."
  ],
  assignment: "Convert one full worship song you play at church into a Nashville chart and play it from that chart in two different keys.",
  mistakes: [
    "Forgetting that 2, 3 and 6 are minor by default in a major key.",
    "Counting from the wrong root — always number from the key, not from the first chord of the song.",
    "Reading 5/7 as 'five seven chord' instead of '5 with the 7th scale note in the bass'."
  ],
  tips: [
    "Learn the hand signs your team uses — numbers are a live communication tool, not just a paper system."
  ],
  related: ["scale-degrees", "all-keys", "chord-families", "reading-charts", "common-progressions"],
  tools: ["chordlab"]
},
{
  id: "all-keys",
  module: "beginner2",
  title: "Playing in All 12 Keys",
  level: 2,
  mins: 60,
  summary: "Think in numbers and shapes so any key feels as familiar as C.",
  theory: [
    "Every major key uses the same pattern of steps: <b>W W H W W W H</b> (whole, whole, half, whole, whole, whole, half). Learn the pattern, not 12 separate lists.",
    "<b>Think in numbers:</b> a song is '1-5-6-4', not 'C-G-Am-F'. Your job in a new key is just to find where 1 is and build from there.",
    "<b>Think in shapes:</b> a major triad is always 4 semitones + 3 semitones; minor is 3 + 4. The hand shape changes only because of black keys, and there are only a few patterns: all white (C, F, G), white-black-white (D, E, A), black-white-black (D♭, E♭, A♭), and the odd ones (B, G♭/F♯, B♭).",
    "Recommended order to learn keys: <b>C → G → F → D → B♭ → A → E♭ → E → A♭ → B → D♭ → G♭/F♯</b>. This follows the most common worship keys first and adds one sharp or flat at a time.",
    "Key signatures: sharp keys G(1♯) D(2) A(3) E(4) B(5) F♯(6). Flat keys F(1♭) B♭(2) E♭(3) A♭(4) D♭(5) G♭(6). Order of sharps: F C G D A E B; flats are the reverse: B E A D G C F.",
    "For each key, know four things: the scale, the 1-4-5 chords, the 6m and 2m chords, and where the 5 chord's bass note is so you can find it with your eyes closed.",
    "Enharmonic keys: D♭ = C♯, G♭ = F♯, B = C♭. Churches usually write D♭, E♭, A♭ for keys and F♯ or G♭ depending on the band — be ready for both."
  ],
  application: [
    "Worship leaders pick keys to suit their voice: men often use G, A, B♭; women often use C, D, E♭ or E.",
    "Guest singers may ask for a key you have never played — number thinking lets you adapt in minutes.",
    "Black-key keys (D♭, E♭, A♭) are very common in gospel and are actually comfortable for the hand once learned.",
    "Being fluent in all keys makes modulation and key changes inside a song possible."
  ],
  examples: [
    { prog: "C F G C", label: "1-4-5-1 — transpose this through every key in the learning order" },
    { prog: "C Am F G", label: "1-6m-4-5 in every key" },
    { prog: "C Dm Em F G Am Bdim C", label: "Every diatonic triad of a key, 1 to 7" },
    { melody: "C4 D4 E4 F4 G4 A4 B4 C5-", label: "Major scale pattern W W H W W W H" }
  ],
  exercises: [
    "Week 1: Play the major scale (hands separately, one octave) in C, G and F at 60 bpm. Then 1-4-5-1 in each.",
    "Week 2: Add D and B♭. Play 1-6m-4-5 in all five keys, 4 beats per chord.",
    "Week 3: Add A and E♭. Play every diatonic triad 1 to 7 and back in each key.",
    "Week 4+: Add E, A♭, B, D♭, F♯ one per week. Each new key: scale, triads, 1-5-6m-4, and one song.",
    "Daily check: set the metronome to 70 bpm and play 1-4-5-1 through all keys you know without stopping between keys."
  ],
  assignment: "Choose one simple worship song and play it in 6 different keys from a Nashville chart (at least two must be flat keys).",
  mistakes: [
    "Staying in C and G forever because they are comfortable.",
    "Memorising chord letters per key instead of the number pattern.",
    "Avoiding black-key keys — they are standard in church music."
  ],
  tips: [
    "Spend one week 'living' in a key: warm up, practise and play every song in that key.",
    "Say chord names aloud as you play a new key — it trains both brain and hands."
  ],
  related: ["nashville", "major-minor-scales", "circle-of-fifths", "flex-circle-drills"],
  tools: ["chordlab", "keyboard"]
},
{
  id: "chord-scale",
  module: "beginner2",
  title: "Chord–Scale Relationship",
  level: 2,
  mins: 50,
  summary: "Build a chord on every note of the scale to see which chords live in each key.",
  theory: [
    "<b>Intervals → scale degrees → chords.</b> A scale is a set of intervals from the root. Number those notes 1–7 (scale degrees). Stack every other note on each degree and you get the key's chords.",
    "Stacking 3rds in C major: 1-3-5 = C E G, 2-4-6 = D F A, 3-5-7 = E G B, 4-6-1 = F A C, 5-7-2 = G B D, 6-1-3 = A C E, 7-2-4 = B D F.",
    "<table><tr><th>Degree</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th></tr><tr><td>Quality</td><td>Major</td><td>minor</td><td>minor</td><td>Major</td><td>Major</td><td>minor</td><td>dim</td></tr><tr><td>In C</td><td>C</td><td>Dm</td><td>Em</td><td>F</td><td>G</td><td>Am</td><td>B°</td></tr></table>",
    "The quality comes from the intervals: major 3rd (4 semitones) + minor 3rd (3) = major chord; minor 3rd + major 3rd = minor chord; minor 3rd + minor 3rd = diminished.",
    "Add one more 3rd and you get the 7th chords of the key: Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7♭5. Only the 5 chord is a dominant 7th — that is why it pulls so strongly home.",
    "The <b>relative minor</b> (6) uses the same notes: A minor's chords are Am, B°, C, Dm, Em, F, G. Same family, different home.",
    "Going the other way: if you see a chord, ask 'which scale contains all its notes?' For example, F major (F A C) lives in C major, F major and B♭ major."
  ],
  application: [
    "When you know a song's key, you already know its 6 or 7 most likely chords before you hear them.",
    "For fills and runs, the scale of the key fits over all diatonic chords — your right hand always knows 'safe' notes.",
    "Hearing a chord that is NOT in the scale (like E major in C) tells you something special is happening — a secondary dominant or borrowed chord.",
    "Playing by ear becomes much easier: guess from the 6 diatonic chords first."
  ],
  examples: [
    { prog: "C Dm Em F G Am Bdim C", label: "Diatonic triads of C major" },
    { prog: "Cmaj7 Dm7 Em7 Fmaj7 G7 Am7 Bm7b5 Cmaj7", label: "Diatonic 7th chords of C major" },
    { prog: "Am Dm Em Am", label: "Relative minor: 1m-4m-5m in A minor (same notes as C major)" },
    { melody: "C4 E4 G4 D4 F4 A4 E4 G4 B4 F4 A4 C5", label: "Stacking 3rds on degrees 1, 2, 3, 4" }
  ],
  exercises: [
    "Write the C major scale with degree numbers, then write the triad on each degree. Check every quality using semitone counting.",
    "Play the diatonic triads up and down in C with the right hand, LH playing roots, at 60 bpm. Name each chord and number aloud.",
    "Repeat in G and F. Then in D and B♭.",
    "Play the diatonic 7th chords in C and G. Listen for the unique sound of the 5⁷ and the 7ø.",
    "Ear test: a partner plays a diatonic chord in C after a 1-4-5-1 cadence; name its number."
  ],
  assignment: "Make a one-page chart showing the diatonic triads and 7th chords in C, G, D, F and B♭, then play each row from memory.",
  mistakes: [
    "Making the 7 chord major or minor — in a major key it is diminished.",
    "Calling the 5 chord's 7th a major 7th. G7 in C has F natural, not F♯."
  ],
  tips: [
    "Remember the pattern 'Major, minor, minor, Major, Major, minor, diminished' — it is the same in every major key."
  ],
  related: ["intervals", "scale-degrees", "chord-families", "nashville", "seventh-chords"],
  tools: ["keyboard", "chordlab"]
},
{
  id: "vamping",
  module: "beginner2",
  title: "Vamping",
  level: 2,
  mins: 40,
  summary: "Loop a short 2–4 chord pattern to carry worship, prayer and altar call moments.",
  theory: [
    "A <b>vamp</b> is a short chord pattern (usually 2–4 chords) repeated for as long as needed. It has no fixed ending — the leader decides when to move on.",
    "Good vamps are <b>open-ended</b>: they avoid a strong 5 → 1 cadence that sounds 'finished'. Common choices: 1 → 4, 4 → 5, 6m → 4, 4 → 5 → 6m.",
    "Popular worship vamps in numbers: <ul><li>1 – 4 (or 1 – 4/1)</li><li>4 – 5 – 6m</li><li>6m – 4 – 1 – 5</li><li>4 – 1/3 – 2m – 1</li><li>1 – 5/7 – 6m – 4</li></ul>",
    "Vamps grow and shrink with <b>dynamics</b>: start with soft pads or single notes, add rhythm and the LH octave as the room rises, then pull back for prayer.",
    "Keep the rhythm steady and predictable — the vamp is a 'carpet' that the leader, singers and the congregation stand on.",
    "Colour chords (add9, sus2, maj7) make vamps sound richer without changing the pattern: Cadd9 – F(add9) – Am7 – G."
  ],
  application: [
    "Spontaneous worship: the leader sings new lines over a 4 – 5 – 6m loop.",
    "Prayer and ministry time: a soft 1 – 4/1 pad behind the pastor speaking.",
    "Altar calls: a gentle loop that can last 2 minutes or 20 minutes.",
    "Song endings and transitions: vamp on the last chorus chords while the leader repeats a tag."
  ],
  examples: [
    { prog: "C F/C", label: "1 – 4/1 prayer pad", note: "Keep C in the bass the whole time." },
    { prog: "F G Am", label: "4 – 5 – 6m spontaneous worship vamp", note: "Play F and G for 2 beats each, Am for 4." },
    { prog: "Am F C G", label: "6m – 4 – 1 – 5 big build vamp" },
    { prog: "F C/E Dm7 C", label: "4 – 1/3 – 2m7 – 1 descending bass vamp" },
    { prog: "Cadd9 Fmaj7", label: "Colourful two-chord altar call vamp" }
  ],
  exercises: [
    "Play C – F/C with whole-note pads at 60 bpm for 2 minutes without stopping. Focus on a soft, even touch.",
    "Play F – G – Am at 72 bpm. Every 8 bars change the texture: pad → broken chords → block chords on beats 1 and 3 → back to pad.",
    "Play the 6m – 4 – 1 – 5 vamp and practise a 16-bar crescendo, then a 16-bar decrescendo.",
    "Take each vamp to G and D. Practise hearing a call like 'go to the 4' and move to a new vamp starting on 4 without a break."
  ],
  assignment: "Prepare three vamps (prayer, spontaneous worship, altar call) and play each for 3 minutes with a clear dynamic shape. Record one.",
  mistakes: [
    "Ending the vamp with a strong 5 – 1 that makes the room think the song is over.",
    "Speeding up or getting louder without the leader's cue.",
    "Overplaying — fills every bar distract from prayer."
  ],
  tips: [
    "Watch the leader, not your hands. A vamp should be so familiar that your eyes are free."
  ],
  related: ["background-playing", "atmosphere", "dynamics", "common-progressions", "worship-progressions"],
  tools: ["chordlab", "metronome"]
},
{
  id: "playing-styles",
  module: "beginner2",
  title: "Playing Styles — Broken, Block, Arpeggio & Combination",
  level: 2,
  mins: 50,
  summary: "Play the same chords four different ways to change the mood and energy of a song.",
  theory: [
    "<b>Block chords:</b> all notes of the chord played together. Strong and full — great for hymns, choruses and rhythmic hits.",
    "<b>Broken chords:</b> the chord notes are split into a pattern, usually not in a straight line. Example: C – G – E – G (low, high, middle, high) — the classic 'Alberti' pattern.",
    "<b>Arpeggio:</b> the notes played one after another in order, up and/or down, often across more than one octave: C – E – G – C – E – G – C.",
    "<b>Combination:</b> mix styles between the hands or within a bar. For example LH broken octave 1–5–8 while RH plays block chords on beats 2 and 4, or RH block chord on beat 1 then an arpeggio fill.",
    "Energy guide: arpeggio = flowing and gentle; broken = moving but steady; block = strong and rhythmic; combination = full-band feel when you are the only player.",
    "Count carefully: broken and arpeggio patterns usually move in steady 8th notes (1 & 2 & 3 & 4 &)."
  ],
  application: [
    "Verse 1: soft arpeggios. Chorus: block chords. Bridge: combination with LH octaves for a build.",
    "Hymns and congregational singing: block chords give a clear harmonic and rhythmic lead.",
    "Solo piano with a singer (weddings, special songs): broken chords and arpeggios fill the space of a band.",
    "Prayer and communion: slow, wide arpeggios with sustain pedal."
  ],
  examples: [
    { prog: "C Am F G", label: "Same progression for all four styles", note: "Try block, then broken, then arpeggio, then combination." },
    { melody: "C3 G3 E4 G3 C3 G3 E4 G3", label: "LH broken pattern on C (1-5-10-5)" },
    { melody: "C4 E4 G4 C5 E5 C5 G4 E4", label: "Arpeggio on C, up and down" },
    { melody: "C4 G4 E4 G4 C4 G4 E4 G4", label: "Alberti-style broken chord on C" }
  ],
  exercises: [
    "Block: play C – Am – F – G, 4 beats each, RH chords + LH roots at 70 bpm.",
    "Broken: same chords, LH plays 1-5-8-5 (root, 5th, octave, 5th) in 8th notes at 60 bpm while RH holds the chord.",
    "Arpeggio: RH 1-3-5-8 up and down on each chord in 8th notes, 60 bpm, then 80 bpm.",
    "Combination: LH broken 1-5-8-5 + RH block chord on beats 2 and 4 at 70 bpm.",
    "Play one song using a different style for verse, chorus and bridge."
  ],
  assignment: "Arrange one worship song using all four styles (label each section with the style used) and play it for your teacher.",
  mistakes: [
    "Uneven timing in broken patterns — the thumb note is often too loud.",
    "Using block chords all the time, which makes everything sound the same.",
    "Arpeggios too fast for the song's feel."
  ],
  tips: [
    "Let style follow the song's emotion: ask 'is this moment gentle, flowing, or strong?'"
  ],
  related: ["lh-accompaniment", "arpeggios", "dynamics", "sustain-pedal"],
  tools: ["keyboard", "metronome"]
},
{
  id: "slash-chords",
  module: "beginner2",
  title: "Slash Chords",
  level: 2,
  mins: 50,
  summary: "Control the bass note to create smooth walking bass lines and fresh worship colours.",
  theory: [
    "A <b>slash chord</b> is written <code>Chord/Bass</code>. The left side is what the right hand plays; the right side is the bass note for the left hand. <code>C/E</code> = C chord over an E bass.",
    "Two kinds: <ul><li><b>Inversions</b> — the bass is a chord tone: C/E, C/G, G/B, F/A.</li><li><b>Non-chord bass</b> — the bass is not in the chord, creating a new colour: F/G, D/C, Am/G (actually Am7), C/D.</li></ul>",
    "<b>F/G</b> (4 over 5) is a soft, open sounding dominant — common in worship instead of G or G7. It contains F A C over G, so it sounds like a G11 / 5sus.",
    "Slash chords create <b>walking bass lines</b> where the bass moves by step: C – G/B – Am – Am/G – F – C/E – Dm – G. The bass walks C B A G F E D G.",
    "Ascending lines work too: C – C/E – F – G (bass C E F G) or F – F/G – Am (bass F G A).",
    "In Nashville numbers, write the bass as a scale degree: C/E = 1/3, G/B = 5/7, F/G = 4/5."
  ],
  application: [
    "When a bass player is absent, slash chords let your left hand play a real bass line.",
    "When a bass player is present, read the slash so you do not clash with their note.",
    "4/5 (F/G in C) is the classic worship 'lift' right before the chorus.",
    "Descending bass lines under a chorus create emotion and movement while the right hand stays still."
  ],
  examples: [
    { prog: "C G/B Am Am/G F C/E Dm G", label: "Descending walking bass (C B A G F E D G)" },
    { prog: "C C/E F G", label: "Ascending bass 1 – 1/3 – 4 – 5" },
    { prog: "C F/G C", label: "4/5 as a soft dominant" },
    { prog: "F G/F Em Am", label: "4 – 5/4 – 3m – 6m (bass F F E A)" },
    { prog: "C/E F G Am", label: "Rising bass E F G A" }
  ],
  exercises: [
    "Play C, C/E and C/G. Keep the right hand chord the same; only the LH note changes. Listen to how each feels.",
    "Play the descending line C – G/B – Am – Am/G – F – C/E – Dm – G at 70 bpm, 2 beats per chord. RH stays in one area.",
    "Play the ascending line C – C/E – F – G in C, G and D.",
    "Replace every 5 chord in a familiar song with 4/5 (e.g. F/G in C) and compare.",
    "Write your own 8-bar walking bass line using slash chords in G and play it."
  ],
  assignment: "Re-arrange one worship song chorus so the bass walks by step using slash chords. Write the chart and play it at tempo.",
  mistakes: [
    "Playing the bass note in the right hand chord as well, which muddies the sound.",
    "Reading C/E as 'C or E' — the slash always means 'over'.",
    "Doubling the third (E) loudly in both hands on C/E."
  ],
  tips: [
    "Sing the bass line first. If it walks smoothly, the slash chords are right."
  ],
  related: ["inversions", "nashville", "lh-accompaniment", "passing-chords", "relative-pedal"],
  tools: ["keyboard", "chordlab"]
},
{
  id: "circle-of-fifths",
  module: "beginner2",
  title: "Circle of 4ths & 5ths",
  level: 2,
  mins: 50,
  summary: "Use the circle to understand keys, key signatures and the strongest chord movements.",
  theory: [
    "The <b>circle of 5ths</b> arranges all 12 keys so each one is a perfect 5th (7 semitones) above the last: C – G – D – A – E – B – F♯/G♭ – D♭ – A♭ – E♭ – B♭ – F – back to C.",
    "Going the other way (anticlockwise) is the <b>circle of 4ths</b>: C – F – B♭ – E♭ – A♭ – D♭ – G♭ – B – E – A – D – G – C. Moving up a 4th is the same note as moving down a 5th.",
    "Clockwise each key adds one sharp: G (1♯), D (2), A (3), E (4), B (5), F♯ (6). Anticlockwise each key adds one flat: F (1♭), B♭ (2), E♭ (3), A♭ (4), D♭ (5), G♭ (6).",
    "Neighbours on the circle are close relatives: for C, the 4 chord (F) is on one side and the 5 chord (G) on the other. The relative minor (Am) sits on the inner ring.",
    "Root movement by 4ths (down a 5th) is the <b>strongest movement in music</b>: 5 → 1, 2 → 5 → 1, 6 → 2 → 5 → 1 all walk around the circle anticlockwise.",
    "The diatonic circle in C: C – F – B° – Em – Am – Dm – G – C. Every chord moves up a 4th to the next."
  ],
  application: [
    "Find the 1, 4 and 5 chords of any key instantly: look at the key and its two neighbours.",
    "Gospel and worship progressions (2-5-1, 3-6-2-5-1) are just steps around the circle.",
    "Practising everything 'around the circle' guarantees you cover all 12 keys in a musical order.",
    "Key changes to a neighbouring key (C → G or C → F) sound smooth because they share 6 of 7 notes."
  ],
  examples: [
    { prog: "C F Bb Eb Ab Db Gb B E A D G C", label: "Major triads around the circle of 4ths" },
    { prog: "C Am Dm G C", label: "1 – 6m – 2m – 5 – 1: three circle moves" },
    { prog: "Em Am Dm G C", label: "3m – 6m – 2m – 5 – 1 (all 4ths)" },
    { prog: "E7 A7 D7 G7 C", label: "Dominant chain around the circle" },
    { prog: "C F Bdim Em Am Dm G C", label: "Diatonic circle in C" }
  ],
  exercises: [
    "Draw the circle from memory with the number of sharps/flats for each key.",
    "Play the major triads around the circle of 4ths, LH root + RH triad, 4 beats each at 60 bpm. Then around the circle of 5ths.",
    "Repeat with minor triads, and use the closest inversion each time so the RH stays in one area.",
    "Play 5 → 1 in every key around the circle (G → C, C → F, F → B♭ …) at 70 bpm.",
    "Play the diatonic circle progression C – F – B° – Em – Am – Dm – G – C in C, G and F."
  ],
  assignment: "Without looking, say and play the 1-4-5 chords of all 12 keys going around the circle. Time yourself and try to finish under 2 minutes.",
  mistakes: [
    "Mixing up direction: clockwise = 5ths (sharps), anticlockwise = 4ths (flats).",
    "Forgetting that F♯ and G♭ are the same key at the bottom of the circle."
  ],
  tips: [
    "Memory line for sharps: Father Charles Goes Down And Ends Battle. Reverse it for flats."
  ],
  related: ["all-keys", "flex-circle-drills", "common-progressions", "functional-harmony", "key-transitions"],
  tools: ["circle"]
},
{
  id: "fills-licks-riffs",
  module: "beginner2",
  title: "Fills, Licks, Riffs & Grooves",
  level: 2,
  mins: 55,
  summary: "Add short melodic ideas and rhythmic feel between the vocal lines without getting in the way.",
  theory: [
    "<b>Riff</b> = a short melodic, rhythmic phrase that is <b>repeated</b>. It becomes part of the song's identity (an intro hook played every chorus).",
    "<b>Lick</b> = a short melodic phrase, often used once as a decoration or answer to the singer.",
    "<b>Groove</b> = the rhythmic feel or sense of swing that makes us vibe. It is created by timing, accents and space — not by playing more notes.",
    "<b>Fill</b> = anything you play in the gap between vocal phrases. A <b>counter-melody fill</b> is a little tune that answers the main melody, like a conversation.",
    "Where licks come from: <ul><li><b>Scale-based</b> — 3–6 notes from the major or pentatonic scale (C D E G A in C).</li><li><b>Melody-based</b> — a fragment of the song's own melody, played higher or as an echo.</li><li><b>Chord-based</b> — arpeggiate the current chord.</li></ul>",
    "Ornaments: <b>octave movements</b> (playing a line in octaves for strength, or jumping a note up an octave); <b>slurs/slides</b> — a quick grace note sliding into the main note, often a black key into a white key (D♯ → E, F♯ → G).",
    "Golden rule: <b>fill the gaps, never the words</b>. When the singer sings, you support; when they breathe, you can answer."
  ],
  application: [
    "Between lines of a slow worship song: a gentle 3-note pentatonic lick in the right hand.",
    "Intros and turnarounds: a repeated riff gives the band a clear starting point.",
    "Upbeat praise: groove comes from tight LH and RH rhythm with the drummer — accent the 'and' of beats.",
    "End of a chorus: a descending octave line that leads into the next section."
  ],
  examples: [
    { melody: "E5 D5 C5 A4 G4-", label: "Scale-based pentatonic lick (C D E G A) over C" },
    { melody: "D#5 E5 G5 A5 C6-", label: "Slur lick: slide D♯ into E, then climb the pentatonic" },
    { melody: "C5 C5 E5 G5 _ G5 A5 G5", label: "Simple repeated riff idea (play twice)" },
    { melody: "C4 E4 G4 A4 G4 E4 D4 C4-", label: "Counter-melody fill over C to F" },
    { melody: "C5 B4 A4 G4 F4 E4 D4 G4-", label: "Descending octave line (double with LH an octave lower)" },
    { prog: "C | F | Am | G", label: "Practice bed: play the chords, add a lick at the end of each bar" }
  ],
  exercises: [
    "Learn the C major pentatonic (C D E G A) over two octaves in the right hand at 70 bpm.",
    "Play C – F – Am – G, 4 beats each. On beat 4 of every bar play a 3-note pentatonic lick (e.g. E D C).",
    "Add a slur: start each lick with a quick D♯ sliding into E. Practise slowly until it sounds smooth.",
    "Create a 1-bar riff and repeat it over the progression for 16 bars without changing the rhythm.",
    "Play a lick in octaves (both thumbs and 5th fingers) at 60 bpm, then 80 bpm.",
    "Groove drill: LH roots on 1 and 3, RH chord stabs on the '&' of 2 and the '&' of 4 at 90 bpm."
  ],
  assignment: "Over one worship song, write and play three different fills (one scale-based, one melody-based, one with octaves) placed only between vocal lines.",
  mistakes: [
    "Playing licks over the singer's words.",
    "Using the same lick every gap until it becomes predictable.",
    "Rushing fills — they must land back in time for beat 1."
  ],
  tips: [
    "Less is more: one beautiful 3-note lick beats a busy run.",
    "Steal from the singer: echo their last two or three notes an octave higher."
  ],
  related: ["counter-melodies", "runs", "passing-notes", "syncopation-groove", "solo-interlude", "melodic-devices"],
  tools: ["keyboard", "metronome"]
},
{
  id: "common-progressions",
  module: "beginner2",
  title: "Common Chord Progressions",
  level: 2,
  mins: 55,
  summary: "Learn the handful of progressions that power most worship, gospel and pop songs.",
  theory: [
    "A <b>chord progression</b> is a series of chords. A small number of progressions appear again and again — learn them as number patterns and you will recognise songs instantly.",
    "<table><tr><th>Numbers</th><th>In C</th><th>Character / style reference</th></tr><tr><td>1-4-5</td><td>C F G</td><td>Hymns, gospel, rock 'n' roll, 'Amazing Grace' style</td></tr><tr><td>1-5-6m-4</td><td>C G Am F</td><td>Pop and modern worship ('Let It Be' style)</td></tr><tr><td>1-6m-4-5</td><td>C Am F G</td><td>50s / doo-wop ('Stand By Me', 'Heart and Soul' style)</td></tr><tr><td>6m-4-1-5</td><td>Am F C G</td><td>Emotional, minor-flavoured version of 1-5-6-4</td></tr><tr><td>2m-5-1</td><td>Dm7 G7 C</td><td>Jazz and gospel cadence</td></tr><tr><td>4-5-3m-6m</td><td>F G Em Am</td><td>Ballads and Asian pop ('royal road' progression)</td></tr><tr><td>1-3-4</td><td>C E7 F</td><td>Gospel lift — the 3 becomes major to push to 4</td></tr></table>",
    "1-5-6m-4, 1-6m-4-5 and 6m-4-1-5 are rotations of the same four chords. Where you start changes the emotion.",
    "Most progressions end by moving toward 1 through 5 (or 4). 5 → 1 feels like 'home'; 4 → 1 is the softer 'Amen' cadence.",
    "1-3-4: the diatonic 3 is minor (Em), but gospel players often make it major or dominant (E or E7). That E contains G♯, which leads up to A, making the move to F/Am feel stronger."
  ],
  application: [
    "Learning a new worship song: listen for one of these patterns first, then fill in the details.",
    "Spontaneous worship and vamps are usually built from one of these loops.",
    "Leaders often call progressions by number: 'Just do 1-5-6-4 for the tag.'",
    "Knowing the shapes lets you transpose these patterns instantly with the circle or Chord Lab."
  ],
  examples: [
    { prog: "C F G C", label: "1-4-5-1" },
    { prog: "C G Am F", label: "1-5-6m-4" },
    { prog: "C Am F G", label: "1-6m-4-5" },
    { prog: "Am F C G", label: "6m-4-1-5" },
    { prog: "Dm7 G7 Cmaj7", label: "2m-5-1" },
    { prog: "F G Em Am", label: "4-5-3m-6m" }
  ],
  exercises: [
    "Play each progression in C, 4 beats per chord at 70 bpm, LH roots + RH triads with smooth inversions.",
    "Play 1-3-4 as C – E7 – F – C and compare it with C – Em – F – C.",
    "Take each progression to G, D and F.",
    "Ear training: a partner plays one of the progressions in C; identify it by number.",
    "Write down three songs you know and identify which common progression each uses."
  ],
  assignment: "Build a 'progression playlist': for each of the seven progressions, name one song that uses it and play the progression in that song's key.",
  mistakes: [
    "Learning progressions only in C — practise them in the keys your church uses.",
    "Thinking each song is completely new instead of spotting the familiar pattern."
  ],
  tips: [
    "Use the same right-hand position for all four chords of 1-5-6m-4 — it should feel like one hand shape gently shifting."
  ],
  related: ["nashville", "vamping", "worship-progressions", "cadences", "flex-progression-drills"],
  tools: ["chordlab"]
},
{
  id: "sus-chords",
  module: "beginner2",
  title: "Sus Chords",
  level: 2,
  mins: 40,
  summary: "Replace the 3rd with a 2nd or 4th to create open, floating sounds that love to resolve.",
  theory: [
    "<b>Sus</b> means <i>suspended</i>: the 3rd of the chord is removed and replaced, so the chord is neither major nor minor.",
    "<b>sus2</b> = 1 – 2 – 5. Csus2 = C – D – G. Open, airy, modern.",
    "<b>sus4</b> = 1 – 4 – 5. Csus4 = C – F – G. Tense — it wants to fall back to the 3rd (F → E).",
    "<b>5sus</b> in worship charts means the 5 chord with a sus4: in C that is Gsus4 (G – C – D), resolving to G (G – B – D). The C drops to B. This 5sus → 5 → 1 is a classic hymn and worship ending.",
    "A sus2 chord has the same notes as a sus4 built on its 5th: Csus2 (C D G) = Gsus4 (G C D). Context and bass note decide the name.",
    "<b>7sus4</b> adds the ♭7: G7sus4 = G – C – D – F. Very common in gospel as a smoother dominant. F/G is a close cousin."
  ],
  application: [
    "Worship pads: Csus2 and Fsus2 give a spacious, modern atmosphere.",
    "Before the final chord: 5sus → 5 → 1 creates a gentle, satisfying 'Amen'.",
    "Decorate a held chord: C – Csus4 – C adds movement without changing the harmony.",
    "Intros: alternating sus2 and major (Csus2 – C) gives motion with the right hand only."
  ],
  examples: [
    { prog: "Gsus4 G C", label: "5sus → 5 → 1 ending" },
    { prog: "C Csus4 C Csus2 C", label: "Decorating one chord" },
    { prog: "Csus2 Fsus2 Asus2 Gsus4", label: "Floating sus pad loop" },
    { prog: "Dm7 G7sus4 G7 C", label: "2m7 – 5⁷sus – 5⁷ – 1" }
  ],
  exercises: [
    "Play C – Csus4 – C – Csus2 – C slowly. Name the moving note each time (E → F → E → D → E).",
    "Play sus2 and sus4 on 1, 4 and 5 in C, G and D.",
    "End songs with 5sus → 5 → 1 in C, G, F and D, 2 beats each at 60 bpm.",
    "Turn a 1-5-6m-4 loop into Csus2 – Gsus4 – Am7 – Fsus2 and play it as a soft pad for 2 minutes."
  ],
  assignment: "Add sus chords to the intro and ending of one worship song and play it for your teacher, explaining where each sus resolves.",
  mistakes: [
    "Keeping the 3rd in the chord (C E F G is not Csus4).",
    "Leaving a sus4 unresolved too often — it sounds unfinished."
  ],
  tips: [
    "Listen to the 4 falling to the 3 — that tiny movement is the magic of sus chords."
  ],
  related: ["triads", "dom7-chords", "intros-endings", "add9-chords", "chord-quality"],
  tools: ["keyboard", "chordlab"]
},
{
  id: "dom7-chords",
  module: "beginner2",
  title: "Dominant 7th Chords",
  level: 2,
  mins: 45,
  summary: "Add the flat 7 to a major chord for a strong pull that drives the music home.",
  theory: [
    "A <b>dominant 7th</b> chord = major triad + a minor 7th (♭7). Formula 1 – 3 – 5 – ♭7. G7 = G – B – D – F.",
    "It is called 'dominant' because it is naturally built on the 5th degree (the dominant) of a major key: G7 in C.",
    "The pull comes from the <b>tritone</b> between the 3rd and ♭7 (B and F in G7). B wants to rise to C; F wants to fall to E. Together they land on the C chord.",
    "Quick way to find the ♭7: go down a whole step from the root's octave. G → F, C → B♭, D → C, A → G.",
    "Do not confuse with <b>maj7</b>: Cmaj7 = C E G B (dreamy); C7 = C E G B♭ (bluesy, wants to move).",
    "Any chord can be turned into a dominant 7 to 'point' at the chord a 4th above it: C7 → F, A7 → Dm, E7 → Am. These are called <b>secondary dominants</b>."
  ],
  application: [
    "Hymn and gospel endings: 5⁷ → 1 makes the final 'Amen' feel complete.",
    "1⁷ → 4 (C7 → F) is a favourite gospel and blues move into the 4 chord.",
    "Blues and up-tempo praise often use dominant 7ths on 1, 4 and 5.",
    "Secondary dominants add colour: C – A7 – Dm – G7 – C."
  ],
  examples: [
    { prog: "C G7 C", label: "5⁷ → 1 resolution" },
    { prog: "C C7 F Fm C", label: "1⁷ → 4, then minor 4 back to 1" },
    { prog: "C A7 Dm G7 C", label: "Secondary dominant A7 → Dm" },
    { prog: "C7 F7 C7 G7 F7 C7", label: "Dominant 7ths in a blues feel" },
    { melody: "G3 B3 D4 F4 E4-", label: "G7 arpeggio resolving the 7th (F) down to E" }
  ],
  exercises: [
    "Build the dominant 7th on every white key root and say the notes (C7 = C E G B♭, D7 = D F♯ A C …).",
    "Play 5⁷ → 1 in C, G, F, D and B♭. Watch the 3rd rise and the 7th fall.",
    "Play C – C7 – F – Fm – C in C and G at 60 bpm.",
    "Use the 4-note voicing G7 = B D F G (1st inversion) to C = C E G C; find the smoothest path.",
    "Play the 12-bar blues in C with dominant 7ths: C7 ×4, F7 ×2, C7 ×2, G7, F7, C7, G7."
  ],
  assignment: "Play 5⁷ → 1 in all 12 keys around the circle of 4ths (G7 → C, C7 → F …) at 60 bpm without stopping.",
  mistakes: [
    "Playing a major 7th (B) instead of the ♭7 (B♭) on C7.",
    "Resolving the 7th upwards — it normally falls by a step."
  ],
  tips: [
    "Hear the dominant 7th as a question; the next chord is the answer."
  ],
  related: ["seventh-chords", "chord-scale", "circle-of-fifths", "cadences", "styles-blues-salsa"],
  tools: ["keyboard", "chordlab"]
},
{
  id: "sustain-pedal",
  module: "beginner2",
  title: "Sustain Pedal",
  level: 2,
  mins: 40,
  summary: "Use the pedal to connect chords smoothly without blurring the harmony.",
  theory: [
    "The <b>sustain (damper) pedal</b> is the right pedal. Pressing it lifts all the dampers so notes keep ringing after you release the keys.",
    "<b>Legato (syncopated) pedalling:</b> play the new chord, <i>then</i> lift the pedal and press it again straight away. Count: chord on 1 — pedal up-down on '&'. This joins chords with no gap and no blur.",
    "<b>Lift on every chord change.</b> If you keep the pedal down from C into G, the notes mix and sound muddy. One chord = one pedal (unless you deliberately want a wash).",
    "<b>Half pedal:</b> lift the pedal only part-way so some sound is cleared but not all. Useful for fast passages or when the bass is getting muddy.",
    "Use your heel as a pivot on the floor and press with the ball of the foot. Keep the foot in contact with the pedal — no stamping.",
    "On digital keyboards, check the pedal works the right way round (some reverse polarity) and set it to a 'continuous' or half-pedal mode if available."
  ],
  application: [
    "Slow worship and ballads: legato pedalling makes block chords and arpeggios sing.",
    "Upbeat songs: little or no pedal — short, clear chords give rhythm and groove.",
    "With a full band, use less pedal so your sound does not cover the bass and guitar.",
    "Pads on keyboard: sometimes a held pad patch replaces the need for pedal."
  ],
  examples: [
    { prog: "C | G/B | Am | F", label: "Pedal practice: change pedal on every bar line" },
    { prog: "C Am F G", label: "Arpeggio each chord with one pedal per chord" },
    "Pedal marking: Ped. ____ ^ ____ ^ ____ — the ^ shows a quick lift and re-press.",
    { melody: "C3 G3 C4 E4 G4 E4 C4 G3", label: "Wide LH-RH arpeggio to hold with the pedal" }
  ],
  exercises: [
    "No hands: count 1-2-3-4 at 60 bpm and practise lifting and pressing the pedal on beat 1 only, quietly and smoothly.",
    "Play C – F – G – C, one chord per bar. Play the chord on 1, then change the pedal on '&'. Lift hands early and listen for no gaps.",
    "Play C – G/B – Am – F as arpeggios (8th notes) with one pedal per chord at 60 bpm.",
    "Try half pedal on a fast 8th-note broken chord pattern at 90 bpm; aim for clarity.",
    "Play one verse with legato pedal and one chorus with no pedal and compare the feel."
  ],
  assignment: "Record a slow worship song using legato pedalling. Listen back for any blur or gaps at the chord changes and fix them.",
  mistakes: [
    "Pressing the pedal at the same time as the chord (gaps or blur instead of legato).",
    "Holding the pedal through chord changes.",
    "Stamping the pedal so it makes noise."
  ],
  tips: [
    "Your ears control the pedal, not your foot — if it sounds muddy, change it."
  ],
  related: ["playing-styles", "dynamics", "atmosphere", "arpeggios"],
  tools: ["keyboard", "metronome"]
}
);
