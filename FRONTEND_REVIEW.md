# Frontend review and redesign scope

## Repository review (before visual changes)

FindIt is a Next.js App Router application. Its presentation is shared through `src/app/layout.tsx`, `src/components/layout/Navbar.tsx`, `Footer.tsx`, reusable UI controls, report cards, and claim components. Theme selection (light/dark/system) and responsive navigation are client-side.

### Pages and navigation

- `/`: landing page with report totals, three-step explanation, recent active found reports, and account call to action.
- `/browse`: active found reports, keyword search, category filters, pagination, and links to report details.
- `/report/new?type=lost|found`: authenticated report creation, image upload, category/date/location fields, optional owner verification question for lost reports.
- `/report/[id]`: item information, status/owner, claim actions for eligible found reports, owner claim review, and report deletion.
- `/dashboard`: authenticated user's reports, claims, and match summaries.
- `/matches`: authenticated potential matches, report comparisons and dismissal/claim navigation.
- `/claim/[id]`: claim detail and coordination flow.
- `/login`, `/register`: credentials authentication, account creation, password visibility controls, and callback routing.
- `/info/how-matching-works`, `/info/dti-capstone-project`: informational content.
- Shared navigation: Browse; authenticated Dashboard/Matches, lost/found report shortcuts, notifications, theme and profile/sign-out; unauthenticated Log In/Sign Up.
- Shared footer: browse/report/account/info links.

### Features, integrations, and key flows

- NextAuth credentials auth, registration API, session-aware routing and protected pages.
- PostgreSQL through Drizzle for users, categories, reports, claims, matches, messages, and notifications.
- Supabase configured for uploaded report/claim images; upload routes enforce app validation.
- Report submission -> report detail; browse/search/filter -> found report -> claim; owner reviews/approves/rejects claims; participants message, coordinate pickup, dispute/revoke/reclaim as supported by claim components/API.
- Automated report matching, confidence ranking, match dismissal, dashboard summaries.
- Notification bell polls/updates notification API.

### Verification limits identified

- Only repository code is available. No deployed URL, runtime environment variables, database credentials/data, Supabase account, or hosting/domain control is supplied. Therefore live integrations, seeded/user content, production routing, and custom-domain connection cannot be confirmed here.
- Existing icon metadata references `/icon.svg` and `src/app/icon.svg` exists. This verifies a project favicon asset, not its production delivery.
- No Privacy Policy or Terms and Conditions routes/content were found. Accurate legal text requires the operator's legal entity/contact, jurisdiction, data collected/retained, processing/sharing vendors and purposes, retention/deletion practices, user rights, security/contact procedures, eligibility, acceptable-use and moderation rules, liability/warranty language, and governing law. These must not be invented.
- No `Made with AI` label was found in the repository. The deployed site was not supplied to verify third-party hosting badges.

## Redesign changes

Visual-only work is scoped to shared styling, navigation/footer, and the landing page. Existing route handlers, API calls, data access, page content, form schemas, and interactive state are preserved.
