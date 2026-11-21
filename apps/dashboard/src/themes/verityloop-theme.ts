// VerityLoop theme: Astryx neutral with the logo orange, square corners and white pages.
// Source of the built verityloop.* files beside it. After editing, run `npm run theme:build`
// and commit verityloop.css, verityloop.js and verityloop.d.ts together.
import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

const font = 'Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const ink = '#101623';
const logoOrange = '#ff5a4f';
const logoOrangeDark = '#ff6b61';

export const verityloopTheme = defineTheme({
  name: 'verityloop',
  extends: neutralTheme,
  // Square corners everywhere, like the marketing site. --radius-full stays round (avatars).
  radius: {base: 4, multiplier: 0},
  tokens: {
    // Filled accents (primary buttons, checked controls) use the exact logo orange.
    // Dark ink on it is 5.9:1 (white would be 3.1:1, below WCAG AA for button text).
    '--color-accent': [logoOrange, logoOrangeDark],
    '--color-on-accent': [ink, '#1b1b1b'],
    '--color-accent-muted': ['#ffe1dc', '#4a2420'],
    // Small accent text stays readable: ink in light mode, the logo orange on dark (6.2:1).
    // Large accent text (the sign-up headline) uses --vl-brand directly.
    '--color-text-accent': [ink, logoOrangeDark],
    '--color-icon-accent': [logoOrange, logoOrangeDark],
    // Badges in the "orange" family become soft logo-orange pills with readable text.
    '--color-background-orange': ['#ffe1dc', '#4a2420'],
    '--color-border-orange': ['#ffc9c2', '#7a3a33'],
    '--color-text-orange': [ink, '#ffd9d3'],
    '--color-icon-orange': [logoOrange, logoOrangeDark],
    // DESIGN.md: pure-white pages in light mode (neutral's default body is a light grey).
    '--color-background-body': ['#ffffff', '#1b1b1b'],
    '--font-family-body': font,
    '--font-family-heading': font,
  },
  localTokens: {
    // Logo orange family for the logo, large accent text, indicators and decorative signal cells.
    '--vl-brand': [logoOrange, logoOrangeDark],
    '--vl-brand-pale': ['#ff968a', '#c4544b'],
    '--vl-brand-deep': ['#f2704a', '#ff8a6b'],
    '--vl-peach': ['#ffbea0', '#a35a45'],
    // Soft surfaces from DESIGN.md: coral-soft for active states, stage peach for the sign-up stage.
    '--vl-coral-soft': ['#fff0ee', '#3a1f1d'],
    '--vl-stage': ['#fff3ee', '#1d1718'],
    '--vl-paper': ['#faf9f6', '#222222'],
    '--vl-grid-line': ['rgb(16 22 35 / 5.5%)', 'rgb(255 255 255 / 6%)'],
    '--vl-scrim': ['rgb(16 22 35 / 40%)', 'rgb(0 0 0 / 60%)'],
    // Opaque value for CSS masks (only its alpha is read).
    '--vl-mask': '#000',
  },
  components: {
    badge: {base: {borderRadius: '0'}},
  },
});
