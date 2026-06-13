"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  prefetchDebtList,
  useDebts,
} from "@/hooks/use-debts";
import { useQueryClient } from "@tanstack/react-query";

export const SPLASH_SESSION_KEY = "owemanager-splash-seen";

const SPLASH_MIN_MS = 520;
const SPLASH_ICON_EXIT_MS = 420;
const SPLASH_OVERLAY_FADE_MS = 320;

type SplashPhase = "done" | "splash" | "exit";

type SplashContextValue = {
  phase: SplashPhase;
};

const SplashContext = createContext<SplashContextValue>({ phase: "done" });

export function useSplashPhase() {
  return useContext(SplashContext);
}

function syncStaticSplash(phase: SplashPhase) {
  const splash = document.getElementById("app-launch-splash");

  if (phase === "exit") {
    splash?.classList.remove("is-fading", "is-hidden");
    splash?.classList.add("is-exiting");
    return;
  }

  splash?.classList.remove("is-exiting", "is-fading", "is-hidden");
}

function hideStaticSplash() {
  const splash = document.getElementById("app-launch-splash");
  splash?.classList.add("is-hidden");
  document.documentElement.classList.remove(
    "app-launch-splash-active",
    "app-launch-splash-reveal",
  );
}

export function AppSplashProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { status } = useSession();
  const queryClient = useQueryClient();
  const initializedRef = useRef(false);
  const [phase, setPhase] = useState<SplashPhase>("done");
  const [minReady, setMinReady] = useState(false);
  const { isFetched } = useDebts({ type: "borrowed", status: "unpaid" });

  useLayoutEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initialPath = window.location.pathname;
    const shouldShow =
      (initialPath === "/home" || initialPath === "/") &&
      !sessionStorage.getItem(SPLASH_SESSION_KEY);

    if (!shouldShow) {
      document.documentElement.classList.remove(
        "app-launch-splash-active",
        "app-launch-splash-reveal",
      );
      setPhase("done");
      document.body.removeAttribute("data-splash-active");
      syncStaticSplash("done");
      return;
    }

    sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
    document.documentElement.classList.add("app-launch-splash-active");
    setPhase("splash");
    document.body.setAttribute("data-splash-active", "");
    syncStaticSplash("splash");
  }, []);

  useLayoutEffect(() => {
    syncStaticSplash(phase);
  }, [phase]);

  useLayoutEffect(() => {
    if (phase !== "splash" && phase !== "exit") return;
    if (pathname === "/home") return;

    setPhase("done");
    document.body.removeAttribute("data-splash-active");
    document.documentElement.classList.remove(
      "app-launch-splash-active",
      "app-launch-splash-reveal",
    );
    syncStaticSplash("done");
  }, [pathname, phase]);

  useEffect(() => {
    if (phase !== "splash") return;

    setMinReady(false);
    void prefetchDebtList(queryClient, { type: "borrowed", status: "unpaid" });
    void prefetchDebtList(queryClient, { type: "lent", status: "unpaid" });

    const timer = window.setTimeout(() => setMinReady(true), SPLASH_MIN_MS);
    return () => window.clearTimeout(timer);
  }, [phase, queryClient]);

  useEffect(() => {
    if (phase !== "splash" || !minReady) return;
    if (status === "loading") return;
    if (!isFetched) return;

    setPhase("exit");
  }, [phase, minReady, status, isFetched]);

  useEffect(() => {
    if (phase !== "exit") return;

    const revealTimer = window.setTimeout(() => {
      document.documentElement.classList.add("app-launch-splash-reveal");
      document.getElementById("app-launch-splash")?.classList.add("is-fading");
    }, SPLASH_ICON_EXIT_MS);

    const doneTimer = window.setTimeout(() => {
      hideStaticSplash();
      setPhase("done");

      window.requestAnimationFrame(() => {
        syncStaticSplash("done");
        window.setTimeout(() => {
          document.body.removeAttribute("data-splash-active");
        }, 100);
      });
    }, SPLASH_ICON_EXIT_MS + SPLASH_OVERLAY_FADE_MS);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(doneTimer);
    };
  }, [phase]);

  return (
    <SplashContext.Provider value={{ phase }}>{children}</SplashContext.Provider>
  );
}
