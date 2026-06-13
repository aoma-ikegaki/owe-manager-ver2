'use client';

import { type PropsWithChildren, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { BottomNav } from "./bottom-nav";
import { useSplashPhase } from "@/components/app-splash-provider";

const tabRoots = ["/home", "/history", "/settings"] as const;

function getTabIndex(pathname: string | null) {
  if (!pathname) return 0;
  const index = tabRoots.findIndex((root) => pathname.startsWith(root));
  return index >= 0 ? index : 0;
}

export function AppFrame({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { phase: splashPhase } = useSplashPhase();
  const tabIndex = getTabIndex(pathname);
  const prevIndexRef = useRef(tabIndex);
  const [tabEnterActive, setTabEnterActive] = useState(false);

  useEffect(() => {
    if (splashPhase !== "done") return;
    if (prevIndexRef.current === tabIndex) return;

    setTabEnterActive(true);
    const timer = window.setTimeout(() => setTabEnterActive(false), 200);
    prevIndexRef.current = tabIndex;
    return () => window.clearTimeout(timer);
  }, [tabIndex, splashPhase]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <main
        className={clsx(
          "min-h-0 flex-1 overflow-hidden",
          tabEnterActive && "animate-tab-enter",
        )}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
