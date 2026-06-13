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
import { parseDateInput } from "@/lib/date-utils";

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

const emptyDebtSummary = (): DebtSummary => ({
  borrowed: { unpaidAmount: 0, unpaidCount: 0 },
  lent: { unpaidAmount: 0, unpaidCount: 0 },
});

const debtListQueries = [
  { type: "borrowed", status: "unpaid" },
  { type: "borrowed", status: "paid" },
  { type: "lent", status: "unpaid" },
  { type: "lent", status: "paid" },
] as const satisfies DebtQuery[];

function buildOptimisticDebt(input: DebtInput): Debt {
  const now = new Date();
  return {
    id: `optimistic-${crypto.randomUUID()}`,
    userId: "",
    partnerName: input.partnerName,
    amount: input.amount,
    type: input.type,
    status: input.status ?? "unpaid",
    createdAt: parseDateInput(input.occurredOn),
    updatedAt: now,
  };
}

function snapshotDebtLists(queryClient: QueryClient) {
  return debtListQueries.map((query) => ({
    key: debtListKey(query),
    data: queryClient.getQueryData<DebtListData>(debtListKey(query)),
  }));
}

function restoreDebtListSnapshots(
  queryClient: QueryClient,
  snapshots: ReturnType<typeof snapshotDebtLists>,
) {
  for (const { key, data } of snapshots) {
    queryClient.setQueryData(key, data);
  }
}

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
): DebtListData {
  const base = data ?? { items: [], summary: emptyDebtSummary() };
  const summary = updateSummaryAfterCreate(base.summary, created);
  const shouldAddItem =
    created.type === listType && created.status === listStatus;

  return {
    summary,
    items: shouldAddItem ? [created, ...base.items] : base.items,
  };
}

function replaceOptimisticDebtInCaches(
  queryClient: QueryClient,
  optimisticId: string,
  created: Debt,
) {
  for (const query of debtListQueries) {
    queryClient.setQueryData<DebtListData>(debtListKey(query), (current) => {
      if (!current?.items.some((item) => item.id === optimisticId)) {
        return current;
      }

      return {
        ...current,
        items: current.items.map((item) =>
          item.id === optimisticId ? created : item,
        ),
      };
    });
  }

  queryClient.removeQueries({ queryKey: debtDetailKey(optimisticId) });
  queryClient.setQueryData(debtDetailKey(created.id), created);
}

export function updateListCachesAfterCreate(
  queryClient: QueryClient,
  created: Debt,
) {
  for (const query of debtListQueries) {
    queryClient.setQueryData<DebtListData>(
      debtListKey(query),
      (current) =>
        applyCreatedDebtToList(current, created, query.type, query.status),
    );
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
    onMutate: async (input) => {
      const optimistic = buildOptimisticDebt(input);
      const snapshots = snapshotDebtLists(qc);
      updateListCachesAfterCreate(qc, optimistic);
      qc.setQueryData(debtDetailKey(optimistic.id), optimistic);
      return { optimisticId: optimistic.id, snapshots };
    },
    onSuccess: (created, _input, context) => {
      if (!context) return;
      replaceOptimisticDebtInCaches(qc, context.optimisticId, created);
    },
    onError: (_error, _input, context) => {
      if (!context) return;
      restoreDebtListSnapshots(qc, context.snapshots);
      qc.removeQueries({ queryKey: debtDetailKey(context.optimisticId) });
      window.alert("登録に失敗しました。もう一度お試しください。");
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
