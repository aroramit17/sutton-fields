import { Resend } from "resend";
import { and, asc, desc, eq, gte, isNull, lt, ne, isNotNull } from "drizzle-orm";
import { getDb } from "@/db";
import {
  articles,
  events,
  answers,
  listings,
  lost_found_posts,
  board_status,
  subscribers,
  dispatch_issues,
} from "@/db/schema";
import { getTrashChip } from "@/data/trash";

// The Thursday Dispatch: the weekly email digest. assembleDispatch() builds a
// full HTML snapshot from the last 7 days of site content; sendDispatch()
// stores that snapshot as a dispatch_issues row and mails it to every active
// subscriber through Resend.
//
// XSS guard: this file is escape-by-construction. Every dynamic value that
// enters the HTML (titles, notes, values — anything not authored here) passes
// through esc(). The stored snapshot is therefore safe to render anywhere
// without a downstream sanitizer.

const SITE_URL = "https://suttonfields.info";
const UNSUB_PLACEHOLDER = "{{UNSUB_URL}}";
const BATCH_SIZE = 50;

// Until suttonfields.info is verified in Resend, only onboarding@resend.dev
// can send (and only to the Resend account owner's address). Set DISPATCH_FROM
// to "The Thursday Dispatch <dispatch@suttonfields.info>" after DNS verifies.
function fromAddress(): string {
  return process.env.DISPATCH_FROM ?? "The Thursday Dispatch <onboarding@resend.dev>";
}

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ---------------------------------------------------------------------------
// Assembly

const INK = "#171512";
const PAPER = "#faf8f4";
const ACCENT = "#b3410e";
const MUTED = "#6b655c";
const HAIRLINE = "#e3ddd2";

function fmtDate(d: Date, tz: string): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: tz,
  });
}

function fmtTime(d: Date): string {
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
  });
}

function sectionHeader(label: string, color: string): string {
  return `<tr><td style="padding:28px 32px 8px;">
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${color};border-bottom:2px solid ${color};padding-bottom:6px;">${esc(label)}</div>
  </td></tr>`;
}

function itemRow(inner: string): string {
  return `<tr><td style="padding:10px 32px 0;">${inner}</td></tr>`;
}

export interface AssembledDispatch {
  subject: string;
  html: string;
  isEmpty: boolean;
}

export async function assembleDispatch(): Promise<AssembledDispatch> {
  const db = getDb();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
  const startOfToday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const weekAhead = new Date(startOfToday.getTime() + 8 * 24 * 3600 * 1000);

  // Lead story: pinned featured article, else latest published.
  const [pinned] = await db
    .select()
    .from(articles)
    .where(and(eq(articles.is_published, true), eq(articles.is_featured, true)))
    .limit(1);
  const [latest] = pinned
    ? [pinned]
    : await db
        .select()
        .from(articles)
        .where(eq(articles.is_published, true))
        .orderBy(desc(articles.published_at))
        .limit(1);
  const lead = latest ?? null;

  const moreNews = lead
    ? await db
        .select()
        .from(articles)
        .where(
          and(
            eq(articles.is_published, true),
            gte(articles.published_at, weekAgo),
            ne(articles.id, lead.id)
          )
        )
        .orderBy(desc(articles.published_at))
        .limit(4)
    : [];

  const weekEvents = await db
    .select()
    .from(events)
    .where(
      and(
        eq(events.is_published, true),
        gte(events.event_date, startOfToday),
        lt(events.event_date, weekAhead)
      )
    )
    .orderBy(asc(events.event_date))
    .limit(8);

  const freshAnswers = await db
    .select()
    .from(answers)
    .where(and(eq(answers.is_published, true), gte(answers.last_verified_at, weekAgo)))
    .orderBy(desc(answers.last_verified_at))
    .limit(5);

  const newListings = await db
    .select()
    .from(listings)
    .where(and(eq(listings.is_active, true), gte(listings.created_at, weekAgo)))
    .orderBy(desc(listings.created_at))
    .limit(5);

  const newLostFound = await db
    .select()
    .from(lost_found_posts)
    .where(and(eq(lost_found_posts.is_active, true), gte(lost_found_posts.created_at, weekAgo)))
    .orderBy(desc(lost_found_posts.created_at))
    .limit(5);

  const boardRows = await db.select().from(board_status);
  const trash = getTrashChip();

  const issueDate = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago",
  });
  const subject = `The Thursday Dispatch: ${issueDate}`;

  const parts: string[] = [];

  // Masthead
  parts.push(`<tr><td style="padding:36px 32px 0;text-align:center;">
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${MUTED};">An independent, resident-run weekly</div>
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:bold;color:${INK};padding:8px 0 4px;">The Thursday Dispatch</div>
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${MUTED};">Sutton Fields · ${esc(issueDate)}</div>
    <div style="border-bottom:3px solid ${INK};margin-top:16px;"></div>
  </td></tr>`);

  // Lead story
  if (lead) {
    parts.push(`<tr><td style="padding:28px 32px 0;">
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${ACCENT};">Lead story</div>
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:bold;line-height:1.2;color:${INK};padding:8px 0;">
        <a href="${esc(lead.source_url)}" style="color:${INK};text-decoration:none;">${esc(lead.title)}</a>
      </div>
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.55;color:${INK};">${esc(lead.summary)}</div>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;padding-top:8px;">
        <a href="${esc(lead.source_url)}" style="color:${ACCENT};font-weight:bold;text-decoration:none;">Read the full story &rarr;</a>
      </div>
    </td></tr>`);
  }

  // More news
  if (moreNews.length > 0) {
    parts.push(sectionHeader("The Wire", ACCENT));
    for (const a of moreNews) {
      parts.push(
        itemRow(`<div style="font-family:Georgia,'Times New Roman',serif;font-size:17px;font-weight:bold;line-height:1.3;">
          <a href="${esc(a.source_url)}" style="color:${INK};text-decoration:none;">${esc(a.title)}</a>
        </div>
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${MUTED};padding-top:2px;">${esc(a.category)}</div>`)
      );
    }
  }

  // This week's events
  if (weekEvents.length > 0) {
    parts.push(sectionHeader("This Week", "#1f6f43"));
    for (const e of weekEvents) {
      const tz = e.has_time ? "America/Chicago" : "UTC";
      const when = e.has_time
        ? `${fmtDate(e.event_date, tz)} · ${fmtTime(e.event_date)}`
        : fmtDate(e.event_date, tz);
      parts.push(
        itemRow(`<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#1f6f43;">${esc(when)}${e.location ? ` · ${esc(e.location)}` : ""}</div>
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:17px;font-weight:bold;color:${INK};line-height:1.3;">${esc(e.title)}</div>`)
      );
    }
    parts.push(
      itemRow(`<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;padding-top:4px;">
        <a href="${SITE_URL}/events" style="color:${ACCENT};font-weight:bold;text-decoration:none;">Full calendar &rarr;</a>
      </div>`)
    );
  }

  // The Board snapshot
  const chips: Array<{ label: string; value: string; note: string | null }> = [];
  chips.push({ label: "Trash", value: trash.value, note: trash.note });
  for (const row of boardRows) {
    if (row.key === "trash") {
      chips[0] = { label: "Trash", value: row.value, note: row.note };
      continue;
    }
    if (row.tone === "unknown") continue;
    chips.push({
      label: row.key.charAt(0).toUpperCase() + row.key.slice(1),
      value: row.value,
      note: row.note,
    });
  }
  if (chips.length > 0) {
    parts.push(sectionHeader("The Board", INK));
    const cells = chips
      .map(
        (c) => `<td style="padding:10px 12px;border:1px solid ${HAIRLINE};background:#ffffff;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${MUTED};">${esc(c.label)}</div>
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:${INK};padding-top:2px;">${esc(c.value)}</div>
          ${c.note ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${MUTED};padding-top:2px;">${esc(c.note)}</div>` : ""}
        </td>`
      )
      .join('<td style="width:8px;"></td>');
    parts.push(
      itemRow(`<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;"><tr>${cells}</tr></table>`)
    );
  }

  // Answers verified this week
  if (freshAnswers.length > 0) {
    parts.push(sectionHeader("From the Answers Desk", "#8a4baf"));
    for (const a of freshAnswers) {
      parts.push(
        itemRow(`<div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:bold;line-height:1.3;">
          <a href="${SITE_URL}/answers/${esc(a.slug)}" style="color:${INK};text-decoration:none;">${esc(a.question)}</a>
        </div>
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${MUTED};padding-top:2px;">Verified ${esc(fmtDate(a.last_verified_at, "America/Chicago"))}</div>`)
      );
    }
  }

  // Classifieds
  if (newListings.length > 0 || newLostFound.length > 0) {
    parts.push(sectionHeader("Classifieds", "#a3690e"));
    for (const l of newListings) {
      parts.push(
        itemRow(`<div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:bold;color:${INK};line-height:1.3;">
          <a href="${SITE_URL}/classifieds" style="color:${INK};text-decoration:none;">${esc(l.title)}</a>
          <span style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#a3690e;font-weight:bold;"> · $${esc(String(l.price))}</span>
        </div>`)
      );
    }
    for (const p of newLostFound) {
      parts.push(
        itemRow(`<div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:bold;color:${INK};line-height:1.3;">
          <span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:${p.status === "lost" ? ACCENT : "#1f6f43"};">${p.status === "lost" ? "Lost" : "Found"}</span>
          <a href="${SITE_URL}/classifieds?tab=lost-found" style="color:${INK};text-decoration:none;"> ${esc(p.title)}</a>
        </div>`)
      );
    }
  }

  // Footer
  parts.push(`<tr><td style="padding:32px 32px 40px;">
    <div style="border-top:1px solid ${HAIRLINE};padding-top:16px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${MUTED};">
      You are getting this because you signed up at <a href="${SITE_URL}" style="color:${ACCENT};">suttonfields.info</a>,
      an independent, resident-run site. Not affiliated with the HOA, Essex Association Management, or Centurion American.<br/>
      <a href="${UNSUB_PLACEHOLDER}" style="color:${MUTED};">Unsubscribe</a> ·
      <a href="${SITE_URL}/dispatch" style="color:${MUTED};">Past issues</a>
    </div>
  </td></tr>`);

  const html = `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:${PAPER};padding:0;margin:0;"><tr><td align="center">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${PAPER};">
      ${parts.join("\n")}
    </table>
  </td></tr></table>`;

  const isEmpty = !lead && weekEvents.length === 0 && moreNews.length === 0;
  return { subject, html, isEmpty };
}

// ---------------------------------------------------------------------------
// Send

export interface SendResult {
  sent: number;
  failed: number;
  skipped?: string;
  issueId?: string;
  test?: boolean;
}

export async function sendDispatch(options?: { testTo?: string }): Promise<SendResult> {
  const assembled = await assembleDispatch();

  // Test sends go to one address, substitute the unsubscribe link with the
  // homepage, and leave no issue row behind.
  if (options?.testTo) {
    const resend = getResend();
    const { error } = await resend.emails.send({
      from: fromAddress(),
      to: options.testTo,
      subject: `[TEST] ${assembled.subject}`,
      html: assembled.html.replaceAll(UNSUB_PLACEHOLDER, SITE_URL),
    });
    if (error) throw new Error(`Resend: ${error.message}`);
    return { sent: 1, failed: 0, test: true };
  }

  const db = getDb();

  // Idempotency: one issue per week, even if the cron fires twice.
  const sixDaysAgo = new Date(Date.now() - 6 * 24 * 3600 * 1000);
  const [recent] = await db
    .select({ id: dispatch_issues.id })
    .from(dispatch_issues)
    .where(and(isNotNull(dispatch_issues.sent_at), gte(dispatch_issues.sent_at, sixDaysAgo)))
    .limit(1);
  if (recent) {
    return { sent: 0, failed: 0, skipped: "An issue already went out in the past 6 days" };
  }

  if (assembled.isEmpty) {
    return { sent: 0, failed: 0, skipped: "Nothing to send: no lead story, news, or events" };
  }

  const active = await db
    .select({ email: subscribers.email, token: subscribers.unsubscribe_token })
    .from(subscribers)
    .where(isNull(subscribers.unsubscribed_at));
  if (active.length === 0) {
    return { sent: 0, failed: 0, skipped: "No active subscribers" };
  }

  // Snapshot first so a mid-send crash still leaves a record of what went out.
  const [issue] = await db
    .insert(dispatch_issues)
    .values({ subject: assembled.subject, html: assembled.html })
    .returning({ id: dispatch_issues.id });

  const resend = getResend();
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < active.length; i += BATCH_SIZE) {
    const chunk = active.slice(i, i + BATCH_SIZE);
    try {
      const { data, error } = await resend.batch.send(
        chunk.map((s) => ({
          from: fromAddress(),
          to: s.email,
          subject: assembled.subject,
          html: assembled.html.replaceAll(
            UNSUB_PLACEHOLDER,
            `${SITE_URL}/unsubscribe/${s.token}`
          ),
        }))
      );
      if (error) {
        failed += chunk.length;
        console.error(`Dispatch batch ${i / BATCH_SIZE} failed:`, error.message);
      } else {
        sent += data?.data.length ?? chunk.length;
      }
    } catch (err) {
      failed += chunk.length;
      console.error(`Dispatch batch ${i / BATCH_SIZE} threw:`, err);
    }
  }

  await db
    .update(dispatch_issues)
    .set({ sent_at: new Date(), recipient_count: sent, failure_count: failed })
    .where(eq(dispatch_issues.id, issue.id));

  return { sent, failed, issueId: issue.id };
}
