import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARTWORKS | 絵画作品のギャラリー",
  description: "絵画教室で制作した作品を集めた個人ギャラリー。",
  openGraph: {
    title: "ARTWORKS | 絵画作品のギャラリー",
    description: "描く時間の、静かな記録。",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
