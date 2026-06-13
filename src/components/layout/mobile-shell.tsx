import type { PropsWithChildren } from "react";

export function MobileShell({ children }: PropsWithChildren) {
  return (
    <div className="h-dvh overflow-hidden bg-slate-100">
      <div className="mx-auto flex h-full max-w-md flex-col overflow-hidden bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
        {children}
      </div>
    </div>
  );
}
