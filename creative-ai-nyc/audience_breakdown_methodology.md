# Slide 10 Audience Persona Methodology

## Purpose

This note documents the audience persona figures for slide 10 of `index.html`, using the latest selected event CSVs and first-party Luma registration responses.

The goal is to keep the slide directionally useful for sponsorship storytelling while being clear that the persona mix is extrapolated from survey respondents, not directly observed for every approved attendee.

## Source Data

Source folder: `D:\zerospace-decks\comfy-ui`

Selected dataset:

- 18 latest event CSV exports
- Includes the ComfyUI NYC series from December 2024 through April 2026
- Includes the adjacent GenART NYU and Daydream Greenpoint events
- Excludes older duplicate exports for December 2024 through April 2025, using the May 19 downloads instead

Audience base:

- 7,309 unique emails reached or invited
- 3,947 approved event registrations
- 2,261 unique approved emails

## Persona Methodology

Personas were derived from the Luma custom registration question:

`What best describes your role?`

Method:

1. Filtered all selected CSV rows to `approval_status == approved`.
2. Normalized emails by trimming and lowercasing.
3. For persona analysis, kept one valid role response per unique approved email.
4. Counted the observed role mix among unique respondents.
5. Extrapolated that mix across the full pool of 2,261 unique approved attendees.
6. Rounded extrapolated counts with a largest-remainder adjustment so the persona counts sum to 2,261.

Survey base:

- 502 unique approved attendees had a valid persona response.
- The persona response sample covers 22.2% of the unique approved audience.

## Recommended Slide 10 Persona Mix

| Persona | Survey Respondents | Survey Share | Extrapolated Approved Audience |
| --- | ---: | ---: | ---: |
| Founders | 146 | 29.1% | 658 |
| AI Designers / AI Artists | 115 | 22.9% | 518 |
| Agency / Freelance / Other | 97 | 19.3% | 437 |
| AI / Video Developers | 76 | 15.1% | 342 |
| Students | 27 | 5.4% | 122 |
| Investors | 22 | 4.4% | 99 |
| ComfyUI Developers | 19 | 3.8% | 85 |
| **Total** | **502** | **100.0%** | **2,261** |

Slide-ready rounded percentages:

- 29% Founders
- 23% AI Designers / AI Artists
- 19% Agency / Freelance / Other
- 15% AI / Video Developers
- 5% Students
- 4% Investors
- 4% ComfyUI Developers

## Familiarity Methodology

The "New to ComfyUI" figure was updated from the Luma custom registration question:

`How familiar are you with ComfyUI?`

Normalized response buckets:

- `New to ComfyUI`
- `Somewhat familiar`
- `Very familiar`

Method:

1. Filtered all selected CSV rows to `approval_status == approved`.
2. Normalized emails by trimming and lowercasing.
3. Kept one familiarity response per unique approved email.
4. Collapsed longer answer variants into the three normalized buckets above.
5. Extrapolated the observed familiarity mix across the full pool of 2,261 unique approved attendees.

Survey base:

- 502 unique approved attendees had a valid familiarity response.
- The familiarity response sample covers 22.2% of the unique approved audience.

## Recommended Familiarity Figure

| Familiarity Segment | Survey Respondents | Survey Share | Extrapolated Approved Audience |
| --- | ---: | ---: | ---: |
| New to ComfyUI | 274 | 54.6% | 1,234 |
| Somewhat familiar | 156 | 31.1% | 703 |
| Very familiar | 72 | 14.3% | 324 |
| **Total** | **502** | **100.0%** | **2,261** |

Recommended slide update:

- Replace `47% New to ComfyUI` with `55% New to ComfyUI`

## Notes and Caveats

- These persona and familiarity figures are extrapolated from respondents, not directly observed for every approved attendee.
- The extrapolation is acceptable for a sponsor-facing audience slide as long as the underlying methodology is kept in supporting materials.
- Domain-based demographics remain separately available in `D:\zerospace-decks\comfy-ui\comfyui_attendee_demographics.csv`.
- If higher precision is needed later, the next step is person/company enrichment for rows without role responses.
