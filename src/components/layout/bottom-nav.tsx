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

  const prefetchHome = () => {
    void prefetchDebtList(queryClient, { type: "borrowed", status: "unpaid" });
    void prefetchDebtList(queryClient, { type: "lent", status: "unpaid" });
  };

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-7 z-30 flex justify-center px-4">
      <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 shadow-[0_4px_20px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="flex items-center justify-around px-2 py-2">
          {items.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            const prefetch =
              item.href === "/home" && !active ? prefetchHome : undefined;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="tap-press flex min-h-8 flex-1 items-center justify-center rounded-xl"
                aria-label={item.label}
                onMouseEnter={prefetch}
                onTouchStart={prefetch}
                onFocus={prefetch}
              >
                <Icon
                  className={clsx(
                    "h-7 w-7",
                    active ? "text-[var(--color-brand)]" : "text-slate-500",
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
