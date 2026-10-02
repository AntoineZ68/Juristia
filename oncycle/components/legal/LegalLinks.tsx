type Props = { className?: string; linkClassName?: string };

/** Liens légaux présents dans le pied de page de toutes les pages. */
export default function LegalLinks({ className = "", linkClassName = "" }: Props) {
  return (
    <nav aria-label="Informations légales" className={className}>
      <a href="/mentions-legales/" className={linkClassName}>
        Mentions légales
      </a>
      <a href="/confidentialite/" className={linkClassName}>
        Politique de confidentialité
      </a>
    </nav>
  );
}
