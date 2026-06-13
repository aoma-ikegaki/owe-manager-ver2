import type { DebtQuery } from "@/lib/validation";

export function debtListKey(query?: DebtQuery) {
  return ["debts", query?.type ?? "all", query?.status ?? "all"] as const;
}

export function debtDetailKey(id: string) {
  return ["debt", id] as const;
}

export const HOME_DEBT_QUERIES = [
  { type: "borrowed", status: "unpaid" },
  { type: "lent", status: "unpaid" },
] as const satisfies readonly DebtQuery[];

export const HISTORY_DEBT_QUERIES = [
  { type: "borrowed", status: "paid" },
  { type: "lent", status: "paid" },
] as const satisfies readonly DebtQuery[];
