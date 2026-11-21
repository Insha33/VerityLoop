---
name: VerityLoop
description: A white, vibrant SaaS marketing system with coral actions and the approved Rhythm identity.
colors:
  ink: "#101623"
  muted: "#646b76"
  paper: "#ffffff"
  line: "#e7eaee"
  line-strong: "#d3d7df"
  cobalt: "#2768ff"
  coral: "#ff5a4f"
  success: "#28785c"
  coral-dark: "#bd3c33"
  coral-hover: "#ed4c42"
  coral-soft: "#fff0ee"
  stage-blue: "#f1f5fa"
  stage-mint: "#eff7f3"
  stage-peach: "#fff3ee"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(42px, 5.5vw, 72px)"
    fontWeight: 550
    lineHeight: 1.09
    letterSpacing: "-.04em"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(36px, 4vw, 52px)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-.035em"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(24px, 2.2vw, 30px)"
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
    fontSize: "13px"
    fontWeight: 550
  product:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
rounded:
  control: "0px"
  panel: "0px"
  field: "0px"
  frame: "0px"
  hero-frame: "18px"
spacing:
  compact: "8px"
  small: "12px"
  medium: "20px"
  large: "28px"
  panel: "32px"
  section: "72px"
components:
  button-primary:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "12px 21px"
  button-primary-hover:
    backgroundColor: "{colors.coral-hover}"
    textColor: "{colors.paper}"
  button-small:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
  text-link:
    textColor: "{colors.ink}"
    padding: "10px 0"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    height: "48px"
    padding: "10px 12px 10px 36px"
  waitlist-form:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "28px"
---

# Design System: VerityLoop marketing site

Scope: the public site in `apps/marketing`. The product UI (`apps/platform-fe`) follows [docs/design/pm-onboarding.md](docs/design/pm-onboarding.md), its `v8/` references, and [apps/platform-fe/design-qa.md](apps/platform-fe/design-qa.md). Last synced with the code on 2026-11-21. This file replaces `DESIGN_PLAN.md` and `DESIGN_MEMORY.md`, which described the retired September navy/Newsreader theme and components that are no longer rendered.

## Overview

**Creative North Star: "Clean contemporary SaaS."** A pure-white marketing surface with vibrant coral actions, calm Manrope typography, a restrained signal-grid background, and substantive illustrative product scenes. The November 2026 direction draws on Firecrawl and Dovetail for lightness and quiet motion, and preserves the approved Rhythm logo and the product story.

The marketing layer stays spacious. White illustrative workspaces carry the information density, inside light blue, mint and peach stages. Do not restore the historical ivory page, navy sections, or four-bar logo.

Implementation sources: `apps/marketing/src/app/globals.css` (tokens, layout, page-wide rules), `src/components/marketing/ProductStory.module.css`, `SignalGrid.{tsx,module.css}`, `HeroShowcase.tsx`, `backgroundMotion.ts` and `DeliverySteps.tsx`. The page is composed in `src/app/page.tsx`: Header, Hero, ProductStory, ProductDetails (Solutions, Delivery, Context), FAQ, Waitlist, Footer, and the footer SignalGrid.

`globals.css` still starts with an older compact layer: everything above the `Mid-page system (Nov 2026 audit)` banner comment. The rules after that banner override it. Read values from the rendered selectors, not from the compact layer.

## Principles

These hold across every section and outlive any single component.

- **Motion explains behavior, never decorates.** A shared animation has one source of truth; never run independent delayed loops that can drift apart.
- **Native scroll is in control.** Never intercept the wheel, snap, force programmatic scrolling, or add an inner scrollbar. Scroll-driven stories derive the step rail, copy and product surface from one shared progress value.
- **Reserve geometry before transitions** so text and scenes never cause layout shift.
- **Hover recolors; it doesn't float.** Hover changes color, border or shadow. The only rendered lift is the context-source icon.
- **Keyboard focus exposes everything hover does**, with a visible `:focus-visible` style. Targets are at least 44px.
- **Reduced motion gets finished, static states**: stop continuous animation, swap states immediately, and keep all information visible.
- **Honest illustrations.** Product scenes use synthetic examples, are not shipped screenshots, customer proof or measured outcomes, and keep the separate human approvals for decisions, PRDs, ticket drafts and publishing.

## Colors

White and dark ink give the structure. Coral draws attention to actions, and pale stage colors support the product narrative without replacing the page background.

- **Coral:** primary buttons, the Rhythm mark, the second hero line, selected journey and audience controls, small emphasis details.
- **Coral hover / deep coral:** the darker fill for primary-action hover. Deep coral is used for readable accent text, link hover, the active nav item, validation errors, and focus borders.
- **Soft coral:** signup panel, hero offer chip, context-tile and context-source hover, field-focus outline, delivery-gate highlight. The primary-source callout quote uses the close tint `#fff6f4`.
- **Cobalt:** decorative only, in the coral-to-cobalt frame rings and the hero glow. No interaction state is blue (Nov 2026 request). `--blue-soft` is still defined in CSS but unused.
- **Success green:** reviewed and on-track examples, and successful waitlist submission.
- **Stage blue / mint / peach:** walkthrough stages. The first and final steps share blue.
- **Neutrals:** paper (page, nav, walkthrough, form and product interiors), ink (headings, main text), muted (supporting copy, nav, captions), line and line-strong (dividers, field borders).

The signal grid draws ink hairlines at 5.5% and lights cells only in coral shades: coral up to 55%, pale coral 42%, deep coral 30%, peach 50%. It never uses blue or grey cells.

## Typography

Manrope is loaded through Next.js. Authored SVG and React product concepts specify Inter with system fallbacks; Inter is not bundled.

- **Hero:** weight 550, 72px at the wide breakpoint. On mobile it is `clamp(34px, 6.6vw, 48px)`, then `clamp(31px, 7.8vw, 43px)` at 600px. Supporting copy is 16px (14px below 768px), with a 560px max width.
- **Section heads:** `clamp(36px, 4vw, 52px)`, weight 500, used by Solutions, Delivery, Context and FAQ. Supporting copy is 17px.
- **Journey-card titles:** `clamp(24px, 2.2vw, 30px)`. Card copy is 16px (15px on mobile).
- **Context copy:** 17px (15px on mobile). **FAQ:** questions 17px, answers 16px, both 15px on mobile.
- **Controls:** desktop nav 14px, form labels 13px, form inputs 16px at every size.
- **Small text:** the floor is 11px for the hero offer chip, form status and small print, and waitlist options at 420px and below. Footer text is 9px (8px at 600px and below), which is below a readable floor and is a known gap. Only text inside product illustrations should go smaller.

## Layout

- **Shell:** 1160px max with 40px gutters; at 1450px and above, 1240px with 60px gutters. Gutters are 24px at 1024px and below, and 20px at 767px.
- **Section rhythm:** 72px vertical padding, 64px at 1024px and below, 52px at 767px. Solutions trims its top to 24px because the walkthrough ends with its own padding. There are no divider lines between sections. The walkthrough has its own 80px vertical padding.
- **Navigation:** sticky, white, 72px tall (64px below 768px), with a right-side menu sheet on mobile. Brand on the left, links in the center (How it works, Solutions, FAQ, all plain anchors), waitlist action on the right. Section links use native smooth scrolling with a 100px header offset, and jump immediately under reduced motion.
- **Section header:** `.section-head` puts the title on the left and supporting copy on the right, both top-aligned. Solutions uses a centered head over its signal band.
- **Walkthrough (ProductStory):** a 300px step column and a flexible stage, 60px apart. On viewports at least 900px wide and 800px tall, the panel sticks 90px below the top. A measured scroll track adds three intervals of 0.8 viewport heights, and page scrolling advances or reverses the four steps. Clicks and keyboard selection still work, and the next scroll boundary resumes automatic selection. The desktop stage height is `clamp(440px, calc(100svh - 310px), 528px)`. Smaller or shorter viewports, and reduced motion, get four naturally stacked scenes: 500px tall, 470px at 420px and below, 520px at 360px and below.
- **Columns:** audience cards and signup are two columns, stacking at 600px. Delivery is two columns, stacking at 767px. Context sources are a 6-column grid, 4 at tablet, 3 on mobile, 2 at 420px.
- **Hero image:** a purpose-cropped 454 × 543 asset at 600px and below. Never shrink the full desktop workspace into a thumbnail.

## Elevation and shapes

- Most surfaces separate with pale fills and thin 1px borders. `--shadow-product` is `0 24px 64px -24px rgb(32 45 67 / 18%)`. Walkthrough windows use their own smaller paired shadow. The hero product window has no shadow inside its frame. The selected waitlist segment has a compact shadow; the selected walkthrough segment has none.
- **Every corner is sharp.** One page-wide rule at the end of `globals.css` sets `border-radius: 0 !important` on everything, including shadcn/Radix primitives. `.product-frame` and the `--radius-*` variables are therefore 0 in practice.
- **Round exceptions:** caption dots, callout avatars and the journey connector dot (in `globals.css`), plus the walkthrough's live dots and avatars, which set `border-radius: 50% !important` on `.liveDot` and `.avatar` in `ProductStory.module.css`. Keep module exceptions in their own module: hashed class names differ between `next dev` and `next build --webpack`, so a global attribute selector can't match them reliably.
- **Hero exception:** the hero showcase keeps rounded corners (frame 18px, product window 11px, callout cards 12px, callout icon 7px, quote 8px) and its two coral "+" marks at the frame's top corners. Rounded shapes drawn inside product SVGs are part of those images.

## Components

### Brand

Preserve the VerityLoop name and the approved Rhythm geometry from `apps/marketing/src/content/brand.json`, rendered by `BrandMark.tsx`: two opposing curved shapes around a centered rounded diamond. The header and footer mark is coral, and approved exports live in `apps/marketing/public/brand`. Never substitute the former four-bar mark or redraw the geometry.

### Hero and signal grid

Preserve the exact headline: "Your next product move" over "Backed by evidence." The first line has no visible period; a visually hidden one keeps the pause for screen readers. The second line is coral. The offer chip, primary CTA, secondary link and product illustration stay in the foreground.

**Signal grid** (`SignalGrid.tsx`). A canvas of square cells on a CSS hairline grid, visible without JavaScript. Short coral-shade "drops" fall two to five cells and fade over about 1.5s. Grids render at 30fps, cap device pixel ratio at 2, run only while on screen with the tab visible and reduced motion off, and are hidden from assistive technology. There is no pause control, by product decision (2026-11-13). Three instances are rendered:
- **Hero:** 28px cells, 720px tall. It clears an ellipse for the headline, fades before the product, and the pointer gently lights nearby cells.
- **Solutions band:** 24px cells, visible only on either side of the copy.
- **Footer:** behind the last 620px of the page (420px on mobile), under the signup panel and footer, without adding height. It is dense at the bottom and fades upward, and its drops rise.

The signup panel itself has no grid. Line-based evidence trails were rejected for this background.

**Hero product.** The signal-inbox illustration sits in a wide frame (up to 1240px) with a white bezel, a coral-to-cobalt hairline ring and a soft glow. From 768px it starts tilted (6deg, 95% scale) and settles flat over the first 560px of scroll via GSAP ScrollTrigger; the CSS sets the same start state so hydration never jumps. From 1024px, two callout cards overlap the frame: a verified primary source (a competitor pricing page) and customer context (a discovery call). They repeat evidence already in the illustration, are hidden from assistive technology, fade in with a short stagger and drift on scroll. Reduced motion shows the frame flat with static callouts.

### Walkthrough (ProductStory)

Founders and Product teams use native audience buttons with pressed state. Four vertical ARIA tabs support the arrow keys, Home and End. Only the selected desktop panel is exposed to assistive technology. Narrative and preview change together. Scenes cross-fade over 360ms, with outgoing and incoming together so the stage never empties. The main window rises into place, secondary pieces stagger at half length and settle within about 1.3s, and scenes can be replayed. The stage shares the static hairline grid and a ring shadow. Scenes pause while the stage is offscreen. The pause rule in `ProductStory.module.css` must stay after every `.reveal` and `.connection > span` rule, because their `animation` shorthand resets `animation-play-state`.

### Solutions: audience cards

Two white `.journey-card` feature tiles with a hairline border, sharing rows through subgrid. Each has a pearl stage with a static hairline grid showing the input window, a dashed coral connector and the output brief. The audience pill, title, copy and a bottom-anchored link sit below. Hover and focus-within turn only the border coral; nothing moves. The product notes are "No roadmap required" and "Permission-scoped context".

### Delivery (DeliverySteps)

Three numbered approval gates on a transparent background beside a `.product-frame` scene stage (white bezel, coral-to-cobalt ring). Hovering with a mouse, focusing or tapping a gate gives it a soft-coral highlight and plays its live HTML scene:
- an approved decision, then the PRD draft;
- the approved PRD, then three ticket drafts;
- review checks ticking, then the publish action unlocking.

The outgoing scene fades in 240–300ms. The incoming one rises from a 6px blur over about 640ms, and its contents stagger. Arrow keys move between gates. Hidden scenes are `aria-hidden` and `inert`. The publish scene is a working demo: choose Linear or Jira, press Publish (a short "Publishing…" state), and the review list is replaced, at the same height, by three created tickets (VER-142… for Linear, VL-142… for Jira) and a green "Published to …" button. "Reset demo" or leaving the step resets it, and nothing leaves the page. Reduced motion swaps instantly and shows finished states.

### Context sources

Large tiles with 30px icons in the 6/4/3/2-column grid, inside a frame using the coral-to-cobalt ring on a pearl fill. Hover, focus or tap reveals a dark purpose tooltip, a soft-coral background and a subtle icon lift. Escape dismisses the tooltip, and a repeated tap toggles it closed.

### Buttons and links

Primary actions are coral with white text, a small arrow where it helps, and sharp corners. The standard minimum height is 46px, compact nav actions are 40px, and main actions on mobile are 44px. Hover darkens the fill and pressing moves the control down 1px. Unboxed links turn deep coral on hover. Keyboard focus stays visible.

### Waitlist form

A white form inside a solid soft-coral signup panel, with no animation inside. Labels are explicit, and leading icons get reserved inset space. Inputs are 48px tall with 16px text. Focus turns the border deep coral with a soft-coral outline, and invalid fields use deep coral. The three-choice audience selector has a pale track and a coral sliding segment with white selected text, and each choice is at least 44px tall. A pending submission dims the action, and completion uses green at full opacity with a default cursor. Never reuse the pending dimming for the done state. Preserve the validation and the `/api/waitlist` submission contract.

### FAQ

Rows have thin separators, readable text, and restrained plus/minus indicators. The global reduced-motion styles make transitions effectively immediate.

### Accessibility labels

The audience-stage and delivery-region labels say the scenes are illustrative. The hero image alt text and the walkthrough scene labels don't yet; add the word when those are next edited.

## Do and don't

**Do:**
- Keep pure-white page, nav and walkthrough surfaces with blue, mint, peach and coral framing.
- Keep the Rhythm mark, the exact hero headline, coral primary actions, and equal founder and team journeys.
- Keep marketing controls readable independently of compact illustration UI.

**Don't:**
- Restore the ivory page, navy sections, Newsreader headlines, or the four-bar logo.
- Add blue interaction states, line-based evidence trails, or decorative motion that competes with copy.
- Change walkthrough steps on a timer or intercept page scrolling.
- Present authored previews as shipped screenshots, customer proof or measured outcomes.
