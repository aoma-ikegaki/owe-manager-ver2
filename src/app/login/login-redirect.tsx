"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function LoginRedirect() {
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      window.location.replace("/home");
    }
  }, [status]);

  return null;
}
