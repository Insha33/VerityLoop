import assert from 'node:assert/strict';
import test from 'node:test';

import { getActiveSection, getJourneyContent, validateAudience, validateEmail } from '../app.js';

test('journey content gives founders and product teams distinct decision contexts', () => {
  const opportunity = getJourneyContent('opportunity');
  const roadmap = getJourneyContent('roadmap');

  assert.equal(opportunity.kicker, 'Your starting point');
  assert.match(opportunity.title, /workflow/i);
  assert.equal(roadmap.kicker, 'Verified market change');
  assert.match(roadmap.title, /competitor/i);
  assert.notDeepEqual(opportunity.signals, roadmap.signals);
});

test('email validation accepts normal addresses and rejects malformed input', () => {
  assert.equal(validateEmail('person@company.com'), true);
  assert.equal(validateEmail('  person+pilot@company.co.in  '), true);
  assert.equal(validateEmail('person@'), false);
  assert.equal(validateEmail('person company.com'), false);
  assert.equal(validateEmail(''), false);
});

test('audience validation accepts only supported waitlist paths', () => {
  assert.equal(validateAudience('founder'), true);
  assert.equal(validateAudience('product-team'), true);
  assert.equal(validateAudience('both'), true);
  assert.equal(validateAudience(''), false);
  assert.equal(validateAudience('investor'), false);
});

test('active section returns the last section crossing the header threshold', () => {
  const sections = [
    { id: 'product', top: 200 },
    { id: 'how-it-works', top: 900 },
    { id: 'faq', top: 1500 }
  ];

  assert.equal(getActiveSection(50, sections), 'product');
  assert.equal(getActiveSection(850, sections), 'how-it-works');
  assert.equal(getActiveSection(1600, sections), 'faq');
});
