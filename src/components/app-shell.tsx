import type { PropsWithChildren } from "react";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div data-app-shell suppressHydrationWarning className="h-dvh">
      {children}
    </div>
  );
}
