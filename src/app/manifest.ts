import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OweManager v2",
    short_name: "OweManager",
    start_url: "/home",
    display: "standalone",
    background_color: "#f4f6f9",
    theme_color: "#2f9b50",
    description: "サッと記録して、モヤモヤをなくす貸し借り記録アプリ",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "64x64",
        type: "image/x-icon",
      },
    ],
  };
}
