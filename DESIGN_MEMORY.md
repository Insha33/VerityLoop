# Design Memory

## Brand Direction

- VerityLoop should feel minimal, premium, technical, and evidence-first.
- Use the navy canvas as the primary technical surface; coral communicates active scanning and human attention, while cobalt belongs to the VerityLoop mark.
- Prefer structured diagrams with stable geometry over decorative floating objects.

## Layout and Spacing

- Landing-page sections use the existing `--shell` width and comfortable spacing.
- Integration diagrams should preserve a square visual stage and keep all nodes aligned to explicit geometry.
- Use restrained radii: approximately 6px for labels, 10–12px for icon tiles, and full circles only for hubs, orbits, and pill controls.

## Typography and Color

- Keep marketing headlines in Newsreader and interface labels in Manrope.
- Primary dark surface: `--navy` (`#0b1224`).
- Active motion and focus: `--coral` (`#ff5a4f`).
- Product identity mark: `--cobalt` (`#2768ff`) with a coral terminal bar.
- Secondary dark-surface text should stay near `#8995aa` or `#a5abb8`.

## Dark Glass Surfaces

- The waitlist card is the reference implementation for dark glass: a layered gradient body, a masked 1px gradient border for the light-catching edge, and recessed inputs.
- Specular highlights belong at the top edge only and must stay under ~25% white; a gloss spread across the upper half reads as a washed-out light leak.
- The coral CTA carries a top-edge highlight, an inner bottom shade, and a restrained outer bloom. Bloom above roughly `0 14px 30px -10px` starts to look like a glow effect rather than elevation.
- A completed success action must render at full opacity with a default cursor; reusing the pending `:disabled` dimming makes a finished state look unavailable.

## Interaction Patterns

- Continuous animation must communicate system behavior, not decorate the page.
- A shared animation should have one source of truth; avoid independent delayed loops that can overlap or drift.
- Long product stories use native page scroll as the source of truth; do not intercept the wheel or create an inner scrollbar.
- In multi-stage walkthroughs, the step rail, explanatory copy, and product surface must change from one shared progress value.
- For the decision walkthrough, native vertical page scroll selects discrete stages and advances a 260ms horizontal product-card conveyor; never combine per-pixel scroll transforms with a second CSS easing layer.
- Reserve the complete geometry for narrative and product surfaces before transitions begin so text never causes layout shift.
- Hover effects change color, border, or shadow without floating the control upward.
- Connector/tooltips enter and exit in 150–180ms and never alter layout.
- Keyboard focus must expose the same information as pointer hover.

## Accessibility and Motion

- Stop continuous scanning under `prefers-reduced-motion`.
- Replace scroll-driven transition duration with an immediate state change under `prefers-reduced-motion`.
- On narrow screens, show the full journey as a readable vertical sequence instead of preserving desktop sticky behavior.
- Preserve static geometry and all source information when motion is disabled.
- Provide visible `:focus-visible` styling and at least 44px targets.
- Brand images require meaningful parent labels and visible text fallbacks.

## Repository Conventions

- Marketing components live under `src/components/marketing/`.
- Component-specific complex visuals use colocated CSS Modules; shared section typography and layout remain in `src/app/globals.css`.
- Marketing source copy and connector metadata live in `src/content/marketing.ts`.
- `tests/setup.ts` builds the test stylesheet by slicing `globals.css` between literal selector strings, so reformatting a rule it anchors on silently drops those styles from the test DOM instead of failing loudly. Anchor markers on the selector, never on the first property.
