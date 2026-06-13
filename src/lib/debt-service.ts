import { and, count, desc, eq, sum } from "drizzle-orm";
import { db } from "@/db/client";
import { debts, debtStatusEnum, debtTypeEnum } from "@/db/schema";
import type { DebtInput, DebtQuery } from "./validation";

export async function listDebts(userId: string, query: DebtQuery = {}) {
  const conditions = [eq(debts.userId, userId)];
  if (query.type) conditions.push(eq(debts.type, query.type));
  if (query.status) conditions.push(eq(debts.status, query.status));

  return db
    .select()
    .from(debts)
    .where(and(...conditions))
    .orderBy(desc(debts.createdAt));
}

export async function getDebt(id: string, userId: string) {
  const rows = await db
    .select()
    .from(debts)
    .where(and(eq(debts.id, id), eq(debts.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function createDebt(userId: string, input: DebtInput) {
  const [record] = await db
    .insert(debts)
    .values({
      userId,
      partnerName: input.partnerName,
      amount: input.amount,
      type: input.type,
      status: input.status ?? "unpaid",
    })
    .returning();
  return record;
}

export async function updateDebt(
  id: string,
  userId: string,
  input: Partial<DebtInput>,
) {
  const updates: Partial<typeof debts.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (input.partnerName !== undefined) updates.partnerName = input.partnerName;
  if (input.amount !== undefined) updates.amount = input.amount;
  if (input.type !== undefined) updates.type = input.type;
  if (input.status !== undefined) updates.status = input.status;

  const [updated] = await db
    .update(debts)
    .set(updates)
    .where(and(eq(debts.id, id), eq(debts.userId, userId)))
    .returning();
  return updated;
}

export async function deleteDebt(id: string, userId: string) {
  const [deleted] = await db
    .delete(debts)
    .where(and(eq(debts.id, id), eq(debts.userId, userId)))
    .returning({ id: debts.id });
  return deleted;
}

export async function getSummary(userId: string) {
  const rows = await db
    .select({
      type: debts.type,
      status: debts.status,
      total: sum(debts.amount).mapWith(Number),
      count: count().mapWith(Number),
    })
    .from(debts)
    .where(eq(debts.userId, userId))
    .groupBy(debts.type, debts.status);

  const base = {
    borrowed: { unpaidAmount: 0, unpaidCount: 0 },
    lent: { unpaidAmount: 0, unpaidCount: 0 },
  };

  for (const row of rows) {
    if (row.status === "unpaid") {
      base[row.type].unpaidAmount = row.total ?? 0;
      base[row.type].unpaidCount = row.count ?? 0;
    }
  }

  return base;
}

export function validateType(value: string) {
  return debtTypeEnum.enumValues.includes(value as (typeof debtTypeEnum.enumValues)[number]);
}

export function validateStatus(value: string) {
  return debtStatusEnum.enumValues.includes(
    value as (typeof debtStatusEnum.enumValues)[number],
  );
}
