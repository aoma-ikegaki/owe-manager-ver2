import clsx from "clsx";

export function Skeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={clsx("animate-pulse rounded-lg bg-slate-200", className)}
      aria-hidden
    />
  );
}

export function SummaryCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white px-4 py-3.5 text-center shadow-[0_4px_20px_rgba(15,23,42,0.08)]">
      <Skeleton className="mx-auto h-4 w-12" />
      <Skeleton className="mx-auto mt-2 h-8 w-24" />
      <Skeleton className="mx-auto mt-2 h-3 w-16" />
    </div>
  );
}

export function DebtCardSkeleton({ showAction = false }: { showAction?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex min-w-0 flex-1 items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-14" />
        </div>
      </div>
      {showAction && <Skeleton className="h-10 w-10 shrink-0 rounded-full" />}
    </div>
  );
}

export function DebtListSkeleton({
  count = 3,
  showAction = false,
}: {
  count?: number;
  showAction?: boolean;
}) {
  return (
    <div className="space-y-3" aria-busy aria-label="読み込み中">
      {Array.from({ length: count }, (_, index) => (
        <DebtCardSkeleton key={index} showAction={showAction} />
      ))}
    </div>
  );
}

export function DebtDetailSkeleton() {
  return (
    <div aria-busy aria-label="読み込み中">
      <div className="mt-10 text-center">
        <Skeleton className="mx-auto h-9 w-40" />
        <Skeleton className="mx-auto mt-3 h-6 w-16 rounded-full" />
        <Skeleton className="mx-auto mt-6 h-12 w-36" />
      </div>

      <div className="mt-8 space-y-0 rounded-2xl bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function DebtFormSkeleton() {
  return (
    <div className="space-y-4" aria-busy aria-label="読み込み中">
      <Skeleton className="h-11 w-full rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <Skeleton className="h-14 w-full rounded-xl" />
    </div>
  );
}
