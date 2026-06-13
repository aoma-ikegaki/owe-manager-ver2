import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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

const listKey = (query?: DebtQuery) => [
  "debts",
  query?.type ?? "all",
  query?.status ?? "all",
];

export function useDebts(query: DebtQuery = {}) {
  return useQuery<{ items: Debt[]; summary: DebtSummary }>({
    queryKey: listKey(query),
    queryFn: () => fetchDebts(query),
  });
}

export function useDebt(id: string) {
  return useQuery<Debt>({
    queryKey: ["debt", id],
    queryFn: () => fetchDebt(id),
    enabled: Boolean(id),
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
      qc.invalidateQueries({ queryKey: ["debt", id] });
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
