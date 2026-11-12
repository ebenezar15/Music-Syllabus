# Syllabus Studio 🎹

An interactive app for organising, structuring and scheduling a music teaching syllabus. It covers piano and worship keys, melody, and acoustic guitar, from beginner to advanced.

**To open it:** open `index.html` in any browser. There is no build step and no install. You can also serve the folder with `python3 -m http.server` and visit `http://localhost:8000`.

## What's inside

| Area | What it does |
|---|---|
| **Syllabus** | 94 lessons in 10 modules, in teaching order. Each lesson has **theory, application, examples, exercises, an assignment**, common mistakes and teacher tips. You can search and filter by level or module. |
| **Playable examples** | Tap any chord to hear it and see it on the keyboard. Every progression **transposes to any of the 12 keys**, and you can play it in block, broken, arpeggio or pad style. |
| **Schedules** | The full pathway (Level 1 → 4, 60 weekly lessons), three specialist tracks (Melody, Worship/Sermon Background, Guitar) and **7 crash courses**: Weekend, 2-week, 4-week bootcamp, Melody intensive, Harmony masterclass, Sermon background, Guitar starter. Set a start date to get dated lessons, and tick lessons off as you teach them. |
| **Chord Library** | Your own directory of chords, voicings, licks and progressions. You can browse it by chord type, root, voicing style, application tag, syllabus lesson or level. **Building a voicing:** tap the notes on the keyboard, build one from a symbol in 8 voicing styles (close, open 1-5-10, worship spread, shell, rootless, drop 2, quartal, cluster), or hold a chord on your computer keys or a MIDI keyboard. The app names the chord for you. **Each entry also holds:** your notes and application, a playable progression in context, **piano-roll captures** (recorded from the on-screen keys, computer keys or a MIDI keyboard, with count-in, click and quantise), **microphone recordings** or uploaded audio, and **images** such as chart photos or DAW piano-roll screenshots. Any entry can be heard and seen in any of the 12 keys. Entries can be linked to lessons and show up on those lesson pages. The library starts with 17 example entries, and you can back it up and restore it as a JSON file. |
| **Routine planner** | Build your own teaching order. Add lessons, drag to reorder and set the minutes for each. You can export or import your plan as JSON, and print it. It also generates a daily practice routine for any length and level. |
| **Practice tools** | **Chord Lab** shows the chord family, Nashville numbers, functions, primary and secondary chords, relative subs, secondary dominants, tritone subs, borrowed chords and the negative-harmony mirror, plus a key transition finder. Also included: an interactive keyboard (chords and scales), an interactive circle of 4ths and 5ths, a metronome with tap tempo, and practice backing tracks with drums. |
| **Cheat sheets** | LH accompaniment (single and multi-note), major and minor chords, inversions, scales with formulas, scale degrees, chord families in 12 keys, circles, time exercise sheets you can play, practice tracks, and a guitar fretboard chart with 3rds/4ths/5ths/6ths double stops. |
| **Colour schemes** | 9 themes (Sunrise, Midnight Keys, Ocean, Forest, Royal Worship, Rose, Studio Mono, Neon Groove, Ember). There is a shuffle button and an option to change the scheme on every visit. |

Progress, notes, ticked exercises and plans are saved in your browser (localStorage). Chord Library entries, recordings and captures are saved in your browser's IndexedDB. Use **Back up library** to keep a copy or move it to another device.

## Riffbook ✎ (`riffbook/index.html`)

A separate app: your personal notebook for **your own improvisations, chord movements and hand placements**. It works like a notes app, with musical blocks and your own comments.

- **Topics:** the library is organised as a tree of topics you control, for example Movements → 6-1, 2-5-1; Passing chords → Diminished; Substitutions; Voicings; Licks & runs; Songs. You can add, nest, rename and delete topics. Every topic has its own page with a **quick-add box**. Type a title, chords and a line of text, press Enter, and the page stays open so you can keep adding.
- **Library home:** topic cards with counts, a "Try this today" note picked at random, and your recently edited notes. **🎲 Inspire me** opens a random note from the library or the current topic.
- **Note cards:** notes show as cards. You can play the chords on a card without opening the note.
- **Notes:** each note has a title, type (Improvisation, Chord movement, Placement, Lick/run, Idea, Song arrangement), status (New idea → Practising → Ready to use → Mastered), key, tempo, topic and tags. You can pin and favourite notes.
- **Writing:** simple formatting (`# heading`, `**bold**`, `- list`). Write `[Cmaj7]` and it becomes a chord you can tap. Write `[[Note title]]` to link another note. Backlinks show which notes link to this one.
- **Blocks:** you can add six kinds:
  - chord progressions you can play (block, broken, arpeggio or pad)
  - hand placements on a keyboard diagram, with left/right hand and finger numbers, and the chord named for you
  - piano-roll takes recorded from computer keys, the on-screen keys or a MIDI keyboard (count-in, click, quantise)
  - microphone recordings or uploaded audio
  - images
  - checklists
- **My comments:** timestamped personal comments, each marked as 💡 idea, ✅ works, ⚠️ tricky, ❤️ love it or ❓ question. A comment can point at one block of the note.
- **Practice:** each note has a practice log (minutes, tempo, how it went), totals, and a tempo progress chart. **Practice mode** gives you a timer, a metronome and the note's chords on a loop, then logs the session. The sidebar shows a 12-week practice heatmap.
- **View in any key:** chords, placements and piano rolls in a note can be shown in any key. Make that key permanent with one tap.
- **Organising:** smart lists (All, Pinned, Favourites, Practising, **Revisit** for notes you haven't practised in a week, Mastered), plus the topic tree, types and tags. Search covers the whole library.
- **Starting notes:** templates (Improvisation, Chord movement, Hand placement, Lick, Song, Blank), and a **Quick idea** button that records audio straight into a new note.
- **Shortcuts and data:** `N` makes a new note and `/` jumps to search. Back up and restore as a JSON file, recordings included. The same 9 colour schemes and Avenir Next typography as Syllabus Studio.

### Where to run Riffbook

| Way | MIDI keyboard | How |
|---|---|---|
| **Website (GitHub Pages)** | ✅ in Chrome or Edge | `https://<your-user>.github.io/Music-Syllabus/riffbook/`, deployed automatically by `.github/workflows/pages.yml` on every push. |
| **Installed web app** | ✅ | Open the website in Chrome and choose the install icon in the address bar (or ⋮ → Cast, save and share → Install). Riffbook gets its own Dock icon and window, and works offline. |
| **Mac app** | ✅ | Download `Riffbook-mac.dmg` from the repository's **Releases** page ("Riffbook for Mac"). It is built by `.github/workflows/mac-app.yml` on a GitHub Mac runner, for Apple silicon and Intel. The app isn't signed with an Apple developer certificate, so the first time you open it: right-click → Open → Open. |
| **Claude artifact** | ❌ blocked by the viewer | Computer keys and on-screen keys only. |

Each of these keeps its own copy of your notes. Use **Back up** and **Restore** to move them from one to another.

To build the Mac app yourself: `cd desktop && npm install && npm run dist` (on a Mac). `npm start` runs it without packaging.

### What makes it different

- **Rewind:** once a MIDI keyboard is connected, Riffbook is always listening and keeps the last 5 minutes. When you play something good, press **30 s**, **2 min** or **5 min**. That stretch becomes a note with a piano roll and the chords already named.
- **12-key drill:** press **⟳ 12 keys** on any chord progression. It walks you round the circle of 4ths and listens. When it hears the right chord, in any voicing, it moves on, and at the end it logs the practice. Without MIDI, press Space to step through.
- **Find by playing:** press **🎹 Find by playing**, hold a chord, and let go. You see every note in your library that uses it.
- **Number view:** the **1 4 5** button shows every chord as its Nashville number in the note's key, so `Am G/B C` becomes `6m 5/7 1`.
- **MIDI file export:** **⬇ .mid** on any take saves a standard MIDI file you can drag into Logic, GarageBand or any DAW.
- **App sound switch:** turn the app's own piano sound off if your keyboard already makes sound.

### Capturing from your MIDI keyboard

Plug a USB/Bluetooth MIDI keyboard into your computer, open the app from this repository in **Chrome or Edge**, and either click **🎹 MIDI capture** in Riffbook or **Connect MIDI keyboard** in the Chord Library editor. Then:

- **Live chord names:** the name of whatever you're holding shows up as you play, for example `Cmaj7/E` or `Dm9`.
- **The whole movement:** recording starts on your first note, with no count-in. Notes, timing, velocity and the **sustain pedal** are all recorded.
- **Chord detection:** when you stop, the take is split into chords. Each chord is named and marked on the piano roll, and you can tap to hear any of them. One tap adds them as a **playable progression** (`C F/A G/B C`), or as **keyboard diagrams of each voicing**.
- **Grab what I hold:** on a hand placement, hold a chord and let go. The exact voicing and its name are captured.

How it detects chords: a new chord starts when two or more notes are struck together, or when the bass moves. Single notes over a held chord count as melody or passing notes. A held bass under changing right-hand chords works (Am then Am7). Broken or arpeggiated patterns are detected best with the sustain pedal down.

MIDI needs a secure page: `file://`, `http://localhost`, or https. The simplest way is `python3 -m http.server` in this folder, then open `http://localhost:8000/riffbook/`. Browsers block MIDI inside the Claude artifact viewer, so the published links use the computer keys and the on-screen keyboard instead. Chord detection works the same there.

Notes are saved in your browser (IndexedDB). In the published version they live in your own private storage.

## Fonts: Avenir Next

The app uses **Avenir Next** everywhere. It is built into Apple devices (Mac, iPhone, iPad), so it shows there automatically. Avenir Next is a licensed font. To use it on Windows or Android, put your licensed files in a `fonts/` folder (`AvenirNext-Regular.woff2`, `-Medium`, `-DemiBold`, `-Bold`). Then add `url('../fonts/<file>.woff2') format('woff2')` to the matching `@font-face` rules at the top of `css/styles.css`. Without those files, the app falls back to Nunito Sans, which looks similar.

## Project layout

```
index.html            app shell
css/styles.css        themes + layout
js/music.js           music engine: spelling, chords, keys, transposition, Web Audio
js/curriculum.js      modules, schedules, crash courses, cheat-sheet data
js/topics/*.js        lesson content (one file per module)
js/app.js             UI: router, views, tools
js/library.js         Chord Library: storage, directory, editor, piano-roll capture, recordings
js/library-seed.js    starter library entries
js/music-ui.js        shared keyboard diagrams, piano rolls, note input (Chord Library + Riffbook)
riffbook/             Riffbook app (index.html, riffbook.css, riffbook.js)
```

### Adding or editing a lesson

Edit the module's file in `js/topics/`. Each lesson is a plain object (`id, module, title, level, mins, summary, theory[], application[], examples[], exercises[], assignment, mistakes[], tips[], related[], tools[]`). Write playable progressions in the key of C, e.g. `{ prog: 'C Am F G', label: '1-6-4-5' }`. The app transposes them for you.
