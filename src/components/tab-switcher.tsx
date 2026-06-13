'use client';

type Tab = "borrowed" | "lent";

type TabSwitcherProps = {
  value: Tab;
  onChange: (tab: Tab) => void;
};

export function TabSwitcher({ value, onChange }: TabSwitcherProps) {
  return (
    <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
      {(["borrowed", "lent"] satisfies Tab[]).map((tab) => {
        const active = value === tab;
        return (
          <button
            key={tab}
            type="button"
            className={`rounded-lg py-2 text-sm font-semibold transition ${
              active
                ? "bg-white shadow-sm text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => onChange(tab)}
          >
            {tab === "borrowed" ? "借りた" : "貸した"}
          </button>
        );
      })}
    </div>
  );
}
