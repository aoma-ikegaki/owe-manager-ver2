'use client';

import clsx from "clsx";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  className?: string;
  onClick?: () => void;
};

export function BackButton({ className, onClick }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={onClick ?? (() => router.back())}
      aria-label="戻る"
      className={clsx(
        "flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-xl font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95",
        className,
      )}
    >
      ←
    </button>
  );
}
