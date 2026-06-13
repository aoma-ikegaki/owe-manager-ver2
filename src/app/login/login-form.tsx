'use client';

import { signIn } from "next-auth/react";

export function LoginForm() {
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
        onClick={() => signIn("google", { callbackUrl: "/home" })}
        className="btn-primary tap-press mt-12 w-full py-3.5 text-base"
      >
        Googleでログイン
      </button>
    </div>
  );
}
