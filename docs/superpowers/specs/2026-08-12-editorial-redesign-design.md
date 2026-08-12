# Sutton Fields Editorial Redesign — Design Spec

**Date:** 2026-08-12
**Status:** Approved design, pending implementation plan
**Approach:** "The neighborhood gets its own paper" — rebuild suttonfields.info's identity as an independent hyperlocal news product for Sutton Fields (Celina, TX), backed by a canonical-answers library and an automated weekly email digest.

## 1. Why (research summary)

Three research streams (public forum listening, local-area fact gathering, community-site engagement patterns) produced a consistent picture:

- **Facebook owns the conversation.** The private "Sutton Fields Residents" group (3,073 members, ~375 posts/month) is where real-time chatter lives. Sites that compete with an active FB group for conversation die. Successful independent community sites own what Facebook is structurally bad at: **search, permanence, structured data, canonical answers, calendars, SEO, and a predictable rhythm.**
- **The highest-evidence stickiness mechanic is a weekly email digest** (Front Porch Forum model: one moderated weekly email is the product; the site is the archive). Utility "glance" features (pool status, trash day, road status) build the return habit.
- **Residents' most-asked questions have no canonical public answers**: real tax rate (PID/TIRZ), current school assignments (Prosper ISD rezones nearly yearly), road construction timelines (FM 1385 not done until ~2032; DNT Phase 4A opens late 2027), new amenity center opening (under construction at 5512 Liverpool), HOA operations (Essex Association Management, BBB 1.0/5; leasing cap MET; ACC $25 fee; Vantaca portal migration July 2026), builder track records, watering rules vs. HOA lawn enforcement, retail openings (Costco Celina opens 2026-08-26; H-E-B Legacy Hills targeted Q4 2027).
- **The #1 killer of community sites is visible staleness** from single-owner burnout. Mitigation: automated content pipelines (already exist here) + visible "last verified" dates + a staleness sentinel.

## 2. Locked decisions

| Decision | Choice |
|---|---|
| Weekly email digest | **Yes** — fully automated, branded *The Thursday Dispatch* |
| Editorial tone | **Fully candid** — resident-advocate voice; name problems plainly; every claim sourced |
| Visual direction | **Bold editorial** — hyperlocal news brand; typography-led, high-contrast |
| Approach | **A** — full editorial reframe (front-page homepage, content-type navigation, Answers flagship) |

## 3. Brand & design language

- **Masthead:** big confident "SUTTON FIELDS" wordmark. Tagline: *"The unofficial record of Sutton Fields — Celina, Texas."* "Unofficial" is both legal clarity and editorial charm.
- **Typography:** high-contrast display serif for headlines (Fraunces or Newsreader via next/font), clean sans for body/UI. Newspaper-scale headline sizing; the lead story headline is the biggest element on the page.
- **Palette:** near-black ink on warm off-white paper; one signal accent (Texas-sunset red-orange) for section labels, live-status chips, links. Section color coding: each nav section has a consistent label color used on its cards.
- **Texture:** hairline rules between sections, dateline stamps ("CELINA, TX — AUG 12"), "LAST VERIFIED" badges. Dark mode supported.
- **Mobile-first:** most traffic arrives from Facebook links on phones.

## 4. Homepage (front page), top to bottom

1. **Masthead row** — wordmark, today's date, "Get the Thursday Dispatch" button. Existing announcements bar sits above the masthead when active.
2. **The Board** — horizontally scrollable utility chip strip: Pool (open/closed + note) · Trash day (+ next bulk Clean Sweep) · Water restriction stage · Roads (one-line status) · Next school date. Each chip links to its Answer page. Chips render "status unknown — check HOA portal" when unset; never show stale data as current.
3. **Lead story** — one big headline + image. Editorially chosen in admin; falls back to most recent published article. (Launch candidate: Project Tomahawk data center, FM 1385 & Parvin Rd, P&Z hearing 2026-08-18.)
4. **This Week** — next 5-6 events from the existing events pipeline.
5. **Answers** — 3-4 cards from the Answers library, surfaced by recency/season.
6. **The Wire** — latest short local-news items from the existing AI news scanner.
7. **Around the Neighborhood** — newest classifieds + newest vendor recommendations in one strip.
8. **Digest band** — email signup, one-line pitch, "see last week's issue" link.
9. **Footer** — unofficial-site disclaimer, official HOA portal link, privacy, about.

## 5. Information architecture

**Nav (6 items):** News · Events · **Answers** · Directory · Classifieds · New Here?

| Current route | Disposition |
|---|---|
| `/news`, `/events` | Keep, restyled |
| `/buy-sell-trade`, `/lost-found` | Merge into `/classifieds` (two tabs; posting stays resident-gated). 301 redirects. |
| `/vendors` | Becomes `/directory` — flagship: categories, endorsement counts ("recommended by N verified residents"), dates. 301 redirect. |
| `/carpool` | Retired; 301 → `/directory` (carpool becomes a Directory listing pointing at the FB group thread) |
| `/live-here`, `/get-help`, `/stay-informed`, `/community`, `/connect` | Content redistributed into Answers and New Here?; 301 redirects to nearest new home |
| `/newcomer-guide` | Becomes `/new-here` — single narrative page for buyers/new residents (SEO-facing), heavily cross-linking Answers. 301 redirect. |
| `/join`, `/login`, `/admin/*`, `/dispatch` (new) | Auth and admin unchanged; Dispatch archive added |

## 6. Answers system (flagship)

DB-backed, admin-editable. Schema: `answers` — `id`, `slug`, `question`, `answer` (markdown), `category`, `sources` (json: title/url/date list), `last_verified_at`, `is_published`, timestamps.

Every public Answer page shows a prominent **"Last verified: [date]"** badge and a sources list. Candid-content rule: claims carry sources inline; opinion is framed as resident experience, never stated as fact.

**~14 seeded launch answers** (all fully written and sourced at launch, from the research):

- **Money:** What's my real tax rate? (Sutton Fields II PID, MuniCap, TIRZ credit, fixed assessments) · How do I protest my appraisal? (Denton CAD, deadlines)
- **Schools:** Which schools serve Sutton Fields in 2026-27? (**fixes stale Rushing MS/Prosper High data — verify Dan Christie ES → Moseley MS → Richland HS against the official PISD boundary map before publishing**) · Will we get rezoned? (annual rezoning history; Christie capacity overflow to Bryant ES)
- **Roads:** When does the traffic get fixed? — special **tracker page** backed by `road_projects` (DNT 4A, FM 1385, FM 428, US 380, Legacy Dr, CR 52, Collin County Outer Loop), each row: status, ETA text, last-updated, source
- **HOA:** How do I actually reach Essex? (escalation paths; BBB record linked) · ACC approval process ($25 fee) · Can I rent my house out? (leasing cap met; waitlist reality) · Watering rules vs. HOA lawn enforcement
- **Living here:** Trash/recycling/bulk (CWD, Clean Sweep dates) · Which internet providers serve my phase? · Pool hours & amenity center #2 status (5512 Liverpool) · Aubrey-vs-Celina: which county/city/CAD am I in? · What's being built around us? (Project Tomahawk data center, Yardly BTR, Legacy Hills, H-E-B, Silo Crossing)

## 7. The Thursday Dispatch (email digest)

- **Cadence:** Thursdays 6pm Central. Fully auto-assembled from the last 7 days: lead story → this week's events → new/updated Answers → new classifieds & lost/found → new vendor recommendations → one-line Board status.
- **Sending:** Resend. Free tier ≈100 emails/day covers launch; ~$20/month once subscribers pass a few hundred (admin subscriber count makes this visible in advance).
- **Signup:** single opt-in, email only (no account required — lower friction than resident verification). One-click unsubscribe in every issue.
- **Archive:** each issue snapshotted at `/dispatch/[date]` — shareable into Facebook, powers "see last week's issue."
- **Admin:** subscriber list/count, "send test issue to me," on-demand preview page rendering this week's issue.
- **Idempotency:** issue row created before sending; a retry cannot double-send to the same subscriber. Per-recipient failures logged; a failed send never blocks the archive snapshot.

## 8. Data model additions (Neon/Drizzle)

- `answers` — per §6
- `road_projects` — `name`, `status`, `eta_text`, `detail`, `source_url`, `last_updated`
- `subscribers` — `email`, `unsubscribe_token`, `created_at`, `unsubscribed_at`
- `dispatch_issues` — `sent_at`, `subject`, `html` snapshot, `recipient_count`, `failure_count`
- `board_status` — utility chips: pool (manual toggle + note), water stage (manual), trash config (static schedule + Clean Sweep dates), roads line (auto from `road_projects`), next school date (auto: next upcoming event whose source is `wilson_weekly`, falling back to a static PISD calendar config of key dates)

Existing tables (articles, events, announcements, listings, profiles, wilson_weekly_processed) unchanged.

## 9. Automation (within Vercel Hobby 2-cron cap)

- **Cron 1 (exists, nightly):** news scan, Wilson Weekly ingestion, post expiry — **extended with a staleness sentinel**: flags Answers not verified in 90+ days and drafts refresh suggestions for admin review.
- **Cron 2 (new, weekly Thursday):** assemble Dispatch → snapshot archive → send via Resend → record results.

## 10. Tipline (Facebook screenshot ingestion)

The FB group cannot be scraped (private, login-walled; scraping would violate FB ToS and the group's own privacy rule). Instead: an **admin Tipline page** — upload screenshots (FB posts, flyers, HOA letters, school notices). The existing vision pipeline (gpt-5.6-luna multi-image extraction, built for Wilson Weekly) extracts:
- events → events pipeline (drafted, same dedup rules as Wilson Weekly)
- news/announcements → news drafts awaiting admin approval

No new infrastructure — a new entry point to existing pipelines. Admin-only at launch (resident submissions are a possible later phase, not in scope).

## 11. Rollout phases (each ships independently)

1. **Brand system + homepage + nav** — tokens/typography/palette, new homepage with The Board (chips manually populated at first), new nav, all 301 redirects. Site visibly transforms on day one.
2. **Answers system** — schema, admin CRUD, public pages, roads tracker, all ~14 seeded answers written and sourced (school fix verified first).
3. **Classifieds merge + Directory promotion** — merge marketplace/lost-found, endorsement counts and category browsing on Directory, carpool retired.
4. **The Thursday Dispatch** — signup, assembly, archive, Resend, admin test-send. First real issue only after user approves a test issue in their inbox.
5. **Tipline** — admin screenshot upload → vision extraction → drafts.
6. **Polish & SEO** — per-page metadata, sitemap refresh, FAQ structured data on Answers, Playwright mobile-viewport pass.

**Content corrections rolled into launch:** school assignments (pending official-map verification), builder roster accuracy (First Texas, Bloomfield, D.R. Horton, M/I, Mattamy, Pacesetter, Sandlin, Stonehollow, Lennar, Beazer early phases; Taylor Morrison = adjacent Yardly BTR), HOA manager named correctly (Essex Association Management), ~2,350-home buildout figure, current amenity list (two pools, splash pad, lap pool, cabanas, fitness room, community gardens, tennis, trails; no verified dog park inside Sutton Fields).

## 12. Guardrails & testing

- Every Answer/news item displays its date; staleness sentinel enforces freshness review.
- Board chips degrade gracefully when unset.
- Candid-content rule (§6) applies to all published copy.
- Read side stays public (SEO + casual habit); write side stays resident-gated (classifieds posting, directory endorsements).
- **Testing per phase:** `npm run build` passes; redirect map verified with curl; digest HTML test-sent to Gmail/Apple Mail; Playwright smoke pass (mobile + desktop) on homepage, one Answer page, and the Dispatch archive before each phase ships.

## 13. Out of scope

Hosted discussion forums (cede conversation to Facebook), resident-to-resident messaging, carpool as a standing feature, resident-submitted tips (later phase), payments/dues (official HOA portal's job), native app/push notifications.
