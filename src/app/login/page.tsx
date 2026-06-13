'use client';

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
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
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col justify-center bg-white px-8">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-slate-900">OweManager</h1>
        <p className="mt-3 text-sm text-slate-500">
          友人間の貸し借りを、サッと記録
        </p>
      </div>

      <button
        type="button"
        onClick={() => signIn("google")}
        className="mt-12 flex w-full items-center justify-center rounded-xl bg-[var(--color-brand)] px-4 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-[var(--color-brand-strong)] active:scale-[0.99]"
      >
        Googleでログイン
      </button>
    </div>
  );
}
