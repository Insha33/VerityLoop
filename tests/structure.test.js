import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const htmlPath = new URL('../index.html', import.meta.url);

test('page contains the approved hero and both product journeys', async () => {
  const html = await readFile(htmlPath, 'utf8');

  assert.match(html, /Turn market change into your next product decision\./);
  assert.match(html, /Find your next opportunity\. Know when your roadmap should move\./);
  assert.match(html, /Opportunity Discovery/);
  assert.match(html, /Roadmap Impact/);
});

test('page contains trust, FAQ, and repeated waitlist conversion points', async () => {
  const html = await readFile(htmlPath, 'utf8');
  const waitlistCalls = html.match(/Join the waitlist/g) ?? [];

  assert.match(html, /id="trust"/);
  assert.match(html, /id="faq"/);
  assert.ok(waitlistCalls.length >= 3, 'expected at least three waitlist CTAs');
});

test('product workflow follows the two starting points and continues through reviewed tickets', async () => {
  const html = await readFile(htmlPath, 'utf8');
  const productIndex = html.indexOf('id="product"');
  const solutionsIndex = html.indexOf('id="solutions"');

  assert.ok(productIndex > -1, 'expected a product section');
  assert.ok(solutionsIndex < productIndex, 'expected the two starting points before the product workflow');
  assert.match(html, /Reviewed ticket drafts/);
  assert.match(html, /data-solution-card="opportunity"/);
  assert.match(html, /data-solution-card="roadmap"/);
  assert.ok(html.indexOf('class="journey-switch', productIndex) > productIndex, 'expected the journey selector inside the product section');
});
