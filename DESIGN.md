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
  blue-soft: "#edf0fa"
  success: "#28785c"
  coral-dark: "#bd3c33"
  coral-hover: "#ed4c42"
  coral-soft: "#fff0ee"
  stage-blue: "#f1f5fa"
  stage-mint: "#eff7f3"
  stage-peach: "#fff3ee"
  delivery-frame: "#f5f8fb"
  audience-surface: "#f7f9fb"
  audience-hover: "#eef3f7"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(42px, 5.5vw, 72px)"
    fontWeight: 550
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
    fontSize: "29px"
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
  control: "7px"
  panel: "12px"
  field: "6px"
  window: "8px"
  form: "9px"
  frame: "16px"
spacing:
  compact: "8px"
  small: "12px"
  medium: "20px"
  large: "28px"
  panel: "32px"
  section: "100px"
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
    rounded: "{rounded.form}"
    padding: "28px"
---

# Design System: VerityLoop

## Overview

**Creative North Star: "Clean contemporary SaaS"**

The established VerityLoop identity is refined into a pure-white, modern marketing surface with vibrant coral actions, calm Manrope typography, and substantive product concepts. The November 13, 2026 direction draws on Firecrawl and Dovetail for lightness and minimal background motion while preserving the approved Rhythm logo and the existing product story.

The marketing layer stays spacious; white illustrative workspaces carry the information density within light blue, mint, and peach stages. A hairline signal grid lights coral cells in the white space around the hero headline, the Solutions heading and the signup form, leaving copy clear. Delivery sits on white within a light-blue frame; signup uses a light-coral panel with a white form.

This current specification replaces the September ivory page and navy walkthrough/delivery treatment. Historical design plans and older product notes are not authority for restoring those surface colors. The brand asset generator retains its own paper color; the marketing page uses the white `paper` token below.

**Key Characteristics:**

- Pure-white page, navigation, and walkthrough with light cool framing.
- Coral primary actions and selected journey controls; cobalt keyboard focus and secondary accents.
- Readable marketing controls, thin neutral dividers, modest corners, and selective shadows.
- The approved Rhythm mark, a restrained signal-grid background, a prominent framed hero product with evidence callouts, and clearly labeled illustrative product concepts.

Implementation sources are `apps/marketing/src/app/globals.css`, `apps/marketing/src/components/marketing/ProductStory.module.css`, `apps/marketing/src/components/marketing/SignalGrid.{tsx,module.css}`, `HeroShowcase.tsx`, `MotionToggle.tsx`, and `backgroundMotion.ts`. The route composes these surfaces in `apps/marketing/src/app/page.tsx`. This records the built implementation; the visual review was scoped to the supplied screenshots, not every possible viewport or browser.

## Colors

White and dark ink establish readable structure. Coral draws attention to actions; pale color stages support the product narrative without replacing the page background. Frontmatter records implemented values, including named local fills; it does not imply that every local fill has a CSS custom property.

### Primary

- **Coral:** primary buttons, the Rhythm mark, the second hero line, selected journey/audience controls, and small emphasis details.
- **Coral hover:** the darker hover fill and border for primary actions.
- **Deep coral:** readable accent text, validation errors, and form error borders.

### Secondary

- **Cobalt:** visible keyboard focus, link hover, and field focus borders.
- **Success green:** reviewed/on-track examples and successful waitlist submission.
- **Light blue / mint / peach:** walkthrough stages; the first and final steps share the blue stage.
- **Soft coral:** signup panel, hero offer chip, primary-source callout quote, and context tile accent.

### Neutral

- **Paper:** pure-white page, navigation, walkthrough, and form/product interiors.
- **Ink:** headings, main text, and structural emphasis.
- **Muted gray:** supporting copy, navigation, captions, and metadata.
- **Line / Strong line:** thin dividers and stronger field borders.
- **Soft blue:** field-focus support and context-source hover/focus states.
- **Delivery frame:** pale blue framing around delivery copy and the white document preview.
- **Audience surface / hover:** matching cool backgrounds for both audience cards, including focus-within feedback.

The signal grid draws ink hairlines at (5.5%) and lights cells in coral (up to 55%), pale coral (40%), cobalt (22%) and ink (8%). The hero frame ring runs coral to cobalt; a blurred coral/cobalt glow sits behind it. These are decorative colors, not new semantic product states.

## Typography

Manrope is loaded through Next.js for marketing typography. Moderate heading weight and tight tracking give the page its clean character; body text uses open line spacing. Authored SVG and React product concepts specify Inter with system sans fallbacks, without bundling a separate Inter font.

Frontmatter records the hero display, general section headline, audience-card title, page body, and form-label defaults. The hero uses weight (550); section headings generally use (500). At the wide breakpoint the hero is (72px); mobile uses `clamp(34px, 6.6vw, 48px)`, then `clamp(31px, 7.8vw, 43px)` at (600px).

Marketing and illustration text have different density needs. Desktop navigation is (14px), FAQ questions and answers are (14px), form labels are (13px), and form inputs are (16px) at every size. Hero supporting copy is (16px), becoming (14px) below (768px), with a (560px) maximum width. Audience, delivery, and context copy uses (15px), becoming (14px) on mobile. Compact product examples retain smaller labels; do not apply their scale to marketing controls.

## Layout

The desktop shell is capped at (1160px), with (40px) side gutters. At (1450px) and above it becomes (1240px) with (60px) gutters. At (1024px) and below the gutters become (24px), then (20px) at (767px). General section padding steps from (100px) to (76px) to (65px); the walkthrough has its own (80px) vertical padding.

Navigation is sticky and white, with a (72px) height. Below (768px), it becomes (64px) and uses a right-side menu sheet. The centered hero leads into a framed white workspace. Audience cards, delivery, context, and signup use two columns, stacking at (600px). Founder and product-team cards have equal prominence, with links anchored to the bottom. Context sources retain a three-column grid.

The desktop walkthrough uses a (300px) step column and flexible product stage separated by (60px). On viewports at least (900px) wide and (800px) tall, its panel sticks (90px) below the top. A measured scroll track adds three intervals of (0.8) viewport heights. Page scrolling advances or reverses the four steps; clicks and keyboard selection remain available, and the next scroll boundary resumes automatic selection.

Smaller or shorter viewports and reduced-motion preferences use four naturally stacked scenes. Desktop stage height is `clamp(440px, calc(100svh - 310px), 528px)`; stacked stages are (500px), (470px) at (420px) and below, and (520px) at (360px) and below for wrapping. The hero uses a purpose-cropped (454 × 543) asset at (600px) and below.

## Elevation & Depth

Most surfaces use pale fills and thin borders for separation. Product windows, the delivery preview, and the signup form use the diffuse `--shadow-product` shadow (`0 24px 64px -24px rgb(32 45 67 / 18%)`). Walkthrough windows have their own smaller paired shadow. The selected waitlist segment has a compact shadow; the selected walkthrough segment has none. Exact shadows and motion values are in the sidecar. Keep white interiors visibly distinct from their light-colored frames.

## Shapes

Controls and panels use modest rounding, with fields, product windows, and forms using the intermediate radii recorded in frontmatter. Delivery and context frames use (16px) corners. Dividers and field outlines are (1px). Primary buttons are gently rounded rectangles; the hero offer chip is a pill and the background pause control is circular. Signal-grid cells are square and share the grid's hairlines; they are not connected evidence trails. The hero product frame uses an (8px) white bezel and (18px) outer radius; callout cards use (12px).

## Components

### Brand and navigation

Preserve the VerityLoop name and approved Rhythm geometry from `apps/marketing/src/content/brand.json`, rendered by `apps/marketing/src/components/marketing/BrandMark.tsx`. It combines two opposing curved shapes and a centered rounded diamond. The header/footer mark is coral; approved exports live in `apps/marketing/public/brand`. Do not substitute the former four-bar mark or redraw the geometry.

Navigation puts the brand left, links in the center, and the waitlist action right. Links darken on hover; the active destination uses deep coral. The Solutions dropdown has white grouped rows with soft-blue focus. Mobile navigation preserves both audience destinations. Section links use native smooth scrolling and a (100px) header offset, with immediate scrolling under reduced motion.

### Hero and background pattern

Preserve the exact headline: “Your next product move. Backed by evidence.” The second line is coral. The hero offer, primary CTA, secondary link, and product illustration remain the foreground.

**Signal grid.** A canvas of square cells on a CSS hairline grid (visible without JavaScript). Short coral, pale-coral, cobalt and ink "drops" fall two to five cells and fade over about (1.5s), echoing evidence settling into place. The hero band (28px cells, 720px tall) clears an ellipse for the headline and fades before the product; a mouse pointer gently lights nearby hero cells. The Solutions heading uses a band (24px cells) visible only either side of the copy, and the signup panel uses a field that frames the form's right edge. Grids render at (30fps), cap device pixel ratio at (2), and run only while on screen, the tab is visible, reduced motion is off, and the user has not paused. One labeled pause/play button in the hero stops every grid on the page; reduced motion leaves a static frame and hides the control. Grids are hidden from assistive technology and carry no information. Line-based evidence trails were rejected for this background.

**Hero product.** The signal-inbox illustration sits in a wide frame (up to 1240px) with a white bezel, a coral-to-cobalt hairline ring, coral crosshair marks at the top corners, and a soft glow. At (768px) and wider it starts slightly tilted (6deg, 95% scale) and settles flat over the first (560px) of scroll via GSAP ScrollTrigger; the CSS sets the same start state so hydration never jumps. From (1024px), two callout cards overlap the frame's edges: a verified primary source (competitor pricing page) and customer context (discovery call). Both repeat evidence already in the illustrations and are hidden from assistive technology; they fade in with a short stagger and drift gently on scroll. Reduced motion shows the frame flat with static callouts. The walkthrough stage shares the hairline grid (static) and a ring shadow.

### Buttons and links

Primary actions use coral with white text, a small arrow where appropriate, and (7px) corners. Standard minimum height is (46px), compact navigation actions are (40px), and mobile main actions are (44px). Hover darkens the fill; pressing moves the control down (1px). Unboxed secondary links turn cobalt on hover. Preserve visible keyboard focus.

### Forms and audience controls

The white form sits inside a soft-coral signup panel. Labels are explicit; leading icons receive reserved inset space. Inputs are (48px) high with (16px) text. Focus changes the border to cobalt with a soft-blue outline; invalid fields use deep coral. The three-choice waitlist selector has a pale track and coral sliding segment with white selected text; each choice has a (44px) minimum height. Pending submission dims the action and completion uses green. Preserve the existing validation and submission contract.

### Cards, context sources, and product concepts

Both audience cards use the same cool surface, border, hover/focus background, and bottom-aligned link. Delivery uses a white document preview within a pale-blue frame. Context sources sit in a bordered rounded frame; hover/focus/tap reveals a dark purpose tooltip and a subtle icon lift. Escape dismisses it; repeated tap toggles it closed. Reduced motion removes animated feedback.

Illustrative product concepts use synthetic examples. Preserve visible illustration labels and the separate approval boundaries for decisions, PRDs, ticket drafts, and publishing. Authored SVG assets are generated by `apps/marketing/scripts/build-product-assets.py` into `apps/marketing/public/product`; React motion scenes live in `apps/marketing/src/components/marketing/ProductMotionScene.tsx`. These are not evidence of shipped application functionality or commercial results.

### Product story and FAQ

Founders and Product teams use native audience buttons with pressed state. Four vertical ARIA tabs support arrows, Home, and End; only the selected desktop panel is exposed to assistive technology. Narrative and preview change together. Scenes crossfade, finite UI sequences settle within (2.2s), pause offscreen, and can be replayed. Reduced motion shows completed static scenes in the stacked flow. Normal browser scrolling remains in control: no wheel interception, scroll snapping, or forced programmatic scrolling.

FAQ rows use thin separators, readable text, and restrained plus/minus indicators. Global reduced-motion styles make transitions effectively immediate.

## Do's and Don'ts

### Do:

- Do preserve pure-white page, navigation, and walkthrough surfaces with light blue, mint, peach, and coral framing.
- Do preserve the approved Rhythm mark, exact hero headline, coral primary actions, and equal founder/team journeys.
- Do keep marketing controls readable independently of compact illustrative product UI.
- Do retain native scrolling, keyboard focus, explicit form labels, validation, and reduced-motion behavior.
- Do label product concepts and synthetic data as illustrative and preserve human approval boundaries.

### Don't:

- Don't restore the historical ivory page, navy section treatment, or four-bar logo as the current direction.
- Don't add line-based evidence trails behind the hero or let decorative motion compete with its copy.
- Don't present authored previews as shipped application screenshots, customer proof, or measured outcomes.
- Don't change walkthrough steps on a timer or intercept page scrolling.
- Don't shrink an entire desktop workspace into an unreadable mobile thumbnail; use the authored detail crop.
