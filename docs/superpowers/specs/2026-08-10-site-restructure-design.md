# Sutton Fields Site Restructure — Design Spec

Date: 2026-08-10

## Context

The current site (`suttonfields.info`, this repo, deployed via Lovable today — moving to GitHub → Vercel) has a flat 6-item nav (Home, Community, Vendors, Events, News, Buy/Sell/Trade) plus Facebook. It already has real community data (schools, HOA docs, amenities, utilities, vendor directory) and a working AI-assisted news pipeline (admin pastes a URL → Gemini scrapes/summarizes/generates an image → draft → admin publish, in `src/app/api/news/{generate,publish}` + `src/app/admin/news`).

Source material for this redesign: a week of the neighborhood WhatsApp group (Aug 1–10, 2026). Recurring themes: vendor referrals (irrigation, HVAC, plumbing, electrical, flooring, concrete, lightning protection, tutoring/piano/swim), school coordination (Dan Christie Elementary, Rushing Middle, carpools, PTO events), pool/amenity access friction (Paxton app approval delays), lost & found, newcomer onboarding into WhatsApp sub-groups, and community-impact alerts (e.g. the nearby datacenter petition).

## Goal

A "completely new site design that's easier to navigate," restructured around what residents actually need, with a homepage that acts as a live dashboard rather than a static hero.

## Navigation: 5 hubs instead of a flat list

| Hub | Pages |
|---|---|
| **Home** | Dashboard (see below) |
| **Live Here** | Community overview, Schools, HOA docs/bylaws, Utilities, Amenities, **Newcomer Guide (new)** |
| **Get Help** | Vendor directory (expanded categories), Classifieds (existing Buy/Sell/Trade), **Lost & Found (new)**, **Carpool Board (new)** |
| **Stay Informed** | Daily News (new, see below), Community News (existing), **Community Alerts (new)**, Events |
| **Connect** | WhatsApp sub-group directory (new), Facebook link, HOA/committee contacts |

Each hub is a landing page with sub-nav to its pages, keeping the top bar at 5 items.

## Homepage dashboard

Read-only aggregator pulling the freshest item from each hub — it does not own content:

- **Daily News** strip at the top — 3-4 featured items from the automated pipeline (below)
- **Open requests** — latest 2-3 from Carpool Board + vendor "looking for" posts
- **Pool / amenity status** — admin-toggled open/closed, linking straight to the Paxton access steps
- **Latest local news / events** — next 2-3 upcoming from Events
- **Community alerts** — anything flagged urgent by an admin
- **New to the neighborhood?** — persistent card linking to the Newcomer Guide

## Daily News: automated pipeline

Extends the existing `articles` table/admin-review pattern rather than replacing it:

1. **Nightly crawl** (scheduled job) searches the web for news within ~30mi of Sutton Fields (Celina/Prosper/Frisco/McKinney) — no Twitter/X integration (ruled out: birdclaw.sh is a local personal archiving tool with no public API, and scraping/redistributing X content on a public site risks ToS violations).
2. **Draft generation** reuses the existing scrape → Gemini summarize → Gemini image pipeline (`src/app/api/news/generate`), refactored into a shared function callable both from the manual admin form and the nightly job.
3. Drafts save with `is_published: false`, tagged so the admin queue can filter "auto-drafted, pending review" separately from manually-pasted articles.
4. **Admin approves each morning** in the existing `src/app/admin/news` page (extended with a filter for pending auto-drafts) — nothing publishes without a human in the loop.

## New pages, briefly

- **Newcomer Guide** — how to join the community WhatsApp + its school/grade sub-groups, HOA registration, pool/Paxton access walkthrough.
- **Lost & Found** — simple post/browse board, same pattern as Buy/Sell/Trade.
- **Carpool Board** — post/browse requests for school runs (Rushing MS, etc.) and commutes (UTD, UNT, workplaces); same pattern as Buy/Sell/Trade.
- **Community Alerts** — admin-flagged urgent items (zoning/development notices, watering restrictions, safety).
- **WhatsApp group directory** (Connect hub) — list of sub-groups by school/grade/interest, so "is there a group for X" stops being a recurring question.
- **Vendor category expansion** — add categories surfaced repeatedly in chat: Irrigation/Sprinkler, HVAC, Plumbing, Electrical, Flooring, Concrete, Lightning Protection, Tutoring/Lessons, Childcare (extends existing `Home Services`/`Babysitting`/etc.).

## Explicitly out of scope

Personal fundraisers, national political petitions, general chit-chat, individual immigration questions — real WhatsApp volume, but not durable hub content, and publishing them risks the site looking like it endorses off-topic causes.

## Deployment

Repo already has a GitHub remote (`aroramit17/sutton-fields`) and is up to date on `main`. Work proceeds as commits on this repo; user connects Vercel to GitHub for hosting (replacing the current Lovable-hosted deployment) and pushes/manages that connection themselves.
