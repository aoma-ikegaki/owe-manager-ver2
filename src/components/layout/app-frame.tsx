'use client';

import type { PropsWithChildren } from "react";
import { BottomNav } from "./bottom-nav";

export function AppFrame({ children }: PropsWithChildren) {
  return (
    <>
      <div className="flex-1 pb-20">{children}</div>
      <BottomNav />
    </>
  );
}
