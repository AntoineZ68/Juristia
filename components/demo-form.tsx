"use client";

import { useState } from "react";

import { leads, site } from "@/lib/site";

type Status = "idle" | "sending" | "success" | "error";

const fieldClass =
  "w-full border border-line bg-paper-pure px-4 py-3 text-[0.9375rem] text-ink " +
  "placeholder:text-ink-faint focus:border-ink focus:outline-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seal";

const labelClass = "mb-2 block text-[0.8125rem] font-medium text-ink";

export function DemoForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Piège à robots : un champ invisible que seuls les scripts remplissent.
    if (data.get("societe")) {
      setStatus("success");
      return;
    }

    if (!leads.enabled) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch(leads.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: leads.anonKey,
          Authorization: `Bearer ${leads.anonKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          nom: data.get("nom"),
          cabinet: data.get("cabinet"),
          email: data.get("email"),
          telephone: data.get("telephone") || null,
          message: data.get("message") || null,
          consentement: data.get("consentement") === "on",
          source: "site-vitrine",
        }),
      });

      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex min-h-[320px] flex-col justify-center border border-ink bg-paper-pure p-8 sm:p-10"
      >
        <p className="eyebrow text-seal">Demande enregistrée</p>
        <h3 className="display mt-4 text-3xl">Nous vous rappelons sous 24 h ouvrées.</h3>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-muted">
          Préparez si possible un dossier en cours : la démonstration se fait sur
          vos pièces, pas sur un jeu de données de façade.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-line bg-paper-pure p-6 sm:p-8"
      noValidate={false}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nom" className={labelClass}>
            Nom et prénom
          </label>
          <input id="nom" name="nom" required maxLength={120} autoComplete="name" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="cabinet" className={labelClass}>
            Cabinet
          </label>
          <input id="cabinet" name="cabinet" required maxLength={160} autoComplete="organization" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            E-mail professionnel
          </label>
          <input id="email" name="email" type="email" required maxLength={200} autoComplete="email" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="telephone" className={labelClass}>
            Téléphone <span className="font-normal text-ink-faint">(facultatif)</span>
          </label>
          <input id="telephone" name="telephone" type="tel" maxLength={40} autoComplete="tel" className={fieldClass} />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className={labelClass}>
          Votre dossier type <span className="font-normal text-ink-faint">(facultatif)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          maxLength={2000}
          placeholder="Volume de pages, type de procédure, échéance…"
          className={`${fieldClass} resize-y`}
        />
      </div>

      {/* Honeypot : masqué aux humains, ignoré des lecteurs d'écran. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="societe">Ne pas remplir</label>
        <input id="societe" name="societe" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="mt-6 flex items-start gap-3 text-[0.8125rem] leading-relaxed text-ink-muted">
        <input
          type="checkbox"
          name="consentement"
          required
          className="mt-[3px] h-4 w-4 shrink-0 accent-[#1f3b33]"
        />
        <span>
          J&apos;accepte d&apos;être recontacté au sujet de ma demande. Ces données ne
          sont utilisées qu&apos;à cette fin — voir la{" "}
          <a href="/confidentialite" className="text-ink underline underline-offset-2">
            politique de confidentialité
          </a>
          .
        </span>
      </label>

      <button type="submit" disabled={status === "sending"} className="btn btn-primary mt-7 w-full disabled:opacity-60">
        {status === "sending" ? "Envoi en cours…" : "Demander une démonstration"}
      </button>

      <p aria-live="polite" className="mt-4 text-[0.8125rem] leading-relaxed text-ink-faint">
        {status === "error" ? (
          <span className="text-ink">
            L&apos;envoi a échoué. Écrivez-nous directement à{" "}
            <a href={`mailto:${site.contactEmail}`} className="underline underline-offset-2">
              {site.contactEmail}
            </a>
            .
          </span>
        ) : (
          "Réponse sous 24 h ouvrées. Aucune donnée de dossier n'est demandée à ce stade."
        )}
      </p>
    </form>
  );
}
