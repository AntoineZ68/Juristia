import { ArrowRight, Droplets, Leaf, Sparkles, Zap } from "lucide-react";
import ProductPack from "./ProductPack";

const badges = [
  { icon: Droplets, title: "Double source de Fer", text: "Cacao noir + lentilles torréfiées" },
  { icon: Zap, title: "Magnésium Antifatigue", text: "Contribue à réduire la fatigue" },
  { icon: Sparkles, title: "Assimilation Boostée x3", text: "Grâce à la vitamine C des baies*" },
];

function ChocolateBar() {
  return (
    <div
      className="relative aspect-[3/4.2] rounded-[5px] p-[5%] shadow-lift"
      style={{ background: "linear-gradient(145deg,#4a3026 0%,#2b1a13 60%,#1d110c 100%)" }}
      aria-hidden
    >
      <div className="grid h-full grid-cols-3 grid-rows-4 gap-[4%]">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[3px]"
            style={{
              background: "linear-gradient(145deg,#4d3228 0%,#331f17 45%,#24150f 100%)",
              boxShadow:
                "inset 1.5px 1.5px 1px rgba(255,220,190,.14), inset -2px -2px 3px rgba(0,0,0,.45), 0 1px 0 rgba(255,255,255,.03)",
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-[5px] bg-gradient-to-br from-white/10 via-transparent to-transparent" />
    </div>
  );
}

function Mockup() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      {/* halo */}
      <div className="absolute inset-[8%] rounded-full bg-poudre" />
      <div className="absolute inset-[18%] rounded-full border border-grenat/15" />
      <div className="absolute inset-[2%] rounded-full border border-dashed border-cacao/10" />

      {/* tablette nue */}
      <div className="absolute left-[10%] top-[18%] w-[34%] -rotate-[14deg] sm:left-[12%]">
        <ChocolateBar />
      </div>

      {/* étui principal */}
      <div className="absolute left-[36%] top-[8%] w-[40%] animate-float" style={{ "--r": "4deg" } as React.CSSProperties}>
        <ProductPack tone="grenat" number="03" name="L'Éclat Baies Rouges" large />
        {/* ombre portée */}
        <div className="absolute -bottom-6 left-[10%] h-6 w-[80%] rounded-[50%] bg-cacao/25 blur-xl" />
      </div>

      {/* éclats de fruits rouges */}
      <span className="absolute bottom-[20%] left-[18%] h-4 w-4 rounded-full bg-grenat shadow-soft" />
      <span className="absolute bottom-[14%] left-[27%] h-2.5 w-2.5 rounded-full bg-[#3f1a36]" />
      <span className="absolute right-[12%] top-[16%] h-3 w-3 rounded-full bg-[#a33a4a]" />

      {/* chips flottants */}
      <div className="absolute bottom-[14%] right-[2%] rounded-2xl border border-stone-200 bg-white/90 px-4 py-3 shadow-soft backdrop-blur sm:right-[4%]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cacao/50">Fer / 100 g</p>
        <p className="font-serif text-3xl leading-none">
          9,6 <span className="font-sans text-xs font-semibold text-grenat">mg · 69 % VNR</span>
        </p>
      </div>
      <div className="absolute left-0 top-[58%] hidden items-center gap-2 rounded-full border border-stone-200 bg-white/90 py-2 pl-2 pr-4 shadow-soft backdrop-blur sm:flex">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ambre-soft text-ambre">
          <Leaf className="h-3.5 w-3.5" />
        </span>
        <span className="text-xs font-semibold">Lentilles origine France</span>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      {/* fond */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-poudre/70 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        <div className="reveal is-visible">
          <span className="inline-flex items-center gap-2 rounded-full border border-grenat/20 bg-white/70 px-3.5 py-1.5 text-[11.5px] font-semibold tracking-wide text-grenat">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-grenat/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-grenat" />
            </span>
            Nutrition Fonctionnelle &amp; Cycle Féminin
          </span>

          <h1 className="mt-7 font-serif text-[3.1rem] leading-[0.98] tracking-[-0.02em] sm:text-7xl lg:text-[4.9rem]">
            Recharger vos réserves.
            <br />
            <em className="text-grenat">Répondre à vos envies.</em>
            <br />
            <span className="text-cacao/40">Sans aucun compromis.</span>
          </h1>

          <p className="mt-8 max-w-xl text-[16.5px] leading-[1.7] text-cacao/70 sm:text-lg">
            Le premier chocolat noir fonctionnel pensé pour le cycle féminin : une alliance de{" "}
            <strong className="font-semibold text-cacao">cacao noir grand cru</strong>, de{" "}
            <strong className="font-semibold text-cacao">farine de lentilles torréfiée</strong> et de{" "}
            <strong className="font-semibold text-cacao">fruits rouges</strong> pour compenser les pertes en fer et
            magnésium par la gourmandise.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#gamme"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-cacao px-7 py-4 text-sm font-semibold text-creme shadow-soft transition-all hover:bg-grenat"
            >
              Découvrir la gamme
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#synergie"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cacao/25 px-7 py-4 text-sm font-semibold transition-all hover:border-cacao hover:bg-white"
            >
              Comprendre la formule
            </a>
          </div>
        </div>

        <Mockup />
      </div>

      {/* badges */}
      <div className="relative mx-auto mt-16 max-w-7xl px-5 sm:px-8 lg:mt-20">
        <ul className="grid divide-y divide-stone-200 overflow-hidden rounded-3xl border border-stone-200 bg-white/70 backdrop-blur sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {badges.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-4 px-6 py-6 sm:px-7">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ambre/30 bg-ambre-soft text-ambre">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </span>
              <span>
                <span className="block text-[15px] font-semibold">{title}</span>
                <span className="block text-[13px] text-cacao/55">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
