import type { Metadata } from "next";

import { LegalLayout } from "@/components/legal-layout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Traitement des données personnelles et protection des dossiers confiés à ${site.name}.`,
};

/**
 * ⚠️ MODÈLE À COMPLÉTER ET À FAIRE VALIDER (DPO / conseil).
 * Les mentions surlignées dépendent de l'architecture réelle :
 * hébergeur, fournisseurs de modèles IA, localisation, durées de conservation.
 */
export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité" updatedAt="à compléter">
      <p>
        {site.name} traite des dossiers couverts par le secret professionnel de
        l&apos;avocat. La présente politique décrit les traitements de données à
        caractère personnel mis en œuvre, conformément au règlement (UE) 2016/679
        (RGPD) et à la loi Informatique et Libertés.
      </p>

      <h2>1. Responsable de traitement et rôles</h2>
      <p>
        Pour les données du site vitrine et de la gestion des comptes,{" "}
        <span className="todo">Juristia SAS</span> agit en qualité de responsable de
        traitement. Pour les documents déposés dans l&apos;application, le cabinet
        utilisateur est responsable de traitement et {site.name} agit en{" "}
        <strong>sous-traitant</strong> au sens de l&apos;article 28 du RGPD, dans le cadre
        d&apos;un accord de sous-traitance (DPA).
      </p>

      <h2>2. Données traitées</h2>
      <ul>
        <li>
          <strong>Compte et facturation :</strong> identité, cabinet, adresse
          électronique, données de facturation, journaux de connexion.
        </li>
        <li>
          <strong>Contenus déposés :</strong> pièces de procédure et données qu&apos;elles
          contiennent, y compris des données relatives à des infractions au sens de
          l&apos;article 10 du RGPD, traitées sur instruction du cabinet.
        </li>
        <li>
          <strong>Usage technique :</strong> mesures de performance et journaux de
          sécurité, strictement nécessaires au fonctionnement du service.
        </li>
      </ul>

      <h2>3. Finalités et bases légales</h2>
      <ul>
        <li>Fourniture du service et exécution du contrat (article 6.1.b du RGPD).</li>
        <li>Sécurité, prévention des abus et journalisation (intérêt légitime, article 6.1.f).</li>
        <li>Facturation et obligations comptables (obligation légale, article 6.1.c).</li>
        <li>
          Prospection et communication : consentement lorsqu&apos;il est requis (article 6.1.a).
        </li>
      </ul>

      <h2>4. Absence de réutilisation à des fins d&apos;entraînement</h2>
      <p>
        Les documents déposés et les résultats produits ne sont jamais utilisés pour
        entraîner, affiner ou évaluer un modèle d&apos;intelligence artificielle, que ce
        soit par l&apos;Éditeur ou par ses sous-traitants. Cette interdiction est répercutée
        contractuellement sur l&apos;ensemble des prestataires techniques.
      </p>

      <h2>5. Sous-traitants et localisation</h2>
      <p>
        Les traitements sont réalisés sur une infrastructure située en{" "}
        <span className="todo">pays / région</span>, opérée par{" "}
        <span className="todo">hébergeur</span>. Les prestataires intervenant dans le
        traitement automatisé des documents sont{" "}
        <span className="todo">liste des sous-traitants IA et de leur localisation</span>.
        La liste à jour est communiquée sur demande et toute évolution est notifiée
        conformément au DPA. <span className="todo">Indiquer, le cas échéant, tout transfert
        hors UE et les garanties associées (clauses contractuelles types).</span>
      </p>

      <h2>6. Durées de conservation</h2>
      <ul>
        <li>
          Documents et résultats : conservés pendant la durée de l&apos;abonnement, puis
          supprimés sous <span className="todo">délai</span> après la fin du contrat ou sur
          demande du cabinet.
        </li>
        <li>
          Données de compte et de facturation : durée légale de conservation comptable.
        </li>
        <li>
          Journaux de sécurité : <span className="todo">durée</span>, conformément aux
          recommandations de la CNIL.
        </li>
      </ul>

      <h2>7. Sécurité</h2>
      <p>
        Chiffrement des données en transit et au repos, cloisonnement des espaces par
        cabinet, contrôle des accès, journalisation, sauvegardes et procédure de gestion
        des violations de données. Toute violation susceptible d&apos;engendrer un risque est
        notifiée conformément aux articles 33 et 34 du RGPD.
      </p>

      <h2>8. Vos droits</h2>
      <p>
        Vous disposez des droits d&apos;accès, de rectification, d&apos;effacement, de limitation,
        d&apos;opposition et de portabilité. Ces droits s&apos;exercent auprès de{" "}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
        <span className="todo"> (ou du DPO : coordonnées)</span>. Lorsque la demande porte
        sur un dossier confié par un cabinet, elle est transmise à ce cabinet, responsable
        de traitement. Vous pouvez introduire une réclamation auprès de la CNIL
        (3 place de Fontenoy, 75007 Paris — <a href="https://www.cnil.fr">cnil.fr</a>).
      </p>

      <h2>9. Cookies</h2>
      <p>
        Le site vitrine n&apos;utilise que les cookies strictement nécessaires à son
        fonctionnement et ne dépose aucun traceur publicitaire.{" "}
        <span className="todo">Si une mesure d&apos;audience ou un outil marketing est ajouté,
        un bandeau de consentement conforme aux lignes directrices de la CNIL devient
        obligatoire.</span>
      </p>
    </LegalLayout>
  );
}
