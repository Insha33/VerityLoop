# Restored split onboarding: research and UX refinement

9 November 2026. The product owner rejected the v4 setup rail and preferred the earlier split layout. Restore the v2/v3 white form / warm preview composition. Keep approved content and business rules. This proposal supersedes v4; do not use its sidebar as the next implementation target.

## Research scope and limits

Ran multiple searches for split onboarding, workspace creation, invitations, integrations, and form usability. Read public Dribbble shot pages, real-product flow-library descriptions, and usability guidance. Downloaded and visually inspected seven public reference images: Untitled UI onboarding, Surfe onboarding, an integration-register concept, a guided-steps concept, and Figma, Notion, and Linear screenshots displayed by Northbase. Also inspected the user's preferred existing VerityLoop mockup.

This is desk research and visual analysis, not a usability study or measured conversion experiment. Flow libraries contain captures from particular product versions; their summaries are not promises about current live product behavior. No research-product signup, invitations, or account changes were performed. No paid reference library was accessed. Several Dribbble URLs did not return usable content; the Louis Nguyen shot's downloaded HTML was empty and was not used as a visual reference.

## Sources and design implications

| Source | Inspection | Useful implication for VerityLoop |
| --- | --- | --- |
| [Untitled UI onboarding — Jordan Hughes](https://dribbble.com/shots/23081995-Onboarding-steps-Untitled-UI) | Page and public shot image | Consistency across steps matters. Borrow spacing discipline; reject the sidebar because the user explicitly disliked it. |
| [Surfe onboarding — Kelly Tokatlidis](https://dribbble.com/shots/24214405-Onboarding-steps-Surfe-UI) | Page and public image | Clear current step and a focused action. Do not import its dark theme or extension-install task. |
| [Integrations — Register Page, Wojciech Łyżwa](https://dribbble.com/shots/22942404-Integrations-Register-Page) | Public shot page and image | Form and product preview can coexist. Avoid its dark gradients, excessive signup choices, and dense integration showcase. |
| [Dense Form to Guided Steps — Herru Adi](https://dribbble.com/shots/27673986-B2B-SaaS-Onboarding-From-Dense-Form-to-Guided-Steps) | Page and first after-image | Stage decisions instead of adding decoration to a dense form. A completion state should lead to a useful next action. No conversion evidence was supplied. |
| [Northbase onboarding study](https://www.northbase.design/flows/onboarding) | Public study text plus Figma, Notion, Linear images | Figma illustrates a task/preview split; Notion illustrates invitation alternatives; Linear illustrates explicit workspace naming. These are references, not instructions to copy every field. |
| [Screenrove invitation examples](https://screenrove.com/patterns/invite-teammates-screens) | Public text covering Linear, Notion, Jira, Confluence, Plane, and others | Email/link alternatives and an obvious Skip path are recurring patterns. Do not add skip-confirmation friction just because some products do. |
| [Screenrove onboarding examples](https://screenrove.com/patterns/onboarding-screens) | Public flow descriptions | Keep workspace setup and useful first actions connected. Treat example data as example data. |
| [NN/g: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) | Article | Put secondary settings behind a clear control while keeping the primary task understandable. A wizard alone does not solve complexity. |
| [NN/g: Labels and Placeholders](https://www.nngroup.com/articles/form-design-placeholders/) | Article | Keep labels and important hints visible outside inputs so users can resume and correct their work. |
| [NN/g: Reduce Cognitive Load in Forms](https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/) | Article | Make the sequence, requirements, groupings, and recovery paths clear; keep the form itself in a single reading column. |
| [NN/g: Website Forms Usability](https://www.nngroup.com/articles/web-form-design/) | Search result and summary | Group labels with their fields and reduce ambiguous spacing. |
| [W3C design-system forms](https://design-system.w3.org/styles/forms.html) | Public search result and summary | Associate labels with inputs at implementation; a visual label alone is not sufficient accessibility. |

## What “flowy” means here

1. **A stable frame:** logo, progress, main content, and action positions stay consistent. No switching between a sidebar wizard, a centered form, and a full app before setup finishes.
2. **A persistent preview:** the same workspace preview evolves as the PM names the workspace, configures joining, and adds sources. It reflects setup inputs and honest processing states, not invented intelligence.
3. **Low-effort forward movement:** verification resumes the intended route; Back preserves inputs; invitations and context can be skipped without a guilt modal. A PM accepting an invite skips owner setup.
4. **One clear primary action:** use action-specific copy when creating or sending, and Continue for simple progression. Loading and retry states preserve progress and never duplicate side effects.
5. **A purposeful handoff:** opening the workspace leads to product-profile review or missing-context setup. A completed account form is not the product's value moment.

## Updated journey and layout

Corporate signup → verify mailbox → create workspace → invite team / joining policy → connect tools / upload documents → open workspace → review product profile → first evidence-backed brief when ready.

The workspace chooser is a conditional branch after verification. It shows memberships and addressed invitations, with domain-eligible workspaces only under explicit workspace opt-in. Existing members go directly to the selected workspace; they do not repeat owner setup.

Use the earlier split composition with a white left task surface and warm-paper right preview. Main labels and body stay at readable product sizes, headings around 28–32px, controls around 48px high. Keep a compact horizontal Account / Workspace / Team / Context stepper. Account includes verification. The footer has one Back control, a clearly subordinate skip where applicable, and one primary action in a stable position.

The existing coral/ink/Manrope brand takes precedence over generic skill-generated color/font recommendations. UI/UX Pro Max was queried for design-system and multi-step-form guidance; its newsletter pattern and teal palette were rejected as mismatched. UI Styling informs control consistency, form grouping, focus treatment, and readable semantic colors.

## Screen-specific behavior

### Corporate signup and verification

Work-email-only entry, one email field, one primary action. No added job-title survey or founder chooser. Verification shows the entered address, edit and resend controls, and honest cooldown. Account is not marked complete until verification succeeds. Preserve an incoming invitation through authentication. Do not display a fabricated workspace identity before creation.

### Create workspace

Require only workspace name; website remains optional. Show a workspace preview with the current name. Do not infer product scope without review or impose a URL-slug task. The creation request is idempotent. The workspace defaults to invite-only; the next step can change joining policy explicitly.

### Invite team

Email and per-person role form the primary task. An Add another control allows more entries. Create invite link opens a small secondary panel with domain restriction, expiry, role, Copy, and Revoke; link creation does not send a message.

Who can join is a distinct grouped setting, with Invite only default and company-domain opt-in. The selected choice is always readable. Reviewers are the proposed default for domain joining. This policy applies only to this workspace. “Skip invites” saves the selected joining policy but sends no email. Explain unsent addresses inline and preserve the draft instead of silently discarding them. The preview may show a draft teammate labeled Not sent; Pending is reserved for dispatched invitations.

### Product context

Keep Jira, Confluence, and Linear visible as rows with readable descriptions and individual actions. Browse more opens the secondary provider chooser. Source selection opens only after provider authorization; show selected projects/spaces before import begins. Show Authorize → Choose sources → Importing → Ready as distinct states. The selection boundary and source permissions constrain retrieval.

Document upload is a separate section accepting proposed PRD/TDD/architecture/roadmap/strategy formats, with per-file Uploaded, Processing, Ready, or Failed status. Actual accepted types and size limits depend on parser support. Do not equate Ready with approved or reliable content. Continue can open the workspace while imports finish. Skip never means delete uploaded data or cancel an import.

## Transition and recovery handoff

For a later working prototype, use a restrained 180–220ms content crossfade with at most 8px directional translation; keep the shell and footer steady. Update only the changed preview row. Respect reduced motion with an immediate state change. Move keyboard focus to the new heading; announce import/status changes without stealing focus.

OAuth opens in the provider's auth surface and returns to the same workspace and draft state. Retry a failed source or email recipient individually. Exiting and resuming restores server-held setup progress, subject to current authorization. Document removal and membership changes still enforce workspace isolation and source ACLs.

On mobile, prioritize the form, use a compact progress label, and move the preview below or omit it when it adds no decision value. Do not squeeze both columns or cover controls with a fixed footer when the keyboard is open.

## Validation boundary

The delivered images are static concepts and cannot demonstrate motion, responsive reflow, actual provider authorization, uploads, delivery, or accessibility semantics. A later prototype must test these behaviors with real DOM interactions. No claim of improved conversion, accessibility compliance, or completed integration is made from image inspection alone.
