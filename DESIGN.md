---
name: VerityLoop
description: A clean SaaS marketing system with the original coral, ivory, and navy palette.
colors:
  ink: "#101623"
  muted: "#646b76"
  paper: "#faf9f6"
  line: "#e2dfd9"
  line-strong: "#d3d7df"
  cobalt: "#2768ff"
  coral: "#ff5a4f"
  blue-soft: "#edf0fa"
  success: "#28785c"
  coral-dark: "#bd3c33"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(42px, 5.5vw, 68px)"
    fontWeight: 500
    lineHeight: 1.09
    letterSpacing: "-.04em"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(33px, 3.6vw, 44px)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-.035em"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "30px"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-.035em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "11px"
    fontWeight: 550
  product:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
rounded:
  control: "7px"
  panel: "12px"
  field: "6px"
  window: "8px"
  form: "9px"
spacing:
  compact: "8px"
  small: "12px"
  medium: "20px"
  large: "28px"
  panel: "32px"
  section: "100px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "12px 21px"
  button-small:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "8px 14px"
  text-link:
    textColor: "{colors.ink}"
    padding: "10px 0"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    height: "44px"
    padding: "10px 12px 10px 36px"
  waitlist-form:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.form}"
    padding: "28px"
---

# Design System: VerityLoop

## Overview

**Creative North Star: "Clean contemporary SaaS"**

A clean contemporary SaaS system: warm ivory surfaces, a navy product walkthrough, calm sans-serif typography, coral controls, and substantive product imagery. It follows the user’s Dance, Maze, Console, and Lightfield reference direction while retaining the VerityLoop name and cobalt/coral logo.

The marketing layer stays spacious; illustrative product workspaces carry the information density. Pale blue, gray-green, and warm sand stages frame white interfaces. Product concepts use synthetic examples and remain visibly labeled as illustrative.

**Key Characteristics:**

- Light Manrope typography with restrained headline weight.
- Coral primary controls and sparse cobalt accents.
- Thin neutral dividers, modest corners, and selective product-window shadows.
- Authored SVG interfaces with readable detail crops and explicit illustration labels.

## Colors

Near-black and white establish the hierarchy; cool secondary text and pale stages keep it quiet. Frontmatter records reused implemented primitives; local illustration colors remain owned by the asset generator.

### Primary

- **Ink:** headings, main text, primary actions, and structural emphasis.
- **Cobalt:** brand bars, keyboard focus, selected story indicator, links on hover, and context markers.

### Secondary

- **Coral:** a restrained accent in the existing brand mark.
- **Success green:** reviewed/on-track states and successful waitlist submission.
- **Deep coral:** invalid field borders and form errors.

### Neutral

- **Paper:** page, navigation, controls, and white product interiors.
- **Muted gray:** body descriptions, secondary navigation, metadata, and captions. This reflects the final text-contrast adjustment.
- **Line / Strong line:** thin dividers and stronger field borders respectively.
- **Soft blue:** context tiles, selected details, and field-focus support.

Pale blue, green-gray, and sand are local illustration stages, not independent brand themes. The secondary hero line has its own subdued gray treatment.

## Typography

Manrope is loaded through Next.js for the complete marketing surface. Headings use moderate weight and tight tracking; body text uses more open line spacing. The embedded SVG concepts specify Inter with system sans fallbacks, without bundling an external font.

The frontmatter hierarchy records desktop defaults: display for the hero, headline for section introductions, title for story headings, body for the page, and label for form/metadata roles. Supporting section copy commonly uses (13–14px); compact preview labels use (9–11px). Product artwork uses a separate compact hierarchy, with source text commonly (11–13px) and workspace headings (24–29px).

Hero text becomes (72px) above the large breakpoint. Tablet and mobile overrides reduce it through observed clamp ranges; section headings generally become (34–36px) on small screens. Keep copy widths deliberate: the hero subtitle is capped at (530px), narrative copy generally at (380–420px). Mobile form fields use (16px) text.

## Layout

The desktop shell is capped at (1160px), with (40px) side gutters. Above (1450px), the cap becomes (1240px) with (60px) gutters. At (1024px) and below, gutters become (24px), then (20px) at (767px). Section spacing steps from (100px) to (76px) to (65px).

Navigation is sticky, white, and (72px) tall; at (767px) it becomes (64px) and uses a menu sheet. The centered hero leads into a large framed workspace. Narrative/product pairs and audience cards use two columns; at (600px) they stack. Founder and product-team cards retain equal weight. Source tiles retain a three-column grid.

The product story uses a Founders / Product teams selector above four vertical steps and a fixed 528px animated product stage. Active descriptions expand over 500ms; scenes crossfade while individual UI elements arrive in sequence. Below 768px the story stacks and the stage becomes 500px, then 470px on narrow phones and 520px at 360px or below to accommodate wrapped copy. The hero switches at (600px) to a purpose-cropped (454 × 543) asset. Do not infer new layout rules from the older DESIGN_PLAN.md or DESIGN_MEMORY.md artifacts.

## Elevation & Depth

Most surfaces are flat, separated by pale fills and thin rules. Shadows belong to product windows, document previews, and the selected audience-form segment—not every marketing card. The product-window shadow is defined by `--shadow-product`; the sidecar retains its exact value together with the smaller detail-preview and selector shadows.

## Shapes

Use modest, consistent rounding: control and panel primitives establish the main silhouette, while fields, product windows, and forms have the observed intermediate radii recorded above. White panels sit within softly colored stages. Dividers and field outlines are (1px); active story steps use a (2px) cobalt bottom rule. Avoid pill-shaped primary buttons.

## Components

### Buttons and text links

Primary buttons use the original bright coral with white text, moderate rounding, and a small arrow. Their normal minimum height is (46px); small navigation actions are (36px). On mobile, main buttons use a (44px) minimum. Hover lightens the coral fill; active state moves down (1px). Text links remain unboxed and turn cobalt on hover. All retain visible keyboard focus.

### Inputs and audience selector

The white waitlist form is flat, with explicit labels and bordered fields. A leading icon receives reserved inset space. Focus changes the field border to cobalt with a soft-blue outline; invalid state uses deep coral. The three-choice audience selector has a pale track and white sliding segment. Pending submission dims the action; completion uses green. Actual form validation and submission behavior remain defined by the existing implementation.

### Navigation

The brand sits left, compact links in the center, and waitlist action right. Secondary navigation text darkens on hover. The Solutions dropdown uses white grouped rows with soft-blue focus; mobile uses a right-side sheet with audience destinations. Preserve the existing name and four-bar logo.

Context-source tiles reveal a dark purpose tooltip on hover, keyboard focus, or tap. The icon lifts 2px and scales subtly while its tile gains a soft-blue highlight. Only one tooltip stays open; Escape dismisses it and a repeated tap toggles it closed. Tooltip placement respects viewport edges, and reduced motion removes the animation.

Section links use native smooth scrolling with a 100px sticky-header offset. The reduced-motion preference restores immediate scrolling.

### Cards and product concepts

Audience cards are equal-sized pale surfaces with white inline previews. Product and delivery windows use neutral borders/dividers, dense source information, restrained status chips, and selective shadows. Inline founder/roadmap and delivery examples are illustrations too; their control-like elements are not application functionality.

The SVG source is `scripts/build-product-assets.py`; generated assets live in `public/product`. The hero and three story details share the same authored workspace, evidence, and decision vocabulary. Synthetic people, prices, dates, sources, and counts demonstrate a concept; they do not establish commercial proof or product availability.

### Product story and FAQ

The story uses native audience buttons with pressed state and vertical ARIA tabs for its four steps, supporting arrows, Home, and End. Only the selected panel is exposed to assistive technology. On desktop, normal page scrolling advances and reverses the active step within a sticky section. ProductMotionScene.tsx authors eight audience-specific React/CSS motion assets; each finite sequence settles within 2.2 seconds, pauses offscreen, and can be replayed. Reduced-motion shows the completed static scene. Narrative and preview change together without intercepting wheel or touch events. Small screens, short viewports, and reduced-motion preferences use a natural vertical sequence with all four scenes readable. FAQ rows use thin separators and restrained plus/minus indicators. Respect the global reduced-motion override, which reduces animations and transitions to effectively immediate changes.

## Do's and Don'ts

### Do:

- Do use Manrope for marketing typography and compact system sans typography inside authored product concepts.
- Do preserve the cobalt/coral brand mark and near-black primary actions.
- Do show both founders and product teams with equal visual prominence on the landing page.
- Do retain visible focus treatments, explicit form labels, and reduced-motion behavior.
- Do label product concepts and synthetic data as illustrative.

### Don't:

- Retain the cleaner sans-serif layout. The user explicitly restored the earlier coral, ivory, and navy palette on 2026-09-06.
- Don’t present authored previews as shipped application screenshots, customer proof, or measured outcomes.
- Do not use a timer to change steps or intercept page scrolling; progress follows the visitor’s scroll position.
- Don’t stretch a complete desktop workspace into an unreadable mobile thumbnail; use the authored detail crop.

## PRD copy and scroll update — 2026-09-06

The hero states the market-to-product decision promise. Section three shows meaningful natural-language founder input, optional enrichment, framing confirmation, and an Opportunity Brief; the team path shows a verified event, existing strategy/capability/planned work, and a Roadmap Impact Brief. Delivery and FAQ copy preserve separate decision, PRD, and publish approvals. Marketing metadata follows the same promise.

The walkthrough is navy; primary controls use #ff5a4f coral with white text. Page backgrounds use #faf9f6 ivory. The hero and concept graphics retain white interiors and the original blue/coral brand mark. Static product assets use deep coral for readable accent text.

At 900px wide and 800px high or larger, the story panel sticks 90px below the viewport top over a scroll track of its measured height plus 2.4 viewports. Four step boundaries use 0.8 viewport spacing. Clicks and keyboard selection remain available; crossing the next scroll boundary resumes automatic selection. Smaller/shorter viewports and reduced-motion use four naturally stacked scenes. No wheel cancellation, scroll snapping, or forced programmatic scroll is used.

2026-09-06 refinement: user restored “Your next product move. Backed by evidence.” Coral CTA and selected journey controls use white text. Both audience cards share #f8f6f2 at rest and #f0ede7 on hover or focus-within; column flex layout anchors the links to the same bottom line. Authored SVG status labels are centered on both axes.

The delivery section shares the walkthrough’s #0e131e navy background, #faf9f6 heading/list text, #b9bfcc supporting text, and #ff8178 coral checkmarks. Its document preview retains a white surface.
