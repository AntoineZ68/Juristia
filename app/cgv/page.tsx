import type { Metadata } from "next";

import { LegalLayout } from "@/components/legal-layout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: `Conditions générales de vente et d'utilisation du service ${site.name}.`,
};

/**
 * ⚠️ MODÈLE À COMPLÉTER ET À FAIRE RELIRE
 * Trame de CGV/CGU SaaS B2B. Elle doit être adaptée à l'offre réelle
 * (SLA, sous-traitants IA, assurance RC professionnelle) et validée par un conseil.
 */
export default function CgvPage() {
  return (
    <LegalLayout title="Conditions générales de vente" updatedAt="à compléter">
      <p>
        Les présentes conditions générales de vente et d&apos;utilisation (les « CGV »)
        régissent la fourniture du service {site.name} par{" "}
        <span className="todo">Juristia SAS</span> (l&apos;« Éditeur ») à tout professionnel
        du droit souscrivant un abonnement (le « Client »).
      </p>

      <h2>1. Objet et champ d&apos;application</h2>
      <p>
        {site.name} est un service en ligne d&apos;aide à l&apos;analyse de dossiers pénaux :
        extraction, structuration, mise en chronologie et référencement des pièces
        déposées par le Client. La souscription emporte acceptation sans réserve
        des présentes CGV, qui prévalent sur tout document du Client.
      </p>

      <h2>2. Souscription et compte</h2>
      <p>
        L&apos;abonnement est souscrit en ligne depuis l&apos;espace client. Le Client garantit
        l&apos;exactitude des informations transmises et assure la confidentialité de ses
        identifiants. Toute action réalisée depuis son compte est réputée effectuée
        par lui. Le Client informe sans délai l&apos;Éditeur de toute utilisation non autorisée.
      </p>

      <h2>3. Prix et facturation</h2>
      <p>
        Les tarifs en vigueur sont ceux affichés sur le site à la date de la commande,
        exprimés en euros et hors taxes. La facturation est{" "}
        <span className="todo">mensuelle / annuelle</span>, payable à échéance par{" "}
        <span className="todo">moyens de paiement acceptés</span>. Tout retard de
        paiement entraîne de plein droit des pénalités au taux prévu à l&apos;article
        L.441-10 du code de commerce et une indemnité forfaitaire de recouvrement
        de 40 euros.
      </p>

      <h2>4. Durée, renouvellement et résiliation</h2>
      <p>
        L&apos;abonnement est conclu pour une durée de <span className="todo">durée initiale</span>,
        renouvelable par tacite reconduction. Il peut être résilié depuis l&apos;espace client
        moyennant un préavis de <span className="todo">durée du préavis</span>, la résiliation
        prenant effet au terme de la période en cours. L&apos;Éditeur peut suspendre l&apos;accès
        en cas de manquement grave, après mise en demeure restée sans effet.
      </p>

      <h2>5. Obligations du Client</h2>
      <ul>
        <li>
          S&apos;assurer qu&apos;il dispose du droit de déposer les documents transmis et respecter
          le secret professionnel qui lui incombe.
        </li>
        <li>
          Vérifier systématiquement les éléments restitués par le service avant tout usage
          professionnel ou procédural.
        </li>
        <li>
          Ne pas détourner le service de sa finalité, ni tenter d&apos;en extraire les modèles,
          le code ou les bases de données.
        </li>
      </ul>

      <h2>6. Nature du service et absence de conseil juridique</h2>
      <p>
        Le service repose sur des traitements automatisés, y compris des modèles
        d&apos;intelligence artificielle, susceptibles de produire des résultats incomplets
        ou erronés. Il constitue une aide à l&apos;analyse documentaire et{" "}
        <strong>ne constitue ni un conseil juridique, ni une prestation d&apos;avocat</strong>.
        L&apos;avocat utilisateur conserve l&apos;entière maîtrise et l&apos;entière responsabilité
        de son analyse, de sa stratégie et des actes accomplis pour son client.
      </p>

      <h2>7. Disponibilité et maintenance</h2>
      <p>
        L&apos;Éditeur met en œuvre les moyens raisonnables pour assurer une disponibilité
        de <span className="todo">niveau d&apos;engagement</span>, hors maintenances planifiées
        notifiées à l&apos;avance et hors indisponibilités imputables à des tiers ou au réseau.
      </p>

      <h2>8. Propriété intellectuelle et propriété des données</h2>
      <p>
        L&apos;Éditeur conserve la propriété du service et de ses composants ; le Client
        bénéficie d&apos;un droit d&apos;usage personnel, non exclusif et non cessible pour la
        durée de l&apos;abonnement. Le Client demeure propriétaire des documents qu&apos;il dépose
        et des résultats qui en sont issus. L&apos;Éditeur n&apos;acquiert aucun droit sur ces
        contenus et ne les utilise pas pour entraîner de modèle.
      </p>

      <h2>9. Confidentialité et données personnelles</h2>
      <p>
        Chaque partie s&apos;engage à préserver la confidentialité des informations reçues
        de l&apos;autre. Le traitement des données personnelles est décrit dans la{" "}
        <a href="/confidentialite">politique de confidentialité</a> et encadré par un
        accord de sous-traitance conforme à l&apos;article 28 du RGPD, communiqué sur demande.
      </p>

      <h2>10. Responsabilité</h2>
      <p>
        La responsabilité de l&apos;Éditeur est limitée aux dommages directs et plafonnée au
        montant des sommes effectivement versées par le Client au titre des{" "}
        <span className="todo">douze</span> mois précédant le fait générateur. Sont exclus
        les dommages indirects, notamment la perte de chance, l&apos;atteinte à l&apos;image et le
        préjudice résultant d&apos;un défaut de vérification des résultats par le Client.
      </p>

      <h2>11. Force majeure</h2>
      <p>
        Aucune des parties ne saurait être tenue responsable d&apos;un manquement résultant
        d&apos;un cas de force majeure au sens de l&apos;article 1218 du code civil.
      </p>

      <h2>12. Droit applicable et juridiction</h2>
      <p>
        Les présentes CGV sont soumises au droit français. À défaut d&apos;accord amiable,
        tout différend sera porté devant les tribunaux de{" "}
        <span className="todo">ressort compétent</span>.
      </p>
    </LegalLayout>
  );
}
