import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const cssPath = new URL('../styles.css', import.meta.url);

test('visual system uses the approved coral and cool signal palette', async () => {
  const css = await readFile(cssPath, 'utf8');

  assert.match(css, /--coral:\s*#ff5a4f/i);
  assert.match(css, /--cyan:\s*#[0-9a-f]{6}/i);
  assert.match(css, /--cobalt:\s*#[0-9a-f]{6}/i);
});

test('visual system includes accessibility and responsive contracts', async () => {
  const css = await readFile(cssPath, 'utf8');

  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\s*\(max-width:/);
  assert.match(css, /prefers-reduced-motion/);
});

test('page rhythm orders product, how it works, then solutions', async () => {
  const css = await readFile(cssPath, 'utf8');

  assert.match(css, /\.product-section\s*\{\s*order:\s*2;/);
  assert.match(css, /\.workflow-section\s*\{\s*order:\s*3;/);
  assert.match(css, /\.solutions-section\s*\{\s*order:\s*4;/);
});

test('navy is reserved for early access and its footer', async () => {
  const css = await readFile(cssPath, 'utf8');

  assert.match(css, /\.product-section\s*\{[^}]*background:\s*white/s);
  assert.match(css, /\.workflow-section\s*\{[^}]*background:\s*var\(--pearl\)/s);
  assert.match(css, /\.solutions-section\s*\{[^}]*background:\s*white/s);
  assert.match(css, /\.context-section\s*\{[^}]*background:\s*white/s);
  assert.match(css, /\.faq-section\s*\{[^}]*background:\s*var\(--pearl\)/s);
  assert.match(css, /\.waitlist-section\s*\{[^}]*background:\s*#10182d/s);
  assert.match(css, /footer\s*\{[^}]*background:\s*#10182d/s);
});

test('hero artwork fades before the first content section', async () => {
  const css = await readFile(cssPath, 'utf8');

  assert.match(css, /\.hero::after\s*\{[^}]*linear-gradient\(to bottom,\s*transparent,\s*var\(--pearl\)/s);
  assert.match(css, /\.hero-copy\s*\{[^}]*width:\s*var\(--shell\)/s);
  assert.match(css, /\.hero-emphasis-market\s*\{[^}]*color:\s*var\(--coral-dark\)/s);
  assert.match(css, /\.hero-emphasis-decision\s*\{[^}]*color:\s*var\(--coral-dark\)/s);
  assert.match(css, /\.hero-emphasis\s*\{[^}]*font-family:\s*"DM Serif Display"/s);
  assert.doesNotMatch(css, /Syne/);
  assert.doesNotMatch(css, /Instrument Serif/);
  assert.doesNotMatch(css, /\.hero-emphasis-decision::after/);
});

test('FAQ and approval flow expose meaningful animated states', async () => {
  const css = await readFile(cssPath, 'utf8');

  assert.match(css, /\.faq-answer\s*\{[^}]*grid-template-rows/s);
  assert.match(css, /\.faq-list article:not\(\.is-open\) \.faq-answer/);
  assert.match(css, /\.flow-card\.is-locked/);
  assert.doesNotMatch(css, /\.flow-card\.is-current/);
  assert.doesNotMatch(css, /\.brief-card\.is-updating/);
  assert.doesNotMatch(css, /\.flow-lines/);
});

test('solution cards use hover feedback without selected-card styling', async () => {
  const css = await readFile(cssPath, 'utf8');

  assert.match(css, /\.solution-card:hover\s*\{[^}]*border-color:\s*var\(--coral\)/s);
  assert.doesNotMatch(css, /\.solution-card\.is-selected/);
});

test('approval prompts action and context sources are interactive', async () => {
  const css = await readFile(cssPath, 'utf8');

  assert.match(css, /\.approval-gate\[aria-pressed="false"\] \.gate-icon[^}]*animation:/s);
  assert.match(css, /\.approval-gate\[aria-pressed="false"\]\s*\{[^}]*animation:/s);
  assert.match(css, /\.context-cloud button\.is-active/);
  assert.match(css, /@keyframes contextDriftA/);
  assert.match(css, /@keyframes contextDriftB/);
  assert.match(css, /\.nav-dropdown > button\.is-active::after/);
  assert.match(css, /\.nav-dropdown > button\.is-active\s*\{[^}]*color:\s*var\(--coral-dark\)/s);
  assert.match(css, /\.context-cloud::before, \.context-cloud::after\s*\{[^}]*pointer-events:\s*none/s);
  assert.match(css, /\.context-cloud button\s*\{[^}]*z-index:\s*2/s);
});
