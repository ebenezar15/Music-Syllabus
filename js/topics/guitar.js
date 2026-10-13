/* Acoustic Guitar · Beginner topics */
(window.TOPICS = window.TOPICS || []).push(
{
  id: "guitar-basics",
  module: "guitar",
  title: "Basics of the Acoustic Guitar",
  level: 1,
  mins: 45,
  summary: "Get to know your guitar: its parts, standard tuning, how to tune it, and how to sit and fret comfortably.",
  theory: [
    "<b>Parts of the guitar:</b> <ul><li><b>Headstock</b> with <b>tuning pegs</b> (machine heads)</li><li><b>Nut</b> – the slotted strip where the strings leave the headstock</li><li><b>Neck</b> and <b>fretboard</b> with metal <b>frets</b> and position dots (3, 5, 7, 9, 12)</li><li><b>Body</b> with <b>sound hole</b>, <b>pickguard</b>, <b>bridge</b> and <b>saddle</b></li></ul>",
    "<b>Standard tuning</b>, from the thickest string (6th, nearest your face) to the thinnest (1st, nearest the floor): <code>E A D G B E</code>. Memory line: <i>Eddie Ate Dynamite, Good Bye Eddie</i>.",
    "String numbers run the other way: the high E is <b>string 1</b>, the low E is <b>string 6</b>. Chord charts in this course are written low E → high E, e.g. <code>G: 3 2 0 0 0 3</code> (x = don't play that string, 0 = open).",
    "<b>Tuning methods:</b><ul><li><b>Clip-on or app tuner</b> – the fastest and most accurate; tune each string until the needle is centred.</li><li><b>5th-fret method</b> – fret the 5th fret of a string to match the next open string (6→5, 5→4, 4→3), but use the <b>4th fret</b> on the G string to tune the B string, then 5th fret again for B→high E.</li><li><b>By ear to a keyboard</b> – match E2 A2 D3 G3 B3 E4.</li></ul> Always tune <i>up</i> to the note: if you are sharp, drop below and come back up.",
    "<b>Posture:</b> sit upright, guitar waist resting on the right thigh (left thigh for classical position), body tilted back only slightly so you can see the fretboard without hunching. Shoulders relaxed, neck angled a little upward.",
    "<b>Fretting hand:</b> thumb behind the neck roughly opposite the 2nd finger, fingertips arched and pressing just <i>behind</i> the fret wire (not on top of it). Fingers are numbered 1 (index) to 4 (pinky).",
    "<b>String care:</b> wash hands before playing, wipe strings after, store the guitar away from heaters and damp. Change strings every 2–3 months of regular playing (sooner if they sound dull or look discoloured). Most acoustic beginners do well on <b>light gauge (.012)</b> or <b>extra-light (.010)</b> strings."
  ],
  application: [
    "In a worship team you must be in tune with the keys and bass before every rehearsal and between songs – a clip-on tuner on the headstock is non-negotiable.",
    "Good posture lets you play a 30–45 minute service set without pain in the wrist, back or shoulder.",
    "Knowing the parts helps you talk to the sound team (\"my pickup jack is crackling\") and to a repair shop (\"the action at the 12th fret is high\").",
    "Clean, fresh strings sound brighter and stay in tune better through a whole service."
  ],
  examples: [
    "Open strings, low to high: E2 A2 D3 G3 B3 E4 – the low E is two octaves below the high E.",
    { melody: "E3 A3 D4 G4 B4 E5-", label: "The six open strings (sounding an octave lower on guitar)", note: "Guitar music is written an octave higher than it sounds." },
    "First chord shape: <code>Em: 0 2 2 0 0 0</code> – fingers 2 and 3 on the 2nd fret of the A and D strings, strum all six.",
    { prog: "Em", label: "Your first chord – strum it four times per bar", fixed: true }
  ],
  exercises: [
    "Name every part of the guitar while pointing to it, without looking at notes.",
    "Tune all six strings with a tuner, then deliberately detune one string and fix it by ear using the 5th-fret method.",
    "Sit in correct posture for 5 minutes, plucking each open string 4 times slowly (60 bpm) while saying its name.",
    "Fret the 1st, 2nd, 3rd and 4th frets on each string with fingers 1–2–3–4 and check each note rings clearly (no buzz).",
    "Play Em, lift the fingers off completely and put them back 20 times in a row."
  ],
  assignment: "Record a 1-minute video: name the strings, tune the guitar from scratch with a tuner, then strum Em four times with good posture.",
  mistakes: [
    "Pressing on top of the fret wire or too far back, causing buzz.",
    "Squeezing the neck with the thumb – it should guide, not clamp.",
    "Leaning over the guitar to look at the fretboard and rounding the back."
  ],
  tips: [
    "Keep fingernails on the fretting hand short – long nails make clean notes impossible.",
    "Sore fingertips in the first two weeks are normal. Practise 10–15 minutes several times a day rather than one long session."
  ],
  related: ["guitar-theory", "guitar-pick", "piano-layout"]
},
{
  id: "guitar-theory",
  module: "guitar",
  title: "Basic Music Theory for Guitarists",
  level: 1,
  mins: 50,
  summary: "Notes, frets as half steps, the major scale shape, and how chords, Nashville numbers and the capo all fit together.",
  theory: [
    "<b>The musical alphabet</b> has 7 natural notes: <code>A B C D E F G</code>, then it repeats. Between most pairs there is a sharp/flat (A♯/B♭, C♯/D♭, D♯/E♭, F♯/G♭, G♯/A♭). There is <b>no</b> sharp between <b>B–C</b> and <b>E–F</b>. That gives 12 notes in total.",
    "<b>One fret = one half step (semitone). Two frets = one whole step (tone).</b> So on the guitar, theory is geometry: E string open = E, fret 1 = F, fret 3 = G, fret 5 = A.",
    "<b>The major scale</b> formula is <b>W W H W W W H</b>. On one string that is frets <code>0 2 4 5 7 9 11 12</code>. A two-octave G major shape: low E <code>3 5</code> · A <code>2 3 5</code> · D <code>2 4 5</code> · G <code>2 4 5</code> · B <code>3 5</code> · high E <code>2 3</code> = G A B C D E F♯ G A B C D E F♯ G.",
    "<b>Chords from the scale:</b> stack every other note of the scale and you get the chord family: <b>1 major, 2 minor, 3 minor, 4 major, 5 major, 6 minor, 7 diminished</b>. In G: G Am Bm C D Em F♯°. In C: C Dm Em F G Am B°.",
    "<b>Nashville numbers</b> name chords by scale degree instead of letter: 1 4 5 in G = G C D; in D = D G A. A chart written as <code>1 5 6m 4</code> works in every key – exactly how many worship teams write their charts.",
    "<b>The capo</b> raises every string by the number of frets it is clamped on. You keep playing the same shapes, but the sound moves up. Sounding key = shape key + capo frets. G shapes with capo 2 = A; capo 3 = B♭; capo 4 = B; capo 5 = C.",
    "<table><tr><th>Capo</th><th>G shapes</th><th>C shapes</th><th>D shapes</th></tr><tr><td>1</td><td>A♭</td><td>D♭</td><td>E♭</td></tr><tr><td>2</td><td>A</td><td>D</td><td>E</td></tr><tr><td>3</td><td>B♭</td><td>E♭</td><td>F</td></tr><tr><td>4</td><td>B</td><td>E</td><td>F♯</td></tr></table>"
  ],
  application: [
    "When the worship leader says \"This song is in B♭\", you can answer \"capo 3, G shapes\" in seconds.",
    "Reading Nashville-number charts lets you follow the band even when the key changes at the last minute.",
    "Knowing the chord family tells you which chords are likely to come next in a song you have never heard.",
    "Scale shapes give you simple melodic fills between vocal lines."
  ],
  examples: [
    { prog: "C F G C", label: "1 – 4 – 5 – 1", note: "The most common three chords in the key." },
    { prog: "C G Am F", label: "1 – 5 – 6m – 4", note: "The classic pop / worship loop." },
    { prog: "G C D Em", label: "Open-chord key of G: 1 – 4 – 5 – 6m", fixed: true, note: "Same loop guitarists use with a capo in many keys." },
    { melody: "G3 A3 B3 C4 D4 E4 F#4 G4-", label: "G major scale (one octave)" },
    "Chord shapes used here: <code>G: 3 2 0 0 0 3</code> · <code>C: x 3 2 0 1 0</code> · <code>D: x x 0 2 3 2</code> · <code>Em: 0 2 2 0 0 0</code> · <code>Am: x 0 2 2 1 0</code>."
  ],
  exercises: [
    "Say the 12 notes from E up to E while playing frets 0–12 on the low E string.",
    "Play the major scale on one string (frets 0 2 4 5 7 9 11 12) on each of the six strings, naming the scale you are playing.",
    "Play the two-octave G major shape up and down at 60 bpm, one note per click, then 80 bpm.",
    "Write the chord families of G, C and D, then play the 1, 4 and 5 chords of each.",
    "With a capo, play G–C–D at capo 2, 3 and 4 and say the sounding chord names aloud."
  ],
  assignment: "Pick a worship song chart, rewrite it in Nashville numbers, then play it in two different keys using a capo.",
  mistakes: [
    "Forgetting there is no sharp between B–C and E–F.",
    "Naming capo chords by the sounding key when the band needs the shapes, or vice-versa – always say both: \"capo 2, G shapes, sounding A\"."
  ],
  tips: [
    "Tape a small capo chart inside your guitar case until it becomes automatic."
  ],
  related: ["tones-semitones", "major-minor-scales", "chord-families", "nashville", "guitar-fretboard"]
},
{
  id: "guitar-fretboard",
  module: "guitar",
  title: "Learning the Fretboard",
  level: 2,
  mins: 50,
  summary: "Map the notes on the E and A strings, use octave shapes to find any note, and explore 4ths, 5ths and 6ths double stops.",
  theory: [
    "<b>Low E string (6th):</b> <code>E(0) F(1) F♯(2) G(3) G♯(4) A(5) A♯(6) B(7) C(8) C♯(9) D(10) D♯(11) E(12)</code>.<br><b>A string (5th):</b> <code>A(0) A♯(1) B(2) C(3) C♯(4) D(5) D♯(6) E(7) F(8) F♯(9) G(10) G♯(11) A(12)</code>.",
    "<b>Natural notes only</b> – learn these first:<ul><li>E string: E 0 · F 1 · G 3 · A 5 · B 7 · C 8 · D 10 · E 12</li><li>A string: A 0 · B 2 · C 3 · D 5 · E 7 · F 8 · G 10 · A 12</li></ul> The 12th fret repeats the open string an octave higher.",
    "<b>Octave shapes</b> let you find any note from the two bass strings:<ul><li>Root on <b>low E</b> → same note two strings up (D string), <b>2 frets higher</b>.</li><li>Root on <b>A</b> → G string, 2 frets higher.</li><li>Root on <b>D</b> → B string, <b>3</b> frets higher (the B string shifts everything by one).</li><li>Root on <b>G</b> → high E, 3 frets higher.</li></ul>",
    "<b>Fretboard chart</b> (frets 0–5, strings low → high):<table><tr><th>Fret</th><th>E</th><th>A</th><th>D</th><th>G</th><th>B</th><th>e</th></tr><tr><td>0</td><td>E</td><td>A</td><td>D</td><td>G</td><td>B</td><td>E</td></tr><tr><td>1</td><td>F</td><td>A♯/B♭</td><td>D♯/E♭</td><td>G♯/A♭</td><td>C</td><td>F</td></tr><tr><td>2</td><td>F♯/G♭</td><td>B</td><td>E</td><td>A</td><td>C♯/D♭</td><td>F♯/G♭</td></tr><tr><td>3</td><td>G</td><td>C</td><td>F</td><td>A♯/B♭</td><td>D</td><td>G</td></tr><tr><td>4</td><td>G♯/A♭</td><td>C♯/D♭</td><td>F♯/G♭</td><td>B</td><td>D♯/E♭</td><td>G♯/A♭</td></tr><tr><td>5</td><td>A</td><td>D</td><td>G</td><td>C</td><td>E</td><td>A</td></tr></table>",
    "<b>Double stops – 4ths:</b> two adjacent strings at the <b>same fret</b> are a perfect 4th (E–A, A–D, D–G, B–E). On the G–B pair, move the B-string note <b>1 fret higher</b>.",
    "<b>Double stops – 5ths:</b> the two-note power-chord shape – lower string at fret n, next string up at <b>n+2</b> (e.g. A string 3 + D string 5 = C–G). On the G–B pair use <b>n+3</b>.",
    "<b>Double stops – 6ths:</b> skip a string. On the <b>G & high E</b> or <b>D & B</b> pairs, the <b>same fret</b> is a <b>major 6th</b> (open G + open E = G–E); move the top note <b>1 fret lower</b> for a <b>minor 6th</b>. Walking 6ths up the scale is a classic soul / gospel sound."
  ],
  application: [
    "When a chart says \"F♯m\" or \"B♭\", you can find the root on the E or A string instantly for a barre chord.",
    "Octave shapes are perfect for simple, tasteful lead lines in worship – the same melody played in octaves cuts through without clutter.",
    "6ths and 4ths double stops make beautiful fills on slow songs and intros, especially when the keys player is holding pads.",
    "Knowing the fretboard is the foundation for the CAGED system and moving chords up the neck."
  ],
  examples: [
    "Find C three ways: A string fret 3, low E fret 8, G string fret 5.",
    "4ths in C on the B & high E strings: frets 1–1 (C–F), 3–3 (D–G), 5–5 (E–A) – slide between them for a gentle fill.",
    "6ths in C on the G & high E strings: G 4 + e 3 (B–G, minor 6th), G 5 + e 5 (C–A, major 6th), G 7 + e 7 (D–B, major 6th), G 9 + e 8 (E–C, minor 6th).",
    { melody: "E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4- D4 D4-", label: "Ode to Joy – find it on one string, then in octaves", note: "Public-domain melody (Beethoven)." },
    { prog: "C5 F5 G5 C5", label: "5ths (power chords) on the low strings" }
  ],
  exercises: [
    "Say and play every natural note on the low E string, up and down, at 60 bpm.",
    "Same on the A string. Then have a partner call random notes; find each on both strings within 3 seconds.",
    "Play each natural note on the low E string, then its octave on the D string (+2 frets).",
    "Play 4ths on the D & G strings up the C major scale (C–F, D–G, E–A …) one per beat.",
    "Play 6ths on the G & high E strings up the C major scale, choosing major or minor 6th to stay in the key."
  ],
  assignment: "Draw your own fretboard chart for frets 0–12 on all six strings from memory, then play a C major scale using only 6ths double stops.",
  mistakes: [
    "Forgetting the B-string shift (+1 fret) for octaves and double stops.",
    "Trying to memorise every note at once – learn the E and A strings first, naturals first."
  ],
  tips: [
    "Use the position dots: on the E string, fret 3 = G, 5 = A, 7 = B, 12 = E. Build from those landmarks."
  ],
  related: ["guitar-theory", "guitar-caged", "double-stops", "intervals", "notes-sharps-flats"]
},
{
  id: "guitar-time",
  module: "guitar",
  title: "Time Signatures & Rhythm on Guitar",
  level: 1,
  mins: 40,
  summary: "Count and strum in 4/4, 3/4 and 6/8 so your guitar locks in with the band.",
  theory: [
    "A <b>time signature</b> has two numbers: the top tells you <b>how many beats</b> in each bar; the bottom tells you <b>which note gets the beat</b> (4 = quarter note, 8 = eighth note).",
    "<b>4/4</b> (common time): count <code>1 2 3 4</code>. Most worship and pop songs. Strum down on each beat: <code>D D D D</code>. Add up-strums on the \"and\": <code>1 & 2 & 3 & 4 &</code> = <code>D U D U D U D U</code>.",
    "<b>3/4</b> (waltz time): count <code>1 2 3</code>, accent on 1. Many hymns (e.g. Amazing Grace). Basic strum: <code>D D D</code> or bass note on 1 then <code>D D</code> (bass–strum–strum).",
    "<b>6/8</b>: six eighth notes per bar, felt in <b>two big beats</b>: <code>1 2 3 4 5 6</code> with accents on 1 and 4. Strum <code>D D U D D U</code> or <code>D – U D – U</code>.",
    "<b>The strumming hand never stops:</b> it moves down on the beat and up on the \"and\", like a pendulum, whether or not it hits the strings. This is how you keep perfect time.",
    "<b>Tempo</b> is measured in <b>bpm</b> (beats per minute). Slow worship ballads sit around 60–75 bpm, mid-tempo songs 90–110 bpm, upbeat praise 120–140 bpm."
  ],
  application: [
    "Watch the drummer's hi-hat and the bass player – your strum should match the main pulse they are playing.",
    "Recognising 6/8 versus 3/4 stops you strumming the wrong feel on songs like slow 6/8 ballads.",
    "Hymns in 3/4 sound best with a gentle bass–strum–strum pattern.",
    "Many worship teams play to a click track – practising with a metronome prepares you for in-ear monitors."
  ],
  examples: [
    { prog: "C | F | G | C", label: "4/4: four down-strums per bar" },
    { prog: "C | C | F | C | G | G | C | C", label: "3/4 hymn feel: bass–strum–strum", note: "Count 1 2 3 on each bar." },
    { prog: "C | Am | F | G", label: "6/8 feel: D D U D D U", note: "Feel two big beats per bar." },
    { melody: "D4 G4- B4 G4 B4- A4 G4- E4 D4--", label: "Amazing Grace opening (3/4)", note: "Public-domain hymn – count 1 2 3 while you hum it." }
  ],
  exercises: [
    "With the metronome at 60 bpm, count \"1 2 3 4\" aloud and strum down on every click for 2 minutes on an Em chord.",
    "Same tempo, add up-strums on the \"&\" (D U D U D U D U). Keep the hand moving even when you miss.",
    "Switch to 3/4: bass note on 1, two down-strums on 2 and 3, on C and G. 8 bars each.",
    "Try 6/8 at 50 bpm (one click = one eighth note) – then set the metronome to the dotted quarter (2 clicks per bar).",
    "Change between C and G every bar in 4/4 at 70 bpm without stopping the strumming hand."
  ],
  assignment: "Play Amazing Grace (3/4) and one 4/4 worship song of your choice with a metronome, counting aloud for the first verse.",
  mistakes: [
    "Stopping the strumming hand to change chords – keep the pendulum moving and let the last \"&\" be an open-string up-strum if needed.",
    "Rushing the up-strums so they sound late or crushed against the next down-strum."
  ],
  tips: [
    "Tap your foot on the beat. If your foot stops, your time has stopped."
  ],
  related: ["rhythm-basics", "guitar-strumming", "syncopation-groove"],
  tools: ["metronome"]
},
{
  id: "guitar-pick",
  module: "guitar",
  title: "How to Hold a Pick",
  level: 1,
  mins: 30,
  summary: "Grip the pick properly, choose the right thickness, and build clean alternate picking.",
  theory: [
    "<b>The grip:</b> curl your index finger, lay the pick on the side of the top joint, and place the thumb flat on top. Only about <b>2–3 mm</b> of the tip should stick out, pointing roughly at right angles to the thumb.",
    "<b>Pressure:</b> firm enough that the pick doesn't spin or drop, loose enough to let it flex slightly. Hold it more loosely for strumming and a little more firmly for single notes.",
    "<b>Angle:</b> tilt the pick slightly (about 10–30°) so it glides through the strings instead of hitting them flat. This gives a smoother, less scratchy tone.",
    "<b>Pick thickness:</b><ul><li><b>Thin (0.38–0.60 mm)</b> – bright, easy, forgiving strumming.</li><li><b>Medium (0.60–0.80 mm)</b> – the all-rounder most acoustic players use.</li><li><b>Heavy (0.80 mm +)</b> – more control and volume for single notes and lead lines.</li></ul>",
    "<b>Motion:</b> for strumming, move from the elbow and a loose wrist (like shaking water off your hand). For single notes, the movement is small and comes mainly from the wrist.",
    "<b>Alternate picking</b> = down (<code>⊓</code>) and up (<code>V</code>) strokes in strict alternation: D U D U. It doubles your speed and keeps your timing even."
  ],
  application: [
    "Medium picks give a balanced strum that sits well with keys and acoustic drums in a worship band.",
    "Alternate picking lets you play melody lines, intros and riffs cleanly.",
    "A relaxed grip prevents fatigue across a long service or rehearsal."
  ],
  examples: [
    "Alternate picking on the open high E: 4 downs + 4 ups as D U D U D U D U at 60 bpm.",
    { melody: "C4 D4 E4 F4 G4 A4 B4 C5-", label: "C major scale – pick D U D U", note: "Start each new string on a down-stroke at first." },
    { melody: "E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4- D4 D4-", label: "Ode to Joy with alternate picking" }
  ],
  exercises: [
    "Hold the pick correctly and strum muted strings D U D U for 2 minutes at 70 bpm, checking the pick doesn't twist.",
    "Pick each open string 4 times (D U D U) from low E to high E and back at 60 bpm.",
    "Chromatic 1-2-3-4 on frets 1–4 of each string with strict alternate picking at 60 bpm, then 80.",
    "Pick the C major scale up and down with alternate picking at 70 bpm.",
    "Try three different pick thicknesses on the same strum and single-note line; write down which you prefer and why."
  ],
  assignment: "Record yourself playing the C major scale and Ode to Joy with strict alternate picking at 80 bpm.",
  mistakes: [
    "Too much pick showing – leads to hitting the strings too deep and dropping the pick.",
    "Gripping so hard the forearm tenses up.",
    "Anchoring the whole hand on the guitar top so the strum comes only from the fingers."
  ],
  tips: [
    "Buy a mixed pack of picks – everyone's ideal thickness is different. Textured or grip picks help if yours keep slipping."
  ],
  related: ["guitar-basics", "guitar-strumming", "guitar-exercises"]
},
{
  id: "guitar-caged",
  module: "guitar",
  title: "The CAGED System",
  level: 3,
  mins: 60,
  summary: "Use the five open shapes C, A, G, E and D to play any chord in five places up the neck.",
  theory: [
    "<b>CAGED</b> is built from five open chord shapes: <b>C, A, G, E, D</b>. Each shape can be moved up the neck (with a barre or capo-finger replacing the nut) to play other chords.",
    "The shapes connect up the neck <b>in that order</b>: C → A → G → E → D → C … The top of one shape overlaps the bottom of the next.",
    "<b>A C major chord five ways:</b><ul><li><b>C shape</b> (open): <code>x 3 2 0 1 0</code></li><li><b>A shape</b>, barre at fret 3: <code>x 3 5 5 5 3</code></li><li><b>G shape</b>, around fret 5: <code>8 7 5 5 5 8</code></li><li><b>E shape</b>, barre at fret 8: <code>8 10 10 9 8 8</code></li><li><b>D shape</b>, around fret 10: <code>x x 10 12 13 12</code></li></ul> Then the C shape repeats at fret 12.",
    "<b>Roots:</b> each shape has its root on a known string. E-shape: root on low E. A-shape: root on A. D-shape: root on D. C-shape: root on A (with 3rd fingers above). G-shape: root on low E and high E. Use your fretboard knowledge to place them.",
    "The two shapes beginners use most are the <b>E-shape barre</b> (<code>1 3 3 2 1 1</code> = F) and <b>A-shape barre</b> (<code>x 1 3 3 3 1</code> = B♭). Minor versions: E-minor shape <code>1 3 3 1 1 1</code> = Fm, A-minor shape <code>x 2 4 4 3 2</code> = Bm.",
    "CAGED also maps <b>scales and arpeggios</b>: every chord shape has a matching scale pattern around it, so you always know where the chord tones are when you play a fill."
  ],
  application: [
    "When a second guitarist is already strumming open chords, play the same chords higher up the neck with A- or D-shapes so you don't double them.",
    "Play songs in difficult keys (B♭, E♭, F) without a capo using barre shapes.",
    "Find chord tones for tasteful fills and melodic lines right above the chord you are holding.",
    "Move a progression smoothly in one area of the neck rather than jumping around."
  ],
  examples: [
    { prog: "C F G C", label: "1-4-5 using CAGED", note: "Try C (A-shape, fret 3), F (E-shape, fret 1), G (E-shape, fret 3)." },
    { prog: "C Am F G", label: "Same progression in one position", note: "C (A-shape fret 3), Am (E-minor shape fret 5), F (E-shape fret 1 or C-shape fret 5), G (E-shape fret 3)." },
    "G major five ways: E-shape 3 5 5 4 3 3 · D-shape x x 5 7 8 7 · C-shape x 10 9 7 8 7 · A-shape x 10 12 12 12 10 · G-shape open 3 2 0 0 0 3.",
    { prog: "C Dm Em F G Am", label: "Diatonic chords – find each with E and A barre shapes" }
  ],
  exercises: [
    "Play the C chord five ways (C, A, G, E, D shapes), ascending, 4 strums each at 60 bpm.",
    "Hold an F E-shape barre (fret 1) for 4 beats, release, repeat 10 times. Then a B♭ A-shape barre.",
    "Pick any chord and find it in the E-shape and A-shape within 5 seconds.",
    "Play C–Am–F–G staying between frets 1 and 5 only.",
    "Play G major in all five shapes and arpeggiate each one slowly (root–3rd–5th)."
  ],
  assignment: "Choose a worship song you know in open chords and play it a second way using only E- and A-shape barre chords. Record both versions.",
  mistakes: [
    "Learning the shapes but not where their roots are – always locate the root first.",
    "Pressing the whole barre with full force; only the strings that actually need it should be pressed hard."
  ],
  tips: [
    "Roll the index finger slightly onto its bony side for the barre – it presses more evenly than the soft middle.",
    "The full G- and C-shape grips are awkward; play just the top 3–4 strings of them in a band."
  ],
  related: ["guitar-fretboard", "inversions", "basic-voicing", "guitar-bonus"]
},
{
  id: "guitar-strumming",
  module: "guitar",
  title: "Basic Strumming Patterns",
  level: 1,
  mins: 45,
  summary: "Learn the essential strumming patterns for worship and folk songs, plus 6/8 and palm muting.",
  theory: [
    "<b>Rule:</b> down-strums on the beats (1 2 3 4), up-strums on the \"ands\". The hand keeps moving down-up the whole time; you simply choose when to touch the strings.",
    "<b>The \"universal\" pattern – D DU UDU:</b> count <code>1 2& &4&</code>. You strum down on 1, down-up on 2&, <b>miss</b> beat 3, then up on 3&, down-up on 4&. It fits countless pop, folk and worship songs.",
    "<b>Folk / country:</b> bass note on 1, strum on 2, alternate bass note on 3, strum on 4 – <code>B D B D</code>. For C: root on the A string (fret 3), alternate bass on the low E (fret 3, G). For G: root on the low E (fret 3), alternate bass on the D string (open).",
    "<b>Worship 8th-note drive:</b> steady <code>D U D U D U D U</code> with accents on 2 and 4, or straight down 8ths <code>D D D D D D D D</code> for building choruses. Light on verses, fuller on choruses.",
    "<b>6/8:</b> <code>D D U D D U</code> (counted 1 2 3 4 5 6), accents on 1 and 4. Slower option: <code>D – – D – –</code>.",
    "<b>Palm muting:</b> rest the side of your strumming hand lightly on the strings right next to the bridge saddle. Notes become short and percussive. Great for verses and build-ups; lift off for the chorus."
  ],
  application: [
    "Verse: palm-muted 8ths or a light D DU UDU. Chorus: open, fuller strumming. This simple dynamic contrast lifts a whole song.",
    "In a full band, keep strums simpler and let the drummer drive; in an acoustic-only set, your strum is the drum kit.",
    "Match the hi-hat pattern for 8th-note songs and the kick/snare for half-time ballads."
  ],
  examples: [
    { prog: "C G Am F", label: "D DU UDU – one bar per chord" },
    { prog: "C | C | F | C | G | F | C | C", label: "Folk bass–strum pattern" },
    { prog: "G D Em C", label: "Worship 8ths in open G (palm-muted verse, open chorus)", fixed: true },
    { prog: "C Am F G", label: "6/8: D D U D D U" },
    "Pattern grid: <code>1 & 2 & 3 & 4 &</code> → <code>D . D U . U D U</code> (D DU UDU)."
  ],
  exercises: [
    "On Em at 60 bpm, strum D D D D (2 min), then D U D U D U D U (2 min).",
    "D DU UDU on G at 70 bpm – say the pattern aloud the first 8 bars.",
    "Change G → C → D → Em every bar with D DU UDU at 70 bpm, then 90.",
    "Folk pattern on C and G alternating every 2 bars at 80 bpm.",
    "Play 4 bars palm-muted 8ths, then 4 bars open 8ths on G–D–Em–C at 100 bpm; feel the lift."
  ],
  assignment: "Play one worship song using palm-muted strumming in the verse and D DU UDU (or 8ths) in the chorus with a metronome.",
  mistakes: [
    "Stopping the hand on the missed beat – the miss is an air-strum, not a pause.",
    "Strumming all six strings on every chord; aim the down-strum at the root string and below (e.g. start from the A string for C)."
  ],
  tips: [
    "Up-strums only need to catch the top 3–4 strings – this keeps them light and bright."
  ],
  related: ["guitar-time", "guitar-pick", "playing-styles", "syncopation-groove"],
  tools: ["metronome"]
},
{
  id: "guitar-minor",
  module: "guitar",
  title: "Minor Chords",
  level: 1,
  mins: 40,
  summary: "Learn the open minor chords Am, Em and Dm, and take your first step toward the Bm barre.",
  theory: [
    "A <b>minor chord</b> = root, <b>minor 3rd</b> (3 half steps up), perfect 5th (7 half steps up). The minor 3rd is what gives it the softer, sadder colour. Am = A C E · Em = E G B · Dm = D F A · Bm = B D F♯.",
    "<b>Am:</b> <code>x 0 2 2 1 0</code> – fingers 2 and 3 on fret 2 of D and G, finger 1 on fret 1 of B. Compare C <code>x 3 2 0 1 0</code>: fingers 1 and 2 stay put; only finger 3 moves from the A string (fret 3) to the G string (fret 2).",
    "<b>Em:</b> <code>0 2 2 0 0 0</code> – the easiest chord; strum all six strings. <b>Dm:</b> <code>x x 0 2 3 1</code> – strum from the D string only.",
    "<b>Major vs minor shapes:</b> E <code>0 2 2 1 0 0</code> → Em <code>0 2 2 0 0 0</code> (lift one finger). A <code>x 0 2 2 2 0</code> → Am <code>x 0 2 2 1 0</code>. D <code>x x 0 2 3 2</code> → Dm <code>x x 0 2 3 1</code>. In each case one note (the 3rd) drops a half step.",
    "<b>Bm (barre intro):</b> full version <code>x 2 4 4 3 2</code> (A-minor shape at fret 2). Easy starter version: <code>x x 4 4 3 2</code> – fingers on the top four strings only, with finger 1 covering just the high E at fret 2.",
    "In any major key, the <b>2, 3 and 6</b> chords are minor. Key of G: Am, Bm, Em. Key of C: Dm, Em, Am. Key of D: Em, F♯m, Bm."
  ],
  application: [
    "The 6m chord (Em in G, Am in C) appears in almost every worship song – learn it first.",
    "Minor chords add emotion at bridges and reflective moments in a service.",
    "Bm is essential for the key of D and G, two of the most common guitar keys in worship."
  ],
  examples: [
    { prog: "Am F C G", label: "6m – 4 – 1 – 5 (minor-start loop)" },
    { prog: "C Am Dm G", label: "1 – 6m – 2m – 5" },
    { prog: "Am Dm Em Am", label: "Minor 1 – 4 – 5 in A minor (open)", fixed: true },
    { prog: "D Bm G A", label: "Key of D with the Bm starter shape", fixed: true },
    "Hear the difference: strum E then Em, A then Am, D then Dm."
  ],
  exercises: [
    "Strum Em, Am and Dm 4 times each, checking every string rings clearly.",
    "Switch E ↔ Em and A ↔ Am 20 times each, moving only the one finger that changes.",
    "Change Am → Dm → Em → Am, one bar each at 60 bpm, 4 down-strums per bar.",
    "Play the Bm starter shape (x x 4 4 3 2) for 4 beats, rest 4 beats, 10 times. Then try the full barre.",
    "Play D – Bm – G – A with D DU UDU at 70 bpm."
  ],
  assignment: "Play C – Am – F(or Fmaj7 x x 3 2 1 0) – G and D – Bm – G – A smoothly at 70 bpm for one minute each.",
  mistakes: [
    "Accidentally strumming the low E on Am or the low strings on Dm.",
    "The 1st finger on Am touching the open high E and muting it – keep it arched."
  ],
  tips: [
    "Leave fingers 1 and 2 down when changing C → Am – they sit on the same frets of the B and D strings in both chords. Only finger 3 moves."
  ],
  related: ["triads", "chord-families", "guitar-caged", "guitar-bonus"]
},
{
  id: "guitar-exercises",
  module: "guitar",
  title: "Guitar Exercises",
  level: 1,
  mins: 40,
  summary: "Daily drills for finger strength, independence, chord changes and picking accuracy.",
  theory: [
    "<b>Spider / chromatic exercise:</b> one finger per fret – fingers 1-2-3-4 on frets 1-2-3-4 – on each string from low E to high E, then back down. Builds strength, stretch and coordination.",
    "<b>Variations:</b> 1-3-2-4, 1-4-2-3, or move the whole pattern up one fret each time you reach the top (fret 1–4, then 2–5, 3–6 …). Keep fingers close to the fretboard.",
    "<b>Chord changes per minute:</b> pick two chords, set a timer for 60 seconds, and count how many clean changes you make (each new chord = 1). Write the number down daily. The goal is 30+ changes for each common pair.",
    "<b>One-minute changes</b> force your brain to find the shortest path between chords: look for <b>anchor fingers</b> (fingers that stay put) and <b>guide fingers</b> (fingers that slide along a string).",
    "<b>Picking drills:</b> alternate-picking single strings, string-crossing (e.g. A–D–A–D), and picking chord tones one at a time (arpeggios) build accuracy for melodies and intros.",
    "<b>Practice plan (15 min):</b> 3 min spider · 5 min one-minute changes (5 pairs) · 4 min strumming with metronome · 3 min song."
  ],
  application: [
    "Fast, clean chord changes are the number one skill for playing in a worship band – the song will not wait for you.",
    "Finger independence makes barre chords and sus chord embellishments possible.",
    "Picking accuracy lets you play intros and signature melody lines cleanly."
  ],
  examples: [
    "Spider pattern on one string: <code>1 2 3 4</code> (frets) with fingers 1 2 3 4, D U D U picking.",
    "Key chord pairs to drill: G–C, C–D, G–D, Em–C, Am–D, D–A, E–A, C–Am, G–Em, F–C.",
    { prog: "G C G D", label: "Change drill in open G (4 beats per chord)", fixed: true },
    { melody: "C4 E4 G4 C5 G4 E4 C4-", label: "C arpeggio picking drill" }
  ],
  exercises: [
    "Spider 1-2-3-4 on all six strings, up and back, at 60 bpm (one note per click). 3 rounds.",
    "Moving spider: start at fret 1 and shift up one fret per string set until fret 9, then back.",
    "One-minute changes: G–C, C–D, Em–C, Am–D, E–A. Record your score for each.",
    "Arpeggiate C, Am, F, G one string at a time (bass note first) at 70 bpm.",
    "String-crossing: alternate pick A string fret 3 and D string fret 2 (C–E) 16 times, then other pairs."
  ],
  assignment: "Keep a 7-day log of your one-minute change scores for five chord pairs and bring it to the next lesson.",
  mistakes: [
    "Playing too fast and sloppy – speed comes from clean, slow repetition.",
    "Lifting fingers far away from the strings between notes."
  ],
  tips: [
    "Short, daily practice beats a long weekly session. 15 minutes a day is enough to see real progress in a month."
  ],
  related: ["finger-exercises", "chord-changing", "guitar-pick", "flex-progression-drills"]
},
{
  id: "guitar-songs",
  module: "guitar",
  title: "Songs for Beginners",
  level: 1,
  mins: 45,
  summary: "A graded song list – from two-chord songs to four-chord worship classics – with capo tips.",
  theory: [
    "<b>Grade 1 – two-chord songs</b> (1 and 5 chords): He's Got the Whole World in His Hands, Clementine, Skip to My Lou, Tom Dooley, Row Row Row Your Boat (1 chord!). Play in G (G–D) or C (C–G).",
    "<b>Grade 2 – three-chord songs</b> (1, 4, 5): Amazing Grace, When the Saints Go Marching In, Kumbaya, This Little Light of Mine, Swing Low Sweet Chariot, Down by the Riverside, Michael Row the Boat Ashore. Keys of G (G C D) or D (D G A).",
    "<b>Grade 3 – four-chord songs</b> (add the 6m): many modern worship songs use mostly 1, 4, 5 and 6m – e.g. Amazing Grace (My Chains Are Gone), 10,000 Reasons, Here I Am to Worship, Lord I Need You, Way Maker, Good Good Father, What a Beautiful Name. Get the chord charts from your church or a licensed source.",
    "<b>Hymns (public domain)</b> to learn in 3/4 and 4/4: Holy Holy Holy, It Is Well with My Soul, Blessed Assurance, Be Thou My Vision, Come Thou Fount, Rock of Ages, What a Friend We Have in Jesus. Most sit nicely in G, C or D.",
    "<b>Capo tips:</b><table><tr><th>Band key</th><th>Capo</th><th>Play shapes in</th></tr><tr><td>A</td><td>2</td><td>G</td></tr><tr><td>B♭</td><td>3</td><td>G (or capo 1, A)</td></tr><tr><td>B</td><td>4</td><td>G</td></tr><tr><td>E</td><td>2</td><td>D (or open E)</td></tr><tr><td>F</td><td>5</td><td>C (or capo 3, D)</td></tr></table>",
    "Always ask for the <b>key</b> first, then decide your capo position. Write \"Capo 4 – G shapes\" at the top of the chart."
  ],
  application: [
    "Start each practice with a song you can already play – it builds confidence.",
    "Learning hymns in 3/4 trains your waltz strum for traditional services.",
    "Four-chord worship songs let you join the church band within weeks."
  ],
  examples: [
    { prog: "C G7 G7 C", label: "Two-chord song: 1 – 5(7)", note: "He's Got the Whole World / Clementine pattern." },
    { prog: "C C F C | C G C C", label: "Three-chord hymn pattern (Amazing Grace style)" },
    { prog: "G C G D", label: "Amazing Grace in open G (3/4, bass–strum–strum)", fixed: true },
    { prog: "G C Em D", label: "Four-chord worship pattern in G", fixed: true },
    { melody: "D4 G4- B4 G4 B4- A4 G4- E4 D4--", label: "Amazing Grace melody (public domain)" }
  ],
  exercises: [
    "Learn one two-chord song (G–D or C–G7) and play it all the way through at 70 bpm.",
    "Learn Amazing Grace in G (3/4) with bass–strum–strum.",
    "Learn When the Saints in G with D DU UDU.",
    "Learn one four-chord worship song from your church's set list, with the capo position for the band's key.",
    "Sing (or hum) the melody while playing at least one song."
  ],
  assignment: "Prepare and perform three songs – one from each grade – for your teacher or a friend, including the capo position you used.",
  mistakes: [
    "Choosing songs with too many chords too early.",
    "Not checking the key with the worship leader before rehearsal."
  ],
  tips: [
    "Use the original song recording to check the strumming feel, but simplify the rhythm until the chord changes are solid."
  ],
  related: ["first-songs", "common-progressions", "guitar-strumming", "guitar-theory"]
},
{
  id: "guitar-bonus",
  module: "guitar",
  title: "Bonus Chords — E-Family Open Voicings, Sus & Dom7",
  level: 2,
  mins: 50,
  summary: "Add colour with E-family open voicings, sus chords, slash chords and dominant 7ths.",
  theory: [
    "<b>E-family open voicings</b> – all built around the open E shape:<ul><li>E <code>0 2 2 1 0 0</code> · Em <code>0 2 2 0 0 0</code></li><li>E7 <code>0 2 0 1 0 0</code> · Em7 <code>0 2 0 0 0 0</code> (or <code>0 2 2 0 3 0</code>)</li><li>Emaj7 <code>0 2 1 1 0 0</code> · E6 <code>0 2 2 1 2 0</code></li><li>Esus4 <code>0 2 2 2 0 0</code> · Eadd9 <code>0 2 4 1 0 0</code></li></ul>",
    "<b>Sus chords</b> replace the 3rd with the 2nd (sus2) or 4th (sus4). They sound open and unresolved – perfect for worship.<ul><li>Asus2 <code>x 0 2 2 0 0</code> · Asus4 <code>x 0 2 2 3 0</code></li><li>Dsus2 <code>x x 0 2 3 0</code> · Dsus4 <code>x x 0 2 3 3</code></li></ul> Classic move: D → Dsus4 → D → Dsus2 → D.",
    "<b>The worship-guitar \"anchor\" voicings</b> keep fingers 3 and 4 on the B and high E strings at fret 3: G <code>3 2 0 0 3 3</code> · Cadd9 <code>x 3 2 0 3 3</code> · Dsus4 <code>x x 0 2 3 3</code> · Em7 <code>0 2 2 0 3 3</code>. Changes become smooth because the top notes ring through.",
    "<b>Slash chord G/B</b> <code>x 2 0 0 3 3</code> – a G chord with B in the bass. Used as a walking-bass step: C → G/B → Am.",
    "<b>Dominant 7 chords</b> (1, 3, 5, ♭7) create a pull back to the home chord:<ul><li>A7 <code>x 0 2 0 2 0</code> · D7 <code>x x 0 2 1 2</code></li><li>E7 <code>0 2 0 1 0 0</code> · B7 <code>x 2 1 2 0 2</code></li><li>G7 <code>3 2 0 0 0 1</code> · C7 <code>x 3 2 3 1 0</code></li></ul>",
    "The <b>5 chord as a 7th</b> leads home: in E, B7 → E; in A, E7 → A; in G, D7 → G; in C, G7 → C."
  ],
  application: [
    "Use sus2 and sus4 chords to add movement on long held chords during prayer or soft intros.",
    "The G – Cadd9 – Dsus4 – Em7 anchor voicings give the signature modern worship acoustic sound.",
    "Dom7 chords add a bluesy or gospel flavour and strengthen the turnaround back to the 1 chord.",
    "G/B and other slash chords create a smooth descending bass line between chords."
  ],
  examples: [
    { prog: "G Cadd9 Dsus4 Em7", label: "Anchor-finger worship voicings (open G)", fixed: true },
    { prog: "D Dsus4 D Dsus2 D", label: "Sus embellishment on D", fixed: true },
    { prog: "E Esus4 E E7 A", label: "E-family colours leading to A", fixed: true },
    { prog: "C G/B Am F", label: "Walking bass with a slash chord" },
    { prog: "C C7 F G7 C", label: "Dom7 chords pulling to the next chord" },
    { prog: "E A B7 E", label: "Blues / gospel 1 – 4 – 5(7) in E", fixed: true }
  ],
  exercises: [
    "Play every E-family voicing in order (E, Esus4, E, E7, Emaj7, E6, Em, Em7) with 4 strums each.",
    "Play D → Dsus4 → D → Dsus2 → D and A → Asus4 → A → Asus2 → A, 2 beats each at 70 bpm.",
    "G – Cadd9 – Dsus4 – Em7 at 70 bpm, keeping fingers 3 and 4 locked on the top strings.",
    "Play C – G/B – Am – G – F and listen to the bass walk down.",
    "One-minute changes: A7–D7, E7–A, B7–E."
  ],
  assignment: "Rearrange a simple four-chord worship song using at least one sus chord, one slash chord and one dom7 chord, and play it for the class.",
  mistakes: [
    "Overusing sus chords – they lose their effect if every chord is suspended.",
    "Strumming the low E on Dsus2/Dsus4 or the low strings on G/B (the B must be the lowest note)."
  ],
  tips: [
    "Mute the low E on G/B by letting the tip of finger 2 touch it lightly.",
    "B7 is the first four-finger chord most players learn – practise it slowly; it unlocks the key of E."
  ],
  related: ["sus-chords", "dom7-chords", "slash-chords", "add9-chords", "guitar-caged", "guitar-minor"]
}
);
