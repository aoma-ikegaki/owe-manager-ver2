import "server-only";
import { getSummary, listDebts } from "@/lib/debt-service";
import type { DebtQuery } from "@/lib/validation";

export async function fetchDebtsData(userId: string, query: DebtQuery = {}) {
  const [items, summary] = await Promise.all([
    listDebts(userId, query),
    getSummary(userId),
  ]);

  return { items, summary };
}
