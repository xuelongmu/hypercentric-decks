# AGENTS.md

This repo contains a static Reveal.js sponsorship deck.

## Essentials

- Primary file: `sponsorship-deck/index.html`
- Generative Challenge deck: `generative-production-challenge/index.html`
- Keep asset paths relative to `sponsorship-deck/index.html`.
- For Generative Challenge image swaps, optimize/copy source images into `generative-production-challenge/assets/`; slide 9 uses `assets/zerospace-stage-zmx.webp` from `tmp/zerospace-stage-zmx.jpg`.
- Do not add a build system unless asked.
- Keep the deck at 1920 x 1080 unless asked to change format.
- When changing sponsor-facing facts, update related references in `docs/`.

## Verify

These are static Reveal.js HTML decks. For visual edits, serve the target deck, render/check at 1920 x 1080, and check for broken assets, clipped text, low contrast, and layout regressions.
