'use client';

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/home");
    }
  }, [status, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-[var(--color-brand)]">
            O
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--color-brand)]">
              OweManager v2
            </p>
            <h1 className="text-xl font-semibold text-slate-900">
              サッと記録して、モヤモヤをなくす
            </h1>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-600">
          Googleアカウントでログインして、貸し借りを安全に記録します。
        </p>

        <button
          type="button"
          onClick={() => signIn("google")}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-[var(--color-brand)] px-4 py-3 text-base font-semibold text-white shadow-md transition hover:bg-[var(--color-brand-strong)] active:translate-y-[1px]"
        >
        
          Googleで続ける
        </button>
      </div>
    </div>
  );
}
