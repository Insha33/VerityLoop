const journeyContent = {
  opportunity: {
    kicker: 'Your starting point',
    title: 'A workflow teams still solve by hand',
    signals: [
      ['idea', 'Natural-language idea'],
      ['user', 'Target-user hypothesis'],
      ['trend', 'Observed market pattern']
    ],
    briefTitle: 'Validate the problem before defining a product',
    briefCopy: 'The market pattern is credible. Demand, urgency, and willingness to pay remain unknown.'
  },
  roadmap: {
    kicker: 'Verified market change',
    title: 'A competitor changed how the category buys',
    signals: [
      ['tag', 'Packaging and pricing shift'],
      ['workflow', 'New customer workflow'],
      ['radar', 'Adjacent product enters']
    ],
    briefTitle: 'Watch the change; validate customer relevance',
    briefCopy: 'The event is real and strategically adjacent. Existing roadmap work covers part of the capability.'
  }
};

const signalIcons = {
  idea: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 22h4M8.5 14.5A6 6 0 1 1 15.5 14.5c-1 .8-1.5 1.6-1.5 2.5h-4c0-.9-.5-1.7-1.5-2.5Z"/></svg>',
  user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M6.5 20c.5-4 2.3-6 5.5-6s5 2 5.5 6M19 5v4M17 7h4"/></svg>',
  trend: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 17 5-5 4 3 7-8M15 7h5v5"/></svg>',
  tag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12V4h8l10 10-7 7L3 12Z"/><circle cx="8" cy="8" r="1"/></svg>',
  workflow: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="6" height="5" rx="1"/><rect x="15" y="15" width="6" height="5" rx="1"/><path d="M9 6.5h4a4 4 0 0 1 4 4V15M15 17.5h-4a4 4 0 0 1-4-4V9"/></svg>',
  radar: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m12 12 6-6"/></svg>'
};

const evidenceContent = {
  primary: 'Direct product pages and release notes establish what changed.',
  context: 'Customer and market signals show who may care and why.',
  conflict: 'Counter-evidence stays visible when sources or signals disagree.'
};

const decisionContent = {
  validate: {
    title: 'Validate before you commit',
    copy: 'Resolve demand, urgency, and feasibility gaps with a focused evidence plan.',
    confidence: 'Measured'
  },
  watch: {
    title: 'Watch the signal, not the noise',
    copy: 'The change is relevant, but the evidence is not yet strong enough to move the roadmap.',
    confidence: 'Developing'
  },
  ignore: {
    title: 'Ignore this change for now',
    copy: 'The signal does not clear the relevance threshold for this product and strategy.',
    confidence: 'High'
  }
};

export function getJourneyContent(journey) {
  return journeyContent[journey] ?? journeyContent.opportunity;
}

export function getDecisionContent(decision) {
  return decisionContent[decision] ?? decisionContent.validate;
}

export function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());
}

export function validateAudience(value) {
  return ['founder', 'product-team', 'both'].includes(value);
}

export function validateName(value) {
  return String(value).trim().length >= 2;
}

export function getActiveSection(scrollY, sections) {
  const threshold = scrollY + 120;
  const orderedSections = [...sections].sort((a, b) => a.top - b.top);
  let active = orderedSections[0]?.id ?? '';

  for (const section of orderedSections) {
    if (section.top <= threshold) active = section.id;
  }

  return active;
}

export function getVisibleSection(sections, marker = 120) {
  const containing = sections.find((section) => section.top <= marker && section.bottom > marker);
  if (containing) return containing.id;

  return [...sections].sort((a, b) => Math.abs(a.top - marker) - Math.abs(b.top - marker))[0]?.id ?? '';
}

function setJourney(journey) {
  const content = getJourneyContent(journey);
  const tabs = document.querySelectorAll('[data-journey]');
  const panel = document.querySelector('[data-journey-panel]');

  tabs.forEach((tab) => {
    const active = tab.dataset.journey === journey;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-pressed', String(active));
  });

  if (!panel) return;
  panel.classList.add('is-updating');

  window.setTimeout(() => {
    panel.querySelector('[data-flow-kicker]').textContent = content.kicker;
    panel.querySelector('[data-flow-title]').textContent = content.title;
    panel.querySelector('[data-flow-signals]').innerHTML = content.signals
      .map(([icon, label]) => `<li><span class="signal-icon">${signalIcons[icon]}</span><span>${label}</span></li>`)
      .join('');
    panel.querySelector('[data-brief-title]').textContent = content.briefTitle;
    panel.querySelector('[data-brief-copy]').textContent = content.briefCopy;
    panel.dataset.activeJourney = journey;
    panel.classList.remove('is-updating');
  }, 150);
}

function initializeJourneys() {
  document.querySelectorAll('[data-journey]').forEach((button) => {
    button.addEventListener('click', () => setJourney(button.dataset.journey));
  });

  document.querySelectorAll('[data-journey-link]').forEach((button) => {
    button.addEventListener('click', () => {
      setJourney(button.dataset.journeyLink);
      document.querySelector('#product')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  document.querySelectorAll('[data-evidence-node]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-evidence-node]').forEach((node) => node.classList.remove('is-active'));
      button.classList.add('is-active');
      document.querySelector('[data-evidence-detail]').textContent = evidenceContent[button.dataset.evidenceNode];
    });
  });

  document.querySelectorAll('[data-decision]').forEach((button) => {
    button.addEventListener('click', () => {
      const content = getDecisionContent(button.dataset.decision);
      const brief = button.closest('.brief-card');

      document.querySelectorAll('[data-decision]').forEach((node) => {
        node.classList.remove('is-selected');
        node.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('is-selected');
      button.setAttribute('aria-pressed', 'true');

      window.setTimeout(() => {
        brief.querySelector('[data-brief-title]').textContent = content.title;
        brief.querySelector('[data-brief-copy]').textContent = content.copy;
      }, 120);
    });
  });

  const approvalGate = document.querySelector('[data-approval-gate]');
  approvalGate?.addEventListener('click', () => {
    const panel = approvalGate.closest('[data-journey-panel]');
    const approved = approvalGate.getAttribute('aria-pressed') !== 'true';

    approvalGate.setAttribute('aria-pressed', String(approved));
    panel?.classList.toggle('is-approved', approved);
    approvalGate.querySelector('[data-approval-title]').textContent = approved ? 'Direction approved' : 'Human approval';
    approvalGate.querySelector('[data-approval-copy]').textContent = approved ? 'PRD and tickets unlocked' : 'Click to unlock PRD + tickets';
    approvalGate.querySelector('.gate-icon').textContent = approved ? '✓' : '→';

    document.querySelectorAll('[data-gated-output]').forEach((card, index) => {
      card.classList.toggle('is-locked', !approved);
      card.querySelector('.optional').textContent = approved ? (index === 0 ? 'Ready' : 'Reviewed') : 'Locked';
    });
  });
}

function initializeNavigation() {
  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navMenu = document.querySelector('[data-nav-menu]');
  const solutionsToggle = document.querySelector('[data-solutions-toggle]');
  const dropdown = solutionsToggle?.closest('.nav-dropdown');

  const closeMenus = () => {
    navMenu?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    dropdown?.classList.remove('is-open');
    solutionsToggle?.setAttribute('aria-expanded', 'false');
  };

  navToggle?.addEventListener('click', () => {
    const open = !navMenu.classList.contains('is-open');
    navMenu.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  solutionsToggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    const open = !dropdown.classList.contains('is-open');
    dropdown.classList.toggle('is-open', open);
    solutionsToggle.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-dropdown')) {
      dropdown?.classList.remove('is-open');
      solutionsToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenus();
      solutionsToggle?.focus();
    }
  });

  navMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenus));

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-menu > a')];
  const onScroll = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
    const positions = sections.map((section) => {
      const bounds = section.getBoundingClientRect();
      return { id: section.id, top: bounds.top, bottom: bounds.bottom };
    });
    const marker = (header?.offsetHeight ?? 78) + 24;
    const active = getVisibleSection(positions, marker);
    navLinks.forEach((link) => link.classList.toggle('is-active', link.hash === `#${active}`));
    solutionsToggle?.classList.toggle('is-active', active === 'solutions');
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initializeMotion() {
  const revealItems = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const hero = document.querySelector('.hero');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (hero && !reduceMotion) {
    hero.addEventListener('pointermove', (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      hero.style.setProperty('--pointer-x', `${x}%`);
      hero.style.setProperty('--pointer-y', `${y}%`);
    }, { passive: true });
  }
}

function initializeFaq() {
  const buttons = document.querySelectorAll('.faq-list button[aria-controls]');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const willOpen = button.getAttribute('aria-expanded') !== 'true';
      buttons.forEach((item) => {
        item.setAttribute('aria-expanded', 'false');
        item.querySelector('span').textContent = '+';
        item.closest('article').classList.remove('is-open');
      });
      if (willOpen) {
        button.setAttribute('aria-expanded', 'true');
        button.querySelector('span').textContent = '−';
        button.closest('article').classList.add('is-open');
      }
    });
  });
}

function initializeContext() {
  const buttons = [...document.querySelectorAll('[data-context-source]')];
  const status = document.querySelector('[data-context-status]');
  let previewTimer;
  let previewIndex = 0;

  const activate = (button) => {
    buttons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    status.textContent = `${button.dataset.contextSource} connected`;
  };

  buttons.forEach((button) => {
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      window.clearInterval(previewTimer);
      activate(button);
    });
  });

  if (buttons.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    activate(buttons[0]);
    previewTimer = window.setInterval(() => {
      previewIndex = (previewIndex + 1) % buttons.length;
      activate(buttons[previewIndex]);
    }, 2200);
  }
}

function initializeWaitlist() {
  const form = document.querySelector('#waitlist-form');
  if (!form) return;
  const status = form.querySelector('[data-form-status]');
  const submit = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const audience = String(data.get('audience') ?? '');

    status.classList.remove('is-success');
    if (!validateName(name)) {
      status.textContent = 'Enter your name to join the waitlist.';
      form.elements.name.focus();
      return;
    }
    if (!validateEmail(email)) {
      status.textContent = 'Enter a valid work email to join the waitlist.';
      form.elements.email.focus();
      return;
    }
    if (!validateAudience(audience)) {
      status.textContent = 'Choose the journey that best describes you.';
      form.querySelector('input[name="audience"]')?.focus();
      return;
    }

    submit.disabled = true;
    submit.innerHTML = 'Joining…';
    status.textContent = 'Saving your early-access request…';

    window.setTimeout(() => {
      status.classList.add('is-success');
      status.textContent = 'You’re on the list. We’ll be in touch with VerityLoop early-access updates.';
      submit.innerHTML = 'Waitlist joined <span aria-hidden="true">✓</span>';
      submit.classList.add('is-complete');
    }, 700);
  });
}

function initialize() {
  initializeJourneys();
  initializeNavigation();
  initializeMotion();
  initializeContext();
  initializeFaq();
  initializeWaitlist();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();
}
