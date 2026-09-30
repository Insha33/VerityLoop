import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const brand = JSON.parse(await readFile(new URL('src/content/brand.json', root)));
const type = JSON.parse(await readFile(new URL('scripts/brand/type-outlines.json', root)));
const { coral, ink, paper, curve, diamond } = brand;
const target = new URL('public/brand/', root);
await mkdir(target, { recursive: true });

const shape = `<g transform="rotate(-45)"><path d="${curve}"/><path d="${curve}" transform="rotate(180)"/><rect x="${diamond.x}" y="${diamond.y}" width="${diamond.size}" height="${diamond.size}" rx="${diamond.radius}"/></g>`;
const mark = (x, y, scale, color) => `<g transform="translate(${x} ${y}) scale(${scale})" fill="${color}">${shape}</g>`;
const svg = (w, h, body, title = 'VerityLoop') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"><title>${title}</title>${body}</svg>`;
const rect = (x, y, w, h, color, radius = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${color}"/>`;
const lettering = (key, x, y, size, color) => {
  const face = type[key];
  return `<g fill="${color}" transform="translate(${x} ${y}) scale(${size / face.units} ${-size / face.units})">${face.paths.map(p => `<path transform="translate(${p.x} ${p.y})" d="${p.d}"/>`).join('')}</g>`;
};
const label = (text, x, y, color = '#646b76', size = 16) => `<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="${size}" fill="${color}">${text}</text>`;
const lockup = (x, y, scale = 1, textColor = ink, markColor = coral) => `<g transform="translate(${x} ${y}) scale(${scale})">${mark(52, 64, 0.52, markColor)}${lettering('wordmark', 127, 89, 72, textColor)}</g>`;
const save = (name, contents) => writeFile(new URL(name, target), contents);
const raster = (source, name, width) => sharp(Buffer.from(source)).resize({ width }).png().toFile(new URL(name, target).pathname);

for (const [name, color] of [['coral', coral], ['ink', ink], ['white', '#fff']]) {
  const source = svg(200, 200, mark(100, 100, 1, color));
  await save(`mark-${name}.svg`, source);
  await raster(source, `mark-${name}.png`, 1024);
}
for (const [name, textColor, markColor] of [['light', ink, coral], ['dark', '#fff', coral], ['ink', ink, ink], ['white', '#fff', '#fff']]) {
  const source = svg(496, 128, lockup(0, 0, 1, textColor, markColor));
  await save(`logo-${name}.svg`, source);
  await raster(source, `logo-${name}.png`, 1488);
}

const appIcon = svg(512, 512, rect(0, 0, 512, 512, coral) + mark(256, 256, 1.8, '#fff'));
await save('app-icon.svg', appIcon);
for (const size of [180, 192, 512]) await raster(appIcon, `app-icon-${size}.png`, size);
const avatar = svg(1024, 1024, rect(0, 0, 1024, 1024, ink) + mark(512, 512, 3.6, coral));
await save('social-avatar.svg', avatar);
await raster(avatar, 'social-avatar.png', 1024);

// Dedicated, padded favicon tile keeps the mark visible on light and dark tabs.
const favicon = svg(64, 64, rect(0, 0, 64, 64, paper, 14) + mark(32, 32, 0.30, coral));
await save('favicon.svg', favicon);
const iconPngs = [];
for (const size of [16, 32, 48]) {
  const png = await sharp(Buffer.from(favicon)).resize(size, size).png().toBuffer();
  await save(`favicon-${size}.png`, png);
  iconPngs.push({ size, png });
}
// ICO container with PNG payloads for browsers that request /favicon.ico directly.
const header = Buffer.alloc(6 + iconPngs.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(iconPngs.length, 4);
let offset = header.length;
iconPngs.forEach(({ size, png }, i) => {
  const start = 6 + i * 16;
  header[start] = size; header[start + 1] = size;
  header.writeUInt16LE(1, start + 4); header.writeUInt16LE(32, start + 6);
  header.writeUInt32LE(png.length, start + 8); header.writeUInt32LE(offset, start + 12);
  offset += png.length;
});
await writeFile(new URL('public/favicon.ico', root), Buffer.concat([header, ...iconPngs.map(i => i.png)]));
await writeFile(new URL('public/apple-touch-icon.png', root), await sharp(Buffer.from(appIcon)).resize(180, 180).png().toBuffer());
await writeFile(new URL('public/verityloop-logo.svg', root), svg(512, 512, rect(0, 0, 512, 512, paper, 96) + mark(256, 256, 2.15, coral)));

const social = svg(1200, 630,
  rect(0, 0, 1200, 630, paper) + lockup(66, 45, 0.55) +
  lettering('headline', 78, 286, 61, ink) + lettering('evidence', 78, 364, 61, coral) +
  lettering('url', 80, 556, 20, '#646b76') +
  rect(890, 210, 230, 230, ink, 40) + mark(1005, 325, 0.88, coral),
  'Your next product move. Backed by evidence.');
await save('social-card.svg', social);
await raster(social, 'social-card.png', 1200);

const guide = svg(1600, 1120,
  rect(0, 0, 1600, 1120, '#eae7e1') + label('VERITYLOOP  /  RHYTHM IDENTITY', 48, 48, ink, 18) +
  rect(32, 76, 752, 312, paper, 16) + label('01  PRIMARY SIGNATURE', 64, 112) + lockup(153, 180, 1.05) +
  rect(804, 76, 764, 312, ink, 16) + label('02  DARK SURFACES', 836, 112, '#b4bbc7') + lockup(931, 180, 1.05, '#fff') +
  rect(32, 408, 490, 314, '#fff', 16) + label('03  SHARED GEOMETRY', 64, 448) + mark(277, 570, 0.84, coral) + label('Matching curves. 18-unit inner clearance.', 64, 686, '#646b76', 17) +
  rect(542, 408, 516, 314, paper, 16) + label('04  COLOR SYSTEM', 574, 448) +
  rect(574, 488, 138, 142, coral, 8) + rect(730, 488, 138, 142, ink, 8) + rect(886, 488, 140, 142, '#fff', 8) +
  label('#FF5A4F', 590, 669) + label('#101623', 746, 669) + label('WHITE', 910, 669) +
  rect(1078, 408, 490, 314, '#fff', 16) + label('05  APP &amp; SOCIAL', 1110, 448) +
  rect(1137, 493, 140, 140, coral, 28) + mark(1207, 563, 0.52, '#fff') + rect(1367, 493, 140, 140, ink, 70) + mark(1437, 563, 0.52, coral) +
  label('Clear at small sizes. Safe inside a circle.', 1110, 686, '#646b76', 17) +
  rect(32, 742, 752, 346, paper, 16) + label('06  TYPOGRAPHY &amp; VOICE', 64, 782) +
  lettering('type', 64, 855, 42, ink) + lettering('principles', 64, 916, 32, '#646b76') + lettering('headline', 64, 1000, 38, ink) + lettering('evidence', 64, 1050, 38, coral) +
  rect(804, 742, 764, 346, ink, 16) + label('07  BROWSER &amp; PAGE', 836, 782, '#b4bbc7') +
  rect(853, 826, 666, 216, paper, 12) + rect(853, 826, 666, 42, '#f0ede7', 12) + mark(879, 847, 0.087, coral) + label('VerityLoop', 900, 852, ink, 14) +
  lockup(892, 898, 0.60) + lettering('url', 897, 1010, 20, '#646b76'), 'VerityLoop brand asset guide');
await save('brand-guide.svg', guide);
await raster(guide, 'brand-guide.png', 1600);
console.log('Built SVG/PNG logos, favicons, app icons, social assets, and brand guide.');
