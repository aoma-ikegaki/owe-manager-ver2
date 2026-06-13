"use client";

import { Smartphone, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

const DISMISS_KEY = "owemanager-login-install-prompt-dismissed";

function subscribe() {
  return () => {};
}

function getStandalone() {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

function readDismissed() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DISMISS_KEY) === "1";
}

function getPlatform(): "ios" | "android" | "other" {
  if (typeof navigator === "undefined") return "other";

  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

function getInstallHint(platform: "ios" | "android" | "other") {
  if (platform === "ios") {
    return "Safari の共有ボタン →「ホーム画面に追加」";
  }
  if (platform === "android") {
    return "Chrome のメニュー ⋮ →「ホーム画面に追加」";
  }
  return "ブラウザのメニューから「ホーム画面に追加」";
}

export function LoginInstallPrompt() {
  const isStandalone = useSyncExternalStore(subscribe, getStandalone, () => true);
  const platform = useSyncExternalStore(subscribe, getPlatform, () => "other" as const);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(readDismissed());
  }, []);

  if (isStandalone || dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="relative mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/90 p-4 pr-11 text-left shadow-sm">
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="閉じる"
        className="tap-press absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/80 hover:text-slate-600"
      >
        <X className="h-4 w-4" strokeWidth={2.5} />
      </button>

      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
          <Smartphone className="h-5 w-5 text-[var(--color-brand)]" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">ホーム画面に追加</p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
            アプリのようにワンタップで開けます
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            {getInstallHint(platform)}
          </p>
        </div>
      </div>
    </div>
  );
}
