# Onboarding implementation QA

Date: 10 November 2026

final result: passed

Scope: the seven approved PM onboarding screens, implemented as an interactive frontend preview. References: `../../docs/design/pm-onboarding/v8/`, `account-first-v7.md`, and `refinement-v8.md` in the same design directory. Local Playwright was used with explicit user approval because this session has no connected browser tool.

## Rendered review

Compared the reference images and actual browser captures for the split signup, authenticated sidebar, workspace list/form, invitation flow, connections and documents. Retained warm surfaces, ink primary actions, restrained coral accents, Manrope, simple rows, and the global-versus-workspace navigation distinction. Applied the specified 28/36px heading, 16px input/body and 14px label/helper scale using relative font units. Mobile invitation fields stack to preserve email input space. The sidebar becomes a toggleable navigation drawer on phones.

This is a responsive interpretation of image-generated references, not a pixel-difference certification. Intentional differences: consistent 232px desktop sidebar; sample data and preview disclosures; actual Jira/Linear assets and a generic book icon for Confluence; local file status rather than claiming an upload or analysis occurred. Terms and additional integrations open informative dialogs until their services are configured.

## Checks

- Production build and TypeScript check passed.
- Eight Playwright journeys passed: company and personal flows at 1440×1024, 768×1024, 375×812, and 320×740.
- All seven screens captured at each viewport with a horizontal-overflow assertion.
- Checked email validation, owner request/pending states, restricted direct URLs, Reviewer management restrictions, workspace naming, invitation validation, generated link revocation, optional invite skipping, required scoped connection, invalid file recovery, document metadata, reload persistence, completion and separate state in a second workspace.
- Browser page errors were collected during company journeys; none occurred.
- Native dialogs support Escape and modal focus behavior; navigation has current-page semantics, labelled inputs, error/status announcements, a skip link and focus indicators. Closed mobile navigation is hidden from keyboard interaction. Reduced-motion styles are provided. These checks are not a formal accessibility certification or a substitute for assistive-technology testing.

Fixed during review: hidden file input causing desktop overflow; cramped mobile email fields; an early workspace-directory screenshot captured before route completion; primary action color mismatch; development overlay in captures. No unresolved blocking visual or interaction issue was observed in the tested flows.

## Captures

Generated locally by `npm run test:e2e`. Artifacts are ignored by Git and can be regenerated.

| Screen | Desktop | Phone |
| --- | --- | --- |
| Signup | [Capture](artifacts/onboarding/desktop/01-signup.png) | [Capture](artifacts/onboarding/mobile/01-signup.png) |
| Dashboard | [Capture](artifacts/onboarding/desktop/02-dashboard.png) | [Capture](artifacts/onboarding/mobile/02-dashboard.png) |
| Workspaces | [Capture](artifacts/onboarding/desktop/03-workspaces.png) | [Capture](artifacts/onboarding/mobile/03-workspaces.png) |
| Create workspace | [Capture](artifacts/onboarding/desktop/04-create-workspace.png) | [Capture](artifacts/onboarding/mobile/04-create-workspace.png) |
| Invite | [Capture](artifacts/onboarding/desktop/05-invite.png) | [Capture](artifacts/onboarding/mobile/05-invite.png) |
| Connections | [Capture](artifacts/onboarding/desktop/06-connections.png) | [Capture](artifacts/onboarding/mobile/06-connections.png) |
| Documents | [Capture](artifacts/onboarding/desktop/07-documents.png) | [Capture](artifacts/onboarding/mobile/07-documents.png) |

## Service boundary

Passing applies to frontend behavior. No production account, organization directory, access grant, invitation delivery, provider authorization, file storage or product analysis exists. Browser session state and UI guards are demonstrative; production isolation must be enforced by server APIs and storage policies. See [README.md](README.md) for setup and architecture.
