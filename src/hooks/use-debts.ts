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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["debts"] });
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
