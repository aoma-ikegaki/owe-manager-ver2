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
const SPLASH_EXIT_MS = 420;

type SplashPhase = "done" | "splash" | "exit";

type SplashContextValue = {
  phase: SplashPhase;
  hideAppChrome: boolean;
};

const SplashContext = createContext<SplashContextValue>({
  phase: "done",
  hideAppChrome: false,
});

export function useSplashPhase() {
  return useContext(SplashContext);
}

function syncStaticSplash(phase: SplashPhase) {
  const splash = document.getElementById("app-launch-splash");

  if (phase === "exit") {
    splash?.classList.add("is-exiting");
    return;
  }

  splash?.classList.remove("is-exiting", "is-fading");
}

export function AppSplashProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { status } = useSession();
  const queryClient = useQueryClient();
  const initializedRef = useRef(false);
  const [phase, setPhase] = useState<SplashPhase>("done");
  const [hideAppChrome, setHideAppChrome] = useState(false);
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
      document.documentElement.classList.remove("app-launch-splash-active");
      setPhase("done");
      setHideAppChrome(false);
      document.body.removeAttribute("data-splash-active");
      syncStaticSplash("done");
      return;
    }

    sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
    document.documentElement.classList.add("app-launch-splash-active");
    setPhase("splash");
    setHideAppChrome(true);
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
    setHideAppChrome(false);
    document.body.removeAttribute("data-splash-active");
    document.documentElement.classList.remove("app-launch-splash-active");
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

    const fadeTimer = window.setTimeout(() => {
      document.getElementById("app-launch-splash")?.classList.add("is-fading");
    }, SPLASH_EXIT_MS - 160);

    const doneTimer = window.setTimeout(() => {
      syncStaticSplash("done");
      document.documentElement.classList.remove("app-launch-splash-active");
      setPhase("done");

      window.requestAnimationFrame(() => {
        setHideAppChrome(false);

        window.setTimeout(() => {
          document.body.removeAttribute("data-splash-active");
        }, 320);
      });
    }, SPLASH_EXIT_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, [phase]);

  return (
    <SplashContext.Provider value={{ phase, hideAppChrome }}>
      {children}
    </SplashContext.Provider>
  );
}
