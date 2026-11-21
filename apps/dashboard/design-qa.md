# Onboarding implementation QA

Date: 21 November 2026. Result: passed.

Scope: the seven PM onboarding screens after moving the controls to Astryx, moving every color onto theme tokens, adding dark mode, and rebuilding the sign-up stage (concept E). The page layouts and copy are the ones from the 10 November build; that record is in Git history.

## Rendered review

Every screen was captured with Playwright against the dev server at 1440×1000 and 375×812, in light and dark: sign-up, dashboard, workspace directory and its request dialog, invitation with a validation error, connections before and after connecting (and the connect dialog), documents with a rejected and an added file, workspace overview, settings, and the mobile navigation drawer.

- Layouts, spacing and copy match the previous build; only the controls (buttons, fields, select, checkboxes, dialogs, menus, badges, avatars, spinner) changed, to Astryx.
- Every corner is square (theme radius 0); avatars stay round. Primary buttons use the exact logo orange `#ff5a4f` with dark ink labels at 5.9:1. The orange also marks the logo, the active navigation icon, the setup-step underline, the sign-up headline and the signal cells. Errors and destructive actions stay red.
- The sign-up page splits 42% form to 58% stage, and the stage runs the full height of the page. The stage shows the marketing headline, a dimmed sample workspace, one sample decision brief, and the signal grid with 18px square cells. The grid stops above the product picture and clears the headline and the sign-in link. With reduced motion it is static.

Fixed during review: the signal grid showed through the dimmed workspace (now only its contents are dimmed); the stage caption overlapped the picture; on phones the header account menu crowded the breadcrumbs (it now shows the avatar only, as the original header did); a missing React key in the sample rows; the light page background was Astryx neutral's grey instead of DESIGN.md's white.

## Checks

- `npm run typecheck` (including the check that the built theme matches its source), `npm test` (22 unit tests) and `npm run build` passed.
- Eight Playwright journeys passed at 1440×1024 and 375×812, with the horizontal-overflow assertion on each captured screen and no page errors.
- Dialogs, menus and fields are Astryx components: Escape closes dialogs, focus is managed, inputs are labelled and errors are part of each field's accessible description. These checks are not a formal accessibility certification.

## Captures

`npm run test:e2e` saves the seven screens under `artifacts/onboarding/<viewport>/` (ignored by Git) in the light theme. Run Playwright with `colorScheme: "dark"` for dark captures.

## Service boundary

Passing applies to frontend behavior. No production account, organization directory, access grant, invitation delivery, provider authorization, file storage or product analysis exists. Browser session state and UI guards are demonstrative; production isolation must be enforced by server APIs and storage policies. See [README.md](README.md) for setup and architecture.
