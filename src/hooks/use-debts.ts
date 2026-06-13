import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import {
  createDebt,
  deleteDebtApi,
  fetchDebt,
  fetchDebts,
  updateDebt,
  type DebtSummary,
} from "@/lib/api";
import type { Debt } from "@/db/schema";
import type { DebtInput, DebtQuery } from "@/lib/validation";

export const debtListKey = (query?: DebtQuery) => [
  "debts",
  query?.type ?? "all",
  query?.status ?? "all",
];

export const debtDetailKey = (id: string) => ["debt", id] as const;

export function prefetchDebtList(
  queryClient: QueryClient,
  query: DebtQuery,
) {
  return queryClient.prefetchQuery({
    queryKey: debtListKey(query),
    queryFn: () => fetchDebts(query),
  });
}

export function prefetchDebtDetail(queryClient: QueryClient, id: string) {
  if (!id) return Promise.resolve();
  return queryClient.prefetchQuery({
    queryKey: debtDetailKey(id),
    queryFn: () => fetchDebt(id),
  });
}

export function usePrefetchDebtLists(status: DebtQuery["status"]) {
  const queryClient = useQueryClient();

  useEffect(() => {
    void prefetchDebtList(queryClient, { type: "borrowed", status });
    void prefetchDebtList(queryClient, { type: "lent", status });
  }, [queryClient, status]);
}

type DebtListData = { items: Debt[]; summary: DebtSummary };

function updateSummaryAfterCreate(
  summary: DebtSummary,
  created: Debt,
): DebtSummary {
  if (created.status !== "unpaid") return summary;

  return {
    ...summary,
    [created.type]: {
      unpaidAmount: summary[created.type].unpaidAmount + created.amount,
      unpaidCount: summary[created.type].unpaidCount + 1,
    },
  };
}

function applyCreatedDebtToList(
  data: DebtListData | undefined,
  created: Debt,
  listType: Debt["type"],
  listStatus: Debt["status"],
): DebtListData | undefined {
  if (!data) return data;

  const summary = updateSummaryAfterCreate(data.summary, created);
  const shouldAddItem =
    created.type === listType && created.status === listStatus;

  return {
    summary,
    items: shouldAddItem ? [created, ...data.items] : data.items,
  };
}

export function updateListCachesAfterCreate(
  queryClient: QueryClient,
  created: Debt,
) {
  const types = ["borrowed", "lent"] as const;
  const statuses = ["unpaid", "paid"] as const;

  for (const type of types) {
    for (const status of statuses) {
      queryClient.setQueryData<DebtListData>(
        debtListKey({ type, status }),
        (current) => applyCreatedDebtToList(current, created, type, status),
      );
    }
  }

  queryClient.setQueryData(debtDetailKey(created.id), created);
}

export function useDebts(query: DebtQuery = {}) {
  return useQuery<{ items: Debt[]; summary: DebtSummary }>({
    queryKey: debtListKey(query),
    queryFn: () => fetchDebts(query),
    placeholderData: (previousData) => previousData,
  });
}

export function useDebt(id: string) {
  return useQuery<Debt>({
    queryKey: debtDetailKey(id),
    queryFn: () => fetchDebt(id),
    enabled: Boolean(id),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateDebt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createDebt,
    onSuccess: (created) => {
      updateListCachesAfterCreate(qc, created);
    },
  });
}

export function useUpdateDebt(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<DebtInput>) => updateDebt(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["debts"] });
      qc.invalidateQueries({ queryKey: debtDetailKey(id) });
    },
  });
}

export function useDeleteDebt(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => deleteDebtApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["debts"] });
    },
  });
}
