'use client';

import { signOut, useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data } = useSession();

  return (
    <div className="min-h-screen bg-slate-50 px-5 pb-24 pt-6">
      <h1 className="text-xl font-semibold text-slate-900">設定</h1>
      <div className="mt-4 rounded-2xl bg-white p-2 shadow-sm">
        <div className="rounded-xl px-3 py-3">
          <p className="text-sm font-semibold text-slate-900">
            {data?.user?.name ?? "ユーザー"}
          </p>
          <p className="text-xs text-slate-500">
            {data?.user?.email ?? "Googleアカウント"}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-4 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
      >
        ログアウト
      </button>
      <p className="mt-6 text-xs text-slate-500">App version 1.0.0</p>
    </div>
  );
}
