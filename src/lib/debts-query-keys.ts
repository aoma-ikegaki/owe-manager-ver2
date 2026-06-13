import type { DebtQuery } from "@/lib/validation";

export function debtListKey(query?: DebtQuery) {
  return ["debts", query?.type ?? "all", query?.status ?? "all"] as const;
}

export function debtDetailKey(id: string) {
  return ["debt", id] as const;
}
