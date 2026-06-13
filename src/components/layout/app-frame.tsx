'use client';

import type { PropsWithChildren } from "react";
import { BottomNav } from "./bottom-nav";

export function AppFrame({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      <BottomNav />
    </div>
  );
}
