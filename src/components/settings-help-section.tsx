"use client";

import { BookOpen, ChevronRight, Share, Smartphone } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { InfoBottomSheet } from "@/components/ui/info-bottom-sheet";

function subscribe() {
  return () => {};
}

function getStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

function getPlatform(): "ios" | "android" | "other" {
  if (typeof navigator === "undefined") return "other";

  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

const usageSteps = [
  {
    title: "記録を登録する",
    body: "ホーム右下の＋ボタンから、相手の名前・金額・「借りた / 貸した」を入力して登録します。",
  },
  {
    title: "一覧を見る",
    body: "ホームで「借りた」「貸した」を切り替えると、未返済の記録をそれぞれ確認できます。",
  },
  {
    title: "返済する",
    body: "カードの「返済」をタップすると完済になり、ホームの一覧から消えます。",
  },
  {
    title: "履歴を確認する",
    body: "履歴タブでは返済済みの記録を確認できます。詳細から未返済に戻すこともできます。",
  },
  {
    title: "編集・削除する",
    body: "カードをタップして詳細を開き、内容の編集や削除ができます。",
  },
];

const iosSteps = [
  "Safari でこのサイトを開く（Chrome アプリでは追加できません）",
  "画面下の「共有」ボタン（□に上向き矢印）をタップ",
  "「ホーム画面に追加」を選ぶ",
  "名前を確認して「追加」をタップ",
];

const androidSteps = [
  "Chrome でこのサイトを開く",
  "画面右上のメニュー（⋮）をタップ",
  "「アプリをインストール」または「ホーム画面に追加」を選ぶ",
  "案内に従って追加する",
];

function NumberedList({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-2.5">
      {steps.map((step, index) => (
        <li key={step} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
            {index + 1}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

function HelpRow({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: typeof BookOpen;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="tap-press flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left"
    >
      <Icon className="h-5 w-5 shrink-0 text-[var(--color-brand)]" strokeWidth={2} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" strokeWidth={2} />
    </button>
  );
}

function UsageGuideContent() {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-slate-600">
        友人との少額の貸し借りを、サッと記録して忘れないためのアプリです。
      </p>
      {usageSteps.map((step, index) => (
        <div key={step.title} className="rounded-xl bg-slate-50 px-3 py-3">
          <p className="text-sm font-semibold text-slate-900">
            {index + 1}. {step.title}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.body}</p>
        </div>
      ))}
    </div>
  );
}

function InstallGuideContent({
  isStandalone,
  platform,
}: {
  isStandalone: boolean;
  platform: "ios" | "android" | "other";
}) {
  if (isStandalone) {
    return (
      <p className="text-sm leading-relaxed text-slate-600">
        すでにホーム画面から開いています。いつもどおりそのままお使いください。
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-slate-600">
        ホーム画面に追加すると、アプリのようにワンタップで開けます。
      </p>

      {platform === "ios" && (
        <div className="rounded-xl bg-slate-50 px-3 py-3">
          <p className="text-sm font-semibold text-slate-900">iPhone（Safari）</p>
          <div className="mt-2">
            <NumberedList steps={iosSteps} />
          </div>
        </div>
      )}

      {platform === "android" && (
        <div className="rounded-xl bg-slate-50 px-3 py-3">
          <p className="text-sm font-semibold text-slate-900">Android（Chrome）</p>
          <div className="mt-2">
            <NumberedList steps={androidSteps} />
          </div>
        </div>
      )}

      {platform === "other" && (
        <>
          <div className="rounded-xl bg-slate-50 px-3 py-3">
            <p className="text-sm font-semibold text-slate-900">iPhone（Safari）</p>
            <div className="mt-2">
              <NumberedList steps={iosSteps} />
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-3">
            <p className="text-sm font-semibold text-slate-900">Android（Chrome）</p>
            <div className="mt-2">
              <NumberedList steps={androidSteps} />
            </div>
          </div>
        </>
      )}

      {(platform === "ios" || platform === "android") && (
        <details className="rounded-xl px-1 py-1">
          <summary className="cursor-pointer text-xs font-medium text-slate-500">
            別の端末の手順を見る
          </summary>
          <div className="mt-3 rounded-xl bg-slate-50 px-3 py-3">
            <p className="text-sm font-semibold text-slate-900">
              {platform === "ios" ? "Android（Chrome）" : "iPhone（Safari）"}
            </p>
            <div className="mt-2">
              <NumberedList
                steps={platform === "ios" ? androidSteps : iosSteps}
              />
            </div>
          </div>
        </details>
      )}
    </div>
  );
}

export function SettingsHelpSection() {
  const [usageOpen, setUsageOpen] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);
  const isStandalone = useSyncExternalStore(subscribe, getStandalone, () => false);
  const platform = useSyncExternalStore(subscribe, getPlatform, () => "other" as const);

  return (
    <>
      <div className="mt-4 divide-y divide-slate-100 rounded-2xl bg-white p-2 shadow-sm">
        <HelpRow
          icon={BookOpen}
          title="使い方"
          subtitle="借りた・貸したの記録のしかた"
          onClick={() => setUsageOpen(true)}
        />
        <HelpRow
          icon={isStandalone ? Smartphone : Share}
          title="ホーム画面に追加"
          subtitle={
            isStandalone
              ? "すでに追加済みです"
              : "ワンタップで開けます"
          }
          onClick={() => setInstallOpen(true)}
        />
      </div>

      <InfoBottomSheet
        open={usageOpen}
        title="使い方"
        onClose={() => setUsageOpen(false)}
      >
        <UsageGuideContent />
      </InfoBottomSheet>

      <InfoBottomSheet
        open={installOpen}
        title="ホーム画面に追加"
        onClose={() => setInstallOpen(false)}
      >
        <InstallGuideContent isStandalone={isStandalone} platform={platform} />
      </InfoBottomSheet>
    </>
  );
}
