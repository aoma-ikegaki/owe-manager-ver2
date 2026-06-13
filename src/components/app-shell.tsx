"use client";

import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { useSplashPhase } from "@/components/app-splash-provider";

export function AppShell({ children }: PropsWithChildren) {
  const { hideAppChrome } = useSplashPhase();

  return (
    <div
      data-app-shell
      className={clsx(
        "h-dvh transition-opacity duration-300 ease-out",
        hideAppChrome && "pointer-events-none invisible opacity-0",
      )}
    >
      {children}
    </div>
  );
}
