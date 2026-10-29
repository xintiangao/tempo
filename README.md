# Workout Interval Timer

A mobile-first Svelte 5 / SvelteKit interval timer, styled with Tailwind CSS and a calm sage palette. Static deployment, no backend or external runtime resources.

## Develop

Requires Node.js 22.12+ (validated with Node 24).

```sh
npm ci --cache /tmp/tempo-npm-cache
npm run dev
```

```sh
npm run check
npm run build
npm run preview
```

Deploy the generated `build/` directory to an HTTPS static host. The service worker caches the complete application after the first successful online visit. HTTPS is required for service workers and wake lock outside localhost. On iPhone, open the site in Safari and choose Share → Add to Home Screen.

## Features

- Editable rounds, work/rest intervals, optional sets and rest between sets
- Voice announcements, selectable remaining-time cues and final countdown beeps
- Local saved presets, notes and remembered configuration
- Timestamp-based phase timing, pause/resume, skip and completion screen
- Screen Wake Lock, looping silent HTML audio, Media Session metadata and play/pause/next actions where supported
- Offline service worker, standalone manifest, iOS metadata and touch icons

Rest occurs between rounds; there is no final rest after a set. Between sets, the configured set rest replaces ordinary round rest. The total includes work and all applicable rests.

## iOS limits

Audio starts from the Start button gesture. Safari can still suspend a PWA or silent playback when locked or backgrounded. The timer reconciles elapsed time on return, but speech/beeps cannot be guaranteed during suspension or recovered retroactively. Keep the app visible for dependable cues. Wake lock and Media Session actions depend on the browser; physical iPhone testing is needed before claiming lock-screen reliability.

## Validation

`npm run check` and `npm run build` pass. A production Chromium smoke run verified duration editing, preset saving, starting, pausing/resuming, timed phase transition, skipping, stopping and service-worker offline reload with no browser runtime errors. Responsive layouts were checked at 390px and 1440px. Actual iOS hardware behavior remains unverified.

## GitHub Pages

In repository **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. The `Deploy timer to GitHub Pages` workflow builds and deploys every push to `main`; it can also be run manually from the Actions tab. After a successful deployment the site is at https://xintiangao.github.io/tempo/.

The workflow builds with `BASE_PATH=/tempo` so service-worker scope, audio, icons and the app manifest work under the repository URL. To validate this deployment locally:

```sh
BASE_PATH=/tempo npm run build
npm run preview
```

For a root-domain deployment, omit `BASE_PATH`.

## Workout reload recovery and iOS audio

Active workouts are checkpointed locally before audio cues and whenever they are paused, resumed or skipped. After a page reload, an unfinished workout is restored paused at its current phase and remaining time, accounting for time elapsed while running. Tap Play to continue. Stopping or completing clears the checkpoint. Recovery needs browser storage to be available; it does not sync across devices.

On iPhone/iPad, spoken announcements default to off each time the page loads, and the silent HTML audio loop is disabled to avoid overlapping audio playback paths. Beep cues remain enabled. Speech can be explicitly enabled in Audio settings, but device testing is needed: browser speech errors are handled, while an operating-system browser-process crash cannot be caught in JavaScript. Keeping the screen visible is still recommended.

Run `npm test` for recovery tests. Chromium regression checks also covered reloading after the 30-second cue, paused recovery/resume, skipping, stopping, iOS safety defaults (emulated user agent), and simulated speech API exceptions. These checks do not reproduce or establish a fix for a physical iPhone Safari crash.
