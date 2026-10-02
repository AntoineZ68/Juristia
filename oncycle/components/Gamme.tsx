import { BadgeCheck } from "lucide-react";
import ProductPack, { type PackTone } from "./ProductPack";
import Reveal from "./Reveal";
import { Eyebrow, SectionTitle } from "./ui";

type Product = {
  n: string;
  name: string;
  texture: string;
  desc: string;
  tone: PackTone;
  iron: string;
  ironVnr: string;
  mg: string;
  third: [string, string];
};

const products: Product[] = [
  {
    n: "01",
    name: "L'Originelle Croustillante",
    texture: "Croquant aérien",
    desc: "Chocolat noir d'origine & lentilles vertes soufflées pour un croquant aérien.",
    tone: "cacao",
    iron: "9,8",
    ironVnr: "70",
    mg: "210",
    third: ["Protéines", "11 g"],
  },
  {
    n: "02",
    name: "L'Essentielle Torréfiée",
    texture: "Velouté praliné",
    desc: "Chocolat noir soyeux & farine de lentille torréfiée, texture veloutée et notes gourmandes de praliné/noisette.",
    tone: "noisette",
    iron: "10,4",
    ironVnr: "74",
    mg: "215",
    third: ["Protéines", "12 g"],
  },
  {
    n: "03",
    name: "L'Éclat Baies Rouges",
    texture: "Acidulé tonique",
    desc: "Chocolat noir, lentilles torréfiées et éclats de framboises & myrtilles lyophilisées pour une pointe acidulée tonique.",
    tone: "grenat",
    iron: "9,6",
    ironVnr: "69",
    mg: "198",
    third: ["Vitamine C", "15 mg"],
  },
  {
    n: "04",
    name: "Le Cœur Coulant",
    texture: "Fondant fruité",
    desc: "Chocolat noir, lentilles torréfiées et cœur fondant au coulis de cassis & framboise fraîche.",
    tone: "cassis",
    iron: "8,2",
    ironVnr: "59",
    mg: "176",
    third: ["Vitamine C", "18 mg"],
  },
];

export default function Gamme() {
  return (
    <section id="gamme" className="py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>03 — La Gamme OnCycle</Eyebrow>
            <SectionTitle>
              Quatre textures, <em className="text-grenat">une seule efficacité.</em>
            </SectionTitle>
          </div>
          <p className="max-w-sm text-[15px] leading-[1.75] text-cacao/60">
            Même base fonctionnelle, quatre expériences de dégustation. Tablettes de 80 g, sécables en 16 carrés.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.n} delay={i * 90} as="article" className="group flex flex-col overflow-hidden rounded-[24px] border border-stone-200 bg-white transition-shadow duration-500 hover:shadow-lift">
              <div className="relative flex items-center justify-center bg-poudre/60 px-10 pb-8 pt-12">
                <span className="absolute left-5 top-5 inline-flex items-center gap-1 rounded-full border border-ambre/30 bg-ambre-soft px-2.5 py-1 text-[10px] font-semibold text-ambre">
                  <BadgeCheck className="h-3 w-3" /> Formule Déposée
                </span>
                <span className="absolute right-5 top-5 font-serif text-2xl text-cacao/25">{p.n}</span>
                <div className="w-[58%] max-w-[170px] transition-transform duration-700 group-hover:-translate-y-2 group-hover:-rotate-2">
                  <ProductPack tone={p.tone} number={p.n} name={p.name} />
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-grenat">{p.texture}</p>
                <h3 className="mt-2 font-serif text-[1.75rem] leading-tight">{p.name}</h3>
                <p className="mt-3 flex-1 text-[14px] leading-[1.7] text-cacao/65">{p.desc}</p>

                <div className="mt-6 rounded-2xl border border-stone-200 bg-creme p-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cacao/45">Teneur en fer</span>
                    <span className="text-[10px] text-cacao/40">/ 100 g</span>
                  </div>
                  <p className="mt-1 font-serif text-3xl leading-none">
                    {p.iron} <span className="font-sans text-sm">mg</span>
                  </p>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-stone-200">
                    <div className="h-full rounded-full bg-grenat" style={{ width: `${p.ironVnr}%` }} />
                  </div>
                  <p className="mt-1.5 text-[10.5px] text-cacao/50">{p.ironVnr} % des VNR</p>

                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-stone-200 pt-3 text-[12px]">
                    <div>
                      <dt className="text-cacao/45">Magnésium</dt>
                      <dd className="font-semibold">{p.mg} mg</dd>
                    </div>
                    <div>
                      <dt className="text-cacao/45">{p.third[0]}</dt>
                      <dd className="font-semibold">{p.third[1]}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-[11px] text-cacao/40">
          Profils nutritionnels indicatifs pour 100 g, calculés à partir des tables de composition — en cours de
          validation par analyse en laboratoire. VNR : valeurs nutritionnelles de référence (Règl. UE 1169/2011).
        </p>
      </div>
    </section>
  );
}
