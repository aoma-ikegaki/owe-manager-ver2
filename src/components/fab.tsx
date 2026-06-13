'use client';

import { Plus } from "lucide-react";
import Link from "next/link";

type FabProps = {
  href: string;
  label?: string;
};

export function Fab({ href, label = "新規登録" }: FabProps) {
  return (
    <Link
      href={href}
      className="fixed bottom-[4.75rem] left-1/2 z-20 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--color-brand)] text-white shadow-lg shadow-emerald-300/50 transition hover:scale-105 active:scale-95"
      aria-label={label}
    >
      <Plus className="h-8 w-8" strokeWidth={3} />
    </Link>
  );
}
