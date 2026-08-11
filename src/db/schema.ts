import {
  pgTable,
  text,
  boolean,
  timestamp,
  numeric,
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
