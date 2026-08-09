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
