import type { PropsWithChildren } from "react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { AppFrame } from "@/components/layout/app-frame";
import { AppSplashProvider } from "@/components/app-splash-provider";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <AppSplashProvider>
      <MobileShell>
        <AppFrame>{children}</AppFrame>
      </MobileShell>
    </AppSplashProvider>
  );
}
