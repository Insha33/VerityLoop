import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

const font = 'Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const ink = '#101623';
const logoOrange = '#ff5a4f';
const logoOrangeDark = '#ff6b61';

export const verityloopTheme = defineTheme({
  name: 'verityloop',
  extends: neutralTheme,
  radius: {base: 4, multiplier: 0},
  tokens: {
    '--color-accent': [logoOrange, logoOrangeDark],
    '--color-on-accent': ['#ffffff', '#ffffff'],
    '--color-accent-muted': ['#ffe1dc', '#4a2420'],
    '--color-text-accent': [ink, logoOrangeDark],
    '--color-icon-accent': [logoOrange, logoOrangeDark],
    '--color-background-orange': ['#ffe1dc', '#4a2420'],
    '--color-border-orange': ['#ffc9c2', '#7a3a33'],
    '--color-text-orange': [ink, '#ffd9d3'],
    '--color-icon-orange': [logoOrange, logoOrangeDark],
    '--color-background-body': ['#ffffff', '#1b1b1b'],
    '--font-family-body': font,
    '--font-family-heading': font,
  },
  localTokens: {
    '--vl-brand': [logoOrange, logoOrangeDark],
    '--vl-brand-pale': ['#ff968a', '#c4544b'],
    '--vl-brand-deep': ['#f2704a', '#ff8a6b'],
    '--vl-peach': ['#ffbea0', '#a35a45'],
    '--vl-coral-soft': ['#fff0ee', '#3a1f1d'],
    '--vl-stage': ['#fff3ee', '#1d1718'],
    '--vl-paper': ['#faf9f6', '#222222'],
    '--vl-grid-line': ['rgb(16 22 35 / 5.5%)', 'rgb(255 255 255 / 6%)'],
    '--vl-scrim': ['rgb(16 22 35 / 40%)', 'rgb(0 0 0 / 60%)'],
    '--vl-mask': '#000',
  },
  components: {
    badge: {base: {borderRadius: '0'}},
  },
});
