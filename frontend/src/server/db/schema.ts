import { index, pgTableCreator, varchar, timestamp, text, boolean } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `t3-app_${name}`);

export const users = createTable(
  "user",
  (d) => ({
    id: d.varchar({ length: 256 }).primaryKey(),
    email: d.varchar({ length: 255 }).notNull().unique(),
    emailVerified: d.boolean().default(false).notNull(),
    name: d.varchar({ length: 255 }),
    password: d.text(),
    image: d.text(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("email_idx").on(t.email)],
);

export const accounts = createTable("account", (d) => ({
  id: d.varchar({ length: 256 }).primaryKey(),
  userId: d
    .varchar({ length: 256 })
    .notNull()
    .references(() => users.id),
  type: d.varchar({ length: 255 }).notNull(),
  provider: d.varchar({ length: 255 }).notNull(),
  providerAccountId: d.varchar({ length: 255 }).notNull(),
  refreshToken: d.text(),
  accessToken: d.text(),
  expiresAt: d.integer(),
  tokenType: d.varchar({ length: 255 }),
  scope: d.text(),
  idToken: d.text(),
  sessionToken: d.varchar({ length: 255 }),
}));

export const sessions = createTable("session", (d) => ({
  id: d.varchar({ length: 256 }).primaryKey(),
  sessionToken: d.varchar({ length: 255 }).notNull().unique(),
  userId: d
    .varchar({ length: 256 })
    .notNull()
    .references(() => users.id),
  expires: d.timestamp({ withTimezone: true }).notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

export const verificationTokens = createTable("verificationToken", (d) => ({
  identifier: d.varchar({ length: 255 }).notNull(),
  token: d.varchar({ length: 255 }).notNull(),
  expires: d.timestamp({ withTimezone: true }).notNull(),
}));

export const tasks = createTable(
  "task",
  (d) => ({
    id: d.varchar({ length: 256 }).primaryKey(),
    userId: d
      .varchar({ length: 256 })
      .notNull()
      .references(() => users.id),
    title: d.varchar({ length: 255 }).notNull(),
    description: d.text(),
    completed: d.boolean().default(false).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("userId_idx").on(t.userId), index("completed_idx").on(t.completed)],
);
