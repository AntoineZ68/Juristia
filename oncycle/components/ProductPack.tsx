// Packaging illustré en CSS pur : étui de tablette avec étiquette, reflet et grain.

export type PackTone = "cacao" | "noisette" | "grenat" | "cassis";

const tones: Record<PackTone, { bg: string; accent: string; ink: string }> = {
  cacao: { bg: "linear-gradient(160deg,#3b2a22 0%,#221510 55%,#170d09 100%)", accent: "#c79a55", ink: "#FAF7F2" },
  noisette: { bg: "linear-gradient(160deg,#a37a52 0%,#7d5638 55%,#5c3d27 100%)", accent: "#f3e6cc", ink: "#FAF7F2" },
  grenat: { bg: "linear-gradient(160deg,#a33a4a 0%,#832232 55%,#5e1723 100%)", accent: "#f4e8e1", ink: "#FAF7F2" },
  cassis: { bg: "linear-gradient(160deg,#5a2a4c 0%,#3f1a36 55%,#2a0f24 100%)", accent: "#e7b9c9", ink: "#FAF7F2" },
};

type Props = {
  tone: PackTone;
  number: string;
  name: string;
  subtitle?: string;
  className?: string;
  large?: boolean;
};

export default function ProductPack({ tone, number, name, subtitle = "Chocolat noir fonctionnel", className = "", large }: Props) {
  const t = tones[tone];
  return (
    <div
      className={`relative isolate aspect-[5/8] overflow-hidden rounded-[6px] shadow-lift ${className}`}
      style={{ background: t.bg, color: t.ink }}
    >
      {/* rabat supérieur */}
      <div className="absolute inset-x-0 top-0 h-[7%] border-b border-white/10 bg-black/15" />
      {/* tranche gauche */}
      <div className="absolute inset-y-0 left-0 w-[5%] bg-gradient-to-r from-black/30 to-transparent" />
      {/* reflet animé */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-sheen bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      {/* lumière douce */}
      <div className="pointer-events-none absolute -right-1/4 -top-1/4 h-2/3 w-2/3 rounded-full bg-white/10 blur-2xl" />

      <div className={`relative flex h-full flex-col justify-between ${large ? "p-[9%] pt-[14%]" : "p-[10%] pt-[15%]"}`}>
        <div className="flex items-start justify-between">
          <span className={`font-serif leading-none ${large ? "text-[1.4rem] sm:text-[2.1rem] lg:text-[2.4rem]" : "text-[1.05rem]"}`}>
            OnCycle<span style={{ color: t.accent }}>.</span>
          </span>
          <span
            className={`rounded-full border font-semibold tracking-[0.18em] ${large ? "px-1.5 py-0.5 text-[7px] sm:px-2.5 sm:py-1 sm:text-[9px]" : "px-1.5 py-0.5 text-[6px]"}`}
            style={{ borderColor: `${t.accent}80`, color: t.accent }}
          >
            N°{number}
          </span>
        </div>

        {/* médaillon */}
        <div className="flex justify-center">
          <svg viewBox="0 0 120 120" className={large ? "w-[58%]" : "w-[52%]"} aria-hidden>
            <circle cx="60" cy="60" r="56" fill="none" stroke={t.accent} strokeOpacity=".35" strokeWidth=".6" />
            <circle cx="60" cy="60" r="44" fill="none" stroke={t.accent} strokeOpacity=".7" strokeWidth=".8" strokeDasharray="1.5 4" />
            <path d="M60 22 A38 38 0 1 1 59.9 22" fill="none" stroke={t.accent} strokeWidth="1.4" strokeDasharray="160 400" strokeLinecap="round" />
            <circle cx="60" cy="22" r="3.2" fill={t.accent} />
            <text x="60" y="66" textAnchor="middle" fontFamily="var(--font-instrument), serif" fontSize="22" fill={t.ink} fontStyle="italic">
              72%
            </text>
          </svg>
        </div>

        <div>
          <p className={`font-serif italic leading-[1.05] ${large ? "text-[1.1rem] sm:text-[1.6rem] lg:text-[1.8rem]" : "text-[0.95rem]"}`}>{name}</p>
          <div className="my-[6%] h-px w-full" style={{ background: `${t.accent}55` }} />
          {large ? (
            <div className="flex items-end justify-between text-[6.5px] uppercase tracking-[0.14em] opacity-80 sm:text-[9px] lg:text-[9.5px]">
              <span className="max-w-[70%] leading-[1.6]">
                {subtitle}
                <br />
                Fer · Magnésium · Vit. C
              </span>
              <span>80 g</span>
            </div>
          ) : (
            <div className="flex justify-between text-[6px] uppercase tracking-[0.14em] opacity-80">
              <span>Choc. noir 72 %</span>
              <span>80 g</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
