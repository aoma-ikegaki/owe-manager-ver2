import "server-only";
import type { QueryClient } from "@tanstack/react-query";
import { getSummary, listDebts } from "@/lib/debt-service";
import { debtListKey } from "@/lib/debts-query-keys";
import type { DebtQuery } from "@/lib/validation";

export async function fetchDebtsData(userId: string, query: DebtQuery = {}) {
  const [items, summary] = await Promise.all([
    listDebts(userId, query),
    getSummary(userId),
  ]);

  return { items, summary };
}

export async function prefetchDebtsForUser(
  queryClient: QueryClient,
  userId: string,
  queries: readonly DebtQuery[],
) {
  await Promise.all(
    queries.map((query) =>
      queryClient.prefetchQuery({
        queryKey: debtListKey(query),
        queryFn: () => fetchDebtsData(userId, query),
      }),
    ),
  );
}
