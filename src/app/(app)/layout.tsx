import type { PropsWithChildren } from "react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { AppFrame } from "@/components/layout/app-frame";
import { AppSplashProvider } from "@/components/app-splash-provider";
import { AppShell } from "@/components/app-shell";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <AppSplashProvider>
      <AppShell>
        <MobileShell>
          <AppFrame>{children}</AppFrame>
        </MobileShell>
      </AppShell>
    </AppSplashProvider>
  );
}
