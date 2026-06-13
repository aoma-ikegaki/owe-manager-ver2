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
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import clsx from "clsx";
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
};

const SplashContext = createContext<SplashContextValue>({ phase: "done" });

export function useSplashPhase() {
  return useContext(SplashContext);
}

function AppSplashOverlay({ exiting }: { exiting: boolean }) {
  return (
    <div
      className={clsx(
        "pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity ease-out",
        exiting ? "opacity-0 duration-300" : "opacity-100 duration-0",
      )}
      aria-hidden="true"
    >
      <img
        src="/icons/icon-192.png"
        alt=""
        width={112}
        height={112}
        className={clsx(
          "app-splash-icon transition-all ease-[cubic-bezier(0.33,1,0.68,1)]",
          exiting
            ? "scale-[0.32] opacity-0 duration-[420ms]"
            : "scale-100 opacity-100 duration-0",
        )}
      />
    </div>
  );
}

export function AppSplashProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { status } = useSession();
  const queryClient = useQueryClient();
  const initializedRef = useRef(false);
  const [phase, setPhase] = useState<SplashPhase>("done");
  const [minReady, setMinReady] = useState(false);
  const [canPortal, setCanPortal] = useState(false);
  const { isFetched } = useDebts({ type: "borrowed", status: "unpaid" });

  useLayoutEffect(() => {
    setCanPortal(true);

    if (initializedRef.current) return;
    initializedRef.current = true;

    const initialPath = window.location.pathname;
    const shouldShow =
      (initialPath === "/home" || initialPath === "/") &&
      !sessionStorage.getItem(SPLASH_SESSION_KEY);

    if (!shouldShow) {
      document.documentElement.classList.remove("app-launch-splash-active");
      document.documentElement.classList.remove("app-launch-splash-react-ready");
      setPhase("done");
      document.body.removeAttribute("data-splash-active");
      return;
    }

    sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
    document.documentElement.classList.add("app-launch-splash-active");
    document.documentElement.classList.add("app-launch-splash-react-ready");
    setPhase("splash");
    document.body.setAttribute("data-splash-active", "");
  }, []);

  useLayoutEffect(() => {
    if (phase !== "splash" && phase !== "exit") return;
    if (pathname === "/home") return;

    setPhase("done");
    document.body.removeAttribute("data-splash-active");
    document.documentElement.classList.remove("app-launch-splash-active");
    document.documentElement.classList.remove("app-launch-splash-react-ready");
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

    const timer = window.setTimeout(() => {
      setPhase("done");
      document.body.removeAttribute("data-splash-active");
      document.documentElement.classList.remove("app-launch-splash-active");
      document.documentElement.classList.remove("app-launch-splash-react-ready");
    }, SPLASH_EXIT_MS);

    return () => window.clearTimeout(timer);
  }, [phase, minReady, status, isFetched]);

  return (
    <SplashContext.Provider value={{ phase }}>
      {children}
      {canPortal &&
        (phase === "splash" || phase === "exit") &&
        createPortal(
          <AppSplashOverlay exiting={phase === "exit"} />,
          document.body,
        )}
    </SplashContext.Provider>
  );
}
