# Research: Stickiness for Neighborhood/HOA Community Sites

Compiled 2026-08-12 by research agent. Source material for the editorial redesign
(`docs/superpowers/specs/2026-08-12-editorial-redesign-design.md`).

====================================================================
(A) FEATURE PATTERNS RANKED BY EVIDENCE OF REAL ENGAGEMENT
====================================================================

TIER 1 — Strong direct evidence of habitual return

1. THE DAILY/REGULAR EMAIL DIGEST (strongest single mechanic found anywhere)
- Front Porch Forum (frontporchforum.com) is the canonical proof: ~235,000 active members in a state with ~270,000 households — near-universal penetration in covered towns. Mechanic: neighbor posts are batched into ONE moderated daily "issue" delivered by email (also app/web). Not a feed, not algorithmic, not real-time. ~50% of members actively post in a typical year. Center for Media Engagement study (mediaengagement.org/research/front-porch-forum-civic-engagement/, ~11,500 survey completions): 81% say FPF makes them a more informed citizen vs 26% for Facebook and 32% for Nextdoor users; daily use correlates with increased trust in neighbors and civic participation.
- Key properties that make it work: (a) scarcity — one email/day creates an appointment, no FOMO-checking needed; (b) human-scale unit (500–1,000 households per forum — Sutton Fields at ~2,000 homes is exactly this scale); (c) real names + verified addresses; (d) every post pre-moderated, so tone stays civil and the digest is safe to open; (e) content is overwhelmingly practical: lost pets, plumber recommendations, borrow-a-tool, school budget, block parties.
- Hyperlocal newsletter benchmarks generally: ~55% open rate, ~12% CTR (Letterhead/INMA); Tamedia's automated municipal newsletters reach up to 40% of inhabitants; Patch's AI newsletters scaled to ~1M subscribers on daily/twice-weekly cadence. Email digest is the highest-evidence retention channel for local content, beating both push and expecting site visits.

2. AI-ASSISTED HYPERLOCAL NEWS AS "UTILITY, NOT JOURNALISM"
- Patch's PatchAM (cjr.org/feature/hyperlocal-ai-patch-newsletter-million-subscribers.php): AI newsletters in 14,000 communities, ~1M subscribers, profitable. Content mix: aggregated local news + automated event calendars + Nextdoor posts + light UGC (pet photos, riddles). Deliberately AVOIDS divisive topics (local politics) and leans on broadly relevant items (festivals, closures, openings). Failure modes to avoid: wrong-location stories ("wrong Springfield" complaints weekly) and readers detecting/disliking obviously-AI prose (Reuters Institute finding). Lesson: AI news works when framed as a utility briefing, with human spot-checking of geography/facts and a human voice pass.

3. UTILITY DATA PEOPLE RE-CHECK (the "glance features")
- Across HOA platforms (TownSq, hoastart.com, alosant.com, membersplash.com), the features residents actually use repeatedly are: amenity/pool status and booking, pool HOURS, event calendar, trash/recycling schedule + reminders, document lookup, payment, and maintenance-request status. Amenity reservation with automated reminders is consistently cited as the top repeat-use feature in HOA software. Anthem AZ (onlineatanthem.com) puts calendar + "Notify Me" subscription alerts front and center. Mueller's resources page links pool hours and farmers-market schedule as first-class items.
- Pattern: each utility is small, but a homepage that answers "is the pool open, what's happening this week, when is bulk trash" becomes a weekly reflex even for residents who never post.

4. EVENTS CALENDAR WITH SUBSCRIPTION/REMINDERS
- Universally present in every successful example (Mueller, Anthem, Daybreak's LiveDAYBREAK program, Nextdoor's newer local events calendar). The differentiator vs Facebook: filterable, forward-looking, subscribable (ICS/Google Calendar), and permanent. Facebook events get buried in the feed within a day or two.

5. VENDOR/BUSINESS RECOMMENDATIONS AS A STRUCTURED DIRECTORY
- Local business/service recommendations are one of Nextdoor's most-used features and the single most common recurring question type in neighborhood Facebook groups ("anyone know a good plumber?" gets re-asked monthly because FB search is terrible). A structured, ratable, searchable directory converts Facebook's most repetitive content into the website's most durable asset. Should be a hero feature, seeded from Facebook threads.

TIER 2 — Present in successful sites, moderate evidence

6. MARKETPLACE / CLASSIFIEDS — high engagement on Facebook (Mueller has a dedicated "Mueller Marketplace" FB group) and on Nextdoor's For Sale & Free. Works on an independent site mainly when paired with digest inclusion ("new listings this week"); standalone it loses to Facebook Marketplace's liquidity.
7. NEWCOMER GUIDE / "living here" canonical answers — the SEO and buyer-facing asset. Prospective buyers Google the neighborhood; Facebook groups are invisible to them.
8. POLLS AND SINGLE-QUESTION FEEDBACK — TownSq highlights lightweight polls as a top engagement feature; low effort, gives lurkers a participation on-ramp.
9. PHOTO SUBMISSIONS / RESIDENT SPOTLIGHTS — Anthem solicits resident photos; Patch uses pet photos. Cheap recurring UGC that humanizes the digest.
10. GROUPS/CLUBS DIRECTORY (not hosted discussion — a directory of where the clubs live, including FB subgroups). Mueller's model: the neighborhood association site LISTS all the Facebook groups rather than competing with them.

TIER 3 — Weak evidence of engagement on independent sites
- Hosted discussion forums (resident forums on independent sites are consistently ghost towns when a FB group exists), resident directories (privacy friction), carpool boards (chicken-and-egg liquidity problem — works better as a digest callout than a standing feature).

====================================================================
(B) ANTI-PATTERNS / WHAT KILLS THESE SITES
====================================================================

1. THE SINGLE-WEBMASTER / STALE-CONTENT DEATH SPIRAL. Most neighborhood association sites die because one volunteer owns everything; volunteer burnout and retention failure are endemic (VolunTie/Community Matters survey: 60% of neighborhood associations struggle with member retention, 45% cite poor organization). A homepage with a 9-month-old "news" item signals death and kills return visits permanently. Mitigation seen in survivors: automated/ingested content (Patch's fully automated model; Tamedia's automated municipal newsletters) so the site stays fresh with zero weekly human effort.

2. COMPETING WITH FACEBOOK FOR CONVERSATION. Every source agrees Facebook wins real-time chatter: instant visibility, existing habit, notification infrastructure. Sites that launch "our own forum to replace the Facebook group" fail. Successful independents (Mueller Neighborhood Association) explicitly cede conversation to FB and link out to the FB groups from their own site.

3. NO REASON TO RETURN AFTER THE FIRST VISIT. FeverBee's community-stickiness research: communities that only satisfy an immediate need ("get answer, leave") never form habits; habit requires recurring fresh content plus reminders until the habit forms. A static brochure site is visited once per resident, ever.

4. LOGIN WALLS ON EVERYTHING. HOA portals get logins only when residents must pay dues or book amenities — grudging transactional use, not affection. Gating utility content (pool hours, events, news) behind auth kills casual weekly visits and all SEO. Gate only what needs gating (marketplace posting, directory contact info).

5. NOTIFICATION OVERLOAD. Nextdoor itself admitted to intentionally REDUCING email/notification volume to improve engagement quality after softness in weekly actives. Over-mailing burns the list; the FPF model (one predictable digest) is the disciplined alternative.

6. UNMODERATED OR OVER-TOXIC UGC. Both neglect and toxicity destroy trust. FPF's pre-moderation of every post is the reason its digest is safe to open. Any resident-generated content on an unofficial site needs a stated, visible moderation model — especially one that avoids the crime-paranoia/politics spiral that made Nextdoor's reputation.

7. WRONG-LOCATION / OBVIOUSLY-AI CONTENT. Patch's top complaint category. For AI-drafted news: verify geography, keep a consistent human editorial voice, disclose lightly, and avoid AI-summarizing divisive local disputes.

8. PLATFORM DEPENDENCE (the reverse risk). Facebook groups die when the admin leaves or Meta changes rules — years of history gone overnight. This is the website's core pitch: it is the community's permanent record.

====================================================================
(C) NAMED EXAMPLES AND WHAT TO STEAL
====================================================================

1. Front Porch Forum — https://frontporchforum.com
Steal: the single moderated daily/weekly email digest as THE product (site is the archive, email is the habit); real-name + verified-address posting; practical post categories (recommendations, lost & found, giveaways, events); calm, non-algorithmic presentation; pre-moderation. Sutton Fields already has address verification via Clerk — the missing piece is the digest.

2. Patch / PatchAM — https://patch.com (analysis: https://www.cjr.org/feature/hyperlocal-ai-patch-newsletter-million-subscribers.php)
Steal: AI-drafted local briefing as a utility (aggregation + auto event calendar + light UGC); daily-or-twice-weekly cadence; avoidance of divisive topics. Cautionary: fact/geo-check the AI, keep human voice.

3. Mueller Neighborhood Association (Austin) — https://www.muellerneighborhood.org
Steal: the coexistence architecture for an unofficial site living alongside an official POA portal AND active Facebook groups — exactly Sutton Fields' situation. MNA's Resources page is the canonical index OF the ecosystem: it lists the POA's weekly email, the magazine, ALL the Facebook groups (Marketplace, Parents, Food Exchange), pool hours, business directory, governance explainers, school/government links. The unofficial site wins by being the map, not another territory. Also steal: monthly email newsletter, mini-grants/community-partners programs as recurring content.

4. Anthem Community Council (AZ) — https://www.onlineatanthem.com
Steal: utility-forward homepage for a large master-planned community — calendar with "Notify Me" subscription alerts per category, amenity/facility status and rentals, resident photo submissions. Weakness to avoid: institutional blandness.

5. Daybreak, UT — https://www.mydaybreak.com / https://www.daybreakutah.com/community-association/
Steal: "LiveDAYBREAK" — branding the events/lifestyle programming as a named program with pillars; strong visual identity; separation of lifestyle content from HOA administration.

6. TownSq — https://www.townsq.io (category reference for HOA platforms)
Steal the feature hierarchy residents actually use: announcements with delivery tracking, amenity booking with reminders, single-question polls, document search. Note: these platforms achieve transactional usage, not affection.

====================================================================
(D) RECOMMENDATIONS FOR COEXISTING WITH AN ACTIVE FACEBOOK GROUP
====================================================================

Strategic frame: Facebook owns the CONVERSATION (real-time, high-liquidity, habitual). The website should own MEMORY, STRUCTURE, and RHYTHM — everything Facebook is structurally bad at: search, permanence, structured/filterable data, canonical answers, SEO visibility to outsiders, calendars, and a predictable digest. Do not build chat/forums. Position as "the neighborhood's reference desk and weekly briefing."

Concrete moves, in priority order:

1. SHIP THE WEEKLY DIGEST EMAIL. The single highest-leverage addition. One predictable send (e.g., Thursday evening): this week's events, new marketplace listings, lost & found, new vendor recommendations, one AI news brief, pool/amenity notes, one resident photo. FPF proves the digest IS the product. Weekly (not daily) fits a 2,000-home community and an automated pipeline; benchmarks say 50%+ opens are achievable at this hyperlocal level.

2. BECOME THE CANONICAL-ANSWER LAYER FOR THE FACEBOOK GROUP. Mine the FB group's perennially re-asked questions (trash day, pool hours, gate/amenity rules, "good plumber?", school boundaries, HOA contact, bulk pickup, what's that construction) into permanent, dated, searchable answer pages. Explicit goal: when the question recurs on Facebook, a neighbor pastes the suttonfields.info link. That loop — FB thread → site link → FB thread — is how the unofficial site earns traffic FROM Facebook instead of competing with it. Each answer page shows "last verified" date to fight staleness perception.

3. MAKE THE VENDOR DIRECTORY THE FLAGSHIP STRUCTURED-DATA ASSET. Seed it by harvesting historical FB recommendation threads (with permission/attribution), let verified residents add/endorse, show endorsement counts and dates. FB search cannot answer "top-recommended AC company in Sutton Fields," the site can, permanently.

4. UTILITY GLANCE BAR ON THE HOMEPAGE. Top-of-page, no login: pool/splash-pad status and hours, this week's trash/recycling/bulk day (Celina schedule), next 3 events, active road closures/construction notes, weather-triggered notes (freeze warnings for sprinklers — seasonal Texas content). Small, automatable, habit-forming.

5. SUBSCRIBABLE CALENDAR. ICS/Google Calendar feed of community + school + city-of-Celina events. Facebook cannot do a forward-looking, filterable, subscribable calendar; this is a pure structural win.

6. KEEP THE READ SIDE OPEN, GATE THE WRITE SIDE. No login to read news, events, guide, directory, pool status (preserves SEO + casual habit). Clerk-verified residency required to post marketplace/lost-and-found items, contact sellers, or endorse vendors — verification becomes the trust differentiator vs Nextdoor/FB, per the FPF real-name model.

7. AUTOMATE FRESHNESS, HUMANIZE THE VOICE. The AI news + auto-ingested events pipeline is the correct anti-staleness architecture (Patch/Tamedia proof). Add: human review for geography/facts, a consistent editorial persona for the digest, and hard avoidance of AI coverage of divisive intra-neighborhood disputes. Show timestamps everywhere; a visibly-fresh site is the credibility signal.

8. SEO + NEWCOMER FUNNEL AS THE OUTWARD FACE. Prospective buyers and new residents Google "Sutton Fields Celina" and cannot see the FB group. The newcomer guide, amenity pages, and vendor directory should be structured for that search intent. New residents onboarded via the site then join the FB group — the site becomes the front door of the ecosystem.

9. VISUAL IDENTITY: commit to a real neighborhood brand. Homepage pattern: mobile-first UTILITY DASHBOARD above the fold (glance bar + this week), MAGAZINE below (news/features) — pure magazine layouts scale poorly on mobile, and the audience arrives on phones from Facebook links. Named programming reads warmer than HOA-portal institutionalism.

10. SUCCESSION/ANTI-BUS-FACTOR: document the pipelines, use managed automation, and recruit at least one co-editor. The number-one killer of unofficial community sites is the single-owner burnout spiral; automation covers weeks of neglect, but a named backup owner covers years.

Key sources: frontporchforum.com; mediaengagement.org/research/front-porch-forum-civic-engagement/; sevendaysvt.com (FPF study coverage); cjr.org/feature/hyperlocal-ai-patch-newsletter-million-subscribers.php; muellerneighborhood.org/resources; onlineatanthem.com; mydaybreak.com; townsq.io; hoastart.com; connectneighbors.com/blog/facebook-group-marketing-vs-local-seo; peepso.com/facebook-groups-vs-private-community-websites; feverbee.com/habit; blog.tryletterhead.com; inma.org (Tamedia automated hyperlocal newsletters); blog.voluntie.com; pixelparlor.com/approach/neighborhood-branding; overmatter.design.
