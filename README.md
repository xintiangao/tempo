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
