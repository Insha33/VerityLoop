// Optional typography regeneration with Google's official Manrope variable TTF.
// Usage: node scripts/build-brand-type.mjs /path/to/Manrope[wght].ttf
import { mkdir, writeFile } from 'node:fs/promises';
import { openSync } from 'fontkit';

if (!process.argv[2]) throw new Error('Pass the path to the official Manrope variable TTF.');
const font = openSync(process.argv[2]);
if (!font.familyName.startsWith('Manrope')) throw new Error('Expected the Manrope font.');

const labels = [
  ['wordmark', 'VerityLoop', 750],
  ['headline', 'Your next product move.', 500],
  ['evidence', 'Backed by evidence.', 500],
  ['url', 'runverityloop.com', 500],
  ['principles', 'Trust. Momentum. Warmth.', 500],
  ['type', 'Manrope / Clear by design.', 500],
];
const output = {};
for (const [key, text, weight] of labels) {
  const face = font.getVariation({ wght: weight });
  const run = face.layout(text);
  let advance = 0;
  const paths = run.glyphs.map((glyph, i) => {
    const position = run.positions[i];
    const tracking = key === 'wordmark' ? -0.04 * font.unitsPerEm * i : 0;
    const result = { x: advance + position.xOffset + tracking, y: position.yOffset, d: glyph.path.toSVG() };
    advance += position.xAdvance;
    return result;
  });
  const width = advance - (key === 'wordmark' ? 0.04 * font.unitsPerEm * (run.glyphs.length - 1) : 0);
  output[key] = { text, weight, units: font.unitsPerEm, width, paths };
}
await mkdir(new URL('./brand/', import.meta.url), { recursive: true });
await writeFile(new URL('./brand/type-outlines.json', import.meta.url), JSON.stringify(output));
console.log('Saved outlined Manrope lettering; exported SVGs require no fonts.');
