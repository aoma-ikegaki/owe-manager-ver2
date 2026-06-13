import type { AdapterAccount } from "next-auth/adapters";
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const debtTypeEnum = pgEnum("debt_type", ["borrowed", "lent"]);
export const debtStatusEnum = pgEnum("debt_status", ["unpaid", "paid"]);

// Auth-related tables (NextAuth defaults: user/account/session/verification_token)
export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  image: text("image"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .notNull()
    .defaultNow(),
});

export const account = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
    oauth_token_secret: text("oauth_token_secret"),
    oauth_token: text("oauth_token"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);

export const session = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationToken = pgTable(
  "verification_token",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compositePk: primaryKey(vt.identifier, vt.token),
  }),
);

// App table
export const debts = pgTable("debts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  partnerName: text("partner_name", { length: 50 }).notNull(),
  amount: integer("amount").notNull(),
  type: debtTypeEnum("type").notNull(),
  status: debtStatusEnum("status").notNull().default("unpaid"),
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow(),
});

export type Debt = typeof debts.$inferSelect;
export type InsertDebt = typeof debts.$inferInsert;

export const userRelations = relations(user, ({ many }) => ({
  debts: many(debts),
  account: many(account),
  session: many(session),
}));

export const debtsRelations = relations(debts, ({ one }) => ({
  user: one(user, {
    fields: [debts.userId],
    references: [user.id],
  }),
}));
