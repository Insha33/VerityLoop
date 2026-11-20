# VerityLoop: PM onboarding proposal

Date: 7 November 2026. Status: research-backed design proposal; not implemented or usability-tested.

**Authoritative workflow, 10 November 2026:** [Account-first onboarding](pm-onboarding/account-first-v7.md). Signup opens the account dashboard; Workspaces is an application-sidebar destination. Workspace creation and optional invitations lead to a dedicated Connections page, followed by a separate Documents page. Personal email is accepted. Earlier journey/order and connection-optional wording below are historical where they conflict with v7.

**Current product model, superseding earlier email/access assumptions:** [Organization discovery and owner-approved workspace access](pm-onboarding/organization-model-v6.md). Verified corporate users discover their organization's workspaces and request access, or create a new linked workspace. Generic-email users create personal workspaces without an organization. Organization discovery reveals limited directory metadata, never workspace content.

Latest visual set: [refined account-first onboarding, 10 November 2026](pm-onboarding/v8/README.md), with [typography and copy specification](pm-onboarding/refinement-v8.md). Signup retains the earlier split style; authenticated pages use the explicitly requested application sidebar. The v5/v6 sets are prior explorations rather than the current page sequence.

Design update: the product owner selected concept 2 and requested a cleaner revision using public design references. See the [refined mockup](pm-onboarding/concept-2-refined-v2.png) and [research and refinement notes](pm-onboarding/refinement-v2.md). This selection supersedes the initial visual recommendation below. The subsequent [team access and product-context extension](pm-onboarding/workflow-extension-v3.md) adds optional company-domain joining and a dedicated connections/uploads page before entering the workspace; it supersedes older invitation and page-order copy.

Audience: PMs and product leads with an existing product. Founder / Opportunity Discovery onboarding is excluded. “GCS” in the original request means the VerityLoop workspace, confirmed by the product owner.

## Recommendation

Keep account setup short: email signup → verify email → resolve corporate organization or individual path → open/request access to an existing workspace, or create one → optionally invite colleagues → optionally connect sources/upload documents → open workspace. New corporate workspaces link to the resolved organization; personal workspaces have no organization. Continue product onboarding inside the workspace: describe the product → review and confirm the product profile → prepare the first Roadmap Impact Brief. Joining an existing workspace follows a shorter route and never requires creating another workspace.

Account setup is complete when the PM reaches the correct workspace. Product activation is a separate event: the PM opens the first evidence-backed Roadmap Impact Brief and reviews its supporting evidence. Neither event implies approval of a recommendation, PRD, or ticket publication.

## Grounding and research

- [VerityLoop PRD](https://docs.google.com/document/d/1gjzh4hxVFke-qy05sZvOT0I0ge5jLCnKKef4g5ThpR8/edit): v0.4 draft, dated 8 August 2026. Sections 6, 9.1, and 15.2 require tenant-private context, named owners/reviewers, editable product context, confirmation before recommendations, and authorization before retrieval. The core PM outcome is a Roadmap Impact Brief. The PRD contains later notes and comments; use its explicit invariants as the baseline.
- [Aha! workspace overview](https://support.aha.io/aha-roadmaps/support-articles/workspaces/explore-product-workspace~7444669293924326211): a product workspace groups strategy and planning objects; demo workspaces are available. Implication: explain the workspace using the PM's product, and distinguish examples from real findings.
- [Aha! permissions](https://support.aha.io/aha-roadmaps/account/billing-and-users/user-permissions~7444657360296913475): workspace permissions and account administration are separate concepts. Implication: make workspace ownership explicit without equating it with product or engineering approval authority.
- [Linear invitations](https://linear.app/docs/invite-members): email invitations, role assignment, approved domains, and reusable invite links are documented capabilities. Implication: email and link invitations are familiar patterns. VerityLoop should use stricter defaults for sensitive strategy and roadmap data.
- [Linear workspaces](https://linear.app/docs/workspaces): one account can access multiple workspaces with distinct memberships. Implication: use one identity and workspace-specific membership rather than signing up again for every workspace.
- [Slack joining preferences](https://slack.com/help/articles/115004856503-Manage-how-people-join-your-workspace): owners/admins can explicitly enable joining through approved email domains. Implication: domain-based joining is an admin policy, not an automatic consequence of email verification.

These sources document product patterns, not measured conversion improvements. The recommendations below are design judgments. No competitor signup was completed, and no live Aha! onboarding screens were inspected. This is pattern research, not an exact recreation of Aha!'s current signup.

## Primary journeys

### PM creates a workspace

1. Enter an email, or authenticate with a supported identity provider. Corporate domains resolve an organization; generic-email users follow the personal path.
2. Verify mailbox ownership. A verified identity-provider email can satisfy this; do not repeat verification unnecessarily.
3. Corporate users see their organization's workspace directory, including Open, Request access, and Request sent states plus Create workspace. Generic-email users see their own memberships/invitations when present, otherwise personal workspace creation.
4. Name the workspace. Optionally provide the company website.
5. Create workspace; the creator becomes its owner.
6. Invite colleagues by email, create a restricted invite link, or select “Skip invites for now.” Corporate organization members may request owner-approved access; do not infer automatic admission from domain association. Personal workspaces do not offer public-email-domain joining.
7. Use the dedicated Product context page to connect selected sources or upload documents; this step can be skipped.
8. Open the workspace's Get started page and describe the product or resume source processing.
9. Review and confirm the product profile and market boundary before recommendations or monitoring run.
10. Prepare the first Roadmap Impact Brief once evidence and context are sufficient; show missing context explicitly when they are not.

### Colleague accepts an invitation

1. Open invitation. Before authentication show minimal information; do not expose member lists or internal content.
2. Sign in or create an account using the invited email. Verify ownership and apply the workspace's external-collaborator policy.
3. Show inviting person, workspace, and assigned access; select “Join workspace.”
4. Open the target workspace. Skip workspace creation and the owner invite step.
5. If setup is incomplete, show its current state and actions the role permits. Do not force every member through product-profile setup or allow reviewers to overwrite it.

### Existing member returns

Open the last accessible workspace. The switcher lists only workspaces with active membership and invitations addressed to this verified identity. Switching refreshes all workspace content. A removed membership disappears and cached content is cleared; a direct link to an inaccessible object reveals no internal content.

## Screen specification and copy

### 1. Email signup

Heading: **Make your next product decision with evidence.**

Supporting copy: “Connect market changes to your product context.”

- Required: email address. Both corporate and generic providers are supported.
- Primary: **Continue with email**. Proposed v1 authentication: an emailed one-time sign-in link, with SSO taking precedence where configured.
- Secondary: **Sign in** for returning users.
- Help: “Use your work email to find your organization, or a personal email to work independently.”
- Generic-provider emails follow the individual route with no organization; they are not rejected merely for being personal addresses. Provider classification and organization mapping run on the server after verification.
- SSO follows the same verified-identity routing and any configured organization login policy.
- Keep the response to an email submission neutral so it does not reveal whether the address has an account. Include links to the actual terms and privacy pages at implementation.

Do not ask for phone, company size, industry, job title, billing, or a competitor list at signup. PM mode is already selected by this entry path.

### 2. Verify email

Heading: **Check your inbox.** Copy: “We sent a sign-in link to maya@acme.com.” Use the actual email address for either path.

Actions: **Resend link**, **Use a different email**. Show resend cooldown and delivery state without exposing tokens. Links are single-use and short-lived; preserve the original invitation or setup destination through verification. An expired link offers a new link. A link opened on another device can resume the same server-held setup.

### 3. Choose an existing workspace — conditional

Heading: **Where would you like to work?**

One grouped list with rows for active memberships and invitations explicitly addressed to the user. Each row shows workspace name, company label where available, membership state, and **Open** or **Accept invite**. Secondary action: **Create a workspace**, if permitted.

After corporate-email verification, list limited metadata for workspaces linked to the resolved organization. Offer Request access for nonmembers; owners approve membership before any content is accessible. Show Open for members, Request sent for pending requests, and Accept invite for addressed invitations. Generic-email users see only memberships and invitations; they do not browse a public-provider directory. See the current organization model for the metadata/content boundary.

### 4. Create workspace

Heading: **Give your product team a home.**

| Field | Requirement | Behavior |
| --- | --- | --- |
| Workspace name | Required | Example: Acme · Core Platform. Editable later. Names need not be globally unique. |
| Company website | Optional | Helps suggest product context later. Do not fetch or infer a product boundary silently. |
| Your name | Only if missing | Obtain from verified identity when available; editable in profile. |

Helper: “Only people added to this workspace can access it.”

Primary: **Create workspace**. Secondary: **Back**. Small next-step copy: “Next: invite colleagues, or continue on your own.”

Use a generated immutable ID for isolation. A human-readable URL can be generated automatically; avoid making PMs choose a unique slug. If the implementation needs a slug, keep it editable under optional details and make availability errors private and generic.

The creator is workspace owner and initial product decision owner, with the latter editable in setup. Ownership does not grant access to other workspaces. Persist creation idempotently so retries cannot create duplicate workspaces.

Defer logo, timezone, notification settings, team size, billing, integrations, and detailed strategy. If actual deployment requires a binding data-region choice at creation, add that field with accurate choices before creation; do not invent a residency capability.

### 5. Invite colleagues — optional

Heading: **Bring your team into the loop.**

Copy: “Invite the people who help you decide what to build.” Show the target workspace name prominently.

Primary surface: labeled email rows with a per-person access selector, **Add another**, and **Send invites & continue**. Use **Continue** when no unsent addresses are entered. Always provide **Skip invites for now**, which saves the selected joining policy without sending invitations and advances to Product context.

For corporate workspaces, show **Organization members can request access** and “The workspace owner approves each request.” This replaces the earlier automatic same-domain joining option. For personal workspaces, use explicit invitations and omit organization-domain controls. An approved request creates only this workspace's membership with the owner-selected role.

Secondary surface: **Create invite link**. On creation show the workspace, allowed domain, assigned role, expiry, **Copy link**, and revoke action. Copy does not send a message. Avoid a persistent unrestricted bearer link.

Suggested defaults, to validate with design partners:

- Email invites are bound to the named address, expire after seven days, and are revocable.
- Shared links expire after seven days, are restricted to an explicitly confirmed company domain, and grant Reviewer access. No shared Admin links. Confirm the allowed domain; do not claim mailbox verification proves company-domain ownership.
- External collaborators, including individual contributors using generic emails, can receive explicit, address-bound invitations if workspace policy permits. An invitation never grants organization-directory access or access to another workspace.
- Shared-link acceptance requires authentication, verified allowed email, a final workspace confirmation, and server-side policy validation. If policy disables links, offer email invitations only.
- Invitation state is per recipient: Pending, Accepted, Expired, Failed. “Sent” means dispatched, not accepted. Allow retrying failed rows without resending successful ones.
- Do not claim invitees already have access before they accept. Suppress duplicates, handle existing members, and allow invitation cancellation.

Use permission roles: Owner, Editor, Reviewer. Reviewer is the safer invitation default; the inviter can intentionally select Editor. Owner controls membership, security, and connectors; Editor manages product context and drafts; Reviewer reads and comments on content they are authorized to see. Additional owners are assigned explicitly in settings, not through a reusable link.

Separately assign **Product decision owner** and **Engineering reviewer** as workflow responsibilities. These are not synonyms for permission roles. Engineering-review authority must be explicitly configured; an arbitrary invitation or workspace ownership cannot certify technical feasibility. Naming an engineering reviewer is encouraged here but can happen later, before the relevant downstream approval gate.

### 6. Workspace opens: Get started

Show the normal app shell with workspace switcher upper left. Main heading: **Let's understand your product.** Supporting copy: “Add context for your first Roadmap Impact Brief.”

Use a short sequential checklist:

1. **Describe your product** — primary next action.
2. **Add supporting context** — upload a roadmap/PRD/strategy document or connect selected Jira/Linear projects, when those capabilities are available.
3. **Review your product profile** — confirm before analysis.

Invite status lives in a quiet supporting area, never blocks setup, and never competes with the primary next action. Do not fill the workspace with fabricated market events or success metrics. Any example brief must be unmistakably labeled sample data and kept out of the real workspace's evidence graph.

### 7. Product context and confirmation

Progressively capture the PRD's product description, target customer, core customer jobs, strategic priorities, explicit non-goals, and planning horizon. Start with a natural-language description and optional website/document enrichment, then show editable structured suggestions. Inferred content is labeled and unconfirmed values stay unknown.

Source connections are optional at account setup. Request read-only scopes initially; display exactly which projects/documents will be indexed and allow exclusions before indexing. Never import every project by default. Provide an upload/manual path when a PM cannot authorize a connector. Preserve source ACLs inside the workspace: workspace membership alone must not unlock documents the user cannot access.

Review heading: **Does this reflect your product?** Display customer, goals, non-goals, horizon, source scope, and proposed market boundary with individual edit actions. CTA: **Confirm product profile**. Save its version, approver, and time. No competitor list is mandatory. Discovery proposes the landscape from the confirmed boundary.

The first brief must distinguish facts, inferences, missing evidence, and freshness. If internal context is absent, say so rather than claiming roadmap reconciliation. Context setup completion does not authorize PRD generation or ticket publication; preserve the PRD's separate decision and publishing gates.

## Isolation and membership contract

Recommended model: one user identity → many workspace memberships. Each membership has its own role and lifecycle. Workspace is the tenant boundary for internal data. Example: Maya can be Owner in Core Platform and Reviewer in Analytics; neither role implies access to the other workspace's objects.

- Authorize membership and object-level source permissions on the server before data retrieval. A workspace URL parameter or client-side filter is insufficient.
- Scope internal records, embeddings, retrieval, generated briefs, caches, files, connector credentials, jobs, notifications, and exports to the workspace. Never merge internal indexes across workspaces.
- Explicitly bind each connection and project selection to the workspace, even when the same external account is connected elsewhere.
- On switching workspaces, cancel or discard stale requests and clear query/AI-conversation state so a late response cannot populate the new workspace. Version background results by workspace.
- On removal, invalidate access and recheck long-running tasks and downloads. Revocation must affect retrieval and source permissions, not merely hide navigation.
- Invite acceptance is atomic and validates token, expiry, revocation, intended recipient/domain, and granted role. Role is never trusted from the client or URL.
- Verify tenant isolation with automated adversarial tests, including direct object URLs, search, exports, AI retrieval, cached results, stale responses, and shared external connections.

User-facing copy should explain the access boundary briefly. It should not claim encryption, no-training policies, or compliance certifications until implementation and vendor agreements substantiate them.

## Visual exploration

Use the repository's existing Rhythm identity: Manrope; ink #101623; warm paper #FAF9F6; coral #FF5A4F. Use ink buttons with white text for reliable contrast and coral as an accent; don't assume white small text on coral passes contrast. Controls at least 44px high, body text 14–16px, visible labels, accessible focus indicators, inline errors, and text alongside status colors.

Three workspace-creation concepts are supplied as visual alternatives: [concept 1](pm-onboarding/concept-1.png), [concept 2](pm-onboarding/concept-2.png), and [concept 3](pm-onboarding/concept-3.png), numbered in displayed order.

1. Quiet guided setup: left progress rail, open form, minimal supporting content. Recommended starting direction for its focus and simple mobile adaptation; this is a design judgment, not a tested conversion result.
2. Workspace with a live preview: horizontal progress and a restrained workspace preview that explains what is being created.
3. Setup inside the workspace: a provisional app shell shows the eventual location; inactive navigation remains clearly disabled before creation.

These images are static concept mockups, not working screens. The selected direction should be extended to signup, email verification, invitations, workspace selection, and Get started using the specification above. Image generation may introduce small text or branding inaccuracies; the written specification and source brand assets govern implementation.

On mobile, collapse progress into “Step 2 of 3,” stack the form, and remove decorative previews before reducing type sizes. Avoid hidden labels, horizontal scrolling, and fixed footers that cover the keyboard. Preserve entered values when moving back.

## Edge states and verification plan

Cover personal email, expired verification, wrong-account invite acceptance, revoked/expired invitations, owner leaving, partial invite delivery, duplicate creation retry, invalid website, existing member invitation, deleted workspace, access removed mid-session, connection permission denial, failed imports, and resuming incomplete setup.

Task-based design checks: can a PM identify who gets access, create without a website, skip invites, invite an engineering colleague with appropriate access, join without creating a duplicate, switch without confusion, and understand why product confirmation is needed? Test on desktop and a narrow mobile viewport with keyboard and screen reader navigation.

Track separate milestones: signup started, work email verified, workspace created/joined, invites dispatched/accepted, workspace entered, context added, product profile confirmed, and first brief opened/evidence inspected. Measure drop-off and elapsed active setup time across those stages. Do not log email addresses, document text, or internal profile content into general analytics. Set numerical conversion targets only after collecting a baseline.

## Scope decisions

- Multiple isolated workspaces per user are included because of the explicit current requirement. The PRD labels WS-7 multi-product/business-unit workspace boundaries P2; this proposal promotes the required membership/isolation foundation and minimal switcher into onboarding scope, without adding portfolio hierarchies.
- Email signup supports corporate and generic-provider accounts. Corporate accounts resolve an organization; individual accounts have personal workspaces. Domain classification is a routing rule and does not prove company administration rights.
- Seven-day invite expiry, Reviewer defaults, and skippable invites are proposed product choices, not PRD mandates or copied competitor defaults.
- Research, specification, and visual concepts only. No authentication backend, invitations, production app changes, emails, or deployment are part of this deliverable.
