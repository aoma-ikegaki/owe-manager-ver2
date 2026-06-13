'use client';

import {
  type CSSProperties,
  type PropsWithChildren,
  useEffect,
  useRef,
} from "react";
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
  const skipTabEnter = splashPhase === "splash" || splashPhase === "exit";

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
        className={clsx(
          "min-h-0 flex-1 overflow-hidden",
          !skipTabEnter && "animate-tab-enter",
        )}
        style={{ "--tab-enter-from": slideFrom } as CSSProperties}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
