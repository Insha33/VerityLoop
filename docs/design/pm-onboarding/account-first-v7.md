# Account-first onboarding — current workflow

10 November 2026. Product-owner change of plan. This is the authoritative journey and supersedes the earlier signup-to-workspace wizard, workspace directory before the dashboard, combined connections/documents page, and optional connection step. Visuals are proposed static designs; no backend or app functionality is implemented.

## Journey

Email signup/authentication → account dashboard → user selects **Workspaces** in the left application sidebar → open/request access to an existing workspace, or create a workspace by name → optional email invitations / generated invite link → dedicated **Connections** page → separate **Documents** page → complete workspace setup and review the product profile before analysis.

Corporate and generic-email users can both sign up. Prefer work email in the copy; do not reject generic email solely for being personal.

## 1. Signup

Heading: **Create your VerityLoop account**.

Field label: **Work email**. CTA: **Continue with email**.

Put this note directly below the field:

> Use your work email to discover your company’s workspaces.

Show no second helper sentence and no “Next, your account dashboard” text below the signup button. Personal-email acceptance remains supported behavior; it does not require an additional explanatory line in this form.

The label expresses the preferred input, not a corporate-domain validation restriction. Accept Gmail, Yahoo, Hotmail, Outlook.com, and other supported personal providers. Remove “Please use your work email” rejection behavior from the earlier proposal. Do not ask users to create a workspace, select a company, connect a tool, or upload documents before opening their dashboard.

Email verification is an authentication/access requirement, not a forced product-setup wizard. With the proposed emailed sign-in link, successful link authentication establishes verified email and opens the dashboard. If an implementation supports an authenticated but unverified account shell, allow dashboard access while withholding organization directory discovery until verification. Do not expose company workspace metadata based on an unverified typed address.

## 2. Account dashboard

The first product page is the account's dashboard. Keep a persistent application sidebar with **Home**, **Workspaces**, and **Settings**. These are real app destinations, not the rejected Account/Workspace/Team/Context wizard rail.

The initial state should be useful without implying any workspace membership:

- Heading: **Welcome, Maya**.
- Next action: **Go to workspaces**.
- Explanation: “Find your company’s workspaces, request access, or create a space for your product.” For generic-email users, say “Open a workspace you belong to or create a personal workspace.”
- Corporate account: show the resolved company association, such as Acme / acme.com, without exposing product data.
- No workspace alerts, documents, inferred insights, fake counts, or company activity before membership.

The user may remain on the dashboard or return to it at any time. Setup completion is not required to access this account shell.

## 3. Workspaces from the sidebar

For verified corporate accounts, resolve or create the domain-associated organization as part of account provisioning, independently of whether a workspace exists. Use an exact, server-managed email-domain association. Do not create duplicate Acme organizations each time someone signs up. The association enables directory discovery, not organization administrator powers or access to all contents.

List the organization's linked workspaces with limited metadata:

| State | Action |
| --- | --- |
| Active workspace membership | Open |
| Organization workspace without membership | Request access |
| Pending request | Request sent; allow withdrawal |
| Explicit invitation addressed to this identity | Accept invite |

Always offer **Create workspace**. Organization users can discover workspace names and request access, while owners approve membership and role separately. No source titles, strategy, PRDs, roadmap entries, member lists, briefs, or AI-retrieval content appear before authorized membership. Directory access does not override workspace isolation.

For generic-provider accounts, create no organization. Show only the account's own memberships, explicit invitations, and personal workspace creation. Never create a Gmail/Yahoo/Hotmail organization or expose other accounts sharing those providers. Generic-email users may accept explicitly allowed invitations to corporate workspaces without gaining organization-directory privileges.

If no workspace exists, show an honest empty state with Create workspace. If an access request is pending, keep the account dashboard and new-workspace creation available; do not trap the user in a waiting screen. Request approval opens the existing workspace; it does not force a reviewer through the owner's connector/setup flow.

## 4. Create workspace

Require only **Workspace name**. Keep product website and detailed product information out of this creation form; the new requirement is naming, with later product context.

For company accounts, show read-only **Organization: Acme**, derived from the verified email. For generic accounts, show **Personal workspace**. Neither the workspace name nor a typed company name or URL controls the organization association.

Corporate copy: “Colleagues at Acme can find this workspace and request access. You decide who joins.”

CTA: **Create workspace**. Persist the workspace and owner membership idempotently before advancing. The first corporate workspace creator owns their workspace only, not all of Acme or its verified domain. Personal workspaces have a user owner and no organization.

## 5. Invite colleagues — optional

After creation, offer work/personal email invitations as allowed by workspace policy, with per-invite roles, Add another, and **Generate invite link**. Link generation is a separate action from sending an invitation. Show expiry, role, Copy, and Revoke after generating the link. Personal-workspace links must not be restricted to the user's entire public email provider domain.

Primary when valid unsent addresses exist: **Send invite & continue**. Primary with no entries: **Continue to connections**. Also show **Skip for now**. Neither invitations nor link generation are prerequisites to proceed.

For corporate workspaces, explain that Acme users can also request access from their own Workspaces page. Do not restore automatic same-domain membership. Explicit invitations and owner-approved access requests remain separate paths.

## 6. Connections — a dedicated page

Place this after the invitation step, inside the newly created workspace's context. The user explicitly separated connections from document context; no upload area appears on this page.

Show Jira, Confluence, Linear, and a Browse more integrations action for genuinely available providers. Explain the role of each tool: Jira/Linear supply delivery work; Confluence supplies documentation and product knowledge.

Proposed interpretation of “have to link”: **at least one tool must be authorized and scoped before advancing from Connections to Documents**. Do not require every listed provider. This is a setup progression gate, not a signup/dashboard gate. The user can return to their dashboard or resume setup later. This interpretation was disclosed during the design update; change it only if the product owner chooses an optional connection policy later.

Connection sequence:

1. Connect → provider authentication/authorization.
2. Return to this workspace and choose projects, teams, spaces, or pages to include.
3. Review included sources and exclusions; explicitly start import.
4. Show Connected, Importing, Ready, authorization failure, or sync failure accurately.

An OAuth grant with no selected sources is not sufficient to pass the connection gate. A valid connection with selected eligible sources may allow continuing while background import runs; do not require every document to finish syncing before the next screen. Show a clear recovery path when provider permission is unavailable. Do not silently bypass the required gate by treating a failed import or missing source selection as a connection.

Use read-only provider access for onboarding. Bind credentials, source selection, indexes, jobs, and retrieval to the current workspace. Native source ACLs still apply. No write/publish permission is implied by this step.

CTA: **Continue to documents**, disabled with the explanation **Connect at least one tool to continue** until the valid scoped connection condition is met. Provide **Return to dashboard**, which preserves incomplete setup.

## 7. Documents — a separate page

Heading: **Add context about your product**.

Prompt for supporting PRDs, TDDs, architecture descriptions, roadmaps, strategy, customer research, or other relevant material. Provide a drop zone and keyboard-accessible Browse files. Suggested formats remain PDF, DOCX, PPTX, Markdown, and TXT, subject to actual parser support and limits.

List each file's name, type/size where known, state, and remove/retry action. Distinguish Uploaded, Processing, Ready, and Failed; Ready means extraction succeeded, not that the content is correct or approved. No connector catalog appears on this page.

The product owner did not explicitly make uploading a file mandatory. Keep upload available and finish setup without requiring a minimum file count. Clearly explain missing context later. **Finish workspace setup** may advance while files process; finishing never discards uploads or implies an approved product profile.

Documents are workspace-scoped and inherit defined access rules. After setup, guide an authorized PM to review and confirm the profile and market boundary before recommendations. Do not automatically generate a PRD, approve feasibility, or publish delivery work.

## Navigation and persistence

Routes as implemented in `apps/dashboard` (preview):

- `/sign-up`, `/sign-in`: email entry. Signed-out visits to any other route go to `/sign-up`.
- `/`: account dashboard.
- `/workspaces`: organization directory / personal membership list.
- `/workspaces/new`: workspace naming.
- `/workspaces/:workspaceId/invite`: optional invitations.
- `/workspaces/:workspaceId/connections`: scoped connections.
- `/workspaces/:workspaceId/documents`: supporting product documents.
- `/settings`: account settings and preview reset.

Global navigation remains stable. Only the selected workspace's content is shown inside workspace routes. A small workspace-local Invite → Connections → Documents indicator may aid setup, but the old pre-dashboard Account/Workspace/Team/Context wizard is removed.

Persist setup stage per workspace. Back restores draft input; leaving returns to the account dashboard without deleting the workspace or files. Workspace owners can resume their incomplete setup. Existing members are not required to reconnect tools or reupload documents on each login. Requests, invitations, and organization association retain the isolation contract described in [v6](organization-model-v6.md).

## Design artifacts

The v7 mockups use the existing brand. Signup retains the selected split style; authenticated screens adopt the explicitly requested real application sidebar. These are static designs only. Existing v5/v6 images preserve prior exploration and are not the current journey where they conflict with this document.

No authentication backend, company organization, workspace, invitation, access request, connection, upload, or deployment was created by this design task.
