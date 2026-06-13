"use client";

import clsx from "clsx";

type Tab = "borrowed" | "lent";

type TabSwitcherProps = {
  value: Tab;
  onChange: (tab: Tab) => void;
  onTabIntent?: (tab: Tab) => void;
  className?: string;
};

export function TabSwitcher({
  value,
  onChange,
  onTabIntent,
  className,
}: TabSwitcherProps) {
  return (
    <div
      className={clsx(
        "relative grid w-full grid-cols-2 rounded-2xl bg-slate-100 p-1",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-1 bottom-1 left-1 w-[calc(50%-0.375rem)] rounded-xl bg-white shadow-sm transition-transform duration-200 ease-out"
        style={{
          transform: value === "lent" ? "translateX(calc(100% + 0.25rem))" : "translateX(0)",
        }}
      />
      {(["borrowed", "lent"] satisfies Tab[]).map((tab) => {
        const active = value === tab;
        const prefetchTab = () => {
          if (!active) onTabIntent?.(tab);
        };
        return (
          <button
            key={tab}
            type="button"
            className={clsx(
              "tap-press relative z-10 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200",
              active
                ? "text-[var(--color-brand)]"
                : "text-slate-500 hover:text-slate-700",
            )}
            onClick={() => onChange(tab)}
            onMouseEnter={prefetchTab}
            onTouchStart={prefetchTab}
            onFocus={prefetchTab}
          >
            {tab === "borrowed" ? "借りた" : "貸した"}
          </button>
        );
      })}
    </div>
  );
}
