export default function AppLoading() {
  return (
    <div className="h-dvh overflow-hidden bg-slate-100">
      <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
        <img
          src="/icons/icon-192.png"
          alt=""
          width={80}
          height={80}
          className="rounded-2xl shadow-md"
          fetchPriority="high"
        />
        <span
          aria-hidden
          className="mt-6 inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-brand)] border-t-transparent"
        />
        <p className="mt-4 text-sm text-slate-500" aria-live="polite">
          読み込み中...
        </p>
      </div>
    </div>
  );
}
