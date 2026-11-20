# Typography and usability refinement

10 November 2026. The product owner approved the overall account-first layout and requested a light refinement, particularly text size. Keep the workflow and application shell from [v7](account-first-v7.md); this is not another structural redesign.

## Exact signup copy

Under the Work email input, show only:

**Use your work email to discover your company’s workspaces.**

Remove “and request access,” remove “Personal email works too,” and remove “Next, your account dashboard” below the primary button. CTA remains **Continue with email**. Gmail, Yahoo, Hotmail, and other supported personal emails remain accepted; removing the explanatory copy does not change validation or organization routing.

## Type system

Retain Manrope. Use a small consistent set of role-based text styles rather than making each page independently larger or bolder. Targets below describe the eventual rendered implementation at a standard desktop viewport; image-generated mockups are visual approximations, not verified measurements.

| Role | Font size / line height | Weight |
| --- | --- | --- |
| Page heading | 28 / 36px | 600 |
| Section heading | 20 / 28px | 600 |
| Body, inputs, buttons | 16 / 24px | 400 for body; 500 for controls |
| Application navigation | 15 / 22px | 500; active item can use 600 |
| Field labels | 14 / 20px | 500 |
| Helpers and secondary status | 14 / 20px | 400 |
| Breadcrumb | 13 / 20px | 400 |

On narrow screens, keep input/body text at least 16px and wrap copy instead of shrinking it to fit. Use a 24 / 32px page heading where needed. Allow system/browser text scaling. For an implementation, define styles in relative units; do not lock text to a raster-image scale.

Use ink #101623 for primary text and a legible secondary tone such as #586273 on white. Coral remains a brand accent. Secondary links must have clear affordance and sufficient measured contrast; do not assume coral small text is accessible. Preserve meaningful link underlines and visible focus states.

## Layout and control refinement

- Keep the existing pre-auth split layout and authenticated application sidebar. These are already accepted.
- Bring signup's primary action closer to its input/helper/terms group rather than leaving it separated by a large empty vertical gap.
- Give labels an 8px relationship to inputs, separate field groups by 24px, and use roughly 32px between sections.
- Keep primary controls about 48px high and secondary hit areas at least 44px. Quieter typography is not a reason to shrink targets.
- Avoid bolding every provider name, workspace name, helper, and row. Medium-weight 16px names plus regular 14px descriptions make lists easier to scan.
- Keep one clear primary CTA. Back, Cancel, Skip, and Return to dashboard should remain visually subordinate, rather than all becoming large outlined buttons.
- Use a consistent workspace-local Invite / Connections / Documents indicator; it is separate from global navigation. Optional/skipped invitations must not appear as invitations sent.
- Reduce large decorative icon tiles and keep one consistent outline icon family. Final provider logos must use actual source assets, not generated approximations.
- Remove redundant next-page captions below the signup, creation, and invite actions. Keep conditions and recovery instructions that affect an actual decision, such as why Continue to documents is disabled.

## Page-level changes

1. Signup: exact requested sentence, no personal-email helper, no next-dashboard caption, smaller heading/preview text, action grouped with form.
2. Account dashboard: quieter sidebar and support copy; small workspace icon; one Go to workspaces action. No new metrics or widgets.
3. Workspaces: consistent row names, helper sizes, initial tiles, and 48px action buttons; unchanged organization discovery and owner-approval states.
4. Creation: compact single-field form, smaller organization note, subordinate Cancel, no redundant next-step caption.
5. Invitations: clearer email/access grouping; consistent local setup navigation; Generate invite link stays secondary; Skip remains available; no next-connections caption.
6. Connections: readable provider descriptions, consistent row sizing and Connect actions; required connection state and Return to dashboard retained. No upload area.
7. Documents: less oversized drop zone and file names; clear Ready/Processing states; no redundant next-profile caption. Product-profile confirmation before analysis remains a workflow requirement.

## Research applied

- [NN/g: Website Forms Usability](https://www.nngroup.com/articles/web-form-design/): refreshed guidance on close label/field grouping, short forms, and clear relationships between inputs and their actions.
- [GOV.UK: Type scale](https://design-system.service.gov.uk/styles/type-scale/): refreshed the principle of using defined sizes and line heights, responsive typography, and relative units. The VerityLoop scale above is a product-specific choice, not a claim that GOV.UK specifies these exact values.
- [Untitled UI onboarding on Dribbble](https://dribbble.com/shots/23081995-Onboarding-steps-Untitled-UI): reread the public flow description as a consistency reference. No new visual clone is being attempted; previously inspected references remain recorded in [v5 research](research-v5.md).

UI Styling, UI/UX Pro Max, and UI Typography informed this pass. The skills' generic blue palette and alternate font suggestions do not replace the accepted brand. Existing app architecture, organization policy, and source permissions remain governed by the authoritative v7 specification.

## Verification boundary

These deliverables are static image edits. They cannot verify semantic heading structure, keyboard operation, actual font metrics, responsive reflow, measured contrast, or provider functionality. Those checks belong to a working implementation. No claim of accessibility compliance or higher conversion follows from a mockup alone.
