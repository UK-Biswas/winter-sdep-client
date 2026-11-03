# FrostTogether — Detailed Project Report

**Project:** winter-sdep-client (FrostTogether — Winter Community Platform)
**Stack:** Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · better-auth · MongoDB (via Mongo adapter) · Express backend API · Lucide icons
**Date of report:** November 3, 2026
**Scope of this update:** Added a new **Newsletter section** on the landing page and prepared this report. **No existing section, layout, design, color, spacing, or behavior was changed.**

**Verification:** `npx tsc --noEmit` ✔ · `next build` ✔ (all 10 pages compile, all routes intact)

---

## Table of Contents

1. [Complete Project Overview](#1-complete-project-overview)
2. [File-by-File Breakdown](#2-file-by-file-breakdown)
3. [Landing Page Structure](#3-landing-page-structure)
4. [Component Overview](#4-component-overview)
5. [Implementation Details (What Changed Now)](#5-implementation-details-what-changed-now)
6. [Existing Functionality Summary](#6-existing-functionality-summary)

---

## 1. Complete Project Overview

FrostTogether is a community-driven web client for organizing and joining local winter-relief and social-work initiatives (winter/blanket drives, clean-ups, plantations, food drives, health camps, education drives).

### The big picture

- It is a **Next.js App Router client** that talks to a separate **Express backend API** for event data. The app-to-backend bridge lives in two layers:
  - **App Router route handlers** (`app/api/events/**`) — relabeling requests under the same `/api/events` origin.
  - **`lib/backend-api.ts`** — forwards those requests to `BACKEND_API_URL` while minting a short-lived **JWT** (`lib/backend-token.ts`, signed with `EVENTS_JWT_SECRET`) that the Express API validates.
- **Authentication** is handled by **better-auth** (`lib/auth.ts`), backed by **MongoDB** (`winter-sdep` database) with email/password + optional Google OAuth. The browser session cookie authenticates the user; the Next.js server then authenticates to the events API with the JWT — the JWT never reaches the browser.
- **The UI** is a single client-side application rendered through one route group (`app/(site)/**`) inside one shared shell (`AppShell`: sticky header + page + dark footer + global toast + delete modal). Every page is rendered by a thin *route component* in `components/app/routes/*` that pulls state/actions from a central **AppProvider** context (session, events list, filters, join/leave, CRUD, toast, navigation guards).
- **The landing page** (`components/home/home-page.tsx`) composes four sections — Hero (+ impact stats), Features, Featured Events, Gallery — and, as of this update, a fifth **Newsletter** section rendered **immediately after the Gallery ("Community in Action") section and directly above the shared SiteFooter**.
- **Styling** is driven by a hand-crafted token system in `app/globals.css` ("FrostTogether design tokens — Pine green · frost mint · marigold warmth") supporting full **light/dark themes** (`data-theme` on `<html>`, persisted in localStorage, applied pre-paint by an inline script).

### Newsletter section (new)

A "Stay connected" call-out card, inspired by a provided reference ("Subscribe to Local Cause Alerts"), was **added as inspiration but redesigned** to match the project's existing design language:

- Deep-pine gradient card (same pine → pine-deep gradient as the footer/hero) with soft marigold & mint aurora glows, a frosted spinning snowflake watermark, and a large frosted radius + shadow (`--ft-shadow-lg`).
- Eyebrow badge ("STAY CONNECTED" with bell icon), serif-italic accent heading (`Never miss a chance to *warm your block.*` — marigold em accent), supporting copy about winter drives/blanket distributions/clean-ups.
- Email capture form (rounded pill input + marigold "Subscribe" pill button), inline success state ("You're on the list") after submit, and a perks row (weekly round-up · no spam · unsubscribe anytime).
- Fully responsive (stacks vertically under 720px), accessible (visually-hidden label, `role="status"`, decorative layers `aria-hidden`), and **theme-proof** — its fixed dark palette looks identical in light and dark modes since it matches the footer.

---

## 2. File-by-File Breakdown

> Legend: 🆕 **Newly added** · ✏️ **Modified (this update)** · ⬜ **Existing, NOT touched** (any other symbol)

### Application shell & pages (`app/`)

| File | Status | Responsibility |
|---|---|---|
| `app/layout.tsx` | ⬜ | Root layout: loads Google Fonts (Bricolage Grotesque display, Instrument Sans body, Instrument Serif accent) as CSS variables; ships metadata + the **pre-paint theme script** that reads `frosttogether-theme` from localStorage / OS preference and sets `data-theme`. |
| `app/globals.css` | ✏️ | The entire design system (~3,160 lines untouched) + **appended** a new self-contained `Newsletter` style block at the very end. Every pre-existing rule, token, and media query is byte-for-byte unchanged; the new block only introduces `.newsletter-*` class names that did not exist before. |
| `app/loading.tsx` | ⬜ | Route-level loading UI: skeleton page (title lines + 6 event-card skeletons) while dynamic content streams in. |
| `app/favicon.ico` | ⬜ | Favicon asset. |
| `app/(site)/layout.tsx` | ⬜ | Site layout: wraps all pages in `<AppProvider>` → `<AppShell>`. |
| `app/(site)/page.tsx` | ⬜ | `/` landing route → renders `<HomeRoute />`. |
| `app/(site)/events/page.tsx` | ⬜ | `/events` → `<EventsRoute />`. |
| `app/(site)/events/new/page.tsx` | ⬜ | `/events/new` (create) → `<CreateEventRoute />`. |
| `app/(site)/events/[id]/page.tsx` | ⬜ | `/events/:id` → `<EventDetailsRoute eventId={…} />`. |
| `app/(site)/events/[id]/edit/page.tsx` | ⬜ | `/events/:id/edit` → `<EditEventRoute eventId={…} />`. |
| `app/(site)/joined/page.tsx` | ⬜ | `/joined` → `<JoinedEventsRoute />` (gated). |
| `app/(site)/manage/page.tsx` | ⬜ | `/manage` → `<ManageEventsRoute />` (gated). |
| `app/(site)/profile/page.tsx` | ⬜ | `/profile` → `<ProfileRoute />` (gated). |
| `app/(site)/auth/page.tsx` | ⬜ | `/auth` → `<AuthRoute nextPath? googleEnabled? />`. |

### API route handlers (`app/api/`)

| File | Status | Responsibility |
|---|---|---|
| `app/api/auth/[...all]/route.ts` | ⬜ | better-auth catch-all handler (`toNextJsHandler`) — all `/api/auth/*` endpoints (sign-in, sign-up, sign-out, Google callback, session). |
| `app/api/events/route.ts` | ⬜ | `GET` list events (anonymous allowed, JWT attached if session exists) · `POST` create event (**requires** session). |
| `app/api/events/[id]/route.ts` | ⬜ | `GET` one · `PUT` update · `DELETE` (owner operations require session). |
| `app/api/events/[id]/join/route.ts` | ⬜ | `POST` join · `DELETE` leave (session required; backend stamps `joinedAt` on the event record). |
| `app/api/events/joined/route.ts` | ⬜ | `GET` the signed-in user's joined events. |
| `app/api/events/mine/route.ts` | ⬜ | `GET` events organized by the signed-in user. |

### Core app plumbing (`components/app/`)

| File | Status | Responsibility |
|---|---|---|
| `components/app/app-provider.tsx` | ⬜ | **Central client store** (React context): session via better-auth `useSession`; loads events on mount; derives `upcomingEvents`, `filteredVisibleEvents`, `myEvents`, `joinedEvents`, `joined` map (eventId → join timestamp); owns filters (`search`, `category`), toast queue, delete target, pending auth redirects; actions: `navigate` (with auth-gate redirect), `openEvent`, `editEvent`, `createEvent`, `updateEvent`, `confirmDelete`, `toggleJoin`/`handleJoin`, `handleAuthSuccess`, `signOut`, `handleCategory`, `resetFilters`, `reloadEvents`, `refreshSession`, `showToast`. Exports `useApp()` and `useRequireUser(page)` gate hook. |
| `components/app/app-shell.tsx` | ⬜ | Renders `<SiteHeader>` + `{children}` + `<SiteFooter>` + `DeleteEventModal` (when armed) + global toast. Smooth-scrolls to top on route change. The footer (and everything below it) is where the newsletter now sits above. |

### Route components (`components/app/routes/`) ⬜ all untouched

| File | Renders | Notes |
|---|---|---|
| `home-route.tsx` | Landing | Feeds `upcomingEvents` + `eventsLoading` into `HomePage`. |
| `events-route.tsx` | Events board | Loading skeleton / error state / `EventListPage` with filtered events. |
| `event-details-route.tsx` | Event detail | Resolves event by id; computes `isOwner` by email; wiring join/edit/back. |
| `create-event-route.tsx` | Create form | Uses `useRequireUser("create")`; passes `createEvent`. |
| `edit-event-route.tsx` | Edit form | Reuses `CreateEventForm` in edit mode; **blocks non-owners**. |
| `joined-events-route.tsx` | Joined list | Uses `useRequireUser("joined")`; leave → `toggleJoin`. |
| `manage-events-route.tsx` | Manage list | Uses `useRequireUser("manage")`; delete → arms `deleteTarget` modal. |
| `profile-route.tsx` | Profile editor | Refreshes session after save + toast. |
| `auth-route.tsx` | Auth page | Post-sign-in redirect bookkeeping (pending target path, incoming `nextPath`, Google flag). |

### Landing page components (`components/home/`)

| File | Status | Responsibility |
|---|---|---|
| `home-page.tsx` | ✏️ | Orders the landing page. **Only change:** imports `NewsletterSection` and renders it after `<GallerySection>` (below the fold, above the footer). Everything else — prop contracts and the four existing sections — untouched. |
| `hero-section.tsx` | ⬜ | Hero: aurora blobs, eyebrow, (edited) centered copy, headline with serif-italic accent, CTA pair, avatar trust line, hero art card with live "24 active drives" caption + two floating notes. (Also retains an older commented-out hero markup — left as-is.) |
| `impact-stats.tsx` | ⬜ | 4-stat strip under the hero (volunteers, drives, lives touched, community-driven). |
| `feature-section.tsx` | ⬜ | "Built for good neighbors" — 6 feature cards from `FEATURES`, rendered server-side. |
| `featured-events.tsx` | ⬜ | "Recent upcoming events" — row heading + "View all", loading skeleton, max-6 sorted upcoming `EventCard`s. |
| `gallery-section.tsx` | ⬜ | **"Community in action."** — visual story grid (1 large + 3 tiles with captions) from `GALLERY`. |
| `newsletter-section.tsx` | 🆕 | **New.** The newsletter CTA card described in §1/§5. See full walkthrough below. |

### Layout & brand components (`components/layout/`, `components/brand/`) ⬜ untouched

| File | Responsibility |
|---|---|
| `layout/site-header.tsx` | Sticky blurred header: brand lockup, desktop nav (context-aware: Manage/Joined only when signed in), theme toggle, avatar/profile button, profile-page icon button, sign-out; mobile dropdown with animated grid-rows reveal. |
| `layout/site-footer.tsx` | Dark pine footer: brand + mission, location line, small footer subscribe form, Explore platform column, Active causes column (navigates to `/events` with that category pre-filtered), Community Spirit column (pill + "Start an initiative" CTA), copyright bar. **Untouched — the newsletter sits above this footer, not inside it.** |
| `layout/theme-toggle.tsx` | Light/dark toggle: prefers-color-scheme listener unless an explicit choice is stored; writes `data-theme` + localStorage. |
| `brand/logo.tsx` | `LogoMark` SVG (frost tile + six-point burst + marigold core) and `LogoLockup` (mark + wordmark). Used in header, footer, auth card. |

### Event components (`components/events/`) ⬜ untouched

| File | Responsibility |
|---|---|
| `event-list-page.tsx` | Events page scaffold: title row + create button, filters, grid or empty state. |
| `event-filters.tsx` | Category pills (7 categories), search box, results count, reset. |
| `event-grid.tsx` | Grid wrapper mapping `EventCard`s. |
| `event-card.tsx` | Card: image, category tag, floating date pill, title, location, clamped description, host, "View event". |
| `event-details.tsx` | Detail page: hero image + gradient overlay + meta pills; join-bar (owner gets Edit; button adapts to signed-out/joined states); About + organizer guidelines; organizer card & facts aside. |
| `create-event-form.tsx` | Shared **create & edit** form: validated title/date/location/image URL/description, type pills, live image preview, organizer note, publish/update button. |
| `manage-events.tsx` | Owner's event rows with View/Edit/Delete + "Create another event". |
| `joined-events.tsx` | Joined rows with "Joined <date>" stamp, View/Leave + browse row. |
| `private-events-page.tsx` | Shared scaffold for gated pages (Manage/Joined). |
| `empty-events.tsx` | Reusable empty/error state with primary/secondary actions. |
| `delete-event-modal.tsx` | Confirmation dialog: Escape closes, backdrop click closes, body scroll lock, `aria-*` wiring. |

### Auth & profile components (`components/auth/`, `components/profile/`) ⬜ untouched

| File | Responsibility |
|---|---|
| `auth/auth-page.tsx` | Auth screen built on `auth-shell` + sign-in / sign-up modes. |
| `auth/auth-shell.tsx` | Card frame for auth (brand, back button, content). |
| `auth/sign-in-form.tsx` | Email/password sign-in + (conditionally) Google button + link to sign-up. |
| `auth/sign-up-form.tsx` | Registration with live password rules checklist. |
| `profile/profile-form.tsx` | Edit display name / photo, save via better-auth, then session refresh + toast. |

### Shared UI (`components/ui/`) ⬜ untouched

| File | Responsibility |
|---|---|
| `loading-skeleton.tsx` | Reusable skeleton cards in `loading-skeleton-grid`. |

### Library helpers (`lib/`) ⬜ all untouched

| File | Responsibility |
|---|---|
| `types.ts` | `Event`, `EventDraft`, `SessionUser`, `PageView`, `JoinedMap`, `EventCardProps`, `Feature`. |
| `constants.ts` | `EVENT_CATEGORIES`, `EVENT_TYPES`, `IMPACT_STATS`, `FEATURES` (with Lucide icons), `ACTIVE_CAUSES` (footer), `HERO_IMAGE`, `GALLERY`. |
| `api.ts` | Typed fetch wrapper for `/api/events` (+ `ApiError` with fieldErrors, friendly network error, error helpers). |
| `events.ts` | id resolution (`_id`/`id`/title), today/date math, `isUpcoming`, date formatters, `sortByDate`. |
| `routes.ts` | `ROUTE_PATHS` map, `pathFor`, `eventPath`, `eventEditPath`. |
| `auth.ts` | better-auth server instance (MongoDB adapter `winter-sdep`, email/password policy, 7-day sessions + cookie cache, rate limits 20/min (5/min on credentials), optional Google provider). |
| `auth-client.ts` | Client better-auth instance + `signIn/signUp/signOut/useSession`. |
| `auth-providers.ts` | Google-enabled flag derived from env credentials. |
| `session.ts` | `getServerSessionUser()` for Server Components. |
| `backend-api.ts` | Server-side proxy to the Express events API: accepts/validates JSON bodies, resolves the Better-Auth session server-side, guards `authenticated` requests, attaches `Bearer <JWT>`, relays status/body, 502 fallback message. |
| `backend-token.ts` | Mints 15-minute HS256 JWTs (`EVENTS_JWT_SECRET`, issuer `frosttogether-web`, audience `frosttogether-api`) — server-to-API identity only. |
| `utils.ts` | `cn` re-export. |

### Config/tooling (root) ⬜ untouched

`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `prettierrc`/`prettierignore`, `components.json` (shadcn), `postcss.config.mjs`, `.env` / `.env.example`, `package.json`, `README.md`, `AGENTS.md`, `CLAUDE.md`, empty `components/.gitkeep`, `hooks/.gitkeep`, `public/.gitkeep`.

### Files affected by this update (complete list)

| # | File | Change |
|---|---|---|
| 1 | `components/home/newsletter-section.tsx` | 🆕 Created — new newsletter section component. |
| 2 | `components/home/home-page.tsx` | ✏️ 2-line integration: one import, one component render after `<GallerySection />`. |
| 3 | `app/globals.css` | ✏️ Appended `.newsletter-*` style block at end of file; existing content untouched. |
| 4 | `PROJECT-REPORT.md` | 🆕 This report. |

Nothing else was added, removed, or modified.

---

## 3. Landing Page Structure

Route: `/` → `app/(site)/page.tsx` → `components/app/routes/home-route.tsx` → **`components/home/home-page.tsx`** (renders inside `AppShell`).

**Current order (top → bottom), with renderers:**

| # | Section | Renderer | Visual summary |
|---|---|---|---|
| — | Sticky site header | `SiteHeader` (in `app-shell.tsx`) | Blur backdrop, brand, nav, theme toggle, auth controls (shared across all pages). |
| 1 | **Hero** | `HeroSection` + `ImpactStats` (for `hero-stats` strip) | Aurora glows, "Community-led winter action" eyebrow, headline "Make winter warmer, *one block at a time.*", CTA pair (Explore upcoming events / Start an initiative), 1,450+ volunteers trust line, hero image card with live caption + 2 floating notes, then the 4-stat impact strip. |
| 2 | **Features** | `FeatureSection` (`#features`) | "Built for good neighbors" centered heading + 6 feature cards from `FEATURES`. |
| 3 | **Featured Events** | `FeaturedEvents` (`#events`) | "Recent upcoming events" row heading + "View all events", first 6 upcoming events as `EventCard`s (sorted by date; skeleton while loading). |
| 4 | **Gallery** | `GallerySection` (`#stories`) | **"Community in *action.*"** heading + 4-image story grid with hover zoom + caption gradient. |
| 5 | **Newsletter** 🆕 | `NewsletterSection` (`#newsletter`) | "Stay connected" eyebrow, "Never miss a chance to *warm your block.*", supporting copy, email + Subscribe pill, success state, perks row. Deep-pine gradient card. |
| — | **Site footer** | `SiteFooter` (in `app-shell.tsx`) | Dark pine footer with brand/mission + footer subscribe box, Explore platform links, Active causes filter links, Community spirit column, copyright bar. Shared across all pages. |
| — | Toast (floating) | `app-shell.tsx` | Global confirmation toasts (also from newsletter-independent flows). |

The newsletter section is rendered **inside `<main>` at the very end, directly above `<SiteFooter>`** — exactly the requested position (below "Community in Action", above the footer).

---

## 4. Component Overview (how the majors work & connect)

### Composition flow

```
app/layout.tsx (fonts, theme script)
└── app/(site)/layout.tsx
    └── AppProvider  ── context: session, events, filters, actions, toast, delete modal state
        └── AppShell
            ├── SiteHeader (uses AppShell-level mobileOpen state + navigate/signOut)
            ├── {children}  ←  the matched app-router page (thin page.tsx → route component)
            │     └── e.g. HomeRoute → HomePage → Hero, Features, FeaturedEvents, Gallery, 🆕 Newsletter
            ├── SiteFooter (navigate + handleCategory)
            ├── DeleteEventModal (when deleteTarget set — armed from Manage page)
            └── Toast (auto-dismisses after 3.4 s, re-keyed per toast)
```

### Key connecting patterns

- **Single source of truth (`AppProvider`).** Pages don't fetch data themselves; `home-route`, `events-route`, etc. read `useApp()`. `AppProvider` loads all events once (`fetchEvents` via `/api/events` → server proxy → Express), refreshes on session activity changes, and derives every list (`upcoming`, `visible/filtered`, `mine`, `joined`, plus the `joined` timestamp map) with `useMemo`.
- **View-based navigation with guards.** Buttons throughout the app call `navigate(page: PageView)` rather than `<Link>`. The provider maps logical views to URL paths (`ROUTE_PATHS`), and gated views (`create`, `edit`, `manage`, `joined`, `profile`) bounce anonymous visitors to `/auth` with a toast + a stored `pendingPath` so `handleAuthSuccess` can return them to the page they intended to navigate to. `useRequireUser` is the declared-gate hook used inside gated route components.
- **Event lifecycle.** Create (`create-event-form` → `createEvent` → POST) → appears in Manage with volunteer counts → Edit reuses the same form in edit mode (owner-only enforced again client-side) → Delete opens `DeleteEventModal` → `confirmDelete` calls DELETE and closes the modal. Join/leave is symmetric (`joinEventRequest` / `leaveEventRequest`), updating the event record (`joinedCount`, `joinedAt`) in local state.
- **Design system plumbing.** Fonts become `--font-display/body/accent`; tokens live in `:root` and `[data-theme="dark"]`. Components compose utility classes (Tailwind) with bespoke class names defined in `globals.css` (`.primary-button`, `.eyebrow`, `.feature-card`, `.manage-row`, `.newsletter-*` …). Dark mode is instant because the pre-paint script sets `data-theme` before first paint, and the CSS toggles both palettes.

### The new `NewsletterSection` (how it works)

- **State:** `email` (controlled input) + `subscribed` (success flag). Purely client-side ("use client"); no orphan network calls — mirrors the existing footer subscribe behaviour.
- **Submit:** `handleSubmit` prevents default, validates via the email input's built-in rules (`type="email" required`), then flips `subscribed`; the form is replaced by a `role="status"` confirmation pill. The code carries a documented hook point (`handleSubmit`) for a future newsletter endpoint.
- **Decorations:** a soft marigold glow band, a mint aurora blob, and a slowly rotating snowflake watermark — all `aria-hidden`, `z-index: -1`, `pointer-events: none`, disabled under `prefers-reduced-motion` by the existing global rule.
- **Content:** matches the reference's message (alerts about winter drives, blanket distributions, emergency clean-ups) with FrostTogether phrasing and icon set (Lucide: `BellRing`, `Send`, `MailCheck`, `CalendarCheck`, `ShieldCheck`, `Snowflake`).

---

## 5. Implementation Details (What Changed Now)

### 5.1 `components/home/newsletter-section.tsx` — 🆕 new file

Responsive, themed newsletter CTA with three parts:

1. **Pitch block** — `BellRing` eyebrow "Stay connected", headline with serif-italic marigold accent, one-line value proposition.
2. **Capture form** — hidden accessible label, rounded translucent email input (ring on focus), marigold pill "Subscribe" button (`Send` icon). On submit → success pill (`MailCheck`, "You're on the list." + follow-up line) announced via `role="status"`.
3. **Perks row** — trisection separated by a hairline: "Weekly round-up of new drives", "No spam, ever", "Unsubscribe anytime".

Design decisions recorded for maintainers:

- Card palette intentionally mirrors the footer's `pine-deep` gradient so the two flow into each other as one continuous dark block at the bottom of the page.
- All decorative elements use `z-index: -1` and `isolation: isolate` on the card so glows can't bleed into neighbours.
- Dark theme needs no duplicates — the card's own dark palette is identical in both modes.
- Perks use marigold icons to tie the section back to the site's warm accent color.

### 5.2 `components/home/home-page.tsx` — ✏️ modified (2 lines)

```diff
  import FeatureSection from "./feature-section";
  import FeaturedEvents from "./featured-events";
  import GallerySection from "./gallery-section";
  import HeroSection from "./hero-section";
+ import NewsletterSection from "./newsletter-section";
  ...
        <GallerySection />
+       <NewsletterSection />
      </main>
```

No props, no context needed — the component is self-contained, keeping `HomePage`'s public contract identical.

### 5.3 `app/globals.css` — ✏️ appended (no edits to existing CSS)

New block titled *"Newsletter (landing page, above the footer)"* covers: `.newsletter-section` (page gutters + bottom padding before the footer), `.newsletter-card`, `.newsletter-glow`, `.newsletter-aurora`, `.newsletter-watermark` (+ `newsletter-spin` keyframes), `.newsletter-eyebrow` (adjusted color on dark background only), heading/`em` overrides, paragraph, `.newsletter-form` input/button (the later-in-file `.newsletter-form input` rules intentionally take precedence over the global input stylesheet — scoped, not global changes), `.newsletter-success`, `.newsletter-perks`, and a `@media (max-width: 720px)` block for mobile stacking (full-width button, vertical perks).

Because every selector is prefixed `.newsletter-*`, the risk to pre-existing styles is zero, and the build/type checks confirm no regressions.

### 5.4 Verification performed

- `npx tsc --noEmit` — clean.
- `npm run build` — compiled successfully; all 10 static/dynamic routes generated with the same outcome table as before.
- Visual/manual checklist: section appears only on `/` (between Gallery and footer), doesn't shift footer layout, works in light + dark themes, and collapses gracefully on mobile widths.

---

## 6. Existing Functionality Summary

Everything below **already existed and continues to work unchanged**:

### Public experience
- **Landing page** with hero + live-drive caption, impact stats strip, feature grid, featured upcoming events, and photo gallery — all themed, responsive, light/dark.
- **Events board (`/events`)** — live list of upcoming events, quick category pills (All, Winter Relief, Donation, Cleanup, Plantation, Food Drive, Health Camp, Education), instant text search over title/type/location/host, results counter, reset, loading skeletons, dedicated error state with "Try again", and an actionable empty state.
- **Event detail (`/events/:id`)** — cinematic hero, date/location/volunteer meta, join bar with contextual button copy (signed-out → "Sign in to join", joined → "click to leave"), organizer note/guidelines list, organizer profile card with email, and sticky facts panel.
- **Category deep links** — footer's "Active causes" opens the events board pre-filtered (`handleCategory`).
- **Global toast system** + smooth scroll-to-top on navigation.

### Authenticated experience (better-auth on MongoDB)
- **Email/password sign-up & sign-in** with password policy (8–128 chars), live password-rules checklist, rate limiting (5 attempts/min on credentials), Google sign-in that auto-hides until env credentials exist.
- **Session handling** — 7-day sessions with cookie caching; client via `useSession`, server via `getServerSessionUser`; profile refresh after edits.
- **Gated workspace** — Create / Manage / Joined / Profile require sign-in; anonymous users get a toast, are routed to `/auth`, and are returned to the original target after signing in (including auto-completing a pending "join" action).
- **Create & edit events** — one validated form for both modes (title, type, date ≥ today, location, thumbnail image URL with `http(s)` validation + live preview, ≥ 20-char description); organizer identity attached automatically; publish/update redirects to Manage.
- **Manage my events** — owner-filtered list with View/Edit/Delete; delete goes through a confirmation modal (Escape/backdrop close, scroll lock) and cascades volunteer registrations on the API.
- **Joined events** — date-sorted commitments with "Joined <date>" stamps and one-click leave; mirrored by the detail-page join bar.
- **Profile editing** — display name/photo updates with session refresh + toast.

### Platform/integration layer
- **Express backend proxy** — `/api/events*` handlers forward to `BACKEND_API_URL`, attaching a 15-minute signed JWT (secret shared with the API) derived from the user's server-side session; `force-dynamic` avoids caching; 502 with friendly copy if the service is down.
- **Theming infrastructure** — pre-paint inline script, localStorage persistence (`frosttogether-theme`), OS-preference listener, dual token palettes.
- **Loading & resilience** — route-level skeletons, in-page skeletons, error states with retry (`reloadEvents`), optimistic local-state updates after every mutation, and defensive fallbacks everywhere (e.g., events without `_id` fall back to `id`/title keys).

### Data & navigation integrity
- Past events auto-drop from every list (`isUpcoming`, date parsing without timezone drift).
- Logical `PageView` navigation with URL mapping keeps shareable URLs and context-aware redirects (profile button → manage, sign-in while authenticated → manage).

---

*Report generated as part of the newsletter-section task. New: `components/home/newsletter-section.tsx`, `PROJECT-REPORT.md` · Modified: `components/home/home-page.tsx`, `app/globals.css` (append-only) · Everything else: untouched.*
