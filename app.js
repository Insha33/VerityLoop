const journeyContent = {
  opportunity: {
    kicker: 'Your starting point',
    title: 'A workflow teams still solve by hand',
    signals: [
      ['✦', 'Natural-language idea'],
      ['◌', 'Target-user hypothesis'],
      ['↗', 'Observed market pattern']
    ],
    briefTitle: 'Validate the problem before defining a product',
    briefCopy: 'The market pattern is credible. Demand, urgency, and willingness to pay remain unknown.'
  },
  roadmap: {
    kicker: 'Verified market change',
    title: 'A competitor changed how the category buys',
    signals: [
      ['↗', 'Packaging and pricing shift'],
      ['◎', 'New customer workflow'],
      ['◇', 'Adjacent product enters']
    ],
    briefTitle: 'Watch the change; validate customer relevance',
    briefCopy: 'The event is real and strategically adjacent. Existing roadmap work covers part of the capability.'
  }
};

const evidenceContent = {
  primary: 'Direct product pages and release notes establish what changed.',
  context: 'Customer and market signals show who may care and why.',
  conflict: 'Counter-evidence stays visible when sources or signals disagree.'
};

export function getJourneyContent(journey) {
  return journeyContent[journey] ?? journeyContent.opportunity;
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
  let active = sections[0]?.id ?? '';

  for (const section of sections) {
    if (section.top <= threshold) active = section.id;
  }

  return active;
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

  document.querySelectorAll('[data-solution-card]').forEach((card) => {
    const active = card.dataset.solutionCard === journey;
    card.classList.toggle('is-selected', active);
    card.setAttribute('aria-pressed', String(active));
  });

  if (!panel) return;
  panel.classList.add('is-updating');

  window.setTimeout(() => {
    panel.querySelector('[data-flow-kicker]').textContent = content.kicker;
    panel.querySelector('[data-flow-title]').textContent = content.title;
    panel.querySelector('[data-flow-signals]').innerHTML = content.signals
      .map(([icon, label]) => `<li><span class="signal-icon">${icon}</span><span>${label}</span></li>`)
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

  document.querySelectorAll('[data-solution-card]').forEach((card) => {
    const select = () => setJourney(card.dataset.solutionCard);
    card.addEventListener('click', (event) => {
      if (!event.target.closest('[data-journey-link]')) select();
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        select();
      }
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
      document.querySelectorAll('[data-decision]').forEach((node) => node.classList.remove('is-selected'));
      button.classList.add('is-selected');
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
    const positions = sections.map((section) => ({ id: section.id, top: section.offsetTop }));
    const active = getActiveSection(window.scrollY, positions);
    navLinks.forEach((link) => link.classList.toggle('is-active', link.hash === `#${active}`));
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
        document.getElementById(item.getAttribute('aria-controls')).hidden = true;
      });
      if (willOpen) {
        button.setAttribute('aria-expanded', 'true');
        button.querySelector('span').textContent = '−';
        document.getElementById(button.getAttribute('aria-controls')).hidden = false;
      }
    });
  });
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
      status.textContent = 'You’re on the list. We’ll be in touch with GroundTruth early-access updates.';
      submit.innerHTML = 'Waitlist joined <span aria-hidden="true">✓</span>';
      submit.classList.add('is-complete');
    }, 700);
  });
}

function initialize() {
  initializeJourneys();
  initializeNavigation();
  initializeMotion();
  initializeFaq();
  initializeWaitlist();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();
}
