# Organization discovery and workspace access

9 November 2026. Product-owner revision to onboarding. This document supersedes earlier work-email-only signup, membership-only workspace discovery, and default same-domain self-join proposals. It retains the selected v5 split visual direction.

## Product model

One user identity can access multiple workspaces. A corporate workspace belongs to one organization; an individually owned workspace has no organization. Workspace remains the isolation boundary for internal product context, documents, integrations, decisions, and AI retrieval. Organization membership enables directory discovery and access requests, not access to workspace content.

Example:

- Organization: Acme, associated with the verified domain `acme.com`.
- Corporate account: `maya@acme.com` is eligible to discover Acme's linked workspaces after mailbox verification.
- Workspaces: Core Platform, Analytics, and Developer Experience belong to Acme independently of their names.
- Maya requests access to Core Platform. Its owner approves the request and assigns Reviewer or Editor access. Only then does Maya become a member and gain the permitted content access.
- `maya@gmail.com` follows the individual path. Gmail is not an organization. That account can create a personal workspace and invite collaborators.

Naming a workspace “Acme” or entering `acme.com` into a website field does not establish an organization link. Use the verified account domain and a server-managed domain-to-organization association. A workspace created by an Acme account is linked to the Acme organization even if named something else. Renaming it does not change that association.

Verification proves control of a mailbox, not ownership or administration of the company. The first person creating an Acme workspace owns that workspace; they do not automatically become a verified Acme-wide administrator, own the domain, or acquire other workspaces. Domain claims, multiple domains, mergers, and administrative organization ownership need a separate explicit governance process before implementation; do not grant those powers as a side effect of signup.

## Corporate onboarding

Signup with an email → verify email → resolve corporate organization → organization workspace directory.

The directory shows three states in one readable list:

| State | Action | Result |
| --- | --- | --- |
| Already a member | Open | Open this workspace immediately; skip owner setup. |
| Not a member | Request access | Create an approval request addressed to its owner; grant no workspace access. |
| Request pending | Request sent | Show pending state and an available cancel/withdraw action. |

Addressed invitations remain directly acceptable; do not require the recipient to submit a second request. Add an Invitations section when applicable. Always provide a prominent **Create workspace** action, linked to the resolved organization by default.

Directory heading: **Find your workspace at Acme**. Supporting text: “Request access to an existing workspace or create a new one.” Show the resolved organization and domain, for example “Acme · acme.com,” so the association is explicit.

For a new organization with no linked workspaces, show an empty state and Create workspace. Do not make the first PM complete a company hierarchy, billing, or domain-admin setup merely to begin product work. A new workspace follows the existing optional invite and product-context steps.

## Access-request interaction

**Request access** opens a compact confirmation panel showing workspace name, verified requesting email, an optional note, and **Send request**. Avoid making the PM choose their own privileged role. Confirm “Request sent” and explain: “You can open this workspace after its owner approves your request.” Offer **Create another workspace** and a return-to-directory path; do not trap onboarding on a waiting screen.

The owner sees requests under **Workspace settings → Members → Requests**. Show requester identity, verified organization-domain eligibility, optional note, and current state. Approve requires choosing access, with Reviewer as the proposed least-privilege default; Reject grants nothing. Requester cannot approve their own request. Approval is atomic and creates a workspace membership; duplicate requests or repeated approvals must not create extra memberships.

Lifecycle: Pending → Approved, Rejected, or Withdrawn. Revoked organization eligibility invalidates pending requests. Approval revalidates current requester eligibility, workspace organization, owner authorization, and policy at approval time. UI status changes and in-app notifications are part of a later implementation; no notifications are actually sent by this design task.

Approval by an owner does not appoint the requester as an engineering reviewer or product decision owner; workflow responsibilities remain separate from workspace permission roles.

## Discoverability and isolation

The requested directory deliberately exposes limited workspace metadata to verified accounts in the same organization. This is an explicit change from the earlier membership-only list. It is not a public directory.

Show only workspace display name, organization label, current user's membership or request state, and available action. No document titles, roadmap snippets, briefs, decisions, connected projects, AI answers, member lists, or cross-workspace content search before membership. Do not expose these through preview panels either.

Organization linkage alone never authorizes object retrieval. Every read, export, connector request, embedding lookup, cache entry, background job, and AI context remains scoped to the workspace and the user's membership/source permissions. Approval for one workspace does not approve any other workspace. Directory metadata must have its own authorization policy rather than accidentally bypassing content authorization.

Use exact verified-domain mappings. Do not derive an organization by stripping arbitrary subdomains, comparing display names, or accepting a typed domain. When a domain is ambiguous or managed by an organization identity policy, resolve that policy rather than guessing. Organization reassignment is an explicit administrative action, not an automatic change when a user edits their profile or email.

## Individual onboarding

Signup with generic email → verify email → create personal workspace → optional collaborator invitations → optional connections/documents → open workspace.

Generic providers such as Gmail, Outlook.com, and Yahoo are not companies in this model. Classify provider domains using maintained server-side rules rather than treating every non-Gmail domain as a company. A custom domain does not establish legal company ownership; its association is an organizational routing mechanism, with ambiguous cases handled explicitly.

The personal workspace is owned by the user and has no organization record. Show **Create your personal workspace** and “Your email isn’t linked to an organization. You can still invite people to collaborate.” Do not list every Gmail user's workspace or offer “Anyone with a gmail.com email can join.” The organization-domain joining controls are absent on personal workspaces. Explicit email invitations and restricted invite links remain available.

A generic-email user may accept an explicit invitation to a corporate workspace if the owner's policy permits it. That gives workspace membership only; it does not add corporate-domain directory privileges or turn the generic-email account into an organization member. This path supports independent contributors without creating a shared public-email organization.

## Changes to existing screens

- Signup: label **Email address**, CTA **Continue with email**; helper “Use your work email to find your organization, or a personal email to work independently.” Generic email is supported, not an error.
- Verification: **Check your inbox** rather than requiring a work inbox; same verified-email and resume behavior for both paths.
- Workspace selection: show the organization directory for verified corporate users, including requestable workspaces. Retain Open, addressed invitations, pending state, and Create workspace.
- Workspace creation: company accounts see “Organization: Acme”; personal accounts see “Personal workspace.” Association is resolved from verified identity and is not a free-text company selector.
- Invite page: corporate default becomes **Organization members can request access**, with owner approval required. Explicit invite-only access can remain an owner policy if introduced and clearly defined, but no automatic same-domain admission should be inferred from the current request-based requirement. This revision supersedes the earlier automatic “Anyone with an @acme.com email can join” default behavior.
- Product context: unchanged capabilities, with data belonging to the current workspace. Company-wide discovery never makes source ingestion organization-wide.

## Design artifacts

The [organization directory](v6/organization-workspaces.png) and [personal workspace](v6/personal-workspace.png) mockups extend the v5 split direction. Existing v5 signup and invitation images are historical: their work-email-only copy and automatic-join option need the changes above before implementation.

No organization, membership, request, invitation, or source connection is actually created. These are product specifications and static visuals.
