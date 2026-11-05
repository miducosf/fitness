# Afternoon Pump — iPhone workout tracker

An installable, self-contained Progressive Web App (PWA) for guided workouts.

## What it does

- Five preset workouts: strength on Monday, Wednesday, Friday; mobility and core on Tuesday and Thursday.
- Guided exercise-by-exercise, set-by-set flow with form cues.
- Record weights (machine stack or pounds per dumbbell), repetitions, or time holds.
- Automatically start a rest countdown after every set. Skip rest or add 30 seconds.
- Remembers your most recently logged weight for each exercise, and resumes unfinished workouts.
- Lets you skip an exercise, undo the last logged set, or add up to two finishers.
- History by session, adjustable rest defaults, and downloadable JSON backups.
- Everything works without a server once first installed and cached (after the first successful online visit).

## Put it on your iPhone using GitHub Pages

1. Extract `afternoon-pump.zip` on your computer.
2. At github.com, create a **public** repository called `afternoon-pump` (or another name).
3. Upload **all files from inside the `afternoon-pump` folder** to the root of that repo, including `index.html`, `app.js`, `styles.css`, `sw.js`, `manifest.webmanifest`, and the PNG icons. Do not upload only the ZIP; Pages needs the extracted files.
4. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**; select `main` and `/(root)`, then **Save**.
5. Wait for the published URL, usually `https://YOUR-USERNAME.github.io/afternoon-pump/`, and open it in **Safari on your iPhone**.
6. Use the Safari **Share** menu → **Add to Home Screen** → **Add**.
7. Launch from the Home Screen and start logging workouts.

On GitHub Pages (HTTPS), the app registers a service worker so it can reopen offline after the assets have been cached. It doesn't require a GitHub login after installation.

## Important limitations

- Workout data is saved **locally on this device** (`localStorage`). It does *not* sync to iCloud, another iPhone, or a computer.
- Clearing Safari/website data, deleting the installed web app, or changing the website address can remove locally saved history. **Export backups regularly** from Settings → Export backup. Save them in Files/iCloud Drive. You can re-import them later.
- Countdown displays while the app is active. iOS may pause updates in the background or while the phone is locked; the timer's target time is still stored and will catch up when you return. It does not send lock-screen alerts.
- Exercise guidance is general and not a substitute for individualized medical or training advice.
- You can adjust all routine definitions and exercise tips in the `EX` and `ROUTINES` constants at the top of `app.js`.

## Editing the app later

Change styles in `styles.css` and routines in `app.js`. When uploading an update, change the version string in `sw.js` (e.g., from `afternoon-pump-v1` to `afternoon-pump-v2`) so installed clients cache the new assets.

No external libraries, analytics, cookies, or user accounts are used.
