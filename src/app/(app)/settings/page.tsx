'use client';

import { signOut, useSession } from "next-auth/react";
import { DefaultUserAvatar } from "@/components/default-user-avatar";

export default function SettingsPage() {
  const { data } = useSession();

  return (
    <div className="h-full overflow-y-auto bg-slate-50 px-5 pb-24 pt-6">
      <h1 className="text-center text-xl font-semibold text-slate-900">設定</h1>
      <div className="mt-4 rounded-2xl bg-white p-2 shadow-sm">
        <div className="flex items-center gap-3 rounded-xl px-3 py-3">
          <DefaultUserAvatar
            src={data?.user?.image}
            alt={data?.user?.name ?? "ユーザー"}
            className="h-10 w-10 shrink-0 rounded-full bg-slate-100 object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {data?.user?.name ?? "ユーザー"}
            </p>
            <p className="truncate text-xs text-slate-500">
              {data?.user?.email ?? "Googleアカウント"}
            </p>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-4 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
      >
        ログアウト
      </button>
      <p className="mt-6 text-center text-xs text-slate-500">App version 1.0.0</p>
    </div>
  );
}
