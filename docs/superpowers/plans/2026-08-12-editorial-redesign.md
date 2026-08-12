# Sutton Fields Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform suttonfields.info into a bold-editorial hyperlocal news product per `docs/superpowers/specs/2026-08-12-editorial-redesign-design.md`.

**Architecture:** Retheme the existing MD3 design-token system in place (all components inherit), rebuild the homepage as a newspaper front page, rename/merge routes with 301 redirects, add an Answers content system + roads tracker, then layer on the automated Thursday Dispatch email and the screenshot Tipline. Each phase ships to production independently via git push to main (user-approved workflow: direct-to-main, verify on prod).

**Tech Stack:** Next.js 16 App Router + Turbopack, Tailwind v4 (`@theme inline` tokens), Drizzle + Neon, Clerk, OpenAI (`gpt-5.6-luna` vision/text), Resend (new, Phase 4), Vercel Hobby (2-cron cap, `maxDuration` on slow routes).

**Codebase facts the engineer needs:**
- Fonts already loaded in `src/app/layout.tsx`: Newsreader (`--font-newsreader`, serif w/ italics) and Manrope (`--font-manrope`). Keep both — Newsreader is the editorial display face.
- All components style via MD3 token classes (`bg-primary`, `text-on-surface`, `bg-surface-container` etc.) defined in `src/app/globals.css` `@theme inline`. Retheming the token VALUES restyles the whole site at once.
- DB pattern: tables in `src/db/schema.ts` (pgTable, text ids via `crypto.randomUUID()` defaults, `timestamp` columns); push with `npx dotenv -e .env.local -- npx drizzle-kit push`. **NOTE: `.env.local` currently lacks `DATABASE_URL`** (wiped by a Vercel CLI env pull). The user must restore it before any `drizzle-kit push`; flag this at execution start.
- Server actions in `src/actions/*.ts` ("use server", `requireAdmin()` from `src/lib/auth.ts` for admin ops). Cron logic in `src/lib/*.ts` called by `src/app/api/cron/nightly/route.ts`.
- Pages needing live DB data use `export const dynamic = "force-dynamic"` (events) or `export const revalidate = 900` (homepage). SiteHeader fetches client-side to stay static-safe.
- `npm run build` fails locally at prerender without `DATABASE_URL` but compiles + typechecks first — "Compiled successfully" + "Finished TypeScript" is the local pass signal; full prerender verification happens on Vercel deploy.
- Research source material: `docs/superpowers/research/2026-08-12-*.md` (created in Task 0).

---

## Phase 1 — Brand, Homepage, Nav, Redirects

### Task 0: Preserve research reports
**Files:** Create `docs/superpowers/research/2026-08-12-forum-listening.md`, `2026-08-12-area-developments.md`, `2026-08-12-stickiness-patterns.md`

- [ ] Write the three research agent reports (in conversation context) verbatim to the three files. These are the canonical source material for all Answer content; every seeded answer cites sources from them.
- [ ] Commit: `git add docs/ && git commit -m "docs: preserve redesign research reports"`

### Task 1: Editorial design tokens
**Files:** Modify `src/app/globals.css`

- [ ] Replace the MD3 green palette values with the editorial palette, keeping every token NAME identical so existing components restyle automatically. New values (light mode):

```css
@theme inline {
  /* Editorial palette — ink on paper with signal accent */
  --color-background: #faf8f4;        /* paper */
  --color-surface: #faf8f4;
  --color-on-surface: #171512;        /* ink */
  --color-on-background: #171512;
  --color-primary: #b3410e;           /* signal: burnt sunset orange */
  --color-on-primary: #ffffff;
  --color-primary-container: #8f3005;
  --color-on-primary-container: #ffede4;
  --color-secondary: #3f4a3c;         /* muted field green (heritage nod) */
  --color-on-secondary: #ffffff;
  --color-secondary-container: #e6e4dc;
  --color-on-secondary-container: #33302a;
  --color-tertiary: #7a5c33;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f4f1ea;
  --color-surface-container: #efebe2;
  --color-surface-container-high: #e8e3d8;
  --color-surface-container-highest: #e1dbce;
  --color-surface-variant: #eae6dc;
  --color-on-surface-variant: #4a463e;
  --color-outline: #79746a;
  --color-outline-variant: #d4cfc2;
  --color-error: #ba1a1a;             /* keep */
  /* leave remaining MD3 tokens, remapped to nearest new values */

  /* New editorial tokens */
  --color-ink: #171512;
  --color-paper: #faf8f4;
  --color-accent: #b3410e;
  --color-section-news: #b3410e;
  --color-section-events: #1f5f3f;
  --color-section-answers: #1d4ed8;
  --color-section-directory: #7a5c33;
  --color-section-classifieds: #6b21a8;
  --font-headline: var(--font-newsreader), Georgia, serif;
}
```

- [ ] Add editorial base styles: headline sizing utilities (`.headline-xl` clamp(2.25rem, 6vw, 4.5rem), tight leading, Newsreader opsz), `.hairline` (1px `--color-outline-variant` border utility), `.dateline` (tracking-wide uppercase 11px label style using Manrope).
- [ ] Run `npm run build` → expect "Compiled successfully"; eyeball dev server homepage for palette sanity.
- [ ] Commit: `git commit -m "feat: editorial design tokens - ink/paper/signal palette"`

### Task 2: Editorial UI primitives
**Files:** Create `src/components/ui/Dateline.tsx`, `src/components/ui/StatusChip.tsx`, `src/components/ui/LastVerified.tsx`; Modify `src/components/ui/SectionLabel.tsx`

- [ ] `Dateline`: renders `CELINA, TX — {date in "AUG 12" format}` in dateline style. Props: `prefix?` (default "CELINA, TX"), `date?` (default now, America/Chicago).
- [ ] `StatusChip`: pill with colored status dot + label + value + optional href. Props: `label`, `value`, `tone: "ok" | "warn" | "alert" | "unknown"`, `href?`, `note?`. Unknown tone renders value "Status unknown".
- [ ] `LastVerified`: `Last verified {Mon D, YYYY}` badge; `stale` visual variant when >90 days old (compare against passed date).
- [ ] `SectionLabel`: accept `section?: "news" | "events" | "answers" | "directory" | "classifieds"` prop mapping to the `--color-section-*` tokens.
- [ ] Build passes; commit: `git commit -m "feat: editorial UI primitives (Dateline, StatusChip, LastVerified)"`

### Task 3: Schema — subscribers, board_status, featured article
**Files:** Modify `src/db/schema.ts`

- [ ] Add:

```ts
export const subscribers = pgTable("subscribers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  unsubscribe_token: text("unsubscribe_token").notNull().$defaultFn(() => crypto.randomUUID()),
  created_at: timestamp("created_at").defaultNow().notNull(),
  unsubscribed_at: timestamp("unsubscribed_at"),
});

export const board_status = pgTable("board_status", {
  key: text("key").primaryKey(), // "pool" | "water" | "trash" | "roads" | "school"
  value: text("value").notNull(),      // short chip value, e.g. "Open" / "Stage 2"
  note: text("note"),                  // optional detail line
  tone: text("tone").notNull().default("unknown"), // ok|warn|alert|unknown
  link_url: text("link_url"),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
```

- [ ] Add `is_featured: boolean("is_featured").default(false).notNull()` to `articles`.
- [ ] Push schema: `npx dotenv -e .env.local -- npx drizzle-kit push` (requires user to restore DATABASE_URL first).
- [ ] Commit: `git commit -m "feat: subscribers, board_status tables; featured article flag"`

### Task 4: Actions — board, subscribe, featured
**Files:** Create `src/actions/board.ts`, `src/actions/subscribers.ts`; Modify `src/actions/articles.ts`

- [ ] `board.ts`: `getBoardStatus()` (public read, returns all rows keyed), `setBoardStatus(key, {value, note, tone, link_url})` (requireAdmin, upsert).
- [ ] `subscribers.ts`: `subscribe(email)` — lowercase/trim, validate with a simple regex, upsert (re-subscribing clears `unsubscribed_at`), never throw on duplicates, return `{ok: true}`. `unsubscribe(token)` sets `unsubscribed_at`. `getSubscriberCount()` (admin).
- [ ] `articles.ts`: `setFeaturedArticle(id)` (requireAdmin: clear flag on all, set on one), and export `getFeaturedArticle()` = featured article else most recent published.
- [ ] Build passes; commit: `git commit -m "feat: board status, subscriber, featured-article actions"`

### Task 5: Masthead (Navbar rework)
**Files:** Modify `src/components/layout/Navbar.tsx`, `src/data/navigation.ts`

- [ ] `navigation.ts` navLinks become: News `/news`, Events `/events`, Answers `/answers` (**add in Phase 2 — omit from array until then**), Directory `/directory`, Classifieds `/classifieds`, New Here? `/new-here`.
- [ ] Navbar becomes a two-row editorial masthead: row 1 = Dateline (left), "SUTTON FIELDS" wordmark centered (Newsreader, bold, tracking tight, links home), "Get the Dispatch" accent button + auth buttons (right); row 2 = nav links in dateline style with section-color underline on hover/active, hairline rules above and below. Mobile: wordmark + hamburger sheet (keep existing mobile pattern), Dispatch button in sheet.
- [ ] Tagline under wordmark (home page only, via prop or pathname check): "The unofficial record of Sutton Fields — Celina, Texas".
- [ ] Build passes; commit: `git commit -m "feat: editorial masthead navigation"`

### Task 6: The Board
**Files:** Create `src/components/home/TheBoard.tsx`, `src/app/admin/board/page.tsx`

- [ ] `TheBoard`: async server component; `getBoardStatus()`; renders horizontal scroll strip (snap-x, no scrollbar) of StatusChips: Pool, Trash, Water, Roads, School. Each chip `href` from row `link_url` (Phase 2 repoints to Answer pages). Missing keys render tone "unknown" with "check HOA portal" note. School chip: next upcoming event where `source = "wilson_weekly"` (query events) — value like "Aug 25 · Early release".
- [ ] Admin page `/admin/board`: form per chip (value, note, tone select, link) calling `setBoardStatus`; follows existing admin page patterns (see `src/app/admin/announcements/page.tsx`).
- [ ] Seed initial values via the admin UI after deploy (pool: Open / trash: pickup day pending user confirmation / water: "Stage 2" alert, note "$500+ fines" / roads: "DNT 4A paving" / school: auto).
- [ ] Build passes; commit: `git commit -m "feat: The Board utility strip + admin control"`

### Task 7: Front-page homepage
**Files:** Modify `src/app/page.tsx`; Create `src/components/home/LeadStory.tsx`, `src/components/home/TheWire.tsx`, `src/components/home/AroundTheNeighborhood.tsx`, `src/components/home/DigestBand.tsx`; Modify `src/components/events/WeekEventList.tsx` (restyle only); Delete `src/components/home/HeroSection.tsx`, `CommunityStatsBar.tsx`, `QuickLinks.tsx`, `NeighborSpotlight.tsx`, `NewsGrid.tsx` (keep spotlight image asset reference in new-here page).

- [ ] Page order per spec §4: `<TheBoard/>` → `<LeadStory/>` → This Week (`WeekEventList` limited 6, restyled with hairlines) → Answers teaser (Phase 2 — no visible stub until then) → `<TheWire/>` → `<AroundTheNeighborhood/>` → `<DigestBand/>`. Keep `export const revalidate = 900`.
- [ ] `LeadStory`: `getFeaturedArticle()`; section label, huge Newsreader headline (`.headline-xl`), dek (summary), dateline, image (Next Image, blob host already allowed). Whole block links to the article the same way NewsGrid did — reuse its link target logic.
- [ ] `TheWire`: latest 4-6 published articles excluding the lead; compact hairline-separated rows: section label + headline + relative date. Links to `/news`.
- [ ] `AroundTheNeighborhood`: two columns (stack on mobile): newest 3 listings + newest 3 vendors (reuse existing data actions/cards); headers link to `/classifieds` and `/directory`.
- [ ] `DigestBand`: client component; accent-background band, "The Thursday Dispatch — one email a week: events, answers, listings, and the lead story. No spam, unsubscribe anytime."; email input + submit calling `subscribe()`; success state "You're on the list." Inline error on invalid email.
- [ ] Build passes; verify homepage locally (dev server, mobile viewport); commit: `git commit -m "feat: front-page homepage (lead story, wire, board, digest band)"`

### Task 8: Route renames, merges, redirects
**Files:** Create `src/app/classifieds/page.tsx`, `src/app/directory/page.tsx`, `src/app/new-here/page.tsx`; Delete `src/app/buy-sell-trade/`, `src/app/lost-found/`, `src/app/vendors/`, `src/app/carpool/`, `src/app/newcomer-guide/`, `src/app/live-here/`, `src/app/get-help/`, `src/app/stay-informed/`, `src/app/community/`, `src/app/connect/` (after content redistribution); Modify `next.config.ts`, `src/data/navigation.ts` footerLinks, `src/components/layout/Footer.tsx`

- [ ] `/classifieds`: tabbed page (searchParams `?tab=lost-found`) — tab 1 "For Sale & Trade" renders existing marketplace grid/search/form components; tab 2 "Lost & Found" renders existing lost-found components. Posting gates unchanged.
- [ ] `/directory`: existing vendors page content, retitled "Directory", plus a static "Groups & Rides" card section listing the Facebook group, BST group, and carpool pointer (replaces carpool feature; content from old carpool/connect pages).
- [ ] `/new-here`: merge newcomer-guide narrative + community page's SchoolInfo, AmenitiesGrid, UtilityGuide, NearbyAttractions, HoaDocs sections (import the existing components — they move, not rewrite). Include the Dan Christie spotlight image.
- [ ] `next.config.ts` permanent redirects:

```ts
async redirects() {
  return [
    { source: "/buy-sell-trade", destination: "/classifieds", permanent: true },
    { source: "/lost-found", destination: "/classifieds?tab=lost-found", permanent: true },
    { source: "/vendors", destination: "/directory", permanent: true },
    { source: "/carpool", destination: "/directory", permanent: true },
    { source: "/newcomer-guide", destination: "/new-here", permanent: true },
    { source: "/live-here", destination: "/new-here", permanent: true },
    { source: "/community", destination: "/new-here", permanent: true },
    { source: "/connect", destination: "/directory", permanent: true },
    { source: "/get-help", destination: "/new-here", permanent: true },   // repoint to /answers in Phase 2
    { source: "/stay-informed", destination: "/news", permanent: true },
  ];
}
```

- [ ] Footer: add disclaimer line "An independent, resident-run site. Not affiliated with the HOA, Essex Association Management, or Centurion American." + official HOA portal link; update footerLinks for removed routes (`/community#documents` → `/new-here#documents`).
- [ ] Check all internal links to deleted routes: `grep -rn "buy-sell-trade\|lost-found\|/vendors\|/carpool\|newcomer-guide\|live-here\|get-help\|stay-informed\|/community\|/connect" src/` and fix each hit.
- [ ] Build passes. Verify redirects after deploy: `for r in buy-sell-trade lost-found vendors carpool newcomer-guide live-here get-help stay-informed community connect; do curl -s -o /dev/null -w "$r %{http_code} %{redirect_url}\n" https://sutton-fields.vercel.app/$r; done` → all 301/308 to new homes.
- [ ] Commit: `git commit -m "feat: new IA - classifieds, directory, new-here + 301 redirects"`

### Task 9: Ship Phase 1
- [ ] `git push origin main`; wait for deploy; smoke: homepage 200 + new sections render, redirects verified (Task 8 loop), `/admin/board` seed values set, mobile viewport check via Playwright browser tools.
- [ ] Update `src/app/sitemap.ts` and metadata titles for renamed routes if referenced.

---

## Phase 2 — Answers System

### Task 10: Schema — answers, road_projects
**Files:** Modify `src/db/schema.ts`

- [ ] 

```ts
export const answers = pgTable("answers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),            // markdown
  category: text("category").notNull(),        // money|schools|roads|hoa|living
  sources: text("sources").notNull().default("[]"), // JSON [{title,url,date}]
  last_verified_at: timestamp("last_verified_at").defaultNow().notNull(),
  is_published: boolean("is_published").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const road_projects = pgTable("road_projects", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  status: text("status").notNull(),      // e.g. "Under construction"
  eta_text: text("eta_text").notNull(),  // e.g. "Opens late 2027"
  detail: text("detail"),
  source_url: text("source_url"),
  sort: integer("sort").default(0).notNull(),
  last_updated: timestamp("last_updated").defaultNow().notNull(),
});
```

- [ ] Push schema; commit.

### Task 11: Answers actions + admin CRUD
**Files:** Create `src/actions/answers.ts`, `src/app/admin/answers/page.tsx` (+ edit form component), `src/actions/roads.ts`, admin roads controls

- [ ] Actions: `getPublishedAnswers(category?)`, `getAnswerBySlug(slug)`, `getAllAnswersForAdmin()`, `createAnswer`, `updateAnswer` (bumps `last_verified_at` only when a `verified` checkbox is passed), `togglePublishAnswer`, `deleteAnswer`; roads: `getRoadProjects()`, `upsertRoadProject`, `deleteRoadProject` (all writes requireAdmin).
- [ ] Markdown rendering: admin-authored content only, but still no raw-HTML pass-through — implement a minimal renderer supporting headings/lists/links/bold/italic that ESCAPES all HTML in the source text before applying markdown transforms. No arbitrary HTML ever reaches the page.
- [ ] Admin page mirrors `/admin/events` patterns: list + create/edit form (question, slug auto from question, category select, markdown textarea, sources repeater rows title/url/date, publish toggle, "mark verified today" checkbox).
- [ ] Build passes; commit.

### Task 12: Public Answers pages + roads tracker
**Files:** Create `src/app/answers/page.tsx`, `src/app/answers/[slug]/page.tsx`, `src/components/answers/AnswerCard.tsx`, `src/components/answers/RoadTracker.tsx`; Modify homepage (Answers teaser section), `src/data/navigation.ts` (add Answers), `next.config.ts` (`/get-help` → `/answers`), `src/app/sitemap.ts`

- [ ] Index page: category-grouped answer cards (question + LastVerified badge + category section label). `export const revalidate = 3600`.
- [ ] Detail page: question as headline, LastVerified badge, rendered markdown, sources list ("Sources" hairline section with dated external links), "Spotted something outdated?" contact line. `generateMetadata` from question. FAQ structured-data JSON-LD per page.
- [ ] Roads tracker: the `when-does-the-traffic-get-fixed` detail page additionally renders `<RoadTracker/>` — table of road_projects rows: name, status pill, ETA, last-updated, source link (detail page checks slug and includes the component).
- [ ] Homepage Answers section: 3-4 latest-verified published answers as cards.
- [ ] Board chips repoint: pool → `/answers/pool-hours-and-amenity-center-2`, trash → `/answers/trash-recycling-bulk-pickup`, water → `/answers/watering-rules-vs-hoa-enforcement`, roads → `/answers/when-does-the-traffic-get-fixed`.
- [ ] Build passes; commit.

### Task 13: Verify school assignments, then seed all 14 answers + road projects
**Files:** `scripts/seed-answers.ts` (run with dotenv, then deleted) or admin UI

- [ ] **Verification gate:** confirm Sutton Fields 2026-27 assignments against official Prosper ISD sources (prosper-isd.net/page/attendance-boundaries or district boundary lookup): expected Dan Christie ES → Moseley MS → Richland HS. If unconfirmable, the schools answer states the builder-listed assignment AND the verification path, clearly labeled.
- [ ] Write and publish the 14 answers from spec §6, fully candid, every claim sourced from `docs/superpowers/research/` reports (each 300-600 words markdown, 2-6 dated sources). Slugs: `whats-my-real-tax-rate`, `how-do-i-protest-my-appraisal`, `which-schools-serve-sutton-fields`, `will-we-get-rezoned`, `when-does-the-traffic-get-fixed`, `how-do-i-reach-essex`, `acc-approval-process`, `can-i-rent-my-house-out`, `watering-rules-vs-hoa-enforcement`, `trash-recycling-bulk-pickup`, `internet-providers-by-phase`, `pool-hours-and-amenity-center-2`, `aubrey-or-celina-which-am-i-in`, `whats-being-built-around-us`.
- [ ] Seed road_projects: DNT Phase 4A (opens late 2027, ntta.org) · DNT 4B (unscheduled) · FM 1385 widening (~2032, txdot) · FM 428 realign/widen (design, keepitmovingdallas) · US 380 Denton widening (wrap ~Apr 2026, Community Impact) · Legacy Dr (design to ~2028, CI 2026-05-18) · CR 52 (Feb–Nov 2026, CI) · Collin County Outer Loop 3C (opened 2025-11-07, CI).
- [ ] Also fix stale school data in `src/data/community.ts` (used by SchoolInfo on /new-here) to match verified assignments, and correct other stale facts surfaced by research wherever they appear in `src/data/`: builder roster (First Texas, Bloomfield, D.R. Horton, M/I, Mattamy, Pacesetter, Sandlin, Stonehollow, Lennar; Beazer early phases), ~2,350-home buildout figure, HOA manager = Essex Association Management, amenity list (no verified dog park).
- [ ] Ship Phase 2: push, deploy, spot-check three answer pages + tracker on prod.

### Task 13b: Staleness sentinel (spec §9)
**Files:** Modify `src/lib/` (new `stale-answers.ts`), `src/app/api/cron/nightly/route.ts`

- [ ] `checkStaleAnswers()`: select published answers with `last_verified_at` older than 90 days; for each, log to the nightly cron result JSON (`{staleAnswers: [{slug, lastVerified}]}`) and surface them in `/admin/answers` with a "needs re-verification" badge (query in the admin page, no extra table).
- [ ] Wire into the nightly route as a fourth independent try/catch job. Build passes; commit.

---

## Phase 3 — Directory Promotion

### Task 14: Endorsements
**Files:** Modify `src/db/schema.ts`, vendor actions, `src/components/vendors/VendorCard.tsx`, `/directory` page

- [ ] Add `vendor_endorsements` table (id, vendor_id, profile_id, created_at, unique(vendor_id, profile_id)); "Recommend" button for verified residents; card shows "Recommended by N verified residents" + most-recent date; category filter chips on /directory.
- [ ] Build, push, verify. Commit per step.

---

## Phase 4 — The Thursday Dispatch

### Task 15: Schema + Resend setup
**Files:** Modify `src/db/schema.ts`; env (`RESEND_API_KEY`, `DISPATCH_FROM` e.g. "The Thursday Dispatch <dispatch@suttonfields.info>")

- [ ] `dispatch_issues` table: id, subject, html, sent_at (nullable timestamp), recipient_count int default 0, failure_count int default 0, created_at. Push schema.
- [ ] User action required: create Resend account, verify suttonfields.info domain (DNS records in Cloudflare), provide API key. `npm install resend`.

### Task 16: Assembly + send
**Files:** Create `src/lib/dispatch.ts`, `src/app/api/cron/dispatch/route.ts` (`export const maxDuration = 60`), `src/app/dispatch/page.tsx` (archive index), `src/app/dispatch/[id]/page.tsx` (issue view), unsubscribe route `src/app/unsubscribe/[token]/page.tsx`, `/admin/dispatch` (test-send button, subscriber count, preview); Modify `vercel.json` (add cron `0 23 * * 4` ≈ Thu 6pm CT)

- [ ] `assembleDispatch()`: query last 7 days — lead article, next-7-day events, new/updated published answers, new listings, new lost-found, new vendors, board snapshot; render email-safe HTML (inline styles, table layout, 600px, paper/ink/accent styling, Georgia serif fallback). **XSS guard: every dynamic value (titles, names, notes — anything not authored by this code) passes through an `esc()` HTML-entity escaper during assembly. The snapshot is safe-by-construction; no sanitizer needed downstream because no unescaped user content ever enters the HTML.** Per-subscriber unsubscribe link via `{{UNSUB_URL}}` placeholder substitution at send time.
- [ ] `sendDispatch()`: idempotency — create issue row (with html snapshot) first; skip entirely if an issue was already sent within the past 6 days; fetch active subscribers; Resend batch API in chunks of 50; per-recipient failures logged and counted, never abort remaining chunks; update issue row counts + sent_at.
- [ ] Cron route: CRON_SECRET check (same pattern as nightly), calls `sendDispatch()`, returns counts. Archive pages render the stored snapshot (raw-HTML render of our escape-by-construction snapshot) with `{{UNSUB_URL}}` replaced by `/`.
- [ ] Admin test-send: `sendDispatch({testTo: address})` variant — sends only to that address, creates NO issue row.
- [ ] Verify: test-send to user's inbox → **user approves visual** → enable cron via vercel.json push. After first real Thursday send, check issue row counts.

---

## Phase 5 — Tipline

### Task 17: Screenshot ingestion
**Files:** Create `src/app/admin/tipline/page.tsx`, `src/lib/vision-extract.ts` (refactor shared helpers out of `src/lib/wilson-weekly.ts`: `fetchImageAsDataUri`, image-batch extraction); tipline server action

- [ ] Admin page: multi-image upload (client `upload()` to Blob via existing `/api/blob/upload` token route) → server action takes blob URLs → data URIs → vision extraction returns `{events: [...], news: [{title, body, category}]}` → events inserted through the existing dedup path (plausible-date guard, `has_time` rules) as unpublished; news inserted as unpublished articles. Publishing stays in existing admin flows.
- [ ] Show extraction results inline for immediate review. `maxDuration = 60` where needed.
- [ ] Build, push, verify with a real FB screenshot from the user.

---

## Phase 6 — Polish & SEO

### Task 18: Metadata, structured data, mobile pass
- [ ] Per-page `generateMetadata` for classifieds/directory/new-here/answers/dispatch; refresh `src/app/sitemap.ts` with new routes + answer slugs; verify FAQ JSON-LD on answers.
- [ ] Playwright pass: homepage, one answer, dispatch archive, classifieds — mobile 390px + desktop; fix overflow/wrap issues.
- [ ] Update root layout metadata description to editorial positioning.
- [ ] Full-site link check over sitemap URLs → zero 404s.

---

## Execution notes
- Commit after every task minimum; push at phase boundaries (user-approved direct-to-main flow).
- `DATABASE_URL` must be restored to `.env.local` before Tasks 3/10/13/15 local schema pushes — ask user at Phase 1 start.
- Trash pickup day for Sutton Fields unconfirmed by research — ask user (they live there) when seeding The Board.
- Never ship a visible stub/empty section; sections appear only when their phase lands.
