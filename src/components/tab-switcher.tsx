'use client';

import clsx from "clsx";

type Tab = "borrowed" | "lent";

type TabSwitcherProps = {
  value: Tab;
  onChange: (tab: Tab) => void;
  className?: string;
};

export function TabSwitcher({ value, onChange, className }: TabSwitcherProps) {
  return (
    <div
      className={clsx(
        "grid w-full grid-cols-2 rounded-2xl bg-slate-100 p-1",
        className,
      )}
    >
      {(["borrowed", "lent"] satisfies Tab[]).map((tab) => {
        const active = value === tab;
        return (
          <button
            key={tab}
            type="button"
            className={clsx(
              "rounded-xl px-4 py-2.5 text-sm font-semibold transition",
              active
                ? "bg-white text-[var(--color-brand)] shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            )}
            onClick={() => onChange(tab)}
          >
            {tab === "borrowed" ? "借りた" : "貸した"}
          </button>
        );
      })}
    </div>
  );
}
