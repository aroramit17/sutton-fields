import {
  pgTable,
  text,
  boolean,
  timestamp,
  numeric,
  integer,
  uuid,
} from "drizzle-orm/pg-core";

// JS property names are snake_case on purpose, matching src/types/database.ts
// and every existing component's field access (profile.first_name, etc.) —
// only the DB column names need to be valid SQL identifiers, not the JS keys.

// id is the Clerk user id (e.g. "user_2abc..."), not a generated uuid —
// Clerk owns identity, this table only tracks resident-verification state.
export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  is_approved: boolean("is_approved").notNull().default(false),
  is_admin: boolean("is_admin").notNull().default(false),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  source_url: text("source_url").notNull(),
  source_title: text("source_title"),
  image_url: text("image_url"),
  category: text("category").notNull().default("Community"),
  // At most one article should carry this at a time (enforced by
  // setFeaturedArticle, not the DB) — it becomes the homepage lead story.
  is_featured: boolean("is_featured").notNull().default(false),
  is_published: boolean("is_published").notNull().default(false),
  published_at: timestamp("published_at", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: text("created_by").references(() => profiles.id, { onDelete: "set null" }),
});

export const listings = pgTable("listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  location: text("location").notNull(),
  images: text("images").array().notNull().default([]),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
  deactivated_at: timestamp("deactivated_at", { withTimezone: true }),
});

export const lost_found_posts = pgTable("lost_found_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["lost", "found"] }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  images: text("images").array().notNull().default([]),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
  deactivated_at: timestamp("deactivated_at", { withTimezone: true }),
});

export const carpool_posts = pgTable("carpool_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  destination: text("destination").notNull(),
  schedule: text("schedule").notNull(),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
  deactivated_at: timestamp("deactivated_at", { withTimezone: true }),
});

export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  message: text("message").notNull(),
  link_url: text("link_url"),
  link_label: text("link_label"),
  is_active: boolean("is_active").notNull().default(false),
  created_by: text("created_by").references(() => profiles.id, { onDelete: "set null" }),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  event_date: timestamp("event_date", { withTimezone: true }).notNull(),
  // Wilson Weekly extraction only ever produces a date, never a real time —
  // without this flag the UI showed a misleading "12:00 AM" for every one.
  has_time: boolean("has_time").notNull().default(true),
  location: text("location"),
  image_url: text("image_url"),
  is_published: boolean("is_published").notNull().default(true),
  source: text("source", { enum: ["manual", "wilson_weekly"] }).notNull().default("manual"),
  created_by: text("created_by").references(() => profiles.id, { onDelete: "set null" }),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Tracks which AgentMail messages the nightly Wilson Weekly scan has already
// turned into events, so re-running the scan doesn't reprocess old emails.
export const wilson_weekly_processed = pgTable("wilson_weekly_processed", {
  message_id: text("message_id").primaryKey(),
  events_created: integer("events_created").notNull().default(0),
  processed_at: timestamp("processed_at", { withTimezone: true }).notNull().defaultNow(),
});

// The Thursday Dispatch mailing list. Deliberately not tied to profiles —
// digest signup is single opt-in with no account, lower friction than
// resident verification. unsubscribe_token gates one-click unsubscribe.
export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  unsubscribe_token: uuid("unsubscribe_token").notNull().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  unsubscribed_at: timestamp("unsubscribed_at", { withTimezone: true }),
});

// Homepage "Board" utility chips (pool / trash / water / roads). Key-value by
// design: chips are few, fixed, and admin-curated; the school chip is derived
// from events at render time rather than stored here.
export const board_status = pgTable("board_status", {
  key: text("key", { enum: ["pool", "trash", "water", "roads"] }).primaryKey(),
  value: text("value").notNull(),
  note: text("note"),
  tone: text("tone", { enum: ["ok", "warn", "alert", "unknown"] }).notNull().default("unknown"),
  link_url: text("link_url"),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
