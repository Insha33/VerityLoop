# Landing page redesign

Mode: Persuade. User-pinned reference direction overrides randomized art-direction assignment: clean contemporary SaaS alongside Dance, Maze, Console, Lightfield. Local roll had no remote catalog; no challengers were adopted.

Audience assumption: retain equal prominence for founders and product teams from existing copy.

First viewport: slim 72px white navigation, centered two-line sans heading, concise description and paired CTA, then a large light-mode product workspace on a pale blue stage. No giant italic titles, dark section alternation, orbit metaphor, fake customer logos, or scroll trapping.

Asset contract: authored SVG UI concepts with a unified sidebar, typography, evidence states, synthetic pricing example, and citations. Dense full-screen desktop hero; purpose-cropped mobile hero and feature details. Label illustrative screens. Source generator lives in scripts/build-product-assets.py.

Visitor path: understand the purpose, inspect a signal becoming a decision through four manually selectable steps in either audience journey, see equal founder/product-team use cases, understand scoped context and reviewed delivery, resolve FAQs, join waitlist.

Signature interaction: Dance-inspired vertical expanding steps with a Founders / Product teams toggle and eight authored UI motion scenes. CSS opacity and transform sequences run once when visible, settle within 2.2 seconds, and can be replayed. The stage retains its size across steps. Keyboard tabs support arrows, Home, and End. Reduced-motion displays static completed scenes. No automatic step cycling or scroll trapping. Motion assets live in ProductMotionScene.tsx and ProductStory.module.css; hero SVG assets retain the generator. Copy follows the user-supplied v0.4 draft PRD, with distinct Opportunity and Roadmap Impact briefs and explicit decision, PRD, and publishing gates.

Visual system: warm white, near-black, cool gray secondary text, pale blue and warm sand stages, existing cobalt/coral logo used sparingly. Manrope sans for all display. Normal compact app typography. Black modest-radius CTA, thin neutral rules, clear form labels and focus states. Flat white waitlist form, understated role selector.

Preserve actual waitlist requests and validation, FAQ truths, mobile navigation, audience anchors, metadata. Existing unrelated dirty work remains intact. No deployment.

2026-09-06 user override: restore the original bright coral, ivory, navy palette; retain the clean layout and sans-serif typography. Product steps now advance with native scrolling in a sticky desktop presentation, with a normal stacked flow on small/short screens and reduced-motion. This supersedes earlier manual-only and no-dark-section direction. Section-three input/output examples and site copy now follow the supplied PRD framing, two-brief, and separate-approval model.
