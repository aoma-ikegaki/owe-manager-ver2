import type { PropsWithChildren } from "react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { AppFrame } from "@/components/layout/app-frame";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <MobileShell>
      <AppFrame>{children}</AppFrame>
    </MobileShell>
  );
}
