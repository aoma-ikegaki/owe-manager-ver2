"use client";

import { useEffect, useState, type PropsWithChildren } from "react";
import clsx from "clsx";

type InfoBottomSheetProps = PropsWithChildren<{
  open: boolean;
  title: string;
  onClose: () => void;
}>;

const ANIMATION_MS = 240;

export function InfoBottomSheet({
  open,
  title,
  onClose,
  children,
}: InfoBottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), ANIMATION_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mounted, onClose]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <button
        type="button"
        aria-label="閉じる"
        className={clsx(
          "absolute inset-0 bg-black/40 transition-opacity duration-[240ms] ease-out",
          visible ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-sheet-title"
        className={clsx(
          "relative z-10 flex max-h-[85dvh] w-full max-w-md flex-col rounded-t-2xl bg-white shadow-[0_-8px_30px_rgba(15,23,42,0.12)] transition-transform duration-[240ms] ease-out",
          visible ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="shrink-0 px-5 pb-3 pt-5">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
          <h2
            id="info-sheet-title"
            className="text-center text-lg font-semibold text-slate-900"
          >
            {title}
          </h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
          {children}
        </div>

        <div className="shrink-0 border-t border-slate-100 px-5 pb-8 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="tap-press w-full rounded-xl border border-slate-200 px-4 py-3.5 text-base font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
