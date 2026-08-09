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
