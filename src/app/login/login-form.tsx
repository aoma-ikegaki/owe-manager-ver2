'use client';

import Image from "next/image";
import { signIn } from "next-auth/react";
import { LoginInstallPrompt } from "@/components/login-install-prompt";

export function LoginForm() {
  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col justify-center bg-white px-8">
      <div className="text-center">
        <Image
          src="/icons/icon-splash.png"
          alt=""
          width={96}
          height={96}
          priority
          className="mx-auto h-24 w-24 object-contain"
        />
        <h1 className="mt-5 text-3xl font-semibold text-slate-900">OweManager</h1>
        <p className="mt-3 text-sm text-slate-500">
          友人間の貸し借りを、サッと記録
        </p>
      </div>

      <LoginInstallPrompt />

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/home" })}
        className="btn-primary tap-press mt-8 w-full py-3.5 text-base"
      >
        Googleでログイン
      </button>
    </div>
  );
}
