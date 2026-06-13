import {
  Home,
  LayoutList,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const items = [
  { href: "/home", label: "ホーム", icon: Home },
  { href: "/history", label: "履歴", icon: LayoutList },
  { href: "/settings", label: "設定", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="shrink-0 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-md items-center justify-around px-4 py-2">
        {items.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 items-center justify-center"
              aria-label={item.label}
            >
              <Icon
                className={clsx(
                  "h-7 w-7 py-2",
                  active ? "text-[var(--color-brand)]" : "text-slate-500",
                )}
                strokeWidth={2}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
