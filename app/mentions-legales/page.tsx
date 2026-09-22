import type { Metadata } from "next";

import { LegalLayout } from "@/components/legal-layout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site ${site.url} édité par ${site.legalName}.`,
  robots: { index: true, follow: true },
};

/**
 * ⚠️ MODÈLE À COMPLÉTER
 * Les éléments surlignés doivent être renseignés par l'éditeur et relus
 * par un conseil avant mise en ligne. Ce texte n'est pas une consultation juridique.
 */
export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales" updatedAt="à compléter">
      <p>
        Conformément aux articles 6-III et 19 de la loi n° 2004-575 du 21 juin 2004
        pour la confiance dans l&apos;économie numérique, les informations suivantes
        sont portées à la connaissance des utilisateurs du site {site.url}.
      </p>

      <h2>Éditeur du site</h2>
      <ul>
        <li>
          <strong>Dénomination sociale :</strong> <span className="todo">Juristia SAS</span>
        </li>
        <li>
          <strong>Forme juridique :</strong> <span className="todo">société par actions simplifiée</span>
        </li>
        <li>
          <strong>Capital social :</strong> <span className="todo">montant en euros</span>
        </li>
        <li>
          <strong>Siège social :</strong> <span className="todo">adresse complète</span>
        </li>
        <li>
          <strong>RCS :</strong> <span className="todo">ville et numéro d&apos;immatriculation</span>
        </li>
        <li>
          <strong>N° de TVA intracommunautaire :</strong> <span className="todo">FR00000000000</span>
        </li>
        <li>
          <strong>Directeur de la publication :</strong> <span className="todo">nom et prénom</span>
        </li>
        <li>
          <strong>Contact :</strong> <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
        </li>
      </ul>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par <span className="todo">raison sociale de l&apos;hébergeur</span>,{" "}
        <span className="todo">adresse</span>, <span className="todo">téléphone</span>.
        L&apos;application est hébergée sur une infrastructure située en{" "}
        <span className="todo">pays / région d&apos;hébergement</span>.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des éléments du site — structure, textes, identité visuelle,
        marques, logiciels et bases de données — est protégé par le droit de la
        propriété intellectuelle et demeure la propriété exclusive de l&apos;éditeur
        ou de ses concédants. Toute reproduction, représentation, adaptation ou
        exploitation, totale ou partielle, sans autorisation écrite préalable est
        interdite et constitue une contrefaçon au sens des articles L.335-2 et
        suivants du code de la propriété intellectuelle.
      </p>

      <h2>Responsabilité</h2>
      <p>
        Les informations diffusées sur le site sont fournies à titre indicatif.
        Juristia est un outil d&apos;aide à l&apos;analyse documentaire : il ne constitue
        ni une consultation juridique, ni une prestation d&apos;avocat au sens de la loi
        n° 71-1130 du 31 décembre 1971, et ne se substitue en aucun cas à
        l&apos;appréciation professionnelle de l&apos;avocat utilisateur, qui demeure seul
        responsable des actes accomplis dans l&apos;intérêt de son client.
      </p>

      <h2>Données personnelles et cookies</h2>
      <p>
        Le traitement des données personnelles est décrit dans la{" "}
        <a href="/confidentialite">politique de confidentialité</a>. Les conditions
        contractuelles applicables à l&apos;abonnement figurent dans les{" "}
        <a href="/cgv">conditions générales de vente</a>.
      </p>

      <h2>Litiges</h2>
      <p>
        Le site et son contenu sont régis par le droit français. À défaut de
        résolution amiable, tout litige relève de la compétence des tribunaux de{" "}
        <span className="todo">ressort compétent</span>, sous réserve des règles
        impératives applicables aux consommateurs.
      </p>
    </LegalLayout>
  );
}
