import type { Metadata } from "next";
import Field from "@/components/legal/Field";
import LegalPage from "@/components/legal/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité — OnCycle.",
  description: "Comment OnCycle collecte, utilise et protège votre adresse e-mail.",
};

export default function Confidentialite() {
  return (
    <LegalPage
      eyebrow="Vos données"
      title="Politique de confidentialité"
      intro={
        <p>
          En bref : nous collectons uniquement votre adresse e-mail, seulement si vous nous la donnez, et seulement
          pour vous prévenir du lancement d&apos;OnCycle. Nous ne la revendons pas et ne l&apos;utilisons pour rien
          d&apos;autre. Vous pouvez changer d&apos;avis à tout moment.
        </p>
      }
    >
      <h2>Qui est responsable de vos données ?</h2>
      <p>
        Le responsable du traitement est <Field value={LEGAL.responsable} />. Pour toute question sur vos données,
        écrivez à <Field value={LEGAL.contactEmail} email />.
      </p>

      <h2>Quelles données collectons-nous ?</h2>
      <p>Lorsque vous rejoignez la liste d&apos;attente, nous recevons :</p>
      <ul>
        <li>votre adresse e-mail ;</li>
        <li>
          la mention « batch-01 », ajoutée automatiquement par le formulaire pour savoir de quelle liste il s&apos;agit ;
        </li>
        <li>la mention « consentement : oui », qui garde la trace de votre accord.</li>
      </ul>
      <p>Nous ne vous demandons ni votre nom, ni votre téléphone, ni aucune donnée de santé.</p>

      <h2>Pourquoi ?</h2>
      <p>
        Uniquement pour vous informer du lancement d&apos;OnCycle et de la disponibilité du premier batch. Votre adresse
        n&apos;est utilisée à aucune autre fin, n&apos;est ni vendue, ni louée, ni cédée à des tiers.
      </p>

      <h2>Sur quelle base légale ?</h2>
      <p>
        Votre <strong>consentement</strong>, que vous donnez en cochant la case prévue sous le formulaire. Sans cette
        case cochée, le formulaire ne peut pas être envoyé. Vous pouvez retirer votre consentement à tout moment, sans
        avoir à vous justifier ; cela ne remet pas en cause ce qui a été fait avant le retrait.
      </p>

      <h2>Combien de temps les conservons-nous ?</h2>
      <p>
        <Field value={LEGAL.conservation} />. Passé ce délai, votre adresse est supprimée.
      </p>

      <h2>Qui y a accès ?</h2>
      <p>
        Seule l&apos;équipe OnCycle. Pour fonctionner, le site s&apos;appuie sur deux prestataires techniques, qui
        agissent pour notre compte :
      </p>
      <ul>
        <li>
          <strong>Formspree</strong> (États-Unis) reçoit et stocke les inscriptions envoyées par le formulaire. Vos
          données sont donc transférées hors de l&apos;Union européenne. Garanties encadrant ce transfert :{" "}
          <Field value={LEGAL.formspreeGaranties} />.
        </li>
        <li>
          <strong>Render</strong> (États-Unis) héberge le site. Garanties encadrant ce transfert :{" "}
          <Field value={LEGAL.renderGaranties} />.
        </li>
      </ul>

      <h2>Cookies et mesure d&apos;audience</h2>
      <p>
        Ce site ne dépose aucun cookie et n&apos;utilise aucun outil de mesure d&apos;audience ni de suivi publicitaire.
        Les polices de caractères sont servies directement par notre site, sans appel à un service tiers. C&apos;est
        pourquoi aucun bandeau cookies ne vous est présenté.
      </p>

      <h2>Vos droits</h2>
      <p>Vous pouvez à tout moment :</p>
      <ul>
        <li>accéder aux données que nous détenons sur vous ;</li>
        <li>les faire rectifier ;</li>
        <li>les faire effacer ;</li>
        <li>vous opposer à leur utilisation ;</li>
        <li>retirer votre consentement.</li>
      </ul>
      <p>
        Il suffit d&apos;écrire à <Field value={LEGAL.contactEmail} email />. Nous vous répondons dans un délai
        d&apos;un mois au plus.
      </p>
      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL sur{" "}
        <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">
          cnil.fr
        </a>
        .
      </p>
    </LegalPage>
  );
}
