# Account-first onboarding — current screen set

10 November 2026. Proposed static screens following the product owner's latest workflow. This replaces the earlier workspace wizard before account-dashboard entry.

1. [Signup](01-signup.png): preferred work-email label, explanatory note, personal-email acceptance.
2. [Account dashboard](02-account-dashboard.png): opens after authentication; Home, Workspaces, and Settings in the application sidebar.
3. [Workspaces](03-workspaces.png): company directory with Open / Request access / Request sent, plus Create workspace.
4. [Create workspace](04-create-workspace.png): name only, with automatic organization association for a verified company email.
5. [Optional invitations](05-invite.png): email invitations, Generate invite link, or Skip.
6. [Connections](06-connections.png): separate page for Jira, Confluence, Linear, and available alternatives.
7. [Documents](07-documents.png): separate page for supporting product documents.

See the [authoritative interaction and routing specification](../account-first-v7.md). For generic-email accounts, the dashboard omits organization information and Workspaces shows only memberships, invitations, and personal workspace creation. This set illustrates corporate-path states, not an exhaustive collection of every personal/error/permission variant.

At least one scoped tool connection is the proposed prerequisite for continuing from Connections to Documents. Dashboard access is not gated on workspace setup. Document upload is available without a required minimum file count, as the product owner did not explicitly make it mandatory. Existing members opening a workspace do not repeat owner setup.

The workspace-local Invite / Connections / Documents indicator is separate from global navigation. It should show optional invite completion or skipping accurately in a later implementation. Image-generated tab treatments, icon shapes, button sizes, and breadcrumb details need a consistent component system when built; the images are not functioning navigation.

All displayed organizations, memberships, requests, email entries, provider states, and file statuses are illustrative. No emails were sent, no OAuth flow was run, no files were uploaded, and no production code or deployment was changed. Functional accessibility, responsive layout, scoped permissions, and async behavior require verification on a working implementation.
