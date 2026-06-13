import type { Debt } from "@/db/schema";
import type { DebtInput, DebtQuery } from "./validation";

export type DebtSummary = {
  borrowed: { unpaidAmount: number; unpaidCount: number };
  lent: { unpaidAmount: number; unpaidCount: number };
};

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "エラーが発生しました");
  }
  return res.json();
}

export async function fetchDebts(query: DebtQuery = {}) {
  const params = new URLSearchParams();
  if (query.type) params.set("type", query.type);
  if (query.status) params.set("status", query.status);

  const res = await fetch(`/api/debts?${params.toString()}`, {
    cache: "no-store",
  });
  return handle<{ items: Debt[]; summary: DebtSummary }>(res);
}

export async function fetchDebt(id: string) {
  const res = await fetch(`/api/debts/${id}`, { cache: "no-store" });
  return handle<Debt>(res);
}

export async function createDebt(payload: DebtInput) {
  const res = await fetch("/api/debts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle<Debt>(res);
}

export async function updateDebt(id: string, payload: Partial<DebtInput>) {
  const res = await fetch(`/api/debts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle<Debt>(res);
}

export async function deleteDebtApi(id: string) {
  const res = await fetch(`/api/debts/${id}`, {
    method: "DELETE",
  });
  return handle<{ id: string }>(res);
}
