import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OnCycle. — Le chocolat fonctionnel pensé pour le cycle féminin",
  description:
    "Cacao noir 70 %, lentilles torréfiées et cœur framboise : une tablette source de fer et de magnésium, pensée pour le cycle féminin.",
  openGraph: {
    title: "OnCycle. — Recharger vos réserves. Répondre à vos envies.",
    description: "Le premier chocolat fonctionnel pensé pour le cycle féminin. Rejoignez le cycle.",
    locale: "fr_FR",
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#221510" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
