'use client';

import { useMemo, type ReactNode } from "react";
import { useRouter, useParams } from "next/navigation";
import { Trash } from "lucide-react";
import { format } from "date-fns";
import clsx from "clsx";
import { BackButton } from "@/components/back-button";
import { useDebt, useDeleteDebt, useUpdateDebt } from "@/hooks/use-debts";
import { DebtDetailSkeleton } from "@/components/ui/loading-skeleton";

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <span className="text-base text-slate-500">{label}</span>
      <div className="text-base font-medium text-slate-900">{children}</div>
    </div>
  );
}

export default function DebtDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id ?? "";
  const { data } = useDebt(id);
  const updateMutation = useUpdateDebt(id);
  const deleteMutation = useDeleteDebt(id);

  const statusLabel = useMemo(
    () => (data?.status === "paid" ? "返済済み" : "未返済"),
    [data?.status],
  );

  const handleToggleStatus = () => {
    if (!data) return;
    updateMutation.mutate({
      status: data.status === "paid" ? "unpaid" : "paid",
    });
  };

  const handleDelete = () => {
    if (!data) return;
    const ok = window.confirm("この記録を削除しますか？");
    if (!ok) return;
    deleteMutation.mutate();
    router.replace("/home");
  };

  if (!data) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-slate-50 px-5 pb-24 pt-6">
        <BackButton />
        <DebtDetailSkeleton />
      </div>
    );
  }

  const isBorrowed = data.type === "borrowed";

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-slate-50 px-5 pb-24 pt-6">
      <BackButton />

      <div className="mt-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900">{data.partnerName}</h1>
        <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-[var(--color-brand)]">
          {isBorrowed ? "借りた" : "貸した"}
        </span>
        <p className="mt-6 text-5xl font-bold text-slate-900">
          ￥{data.amount.toLocaleString("ja-JP")}
        </p>
      </div>

      <div className="mt-8 divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
        <DetailRow label={isBorrowed ? "借りた日" : "貸した日"}>
          {data.createdAt
            ? format(new Date(data.createdAt), "yyyy/MM/dd")
            : "-"}
        </DetailRow>
        <DetailRow label="ステータス">
          <span
            className={clsx(
              "inline-flex rounded-full px-3 py-1 text-sm font-semibold",
              data.status === "paid"
                ? "bg-slate-100 text-slate-600"
                : "bg-[var(--color-brand)] text-white",
            )}
          >
            {statusLabel}
          </span>
        </DetailRow>
      </div>

      <div className="mt-auto space-y-3 pt-8">
        <button
          type="button"
          onClick={handleToggleStatus}
          className={clsx(
            "flex w-full items-center justify-center rounded-xl px-4 py-3 text-base font-semibold text-white shadow-md transition disabled:opacity-60",
            data.status === "paid"
              ? "bg-slate-700 hover:bg-slate-800"
              : "bg-[var(--color-brand)] hover:bg-[var(--color-brand-strong)]",
          )}
        >
          {data.status === "paid" ? "未返済に戻す" : "返済済みにする"}
        </button>

        <button
          type="button"
          onClick={() => router.push(`/debts/${data.id}/edit`)}
          className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-base font-semibold text-slate-800 transition hover:bg-slate-50"
        >
          編集する
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base font-semibold text-red-700 transition hover:bg-red-100"
        >
          <Trash className="h-5 w-5" />
          削除する
        </button>
      </div>
    </div>
  );
}
