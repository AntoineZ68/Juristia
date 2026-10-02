import { isPlaceholder } from "@/lib/legal";

/** Affiche une valeur légale ; les champs encore à compléter sont surlignés pour ne pas passer inaperçus. */
export default function Field({ value, email = false }: { value: string; email?: boolean }) {
  if (isPlaceholder(value)) {
    return <mark className="rounded-[3px] bg-framboise/10 px-1 text-framboise">{value}</mark>;
  }
  if (email) {
    return (
      <a href={`mailto:${value}`} className="text-framboise underline decoration-framboise/40 underline-offset-4 hover:decoration-framboise">
        {value}
      </a>
    );
  }
  return <>{value}</>;
}
