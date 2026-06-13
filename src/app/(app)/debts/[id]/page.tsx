'use client';

import { Suspense, useMemo, useState, type ReactNode } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Trash, Check, Clock3 } from "lucide-react";
import { format } from "date-fns";
import clsx from "clsx";
import { BackButton } from "@/components/back-button";
import { useDebt, useDeleteDebt, useUpdateDebt } from "@/hooks/use-debts";
import { DebtDetailSkeleton } from "@/components/ui/loading-skeleton";
import { ConfirmBottomSheet } from "@/components/ui/confirm-bottom-sheet";

const CHECK_FEEDBACK_MS = 320;
const COMPLETION_HOLD_MS = 360;

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

function DebtDetailPageContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params?.id ?? "";
  const fromHistory = searchParams.get("from") === "history";
  const { data } = useDebt(id);
  const updateMutation = useUpdateDebt(id);
  const deleteMutation = useDeleteDebt(id);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [paidFeedbackActive, setPaidFeedbackActive] = useState(false);
  const [unpaidFeedbackActive, setUnpaidFeedbackActive] = useState(false);

  const statusFeedbackActive = paidFeedbackActive || unpaidFeedbackActive;
  const showPaidState =
    paidFeedbackActive || (!unpaidFeedbackActive && data?.status === "paid");
  const statusLabel = useMemo(
    () => (showPaidState ? "返済済み" : "未返済"),
    [showPaidState],
  );

  const handleToggleStatus = () => {
    if (!data || statusFeedbackActive) return;

    const markingUnpaid = data.status === "paid";

    if (markingUnpaid) {
      setUnpaidFeedbackActive(true);
      window.setTimeout(() => {
        router.replace(fromHistory ? "/history" : "/home");
        updateMutation.mutate({ status: "unpaid" });
      }, CHECK_FEEDBACK_MS + COMPLETION_HOLD_MS);
      return;
    }

    setPaidFeedbackActive(true);
    window.setTimeout(() => {
      router.replace("/home");
      updateMutation.mutate({ status: "paid" });
    }, CHECK_FEEDBACK_MS + COMPLETION_HOLD_MS);
  };

  const handleConfirmDelete = () => {
    if (!data) return;
    setDeleteConfirmOpen(false);
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

      <div
        className={clsx(
          "mt-8 divide-y divide-slate-100 rounded-2xl bg-white shadow-sm transition-colors duration-300",
          paidFeedbackActive && "border border-emerald-200 bg-emerald-50/60",
        )}
      >
        <DetailRow label={isBorrowed ? "借りた日" : "貸した日"}>
          {data.createdAt
            ? format(new Date(data.createdAt), "yyyy/MM/dd")
            : "-"}
        </DetailRow>
        <DetailRow label="ステータス">
          <span
            className={clsx(
              "inline-flex rounded-full px-3 py-1 text-sm font-semibold transition-colors duration-300",
              paidFeedbackActive
                ? "bg-emerald-100 text-[var(--color-brand-strong)] animate-pop-in"
                : unpaidFeedbackActive
                  ? "bg-[var(--color-brand)] text-white animate-pop-in"
                  : data.status === "paid"
                    ? "bg-slate-100 text-slate-600"
                    : "bg-[var(--color-brand)] text-white",
            )}
          >
            {statusLabel}
          </span>
        </DetailRow>
      </div>

      <div
        className={clsx(
          "mt-auto space-y-3 pt-8 transition-opacity duration-300",
          statusFeedbackActive && "pointer-events-none opacity-80",
        )}
      >
        <button
          type="button"
          onClick={handleToggleStatus}
          disabled={statusFeedbackActive}
          className={clsx(
            "tap-press flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-semibold text-white shadow-md transition",
            paidFeedbackActive
              ? "bg-emerald-600"
              : unpaidFeedbackActive
                ? "bg-[var(--color-brand)]"
                : data.status === "paid"
                  ? "bg-slate-700 hover:bg-slate-800"
                  : "bg-[var(--color-brand)] hover:bg-[var(--color-brand-strong)]",
          )}
        >
          {paidFeedbackActive ? (
            <>
              <Check className="animate-pop-in h-5 w-5" strokeWidth={3} />
              返済済みにしました
            </>
          ) : unpaidFeedbackActive ? (
            <>
              <Clock3 className="animate-pop-in h-5 w-5" strokeWidth={2.5} />
              未返済に戻しました
            </>
          ) : showPaidState ? (
            "未返済に戻す"
          ) : (
            "返済済みにする"
          )}
        </button>

        <button
          type="button"
          onClick={() =>
            router.push(
              fromHistory
                ? `/debts/${data.id}/edit?from=history`
                : `/debts/${data.id}/edit`,
            )
          }
          className="tap-press flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-base font-semibold text-slate-800 transition hover:opacity-80 active:opacity-100"
        >
          編集する
        </button>

        <button
          type="button"
          onClick={() => setDeleteConfirmOpen(true)}
          className="tap-press flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base font-semibold text-red-700 transition hover:opacity-80 active:opacity-100"
        >
          <Trash className="h-5 w-5" />
          削除する
        </button>
      </div>

      <ConfirmBottomSheet
        open={deleteConfirmOpen}
        title="この記録を削除しますか？"
        description={`${data.partnerName}（￥${data.amount.toLocaleString("ja-JP")}）の記録を削除します。この操作は取り消せません。`}
        confirmLabel="削除する"
        cancelLabel="キャンセル"
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
}

export default function DebtDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-slate-50 px-5 pb-24 pt-6">
          <BackButton />
          <DebtDetailSkeleton />
        </div>
      }
    >
      <DebtDetailPageContent />
    </Suspense>
  );
}
