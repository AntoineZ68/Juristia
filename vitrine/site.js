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

// Avant / après : le curseur (champ « range », accessible au clavier) fixe la
// position de la séparation. À la première apparition, un léger va-et-vient
// montre qu'on peut le faire glisser.
const comparaison = document.querySelector(".comparaison");
if (comparaison) {
  const curseur = comparaison.querySelector(".cmp-curseur");
  const placer = (v) => {
    comparaison.style.setProperty("--pos", v + "%");
    comparaison.querySelector(".cmp-etiquette-avant").style.opacity = v < 14 ? 0 : 1;
    comparaison.querySelector(".cmp-etiquette-apres").style.opacity = v > 86 ? 0 : 1;
  };
  let touche = false;
  curseur.addEventListener("input", () => { touche = true; placer(curseur.value); });
  curseur.addEventListener("pointerdown", () => comparaison.classList.add("glisse"));
  window.addEventListener("pointerup", () => comparaison.classList.remove("glisse"));
  const demonstration = () => {
    if (touche || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const etapes = [[0, 50], [700, 76], [1500, 30], [2200, 50]];
    const debut = performance.now();
    const adoucir = (t) => 0.5 - Math.cos(Math.PI * t) / 2;
    const image = (maintenant) => {
      if (touche) return;
      const t = maintenant - debut;
      let i = 1;
      while (i < etapes.length - 1 && t > etapes[i][0]) i++;
      const [t0, v0] = etapes[i - 1], [t1, v1] = etapes[i];
      const v = v0 + (v1 - v0) * adoucir(Math.min(1, (t - t0) / (t1 - t0)));
      placer(v); curseur.value = Math.round(v);
      if (t < etapes[etapes.length - 1][0]) requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
  };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((e) => {
      if (e.some((x) => x.isIntersecting)) { io.disconnect(); setTimeout(demonstration, 400); }
    }, { threshold: 0.55 });
    io.observe(comparaison);
  }
}

// Chiffres : comptent jusqu'à leur valeur à la première apparition.
const chiffres = document.querySelectorAll(".chiffres-liste b[data-cible]");
if (chiffres.length && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  chiffres.forEach((b) => { b.textContent = "0"; });
  const io = new IntersectionObserver((e) => {
    if (!e.some((x) => x.isIntersecting)) return;
    io.disconnect();
    const debut = performance.now(), duree = 1600;
    const image = (maintenant) => {
      const t = Math.min(1, (maintenant - debut) / duree), k = 1 - Math.pow(1 - t, 3);
      chiffres.forEach((b) => { b.textContent = Math.round(Number(b.dataset.cible) * k); });
      if (t < 1) requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
  }, { threshold: 0.5 });
  io.observe(document.querySelector(".chiffres-liste"));
}

// Animations (GSAP) : chargées une fois la page affichée, pour ne pas retarder
// le premier rendu. Sans elles, la page reste complète.
if (document.getElementById("recit")) {
  const charger = (src) => new Promise((ok, ko) => {
    const s = document.createElement("script");
    s.src = src; s.onload = ok; s.onerror = ko;
    document.body.append(s);
  });
  const lancer = () => charger("vendor/gsap.min.js")
    .then(() => charger("vendor/ScrollTrigger.min.js"))
    .then(() => charger("animations.js"))
    .catch(() => {});
  // Au premier geste de l'utilisateur (défilement, clic, touche) ou, à défaut,
  // quelques secondes après le chargement : le premier affichage reste léger.
  let lance = false;
  const unique = () => { if (!lance) { lance = true; lancer(); } };
  ["scroll", "wheel", "touchstart", "pointerdown", "keydown"].forEach((evt) =>
    window.addEventListener(evt, unique, { once: true, passive: true }));
  const minuter = () => setTimeout(unique, 3500);
  if (document.readyState === "complete") minuter();
  else window.addEventListener("load", minuter, { once: true });
}
