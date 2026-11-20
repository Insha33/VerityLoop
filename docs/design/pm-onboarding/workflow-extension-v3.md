# Team access and product context — onboarding extension

7 November 2026. Proposed static designs extending the selected refined concept 2. The user's supplied Conveo screenshot grounds the “Who can join” behavior; VerityLoop's existing light split layout, Manrope, coral mark, and ink controls remain the visual direction.

## Updated journey

Corporate email signup → verify email → create workspace → invite team and set joining policy → connect tools/upload documents → open workspace → review and confirm product profile → prepare first Roadmap Impact Brief.

The compact progress indicator now has four groups: Account, Workspace, Team, Context. Account includes verification. Invitations and source connections are optional; missing context remains visible and no recommendation bypasses profile confirmation. Workspace creation is already persisted before the two new pages.

Invited colleagues skip workspace creation and owner setup. They join their intended workspace directly; they can add sources later only if their permissions allow it.

## Invite team page

Heading: **Bring your team into the loop**. Supporting text: “Invite colleagues to Acme · Core Platform.”

Keep one primary email entry area, a role selector, Add another, and a subordinate Create invite link action. No need to ask for the workspace name again. The owner is identified as “You · Owner”; invitees are shown as Pending only after invitations are actually dispatched. Any Pending example in the static concept is illustrative, not actual delivery status.

### Who can join this workspace?

Use mutually exclusive radio choices, avoiding the ambiguity of a lone checkbox:

- **Invite only** — selected by default. “Only people you invite can join.”
- **Anyone with an @acme.com email** — explicit owner opt-in. “Verified colleagues can join this workspace as Reviewers.”

Supporting text: “Applies only to Acme · Core Platform. You can change this later in workspace settings.” Changing this setting is a workspace access policy change, not a cosmetic preference. Show the exact allowed domain and role before saving. Do not treat the screenshot's initially checked option as a requirement to enable broad joining by default.

**Send invites & continue** sends the entered invitations, saves the joining policy, and advances to Product context. **Continue** applies when there are no unsent entries. **Skip invites for now** saves the selected joining policy, sends no invitations, and advances. If unsent addresses exist, explain that they will not be sent; preserve them as a draft for later. Back preserves draft values.

An explicit domain join action creates a normal membership in this workspace only. Verification proves control of an email address, not ownership of the entire company domain. Do not enable public-email-provider domains, infer subdomains as allowed, or expose invitation-only workspace names through a domain search. Domain eligibility is checked on the server at join time. Disabling domain joining prevents new joins but does not silently revoke existing members; the owner manages those members separately. Explicit address-bound invitations may admit approved external corporate collaborators.

Create invite link remains a separate feature with expiry, revocation, permitted role, and allowed-domain policy. A domain-join option does not require an invite link, and a link does not bypass verification or source permissions. Owner/SSO policy takes precedence where applicable.

## Product context page

Heading: **Help us understand your product**. Supporting text: “Connect your tools or upload the documents your team already uses.”

Organize by two input methods rather than forcing a choice between them. A PM may use either or both.

### Connect your tools

Show a compact list of proposed connectors, with a short explanation and individual Connect action:

| Tool | Product context | Scope-selection step |
| --- | --- | --- |
| Jira | Projects, issues, delivery status | Atlassian site → projects and eligible issue scope |
| Confluence | Product knowledge, PRDs, technical documentation | Atlassian site → spaces/pages |
| Linear | Teams, projects, issues | Workspace → teams/projects |
| Similar tools | Additional trackers or knowledge sources | Browse more integrations; show real availability |

Confluence is a documentation source rather than an issue tracker. Keep both types on this page because they contribute complementary context. Further connectors such as Notion, Google Drive, GitHub Issues, or Azure DevOps are extension candidates, not implemented promises. Unsupported providers should be labeled unavailable or planned; do not display a functioning Connect action until supported.

Connection journey: select Connect → authenticate with provider → return to this workspace → select projects/spaces and exclusions → review included sources → explicitly start import. OAuth approval alone does not mean the content has been selected or indexed. Never import all accessible projects by default.

Start with read-only access. Show the actual permissions requested by each provider. Provider scopes and the user's native permissions both constrain access; selecting projects inside VerityLoop does not imply OAuth itself is limited to those projects. Enforce the narrower selected scope in collection and retrieval. Do not request write access to enable onboarding; any later publishing capability has its own authorization and review gates.

Show meaningful states: Not connected, Authorization needed, Connected — choose sources, Importing, Ready, and Failed — retry. A connected account with no selected sources is not Ready. Reauthorization preserves source choices but requires revalidation. If the PM lacks installation permission, offer a manual upload path and an admin setup link that the PM can copy; do not send an admin email automatically.

### Upload product documents

Prompt: **PRDs, TDDs, architecture, roadmaps, or strategy.** Also useful: customer-research summaries, capability inventories, API/data-model notes, and explicit constraints/non-goals.

Use a single drop zone with a keyboard-accessible Browse files action, followed by simple file rows. Each row shows filename, type/size where known, processing state, and remove/retry action. Suggested MVP formats are PDF, DOCX, PPTX, Markdown, and TXT; these are design proposals pending parser support. Architecture diagrams may be embedded in supported documents. Do not advertise standalone image/diagram ingestion until implemented and validated. Display actual supported formats and limits at implementation.

Separate Uploaded from Processing and Ready. Ready means usable extraction completed, not that the content is accurate, current, or approved. Keep partial extraction and unsupported/encrypted-file feedback visible and recoverable. An unknown or failed document must not silently become product evidence. Optional document type and freshness metadata can be suggested after upload, with correction available; do not require a long metadata form first.

Documents are attached to the current workspace and their authorized audience. Honor source permissions for connected content; use explicit workspace document access rules for uploads. Do not copy documents between workspaces automatically, including when the same person belongs to both. Removal must invalidate derived retrieval content according to the eventual retention/deletion policy.

### Continue and recovery

Primary: **Continue to workspace**. Secondary: **Skip for now**. Neither requires a paid connector or successful import. Continuing during processing opens the workspace and shows honest background progress. Do not discard uploads, cancel imports, or interpret Skip as deletion; explicitly remove or disconnect to do that.

The next workspace state guides the PM to describe/review the product, confirms what sources are available, and makes missing context clear. Documents can suggest a profile, but the PM reviews facts, uncertainty, customer, goals, non-goals, planning horizon, and market boundary before recommendations. Never generate a PRD or publish tickets as an automatic result of upload or connection.

## References and grounding

- User's supplied Conveo screenshot: a company-domain joining option with an explanation of its effect. Adopt this behavior on the Invite page, not the screenshot's branding or name-entry layout.
- [Atlassian: determining required scopes](https://developer.atlassian.com/cloud/oauth/getting-started/determining-scopes/): permissions depend on the operation and native user access; use this to guide the later implementation rather than inventing one blanket scope.
- [Confluence OAuth scopes](https://developer.atlassian.com/cloud/confluence/scopes-for-oauth-2-3LO-and-forge-apps/): ground the distinction between read and write capabilities for document access.
- [Linear API and webhooks](https://linear.app/docs/api-and-webhooks): documents permission controls and team-scoped API access; do not assume API-key controls and OAuth grants behave identically.
- [Original onboarding specification](../pm-onboarding.md): underlying profile-confirmation, human-review, and isolation requirements.

## Design artifacts and handoff

Two static screens accompany this note: [Invite team](invite-team-v3.png) and [Product context](product-context-v3.png). They extend the existing selected direction rather than restarting visual exploration. The screenshot reference and refined concept were provided to image generation. Visuals depict proposed capabilities and illustrative data, not connected accounts or uploaded documents.

Implementation verification later must cover domain-policy changes and joins, invite roles, multiple workspace memberships, source selection, wrong-workspace OAuth callbacks, partial imports, unsupported files, source ACL changes, accessible controls, 375px layouts, and resume/back behavior. No backend connection, file upload, membership change, or email sending is performed as part of this design task.
