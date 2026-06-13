import type { PropsWithChildren } from "react";

export function MobileShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
        {children}
      </div>
    </div>
  );
}
