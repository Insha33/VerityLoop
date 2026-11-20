# Restored split onboarding — revised screens

9 November 2026. Static mockups, not a working prototype. This set restores the earlier split composition preferred by the product owner and replaces the rejected v4 sidebar direction.

## Primary sequence

1. [Corporate signup](01-signup.png)
2. [Work-email verification](02-verify-email.png)
3. [Workspace creation](03-create-workspace.png)
4. [Team invitations and joining policy](04-invite-team.png)
5. [Connections and document upload](05-product-context.png)

[Workspace chooser](06-workspace-chooser.png) is a conditional branch after verification for users with memberships or invitations. It is not an extra mandatory screen. An invited PM opens the intended workspace without completing owner setup.

The same horizontal progress, open form surface, warm preview, brand, and action area carry through the flow. The preview uses sample or draft labels where appropriate and changes to show current setup context. Connector selection, import readiness, draft invitations, skip behavior, profile confirmation, and transition behavior are detailed in the [research and UX handoff](../research-v5.md).

The images do not implement motion, input validation, OAuth, uploads, invitations, or permissions. Exact control sizes, consistent header/footer baselines, responsive behavior, and accessible semantics must be verified in a later rendered implementation. Do not treat image-generated differences in icon shapes or spacing as design-system exceptions.
