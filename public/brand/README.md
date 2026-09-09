# VerityLoop / Rhythm

The approved mark represents evidence becoming a decision, with the surrounding forms suggesting continued learning. Its personality is trust, momentum, and warmth.

## Files

- `logo-light.svg` / `.png`: coral symbol, ink lettering; use on white or warm paper.
- `logo-dark.svg` / `.png`: coral symbol, white lettering; use on ink backgrounds.
- `logo-ink.svg` and `logo-white.svg`: single-color signatures.
- `mark-coral.svg`, `mark-ink.svg`, `mark-white.svg`: standalone marks, also supplied as transparent 1024px PNGs.
- `favicon.svg`, `favicon-16.png`, `favicon-32.png`, `favicon-48.png`: browser-tab artwork. The website also provides `/favicon.ico`.
- `app-icon.svg`, `app-icon-180.png`, `app-icon-192.png`, `app-icon-512.png`: white mark on coral. The 512px icon preserves the circular maskable safe area.
- `social-avatar.svg` / `.png`: 1024px avatar, safe for circular cropping.
- `social-card.svg` / `.png`: 1200 × 630 sharing artwork.
- `brand-guide.svg` / `.png`: identity overview.

SVG logo lettering is outlined and does not require installed fonts. PNG signatures are transparent. White artwork is intended for dark backgrounds.

## Usage

Use coral `#FF5A4F`, ink `#101623`, white `#FFFFFF`, and warm paper `#FAF9F6`. Use Manrope on the website: weight 750 with -0.04em tracking for the name, and 500 for headlines.

Keep at least one central-diamond width of clear space around a standalone mark. At small interface sizes, use the symbol alone: 16px minimum, 24–28px preferred. Use the supplied favicon at 16px. Keep horizontal signatures at least 120px wide. Do not stretch, rotate, redraw, add shadows, or change the spacing between the parts.

The two curves use the same path, rotated 180 degrees. The diamond has a 5-unit corner radius; the adjacent inner contours have a 23-unit radius and an 18-unit clearance. The outside uses soft 32-unit corners. Keep all of these values together when scaling.

## Source and regeneration

`src/content/brand.json` is the source of truth for the geometry and palette. The React `BrandMark` component and both asset generators use it.

Run `npm run brand:assets` from the repository root to regenerate the brand and product SVGs/PNGs. This uses checked-in outlined lettering in `scripts/brand/type-outlines.json`; no network or local font installation is needed.

For a typography change only, obtain the official Manrope variable TTF from the Google Fonts `ofl/manrope` directory, then run `node scripts/build-brand-type.mjs /path/to/Manrope[wght].ttf` before rebuilding the assets. Manrope is designed by Mikhail Sharanda and Mirko Velimirovic and distributed under the SIL Open Font License. The source font is not included in this asset pack.

The website's existing blue accents remain available for product UI states; the brand symbol itself is coral, ink, or white.
