/**
 * Aperçu statique de l'application (aucune donnée réelle).
 * Entièrement en HTML/CSS : pas d'image à charger, net sur tous les écrans.
 * À remplacer par une capture réelle de l'app lorsque les visuels seront prêts.
 */

const timeline = [
  {
    date: "14 mars — 21 h 40",
    title: "Appel au 17 signalant des cris au 3e étage",
    source: "D. 4 · p. 2",
    tag: "Fait",
  },
  {
    date: "14 mars — 22 h 05",
    title: "Intervention de l'équipage ; constatations sur place",
    source: "D. 6 · p. 1-4",
    tag: "PV",
  },
  {
    date: "15 mars — 09 h 12",
    title: "Audition du témoin M. Vaillant (version n° 1)",
    source: "D. 11 · p. 3",
    tag: "Audition",
  },
  {
    date: "02 avril — 14 h 30",
    title: "Seconde audition : horaire contredit la première déclaration",
    source: "D. 38 · p. 6",
    tag: "Contradiction",
  },
];

export function ProductMock() {
  return (
    <div className="overflow-hidden rounded-[6px] border border-line-strong bg-paper-pure shadow-[0_28px_80px_-40px_rgba(22,19,15,0.35)]">
      {/* Barre de dossier */}
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3 min-w-0">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-line-strong" />
            <span className="h-2 w-2 rounded-full bg-line-strong" />
            <span className="h-2 w-2 rounded-full bg-line-strong" />
          </span>
          <p className="truncate text-[0.8125rem] text-ink-muted">
            <span className="text-ink">Dossier 24/01183</span> — Instruction · 2 847 pages
          </p>
        </div>
        <span className="hidden shrink-0 rounded-full bg-seal-soft px-2.5 py-1 text-[0.6875rem] font-medium tracking-wide text-seal sm:inline">
          Analyse terminée · 41 min
        </span>
      </div>

      <div className="grid gap-0 md:grid-cols-[168px_1fr]">
        {/* Colonne de navigation */}
        <aside className="hidden border-r border-line p-4 md:block">
          <p className="eyebrow mb-3">Classeur</p>
          <ul className="space-y-1 text-[0.8125rem]">
            {[
              ["Chronologie", true],
              ["Acteurs · 23", false],
              ["Infractions", false],
              ["Pièces & scellés", false],
              ["Contradictions · 7", false],
            ].map(([label, active]) => (
              <li key={label as string}>
                <span
                  className={`block rounded-[3px] px-2 py-1.5 ${
                    active ? "bg-paper-deep text-ink" : "text-ink-muted"
                  }`}
                >
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Chronologie */}
        <div className="p-4 sm:p-6">
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h3 className="display text-2xl">Chronologie des faits</h3>
            <span className="text-[0.75rem] text-ink-faint">4 / 312 événements</span>
          </div>

          <ol className="relative space-y-5 border-l border-line pl-5">
            {timeline.map((item) => (
              <li key={item.source} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[23px] top-1.5 h-[7px] w-[7px] rounded-full border border-line-strong bg-paper-pure"
                />
                <p className="text-[0.75rem] uppercase tracking-[0.1em] text-ink-faint">
                  {item.date}
                </p>
                <p className="mt-1 text-[0.9375rem] leading-snug text-ink">
                  {item.title}
                </p>
                <p className="mt-1.5 flex flex-wrap items-center gap-2 text-[0.75rem]">
                  <span className="rounded-[3px] border border-line px-1.5 py-0.5 text-ink-muted">
                    {item.tag}
                  </span>
                  <span className="font-medium text-seal underline decoration-seal/30 underline-offset-2">
                    {item.source}
                  </span>
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-6 rounded-[4px] border border-line bg-paper px-4 py-3">
            <p className="eyebrow mb-1.5">Source rattachée</p>
            <p className="text-[0.875rem] leading-relaxed text-ink-muted">
              « …je suis rentré vers 22 h 30, la porte du palier était entrouverte… »
              <span className="ml-1.5 whitespace-nowrap text-seal">D. 38 · p. 6, l. 14</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
