import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OnCycle. — Le chocolat noir fonctionnel pensé pour le cycle féminin",
  description:
    "Cacao noir grand cru, farine de lentilles torréfiée et fruits rouges : une tablette gourmande, source de fer et de magnésium, pensée pour le cycle féminin.",
  openGraph: {
    title: "OnCycle. — Recharger vos réserves, sans compromis",
    description:
      "Le premier chocolat noir fonctionnel pensé pour le cycle féminin. Rejoignez le batch #01.",
    locale: "fr_FR",
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
