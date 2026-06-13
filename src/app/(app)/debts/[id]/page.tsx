'use client';

import { useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { CheckCircle2, RotateCcw, Trash } from "lucide-react";
import { format } from "date-fns";
import { useDebt, useDeleteDebt, useUpdateDebt } from "@/hooks/use-debts";

export default function DebtDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id ?? "";
  const { data, isLoading } = useDebt(id);
  const updateMutation = useUpdateDebt(id);
  const deleteMutation = useDeleteDebt(id);

  const statusLabel = useMemo(
    () => (data?.status === "paid" ? "返済済み" : "未返済"),
    [data?.status],
  );

  const handleToggleStatus = async () => {
    if (!data) return;
    await updateMutation.mutateAsync({
      status: data.status === "paid" ? "unpaid" : "paid",
    });
  };

  const handleDelete = async () => {
    if (!data) return;
    const ok = window.confirm("この記録を削除しますか？");
    if (!ok) return;
    await deleteMutation.mutateAsync();
    router.replace("/home");
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 pb-24 pt-6">
        <p className="text-sm text-slate-500">読み込み中...</p>
      </div>
    );
  }

  const isBorrowed = data.type === "borrowed";

  return (
    <div className="min-h-screen bg-slate-50 px-5 pb-24 pt-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="text-sm font-semibold text-[var(--color-brand)]"
      >
        戻る
      </button>

      <div className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-600">
            {data.partnerName.at(0)}
          </div>
          <div>
            <p className="text-sm text-slate-500">
              {isBorrowed ? "借りた" : "貸した"}
            </p>
            <h1 className="text-xl font-semibold text-slate-900">
              {data.partnerName}
            </h1>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <p className="text-3xl font-bold text-slate-900">
            ￥{data.amount.toLocaleString("ja-JP")}
          </p>
          <p className="text-sm text-slate-500">
            借りた日:{" "}
            {data.createdAt
              ? format(new Date(data.createdAt), "yyyy/MM/dd")
              : "-"}
          </p>
          <p className="text-sm text-slate-500">
            ステータス: {statusLabel}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={handleToggleStatus}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-semibold text-white shadow-md transition ${
              data.status === "paid"
                ? "bg-slate-700 hover:bg-slate-800"
                : "bg-[var(--color-brand)] hover:bg-[var(--color-brand-strong)]"
            }`}
          >
            {data.status === "paid" ? (
              <>
                <RotateCcw className="h-5 w-5" />
                未返済に戻す
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                返済済みにする
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/debts/${data.id}/edit`)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base font-semibold text-slate-800 transition hover:bg-slate-50"
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
    </div>
  );
}
