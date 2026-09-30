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

// Programme pilote : la demande est composée dans la messagerie du visiteur ;
// rien n'est envoyé ni enregistré par le site.
const formulaire = document.getElementById("formulaire-pilote");
if (formulaire) {
  formulaire.addEventListener("submit", (evenement) => {
    evenement.preventDefault();
    const champ = (nom) => formulaire.elements[nom];
    let valide = true;
    ["nom", "email"].forEach((nom) => {
      const el = champ(nom);
      const ok = el.value.trim() && (nom !== "email" || /.+@.+\..+/.test(el.value));
      el.classList.toggle("invalide", !ok);
      if (!ok) valide = false;
    });
    const note = document.getElementById("formulaire-note");
    if (!valide) {
      note.textContent = "Merci d'indiquer votre nom et une adresse e-mail valide.";
      return;
    }
    const corps = [
      `Demande : ${champ("demande").value}`,
      `Nom : ${champ("nom").value.trim()}`,
      `Cabinet : ${champ("cabinet").value.trim() || "—"}`,
      `E-mail : ${champ("email").value.trim()}`,
      `Activité : ${champ("activite").value}`,
      "",
      champ("message").value.trim(),
    ].join("\n");
    const sujet = `Lytis — ${champ("demande").value} — ${champ("nom").value.trim()}`;
    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
    note.textContent = "Votre messagerie s'ouvre avec la demande pré-remplie : il ne reste qu'à l'envoyer.";
  });
}

// Boutons des offres : présélectionnent la demande dans le formulaire
document.querySelectorAll(".choix-demande").forEach((a) => {
  a.addEventListener("click", () => {
    const choix = document.getElementById("f-demande");
    if (choix) choix.value = a.dataset.demande;
  });
});
