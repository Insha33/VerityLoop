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

test('product, how it works, and solutions are separate sections in that order', async () => {
  const html = await readFile(htmlPath, 'utf8');
  const productIndex = html.indexOf('id="product"');
  const howItWorksIndex = html.indexOf('id="how-it-works"');
  const solutionsIndex = html.indexOf('id="solutions"');

  assert.ok(productIndex > -1, 'expected a product section');
  assert.ok(howItWorksIndex > -1, 'expected a separate how it works section');
  assert.ok(solutionsIndex > -1, 'expected a separate solutions section');
  assert.match(html, /class="section product-section" id="product"/);
  assert.match(html, /class="section workflow-section" id="how-it-works"/);
  assert.match(html, /Reviewed ticket drafts/);
  assert.match(html, /data-solution-card="opportunity"/);
  assert.match(html, /data-solution-card="roadmap"/);
  assert.ok(html.indexOf('class="journey-switch', productIndex) > productIndex, 'expected the journey selector inside the product section');
});

test('waitlist asks for name, email, and role of interest', async () => {
  const html = await readFile(htmlPath, 'utf8');

  assert.match(html, /name="name"/);
  assert.match(html, /name="email"/);
  assert.match(html, /name="audience"/);
  assert.match(html, /Role you’re interested in/);
});
