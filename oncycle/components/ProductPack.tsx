// Packaging illustré en CSS pur : étui de tablette avec étiquette, reflet et grain.

export type PackTone = "cacao" | "grenat" | "cassis";

const tones: Record<PackTone, { bg: string; accent: string; ink: string }> = {
  cacao: { bg: "linear-gradient(160deg,#3b2a22 0%,#221510 55%,#170d09 100%)", accent: "#c79a55", ink: "#FAF7F2" },
  grenat: { bg: "linear-gradient(160deg,#a33a4a 0%,#832232 55%,#5e1723 100%)", accent: "#f4e8e1", ink: "#FAF7F2" },
  cassis: { bg: "linear-gradient(160deg,#5a2a4c 0%,#3f1a36 55%,#2a0f24 100%)", accent: "#e7b9c9", ink: "#FAF7F2" },
};

type Props = {
  tone: PackTone;
  number: string;
  /** Nom court affiché sur l'étui (ex. « L'Insoumise »). */
  name: string;
  /** Ce que contient réellement la tablette, une ligne par élément (étiquette du bas). */
  composition: string[];
  /** Allégations nutritionnelles autorisées, exactement celles que la recette permet. */
  claim: string;
  weight?: string;
  className?: string;
};

export default function ProductPack({ tone, number, name, composition, claim, weight = "80 g", className = "" }: Props) {
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

      <div className="relative flex h-full flex-col justify-between p-[9%] pt-[14%]">
        <div className="flex items-start justify-between">
          <span className="font-serif text-[1.05rem] leading-none sm:text-[1.55rem] lg:text-[1.75rem]">
            OnCycle<span style={{ color: t.accent }}>.</span>
          </span>
          <span
            className="shrink-0 rounded-full border px-1.5 py-0.5 text-[6.5px] font-semibold tracking-[0.14em] sm:px-2 sm:py-[3px] sm:text-[8.5px]"
            style={{ borderColor: `${t.accent}80`, color: t.accent }}
          >
            N°{number}
          </span>
        </div>

        {/* médaillon */}
        <div className="flex justify-center">
          <svg viewBox="0 0 120 120" className="w-[52%]" aria-hidden>
            <circle cx="60" cy="60" r="56" fill="none" stroke={t.accent} strokeOpacity=".35" strokeWidth=".6" />
            <circle cx="60" cy="60" r="44" fill="none" stroke={t.accent} strokeOpacity=".7" strokeWidth=".8" strokeDasharray="1.5 4" />
            <path d="M60 22 A38 38 0 1 1 59.9 22" fill="none" stroke={t.accent} strokeWidth="1.4" strokeDasharray="160 400" strokeLinecap="round" />
            <circle cx="60" cy="22" r="3.2" fill={t.accent} />
            <text x="60" y="66" textAnchor="middle" fontFamily="var(--font-display), serif" fontSize="22" fill={t.ink} fontStyle="italic">
              70%
            </text>
          </svg>
        </div>

        {/* étiquette du bas : nom, composition réelle, allégations, poids */}
        <div>
          <p
            className={`font-serif italic leading-[1.05] ${
              name.length > 16 ? "text-[0.95rem] sm:text-[1.3rem] lg:text-[1.45rem]" : "text-[1.1rem] sm:text-[1.6rem] lg:text-[1.8rem]"
            }`}
          >
            {name}
          </p>
          <div className="my-[5%] h-px w-full" style={{ background: `${t.accent}55` }} />
          <ul className="space-y-[2px] text-[6.5px] uppercase leading-[1.5] tracking-[0.12em] opacity-90 sm:text-[8.5px] lg:text-[9.5px]">
            {composition.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <div
            className="mt-[5%] flex items-end justify-between gap-2 border-t pt-[4%] text-[6px] font-semibold uppercase leading-[1.5] tracking-[0.12em] sm:text-[8px] lg:text-[8.5px]"
            style={{ borderColor: `${t.accent}33`, color: t.accent }}
          >
            <span>{claim}</span>
            <span className="shrink-0 opacity-90">{weight}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
