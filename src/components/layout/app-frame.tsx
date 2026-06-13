'use client';

import {
  type CSSProperties,
  type PropsWithChildren,
  useEffect,
  useRef,
} from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "./bottom-nav";

const tabRoots = ["/home", "/history", "/settings"] as const;

function getTabIndex(pathname: string | null) {
  if (!pathname) return 0;
  const index = tabRoots.findIndex((root) => pathname.startsWith(root));
  return index >= 0 ? index : 0;
}

export function AppFrame({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const tabIndex = getTabIndex(pathname);
  const prevIndexRef = useRef(tabIndex);

  const slideFrom =
    tabIndex > prevIndexRef.current
      ? "12px"
      : tabIndex < prevIndexRef.current
        ? "-12px"
        : "6px";

  useEffect(() => {
    prevIndexRef.current = tabIndex;
  }, [tabIndex]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <main
        key={pathname}
        className="min-h-0 flex-1 overflow-hidden animate-tab-enter"
        style={{ "--tab-enter-from": slideFrom } as CSSProperties}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
