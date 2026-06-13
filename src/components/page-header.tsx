'use client';

import { BackButton } from "@/components/back-button";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
};

export function PageHeader({ title, subtitle, onBack }: PageHeaderProps) {
  return (
    <header className="relative flex items-center justify-center">
      <BackButton className="absolute left-0" onClick={onBack} />
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-base text-slate-500">{subtitle}</p>
        ) : null}
      </div>
    </header>
  );
}
