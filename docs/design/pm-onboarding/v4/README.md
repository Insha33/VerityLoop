# VerityLoop PM onboarding — complete design set

9 November 2026. Static design exploration, not implemented functionality. This set replaces the earlier wide form/marketing split with a narrow setup rail and a larger task area. The product copy, joining options, source scope, and isolation requirements remain governed by the [workflow specification](../workflow-extension-v3.md).

## New PM journey

1. [Corporate email signup](01-signup.png)
2. [Verify work email](02-verify-email.png)
3. [Create workspace](03-create-workspace.png)
4. [Invite team and choose who can join](04-invite-team.png)
5. [Connect tools and upload product documents](05-product-context.png)

After this setup, open the workspace. The PM still reviews and confirms the product profile before recommendations or the first Roadmap Impact Brief. Completion of onboarding does not authorize publishing or downstream approval gates.

## Conditional branch

[Workspace chooser](06-workspace-chooser.png) appears after verification when a user already has memberships or invitations. Opening an existing workspace skips owner setup. The chooser is not an extra mandatory step for every new PM.

## Design decisions

- A warm-paper setup rail holds progress, supporting explanations, and account identity; it does not compete with the form.
- Open white task surfaces, readable grouped fields, a consistent outline icon style, and restrained coral accents retain the existing brand.
- Joining-policy rows are larger and show selection using a radio indicator plus background, not color alone.
- Integration descriptions sit below their names; connect controls have more room than the former compressed three-column list.
- Uploads and connections remain separate optional methods on the same context screen.
- Invite-only is the initial policy; domain joining is an explicit workspace-level opt-in.
- Main actions, back, and skip controls remain visible. On implementation, avoid duplicate Back controls and make all controls keyboard accessible.

The earlier research included [Untitled UI onboarding on Dribbble](https://dribbble.com/shots/23081995-Onboarding-steps-Untitled-UI). Its public description was read; its full image was not successfully retrieved during the interrupted research attempt. These visuals are grounded in the repository's existing brand and mockups, not a claimed visual clone of that Dribbble shot. UI Styling and UI/UX Pro Max guidance informed grouping, target sizes, and progressive disclosure. Generic recommendations for oversized typography and marketing-page content were discarded as unsuitable for this setup flow.

Image-generated screens can have small differences in spacing, labels, progress treatment, or sizing. Implementation should unify the rail width, heading baseline, 48px control heights, 8px control radii, and semantic colors across screens rather than reproduce incidental generation differences. The email-verification image is corrected so Account remains the current step before verification completes.

No authentication, invitations, domain-policy changes, connector authorization, uploads, or deployment occurred. The images depict illustrative states only. Functional accessibility, responsive layouts, permission boundaries, and async behavior require verification once built.
