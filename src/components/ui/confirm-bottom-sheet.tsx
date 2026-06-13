"use client";

import { useEffect } from "react";
import clsx from "clsx";

type ConfirmBottomSheetProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmBottomSheet({
  open,
  title,
  description,
  confirmLabel = "削除する",
  cancelLabel = "キャンセル",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmBottomSheetProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <button
        type="button"
        aria-label="閉じる"
        className="absolute inset-0 animate-fade-in bg-black/40"
        onClick={onCancel}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-sheet-title"
        className="animate-slide-up relative z-10 w-full max-w-md rounded-t-2xl bg-white px-5 pb-8 pt-5 shadow-[0_-8px_30px_rgba(15,23,42,0.12)]"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />

        <h2
          id="confirm-sheet-title"
          className="text-center text-lg font-semibold text-slate-900"
        >
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-center text-sm leading-relaxed text-slate-500">
            {description}
          </p>
        )}

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={onConfirm}
            className={clsx(
              "tap-press w-full rounded-xl px-4 py-3.5 text-base font-semibold text-white shadow-sm transition",
              destructive
                ? "bg-red-600 hover:bg-red-700 active:scale-[0.98]"
                : "bg-[var(--color-brand)] hover:bg-[var(--color-brand-strong)] active:scale-[0.98]",
            )}
          >
            {confirmLabel}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="tap-press w-full rounded-xl border border-slate-200 px-4 py-3.5 text-base font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
