import type { Metadata } from "next";
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
        <link
          rel="preload"
          href="/icons/icon-splash.png"
          as="image"
          fetchPriority="high"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html.app-launch-splash-active, html.app-launch-splash-active body { background: #fff; }
              html.app-launch-splash-active [data-app-shell] {
                visibility: hidden;
                opacity: 0;
                pointer-events: none;
              }
              html.app-launch-splash-reveal [data-app-shell] {
                visibility: visible;
                opacity: 1;
                pointer-events: auto;
                transition: opacity 320ms ease-out;
              }
              #app-launch-splash {
                display: none;
                position: fixed;
                inset: 0;
                z-index: 100;
                background: #fff;
              }
              html.app-launch-splash-active #app-launch-splash,
              #app-launch-splash.is-exiting,
              #app-launch-splash.is-fading { display: block; }
              .app-splash-stage {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 10rem;
                height: 10rem;
                transform: translate(-50%, -50%);
                background: url(/icons/icon-splash.png) center / contain no-repeat;
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(sessionStorage.getItem("owemanager-splash-seen"))return;var p=location.pathname;if(p!=="/home"&&p!=="/")return;document.documentElement.classList.add("app-launch-splash-active");var i=new Image();i.src="/icons/icon-splash.png";}catch(e){}})();`,
          }}
        />
      </head>
      <body className="h-dvh overflow-hidden bg-slate-50 text-slate-900 antialiased">
        <div id="app-launch-splash" aria-hidden="true" suppressHydrationWarning>
          <div className="app-splash-stage" role="img" aria-label="OweManager" />
        </div>
        <Providers>
          <PwaRegister />
          {children}
        </Providers>
      </body>
    </html>
  );
}
