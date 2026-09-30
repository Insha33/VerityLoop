# Design Implementation Plan: Landing-page product visuals

## Decision Journey — selected Variant D hybrid

- **Scope:** Merge the former Product and Solutions sections while preserving the separate How it works workflow.
- **Target:** `src/components/marketing/DecisionJourney.tsx`
- **Winner:** Variant D product conveyor, adapted to native vertical page scrolling.
- **Outcome:** A single five-stage walkthrough with a left step rail, a medium-length narrative panel, and a product surface that transitions vertically with the page.

### Implemented Files

- [x] `src/components/marketing/DecisionJourney.tsx` — scroll progress, audience switch, step navigation, mobile sequence, and synchronized narrative/card state.
- [x] `src/components/marketing/DecisionJourneyCard.tsx` — five stage-specific product surfaces for signal, evidence, decision, approval, and delivery.
- [x] `src/components/marketing/DecisionJourney.module.css` — stable sticky geometry, discrete 260ms horizontal card transitions driven by vertical scroll, responsive fallback, and reduced-motion behavior.
- [x] `src/content/decisionJourney.ts` — founder and product-team stories, evidence boundaries, decision memory, and agent-ready outputs.
- [x] `src/app/page.tsx` — replaced the three duplicated section renders with the merged walkthrough.
- [x] `tests/page.test.tsx` and `tests/interactions.test.tsx` — updated the merged-section contract and audience/step interactions.

### Interaction Contract

1. Native page scroll is the only automatic progress source.
2. The five left-rail controls map to fixed positions in the scroll story.
3. Narrative copy and product surface use the same continuous progress value.
4. Switching audiences preserves the current workflow stage.
5. Mobile renders all five stages sequentially instead of trapping scroll.
6. Reduced-motion mode removes transition duration while preserving every state.

### Verification

- [x] TypeScript check
- [x] 59 component and interaction tests
- [x] Static-export production build
- [x] Browser runtime check, including static integration assets

---

## MCP Context Integration Radar

## Summary

- **Scope:** Landing-page component redesign
- **Target:** `src/components/marketing/ContextOrbit.tsx`
- **Winner:** Variant D, Evidence Radar
- **Outcome:** Replace the abstract floating source pills with 11 recognizable product-context connectors arranged at equal angles across three fixed orbits.

## Implemented Files

- [x] `src/components/marketing/ContextOrbit.tsx` — Production radar structure, synchronized scan state, source-name hover/focus labels, and accessible source descriptions.
- [x] `src/components/marketing/ContextOrbit.module.css` — Stable orbit geometry, responsive sizing, visual states, and reduced-motion behavior.
- [x] `src/content/marketing.ts` — Connector names, local icon paths, fallback initials, and short usage descriptions.
- [x] `public/integrations/` — Local connector artwork used by the production radar.
- [x] `src/app/globals.css` — Removed the superseded floating-cloud styles.
- [x] `tests/interactions.test.tsx` — Updated the component contract for the 11 accessible sources.
- [x] `tests/marketing.test.ts` — Updated the approved source-count assertion.

## Interaction Contract

1. Connector positions never drift or move.
2. The scanner completes one clockwise rotation every 16.5 seconds.
3. The scanner animation is the single timing source for scan feedback.
4. At most one connector usage label appears while the scanner crosses it.
5. Pointer hover and keyboard focus temporarily replace the usage label with the connector name.
6. Reduced-motion mode stops the scanner and leaves connector names available through focus and hover.

## Accessibility Checklist

- [x] Every connector has an accessible name combining connector and purpose.
- [x] Connector information is reachable by keyboard.
- [x] Focus has a visible coral ring independent of hover.
- [x] Informational animation stops for reduced-motion users.
- [x] Icon fallbacks remain visible if a favicon cannot load.

## Verification Checklist

- [x] TypeScript check
- [x] Component and copy tests
- [x] Production build
- [x] Final browser review of production geometry, scan state, hover state, overflow, and removed preview route
