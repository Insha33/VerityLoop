# GroundTruth Marketing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive, accessible, dynamic marketing page that explains both GroundTruth product journeys and converts visitors through a Join the waitlist form.

**Architecture:** Use a dependency-free static frontend with semantic HTML, component-scoped CSS sections, and modular browser JavaScript. Progressive enhancement keeps content readable without JavaScript; JavaScript adds navigation, journey switching, evidence inspection, scroll reveals, FAQ accordions, and waitlist states.

**Tech Stack:** HTML5, modern CSS, vanilla ES modules, Node.js built-in test runner.

## Global Constraints

- Give Opportunity Discovery and Roadmap Impact equal visual and narrative prominence.
- Use the approved Luminous Intelligence visual direction with electric coral as the primary action color and cyan/cobalt as the secondary signal color.
- Use the exact hero headline: “Turn market change into your next product decision.”
- Use the exact supporting copy: “Find your next opportunity. Know when your roadmap should move.”
- Use “Join the waitlist” as the primary CTA.
- Do not include fabricated metrics, customers, certifications, or performance claims.
- PRDs and tickets must be shown as optional, human-approved downstream artifacts.
- All interaction must work with keyboard input and respect `prefers-reduced-motion`.
- The page must remain usable from 320 px mobile widths through large desktop displays.

---

### Task 1: Establish the static application and content structure

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `app.js`
- Create: `package.json`
- Create: `tests/structure.test.js`

**Interfaces:**
- Consumes: Approved design specification and exact copy from Global Constraints.
- Produces: Semantic section IDs `product`, `how-it-works`, `solutions`, `trust`, `faq`, and `waitlist`; DOM hooks consumed by `app.js`.

- [ ] **Step 1: Write the failing structural test**

Create a Node test that reads `index.html` and asserts the hero headline, supporting copy, both solution labels, FAQ, trust section, and at least three waitlist CTAs are present.

- [ ] **Step 2: Run the structural test and verify failure**

Run: `node --test tests/structure.test.js`

Expected: FAIL because `index.html` does not exist.

- [ ] **Step 3: Create the semantic HTML shell and page content**

Create the complete marketing-page markup with skip link, sticky navigation, accessible Solutions dropdown, hero, interactive decision-flow controls, two equal audience panels, product brief showcase, governed workflow, trust section, integrations, FAQ, waitlist form, and footer. Include usable content in the initial HTML rather than injecting core copy with JavaScript.

- [ ] **Step 4: Create the CSS entry file, JavaScript module, and package scripts**

Use `package.json` scripts:

```json
{
  "scripts": {
    "test": "node --test",
    "serve": "python3 -m http.server 4173"
  }
}
```

- [ ] **Step 5: Run the test and verify it passes**

Run: `npm test`

Expected: PASS for all structural assertions.

### Task 2: Implement the Luminous Intelligence visual system

**Files:**
- Modify: `styles.css`
- Modify: `index.html`
- Create: `tests/styles.test.js`

**Interfaces:**
- Consumes: Semantic classes and section IDs from Task 1.
- Produces: CSS custom properties, responsive layouts, focus states, reduced-motion fallbacks, and reusable card/button styles.

- [ ] **Step 1: Write the failing visual-contract test**

Assert that `styles.css` defines the electric coral token `#ff5a4f`, a cyan/cobalt secondary token, responsive breakpoints, `:focus-visible`, and `prefers-reduced-motion`.

- [ ] **Step 2: Run the visual-contract test and verify failure**

Run: `node --test tests/styles.test.js`

Expected: FAIL until the visual system exists.

- [ ] **Step 3: Implement the page visual system**

Build a pearl background with restrained aurora gradients, clean sans-serif typography, electric-coral actions, cyan signal paths, layered product cards, generous spacing, responsive grids, a mobile menu, and accessible contrast. Use CSS-generated effects rather than stock imagery.

- [ ] **Step 4: Add responsive and reduced-motion behavior**

At narrow widths, stack product-flow cards and both audience paths without changing their order or prominence. Disable transforms, path animation, and smooth scrolling when reduced motion is requested.

- [ ] **Step 5: Run the visual-contract tests**

Run: `npm test`

Expected: PASS.

### Task 3: Add dynamic journey and navigation interactions

**Files:**
- Modify: `app.js`
- Modify: `index.html`
- Create: `tests/interactions.test.js`

**Interfaces:**
- Consumes: Elements marked with `data-journey`, `data-journey-panel`, `data-evidence-node`, `data-nav-toggle`, and `data-solutions-toggle`.
- Produces: Exported pure functions `getJourneyContent(journey)`, `validateEmail(value)`, and `getActiveSection(scrollY, sections)` for unit testing; browser initialization on `DOMContentLoaded`.

- [ ] **Step 1: Write failing tests for pure interaction logic**

Test that both journeys return distinct content, email validation rejects malformed input, and active-section calculation chooses the last section crossing the navigation threshold.

- [ ] **Step 2: Run interaction tests and verify failure**

Run: `node --test tests/interactions.test.js`

Expected: FAIL because the exports do not exist.

- [ ] **Step 3: Implement journey switching and evidence inspection**

Update active states, accessible pressed/selected attributes, visible input signals, evidence descriptions, brief labels, and recommended dispositions when a visitor selects either journey. Evidence nodes reveal a source type, freshness label, and why-it-matters explanation.

- [ ] **Step 4: Implement navigation behaviors**

Add an accessible mobile menu, keyboard-operable Solutions dropdown, smooth anchor navigation, active-section highlighting, Escape-key dismissal, and outside-click dismissal.

- [ ] **Step 5: Run interaction tests**

Run: `npm test`

Expected: PASS.

### Task 4: Add motion, FAQ, and waitlist behavior

**Files:**
- Modify: `app.js`
- Modify: `styles.css`
- Modify: `index.html`
- Modify: `tests/interactions.test.js`

**Interfaces:**
- Consumes: `data-reveal`, FAQ buttons with `aria-expanded`, and form `#waitlist-form`.
- Produces: Scroll reveals, pointer-responsive hero variables, single-open FAQ behavior, and accessible waitlist error/loading/success states.

- [ ] **Step 1: Extend failing tests for waitlist validation and audience data**

Assert valid common email forms, invalid missing-domain values, trimmed inputs, and the allowed audience values `founder`, `product-team`, and `both`.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test`

Expected: FAIL for the new cases before implementation.

- [ ] **Step 3: Implement progressive motion and FAQ interactions**

Use `IntersectionObserver` for reveal classes and pointer position CSS variables for restrained hero movement. Keep all content visible when APIs are unavailable. Implement keyboard-accessible FAQ disclosure behavior.

- [ ] **Step 4: Implement the simulated waitlist flow**

Validate the email, require an audience choice, show inline status with `aria-live`, disable the submit button during a short simulated submission, then replace the form with a success message. Preserve form values after validation failures.

- [ ] **Step 5: Run all automated tests**

Run: `npm test`

Expected: PASS.

### Task 5: Verify the full experience and document usage

**Files:**
- Modify: `README.md`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: Completed static site.
- Produces: Local run instructions and a clean repository that excludes `.superpowers/` brainstorming artifacts.

- [ ] **Step 1: Add run and test instructions**

Document `npm test`, `npm run serve`, and `http://localhost:4173` in `README.md`.

- [ ] **Step 2: Ignore visual-companion working files**

Add `.superpowers/` to `.gitignore`. Keep approved design previews available locally but do not reference them from the production page.

- [ ] **Step 3: Run automated verification**

Run: `npm test`

Expected: all tests pass with zero failures.

- [ ] **Step 4: Run browser-facing verification**

Serve the page on port 4173 and verify HTTP 200 for `/`, `/styles.css`, and `/app.js`. Inspect desktop and mobile layouts, keyboard navigation, both journeys, evidence nodes, FAQ, reduced-motion behavior, and all waitlist states.

- [ ] **Step 5: Run repository hygiene checks**

Run: `git diff --check` and `git status --short`.

Expected: no whitespace errors; only intended source, test, documentation, and user-authored specification changes remain.
