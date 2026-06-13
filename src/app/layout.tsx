import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { PwaRegister } from "@/components/pwa-register";

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OweManager",
  description: "友人間の少額の貸し借りをサッと記録するPWA",
  applicationName: "OweManager",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    title: "OweManager",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSans.variable}`} suppressHydrationWarning>
      <body className="h-dvh overflow-hidden bg-slate-50 text-slate-900 antialiased">
        <Script src="/launch-splash-init.js" strategy="beforeInteractive" />
        <div id="app-launch-splash" aria-hidden="true" suppressHydrationWarning>
          <img src="/icons/icon-192.png" width={112} height={112} alt="" />
        </div>
        <Providers>
          <PwaRegister />
          {children}
        </Providers>
      </body>
    </html>
  );
}
