/* Intermediate–Advanced · Level 1 topics */
(window.TOPICS = window.TOPICS || []).push(
{
  id: "chord-quality",
  module: "intermediate",
  title: "Understanding Chord Quality — How It Works",
  level: 3,
  mins: 45,
  summary: "See exactly why each scale degree gives a major, minor or diminished chord.",
  theory: [
    "A chord's <b>quality</b> (major, minor, diminished, augmented) comes from the size of the 3rds stacked inside it. A <b>major 3rd</b> = 4 semitones, a <b>minor 3rd</b> = 3 semitones.",
    "<table><tr><th>Quality</th><th>Bottom 3rd</th><th>Top 3rd</th><th>Example</th></tr><tr><td>Major</td><td>M3 (4)</td><td>m3 (3)</td><td>C E G</td></tr><tr><td>Minor</td><td>m3 (3)</td><td>M3 (4)</td><td>D F A</td></tr><tr><td>Diminished</td><td>m3 (3)</td><td>m3 (3)</td><td>B D F</td></tr><tr><td>Augmented</td><td>M3 (4)</td><td>M3 (4)</td><td>C E G♯</td></tr></table>",
    "To build the chords of a key, start on each scale degree and skip every other note of the scale (1-3-5, 2-4-6, 3-5-7…). You only ever use notes that belong to the key.",
    "In C major this gives: <b>I</b> C, <b>ii</b> Dm, <b>iii</b> Em, <b>IV</b> F, <b>V</b> G, <b>vi</b> Am, <b>vii°</b> Bdim. The pattern Maj–min–min–Maj–Maj–min–dim is the same in every major key.",
    "<b>Why is ii minor?</b> Built on D, the next 3rd up in C major is F (not F♯). D→F is only 3 semitones, a minor 3rd. F→A is 4 semitones. Minor 3rd + major 3rd = minor chord.",
    "<b>Why is vii° diminished?</b> B→D is 3 semitones and D→F is 3 semitones. Two minor 3rds give a diminished 5th (B→F = 6 semitones, a tritone). That tritone is what makes it so tense.",
    "The augmented chord (two major 3rds) never appears naturally in a major key. You get it by raising a 5th, which is why it sounds like it is ‘leaning’ somewhere."
  ],
  application: [
    "When a chart says ‘2’ in Nashville numbers you instantly know it is minor (Dm in C, Em in D) without being told.",
    "When you hear a sad-sounding chord in a happy song, you can guess it is ii, iii or vi.",
    "Knowing why chords are major or minor lets you spot borrowed or chromatic chords (e.g. a D major in C is not diatonic, so it must be doing a special job, such as V of V).",
    "It speeds up learning songs in new keys: you work out the pattern instead of memorising every chord."
  ],
  examples: [
    { prog: "C Dm Em F G Am Bdim C", label: "Diatonic triads of C major", note: "Listen for Maj–min–min–Maj–Maj–min–dim." },
    { prog: "Dm D Dm D", label: "ii (minor) vs D major", note: "Only the F vs F♯ changes. Hear the colour shift." },
    { prog: "C Am F G", label: "1-6-4-5 using the qualities you built" },
    "In G major: G (I), Am (ii), Bm (iii), C (IV), D (V), Em (vi), F♯dim (vii°). Same pattern, new letters."
  ],
  exercises: [
    "Play the 7 diatonic triads of C major up and down, saying the Roman numeral and quality aloud. 3 times.",
    "Count semitones for each 3rd in Dm, Em and Bdim and write them down to prove their quality.",
    "Build the diatonic triads in G, D and F major on paper, then play them at 60 bpm, one chord per beat.",
    "Take any one major chord and turn it into minor, diminished and augmented by moving one or two notes. Do it from C, F and G.",
    "Play the diatonic triads in all 12 keys over a week (two new keys a day)."
  ],
  assignment: "Write out the diatonic triads (with Roman numerals and qualities) for C, G, D, A, F and B♭, then play them for your teacher in two of those keys from memory.",
  mistakes: [
    "Making ii or vi major because the song is ‘happy’.",
    "Forgetting the key signature (e.g. playing F instead of F♯ in D major, which turns Bm into Bdim).",
    "Calling vii° ‘minor’: it is diminished because its 5th is flattened too."
  ],
  tips: [
    "Say ‘big-small’ for major (big 3rd then small) and ‘small-big’ for minor. Students remember it fast."
  ],
  related: ["scale-degrees", "triads", "chord-families", "chord-scale", "functional-harmony"],
  tools: ["keyboard", "chordlab"]
},
{
  id: "functional-harmony",
  module: "intermediate",
  title: "Functional Harmony",
  level: 3,
  mins: 50,
  summary: "Group every chord in a key into Tonic, Subdominant or Dominant and use tension and release on purpose.",
  theory: [
    "Every chord in a key has a <b>job</b> (function). There are three families: <b>Tonic</b> (rest/home), <b>Subdominant</b> (moving away), and <b>Dominant</b> (tension that wants to go home).",
    "<table><tr><th>Function</th><th>Chords</th><th>In C</th><th>Feeling</th></tr><tr><td>Tonic</td><td>I, vi, iii</td><td>C, Am, Em</td><td>Rest, home</td></tr><tr><td>Subdominant</td><td>ii, IV</td><td>Dm, F</td><td>Movement, lift</td></tr><tr><td>Dominant</td><td>V, vii°</td><td>G, Bdim</td><td>Tension, pull</td></tr></table>",
    "Chords in the same family share notes. C (C E G) and Am (A C E) share C and E. F (F A C) and Dm (D F A) share F and A. G (G B D) and Bdim (B D F) share B and D. That is why they can swap for each other.",
    "The basic motion of tonal music is <b>T → S → D → T</b>: home, move away, build tension, come home. Example: C – F – G – C or C – Dm – G – C.",
    "Dominant tension comes from the <b>tritone</b> B–F in G7 (or Bdim). B wants to rise to C and F wants to fall to E, so the chord pulls strongly to C.",
    "iii (Em) is a weak tonic. It shares two notes with C (E, G) but also two with G (G, B), so it can feel like a bridge between tonic and dominant.",
    "Minor keys work the same way: i and VI are tonic, iv and ii° are subdominant, V (usually major, from harmonic minor) and vii° are dominant."
  ],
  application: [
    "When the singer holds a long note on the tonic, you can colour it with vi or iii instead of repeating I.",
    "Building up into a chorus: hang on the subdominant and dominant to create anticipation, then land on I as the chorus starts.",
    "Reading a chart quickly: if you see V, you know resolution to I (or a surprise) is coming.",
    "In worship ministration, sitting on tonic chords creates calm; moving to dominant creates expectancy."
  ],
  examples: [
    { prog: "C F G C", label: "T – S – D – T (basic)" },
    { prog: "Am Dm Bdim C", label: "Same functions, different family members" },
    { prog: "C Em Am F Dm G C", label: "Tonic family → subdominant family → dominant → home" },
    { prog: "C G7 C", label: "Feel the tritone in G7 resolve" },
    { prog: "Am Dm E Am", label: "Minor key: i – iv – V – i", note: "E major (not Em) gives a strong dominant in A minor." }
  ],
  exercises: [
    "Sort the 7 diatonic chords of C into T / S / D on paper, then play each family as a group.",
    "Play C – F – G – C, then replace each chord with another from its family (e.g. Am – Dm – Bdim – C). Try 4 different versions.",
    "Hold a G7 for 4 beats and resolve to C. Name the two notes that move (B→C, F→E).",
    "Take a simple song (e.g. Amazing Grace) and label every chord T, S or D.",
    "Repeat the family-swap exercise in G, D and F."
  ],
  assignment: "Write two 8-bar progressions in C that follow T–S–D–T but never use the same chord twice in a row. Play them and explain the function of each chord.",
  mistakes: [
    "Treating every chord as equal and ending phrases on a dominant by accident.",
    "Swapping chords across families without a reason (e.g. replacing V with IV at a final cadence)."
  ],
  tips: [
    "Ask students: ‘Is this chord sitting, walking or pulling?’ It makes function feel physical."
  ],
  related: ["chord-quality", "cadences", "chord-substitution", "chord-families", "nashville"],
  tools: ["chordlab"]
},
{
  id: "cadences",
  module: "intermediate",
  title: "Cadences",
  level: 3,
  mins: 50,
  summary: "Learn the musical ‘punctuation marks’ that end phrases, and how worship songs land.",
  theory: [
    "A <b>cadence</b> is the chord movement at the end of a phrase. It works like punctuation: full stop, comma, question mark or surprise.",
    "<b>Perfect / Authentic (V → I):</b> the strongest full stop. G – C, or G7 – C. With the tonic on top of the final chord it is a <i>perfect authentic</i> cadence.",
    "<b>Plagal (IV → I):</b> the ‘Amen’ cadence, heard at the end of hymns. F – C. Softer and warmer than V – I. The minor version (iv – I, Fm – C) is very emotional.",
    "<b>Half cadence (… → V):</b> the phrase stops on the dominant, like a comma or question mark. C – F – G (and wait). Used before a repeat or a new section.",
    "<b>Deceptive (V → vi):</b> you expect I but get vi. G – Am. A surprise that keeps the song going, great before a tag or repeat.",
    "<b>Gospel 4-5-1:</b> F – G – C, often with F/G (IV over the 5 in the bass) instead of plain G: F – F/G – C. Smooth and soulful.",
    "<b>2-5-1:</b> ii – V – I (Dm7 – G7 – Cmaj7). The most common cadence in jazz and gospel; the bass falls in 5ths (D→G→C).",
    "<b>How worship songs end:</b> a slow 4-5-1 or 2-5-1, a held sus4 that resolves (Csus4 – C), a plagal ‘Amen’ (F – C or Fm – C), or the ♭VI – ♭VII – I ‘victory’ ending (A♭ – B♭ – C)."
  ],
  application: [
    "Use half cadences at the end of a verse to lead the band into the chorus.",
    "Use a deceptive cadence (V – vi) to extend the last chorus: sing the line again before the real ending.",
    "End a ministration time softly with a plagal or iv – I cadence under a held note.",
    "Use 2-5-1 to move into any new chord, not only I (e.g. Gm7 – C7 – F to go to IV)."
  ],
  examples: [
    { prog: "Dm G C", label: "Perfect / authentic cadence" },
    { prog: "C F C", label: "Plagal ‘Amen’ cadence" },
    { prog: "C Am F G", label: "Half cadence — stops on V" },
    { prog: "C F G Am", label: "Deceptive cadence — V to vi" },
    { prog: "F F/G C", label: "Gospel 4-5-1 with F/G" },
    { prog: "Dm7 G7 Cmaj7 | F Fm C | Ab Bb C", label: "Three worship endings: 2-5-1, minor plagal, ♭VI-♭VII-I" }
  ],
  exercises: [
    "Play each cadence type in C, 4 times each, naming it aloud.",
    "Your teacher plays phrases; you identify the cadence by ear (aim for 8 out of 10).",
    "Play C – Am – F – G (half) then G – Am (deceptive) then F – F/G – C (gospel) as one long phrase at 70 bpm.",
    "Play the 2-5-1 in C, F, G, B♭ and D.",
    "Choose a worship song you know and play three different endings for it."
  ],
  assignment: "Pick one worship song and prepare three endings: a 2-5-1, a gospel 4-5-1 with F/G, and a plagal/minor-plagal Amen. Perform all three for your teacher.",
  mistakes: [
    "Ending every song with the same cadence.",
    "Rushing the last chord: final cadences need space, slow down (ritardando) together with the band.",
    "Playing the deceptive cadence when the leader is clearly ending the song."
  ],
  tips: [
    "Watch the worship leader: a raised hand or slowing tempo usually means ‘final cadence now’."
  ],
  related: ["functional-harmony", "intros-endings", "chord-substitution", "passing-chords", "worship-progressions"],
  tools: ["chordlab"]
},
{
  id: "add9-chords",
  module: "intermediate",
  title: "add9 Chords",
  level: 3,
  mins: 40,
  summary: "Add the 9th to triads for the open, shimmering sound of modern worship.",
  theory: [
    "An <b>add9</b> chord is a triad plus the 9th (the 2nd, an octave higher). Cadd9 = C E G D.",
    "Formula: <b>1 – 3 – 5 – 9</b>. There is <b>no 7th</b>. If there is a 7th it is a 9 chord (C9 = C E G B♭ D, or Cmaj9 = C E G B D).",
    "<b>Csus2 vs Cadd9:</b> Csus2 = C D G (the 2nd <i>replaces</i> the 3rd). Cadd9 keeps the 3rd (C E G D). add9 still sounds major; sus2 sounds open and neutral.",
    "Minor add9: Cmadd9 = C E♭ G D. Beautiful and dark, very common in ballads.",
    "In C major the diatonic add9 chords are Cadd9, Dmadd9, Fadd9, Gadd9, Amadd9. Em(add9) needs F♯ and Bdim needs C♯, so they are outside the key and usually avoided.",
    "Common voicing: play the root in the left hand and <b>E–G–D</b> or <b>G–D–E</b> in the right hand. Putting the 9th next to the 3rd (D next to E) gives a soft cluster."
  ],
  application: [
    "Use add9 on I and IV in slow worship songs to make the sound open and modern.",
    "Pads and synth players often hold add9 chords for long sections because they blend with the melody.",
    "Guitarists love Cadd9 and Gadd9; matching them on keys makes the band sound unified.",
    "Use a moving 9 – 1 or 9 – 3 in the right hand as a gentle inner movement."
  ],
  examples: [
    { prog: "Cadd9 Gadd9 Amadd9 Fadd9", label: "1-5-6-4 with add9 colours" },
    { prog: "C Cadd9 C Csus2", label: "Compare triad, add9 and sus2" },
    { prog: "Fadd9 Cadd9/E Dmadd9 Gsus4 G", label: "Worship ballad line" },
    "Right-hand voicing: Cadd9 = E G D (LH C). Fadd9 = A C G (LH F). Gadd9 = B D A (LH G)."
  ],
  exercises: [
    "Play Cadd9, Fadd9 and Gadd9 in root position and with the 9th on top. 5 times each.",
    "Play 1-5-6-4 (Cadd9 Gadd9 Amadd9 Fadd9) slowly at 60 bpm, smooth voice leading.",
    "Alternate C – Cadd9 – C by moving one finger (add the D). Do it in G and F too.",
    "Play the diatonic add9 chords in G and D, noting which degrees to avoid.",
    "Accompany a slow worship song using only add9 or triad chords."
  ],
  assignment: "Re-voice a slow worship song you know using add9 chords on at least half the chords. Record yourself and note where the add9 clashes with the melody (if anywhere).",
  mistakes: [
    "Adding a 7th and still calling it add9.",
    "Confusing sus2 (no 3rd) with add9 (has 3rd).",
    "Putting the 9th low in the left hand, which sounds muddy."
  ],
  tips: [
    "Keep the 9th in the middle of the keyboard (around middle C) for the clearest sound."
  ],
  related: ["triads", "sus-chords", "extended-chords", "basic-voicing", "tones-layers"],
  tools: ["keyboard", "chordlab"]
},
{
  id: "seventh-chords",
  module: "intermediate",
  title: "Major & Minor 7th Chords",
  level: 3,
  mins: 50,
  summary: "Compare maj7, m7 and dominant 7 and play all the diatonic 7th chords in a key.",
  theory: [
    "A 7th chord is a triad plus one more 3rd on top. The type of triad and the type of 7th give the name.",
    "<table><tr><th>Chord</th><th>Formula</th><th>On C</th><th>Sound</th></tr><tr><td>Major 7 (Cmaj7)</td><td>1 3 5 7</td><td>C E G B</td><td>Dreamy, smooth</td></tr><tr><td>Minor 7 (Cm7)</td><td>1 ♭3 5 ♭7</td><td>C E♭ G B♭</td><td>Mellow, soulful</td></tr><tr><td>Dominant 7 (C7)</td><td>1 3 5 ♭7</td><td>C E G B♭</td><td>Bluesy, wants to move</td></tr><tr><td>Half-dim (Cm7♭5)</td><td>1 ♭3 ♭5 ♭7</td><td>C E♭ G♭ B♭</td><td>Dark, tense</td></tr></table>",
    "Maj7 has a <b>major 7th</b> (a semitone below the octave). m7 and dom7 have a <b>minor 7th</b> (a whole tone below the octave).",
    "Diatonic 7ths in C: <b>Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7♭5</b>. Pattern: maj7 – m7 – m7 – maj7 – 7 – m7 – m7♭5. Same in every major key.",
    "Only V gets a <b>dominant 7</b> naturally. That is why G7 pulls so strongly to C. A dom7 on any other degree (e.g. D7 or A7 in C) is a borrowed or secondary chord.",
    "Shell voicing: root + 3rd + 7th (leave out the 5th). Cmaj7 shell = C E B. It sounds clean and leaves room for the singer."
  ],
  application: [
    "Use maj7 on I and IV for soft, reflective worship.",
    "Use m7 on ii, iii and vi in gospel and neo-soul grooves.",
    "Use V7 to make cadences stronger, especially in 2-5-1.",
    "Avoid maj7 on a chord where the melody sings the root loudly: the root and the 7th a semitone apart can clash."
  ],
  examples: [
    { prog: "Cmaj7 Cm7 C7", label: "Compare the three 7th types on C" },
    { prog: "Cmaj7 Dm7 Em7 Fmaj7 G7 Am7 Bm7b5 Cmaj7", label: "Diatonic 7ths of C" },
    { prog: "Dm7 G7 Cmaj7", label: "2-5-1 with 7ths" },
    { prog: "Fmaj7 Em7 Dm7 Cmaj7", label: "Smooth descending worship line" }
  ],
  exercises: [
    "Play Cmaj7, Cm7 and C7 in root position, then change just the 3rd and 7th to move between them.",
    "Play the diatonic 7ths of C up and down at 60 bpm. Then in F and G.",
    "Play 2-5-1 using shell voicings (LH root, RH 3rd + 7th) in C, F, B♭ and G.",
    "Play Cmaj7 – Am7 – Dm7 – G7 around the circle of 4ths for 4 keys.",
    "Re-harmonise a simple I–IV–V song using 7th chords only."
  ],
  assignment: "Write and play the diatonic 7th chords in C, G, F and D, then perform a 2-5-1 in each of those keys with smooth voicings.",
  mistakes: [
    "Playing B instead of B♭ in C7 (that makes Cmaj7).",
    "Using dom7 on I in a worship ballad by accident (it makes the chord want to leave).",
    "Muddy low voicings: keep the 3rd and 7th above C3."
  ],
  tips: [
    "Teach the 3rd and 7th as the ‘colour notes’ — they decide the quality; the 5th can usually go."
  ],
  related: ["dom7-chords", "chord-quality", "extended-chords", "dim7-aug7-m7b5", "basic-voicing"],
  tools: ["keyboard", "chordlab"]
},
{
  id: "aug-dim-chords",
  module: "intermediate",
  title: "Augmented & Diminished Chords",
  level: 3,
  mins: 45,
  summary: "Use augmented and diminished chords as tension-builders and smooth connectors.",
  theory: [
    "<b>Augmented</b> (Caug or C+) = C E G♯. Two major 3rds stacked. The raised 5th makes it unstable and ‘floating’.",
    "<b>Diminished</b> (Cdim or C°) = C E♭ G♭. Two minor 3rds stacked. Small, tense and dark.",
    "<b>Diminished 7th</b> (Cdim7) = C E♭ G♭ B𝄫 (sounds like A). All minor 3rds, so it is symmetrical: Cdim7, E♭dim7, G♭dim7 and Adim7 contain the same notes.",
    "<b>Half-diminished</b> (Cm7♭5) = C E♭ G♭ B♭. A diminished triad with a minor 7th. It is the natural vii chord in major and ii chord in minor.",
    "Augmented chords are symmetrical too: Caug, Eaug and G♯aug share the same notes. There are only 4 different augmented chords.",
    "<b>Uses:</b> augmented often moves the 5th up (G → G♯ → A), e.g. C – Caug – F or C – Caug – C6. Diminished often works as a passing chord a half step below the next chord (C♯dim → Dm), or as a rootless substitute for a dominant 7♭9."
  ],
  application: [
    "Use Caug between C and F (or C and Am/C) to create a rising inner line.",
    "Use dim chords to walk the bass up chromatically: C – C♯dim – Dm – D♯dim – Em.",
    "Use Gaug7 instead of G7 at a cadence for a gospel ‘lift’.",
    "Use dim7 chords in dramatic moments, intros and builds."
  ],
  examples: [
    { prog: "C Caug C6 C7 F", label: "Rising 5th line: G – G♯ – A – B♭" },
    { prog: "C C#dim Dm G7 C", label: "Diminished passing chord to ii" },
    { prog: "F F#dim C/G Am", label: "Gospel #4 diminished" },
    { prog: "Dm7 Gaug7 C", label: "Augmented dominant cadence" },
    { prog: "Cmaj7 Bm7b5 E7 Am", label: "m7♭5 as ii of the relative minor" }
  ],
  exercises: [
    "Build aug, dim and dim7 chords on C, D, E, F, G, A and B. Check every interval.",
    "Play C – Caug – C6 – C7 – F slowly, moving only one finger at a time.",
    "Walk C – C♯dim – Dm – D♯dim – Em – F at 70 bpm. Then in G.",
    "Find the 3 dim7 chords that contain all 12 notes (Cdim7, C♯dim7, Ddim7).",
    "Add one aug or dim chord to a song you already play."
  ],
  assignment: "Arrange a 4-chord worship progression adding at least one diminished passing chord and one augmented chord. Explain where each one leads.",
  mistakes: [
    "Spelling Caug with A♭ instead of G♯ (it is a raised 5th).",
    "Holding a dim or aug chord too long: they are tension, they need to resolve.",
    "Using them in every bar; they lose their power."
  ],
  related: ["chord-quality", "passing-chords", "dim7-aug7-m7b5", "chord-substitution", "chord-movements"],
  tools: ["keyboard", "chordlab"]
},
{
  id: "chord-substitution",
  module: "intermediate",
  title: "Chord Substitutions",
  level: 3,
  mins: 60,
  summary: "Replace chords with others that do the same job to change colour, emotion and movement — not the song.",
  theory: [
    "<b>What it is:</b> chord substitution means replacing a chord with another chord that performs the <b>same harmonic function</b>, while keeping the music smooth and meaningful. You are not changing the song — you are changing the <i>color, emotion and movement</i>.",
    "<b>Why we do it:</b> to avoid boring or repeated progressions, add emotion and depth, sound professional and mature, support singers better, and move smoothly between chords. Good pianists don't play many chords — they play <b>smart</b> chords.",
    "<b>Golden rule:</b> a chord can be substituted by another chord that shares <b>similar notes</b>, the <b>same harmonic function</b>, or the <b>same bass movement</b>.",
    "<b>Functions:</b> Tonic (rest) I, vi · Subdominant (movement) ii, IV · Dominant (tension) V, vii°. Substitutions usually happen <i>within the same function</i>. <b>Relative major/minor:</b> C ⇄ Am, F ⇄ Dm, G ⇄ Bdim — each pair shares two common notes. <b>Diatonic:</b> instead of C – F – G – C try Am – Dm – G – C. Function remains, color changes.",
    "<b>Secondary dominant:</b> the V of V. In C, D7 → G: C – D7 – G – C. Used in gospel, jazz and worship. <b>Tritone substitution:</b> a dominant can be replaced by the dominant a tritone away: G7 → D♭7. They share the same tritone (B/C♭ and F) and give a smooth chromatic bass (D♭ → C). Jazz, neo-soul, advanced gospel.",
    "<b>Diminished connectors:</b> C → C♯° → Dm. They create tension and lead smoothly. <b>Passing chords:</b> C → F becomes C → Em → Dm → F. They fill space and give smooth voice leading.",
    "<b>Parallel (borrowed):</b> borrow iv (Fm) from C minor: C – Fm – C. Emotional depth, dramatic color. <b>Slash chords:</b> C/E, F/G. Control the bass, support singers, smooth transitions.",
    "<b>Voicing makes it work:</b> a substitution fails when the voicing is poor or the bass clashes with the melody. Keep the melody on top, move voices step by step, and avoid a jumping bass."
  ],
  application: [
    "Second verse or last chorus: keep the first time plain, then substitute (e.g. I → vi, IV → ii) to build interest.",
    "Supporting singers: a slash chord like C/E or F/G keeps the bass moving smoothly under a held melody note.",
    "Gospel and worship: secondary dominants (D7 → G) and diminished connectors (C♯° → Dm) create lift into the next line.",
    "Ministration and soft moments: a borrowed iv (Fm) under ‘Amen’ adds deep emotion.",
    "Jazz / neo-soul: tritone subs (D♭7 for G7) give a chromatic bass walk into I."
  ],
  examples: [
    { prog: "C F G C", label: "Original I–IV–V–I" },
    { prog: "Am Dm D7 G C", label: "Relative + secondary dominant substitution" },
    { prog: "C Fm G C", label: "Borrowed iv (parallel minor)" },
    { prog: "C C#dim Dm G C", label: "Diminished connector" },
    { prog: "Dm7 Db7 C", label: "Tritone substitution (D♭7 for G7)", note: "Bass walks D – D♭ – C." },
    { prog: "C Em Dm F | C/E F F/G C", label: "Passing chords and slash chords" }
  ],
  exercises: [
    "Step 1: Play I–IV–V–I (C – F – G – C) cleanly at 70 bpm.",
    "Step 2: Replace one chord at a time — I → vi (Am – F – G – C), then IV → ii (C – Dm – G – C).",
    "Step 3: Add passing chords: I → iii → vi (C – Em – Am) and C – Em – Dm – F.",
    "Step 4: Add secondary dominants: ii → V/V → V (Dm – D7 – G – C), then try a tritone sub (Dm7 – D♭7 – C).",
    "Step 5: Play every step in all 12 keys (two keys a day), keeping the melody note on top."
  ],
  assignment: "Take one simple worship song. Play it once with the original chords, then once with at least four substitutions (relative, secondary dominant, diminished connector and one borrowed or slash chord). Explain to your teacher which function each substitute keeps.",
  mistakes: [
    "Over-substituting: changing every chord until the song is unrecognisable.",
    "Ignoring the melody: a substitute that clashes with the sung note is wrong, however clever.",
    "Playing too many chords: more chords is not better; smart chords are.",
    "Losing the key center: always come back home to I so the singers and band stay grounded."
  ],
  tips: [
    "Hum the melody while you try a substitute. If your voice and the chord fight, choose another.",
    "Substitute where the song has space (long notes, endings, turnarounds), not under fast lyrics."
  ],
  related: ["functional-harmony", "passing-chords", "slash-chords", "borrowed-chords", "reharmonisation"],
  tools: ["chordlab"]
},
{
  id: "passing-chords",
  module: "intermediate",
  title: "Passing Chords — Secondary Dominants, Diminished, 2-5-1 & Chromatic",
  level: 3,
  mins: 60,
  summary: "Connect any two chords smoothly with secondary dominants, diminished chords, 2-5-1s and chromatic moves.",
  theory: [
    "A <b>passing chord</b> is a short chord placed between two main chords to create movement and smooth voice leading. It usually lasts one or two beats.",
    "<b>Secondary dominants</b> (V of a chord): to go to any diatonic chord, play the dominant 7 a 5th above it. In C: <b>A7 → Dm</b> (V/ii), <b>B7 → Em</b> (V/iii), <b>C7 → F</b> (V/IV), <b>D7 → G</b> (V/V), <b>E7 → Am</b> (V/vi).",
    "<b>Diminished passing chords:</b> a dim (or dim7) chord a semitone below the target: C♯dim → Dm, D♯dim → Em, F♯dim → G (or C/G), G♯dim → Am. The bass walks up chromatically.",
    "<b>2-5-1 into any chord:</b> treat the target as a temporary ‘1’ and play its 2 and 5 first. To reach F: Gm7 – C7 – F. To reach Am: Bm7♭5 – E7 – Am.",
    "<b>Chromatic passing chords:</b> chords that slide by a semitone into the target. Example: Em7 – E♭m7 – Dm7 (descending), or D♭7 – C (half step above). They work because the ear follows the smooth line.",
    "Passing chords are <i>decoration</i>. The main chords still carry the song, so passing chords should be lighter and shorter."
  ],
  application: [
    "Fill a long bar on one chord before moving: C (3 beats) – A7 (1 beat) – Dm.",
    "Gospel and worship transitions between sections often use a 2-5-1 into IV or vi.",
    "Use diminished walks in hymns and congregational songs to make the bass sing.",
    "Use chromatic descending m7 chords in slow ballads and neo-soul."
  ],
  examples: [
    { prog: "C A7 Dm G7 C", label: "Secondary dominant V/ii" },
    { prog: "C E7 Am F", label: "V/vi into the relative minor" },
    { prog: "C C#dim Dm D#dim Em F", label: "Diminished chromatic walk-up" },
    { prog: "C Gm7 C7 F", label: "2-5-1 into IV" },
    { prog: "Em7 Ebm7 Dm7 G7 C", label: "Chromatic descending m7s" },
    { prog: "F F#dim C/G A7 Dm7 G7 C", label: "Gospel turnaround combining all" }
  ],
  exercises: [
    "Play each secondary dominant into its target in C (A7–Dm, B7–Em, C7–F, D7–G, E7–Am). 4 times each.",
    "Walk C – C♯dim – Dm – D♯dim – Em at 70 bpm, LH bass, RH chords.",
    "Play a 2-5-1 into F, G and Am in the key of C.",
    "Take 1-4-5-1 (C F G C) and add one passing chord between each pair.",
    "Repeat all of the above in G and F, then in one sharp key and one flat key of your choice."
  ],
  assignment: "Arrange an 8-bar turnaround in C using at least one secondary dominant, one diminished passing chord, one 2-5-1 and one chromatic chord. Play it in C and in one other key.",
  mistakes: [
    "Giving passing chords too much time or volume.",
    "Using passing chords under busy lyrics where they clash with the melody.",
    "Forgetting the bass line: passing chords sound best when the bass moves by step."
  ],
  tips: [
    "Think ‘Where am I going?’ first, then choose the passing chord that leads there."
  ],
  related: ["chord-substitution", "aug-dim-chords", "connecting-chords", "cadences", "chord-movements"],
  tools: ["chordlab", "keyboard"]
},
{
  id: "passing-notes",
  module: "intermediate",
  title: "Passing Notes, Grace Notes & Slurs",
  level: 3,
  mins: 45,
  summary: "Decorate melodies and chords with passing notes, quick grace notes and smooth gospel slides.",
  theory: [
    "A <b>passing note</b> is a non-chord note that connects two chord tones by step. Over C, playing C – D – E: D is a passing note between C and E.",
    "A <b>neighbour note</b> steps away from a chord tone and back: E – F – E or E – D – E.",
    "<b>Chromatic passing notes</b> fill a whole step with a semitone: E – F – F♯ – G or G – G♯ – A.",
    "A <b>grace note</b> (acciaccatura) is a very quick note played just before the main note, almost at the same time. On keys it is often a black key crushed into a white key a semitone above (D♯ → E, G♯ → A).",
    "A <b>slur</b> means play the notes smoothly connected (legato). In gospel keys a slur often means a <b>slide</b>: slide one finger off a black key onto the white key next to it (E♭ → E) for a bluesy, vocal sound.",
    "These notes usually sit on <b>weak beats</b> or between beats. Strong beats should land on chord tones so the harmony stays clear."
  ],
  application: [
    "Fill gaps in a melody or between chords during interludes.",
    "Add grace-note slides (♭3 → 3) to right-hand chords in gospel and blues.",
    "Decorate a hymn melody on the last verse with passing notes to make it fresh.",
    "Use neighbour notes on a held chord to create gentle movement under the singer."
  ],
  examples: [
    { melody: "C4 D4 E4 F4 G4---", label: "Passing notes D and F between chord tones of C" },
    { melody: "E4 F4 E4 D4 E4---", label: "Upper and lower neighbour notes around E" },
    { melody: "E4 F4 F#4 G4 G#4 A4---", label: "Chromatic passing notes" },
    { melody: "C4 E4 D4 F4 E4 G4 F4 A4 G4---", label: "Scale in 3rds with passing motion" },
    "Grace note slide: over C, crush E♭ into E with one finger while holding C and G. Then try A♭ → A over F."
  ],
  exercises: [
    "Over a held C chord, play C–D–E–F–G and back with the right hand, landing on chord tones on beats 1 and 3. 60 bpm.",
    "Add neighbour notes around each chord tone of C, F and G (e.g. E–F–E, G–A–G).",
    "Practise the E♭→E grace-note slide 20 times, then F♯→G and B♭→B over G.",
    "Play a hymn melody (e.g. Amazing Grace) and add one passing note per phrase.",
    "Improvise 8 bars over C – Am – F – G using only chord tones on strong beats and passing notes between."
  ],
  assignment: "Take a simple melody (folk song or hymn) and write a decorated version with at least four passing notes, two neighbour notes and two grace notes. Play both versions.",
  mistakes: [
    "Putting passing notes on strong beats so they sound like wrong notes.",
    "Playing grace notes too slowly — they should be crushed, almost together.",
    "Overusing slides until every chord sounds the same."
  ],
  related: ["melodic-devices", "fills-licks-riffs", "runs", "counter-melodies", "solo-interlude"],
  tools: ["keyboard"]
},
{
  id: "syncopation-groove",
  module: "intermediate",
  title: "Syncopation & Groove",
  level: 3,
  mins: 45,
  summary: "Put accents off the beat and lock in with the band to make the music feel alive.",
  theory: [
    "<b>Syncopation</b> means placing accents on weak beats or between beats (the ‘&’s) instead of only on 1 2 3 4.",
    "Count in 8ths: <code>1 & 2 & 3 & 4 &</code>. Normal accents fall on 1 and 3. Syncopated accents fall on the &s, e.g. the ‘& of 2’ or the ‘& of 4’.",
    "A <b>push</b> (anticipation) is a chord played an 8th note early, on the & before the beat, and held over the bar line. Very common in gospel and pop worship.",
    "<b>Groove</b> is the repeating rhythmic feel that makes people move. It comes from steady time, consistent accents and leaving space (rests are part of the groove).",
    "Common feels: <b>straight 8ths</b> (pop/worship), <b>swing / shuffle</b> (blues, gospel: the & is late), <b>16th-note</b> grooves (funk, neo-soul).",
    "On keys, the left hand usually keeps the pulse (or locks with the kick drum) while the right hand plays syncopated chord stabs."
  ],
  application: [
    "Lock your left hand with the kick drum and your right hand with the snare or hi-hat.",
    "Use pushes into the chorus (play the new chord on the & of 4 before bar 1).",
    "In upbeat praise, short off-beat right-hand stabs leave room for guitars and vocals.",
    "In a band without a drummer, the keys player must carry the groove with clear syncopation."
  ],
  examples: [
    "Rhythm 1 (basic): RH chords on <code>1 . 2 . 3 . 4 .</code> — steady quarters.",
    "Rhythm 2 (off-beats): RH on <code>. & . & . & . &</code> — skank / reggae-style stabs.",
    "Rhythm 3 (Charleston): accents on <code>1</code> and the <code>& of 2</code>.",
    "Rhythm 4 (push): <code>1 . 2 . 3 . 4 &</code> — the next chord arrives on the & of 4 and is held over the bar line.",
    { prog: "C | G/B | Am | F", label: "Practise each rhythm over 1-5-6-4" },
    { prog: "C F | G C", label: "Two chords per bar with pushes on the & of 2 and & of 4" }
  ],
  exercises: [
    "With the metronome at 70 bpm, clap 8ths counting aloud, then accent only the &s. 2 minutes.",
    "Play Rhythm 1–4 above on a C chord, 8 bars each.",
    "Play C – G/B – Am – F using Rhythm 4 (pushes) at 80 bpm.",
    "Set the metronome on beats 2 and 4 only and play a groove over 1-5-6-4.",
    "Play along with a recording of an upbeat praise song, copying the keys or guitar rhythm."
  ],
  assignment: "Create two different 2-bar grooves over C – Am – F – G (one straight, one syncopated with pushes). Play each for 16 bars with the metronome at 80 bpm without drifting.",
  mistakes: [
    "Rushing the syncopated notes.",
    "Losing the beat after a push because you stopped counting.",
    "Playing too many notes — groove needs space."
  ],
  tips: [
    "Say the rhythm out loud (‘1 & 2 & …’) before playing it. If you can say it, you can play it."
  ],
  related: ["rhythm-basics", "playing-styles", "vamping", "band-dynamics", "diamonds"],
  tools: ["metronome"]
},
{
  id: "basic-voicing",
  module: "intermediate",
  title: "Basic Voicing — Close, Open & Cluster",
  level: 3,
  mins: 45,
  summary: "Arrange the notes of a chord in close, open and cluster voicings for different sounds.",
  theory: [
    "<b>Voicing</b> is how you arrange and spread the notes of a chord. The same chord can sound thin, full, bright or warm depending on the voicing.",
    "<b>Close voicing:</b> all notes within one octave, as close as possible. C = C E G or E G C. Clear and simple, good for beginners and busy music.",
    "<b>Open voicing:</b> notes spread over more than an octave. Example for C: LH C3 G3, RH E4 C5 (or LH C3 G3, RH E4 G4 C5). Big, full and warm, great for ballads and pads.",
    "<b>Cluster voicing:</b> notes a 2nd apart, packed together. Example: Cadd9 RH = D E G (with LH C), or F(add9) RH = G A C. Soft, modern and atmospheric.",
    "Rules of thumb: keep big gaps (5ths, octaves) in the low register, and close intervals (3rds, 2nds) higher up. Clusters below C3 sound muddy.",
    "Choose voicings so that the <b>top note</b> moves smoothly from chord to chord — that top line is what the ear follows."
  ],
  application: [
    "Close voicings in upbeat songs where rhythm is more important than richness.",
    "Open voicings on slow worship and ballads to fill the room.",
    "Cluster voicings in soft ministration and pad sounds, or to blend with guitars.",
    "Change voicing between verse (close, light) and chorus (open, full) to build dynamics."
  ],
  examples: [
    "Close: C = C4 E4 G4 · Am = C4 E4 A4 · F = C4 F4 A4 · G = B3 D4 G4.",
    "Open: C = LH C3 G3 + RH E4 C5 · F = LH F2 C3 + RH A3 F4.",
    "Cluster: Cadd9 = LH C3 + RH D4 E4 G4 · Fadd9 = LH F2 + RH G3 A3 C4.",
    { prog: "C Am F G", label: "Play this three times: close, then open, then cluster" },
    { prog: "Cadd9 Am7 Fadd9 Gsus4", label: "Cluster-friendly worship progression" }
  ],
  exercises: [
    "Play C, F, G and Am in close position with smooth top notes. 5 rounds at 60 bpm.",
    "Play the same chords in open voicing (LH root–5th, RH 3rd + root/5th).",
    "Make cluster voicings for Cadd9, Fadd9 and Gsus4 and connect them.",
    "Play 1-5-6-4 in C, switching voicing type every 4 bars.",
    "Repeat in G and D."
  ],
  assignment: "Accompany a song: verse in close voicing, pre-chorus in cluster, chorus in open voicing. Present it to your teacher and explain why each voicing suits that section.",
  mistakes: [
    "Clusters or 3rds in the low register (muddy).",
    "Jumping the hands around instead of moving to the nearest voicing.",
    "Doubling the 3rd too much in open voicings (sounds heavy)."
  ],
  related: ["inversions", "advanced-voicing", "voice-leading", "add9-chords", "tones-layers"],
  tools: ["keyboard"]
},
{
  id: "chord-movements",
  module: "intermediate",
  title: "Chord Movements — Inner, Chromatic, Melody- & Scale-Based, Octave",
  level: 3,
  mins: 60,
  summary: "Make a single chord come alive with inner movements, chromatic lines, melodic and octave motion.",
  theory: [
    "A <b>chord movement</b> is motion inside or on top of a chord while the harmony stays mostly the same. It keeps long chords interesting.",
    "<b>Basic inner movements:</b> <ul><li><b>1 – sus4 – 1:</b> C – Csus4 – C (E → F → E)</li><li><b>1 – sus2 – 1:</b> C – Csus2 – C (E → D → E)</li><li><b>5 – 6 – 5:</b> C – C6 – C (G → A → G)</li><li><b>Dominant sus:</b> G7sus4 – G7 (C → B)</li></ul>",
    "<b>Chromatic movements:</b> one voice moves by semitones while the rest hold. Major: C – Caug – C6 – C7 (G – G♯ – A – B♭). Minor line cliché: Am – AmMaj7 – Am7 – Am6 (A – G♯ – G – F♯).",
    "<b>Melody-based movements:</b> the top note follows (or answers) the song's melody while the left hand holds the chord.",
    "<b>Scale-based movements:</b> the right hand moves through the scale in 3rds or 6ths, or plays diatonic triads in a row (C – Dm – Em – F) over a held bass note.",
    "<b>Octave movements:</b> playing lines in octaves. LH octaves walking (C – D – E – F) give power; RH octave melodies cut through a band. Use in builds, intros and choruses."
  ],
  application: [
    "Use 1-sus4-1 and 5-6-5 under long held notes in worship.",
    "Use the minor line cliché in sad or reflective songs.",
    "Use scale-based triads over a pedal bass in intros and interludes.",
    "Use octave movements to build energy into a chorus or a key change."
  ],
  examples: [
    { prog: "C Csus4 C Csus2 C", label: "1-sus4-1 and 1-sus2-1 inner movements" },
    { prog: "C C6 C C6", label: "5-6-5 inner voice" },
    { prog: "C Caug C6 C7 F", label: "Chromatic rising line (major)" },
    { prog: "Am AmMaj7 Am7 Am6 F", label: "Minor line cliché (chromatic descending)" },
    { prog: "C Dm/C Em/C F/C C", label: "Scale-based triads over a C bass" },
    { melody: "C3 D3 E3 F3 G3---", label: "LH octave walk (play each note in octaves)" }
  ],
  exercises: [
    "Hold a C chord and play 1-sus4-1, 1-sus2-1 and 5-6-5 movements, 8 times each at 60 bpm.",
    "Play C – Caug – C6 – C7 – F and Am – AmMaj7 – Am7 – Am6 in C, G and F.",
    "Over LH C, play C – Dm – Em – F – Em – Dm – C triads in the right hand.",
    "Play a simple melody line in RH octaves over a C – F – G – C progression.",
    "Add at least one inner movement to every chord of a 1-5-6-4 progression without changing the chords."
  ],
  assignment: "Take a slow worship song and add a different chord movement (inner, chromatic, scale-based or octave) in each section. Play it for your teacher and name each movement.",
  mistakes: [
    "Moving so much that the singer loses the chord.",
    "Letting the left hand move at the same time as the inner voice (keep one anchor).",
    "Forgetting to resolve sus notes."
  ],
  tips: [
    "Movements are like seasoning: a little in the right place goes a long way."
  ],
  related: ["sus-chords", "aug-dim-chords", "relative-pedal", "fills-licks-riffs", "voice-leading"],
  tools: ["keyboard", "chordlab"]
},
{
  id: "relative-pedal",
  module: "intermediate",
  title: "Relative Movement & Pedal Chords",
  level: 3,
  mins: 50,
  summary: "Hold a pedal bass under moving chords and control how your voices move against each other.",
  theory: [
    "<b>Relative motion</b> describes how two voices (e.g. bass and top note) move compared to each other.",
    "<ul><li><b>Parallel:</b> both move in the same direction by the same interval (e.g. 3rds or 6ths).</li><li><b>Similar:</b> same direction, different intervals.</li><li><b>Contrary:</b> opposite directions — the strongest and most independent sound.</li><li><b>Oblique:</b> one voice stays still while the other moves.</li></ul>",
    "Avoid <b>parallel 5ths and octaves</b> between bass and melody in careful writing — they make the two voices sound like one. Parallel 3rds and 6ths sound sweet.",
    "A <b>pedal point</b> (pedal chord) is one bass note held or repeated while the chords above change. The name comes from organ pedals.",
    "<b>Tonic pedal</b> (bass on 1): C – Dm/C – Em/C – F/C – C. Calm and grounding. <b>Dominant pedal</b> (bass on 5): G – Am/G – F/G – G – C. Builds tension and expectation.",
    "Pedal points are a form of oblique motion: the bass stays, the upper voices move."
  ],
  application: [
    "Use a tonic pedal in intros and spontaneous worship so the room feels anchored.",
    "Use a dominant pedal to build before the final chorus or a key change.",
    "Use contrary motion between hands to make simple progressions sound professional.",
    "Bass players and keys players can share a pedal note to create a big, steady foundation."
  ],
  examples: [
    { prog: "C Dm/C Em/C F/C C", label: "Tonic pedal" },
    { prog: "G Am/G F/G G C", label: "Dominant pedal resolving home" },
    { prog: "C G/B Am Am/G F", label: "Descending bass vs rising top note (contrary motion)" },
    { prog: "F/C C F/C C", label: "Oblique motion — bass C stays, upper voices move" },
    "Parallel 3rds: RH E4/C4 → F4/D4 → G4/E4 over a moving bass."
  ],
  exercises: [
    "Hold LH C and play C – Dm – Em – F – G – F – Em – Dm in RH triads. 60 bpm.",
    "Hold LH G and play G – Am – F – G, then resolve to C.",
    "Play C – G/B – Am – Am/G – F with the RH top note rising (contrary motion).",
    "Write a 4-chord progression and label every pair of moves as parallel, similar, contrary or oblique.",
    "Use a tonic pedal intro for a song in G and D."
  ],
  assignment: "Create an 8-bar intro over a tonic pedal and an 8-bar build over a dominant pedal, then resolve into a chorus. Perform it and explain the motion between the hands.",
  mistakes: [
    "Changing the pedal note when the chords change (that cancels the effect).",
    "Too many parallel octaves between bass and melody.",
    "Staying on a dominant pedal so long that the tension becomes boring."
  ],
  related: ["voice-leading", "chord-movements", "slash-chords", "atmosphere", "key-transitions"],
  tools: ["keyboard", "chordlab"]
},
{
  id: "arpeggios",
  module: "intermediate",
  title: "Arpeggios",
  level: 3,
  mins: 45,
  summary: "Play chords one note at a time to create flowing accompaniment and solo lines.",
  theory: [
    "An <b>arpeggio</b> is a chord played one note at a time instead of all together. C arpeggio = C E G C.",
    "Standard fingering (RH, one octave): C(1) E(2) G(3) C(5). Two octaves: C(1) E(2) G(3) C(1) E(2) G(3) C(5) — the thumb passes under after G.",
    "<b>Broken-chord patterns</b> for the left hand: 1-5-8 (C G C), 1-5-8-10 (C G C E), 1-5-10 (C G E). These are the backbone of ballad accompaniment.",
    "Arpeggios work for any chord type: Am = A C E, G7 = G B D F, Cmaj7 = C E G B.",
    "In soloing, arpeggios outline the harmony: playing the notes of the current chord always sounds ‘right’.",
    "Rhythm matters: arpeggios in 8ths feel flowing, in triplets feel like a 6/8 ballad, in 16ths feel busy and exciting."
  ],
  application: [
    "Use LH 1-5-8-10 patterns in slow worship and hymns.",
    "Use RH arpeggios in intros, interludes and soft verses.",
    "Use arpeggios over a pad when playing alone with a singer.",
    "Use fast arpeggio runs to build into choruses."
  ],
  examples: [
    { melody: "C4 E4 G4 C5 G4 E4 C4-", label: "C major arpeggio up and down" },
    { melody: "A3 C4 E4 A4 E4 C4 A3-", label: "A minor arpeggio" },
    { melody: "G3 B3 D4 F4 D4 B3 G3-", label: "G7 arpeggio" },
    { melody: "C3 G3 C4 E4 F2 C3 F3 A3", label: "LH 1-5-8-10 pattern on C then F" },
    { prog: "C Am F G", label: "Accompany with arpeggios (8ths, 70 bpm)" }
  ],
  exercises: [
    "RH C, F and G arpeggios, 2 octaves, hands separately, 60 bpm in 8ths.",
    "LH 1-5-8-10 pattern on C – Am – F – G for 16 bars.",
    "Arpeggiate the diatonic 7th chords of C (Cmaj7, Dm7 … Bm7♭5).",
    "Hands together: LH broken chords, RH melody of a simple hymn.",
    "Arpeggios in all major keys over two weeks, 3 keys a day; raise tempo to 90 bpm."
  ],
  assignment: "Arrange a slow song using only arpeggiated accompaniment (no block chords) for the verse, and play it at a steady tempo for your teacher.",
  mistakes: [
    "Uneven rhythm, especially at the thumb crossing.",
    "Using the sustain pedal so much that the chords blur together.",
    "Playing arpeggios too high or too fast under a soft singer."
  ],
  related: ["triads", "lh-accompaniment", "finger-exercises", "solo-interlude", "sustain-pedal"],
  tools: ["keyboard", "metronome"]
},
{
  id: "solo-interlude",
  module: "intermediate",
  title: "Soloing Over Chords & Playing Interludes",
  level: 3,
  mins: 60,
  summary: "Build simple, musical solos and interludes using chord tones, the pentatonic scale and motifs.",
  theory: [
    "Every good solo is built on <b>target notes</b>: chord tones (1, 3, 5) on strong beats. Over C aim for C, E or G on beat 1; over F aim for F, A or C.",
    "The <b>major pentatonic</b> scale (C D E G A in C) has no clashing notes over most diatonic chords — a safe starting point. The <b>minor pentatonic / blues</b> scale (A C D E G, or C E♭ F G B♭) adds grit.",
    "Use <b>motifs</b>: a short idea (3–5 notes) that you repeat, vary and develop. Repetition makes a solo sound intentional.",
    "Use <b>call and response</b>: play a phrase, leave space, answer it. Space is part of the solo.",
    "An <b>interlude</b> is an instrumental section between verses or songs (often 4–8 bars). It can quote the song's melody, play the chorus chords with a new melody, or create a quiet moment.",
    "Shape: start simple and low, build up in range and rhythm, then come back down to hand over to the singer."
  ],
  application: [
    "Play a 4-bar interlude between verse and chorus using the chorus chords.",
    "Solo during an instrumental break or the end of a song.",
    "Fill the gap when the worship leader is speaking or praying (soft, simple).",
    "Lead the band into the next song with an interlude in the new key."
  ],
  examples: [
    { melody: "E4 G4 A4 G4 E4 D4 C4-", label: "Pentatonic motif over C" },
    { melody: "E4 G4 A4 G4 _ _ A4 C5 D5 C5 _ _ A4 G4 E4-", label: "Motif and developed answer" },
    { prog: "C G Am F", label: "Interlude progression — solo over 4 bars" },
    { prog: "F G Em Am | F G C", label: "Build-up interlude into the chorus" },
    "Target notes over C – G – Am – F: E – D – C – A on each beat 1 (a falling chord-tone line)."
  ],
  exercises: [
    "Over C – G – Am – F, play only the chord root on beat 1 of each bar, then only the 3rd, then only the 5th.",
    "Improvise with the C major pentatonic over the same progression for 16 bars, 70 bpm.",
    "Invent a 4-note motif and repeat it 4 times with small changes (rhythm, last note, octave).",
    "Play call-and-response: 2 bars playing, 2 bars rest, for 16 bars.",
    "Create an 8-bar interlude for a song you know and play it between verse and chorus."
  ],
  assignment: "Prepare an 8-bar interlude and a 16-bar solo over the chords of a worship song. Use a clear motif, target notes and at least one call-and-response.",
  mistakes: [
    "Playing too many notes with no space.",
    "Ignoring the chords and just running up and down the scale.",
    "Ending on a weak note instead of a chord tone."
  ],
  tips: [
    "Sing your solo first. If you can sing it, it will sound melodic."
  ],
  related: ["arpeggios", "passing-notes", "fills-licks-riffs", "melodic-ideas", "styles-blues-salsa"],
  tools: ["keyboard", "metronome"]
},
{
  id: "diamonds",
  module: "intermediate",
  title: "Diamonds, Hits & Stops",
  level: 3,
  mins: 40,
  summary: "Read and play diamonds, band hits, stops and pushes so the whole team moves together.",
  theory: [
    "A <b>diamond</b> (◇ or a diamond-shaped note on a chart) means: play the chord once and <b>let it ring</b> for the whole bar (or the length shown). Like a whole note held.",
    "Diamonds create space and drama — often used at the start of a bridge, at the end of a song, or when the leader wants the room to breathe.",
    "A <b>hit</b> (or stab, shown with an accent &gt; or ^) is a short chord the whole band plays together, often followed by silence.",
    "A <b>stop</b> means everyone stops playing (often written ‘STOP’ or with rests) while the singer continues or the room goes quiet. Then the band comes back in together.",
    "A <b>push</b> (anticipation) is a hit played just before the beat (usually the & of 4). On charts it is often shown with a ^ or a tie over the bar line.",
    "Everyone must count through diamonds and stops. The silence is still in time."
  ],
  application: [
    "Bridge starts: diamonds on each chord while the leader sings softly, then the band builds.",
    "Big endings: three hits together, then a final diamond.",
    "Stops in choruses: the congregation sings alone, then the band re-enters with power.",
    "Following the drummer's or band leader's cues (count-ins, hand signals) to hit together."
  ],
  examples: [
    "Chart: <code>| C ◇ | G ◇ | Am ◇ | F ◇ |</code> — one chord per bar, let ring.",
    "Chart: <code>| C &gt; &gt; &gt; | STOP | F | G |</code> — three hits, one bar silence, then back in.",
    { prog: "C | G | Am | F", label: "Practise as diamonds (one strike per bar)" },
    { prog: "F G C", label: "Ending hits: F (hit) G (hit) C (diamond)" }
  ],
  exercises: [
    "With the metronome at 70 bpm, play C – G – Am – F as diamonds, counting aloud through each bar.",
    "Play 4 bars of normal groove then 4 bars of diamonds, alternating for 32 bars.",
    "Practise hits on beats 1, 2&, and 4 of a bar, then one bar of silence.",
    "Read a chord chart with marked hits and stops and play it with a backing track.",
    "Rehearse a song section with a drummer or a friend, using hand signals for stops."
  ],
  assignment: "Mark diamonds, hits, pushes and stops on a chart for a song your team plays, then play it with the metronome (or band) exactly as marked.",
  mistakes: [
    "Not counting during diamonds and coming back in early or late.",
    "Using the sustain pedal on hits (they should be short and tight).",
    "Re-striking a diamond chord instead of letting it ring."
  ],
  related: ["reading-charts", "syncopation-groove", "band-dynamics", "dynamics", "intros-endings"],
  tools: ["metronome"]
},
{
  id: "find-the-key",
  module: "intermediate",
  title: "Finding the Key & Following the Singer",
  level: 3,
  mins: 50,
  summary: "Find a song's key by ear and respond quickly when the singer starts in, or shifts to, a different key.",
  theory: [
    "The <b>key</b> is the home note and scale of a song. The home chord (I) is where the song feels finished.",
    "<b>Finding the key by ear:</b> <ul><li>Listen to the last note or chord of the song or chorus — it is usually the tonic.</li><li>Hum the note that feels like ‘home’ and find it on the keyboard.</li><li>Find the bass notes: the most common, most restful bass note is usually 1.</li><li>Test: play I – IV – V in your guessed key. If they fit the song, you are right.</li></ul>",
    "Clues: a major chord a 5th above the tonic (V) leading home; a minor chord on 6 (vi) suggests a major key, not minor.",
    "<b>When the singer starts in a different key:</b> stop or play very softly, listen to their first long note, find it, then work out which chord degree it belongs to (often 1, 3 or 5 of I).",
    "<b>When the singer shifts key mid-song:</b> drop to a single note or bass only, find their new tonic, then rebuild the chords. Common shifts are up a semitone or a whole tone.",
    "To move with the singer, use the V7 of the new key as a pivot (e.g. from C up to D♭: play A♭7 then D♭)."
  ],
  application: [
    "Spontaneous worship: the leader starts a chorus without telling the band the key.",
    "A soloist sings a hymn in a key that suits their voice, not the chart key.",
    "A congregation drifts flat during a long a cappella section.",
    "Joining a song that is already playing (e.g. at a crusade or rehearsal)."
  ],
  examples: [
    { prog: "C F G C", label: "Key test: I – IV – V – I" },
    { prog: "C F G C | Ab7 | Db Gb Ab Db", label: "Following the singer up a semitone (C → D♭)" },
    { prog: "C F G C | A7 | D G A D", label: "Following the singer up a whole tone (C → D)" },
    "Quick trick: if the singer's long note sounds like the ‘do’ of the song, that is your new I. If it sounds like ‘mi’, the key is a major 3rd below it."
  ],
  exercises: [
    "Your teacher plays a short melody; you find the home note within 3 tries. Repeat 10 times.",
    "Listen to 5 worship songs and find their keys using the last chord and I–IV–V test.",
    "Teacher sings the start of a known song in a random key; you find I, IV and V.",
    "Practise moving C → D♭ and C → D with V7 pivots, then G → A♭ and G → A.",
    "Play along with a singer who changes key without warning; aim to recover within 2 bars."
  ],
  assignment: "Find the keys of 10 songs by ear (write the key and the method you used), then demonstrate following your teacher's voice through two unannounced key shifts.",
  mistakes: [
    "Continuing loudly in the wrong key instead of dropping out and listening.",
    "Guessing the key from the first chord (many songs start on IV or vi).",
    "Panicking — stay calm, play less, listen more."
  ],
  tips: [
    "When lost, play only the bass note you hear the singer resolve to. One correct note beats ten wrong chords."
  ],
  related: ["all-keys", "nashville", "key-transitions", "modulation", "key-change-timing"],
  tools: ["keyboard", "circle"]
},
{
  id: "styles-blues-salsa",
  module: "intermediate",
  title: "Blues, Walking Bass & Salsa",
  level: 3,
  mins: 60,
  summary: "Play the 12-bar blues, blues scale, a walking bass line and a basic salsa montuno over clave.",
  theory: [
    "<b>12-bar blues</b> uses I7, IV7 and V7 (all dominant 7ths). In C: <code>C7 C7 C7 C7 | F7 F7 C7 C7 | G7 F7 C7 G7</code>.",
    "<b>Blues scale</b> (C): C E♭ F F♯ G B♭ C — 1 ♭3 4 ♯4 5 ♭7. The ♭3 and ♯4/♭5 are the ‘blue notes’. Slide E♭ → E for the classic sound.",
    "Blues is usually played with a <b>swing / shuffle</b> feel: each beat split long-short (triplet feel).",
    "<b>Walking bass</b>: a LH line of steady quarter notes. Basic recipe per bar: root – 3rd – 5th – 6th (C E G A), or use a <b>chromatic approach</b> note on beat 4 a half step above or below the next root (C E G B → F).",
    "<b>Salsa</b> is built on the <b>clave</b>. In <b>2-3 son clave</b> (two bars): bar 1 (the ‘2 side’) hits beats 2 and 3; bar 2 (the ‘3 side’) hits beats 1, the & of 2, and 4.",
    "The piano plays a <b>montuno</b>: a repeating syncopated pattern, often in octaves with chord tones, over chords like I – IV – V – IV (C F G F) or i – iv – V (Cm Fm G7). It must line up with the clave."
  ],
  application: [
    "Blues and shuffle grooves are the base of much gospel, soul and rock playing.",
    "Walking bass is useful when there is no bass player, especially for upbeat hymns and jazz-style gospel.",
    "Salsa montunos bring energy to Latin-style praise songs and celebrations.",
    "Blues licks with ♭3 → 3 slides add flavour to gospel fills."
  ],
  examples: [
    { prog: "C7 C7 C7 C7 | F7 F7 C7 C7 | G7 F7 C7 G7", label: "12-bar blues" },
    { melody: "C4 Eb4 F4 F#4 G4 Bb4 C5-", label: "C blues scale" },
    { melody: "C3 E3 G3 A3 F3 A3 C4 D4 C3 E3 G3 B2", label: "Walking bass: C7 – F7 – C7 with approach note" },
    { prog: "C F G F", label: "Salsa montuno progression (I – IV – V – IV)" },
    "2-3 clave count: Counting 8ths <code>1 & 2 & 3 & 4 &</code>: bar 1 = <code>. . X . X . . .</code> (beats 2, 3); bar 2 = <code>X . . X . . X .</code> (beats 1, & of 2, 4)."
  ],
  exercises: [
    "Play the 12-bar blues in C with LH roots and RH 7th chords, 80 bpm swing. 3 choruses.",
    "Play the C blues scale up and down, 2 octaves, RH. Then improvise over the 12-bar using it.",
    "Walk a bass line through the 12-bar using root-3-5-6, then add chromatic approach notes.",
    "Clap 2-3 clave with the metronome at 80 bpm for 2 minutes, counting aloud.",
    "Play a simple octave montuno on C – F – G – F while a partner claps the clave."
  ],
  assignment: "Perform a 12-bar blues in C (one chorus with chords, one with blues-scale solo, one with walking bass), then 16 bars of a C – F – G – F montuno locked to 2-3 clave.",
  mistakes: [
    "Playing major 7ths (B) instead of dominant 7ths (B♭) in blues.",
    "Losing the swing feel and playing straight 8ths.",
    "Starting the montuno on the wrong side of the clave."
  ],
  related: ["dom7-chords", "syncopation-groove", "solo-interlude", "playing-styles", "fills-licks-riffs"],
  tools: ["keyboard", "metronome"]
},
{
  id: "counter-melodies",
  module: "intermediate",
  title: "Counter-Melodies",
  level: 3,
  mins: 50,
  summary: "Write and play a second melody that supports the main tune without fighting it.",
  theory: [
    "A <b>counter-melody</b> is a second, independent melody played or sung at the same time as the main melody. It supports and answers it.",
    "<b>Fill the gaps:</b> when the main melody holds a long note or rests, the counter-melody moves. When the main melody is busy, the counter-melody holds or rests.",
    "<b>Contrary motion:</b> if the melody goes up, the counter-melody often goes down. This keeps the two lines clearly separate.",
    "Use <b>chord tones</b> on strong beats, and favour 3rds and 6ths against the melody. Avoid doubling the melody in unison or octaves for long stretches.",
    "Keep a different <b>register</b>: if the singer is in the middle, put the counter-melody higher (RH) or lower (LH tenor line).",
    "<b>Licks</b> are short, ready-made melodic phrases (often from blues and gospel). A counter-melody can be built from small licks placed in the spaces of the vocal line."
  ],
  application: [
    "Last chorus: add a high RH counter-melody over the congregation's singing.",
    "Instrumental intros: play the main melody in LH and a counter-melody in RH.",
    "Choir and band arranging: give a counter-line to strings, synth or a second vocal.",
    "Answer the leader's phrases with short licks in the gaps (call and response)."
  ],
  examples: [
    { melody: "C4 D4 E4 F4 G4--- G4 F4 E4 D4 C4---", label: "Main melody (own phrase)" },
    { melody: "E5--- D5 C5 B4 C5 B4--- C5 D5 E5-", label: "Counter-melody: holds while melody moves, moves while it holds" },
    { prog: "C G/B Am F", label: "Practise a descending counter-line E – D – C – C over 1-5-6-4" },
    "Hymn idea: while the congregation sings a held note at the end of a phrase, play a 3-note lick that steps down to the next chord's 3rd."
  ],
  exercises: [
    "Sing or play a simple melody and mark every long note or rest — these are the counter-melody's spaces.",
    "Over C – G/B – Am – F, play a counter-line using only the 3rd of each chord (E – D – C – A).",
    "Write a 4-bar counter-melody in contrary motion to a given melody.",
    "Play a hymn melody in LH and add a RH counter-melody using 3rds and 6ths.",
    "Learn three short licks and place them in the gaps of a worship song's chorus."
  ],
  assignment: "Write a counter-melody for the chorus of a song your team plays. It must fill gaps, use contrary motion at least twice, and stay in a different register from the singer. Play it with someone singing the main melody.",
  mistakes: [
    "Playing the counter-melody as loud as the main melody.",
    "Moving at the same time as the singer (the lines fight).",
    "Doubling the melody instead of creating a new line."
  ],
  tips: [
    "Think of the counter-melody as a background singer: it supports, it doesn't take the spotlight."
  ],
  related: ["melody-structure", "melodic-devices", "passing-notes", "solo-interlude", "melody-with-chords"],
  tools: ["keyboard"]
}
);
