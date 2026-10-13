# Syllabus Studio 🎹

An interactive app for organising, structuring and scheduling a music teaching syllabus. It covers piano and worship keys, melody, and acoustic guitar, from beginner to advanced.

**To open it:** open `index.html` in any browser. There is no build step and no install. You can also serve the folder with `python3 -m http.server` and visit `http://localhost:8000`.

## What's inside

| Area | What it does |
|---|---|
| **Syllabus** | 94 lessons in 10 modules, in teaching order. Each lesson has **theory, application, examples, exercises, an assignment**, common mistakes and teacher tips. You can search and filter by level or module. |
| **Playable examples** | Tap any chord to hear it and see it on the keyboard. Every progression **transposes to any of the 12 keys**, and you can play it in block, broken, arpeggio or pad style. |
| **Schedules** | The full pathway (Level 1 → 4, 60 weekly lessons), three specialist tracks (Melody, Worship/Sermon Background, Guitar) and **7 crash courses**: Weekend, 2-week, 4-week bootcamp, Melody intensive, Harmony masterclass, Sermon background, Guitar starter. Set a start date to get dated lessons, and tick lessons off as you teach them. |
| **Routine planner** | Build your own teaching order. Add lessons, drag to reorder and set the minutes for each. You can export or import your plan as JSON, and print it. It also generates a daily practice routine for any length and level. |
| **Practice tools** | **Chord Lab** shows the chord family, Nashville numbers, functions, primary and secondary chords, relative subs, secondary dominants, tritone subs, borrowed chords and the negative-harmony mirror, plus a key transition finder. Also included: an interactive keyboard (chords and scales), an interactive circle of 4ths and 5ths, a metronome with tap tempo, and practice backing tracks with drums. |
| **Cheat sheets** | LH accompaniment (single and multi-note), major and minor chords, inversions, scales with formulas, scale degrees, chord families in 12 keys, circles, time exercise sheets you can play, practice tracks, and a guitar fretboard chart with 3rds/4ths/5ths/6ths double stops. |
| **Colour schemes** | 9 themes (Sunrise, Midnight Keys, Ocean, Forest, Royal Worship, Rose, Studio Mono, Neon Groove, Ember). There is a shuffle button and an option to change the scheme on every visit. |

Progress, notes, ticked exercises and plans are saved in your browser (localStorage).

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
```

### Adding or editing a lesson

Edit the module's file in `js/topics/`. Each lesson is a plain object (`id, module, title, level, mins, summary, theory[], application[], examples[], exercises[], assignment, mistakes[], tips[], related[], tools[]`). Write playable progressions in the key of C, e.g. `{ prog: 'C Am F G', label: '1-6-4-5' }`. The app transposes them for you.
