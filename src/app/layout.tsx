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
      <head>
        <link rel="preload" href="/icons/icon-splash.png" as="image" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html.app-launch-splash-active, html.app-launch-splash-active body { background: #fff; }
              #app-launch-splash {
                display: none;
                position: fixed;
                inset: 0;
                z-index: 100;
                background: #fff;
              }
              html.app-launch-splash-active #app-launch-splash,
              #app-launch-splash.is-exiting { display: block; }
            `,
          }}
        />
      </head>
      <body className="h-dvh overflow-hidden bg-slate-50 text-slate-900 antialiased">
        <Script src="/launch-splash-init.js" strategy="beforeInteractive" />
        <div id="app-launch-splash" aria-hidden="true" suppressHydrationWarning>
          <div className="app-splash-stage">
            <img
              src="/icons/icon-splash.png"
              srcSet="/icons/icon-splash.png 512w"
              sizes="10rem"
              className="app-splash-icon"
              width={160}
              height={160}
              alt=""
              fetchPriority="high"
              decoding="sync"
            />
          </div>
        </div>
        <Providers>
          <PwaRegister />
          {children}
        </Providers>
      </body>
    </html>
  );
}
