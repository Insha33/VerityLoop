# PM workspace onboarding — refinement of concept 2

7 November 2026. Selected direction: the second image from the initial exploration. Deliverable: revised static design, not an implemented or tested application.

## What needed correction

The initial screen gave too much emphasis to too many elements. Its large heading, global stepper, bordered miniature app, and bold privacy statement competed with the form. The optional website label repeated information in its helper text. The preview also displayed a second set of navigation, adding visual complexity before workspace creation.

Keep the selected split layout. Refine hierarchy and density rather than introducing another visual direction.

## References inspected

The public shot images were downloaded and visually inspected, in addition to reading the designers' pages:

- [Tailwarden — Onboarding steps, Yoan Almeida](https://dribbble.com/shots/21428659-Tailwarden-Onboarding-steps): use its focused setup form, clear labels, and quiet progress cue as inspiration. Do not import its logo-upload, company-size, and industry fields into this shorter flow.
- [Add integrations — Untitled UI, Jordan Hughes](https://dribbble.com/shots/27750973-Add-integrations-Untitled-UI): borrow restrained control sizing, thin separators, and a visually subordinate companion panel. Do not copy the decorative outer presentation, integration inventory, or third-party logos.
- [B2B SaaS Onboarding Flow — Proof, Filllo](https://dribbble.com/shots/27670514-B2B-SaaS-Onboarding-Flow-UI-Design-Proof): examined how progress and task content are grouped. Its prominent stepper, cards, foliage background, and monetary outputs are not appropriate for this focused VerityLoop step.
- [Nicelydone onboarding collection](https://nicelydone.club/examples/tags/onboarding): reviewed its public descriptions of setup and invitation patterns, including Vimcal's email/link invitations. Its screen images were not used as visual references.

These are visual references, not evidence that a layout improves signup conversion. No user testing or conversion comparison has been conducted.

## Applied skills

- UI Styling: visible form labels, one primary action, consistent controls, accessible colors, meaningful grouping, and responsive prioritization.
- UI/UX Pro Max: ran design-system recommendations for minimal B2B SaaS onboarding, supplemented with progressive-disclosure/form guidance and the requested accessibility/loading query. Retained VerityLoop's existing Manrope, coral, and ink identity instead of adopting the tool's generic blue palette or suggested font. Its native-mobile implementation guidance does not replace this desktop web target.

## Revised visual specification

| Element | Specification | Purpose |
| --- | --- | --- |
| Canvas | 1440 × 1024 concept; 58% form / 42% preview | Preserve the selected split composition |
| Header | Small VerityLoop signature; quiet signed-in account | Establish identity without competing with setup |
| Progress | Compact Account → Workspace → Invite, above form | Keep orientation close to the current task |
| Form | Approximately 432px maximum width | Align labels, controls, and CTA |
| Heading | 32px, Manrope, medium/semibold | Reduce the original visual weight |
| Body | 14–16px; helper text 12–13px | Make supporting information subordinate |
| Spacing | 8px label/control; 24px field groups; 32px major groups | Establish consistent vertical rhythm |
| Controls | 48px height, 8px radius, subtle borders | Comfortable input and consistent proportions |
| Primary button | Full form width, ink surface, white text | One unmistakable action |
| Color | Ink text, white/warm surfaces, coral used sparingly | Preserve brand without excessive emphasis |
| Preview | One small surface, simple rows, no nested sidebar | Explain what is being created without adding tasks |
| Privacy | Small lock and plain access sentence | Explain access in the context of creation |

Required field: Workspace name. Optional field: Company website. No additional business-profile questions. Use “Create your workspace” as the heading and “Create workspace” as the CTA. Product-context collection stays inside the workspace after creation and the optional invitation step.

The Acme workspace preview uses an initial-based workspace identity, not VerityLoop's own logo as the customer's mark. It has no generated insights, counts, or implied completed setup. Label it as a preview. Scope access independently per workspace.

## Interaction handoff

When implemented, labels must be associated with inputs, errors must appear next to the affected field, and loading must prevent duplicate submission. Back preserves draft values. Keyboard focus and validation errors must remain visible. Use semantic buttons and links; preview rows are non-interactive content, not disabled navigation.

On mobile, remove the preview, reduce outer padding to 24px, use 16px input text, and show compact progress. The form remains the primary content. Avoid a sticky CTA that overlaps the keyboard. Motion, if added, should be subtle and respect reduced-motion preferences.

Static image inspection cannot verify focus order, responsive reflow, accessible semantics, loading behavior, or measured pixel-level contrast. Those checks belong to the eventual rendered implementation. Generated image details must follow the written specification and supplied brand assets where they differ.

## Artifact

The [revised image](concept-2-refined-v2.png) is saved alongside this note. The original three concepts remain available for comparison. The source flow specification remains [PM onboarding](../pm-onboarding.md).
