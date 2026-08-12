// One-off seeder for the Answers library + road tracker. Run with:
//   npx dotenv -e .env.local -- npx tsx scripts/seed-answers.ts
// Idempotent: skips any answer slug / road project name that already exists.
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

interface Seed {
  slug: string;
  question: string;
  category: "money" | "schools" | "roads" | "hoa" | "living";
  answer: string; // markdown
  sources: { title: string; url: string; date: string }[];
}

const SEEDS: Seed[] = [
  {
    slug: "whats-my-real-tax-rate",
    question: "What's my real tax rate in Sutton Fields (and what is this PID)?",
    category: "money",
    answer: `If you only looked at the city tax rate before buying here, you got an incomplete picture. Here's the full stack.

## The PID, in plain English

Most of Sutton Fields sits inside the **Sutton Fields II Public Improvement District (PID)**, created by City of Celina Resolution 2015-51R. A PID is how the developer financed streets, water, sewer, and parks: the city sold bonds, and each lot repays its share through an **annual assessment that shows up on your property tax bill**.

Three things make a PID different from the MUDs you may have heard horror stories about:

- **The assessment is fixed once the bonds are sold.** Your payoff schedule was known at closing — it doesn't float with your appraised value the way a MUD tax does.
- **It's prepayable.** You can pay off your lot's remaining assessment in a lump sum and be done with it.
- **A TIRZ credit offsets part of it.** A slice of the city taxes generated inside the district is rebated back, reducing the following year's installment.

The PID is administered by **MuniCap, Inc.** — (469) 490-2800, txpid@municap.com. Your lot's exact annual installment (it varies by lot width and improvement area) is in the assessment rolls on [MuniCap's City of Celina page](https://www.municap.com/owner_information/city-of-celina/). Sutton Fields is **not** in a MUD.

## The rest of the stack

Because Sutton Fields is on the **Denton County side** of Celina, your bill stacks roughly like this:

- **City of Celina:** $0.576401 per $100 for FY 2025-26 — the [fourth straight year the council cut the rate](https://communityimpact.com/dallas-fort-worth/prosper-celina/government/2025/09/12/celina-lowers-property-tax-rate-adopts-382m-budget/)
- **Prosper ISD** — the largest line on the bill
- **Denton County** and smaller county entities
- **The PID annual installment** on top

Without the PID, effective rates in Celina run in the high-1s as a percentage of value. **With the PID installment included, Sutton Fields builder listings commonly cite an effective all-in rate around 2.7% or higher.** Your exact number depends on your lot's assessment and your appraised value — pull a real tax statement for the address before you count on anything.

## Why nobody told you

Residents on area forums are blunt about this: "Celina has a lot of them... A lot of realtors don't really disclose that and hope you don't read the fine print." The PID was in your closing documents — Texas requires the disclosure — but it's routinely glossed over in the sales office. If you're buying resale, ask the title company for the PID payoff schedule and whether the seller's installment is current.

**Bottom line:** the PID isn't a scam and it isn't a surprise tax hike waiting to happen — it's a fixed, known, prepayable assessment. But it does mean your real carrying cost is meaningfully higher than the advertised city rate, and you should budget off a real statement, not a listing flyer.`,
    sources: [
      { title: "MuniCap — City of Celina PID owner information", url: "https://www.municap.com/owner_information/city-of-celina/", date: "2026-08-12" },
      { title: "Community Impact: Celina lowers property tax rate, adopts $382M budget", url: "https://communityimpact.com/dallas-fort-worth/prosper-celina/government/2025/09/12/celina-lowers-property-tax-rate-adopts-382m-budget/", date: "2025-09-12" },
      { title: "City of Celina — Notice About 2025 Tax Rates", url: "https://www.celina-tx.gov/DocumentCenter/View/14337/Notice-About-2025-Tax-Rates", date: "2025-08-01" },
      { title: "r/askdfw thread on Celina PIDs and disclosure", url: "https://www.reddit.com/r/askdfw/comments/1grarry/looking_for_advice_on_home_purchase_in_north_texas/", date: "2024-11-14" },
    ],
  },
  {
    slug: "how-do-i-protest-my-appraisal",
    question: "How do I protest my property appraisal?",
    category: "money",
    answer: `Short version: Sutton Fields is appraised by **Denton CAD** (not Collin — we're on the Denton County side of Celina), the deadline is typically **May 15**, and protesting is easier than most neighbors think.

## Who appraises you

Your appraisal notice comes from the **Denton Central Appraisal District** ([dentoncad.com](https://www.dentoncad.com)). That's where you file, argue, and win or lose. If you've been searching Collin CAD and finding nothing, that's why.

## The deadline

You must file by **May 15, or 30 days after your appraisal notice was delivered, whichever is later**. Miss it and you're done until next year. Notices usually land in April; don't let one sit unopened.

## One thing the protest does NOT touch

Your **PID assessment is separate from your appraised value.** The Sutton Fields II PID installment is a fixed assessment set when the bonds were sold — protesting your appraisal won't lower it, and a higher appraisal doesn't raise it. What a successful protest lowers is the value that the city, county, and Prosper ISD rates are multiplied against. That's still most of your bill, so it's worth doing.

## Practical steps that actually work here

1. **File online** through Denton CAD's portal — no reason to mail anything. Check the box for both "market value" and "unequal appraisal" so you keep both arguments available.
2. **Look at the informal settlement offer first.** Denton CAD often makes an online settlement offer before you ever see a hearing. In a soft market it's frequently worth taking.
3. **Use the neighborhood against them.** Celina has had elevated inventory and price cuts — resale listings in Sutton Fields have sat with meaningful days-on-market. Pull 3-5 comparable sales (your agent will run them free), especially any recent sale below your appraised value on a similar floor plan.
4. **New-build owners: check the details.** Appraisals on recently closed new construction sometimes carry the wrong square footage, lot premium, or completion status. An error is the easiest win there is.
5. **Homestead exemption first.** If this is your primary residence and you haven't filed the homestead exemption, do that before anything else — it's free, permanent, and caps annual appraised-value growth at 10%.
6. **If the informal offer is weak, take the ARB hearing.** It's a 15-minute conversation with a review board, not a courtroom. Bring printed comps and photos of anything that hurts value.

If you'd rather not deal with it, flat-fee and contingency protest firms operate across Denton County — typical contingency fees run 25-40% of first-year savings. Fine for set-and-forget, but in a soft year many owners do just as well with the online settlement themselves.

The [Texas Comptroller's protest guide](https://comptroller.texas.gov/taxes/property-tax/protests/) covers your formal rights if you want the full rulebook.`,
    sources: [
      { title: "Denton Central Appraisal District", url: "https://www.dentoncad.com", date: "2026-08-12" },
      { title: "Texas Comptroller — Property Tax Protests", url: "https://comptroller.texas.gov/taxes/property-tax/protests/", date: "2026-08-12" },
      { title: "MuniCap — City of Celina PID owner information (assessments are separate from appraisal)", url: "https://www.municap.com/owner_information/city-of-celina/", date: "2026-08-12" },
      { title: "r/CelinaTX on elevated inventory and days-on-market", url: "https://www.reddit.com/r/CelinaTX/comments/1sdlfmr/seeing_a_lot_more_inventory_in_celina_right_now/", date: "2026-02-15" },
    ],
  },
  {
    slug: "which-schools-serve-sutton-fields",
    question: "Which schools serve Sutton Fields for 2026-27?",
    category: "schools",
    answer: `For the 2026-27 school year, Sutton Fields is zoned to:

- **Dan Christie Elementary** — inside the neighborhood
- **Pete Moseley Middle School** — 1451 Teel Pkwy, Prosper
- **Richland High School** — 3450 Prairie Dr, Prosper

This is confirmed on **Prosper ISD's official approved 2026-27 boundary maps** (dated 11/17/25), published on the district's [Attendance Boundaries page](https://www.prosper-isd.net/page/attendance-boundaries). The far-northwest zone along FM 1385 and Parvin Road — which is where Sutton Fields sits — falls inside the Christie, Moseley, and Richland zones on the elementary, middle, and high school maps respectively.

## Ignore the old feeder pattern

Older listings, stale realtor sites, and pre-2025 forum threads say **Rushing Middle School → Prosper High School**. That's outdated. When Prosper ISD opened Pete Moseley Middle School and Richland High School in August 2025, the district rezoned the west side, and Sutton Fields moved to the Moseley → Richland pattern. If a listing or agent quotes Rushing/Prosper High, they're working from old data.

## Verify your own address anyway

Sutton Fields is large (roughly 2,350 homes at buildout) and boundary lines can slice through the edges of big communities — the Bryant Elementary zone sits directly adjacent. Before you rely on this for a purchase or enrollment decision:

1. Open the [Prosper ISD Attendance Boundaries page](https://www.prosper-isd.net/page/attendance-boundaries)
2. Open the current-year **Elementary, Middle School, and High School boundary maps** linked there
3. Find your exact address relative to the boundary lines, or call the district to confirm

## The Dan Christie capacity situation

Christie Elementary opened in 2023 **inside Sutton Fields**, which is a genuine perk — many kids walk or bike. It's also been a victim of the neighborhood's growth: enrollment pushed past 1,000 students, and the district began diverting newly enrolling families to **Bryant Elementary, about 4.7 miles away** ([district announcement](https://www.prosper-isd.net/o/ches/article/1708191)). If you're moving in mid-year, do not assume your kid gets the school you can see from your porch — ask the district whether Christie is accepting new enrollments for your grade before you count on it.

## One more caveat

Prosper ISD redraws boundaries **almost every year** as it opens new campuses (see our answer on rezoning). The assignments above are the approved 2026-27 maps as of this writing; treat any school assignment in a fast-growth district as an annual subscription, not a lifetime guarantee.`,
    sources: [
      { title: "Prosper ISD — Attendance Boundaries (official 2026-27 approved maps)", url: "https://www.prosper-isd.net/page/attendance-boundaries", date: "2025-11-17" },
      { title: "Prosper ISD — Approved 2026-27 Middle School Boundaries map (PDF)", url: "https://files-backend.assets.thrillshare.com/documents/asset/uploaded_file/4567/Pisd/12265a08-4df2-4676-a8dd-e9e1fef05396/ApprovedMSBoundaries26-27ProsperISD.pdf", date: "2025-11-17" },
      { title: "Prosper ISD — Christie Elementary enrollment overflow to Bryant", url: "https://www.prosper-isd.net/o/ches/article/1708191", date: "2024-08-01" },
      { title: "Community Impact: Prosper ISD adjusts attendance zones for 2025-26", url: "https://communityimpact.com/dallas-fort-worth/prosper-celina/education/2024/11/22/prosper-isd-adjusts-attendance-zones-for-2025-26-school-year/", date: "2024-11-22" },
    ],
  },
  {
    slug: "will-we-get-rezoned",
    question: "Will our school assignments get rezoned (again)?",
    category: "schools",
    answer: `Honest answer: **assume yes, eventually.** Prosper ISD is absorbing roughly **3,000 new students a year**, and a district growing that fast redraws attendance boundaries almost every fall. Here's the recent track record:

- **For 2025-26:** the district [adjusted zones](https://communityimpact.com/dallas-fort-worth/prosper-celina/education/2024/11/22/prosper-isd-adjusts-attendance-zones-for-2025-26-school-year/) and then executed a major west-side rezoning when it opened four campuses at once in August 2025 — including Pete Moseley Middle School and Richland High School, which is when Sutton Fields moved off the old Rushing/Prosper High pattern.
- **For 2026-27:** the board [approved new middle school zones on Nov. 17, 2025](https://communityimpact.com/dallas-fort-worth/prosper-celina/education/2025/12/04/prosper-isd-sets-middle-school-attendance-zones-for-2026-27-school-year/) to open **Bridges Middle School**. The documented shifts hit east and central campuses; students at Moseley (Sutton Fields' zone) stay put for 2026-27.
- **Coming:** **Watkins Middle School was delayed from 2026-27 to 2027-28** amid a district budget shortfall reported at $29.43 million — meaning another middle school rezoning round is already queued up for fall 2027 decisions.

## What actually drives it

Not politics — arithmetic. Voters approved a **$2.7 billion bond package in November 2023** that funds a pipeline of new campuses; every time one opens, someone has to fill it, and the district rebalances the map. Christie Elementary blowing past 1,000 students (with overflow diverted to Bryant) is exactly the kind of capacity pressure that eventually forces a line to move.

## Sutton Fields' realistic exposure

- **Elementary:** highest churn risk. Christie is over capacity and new elementaries keep opening on the west side (Rucker ES was projected for 2026). If any line moves near us, it's most likely an elementary line.
- **Middle school:** Watkins MS opening in 2027-28 guarantees another west-side middle school conversation. Moseley survived the 2026-27 redraw untouched, but 2027-28 is a genuinely open question.
- **High school:** Richland just opened in 2025 and has room to grow into; high school zones are the stickiest. Lowest near-term risk.

## How to watch it (so it never surprises you)

1. **October-December is rezoning season.** Proposals surface at the October board meeting, hearings run through November, votes land November-December — always for the following school year.
2. Bookmark the district's [Attendance Boundaries page](https://www.prosper-isd.net/page/attendance-boundaries) — approved maps post there.
3. Community Impact's Prosper-Celina education desk covers every proposal and vote in detail; their [October 2025 preview](https://communityimpact.com/dallas-fort-worth/prosper-celina/education/2025/10/23/prosper-isd-considers-new-attendance-boundaries-for-2026-27-school-year/) is the template for what to expect each fall.
4. If a proposal touches Sutton Fields, the board takes public comment before voting — rezoning fights in this district are won and lost at those hearings, not on Facebook afterward.

One consolation: the district has generally paired rezonings with transition provisions (rising seniors staying put, etc.), and moving into a brand-new campus is not automatically a downgrade — Moseley and Richland were the shiny new buildings everyone else wanted into.`,
    sources: [
      { title: "Community Impact: Prosper ISD sets middle school attendance zones for 2026-27", url: "https://communityimpact.com/dallas-fort-worth/prosper-celina/education/2025/12/04/prosper-isd-sets-middle-school-attendance-zones-for-2026-27-school-year/", date: "2025-12-04" },
      { title: "Community Impact: Prosper ISD considers new attendance boundaries for 2026-27", url: "https://communityimpact.com/dallas-fort-worth/prosper-celina/education/2025/10/23/prosper-isd-considers-new-attendance-boundaries-for-2026-27-school-year/", date: "2025-10-23" },
      { title: "Community Impact: Prosper ISD adjusts attendance zones for 2025-26", url: "https://communityimpact.com/dallas-fort-worth/prosper-celina/education/2024/11/22/prosper-isd-adjusts-attendance-zones-for-2025-26-school-year/", date: "2024-11-22" },
      { title: "Prosper ISD — Attendance Boundaries", url: "https://www.prosper-isd.net/page/attendance-boundaries", date: "2025-11-17" },
    ],
  },
  {
    slug: "when-does-the-traffic-get-fixed",
    question: "When does the traffic actually get fixed?",
    category: "roads",
    answer: `The most-asked question about living here deserves a number, not a vibe. So here are the numbers, and some of them are painful.

## The one that hurts: FM 1385 — roughly 2032

The road most Sutton Fields residents live off of is a two-lane farm road carrying master-planned-community traffic. TxDOT's fix — widening 12 miles of FM 1385 from US 380 to FM 455 from two lanes to six — is real, funded for design, and moving through right-of-way acquisition. It is also estimated to finish around **September 2032** ([TxDOT project page](https://www.txdot.gov/projects/hearings-meetings/dallas/2023/fm1385-from-us380-to-fm455.html)). That is not a typo. If you're evaluating a purchase here on "the road gets fixed soon," recalibrate: FM 1385 stays a two-lane road for years.

## The one that genuinely helps soon: DNT Phase 4A — late 2027

The Dallas North Tollway extension from US 380 to FM 428 is **under construction now** and scheduled to open to traffic in **late 2027** ([NTTA](https://www.ntta.org/dallas-north-tollway-dnt)). Bridge decks are done from US 380 to Light Farms Way, mainlane paving is underway, and the DNT/FM 428 intersection is being built out through fall 2026. When it opens, Sutton Fields gets a genuine high-capacity route south — this is the single biggest scheduled improvement to our commute math.

**Phase 4B** (FM 428 north to the Grayson County line) has no published mainlane schedule. Frontage roads come first; don't hold your breath.

## The one wrapping up now: US 380 in Denton County — April 2026

The $136M widening from Loop 288 to the Collin County line — six lanes plus overpasses at Legacy, Teel, and FM 423 — is in its final stretch, [expected to wrap around April 2026](https://communityimpact.com/dallas-fort-worth/prosper-celina/transportation/2026/04/22/relieving-the-pressure-136m-us-380-project-adds-overpasses-reduces-congestion/). The Denton-side 380 experience is already better than the horror stories from 2022-2024. The Collin County side of 380, however, is unfunded — estimated around $8 billion — with no start date.

## The rest

**FM 428's** realignment and widening past our doorstep is still a proposed/design-stage TxDOT project with no published construction date ([project page](https://www.keepitmovingdallas.com/FM428)). **Legacy Drive** widening is in a ~2-year design phase. **CR 52** is being rebuilt through November 2026 (expect FM 428 access restrictions during phase 3). And one actual win: **Collin County Outer Loop segment 3C opened November 7, 2025** — three months early.

## The honest summary

Near term (2026): US 380 Denton side finishes, CR 52 pain. Medium term (2027): **DNT 4A opens — the real one to circle on the calendar.** Long term (2028-2032): Legacy Drive, FM 428, and finally FM 1385.

The live status table below tracks every one of these projects — it's updated as statuses change, so check it rather than trusting a forum comment from two years ago.`,
    sources: [
      { title: "TxDOT — FM 1385 from US 380 to FM 455 project", url: "https://www.txdot.gov/projects/hearings-meetings/dallas/2023/fm1385-from-us380-to-fm455.html", date: "2023-06-01" },
      { title: "NTTA — Dallas North Tollway extension (Phase 4A/4B status)", url: "https://www.ntta.org/dallas-north-tollway-dnt", date: "2026-01-19" },
      { title: "Community Impact: $136M US 380 project adds overpasses, reduces congestion", url: "https://communityimpact.com/dallas-fort-worth/prosper-celina/transportation/2026/04/22/relieving-the-pressure-136m-us-380-project-adds-overpasses-reduces-congestion/", date: "2026-04-22" },
      { title: "TxDOT/Keep It Moving Dallas — FM 428 project", url: "https://www.keepitmovingdallas.com/FM428", date: "2026-08-12" },
    ],
  },
  {
    slug: "how-do-i-reach-essex",
    question: "How do I actually reach Essex (our HOA management company)?",
    category: "hoa",
    answer: `Sutton Fields' HOA is managed by **Essex Association Management, L.P.** Here are the contact paths that exist, followed by some candor about how well they work.

## The contact details

- **Main line:** (972) 428-2030
- **Office:** 4570 Westgrove Dr., Suite 230, Addison, TX 75001
- **After-hours emergencies:** 1-888-740-2233 (genuine common-area emergencies — a broken gate arm, a main-line leak — not covenant questions)
- **HOA portal:** [suttonfieldshoa.com](https://www.suttonfieldshoa.com) — dues, documents, ACC forms, and official notices

## Portal migration — read this if your autopay is old

Essex migrated community management to the **Vantaca platform in July 2026**. If you set up your account or autopay before that, it did not carry over automatically: you need to **re-register your portal account and re-establish autopay**. Residents who missed this discovered it via late notices. Check that your payment method survived the migration before the next dues cycle. Migration notices are posted on the [HOA news page](https://www.suttonfieldshoa.com/news/news_current.aspx).

## The candid part

Essex's [BBB profile](https://www.bbb.org/us/tx/carrollton/profile/association-management/essex-association-management-lp-0875-90233982/customer-reviews) carries a **1.0/5 customer review average**. Recent reviews describe a familiar pattern: "This company is a ghost. They can touch you, but you can't touch them. They don't respond to phone calls." Others describe fines "for one rock out of place" and allege selective enforcement. These are reviews across all Essex-managed communities, not a Sutton Fields-specific audit — but the volume and consistency are worth knowing about, and they match what residents report about response times here.

## How to get a response anyway

1. **Put everything in writing through the portal or email — never phone-only.** A phone call that goes nowhere leaves no record; a written request starts a paper trail that matters if you ever dispute a fine or a denied ACC application.
2. **Be specific and reference your account number and lot.** Vague messages get triaged last.
3. **Follow up on a cadence.** A polite written follow-up after 7 business days, then again citing the earlier dates. Documented persistence is what gets files moved.
4. **Escalate to the Board.** Essex works for the Sutton Fields HOA board, not the other way around. If management is non-responsive on something substantive, a written request to the board (routed via the portal, or raised at an open board meeting) changes the incentive structure. Board meeting notices post on the HOA site.
5. **Know your statutory rights.** Texas Property Code Chapter 209 gives owners the right to a hearing before fines stick, and to inspect association records on written request. You don't need a lawyer to invoke either — you need a dated letter.

One genuinely useful habit: photograph your lawn/exterior whenever you get a courtesy notice, with a timestamp. Disputes here are won with documentation, not phone calls.`,
    sources: [
      { title: "BBB — Essex Association Management customer reviews (1.0/5)", url: "https://www.bbb.org/us/tx/carrollton/profile/association-management/essex-association-management-lp-0875-90233982/customer-reviews", date: "2026-08-12" },
      { title: "Sutton Fields HOA — official news and notices (incl. Vantaca migration)", url: "https://www.suttonfieldshoa.com/news/news_current.aspx", date: "2026-07-01" },
      { title: "Texas Property Code Chapter 209 (owner rights)", url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.209.htm", date: "2026-08-12" },
    ],
  },
  {
    slug: "acc-approval-process",
    question: "Do I need ACC approval before changing my house or yard?",
    category: "hoa",
    answer: `Yes — and since **January 1, 2026, it costs $25 per application**, so it's worth getting right the first time.

## What needs approval

Any **exterior modification** visible from outside your house needs Architectural Control Committee (ACC) approval **before** work begins. In practice, in Sutton Fields that includes:

- Patios, pergolas, arbors, and patio covers
- Pools and spas
- Fence changes (stain color, height, replacement style)
- Exterior paint color changes
- Landscaping changes beyond plant swaps — beds, borders, trees removed or added, turf conversion
- Solar panels, storm doors, gutters in a new color
- Sheds, playsets, basketball goals, driveway extensions

The safe rule: **if it changes how your property looks from the street or a neighbor's yard, submit first.** Interior work needs nothing.

## The process

1. **Get the form** from the HOA portal at [suttonfieldshoa.com](https://www.suttonfieldshoa.com) — the ACC application and the design guidelines both live there.
2. **Submit before you build**, with the $25 fee (effective Jan. 1, 2026 — announced on the [HOA news page](https://www.suttonfieldshoa.com/news/news_current.aspx)). Include a plat/survey with the improvement drawn in, dimensions, materials, colors, and photos or manufacturer cut-sheets. Thin applications are the number one cause of delay — the committee can't approve what it can't picture.
3. **Wait for written approval.** Review typically runs a few weeks; Texas HOA documents commonly deem applications approved if the committee misses its stated response window, but do not rely on silence — get the approval in writing before a shovel hits dirt.
4. **Build to what you submitted.** Deviations from an approved application are treated as unapproved work.

## Why bothering matters

Starting without approval is the expensive path: the HOA can require **removal or modification of completed work at your cost**, and unapproved improvements surface at resale — title companies request an HOA compliance/resale certificate, and an unapproved pergola can hold up your closing years later. Given Essex's enforcement reputation (see our answer on reaching Essex), assume the neighborhood is watched and violations get lettered.

## Practical tips from residents who've been through it

- **Submit early.** Contractors book out; a few weeks of ACC review is painless if it runs parallel to your contractor's lead time, maddening if it starts after.
- **Match the neighborhood precedent.** Applications consistent with what's already approved nearby (same fence stain family, similar patio covers) sail through; novel requests draw scrutiny.
- **Keep the approval letter forever.** Store it with your closing documents. If enforcement ever questions the improvement — or a future buyer's title company does — that letter is the whole ballgame.
- **When in doubt, ask first.** A quick portal message asking "does X need an application?" costs nothing and creates a written record either way.`,
    sources: [
      { title: "Sutton Fields HOA — news and notices ($25 ACC fee effective Jan 1, 2026)", url: "https://www.suttonfieldshoa.com/news/news_current.aspx", date: "2025-12-01" },
      { title: "Sutton Fields HOA — portal (ACC forms and design guidelines)", url: "https://www.suttonfieldshoa.com", date: "2026-08-12" },
    ],
  },
  {
    slug: "can-i-rent-my-house-out",
    question: "Can I rent my house out in Sutton Fields?",
    category: "hoa",
    answer: `Right now, for most owners: **no — the leasing cap is full.**

## The 15% cap, and where it stands

Sutton Fields' governing documents cap leased homes at **15% of the community**. As of the HOA's [October 2024 notice](https://www.suttonfieldshoa.com/news/news_current/24-10-11/Leasing_Rules.aspx), that cap is **met**: "no new leasing is currently authorized." In plain terms:

- If you are not already an authorized landlord, you **cannot legally lease your home** under the covenants until capacity opens up.
- Openings happen when an existing rental sells to an owner-occupant or its owner gives up authorization. Contact the HOA (via [suttonfieldshoa.com](https://www.suttonfieldshoa.com)) to ask about current status and whether a waitlist is being maintained — get the answer **in writing**.
- Leasing without authorization exposes you to fines and enforcement, and an unauthorized tenancy is a genuinely bad position to be in mid-lease.

## What this means in real situations

- **"I need to move but can't sell at my price."** This is the painful one. With the cap met, renting-instead-of-selling is not an available escape valve the way it is in uncapped neighborhoods. Factor that into pricing decisions — carrying an empty house while waiting out a soft market is the realistic alternative.
- **"I'm buying as an investment."** Don't — not here, not right now. You would be buying a rental you cannot legally rent.
- **"I'm already leasing."** Existing authorized leases generally continue; confirm your authorization is on file with the HOA and keep the paperwork.
- **Hardship provisions** (job relocation, military orders) exist in some HOA leasing regimes — ask the HOA in writing whether any exception process applies before assuming yes or no.

## The irony next door: Yardly

Here's the part that generates understandable grumbling. Directly adjacent to Sutton Fields, at the northeast corner of FM 1385 and Tudor Place, **Taylor Morrison is building Yardly Sutton Fields — a 150-home build-to-rent community** (roughly $55M, first leases expected late 2026), alongside a 246-unit cottage-style sibling ([Community Impact](https://communityimpact.com/dallas-fort-worth/prosper-celina/development/2025/03/28/396-new-homes-coming-to-celina/)).

**Yardly is not part of the Sutton Fields HOA and does not count against our 15% cap.** It's a separate community on separate land with its own operator. So the practical picture from 2027 onward: hundreds of rental households next door, while owner-occupants inside Sutton Fields remain unable to lease their own homes. Whether that's sensible policy or not is a board-and-covenants question — but that is the factual layout, and anyone weighing a purchase here on rental flexibility should understand both halves of it.

If leasing flexibility matters to your five-year plan, verify the cap status with the HOA in writing before you close on anything.`,
    sources: [
      { title: "Sutton Fields HOA — Leasing Rules notice (15% cap met)", url: "https://www.suttonfieldshoa.com/news/news_current/24-10-11/Leasing_Rules.aspx", date: "2024-10-11" },
      { title: "Community Impact: 396 new homes coming to Celina (Yardly BTR)", url: "https://communityimpact.com/dallas-fort-worth/prosper-celina/development/2025/03/28/396-new-homes-coming-to-celina/", date: "2025-03-28" },
    ],
  },
  {
    slug: "watering-rules-vs-hoa-enforcement",
    question: "How do city watering restrictions square with HOA lawn enforcement?",
    category: "living",
    answer: `Two authorities have opinions about your lawn, and residents keep getting caught between them. Here's how it actually works.

## The city's rules (the ones with real fines)

The **City of Celina entered Stage 2 water conservation on July 2, 2026** ([city notice](https://www.celina-tx.gov/m/newsflash/Home/Detail/835)). Stage 2 restricts outdoor irrigation — limited watering days/hours, no watering during midday heat, no runoff — and violations carry **fines from $500 to $2,000**. Check the city notice for the current schedule tied to your address, and note this isn't a one-summer blip: Celina's supply runs tight until Upper Trinity's **Lake Ralph Hall** reservoir comes online ([Local Profile](https://www.localprofile.com/news/solution-celinas-water-restrictions-10512500)). Expect summer restrictions to be a recurring feature of life here for the next few years.

## The HOA's rules (the letters in your mailbox)

Separately, the HOA's covenants require you to maintain your lawn and landscaping — and Essex enforces with courtesy notices and fines for browned-out or dead turf. Which sets up the obvious resident question: **"How can I be fined for a brown lawn I'm legally barred from watering?"**

The confusion was real enough that the HOA published a clarification, "Watering Restrictions — Important Clarification For Residents," in **August 2025** (on the [HOA news page](https://www.suttonfieldshoa.com/news/news_current.aspx)). The gist of the reconciliation:

- The HOA expects you to water **within whatever the city currently allows** — restrictions reduce your watering, they don't eliminate it.
- **City rules always win.** No HOA covenant can require you to violate a city ordinance; Texas Property Code also protects drought-tolerant landscaping choices and bars HOAs from forcing owners to breach watering restrictions.
- What the HOA can still cite you for: dead lawns from total neglect, weeds, and unmaintained beds — the difference between "stressed by drought" and "abandoned."

## How to stay out of trouble with both

1. **Water on your legal days, early morning.** A lawn watered once or twice a week at dawn survives a Texas summer stressed but alive — which satisfies both authorities.
2. **Know your city schedule and keep a copy.** If you get an HOA notice during restrictions, respond in writing citing the Stage 2 ordinance and your compliance with it. That letter usually ends the matter.
3. **Photograph your lawn when a notice arrives**, timestamped. Documentation beats phone calls with Essex every time.
4. **Fix obvious non-drought issues fast** — weeds and dead shrubs read as neglect and won't be excused by the watering rules.
5. **Thinking of converting to drought-tolerant landscaping?** State law protects it, but the HOA can still require ACC approval of the design — submit the application (see our ACC answer) rather than ripping out turf unilaterally.

Bottom line: the $500-$2,000 city fine is the one to genuinely fear. Water legally, keep the yard from crossing into visible neglect, and put everything in writing.`,
    sources: [
      { title: "City of Celina — Stage 2 water conservation notice", url: "https://www.celina-tx.gov/m/newsflash/Home/Detail/835", date: "2026-07-02" },
      { title: "Local Profile — Lake Ralph Hall and Celina's water restrictions", url: "https://www.localprofile.com/news/solution-celinas-water-restrictions-10512500", date: "2026-06-15" },
      { title: "Sutton Fields HOA — Watering Restrictions clarification (Aug 2025, via news index)", url: "https://www.suttonfieldshoa.com/news/news_current.aspx", date: "2025-08-04" },
    ],
  },
  {
    slug: "trash-recycling-bulk-pickup",
    question: "When is trash, recycling, and bulk pickup?",
    category: "living",
    answer: `The single most re-asked question in the neighborhood Facebook group, answered permanently:

## The basics

- **Provider:** Community Waste Disposal (CWD), under contract with the **City of Celina** — you don't pick a provider, it's on your city utility bill ([city trash page](https://www.celina-tx.gov/1140/Trash-Recycling))
- **Trash and recycling day in Sutton Fields: every Monday.** Carts at the curb by 7 a.m.
- **Missed pickup:** call CWD at **(972) 392-9300, option 2**. Report it the same day or next morning — they'll usually swing back within a day or two. Holiday weeks typically slide collection by one day; check [CWD's Celina page](https://www.communitywastedisposal.com/find-my-city/celina/) around holidays.

## Bulk pickup — roughly every other Monday

Bulk/brush collection runs on alternating Mondays. Remaining **2026 bulk dates** for Sutton Fields, from the CWD collection calendar:

- **August 24**
- **September 14** and **September 28**
- **October 12** and **October 26**
- **November 9** and **November 23**
- **December 14** and **December 28**

(The gaps aren't perfectly biweekly around holidays — trust the listed dates over the pattern.)

Bulk rules worth knowing before you drag the old sofa out:

- Set bulk items out **by 7 a.m. on the bulk Monday, not the weekend before** — early set-outs are what generate HOA courtesy letters.
- Brush should be cut and bundled; there are volume limits per pickup (check CWD's Celina page for current limits).
- **Not accepted:** construction debris from contractor jobs, tires, liquids, paint, chemicals, and appliances containing freon usually need special handling — call CWD's line to ask before setting them out.

## Clean Sweep events — the free dumpster days

Celina runs **three "Clean Sweep" events per year** — drive-up disposal days for the stuff regular bulk won't take (large cleanouts, electronics, and typically document shredding). Dates are announced on the [city's trash page](https://www.celina-tx.gov/1140/Trash-Recycling) and city social channels. If you're doing a garage purge, timing it to a Clean Sweep saves a dump run to Denton.

## Quick answers to the recurring follow-ups

- **"They skipped my recycling but got trash."** Different trucks, different routes. Still (972) 392-9300 opt 2.
- **"Can I get a second cart?"** Yes, through CWD/the city for an added monthly fee.
- **"Cart got damaged/stolen?"** CWD replaces carts — same phone line.
- **"When do carts have to be off the street?"** Covenant expectation is carts back and out of street view the night of collection day; leaving them out is a classic Essex letter-generator.
- **Moving in?** Trash service starts with your city utility account — if water's on, trash is on, and your first Monday should just work.`,
    sources: [
      { title: "City of Celina — Trash & Recycling", url: "https://www.celina-tx.gov/1140/Trash-Recycling", date: "2026-08-12" },
      { title: "Community Waste Disposal — Celina service page", url: "https://www.communitywastedisposal.com/find-my-city/celina/", date: "2026-08-12" },
    ],
  },
  {
    slug: "internet-providers-by-phase",
    question: "Which internet providers actually serve Sutton Fields?",
    category: "living",
    answer: `Good news for a neighborhood this far northwest: real fiber exists here. The catch — and it's a real catch — is that **availability varies by phase and sometimes street by street**, so treat every provider claim as unverified until their address checker says yes for YOUR address.

## The two fiber options

**Nextlink Fiber** markets Sutton Fields by name with a [dedicated community page](https://nextlinkinternet.com/areas-we-serve/internet-in-texas/celina/fiber-internet-in-sutton-fields/) advertising speeds **up to 2 Gbps**, no data caps, and whole-home managed Wi-Fi. Nextlink is a Texas regional ISP that built into the newer Celina communities — for many residents here it's the fastest wire into the house.

**AT&T Fiber** has built out heavily in Celina — coverage trackers put AT&T Fiber at roughly **90% of the city** — but Celina is a big place and Sutton Fields' phases came online at different times. Some sections have it, some don't yet. The only answer that matters comes from [AT&T's address checker](https://www.att.com/internet/fiber/).

## The honest per-phase reality

Sutton Fields has been building for roughly eight years across many phases, and ISP buildout followed the rooftops unevenly. That means:

- Your neighbor two streets over may have a provider you can't get, and vice versa.
- Newer phases sometimes get fiber conduit from day one but activation lags move-ins by months.
- "Available in Sutton Fields" in an ad means "available somewhere in Sutton Fields."

There is no public per-phase coverage map from either provider. Until one exists, the reliable method is:

1. **Run your exact address** through the [Nextlink](https://nextlinkinternet.com/areas-we-serve/internet-in-texas/celina/fiber-internet-in-sutton-fields/) and [AT&T](https://www.att.com/internet/fiber/) checkers.
2. **Ask your immediate neighbors** what they actually have and what real-world speeds they see — the Facebook group answers this within the hour for any given street.
3. **If you're under contract on a new build**, ask the builder's sales office which providers are wired to that specific phase — and get it in writing if internet is mission-critical for your work, because "fiber-ready" and "fiber-active" are different things.

## Fallbacks if fiber isn't at your address yet

Fixed wireless (T-Mobile and Verizon 5G Home Internet) generally works in the area and installs in a day — a common bridge for residents waiting on fiber activation. Satellite is the option of last resort at these prices and latencies.

## Before you sign

- Promo pricing on both fiber providers typically steps up after year one — calendar the increase.
- If you work from home, ask about upload speeds specifically; fiber's symmetric upload is the real advantage over cable/wireless.
- Check installation lead times before your move date — new-phase activations can queue for weeks.

Know something current about which providers serve your phase? That's exactly the kind of institutional knowledge this page exists to collect — send a correction and we'll update it.`,
    sources: [
      { title: "Nextlink — Fiber Internet in Sutton Fields", url: "https://nextlinkinternet.com/areas-we-serve/internet-in-texas/celina/fiber-internet-in-sutton-fields/", date: "2026-08-12" },
      { title: "AT&T Fiber availability checker", url: "https://www.att.com/internet/fiber/", date: "2026-08-12" },
    ],
  },
  {
    slug: "pool-hours-and-amenity-center-2",
    question: "What's the deal with the pools — and when does the second amenity center open?",
    category: "living",
    answer: `## What we have today

The existing **amenity center at 4515 Westminster** anchors the community's pool life:

- **Two pools** — the resort-style pool with cabanas plus a second pool
- A dedicated **lap pool** for actual swimmers
- A **splash pad** for the small kids
- Plus the surrounding amenities: playgrounds, trails, tennis, community gardens, and event spaces ([community overview](https://www.visitcelina.org/sutton-fields/))

Pool access uses your HOA key fob/card; hours are seasonal and posted at the facility and on the HOA portal at [suttonfieldshoa.com](https://www.suttonfieldshoa.com). Guests are limited per household — check current rules before hosting a pool party.

## Why we built a live status board for this

On **July 15, 2026**, the HOA posted a "Temporary Pool Closure Notice": the pool was **"temporarily closed effective immediately due to contamination"** ([the notice](https://www.suttonfieldshoa.com/news/news_current/26-07-15/Temporary_Pool_Closure_Notice.aspx)). Anyone who packed up towels, sunscreen, and two kids only to find a locked gate that week understands why this site keeps a pool status chip on the homepage. Closures for contamination, weather, or maintenance happen with zero notice in every community pool in Texas — the difference is whether you find out at home or at the gate. Check the status chip before you load the car; we track HOA notices so you don't have to.

## The second amenity center — under construction at 5512 Liverpool

The genuinely exciting one: a **second amenity center is under construction at 5512 Liverpool**. Per the HOA's [construction notice](https://www.suttonfieldshoa.com/news/news_current/26-07-29/Amenity_Center_Construction_Notice.aspx), the **parking lot was poured in August 2026**, which puts the project visibly past dirt-work and into real buildout.

**What we don't know yet — because it hasn't been announced:**

- **The opening date.** No date has been published by the HOA or developer. Anyone quoting one on Facebook is guessing.
- The final amenity mix (a second pool is widely expected given the neighborhood's growth, but we won't state it as fact until the HOA does).

This is one of the most-asked questions in the community — "when does the new amenity center open?" — and the honest answer as of this writing is: **not announced.** We're watching the HOA news feed and will update this answer the moment a date or amenity list is published. If the parking-lot-to-opening timeline of comparable facilities is any guide, measure the wait in months, not weeks — but that's inference, not information.

## Practical notes

- Pool season typically runs longer here than northerners expect — the splash pad and pools stay usable well into fall.
- Amenity issues (broken gate, fob not working, unsafe conditions) go to Essex: (972) 428-2030, or after-hours 1-888-740-2233 for genuine emergencies.
- Lost fob replacements go through the HOA portal and carry a fee — budget a week of lead time before a planned event.`,
    sources: [
      { title: "Sutton Fields HOA — Temporary Pool Closure Notice", url: "https://www.suttonfieldshoa.com/news/news_current/26-07-15/Temporary_Pool_Closure_Notice.aspx", date: "2026-07-15" },
      { title: "Sutton Fields HOA — Amenity Center Construction Notice (5512 Liverpool)", url: "https://www.suttonfieldshoa.com/news/news_current/26-07-29/Amenity_Center_Construction_Notice.aspx", date: "2026-07-29" },
      { title: "Visit Celina — Sutton Fields amenities overview", url: "https://www.visitcelina.org/sutton-fields/", date: "2026-08-12" },
    ],
  },
  {
    slug: "aubrey-or-celina-which-am-i-in",
    question: "Am I in Aubrey or Celina? (And which county?)",
    category: "living",
    answer: `The most common new-resident confusion in Sutton Fields, settled:

**You live in the City of Celina, in Denton County, ZIP 75009.**

Now, why everything around you seems to disagree:

## The Aubrey confusion

Sutton Fields sits in Celina's far western reach — the part of the city that spills across the county line into Denton County. Historically, addresses out here carried **Aubrey-adjacent mailing associations**, and several systems never got the memo:

- **Nextdoor literally files the neighborhood under "Sutton Fields, Aubrey, TX"** ([see for yourself](https://nextdoor.com/neighborhood/suttonfields--aubrey--tx/)). You did not move to Aubrey. Nextdoor is wrong.
- GPS apps, delivery services, and insurance quote engines sometimes surface "Aubrey" for addresses out here because ZIP-code geography and city limits don't align neatly in fast-growth Texas.
- USPS cares about your ZIP (75009 — a Celina ZIP) and street address, not the city line, so mail works fine either way.

The authoritative fact: Sutton Fields was annexed into **Celina city limits** — that's why the City of Celina created the Sutton Fields II PID here in 2015, bills your water, and contracts your trash service. Cities don't do any of that outside their limits.

## Which county — and why it matters more than the city question

**Denton County**, not Collin. Most of Celina is in Collin County, which trips up even long-time locals. Practical consequences:

- **Property appraisal and protests: Denton CAD** ([dentoncad.com](https://www.dentoncad.com)). If you've been searching Collin CAD for your house, that's why it's not there. (See our appraisal-protest answer.)
- **County tax entities on your bill are Denton County's**, and the county line is one reason Sutton Fields' tax stack differs from friends' bills in east Celina.
- **Vehicle registration, county records, jury duty:** Denton County offices.
- **Elections:** you vote in Denton County elections — your polling places and county ballot items differ from most of Celina.

## Who actually provides your services

- **Water/sewer:** City of Celina retail service
- **Trash:** Community Waste Disposal, via City of Celina contract
- **Police:** Celina PD
- **Fire/EMS:** Celina Fire Department
- **Schools:** Prosper ISD (a third jurisdiction! — the school district follows its own boundaries, not city or county lines)
- **Animal services:** Celina PD handles field response; sheltering runs through Collin County Animal Services in McKinney — yes, genuinely confusing, and yes, that's the arrangement

## The one-line version for forms

City: **Celina**. County: **Denton**. ZIP: **75009**. School district: **Prosper ISD**. When a form or agent insists you're in Aubrey, they're reading stale map data — politely correct it, especially on anything involving insurance or taxes, where the wrong jurisdiction produces wrong numbers.`,
    sources: [
      { title: "Nextdoor — files Sutton Fields under Aubrey (the confusion in the wild)", url: "https://nextdoor.com/neighborhood/suttonfields--aubrey--tx/", date: "2026-08-12" },
      { title: "Denton Central Appraisal District", url: "https://www.dentoncad.com", date: "2026-08-12" },
      { title: "City of Celina — Trash & Recycling (city-contracted services to Sutton Fields)", url: "https://www.celina-tx.gov/1140/Trash-Recycling", date: "2026-08-12" },
      { title: "MuniCap — Sutton Fields II PID (created by City of Celina, 2015)", url: "https://www.municap.com/owner_information/city-of-celina/", date: "2026-08-12" },
    ],
  },
  {
    slug: "whats-being-built-around-us",
    question: "What's being built around Sutton Fields right now?",
    category: "living",
    answer: `Everything under construction or announced within a short drive, with dates and what's actually confirmed:

## Right next door

**Yardly Sutton Fields (build-to-rent)** — Taylor Morrison is building **150 detached rental homes** (~$55M) at the northeast corner of FM 1385 and Tudor Place, plus a 246-unit cottage-style sibling community, with a **shared dog park** between them. First leases expected **late 2026** ([Community Impact](https://communityimpact.com/dallas-fort-worth/prosper-celina/development/2025/03/28/396-new-homes-coming-to-celina/)). Note: Yardly is a separate community — it's not under the Sutton Fields HOA and doesn't count against our leasing cap (see our renting answer).

**Project Tomahawk (data center)** — the one to watch. White Rose Partners is seeking approval for a **data center on 39.3 acres at the southeast corner of FM 1385 and Parvin Road** — in Prosper's jurisdiction, close enough to matter to our side of 1385. Prosper's Planning & Zoning Commission takes it up **August 18, 2026** ([Community Impact](https://communityimpact.com/prosper-celina/development/developer-seeks-to-build-data-center-in-prosper/)). Data centers bring construction traffic, then very little daily traffic — but also substation infrastructure, cooling systems, and a very different neighbor than another subdivision. If you have opinions, the P&Z hearing is where they count.

## The big master-planned neighbor

**Legacy Hills** — Centurion American's 3,200-acre development along the DNT corridor: roughly **7,000 single-family homes**, 4,100 multifamily units, and 100 acres of commercial at buildout ([developer page](https://centurionamerican.com/development/legacy-hills/)). Its **1876 Country Club golf course began phased opening in Q2 2026**. Legacy Hills is why the road math around here keeps changing — and why retail is finally penciling out.

## Groceries and retail (the good news)

- **Costco Celina** (Preston Rd & Ownsby Pkwy) — **opens August 26, 2026** ([Community Impact](https://communityimpact.com/dallas-fort-worth/prosper-celina/business/2025/08/08/h-e-b-costco-5-grocery-stores-now-open-coming-soon-to-prosper-celina/)).
- **H-E-B Celina** — 21 acres inside Legacy Hills at Dallas Pkwy & Fred Smith Pkwy. Third-party tracker [CelinaWatch](https://celinawatch.com/projects/heb/) projects a **Q4 2027 opening** — treat that date as an estimate, since H-E-B itself hasn't published one. (The nearest H-E-B today is Prosper's, opened August 2025 at Frontier & DNT.)

## Healthcare

**Methodist Celina Medical Center opened March 17, 2025** at 1500 S. Dallas Pkwy — Celina's first full-service hospital, with a 24/7 ER ([Methodist Health System](https://www.methodisthealthsystem.org/press-releases/2025/march/first-hospital-in-celina-opens-its-doors-to-pati/)). The days of driving to Denton or Frisco for an emergency room are over.

## How to read all this

The pattern is consistent: rooftops arrived years before infrastructure and retail, and 2026-2027 is when the second wave finally lands — Costco, the DNT extension (late 2027), first Yardly leases, and possibly H-E-B in 2027. The trade-offs are construction traffic everywhere and decisions (like the data center) being made right now at public hearings most residents never hear about. This page gets updated as projects advance — check the sources for the latest on any single project.`,
    sources: [
      { title: "Community Impact: Developer seeks to build data center in Prosper (Project Tomahawk)", url: "https://communityimpact.com/prosper-celina/development/developer-seeks-to-build-data-center-in-prosper/", date: "2026-08-07" },
      { title: "Community Impact: 396 new homes coming to Celina (Yardly)", url: "https://communityimpact.com/dallas-fort-worth/prosper-celina/development/2025/03/28/396-new-homes-coming-to-celina/", date: "2025-03-28" },
      { title: "CelinaWatch — H-E-B Celina project tracker (third-party)", url: "https://celinawatch.com/projects/heb/", date: "2026-04-15" },
      { title: "Community Impact: H-E-B, Costco, 5 grocery stores open or coming to Prosper, Celina", url: "https://communityimpact.com/dallas-fort-worth/prosper-celina/business/2025/08/08/h-e-b-costco-5-grocery-stores-now-open-coming-soon-to-prosper-celina/", date: "2025-08-08" },
      { title: "Centurion American — Legacy Hills", url: "https://centurionamerican.com/development/legacy-hills/", date: "2026-08-12" },
      { title: "Methodist Health System — First hospital in Celina opens its doors", url: "https://www.methodisthealthsystem.org/press-releases/2025/march/first-hospital-in-celina-opens-its-doors-to-pati/", date: "2025-03-17" },
    ],
  },
];

const ROADS: { name: string; status: string; eta_text: string; detail: string; source_url: string; sort: number }[] = [
  {
    name: "DNT Phase 4A (US 380 to FM 428)",
    status: "Under construction",
    eta_text: "Opens late 2027",
    detail: "Tollway extension through Prosper and Celina. Bridge decks complete from US 380 to Light Farms Way; mainlane paving underway; DNT/FM 428 intersection buildout continues through fall 2026. The single biggest scheduled improvement to Sutton Fields commutes.",
    source_url: "https://www.ntta.org/dallas-north-tollway-dnt",
    sort: 0,
  },
  {
    name: "DNT Phase 4B (FM 428 to Grayson County line)",
    status: "Unscheduled",
    eta_text: "No date published",
    detail: "Two-lane frontage roads come first; no mainlane construction schedule or contract award has been published. Watch NTTA for a 4B contract announcement.",
    source_url: "https://www.ntta.org/dallas-north-tollway-dnt",
    sort: 1,
  },
  {
    name: "FM 1385 widening (US 380 to FM 455)",
    status: "In design / ROW acquisition",
    eta_text: "Est. completion ~2032",
    detail: "TxDOT widening 12 miles of FM 1385 from two lanes to six. Right-of-way acquisition underway; estimated completion around September 2032. The road most Sutton Fields residents depend on stays two lanes for years.",
    source_url: "https://www.txdot.gov/projects/hearings-meetings/dallas/2023/fm1385-from-us380-to-fm455.html",
    sort: 2,
  },
  {
    name: "FM 428 realignment and widening",
    status: "Proposed / in design",
    eta_text: "TBD",
    detail: "TxDOT proposal to realign and widen FM 428 from Dallas Parkway to Preston Road (~1.8 mi): four 12-ft lanes (ultimate six), raised median, shared-use paths, and an overpass over the BNSF tracks. No construction or letting date published.",
    source_url: "https://www.keepitmovingdallas.com/FM428",
    sort: 3,
  },
  {
    name: "US 380 widening (Denton County)",
    status: "Wrapping up",
    eta_text: "Final work ~April 2026",
    detail: "$136M project from Loop 288 to the Collin County line: four to six lanes plus overpasses at Legacy Dr, Teel Pkwy, and FM 423/Gee Rd. Began 2022; final work expected to wrap April 2026. Collin County side remains unfunded (~$8B, no start date).",
    source_url: "https://communityimpact.com/dallas-fort-worth/prosper-celina/transportation/2026/04/22/relieving-the-pressure-136m-us-380-project-adds-overpasses-reduces-congestion/",
    sort: 4,
  },
  {
    name: "Legacy Drive widening (Celina)",
    status: "In design (~2 years)",
    eta_text: "Design complete ~2028",
    detail: "$2.56M design contract awarded May 2026: widen to four lanes (ultimate six) from Carey Rd to Punk Carter Pkwy, plus drainage and FM 428/Legacy intersection improvements (14 crashes in 4 years). Future roundabouts at Punk Carter and Carey.",
    source_url: "https://communityimpact.com/dallas-fort-worth/prosper-celina/transportation/2026/05/14/celina-officials-ok-26m-for-legacy-drive-designs/",
    sort: 5,
  },
  {
    name: "CR 52 reconstruction (West Outer Loop to FM 428)",
    status: "Active construction",
    eta_text: "Feb-Nov 2026",
    detail: "$2.62M full-depth reclamation and asphalt overlay with drainage upgrades. Phase 3 restricts FM 428 access (residents routed via West Outer Loop). Expect local detours through November 2026.",
    source_url: "https://communityimpact.com/dallas-fort-worth/prosper-celina/transportation/2026/06/15/fm-1515-widening-fm-428-closure-see-5-dfw-transportation-updates/",
    sort: 6,
  },
  {
    name: "Collin County Outer Loop Segment 3C (Custer Rd to US 75)",
    status: "Opened",
    eta_text: "Opened Nov 7, 2025",
    detail: "8.9 miles of new concrete roadway connecting Celina to McKinney/US 75, delivered more than three months early at $62.7M. A genuine east-west win for reaching US 75 without US 380.",
    source_url: "https://communityimpact.com/dallas-fort-worth/mckinney/transportation/2025/11/07/collin-county-completes-opens-outer-loop-connection-from-celina-to-mckinney/",
    sort: 7,
  },
];

async function main() {
  for (const s of SEEDS) {
    const existing = await sql`SELECT id FROM answers WHERE slug = ${s.slug}`;
    if (existing.length > 0) { console.log(`skip ${s.slug}`); continue; }
    await sql`INSERT INTO answers (slug, question, answer, category, sources, is_published, last_verified_at)
      VALUES (${s.slug}, ${s.question}, ${s.answer}, ${s.category}, ${JSON.stringify(s.sources)}, true, NOW())`;
    console.log(`seeded ${s.slug}`);
  }
  for (const r of ROADS) {
    const existing = await sql`SELECT id FROM road_projects WHERE name = ${r.name}`;
    if (existing.length > 0) { console.log(`skip road ${r.name}`); continue; }
    await sql`INSERT INTO road_projects (name, status, eta_text, detail, source_url, sort, last_updated)
      VALUES (${r.name}, ${r.status}, ${r.eta_text}, ${r.detail}, ${r.source_url}, ${r.sort}, NOW())`;
    console.log(`seeded road ${r.name}`);
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
