# Hypercentric Decks

This repository contains static sponsorship presentations for ZeroSpace Labs. The decks are built as Reveal.js presentations with local image, logo, video, and font assets.

## Repository Structure

```text
sponsorship-deck/
  index.html            # Reveal.js sponsorship deck
  assets/               # Venue, event, and ZeroSpace Labs imagery
  bts-pics/             # Behind-the-scenes event photos
  bts-video/            # Local video loops and example deliverables
  font/                 # Local OCR A Std font
  logos/                # Sponsor and partner logos
generative-production-challenge/
  index.html            # Specialized sponsor deck for the Generative Production Challenge
  copy.md               # Editable slide copy source
  sync-copy.mjs         # Syncs copy.md blocks into index.html
  assets/               # Local imagery copied from the source deck
  bts-pics/             # Event and production stills used in the deck
  bts-video/            # Local video loop used in the deck
  font/                 # Local OCR A Std font
docs/
  ZeroSpace Labs Sponsorship Deck - Updated Outline and Copy.md
```

## Viewing the Deck

The deck can be opened directly in a browser:

```powershell
start .\sponsorship-deck\index.html
```

For a local web server, run one of:

```powershell
cd sponsorship-deck
python -m http.server 8000
```

```powershell
cd generative-production-challenge
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Editing Generative Production Challenge Copy

Edit the copy blocks in `generative-production-challenge/copy.md`, then sync them into the Reveal deck:

```powershell
cd generative-production-challenge
node .\sync-copy.mjs
```

To verify the Markdown and HTML are already aligned:

```powershell
node .\sync-copy.mjs --check
```

## Runtime Notes

- The deck uses Reveal.js from a CDN, so internet access is needed unless Reveal.js is vendored locally.
- Google Fonts are loaded from the web; `font/OCR A Std Regular.ttf` is bundled locally.
- Most imagery and videos are local, but the livestream thumbnail is loaded from YouTube.
- There is no package manager, build step, or test runner currently configured.

## Content Documentation

The updated outline in `docs/ZeroSpace Labs Sponsorship Deck - Updated Outline and Copy.md` reverse engineers the current HTML deck and cross-references it with the older ZeroSpace outline at:

```text
D:\zerospace-decks\docs\ZeroSpace Labs Sponsorship Deck - Outline and Copy.md
```

Use the docs file as the source for copy review, content audits, and future deck revisions.

## Editing Guidance

- Keep asset paths relative to `sponsorship-deck/index.html`.
- Preserve the 1920 x 1080 Reveal.js dimensions unless redesigning the entire deck.
- When changing claims, update both the slide copy and the documentation in `docs/`.
- If cadence, pricing, or attendance metrics change, check every slide that references the same fact.
