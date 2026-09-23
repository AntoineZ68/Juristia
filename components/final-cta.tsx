import { DemoForm } from "@/components/demo-form";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export function FinalCta() {
  return (
    <section id="demo" className="scroll-mt-24 py-20 sm:py-28">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">Démonstration</p>
              <h2 className="display mt-5 text-[length:var(--text-h2)]">
                Votre prochain dossier
                <br />
                vous attend.{" "}
                <em className="italic text-seal">Pas trois week-ends de lecture.</em>
              </h2>
              <p className="mt-7 max-w-md text-[1rem] leading-relaxed text-ink-muted">
                La démonstration se fait sur l&apos;un de vos dossiers en cours, en
                conditions réelles. Vingt minutes, en visioconférence, avec un
                engagement de confidentialité signé au préalable si vous le souhaitez.
              </p>
              <p className="mt-8 text-[0.9375rem] text-ink-muted">
                Déjà client ?{" "}
                <a
                  href={site.appUrl}
                  rel="noopener"
                  className="border-b border-ink pb-0.5 text-ink transition-opacity hover:opacity-60"
                >
                  Accéder à mon espace
                </a>
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={120}>
              <DemoForm />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
