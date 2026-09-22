import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

export const dynamic = "force-static";

export const alt = `${site.name} — L'analyse des dossiers pénaux, assistée par IA`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Carte de partage générée à la volée (aucun asset à maintenir).
 * La police serif de marque n'est pas embarquée ici : on reste sur la
 * typographie par défaut, fidèle aux couleurs. À remplacer par un visuel
 * produit lorsque les captures réelles seront disponibles.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#f6f3ee",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#16130f", letterSpacing: "-0.02em" }}>
          {site.name}
          <span style={{ color: "#1f3b33" }}>.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 78,
              lineHeight: 1.05,
              color: "#16130f",
              letterSpacing: "-0.03em",
            }}
          >
            Le dossier pénal,
          </div>
          <div
            style={{
              fontSize: 78,
              lineHeight: 1.05,
              color: "#1f3b33",
              letterSpacing: "-0.03em",
            }}
          >
            lu en une heure.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#5a534a",
            borderTop: "1px solid #cec4b4",
            paddingTop: "28px",
          }}
        >
          Chronologie sourcée · Traçabilité au PDF · Hébergement en Europe
        </div>
      </div>
    ),
    size,
  );
}
