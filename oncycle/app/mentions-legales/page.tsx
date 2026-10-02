import type { Metadata } from "next";
import Field from "@/components/legal/Field";
import LegalPage from "@/components/legal/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Mentions légales — OnCycle.",
  description: "Éditeur, directeur de la publication et hébergeur du site OnCycle.",
};

export default function MentionsLegales() {
  return (
    <LegalPage eyebrow="Informations légales" title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        <Field value={LEGAL.editeur} />
        <br />
        <Field value={LEGAL.editeurAdresse} />
        <br />
        Contact : <Field value={LEGAL.contactEmail} email />
      </p>

      <h2>Directeur de la publication</h2>
      <p>
        <Field value={LEGAL.directeurPublication} />
      </p>

      <h2>Hébergeur</h2>
      <p>
        {LEGAL.renderNom}
        <br />
        <Field value={LEGAL.renderAdresse} />
        <br />
        Site :{" "}
        <a href="https://render.com" target="_blank" rel="noopener noreferrer">
          render.com
        </a>
      </p>

      <h2>Contexte du projet</h2>
      <p>
        OnCycle est un projet conçu dans le cadre du Programme PCE. Les produits présentés sont en cours de
        développement et ne sont pas encore commercialisés.
      </p>

      <h2>Données personnelles</h2>
      <p>
        La collecte d&apos;adresses e-mail via la liste d&apos;attente est décrite dans notre{" "}
        <a href="/confidentialite/">politique de confidentialité</a>.
      </p>
    </LegalPage>
  );
}
