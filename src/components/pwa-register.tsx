'use client';

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    // 古い SW がキャッシュ経由で ERR_FAILED を起こすのを防ぐ
    void navigator.serviceWorker.getRegistrations().then((registrations) =>
      Promise.all(registrations.map((registration) => registration.unregister())),
    );

    if ("caches" in window) {
      void caches.keys().then((keys) =>
        Promise.all(keys.map((key) => caches.delete(key))),
      );
    }
  }, []);

  return null;
}
