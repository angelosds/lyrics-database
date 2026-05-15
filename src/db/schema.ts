import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

export const songs = pgTable("songs", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  lyrics: text("lyrics").notNull(),
  interprete: text("album"),
  year: integer("year"),
  key: text("key"),
  bpm: integer("bpm"),
  notes: text("notes"),
  archived: boolean("archived").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const setlists = pgTable("setlists", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  eventDate: date("event_date"),
  venue: text("venue"),
  publicSlug: text("public_slug").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const setlistSongs = pgTable("setlist_songs", {
  id: uuid("id").primaryKey().defaultRandom(),
  setlistId: uuid("setlist_id")
    .references(() => setlists.id, { onDelete: "cascade" })
    .notNull(),
  songId: uuid("song_id")
    .references(() => songs.id, { onDelete: "cascade" })
    .notNull(),
  position: integer("position").notNull(),
  notes: text("notes"),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Song = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;
export type Setlist = typeof setlists.$inferSelect;
export type NewSetlist = typeof setlists.$inferInsert;
export type SetlistSong = typeof setlistSongs.$inferSelect;
export type User = typeof users.$inferSelect;
