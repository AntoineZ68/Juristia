// Lytis — comportements du site vitrine : en-tête au défilement, apparitions,
// liens de démo, bloc fondateur et formulaire du programme pilote.
"use strict";

const CONFIG = window.LYTIS_SITE || {};
document.documentElement.classList.remove("sans-js");

// Liens vers la démonstration
document.querySelectorAll(".lien-demo").forEach((a) => { a.href = CONFIG.demo || "#"; });

// En-tête : transparent sur l'accroche, clair ensuite
const entete = document.getElementById("entete");
if (entete && !entete.classList.contains("entete-fixe-claire")) {
  const majEntete = () => entete.classList.toggle("defile", window.scrollY > 40);
  majEntete();
  window.addEventListener("scroll", majEntete, { passive: true });
}

// Apparition progressive des blocs
const elements = document.querySelectorAll(".apparition");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observateur = new IntersectionObserver((entrees) => {
    entrees.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); observateur.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  elements.forEach((el) => observateur.observe(el));
} else {
  elements.forEach((el) => el.classList.add("visible"));
}

// Fondateur
const f = CONFIG.fondateur || {};
const photo = document.getElementById("fondateur-photo");
if (photo) {
  if (f.photo) photo.style.backgroundImage = `url("${f.photo}")`;
  else photo.textContent = (f.nom || "").split(" ").map((m) => m[0]).join("").slice(0, 2);
  document.querySelector(".fondateur-nom").textContent = f.nom || "";
  document.querySelector(".fondateur-role").textContent = f.role || "";
  document.querySelector(".fondateur-texte").textContent = f.texte || "";
  const linkedin = document.getElementById("lien-linkedin");
  if (CONFIG.linkedin) { linkedin.href = CONFIG.linkedin; linkedin.hidden = false; }
}

// Programme pilote : la demande est envoyée au service configuré (Formspree),
// qui la transmet par e-mail ; sans adresse configurée, elle s'ouvre dans la
// messagerie du visiteur.
const formulaire = document.getElementById("formulaire-pilote");
if (formulaire) {
  const note = document.getElementById("formulaire-note");
  const merci = document.getElementById("formulaire-merci");
  const bouton = formulaire.querySelector('button[type="submit"]');
  const champ = (nom) => formulaire.elements[nom];
  const lire = () => ({
    demande: champ("demande").value,
    nom: champ("nom").value.trim(),
    cabinet: champ("cabinet").value.trim(),
    email: champ("email").value.trim(),
    activite: champ("activite").value,
    message: champ("message").value.trim(),
  });
  const sujet = (v) => `Lytis — ${v.demande} — ${v.nom}`;
  const parMessagerie = (v) => {
    const corps = [`Demande : ${v.demande}`, `Nom : ${v.nom}`, `Cabinet : ${v.cabinet || "—"}`,
      `E-mail : ${v.email}`, `Activité : ${v.activite}`, "", v.message].join("\n");
    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(sujet(v))}&body=${encodeURIComponent(corps)}`;
    note.textContent = "Votre messagerie s'ouvre avec la demande pré-remplie : il ne reste qu'à l'envoyer.";
  };

  formulaire.addEventListener("submit", async (evenement) => {
    evenement.preventDefault();
    let valide = true;
    ["nom", "email"].forEach((nom) => {
      const el = champ(nom);
      const ok = el.value.trim() && (nom !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
      el.classList.toggle("invalide", !ok);
      el.setAttribute("aria-invalid", String(!ok));
      if (!ok) valide = false;
    });
    if (!valide) {
      note.textContent = "Merci d'indiquer votre nom et une adresse e-mail valide.";
      return;
    }
    if (champ("_gotcha") && champ("_gotcha").value) return; // robot : champ caché rempli
    const v = lire();
    if (!CONFIG.formulaire) { parMessagerie(v); return; }

    const libelle = bouton.textContent;
    bouton.disabled = true;
    bouton.textContent = "Envoi en cours…";
    note.textContent = "";
    try {
      const reponse = await fetch(CONFIG.formulaire, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...v, _subject: sujet(v) }),
      });
      if (!reponse.ok) throw new Error(String(reponse.status));
      formulaire.hidden = true;
      merci.hidden = false;
      merci.focus();
    } catch (erreur) {
      bouton.disabled = false;
      bouton.textContent = libelle;
      note.innerHTML = `L'envoi n'a pas abouti. Réessayez dans un instant, ou écrivez directement à <a href="mailto:${CONFIG.email}">${CONFIG.email}</a>.`;
    }
  });
}

// Boutons des offres : présélectionnent la demande dans le formulaire
document.querySelectorAll(".choix-demande").forEach((a) => {
  a.addEventListener("click", () => {
    const choix = document.getElementById("f-demande");
    if (choix) choix.value = a.dataset.demande;
  });
});
