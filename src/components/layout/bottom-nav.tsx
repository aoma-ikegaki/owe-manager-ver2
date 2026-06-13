"use client";

import {
  Home,
  LayoutList,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { prefetchDebtList } from "@/hooks/use-debts";

const items = [
  { href: "/home", label: "ホーム", icon: Home },
  { href: "/history", label: "履歴", icon: LayoutList },
  { href: "/settings", label: "設定", icon: Settings },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => pathname?.startsWith(item.href)),
  );

  const prefetchHome = () => {
    void prefetchDebtList(queryClient, { type: "borrowed", status: "unpaid" });
    void prefetchDebtList(queryClient, { type: "lent", status: "unpaid" });
  };

  const prefetchHistory = () => {
    void prefetchDebtList(queryClient, { type: "borrowed", status: "paid" });
    void prefetchDebtList(queryClient, { type: "lent", status: "paid" });
  };

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-7 z-30 flex justify-center px-4"
    >
      <div className="pointer-events-auto w-full max-w-md rounded-2xl bg-white/95 shadow-[0_4px_20px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="relative grid grid-cols-3 p-1">
          <span
            aria-hidden
            className="pointer-events-none absolute top-1 bottom-1 left-1 w-[calc(33.333%-0.34rem)] rounded-xl bg-white shadow-sm transition-transform duration-200 ease-out"
            style={{
              transform:
                activeIndex === 0
                  ? "translateX(0)"
                  : activeIndex === 1
                    ? "translateX(calc(100% + 0.25rem))"
                    : "translateX(calc(200% + 0.5rem))",
            }}
          />
          {items.map((item, index) => {
            const active = index === activeIndex;
            const Icon = item.icon;
            const prefetch =
              item.href === "/home" && !active
                ? prefetchHome
                : item.href === "/history" && !active
                  ? prefetchHistory
                  : undefined;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="tap-press relative z-10 flex min-h-10 items-center justify-center rounded-xl py-2"
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                onMouseEnter={prefetch}
                onTouchStart={prefetch}
                onFocus={prefetch}
              >
                <Icon
                  className={clsx(
                    "h-7 w-7 transition-all duration-200",
                    active
                      ? "scale-110 text-[var(--color-brand)]"
                      : "text-slate-400",
                  )}
                  strokeWidth={active ? 2.5 : 2}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
