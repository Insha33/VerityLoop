import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const htmlPath = new URL('../index.html', import.meta.url);
const robotsPath = new URL('../robots.txt', import.meta.url);

test('page consistently uses the VerityLoop brand and approved technical vocabulary', async () => {
  const [html, app] = await Promise.all([
    readFile(htmlPath, 'utf8'),
    readFile(new URL('../app.js', import.meta.url), 'utf8')
  ]);

  assert.doesNotMatch(`${html}\n${app}`, /GroundTruth/);
  assert.match(html, /VerityLoop/);
  assert.match(html, /MCP-ready/i);
  assert.match(html, /agent-ready/i);
  assert.match(html, /evidence agents/i);
  assert.match(html, /source-grounded retrieval/i);
  assert.match(html, /decision memory/i);
  assert.match(html, /human-in-the-loop/i);
});

test('page exposes search and social metadata with structured product information', async () => {
  const html = await readFile(htmlPath, 'utf8');
  const robots = await readFile(robotsPath, 'utf8');

  assert.match(html, /<title>VerityLoop \| AI Product Decision Platform<\/title>/);
  assert.match(html, /<meta name="description"/);
  assert.match(html, /<meta name="robots" content="index, follow/);
  assert.match(html, /<meta property="og:title"/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
  assert.match(html, /"@type":"Organization"/);
  assert.match(html, /"@type":"WebSite"/);
  assert.match(html, /"@type":"SoftwareApplication"/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
});

test('page contains the approved hero and both product journeys', async () => {
  const html = await readFile(htmlPath, 'utf8');

  assert.match(html, /<h1>Turn <span[^>]*>market change<\/span> into your next <span[^>]*>product decision<\/span>\.<\/h1>/);
  assert.match(html, /Find your next opportunity\. Know when your roadmap should move\./);
  assert.match(html, /Opportunity Discovery/);
  assert.match(html, /Roadmap Impact/);
  assert.match(html, /<section class="hero" id="top">/);
  assert.doesNotMatch(html, /See how it works/);
  assert.match(html, /class="nav-chevron"/);
  assert.match(html, /class="hero-emphasis hero-emphasis-market">market change<\/span>/);
  assert.match(html, /class="hero-emphasis hero-emphasis-decision">product decision<\/span>/);
});

test('page contains FAQ and repeated waitlist conversion points without a trust section', async () => {
  const html = await readFile(htmlPath, 'utf8');
  const waitlistCalls = html.match(/Join the waitlist/g) ?? [];

  assert.doesNotMatch(html, /id="trust"/);
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
  assert.match(html, /<p class="eyebrow">How it works<\/p>/);
  assert.match(html, /Reviewed ticket drafts/);
  assert.match(html, /data-approval-gate/);
  assert.match(html, /data-solution-card="opportunity"/);
  assert.match(html, /data-solution-card="roadmap"/);
  assert.doesNotMatch(html, /class="solution-card[^\"]*"[^>]*role="button"/);
  assert.doesNotMatch(html, /Interactive product walkthrough/);
  assert.doesNotMatch(html, /class="flow-lines"/);
  assert.match(html, /class="signal-icon"[^>]*><svg/);
  assert.ok(html.indexOf('class="journey-switch', productIndex) > productIndex, 'expected the journey selector inside the product section');
});

test('waitlist asks for name, email, and role of interest', async () => {
  const html = await readFile(htmlPath, 'utf8');

  assert.match(html, /name="name"/);
  assert.match(html, /name="email"/);
  assert.match(html, /name="audience"/);
  assert.match(html, /Role you’re interested in/);
});

test('FAQ and early-access copy matches the approved language', async () => {
  const html = await readFile(htmlPath, 'utf8');

  assert.match(html, /Do founders need a product, roadmap, or competitor list to get started\?/);
  assert.match(html, /<p>Yes, with PMs approval<\/p>/);
  assert.match(html, /Context is permission-scoped and tenant-private\. Access checks happen before retrieval\./);
  assert.doesNotMatch(html, /class="mini-proof"/);
  assert.doesNotMatch(html, /class="confidence-row"/);
  assert.doesNotMatch(html, /is-current/);
});
