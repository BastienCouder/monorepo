import { integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 50 }).default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const sessionsTable = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  refreshToken: text('refresh_token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
});

