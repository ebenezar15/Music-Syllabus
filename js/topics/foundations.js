/* Foundations — the musical alphabet topics */
(window.TOPICS = window.TOPICS || []).push(
{
  id: "piano-layout",
  module: "foundations",
  title: "Understanding the Piano Layout",
  level: 1,
  mins: 45,
  summary: "The piano is not many notes — it’s 12 notes repeating. Learn the pattern and you’ve learned the whole keyboard.",
  theory: [
    "<b>1. The keyboard is built on a repeating pattern.</b> Look at the black keys first. They repeat in groups of <b>2 black keys</b> and <b>3 black keys</b>. This pattern repeats all the way up and down the piano.",
    "<b>2. Finding the note names (the secret shortcut).</b> Every white key has a letter name: <b>A B C D E F G</b> (then it repeats). Use the black keys as landmarks: <b>C is always the white key just to the left of the group of 2 black keys.</b> From C, count up: C D E F G A B C. Once you find one C, you can find all Cs.",
    "<b>3. Black keys = sharps and flats.</b> Each black key sits between two white keys. Named from the white key on its <i>left</i>, it is a <b>sharp</b> (♯, one step higher); named from the white key on its <i>right</i>, it is a <b>flat</b> (♭, one step lower). The black key between C and D = <b>C♯ / D♭</b>. Same key, two names.",
    "<b>4. No black key between B–C and E–F.</b> That’s not a mistake — that’s how Western music is built. These pairs are already only a half step apart, so there is no room for a key in between.",
    "<b>5. Octaves.</b> From one C to the next C is an <b>octave</b>. Same notes, higher or lower pitch. Every octave looks exactly the same.",
    "<b>6. Middle C.</b> Middle C (C4) sits near the centre of the piano, usually right under the brand name. It is the reference point for reading music and for dividing the work: the left hand (LH) usually plays below it (bass, roots), the right hand (RH) above it (chords, melody).",
    "<b>7. The big idea — the mindset shift:</b> “The piano is not many notes — it’s 12 notes repeating.” <b>7 white keys + 5 black keys = 12.</b> Master one octave, and you’ve secretly learned the whole keyboard. 88 keys stop being scary the moment you see the pattern."
  ],
  application: [
    "When the worship leader calls “we’re in D”, you can find D instantly: the white key in the middle of the 2-black-key group.",
    "Song charts give letters (G, Em, C, D). Knowing the layout means you find the root of every chord without hunting.",
    "On stage keyboards with fewer keys (61 or 76) the pattern is the same — use the 2s and 3s to orient yourself in a dark room.",
    "Middle C is your home base: the LH plays bass notes below it, the RH plays chords around it so the two hands don’t clash."
  ],
  examples: [
    "Group of 2 black keys → the white keys around it are C, D, E (C left, D middle, E right).",
    "Group of 3 black keys → the white keys around it are F, G, A, B (F left of the group, B right of it).",
    { melody: "C4 D4 E4 F4 G4 A4 B4 C5-", label: "One octave of white keys from Middle C" },
    { melody: "C3 C4 C5 C6-", label: "The same note C in four different octaves" }
  ],
  exercises: [
    "Play every group of 2 black keys from the bottom of the piano to the top with fingers 2 and 3. Then every group of 3 with fingers 2, 3, 4.",
    "Find and play every C on the piano, left to right. Then every F (left of the 3-group). Then every E and B (no black key to their right).",
    "Teacher calls a letter; student finds it in 3 different octaves within 5 seconds. 10 letters per round.",
    "Say the names out loud while playing the white keys C to C slowly (60 bpm), up and down, 3 times each hand.",
    "Name all 5 black keys in one octave with both names (C♯/D♭, D♯/E♭, F♯/G♭, G♯/A♭, A♯/B♭)."
  ],
  assignment: "Draw (or print) one octave of the keyboard from C to C and label all 12 keys, with both names for the black keys. Then, eyes closed, find any note your teacher calls by touch using the 2s and 3s.",
  mistakes: [
    "Counting white keys from the bottom instead of using the black-key groups as landmarks.",
    "Thinking there is a black key between E–F or B–C.",
    "Mixing up sharp and flat direction: sharp = up (right), flat = down (left)."
  ],
  tips: [
    "Say it every lesson: 12 notes repeating. Master one octave, and you’ve secretly learned the whole keyboard."
  ],
  related: ["notes-sharps-flats", "tones-semitones", "intervals"],
  tools: ["keyboard"]
},
{
  id: "notes-sharps-flats",
  module: "foundations",
  title: "Note Names, Sharps & Flats",
  level: 1,
  mins: 40,
  summary: "Name every key, understand why one key can have two names, and why B–C and E–F have no black key.",
  theory: [
    "The musical alphabet has only 7 letters: <b>A B C D E F G</b>. After G it starts again at A. Each letter is a white key.",
    "A <b>sharp</b> (♯) raises a note by one half step (semitone). A <b>flat</b> (♭) lowers it by one half step. A <b>natural</b> (♮) cancels a sharp or flat.",
    "<b>Enharmonic</b> notes sound the same but are spelled differently: C♯ = D♭, F♯ = G♭, A♯ = B♭. Even white keys can have enharmonic names: E♯ = F, B♯ = C, F♭ = E, C♭ = B.",
    "Which name is correct depends on the key. In the key of D we say <b>F♯</b> (D E F♯ G A B C♯) — never G♭ — because every letter should appear once in a scale. In F major we say <b>B♭</b>, not A♯.",
    "<b>Why no black key between B–C and E–F?</b> The white keys were laid out to play the C major scale (W W H W W W H). The two half steps of that scale fall at E–F and B–C, so they need no key in between. All other neighbouring white keys are a whole step apart, so a black key fills the gap.",
    "<table><tr><th>Black key</th><th>Sharp name</th><th>Flat name</th></tr><tr><td>between C–D</td><td>C♯</td><td>D♭</td></tr><tr><td>between D–E</td><td>D♯</td><td>E♭</td></tr><tr><td>between F–G</td><td>F♯</td><td>G♭</td></tr><tr><td>between G–A</td><td>G♯</td><td>A♭</td></tr><tr><td>between A–B</td><td>A♯</td><td>B♭</td></tr></table>",
    "Rule of thumb: sharp keys (G, D, A, E, B) use sharp names; flat keys (F, B♭, E♭, A♭, D♭) use flat names. Gospel and worship music lives a lot in flat keys, so get comfortable with E♭, A♭ and D♭."
  ],
  application: [
    "Chord charts may say B♭ in one song and A♯ in another — same key on the piano. Don’t panic; it’s the same note.",
    "Singers often request flat keys (B♭, E♭, A♭). Knowing flat names makes you fast when the key changes.",
    "When reading the key signature, the sharps/flats apply to every octave of that note for the whole song."
  ],
  examples: [
    "C major: C D E F G A B — no sharps or flats.",
    "G major: G A B C D E F♯ — one sharp. F major: F G A B♭ C D E — one flat.",
    { melody: "C4 C#4 D4 D#4 E4 F4 F#4 G4 G#4 A4 A#4 B4 C5-", label: "Chromatic scale, sharp names (going up)" },
    { melody: "C5 B4 Bb4 A4 Ab4 G4 Gb4 F4 E4 Eb4 D4 Db4 C4-", label: "Chromatic scale, flat names (going down)" }
  ],
  exercises: [
    "Play every black key in one octave and say both names out loud.",
    "Teacher calls a name (e.g. “E♭”, “G♯”, “B♭”); student plays it in 2 octaves. 15 calls, aim for no mistakes.",
    "Play the chromatic scale from C to C with RH using fingering 1-3-1-3-1-2-3-1-3-1-3-1-2 (thumb on white keys, 3 on black). Then LH down.",
    "Find the enharmonic white keys: play E♯, B♯, F♭ and C♭ and say what white key each one is."
  ],
  assignment: "Write out the 12 notes of the chromatic scale twice — once with sharps going up, once with flats going down — then play both versions at 60 bpm, one note per beat.",
  mistakes: [
    "Thinking a black key is “only” a sharp or “only” a flat.",
    "Writing a scale with two of the same letter (e.g. G♭ and G in one scale) instead of using each letter once."
  ],
  tips: [
    "Sharp = higher, flat = lower. Picture a sharp pin poking you up, a flat tyre going down."
  ],
  related: ["piano-layout", "tones-semitones", "major-minor-scales"],
  tools: ["keyboard"]
},
{
  id: "tones-semitones",
  module: "foundations",
  title: "Tones, Semitones & Microtones",
  level: 1,
  mins: 50,
  summary: "Whole steps, half steps, and the hidden maths of pitch — from A = 440 Hz to quarter tones and shrutis.",
  theory: [
    "A <b>semitone</b> (half step, H) is the distance from any key to the very next key, black or white: C→C♯, E→F, B→C. A <b>tone</b> (whole step, W) is two semitones: C→D, E→F♯, B♭→C. These two units build every scale and chord.",
    "<b>Pitch is frequency.</b> The note A above Middle C (A4) is tuned to <b>440 Hz</b> (vibrations per second). Each semitone up multiplies the frequency by <b>2<sup>1/12</sup> ≈ 1.0595</b>. Twelve semitones = one octave = <b>×2</b>. So A5 = 880 Hz and A3 = 220 Hz.",
    "<table><tr><th>Note</th><th>Hz</th><th>Note</th><th>Hz</th></tr><tr><td>C4</td><td>261.63</td><td>F♯4</td><td>369.99</td></tr><tr><td>C♯4</td><td>277.18</td><td>G4</td><td>392.00</td></tr><tr><td>D4</td><td>293.66</td><td>G♯4</td><td>415.30</td></tr><tr><td>D♯4</td><td>311.13</td><td>A4</td><td>440.00</td></tr><tr><td>E4</td><td>329.63</td><td>A♯4</td><td>466.16</td></tr><tr><td>F4</td><td>349.23</td><td>B4</td><td>493.88</td></tr><tr><td></td><td></td><td>C5</td><td>523.25</td></tr></table>",
    "<b>Cents</b> measure tiny distances: 1 semitone = <b>100 cents</b>, 1 octave = 1200 cents. A tuner showing “−8” means you are 8 cents flat. Most listeners notice around 5–10 cents out of tune when notes are held together.",
    "<b>Equal temperament</b> (the modern piano) splits the octave into 12 exactly equal semitones, so every key sounds equally good — great for modulating. <b>Just intonation</b> uses pure whole-number ratios (5th = 3:2, major 3rd = 5:4). A just major 3rd is about 14 cents lower than a piano’s, which is why choirs and string players often sound “sweeter” than a keyboard on sustained chords.",
    "<b>The overtone series:</b> every note you hear is a stack of hidden pitches. Play C2 and you also get C3 (×2), G3 (×3), C4 (×4), E4 (×5), G4 (×6), a flat B♭4 (×7), C5 (×8)… This is why the octave, 5th and major 3rd sound so natural, and why the major triad feels like “home”.",
    "<b>Other tunings & microtones:</b><ul><li><b>A = 432 Hz</b> — popular online as “natural” tuning; there is no scientific evidence it is healing or better. A = 440 became the international standard in 1939/1955 (orchestras often use 441–443).</li><li><b>Microtones</b> are intervals smaller than a semitone. A <b>quarter tone</b> = 50 cents.</li><li><b>Arabic maqam</b> uses “neutral” notes roughly halfway between flat and natural (e.g. in maqam Rast).</li><li><b>Indian classical music</b> uses 22 <b>shrutis</b> per octave, from which the 7 swaras (Sa Re Ga Ma Pa Dha Ni) are chosen, with subtle shadings depending on the raga.</li></ul>",
    "A piano cannot play microtones, but singers, violins, guitar bends and pitch-bend wheels can. Understanding them helps you hear blues “blue notes” and the expressive slides of gospel singers."
  ],
  application: [
    "Every scale is a recipe of W and H steps — learn the steps and you can build any scale in any key.",
    "Pitch-bend on a keyboard slides through microtones — great for blues, gospel and synth leads.",
    "Bands tune to A = 440 Hz. If a backing track or old recording sounds “between keys”, it may be tuned slightly off (e.g. 432 or 445) — adjust the keyboard’s master tune.",
    "When singing with a choir on long chords, tuning thirds slightly lower (just intonation) makes harmonies ring."
  ],
  examples: [
    { melody: "C4 C#4 D4 D#4 E4 F4 F#4 G4-", label: "Semitones: every key, one after another" },
    { melody: "C4 D4 E4 F#4 G#4 A#4 C5-", label: "Whole steps only (whole-tone scale)" },
    "Semitones on white keys: E–F and B–C only.",
    "Frequency check: A4 440 Hz × 1.0595 ≈ 466.16 Hz (A♯4). 440 × 2 = 880 Hz (A5)."
  ],
  exercises: [
    "From any key, play a semitone up, then a tone up. Name both notes. Repeat from 10 different starting notes.",
    "Teacher plays two notes; student says “tone” or “semitone” by ear. 10 rounds.",
    "Build this pattern from C, then from G: W W H W W W H. Write the notes you land on.",
    "Use a tuner app while singing a held A. Try to stay within ±10 cents for 5 seconds.",
    "Hold the sustain pedal, strike C2 hard and listen: can you hear the G and E ringing above it? (overtones)"
  ],
  assignment: "Calculate (with a calculator) the frequencies of A4, B♭4, B4 and C5 starting from 440 Hz and multiplying by 1.0595 each time. Compare with the table. Then write one paragraph: why does the piano use equal temperament?",
  mistakes: [
    "Thinking a semitone always goes from white to black — E–F and B–C are white-to-white semitones.",
    "Believing A = 432 Hz is “more correct” — it’s a choice, not a law of nature."
  ],
  tips: [
    "Tone = skip one key. Semitone = the very next key. That’s all you need to start."
  ],
  related: ["piano-layout", "intervals", "major-minor-scales", "notes-sharps-flats"],
  tools: ["keyboard"]
},
{
  id: "rhythm-basics",
  module: "foundations",
  title: "Time Signatures & Note Values",
  level: 1,
  mins: 45,
  summary: "Count the beat, read note values and feel 4/4, 3/4 and 6/8 — with clapping and counting drills.",
  theory: [
    "<b>Beat</b> = the steady pulse you tap your foot to. <b>Tempo</b> = how fast the beat goes, measured in bpm (beats per minute). <b>Rhythm</b> = the pattern of long and short sounds over the beat.",
    "<b>Note values in 4/4:</b><table><tr><th>Note</th><th>Beats</th><th>Count</th></tr><tr><td>Whole note</td><td>4</td><td>1-2-3-4</td></tr><tr><td>Half note</td><td>2</td><td>1-2</td></tr><tr><td>Quarter note (crotchet)</td><td>1</td><td>1</td></tr><tr><td>Eighth note (quaver)</td><td>½</td><td>1-&amp;</td></tr><tr><td>Sixteenth note (semiquaver)</td><td>¼</td><td>1-e-&amp;-a</td></tr></table>Each note value has a matching <b>rest</b> (silence) of the same length.",
    "A <b>dot</b> adds half the note’s value: dotted half = 3 beats, dotted quarter = 1½ beats. A <b>tie</b> joins two notes into one longer sound.",
    "The <b>time signature</b> has two numbers. Top = how many beats per bar. Bottom = which note gets the beat (4 = quarter, 8 = eighth).<ul><li><b>4/4</b> — 4 beats per bar. Most pop, rock and worship songs.</li><li><b>3/4</b> — 3 beats, waltz feel (“ONE two three”). Many hymns: Amazing Grace, Great Is Thy Faithfulness.</li><li><b>6/8</b> — 6 eighth notes grouped 3+3, felt in 2 big beats with a rolling feel. Common in ballads and gospel.</li><li><b>2/4</b> — 2 beats, march feel.</li></ul>",
    "The first beat of each bar (the <b>downbeat</b>) is usually the strongest. In 4/4 beats 1 and 3 are strong, 2 and 4 weak — but in gospel and pop, the drums clap on <b>2 and 4</b> (the backbeat).",
    "<b>Bar lines</b> divide music into bars (measures). A <b>double bar</b> marks the end of a section."
  ],
  application: [
    "Every chord chart assumes you know how many beats each chord lasts — usually one chord per bar in 4/4 = 4 beats.",
    "Hymns in 3/4 must feel different from songs in 4/4. Playing a 3/4 hymn with a 4/4 pattern makes the congregation stumble.",
    "Playing with a band or click track requires steady time above everything else — a solid beat beats fancy notes.",
    "Counting out loud lets you start together: the leader says “1, 2, 3, 4” and the band comes in on the next 1."
  ],
  examples: [
    { melody: "C4 C4 G4 G4 A4 A4 G4- F4 F4 E4 E4 D4 D4 C4-", label: "Twinkle Twinkle — quarter notes ending each line with a half note (4/4)" },
    { melody: "G3 C4- E4 C4 E4- D4 C4- A3 G3-", label: "Amazing Grace opening — feel the 3/4 lilt", note: "Count 1-2-3 per bar" },
    "Clap pattern A (4/4): ta ta ta ta | ta-a ta-a | ta-a-a-a | ti-ti ti-ti ta ta",
    "6/8 count: ONE two three FOUR five six — two big beats per bar."
  ],
  exercises: [
    "Set the metronome to 70 bpm. Clap on every beat and count “1 2 3 4” aloud for 8 bars.",
    "Keep counting 1-2-3-4 and clap only: whole notes (on 1), then half notes (1 and 3), then quarters, then eighths (“1 & 2 &”). 4 bars each.",
    "Clap on 2 and 4 only (backbeat) while counting at 80 bpm. Then play a C chord on 1 with LH and clap 2 and 4.",
    "3/4: play C on beat 1 with LH and a C chord on 2 and 3 with RH (“boom-chick-chick”) at 90 bpm for 16 bars.",
    "6/8: tap 1-2-3-4-5-6 with accents on 1 and 4. Then play a broken C chord C-E-G-C-G-E, one note per eighth, at 60 bpm (dotted quarter)."
  ],
  assignment: "Write 4 bars of your own rhythm in 4/4 using at least one whole, half, quarter and pair of eighth notes, plus one rest. Clap it in time at 80 bpm with the metronome, counting aloud, without stopping.",
  mistakes: [
    "Speeding up on easy parts and slowing on hard ones — practise slow enough to stay steady.",
    "Not counting rests — silence has a length too.",
    "Feeling 6/8 as six even beats instead of two rolling groups."
  ],
  tips: [
    "Count out loud. If you can’t say it, you can’t play it.",
    "Practise with the metronome on 2 and 4 to build a gospel/pop groove."
  ],
  related: ["piano-layout", "finger-exercises", "lh-accompaniment"],
  tools: ["metronome"]
},
{
  id: "intervals",
  module: "foundations",
  title: "Understanding Intervals",
  level: 1,
  mins: 50,
  summary: "Measure the distance between two notes, name it, and hear its character using songs you already know.",
  theory: [
    "An <b>interval</b> is the distance between two notes, counted in semitones. <b>Melodic</b> = one after another; <b>harmonic</b> = played together.",
    "Every interval has a <b>number</b> (count the letter names, including both ends: C to E = C-D-E = 3rd) and a <b>quality</b>: Perfect, Major, Minor, Augmented, Diminished.",
    "<table><tr><th>Semitones</th><th>Interval</th><th>From C</th><th>Character</th><th>Remember it with</th></tr><tr><td>0</td><td>Unison</td><td>C–C</td><td>same</td><td>—</td></tr><tr><td>1</td><td>Minor 2nd</td><td>C–D♭</td><td>tense, crunchy</td><td>Jaws theme</td></tr><tr><td>2</td><td>Major 2nd</td><td>C–D</td><td>stepwise, open</td><td>Silent Night, Happy Birthday</td></tr><tr><td>3</td><td>Minor 3rd</td><td>C–E♭</td><td>sad, tender</td><td>Greensleeves</td></tr><tr><td>4</td><td>Major 3rd</td><td>C–E</td><td>bright, happy</td><td>When the Saints Go Marching In</td></tr><tr><td>5</td><td>Perfect 4th</td><td>C–F</td><td>strong, rising</td><td>Amazing Grace, Here Comes the Bride</td></tr><tr><td>6</td><td>Tritone (aug 4th / dim 5th)</td><td>C–F♯/G♭</td><td>unstable, mysterious</td><td>Maria (West Side Story), The Simpsons</td></tr><tr><td>7</td><td>Perfect 5th</td><td>C–G</td><td>open, powerful</td><td>Twinkle Twinkle</td></tr><tr><td>8</td><td>Minor 6th</td><td>C–A♭</td><td>bittersweet</td><td>The Entertainer (E up to C)</td></tr><tr><td>9</td><td>Major 6th</td><td>C–A</td><td>warm, singing</td><td>My Bonnie Lies Over the Ocean</td></tr><tr><td>10</td><td>Minor 7th</td><td>C–B♭</td><td>bluesy, wants to move</td><td>Somewhere (West Side Story)</td></tr><tr><td>11</td><td>Major 7th</td><td>C–B</td><td>dreamy, sharp</td><td>Take On Me (chorus leap)</td></tr><tr><td>12</td><td>Octave</td><td>C–C</td><td>same note, higher</td><td>Somewhere Over the Rainbow</td></tr></table>",
    "<b>Perfect</b> intervals: unison, 4th, 5th, octave. <b>Major/minor</b>: 2nds, 3rds, 6ths, 7ths. Make a major interval one semitone smaller → minor. Make a perfect or major interval one semitone bigger → augmented; a perfect or minor one smaller → diminished.",
    "<b>Consonant</b> (stable): unison, octave, 5th, 4th, 3rds, 6ths. <b>Dissonant</b> (tense): 2nds, 7ths, tritone. Dissonance isn’t bad — it creates movement that wants to resolve.",
    "<b>Inversion trick:</b> flip an interval and the numbers add to 9; major ↔ minor, perfect stays perfect. A major 3rd (C up to E) inverted is a minor 6th (E up to C)."
  ],
  application: [
    "Chords are stacks of intervals: major triad = major 3rd + minor 3rd. Knowing intervals = knowing chords.",
    "Playing by ear: recognise the jump in a melody (“that’s a 4th”) and you can find it on the keys without searching.",
    "Harmonising a melody in 3rds or 6ths below gives instant sweet two-part harmony for RH fills.",
    "Octaves and 5ths in the LH give a strong, full bass on piano without muddiness."
  ],
  examples: [
    { melody: "C4 D4 C4 E4 C4 F4 C4 G4 C4 A4 C4 B4 C4 C5-", label: "Intervals from C: 2nd, 3rd, 4th, 5th, 6th, 7th, octave" },
    { melody: "G3 C4- E4 C4 E4- D4", label: "Amazing Grace — opens with a perfect 4th (G up to C)" },
    { melody: "C4 C4 G4 G4 A4 A4 G4-", label: "Twinkle Twinkle — perfect 5th (C to G)" },
    { melody: "G3 C4 E4-", label: "Saints-style leap: 4th then major 3rd" }
  ],
  exercises: [
    "Play all 12 intervals up from C, saying the name and the semitone count. Then from G and from F.",
    "Teacher names an interval and a starting note (“minor 3rd up from D”); student plays it. 10 rounds.",
    "Ear: teacher plays an interval harmonically; student says major 3rd, minor 3rd, perfect 5th or octave. Add more intervals as the student improves.",
    "Sing (or hum) each interval from your memory song, then find it on the piano from 3 different notes.",
    "Play the C major scale in parallel 3rds with RH (C+E, D+F, E+G…) then in 6ths (E+C, F+D…)."
  ],
  assignment: "Make your own interval chart: for each of the 12 intervals write one song (hymn, worship song or folk tune) that helps YOU remember it. Be ready to sing and play each one from a note your teacher chooses.",
  mistakes: [
    "Counting semitones but forgetting to count the letters — C to D♯ (aug 2nd) and C to E♭ (minor 3rd) sound the same but are spelled differently.",
    "Not counting the starting note when finding the interval number."
  ],
  tips: [
    "Learn 3rds and 5ths first. They build every chord you will play in your first year."
  ],
  related: ["tones-semitones", "triads", "scale-degrees", "major-minor-scales"],
  tools: ["keyboard"]
},
{
  id: "major-minor-scales",
  module: "foundations",
  title: "Major & Minor Scales",
  level: 1,
  mins: 50,
  summary: "Play major and minor scales by ear and feel first, then learn the formulas and fingerings that unlock every key.",
  theory: [
    "<b>Without theory first:</b> beginners should <i>hear</i> scales before naming them. Play C to C on white keys only — that’s C major, it sounds happy and complete. Play A to A on white keys only — that’s A minor, it sounds sad and reflective. Same keys, different home note, different feeling.",
    "<b>Major scale formula: W – W – H – W – W – W – H</b> (W = whole step, H = half step). From C: C D E F G A B C. From G: G A B C D E F♯ G. From F: F G A B♭ C D E F.",
    "<b>Natural minor: W – H – W – W – H – W – W.</b> From A: A B C D E F G A. Every major key has a <b>relative minor</b> that shares its notes, starting on the 6th note (C major ↔ A minor, G major ↔ E minor, F major ↔ D minor).",
    "<b>Harmonic minor</b> raises the 7th: A B C D E F G♯ A. The step F→G♯ (3 semitones) gives an exotic, Middle-Eastern flavour and creates a major V chord (E) that pulls strongly home.",
    "<b>Melodic minor</b> raises the 6th and 7th going up (A B C D E F♯ G♯ A) and, in classical style, returns to natural minor coming down. In jazz it stays raised both ways.",
    "<b>Fingerings (one octave):</b><table><tr><th>Scale</th><th>RH</th><th>LH</th></tr><tr><td>C, G, D, A, E major</td><td>1 2 3 1 2 3 4 5</td><td>5 4 3 2 1 3 2 1</td></tr><tr><td>F major</td><td>1 2 3 4 1 2 3 4</td><td>5 4 3 2 1 3 2 1</td></tr><tr><td>A, E, D minor</td><td>1 2 3 1 2 3 4 5</td><td>5 4 3 2 1 3 2 1</td></tr></table>The thumb passes <i>under</i> going up (RH) and the 3rd finger crosses <i>over</i> coming down."
  ],
  application: [
    "The scale of the song’s key tells you which notes “belong” — melodies, fills and chords come from it.",
    "Worship songs are mostly major; minor keys bring lament, intimacy or drama. Recognising which one a song uses tells you its chord family.",
    "Fills and runs in church are often just scale fragments played smoothly — good fingering makes them clean.",
    "Harmonic minor’s raised 7th gives the strong V→i pull heard in many minor gospel songs and hymns."
  ],
  examples: [
    { melody: "C4 D4 E4 F4 G4 A4 B4 C5-", label: "C major — W W H W W W H" },
    { melody: "A3 B3 C4 D4 E4 F4 G4 A4-", label: "A natural minor" },
    { melody: "A3 B3 C4 D4 E4 F4 G#4 A4-", label: "A harmonic minor (raised 7th)" },
    { melody: "A3 B3 C4 D4 E4 F#4 G#4 A4 G4 F4 E4 D4 C4 B3 A3-", label: "A melodic minor up, natural minor down" },
    { melody: "F4 G4 A4 Bb4 C5 D5 E5 F5-", label: "F major (RH 1234 1234)" }
  ],
  exercises: [
    "Ear first: play white keys C→C and A→A. Describe each in one word. Then try D→D and G→G and describe them too.",
    "RH C major, one octave, 60 bpm, one note per beat, 4 times without a mistake. Then LH. Then hands together.",
    "Build G and F major using W W H W W W H — say each step out loud as you play.",
    "Play A natural, harmonic and melodic minor back to back at 60 bpm. Name what changed each time.",
    "Two octaves: C, G and F major hands together at 70 bpm, then eighth notes at 60 bpm."
  ],
  assignment: "Play C, G and F major and A, E and D natural minor, hands separately, one octave, at 72 bpm with correct fingering. Then write each scale’s notes and its relative major/minor.",
  mistakes: [
    "Running out of fingers because the thumb didn’t pass under at the right place.",
    "Forgetting the sharp/flat (F♯ in G, B♭ in F) — say the black key out loud as you play it.",
    "Rushing the thumb crossing so the scale sounds bumpy."
  ],
  tips: [
    "Hear it, play it, then name it. Theory explains what your ears already know.",
    "Practise scales with the metronome on 2 and 4 to feel groove, not just speed."
  ],
  related: ["tones-semitones", "scale-degrees", "finger-exercises", "triads"],
  tools: ["keyboard"]
},
{
  id: "scale-degrees",
  module: "foundations",
  title: "Scale Degrees",
  level: 1,
  mins: 40,
  summary: "Number and name every note of the scale — and feel the job each one does.",
  theory: [
    "Each note of a scale gets a number (<b>scale degree</b>) from 1 to 7. In C major: C=1, D=2, E=3, F=4, G=5, A=6, B=7. In G major: G=1, A=2, B=3, C=4, D=5, E=6, F♯=7. Numbers work in every key — that’s their power.",
    "<table><tr><th>Degree</th><th>Name</th><th>In C</th><th>Feel</th></tr><tr><td>1</td><td>Tonic</td><td>C</td><td>home, rest, “amen”</td></tr><tr><td>2</td><td>Supertonic</td><td>D</td><td>moving, passing, wants to fall to 1 or rise to 3</td></tr><tr><td>3</td><td>Mediant</td><td>E</td><td>sweet, stable; decides major vs minor</td></tr><tr><td>4</td><td>Subdominant</td><td>F</td><td>lifting away, hopeful; leans down to 3</td></tr><tr><td>5</td><td>Dominant</td><td>G</td><td>strong, confident; second home</td></tr><tr><td>6</td><td>Submediant</td><td>A</td><td>tender, emotional, slightly sad</td></tr><tr><td>7</td><td>Leading tone</td><td>B</td><td>tense, pulls up strongly to 1</td></tr></table>",
    "In natural minor the 7th is a whole step below the tonic and is called the <b>subtonic</b> (G in A minor). Raise it (G♯) and it becomes a leading tone again.",
    "<b>Stable</b> degrees: 1, 3, 5 (the tonic chord). <b>Active</b> degrees: 2, 4, 6, 7 — they want to move: 7→1, 4→3, 2→1, 6→5.",
    "Solfège matches the degrees: Do Re Mi Fa Sol La Ti Do. Many choirs and Indian (Sa Re Ga Ma Pa Dha Ni) and African church traditions teach this way.",
    "Scale degrees are the root of the <b>Nashville Number System</b>: chords named 1, 4, 5, 6m instead of letters, so a band can change key instantly."
  ],
  application: [
    "Worship leaders say “go to the 4” or “stay on the 1” — that’s scale degrees.",
    "Knowing the tonic lets you find the key of a song by ear: find the note that feels like home.",
    "Melodies often end on 1 and phrases breathe on 5 or 3. Spotting these helps you play by ear.",
    "Fills that walk 7→1 or 4→3 sound natural because they follow the pull of the degrees."
  ],
  examples: [
    { melody: "C4 D4 E4 F4 G4 A4 B4 C5-", label: "Degrees 1 to 8 (1) in C" },
    { melody: "G4 A4 B4 C5-", label: "5-6-7-1: the leading tone pulling home" },
    { melody: "E4 D4 C4-", label: "3-2-1: the most common melodic ending" },
    { melody: "C4 E4 G4 C5 B4 C5-", label: "1-3-5-8, then 7 resolving to 8" }
  ],
  exercises: [
    "Play C major and say the numbers instead of letters. Then G major and F major, still saying numbers.",
    "Teacher calls numbers in a key (“in G: 1, 5, 6, 4”); student plays them. 10 rounds, then change key.",
    "Play degree 7 and stop. Notice the urge to resolve. Then resolve to 1. Do the same with 4→3 and 2→1.",
    "Sing Do Re Mi up and down while playing. Then sing degree numbers for “Mary had a little lamb” (3 2 1 2 3 3 3)."
  ],
  assignment: "Pick a simple song (e.g. Amazing Grace or Twinkle Twinkle) and write its melody in scale-degree numbers. Then play it in C, G and F using only the numbers.",
  mistakes: [
    "Numbering from C in every key — degree 1 is always the key note.",
    "Forgetting the sharps/flats of the key when counting degrees (7 in G is F♯, not F)."
  ],
  tips: [
    "Think in numbers, play in letters. Numbers travel to every key; letters don’t."
  ],
  related: ["major-minor-scales", "intervals", "chord-families", "nashville"],
  tools: ["keyboard"]
}
);
