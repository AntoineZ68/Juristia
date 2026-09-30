// Lytis — animations du site vitrine : accroche, maquette qui se redresse, et
// récit « le dossier qui se transforme ». GSAP et ScrollTrigger sont copiés dans
// vendor/ (aucun appel extérieur). Sans eux, ou avec « mouvement réduit », la page
// reste statique et complète : chaque maquette est dans son état final.
"use strict";

(() => {
  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const source = initialiserSource();

  if (!window.gsap || !window.ScrollTrigger || reduit) return;
  gsap.registerPlugin(ScrollTrigger);
  animerAccroche();
  animerRecit();
  ScrollTrigger.addEventListener("refresh", () => source && source.tracer());

  // --- Accroche : la maquette se redresse au défilement ---------------------
  // (le titre est révélé en CSS, sans attendre ce script)
  function animerAccroche() {
    const visuel = document.querySelector(".heros-visuel");
    const fenetre = visuel && visuel.querySelector(".fenetre");
    if (!fenetre) return;
    gsap.fromTo(fenetre,
      { rotateX: 16, scale: 0.94, transformOrigin: "50% 0%" },
      { rotateX: 0, scale: 1, ease: "none",
        scrollTrigger: { trigger: visuel, start: "top bottom", end: "top 18%", scrub: 0.6 } });
  }

  // --- Récit ----------------------------------------------------------------
  function animerRecit() {
    const recit = document.getElementById("recit");
    if (!recit) return;
    const etapes = [...recit.querySelectorAll(".etape")];
    const ecrans = etapes.map((e) => e.querySelector(".ecran"));
    const scenes = etapes.map((e) => e.querySelector(".app-corps"));
    const fabriques = { depot, lecture, frise, nullites, balance, source: sceneSource };
    const fabriquer = (i) => fabriques[etapes[i].dataset.scene](scenes[i]);
    const boutons = [...recit.querySelectorAll(".recit-progression button")];
    const barre = recit.querySelector(".recit-barre span");
    const mm = gsap.matchMedia();

    // Grand écran : une scène épinglée, les maquettes se succèdent au défilement.
    mm.add("(min-width: 1020px) and (min-height: 640px)", () => {
      recit.classList.add("recit-epingle");
      gsap.set(ecrans.slice(1), { autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      const reperes = [];
      etapes.forEach((_, i) => {
        reperes.push(tl.duration());
        if (i) {
          tl.to(ecrans[i], { autoAlpha: 1, duration: 0.35, ease: "power1.inOut" });
          tl.set(ecrans[i - 1], { autoAlpha: 0 });
        }
        tl.add(fabriquer(i));
        tl.to({}, { duration: i === etapes.length - 1 ? 0.3 : 0.7 });
      });

      let courante = -1;
      const activer = (n) => {
        if (n === courante) return;
        courante = n;
        etapes.forEach((e, i) => { e.classList.toggle("actif", i === n); e.inert = i !== n; });
        boutons.forEach((b, i) => { b.classList.toggle("actif", i === n); b.setAttribute("aria-current", i === n ? "step" : "false"); });
      };
      activer(0);

      const st = ScrollTrigger.create({
        trigger: recit.querySelector(".recit-scene"),
        start: "top top",
        end: () => "+=" + Math.round(window.innerHeight * 5.2),
        pin: true,
        scrub: 0.8,
        animation: tl,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const t = self.progress * tl.duration();
          let n = 0;
          reperes.forEach((r, i) => { if (t >= r - 0.05) n = i; });
          activer(n);
          if (barre) barre.style.transform = `scaleX(${self.progress})`;
        },
      });

      const aller = (i) => {
        const cible = (reperes[i] + (i ? 0.45 : 0)) / tl.duration();
        window.scrollTo({ top: st.start + cible * (st.end - st.start) + 2, behavior: "smooth" });
      };
      const clics = boutons.map((b, i) => { const f = () => aller(i); b.addEventListener("click", f); return f; });

      return () => {
        recit.classList.remove("recit-epingle");
        etapes.forEach((e) => { e.classList.remove("actif"); e.inert = false; });
        boutons.forEach((b, i) => b.removeEventListener("click", clics[i]));
      };
    });

    // Mobile et tablette : les étapes défilent normalement ; chaque maquette
    // joue son animation une fois, quand elle entre à l'écran.
    mm.add("(max-width: 1019.98px), (max-height: 639.98px)", () => {
      etapes.forEach((e, i) => {
        const tl = fabriquer(i).pause(0);
        ScrollTrigger.create({ trigger: ecrans[i], start: "top 80%", once: true, onEnter: () => tl.play() });
        gsap.from(e.querySelector(".etape-texte"), {
          opacity: 0, y: 20, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: e, start: "top 85%", once: true },
        });
      });
    });
  }

  // --- Les six scènes -------------------------------------------------------
  // Chaque fabrique renvoie une timeline de « from » : l'état final est celui du CSS.

  function depot(el) {
    const feuilles = el.querySelectorAll(".feuille");
    const compteur = el.querySelector("[data-compte]");
    const total = Number(compteur.dataset.compte);
    const n = { v: total };
    const inclinaisons = [-24, 18, -12, 22, -16];
    return gsap.timeline()
      .from(feuilles, {
        y: () => -el.clientHeight * 0.95, rotation: (i) => inclinaisons[i], opacity: 0,
        duration: 0.75, stagger: 0.13, ease: "power3.out",
      }, 0)
      .from(n, { v: 0, duration: 1, ease: "power1.out", onUpdate: () => { compteur.textContent = Math.round(n.v); } }, 0.1)
      .from(el.querySelector(".depot-etat"), { opacity: 0, y: 10, duration: 0.4 }, 0.5);
  }

  function lecture(el) {
    const cadre = el.querySelector(".page-cadre");
    const balai = el.querySelector(".lecture-balayage");
    const trait = balai.querySelector("span");
    const surlignes = [...el.querySelectorAll(".surligne")];
    const passages = [...el.querySelectorAll(".passage")];
    const debut = 0.35;
    const duree = 1.5;
    const tl = gsap.timeline()
      .from(el.querySelector(".lecture-page"), { opacity: 0, y: 24, duration: 0.45 }, 0)
      .from(el.querySelector(".lecture-passages .app-titre"), { opacity: 0, duration: 0.3 }, 0.2)
      .fromTo(balai, { opacity: 0 }, { opacity: 1, duration: 0.15 }, debut)
      .fromTo(trait, { y: 0 }, { y: () => cadre.clientHeight + trait.offsetHeight, duration: duree, ease: "none" }, debut)
      .to(balai, { opacity: 0, duration: 0.2 }, debut + duree - 0.1);
    surlignes.forEach((s) => {
      const y0 = parseFloat(s.style.getPropertyValue("--y0"));
      tl.from(s, { scaleX: 0, duration: 0.3, ease: "power2.out" }, debut + duree * y0 + 0.05);
    });
    // Les passages apparaissent quand leur ligne est lue.
    [0, 1, 3].forEach((k, i) => {
      const y0 = parseFloat(surlignes[k].style.getPropertyValue("--y0"));
      tl.from(passages[i], { opacity: 0, x: 18, duration: 0.4, ease: "power3.out" }, debut + duree * y0 + 0.15);
    });
    return tl;
  }

  function frise(el) {
    const ligne = el.querySelector(".frise-ligne");
    const evenements = el.querySelectorAll(".evenement");
    const vertical = () => getComputedStyle(ligne).position === "absolute";
    return gsap.timeline()
      .from(el.querySelector(".app-titre"), { opacity: 0, y: 10, duration: 0.35 }, 0)
      .from(ligne, { scaleX: () => (vertical() ? 1 : 0), scaleY: () => (vertical() ? 0 : 1), duration: 1.1, ease: "power2.inOut" }, 0.1)
      .from(evenements, {
        opacity: 0, y: (i) => (vertical() ? 14 : i % 2 ? 20 : -20),
        duration: 0.5, stagger: 0.15, ease: "power3.out",
      }, 0.25)
      .from(el.querySelectorAll(".evenement i"), { scale: 0, duration: 0.35, stagger: 0.15, ease: "back.out(2.5)" }, 0.3);
  }

  function nullites(el) {
    return gsap.timeline()
      .from(el.querySelector(".avertissement"), { opacity: 0, y: -8, duration: 0.35 }, 0)
      .from(el.querySelectorAll(".nullite"), { opacity: 0, y: 24, duration: 0.55, stagger: 0.12, ease: "power3.out" }, 0.15)
      .from(el.querySelectorAll(".jauge i"), { scaleX: 0, duration: 0.3, stagger: 0.04, ease: "power2.out" }, 0.5)
      .from(el.querySelectorAll(".jauge span, .nullite .source"), { opacity: 0, duration: 0.3, stagger: 0.05 }, 0.75);
  }

  function balance(el) {
    const axe = el.querySelector(".balance-axe");
    const etroit = () => getComputedStyle(axe).display === "none";
    const ecart = () => (etroit() ? 0 : el.clientWidth * 0.24);
    return gsap.timeline()
      .from(el.querySelector(".balance-fait"), { opacity: 0, y: 10, duration: 0.35 }, 0)
      .from(axe, { scaleY: 0, duration: 0.5, ease: "power2.inOut" }, 0.2)
      .from(el.querySelector(".colonne-charge"), { x: ecart, opacity: 0, duration: 0.8, ease: "power3.out" }, 0.3)
      .from(el.querySelector(".colonne-decharge"), { x: () => -ecart(), opacity: 0, duration: 0.8, ease: "power3.out" }, 0.3)
      .from(el.querySelectorAll("blockquote"), { y: 14, opacity: 0, duration: 0.45, stagger: 0.1, ease: "power3.out" }, 0.6);
  }

  function sceneSource(el) {
    const s = source;
    const curseur = el.querySelector(".curseur");
    const badge = () => s.boutonActif().querySelector(".source");
    const position = (quoi) => {
      if (quoi === "depart") return { x: el.offsetWidth * 0.06, y: el.offsetHeight * 0.92 };
      const b = badge(), o = s.decalage(b);
      return { x: o.x + b.offsetWidth * 0.5, y: o.y + b.offsetHeight * 0.55 };
    };
    return gsap.timeline()
      .add(() => s.tracer(), 0)
      .from(el.querySelectorAll(".element"), { opacity: 0, x: -16, duration: 0.4, stagger: 0.08, ease: "power3.out" }, 0)
      .fromTo(curseur,
        { opacity: 0, x: () => position("depart").x, y: () => position("depart").y },
        { opacity: 1, x: () => position("badge").x, y: () => position("badge").y, duration: 0.7, ease: "power2.inOut" }, 0.25)
      .to(curseur, { scale: 0.85, duration: 0.1, yoyo: true, repeat: 1 }, ">")
      .from(el.querySelector(".source-visionneuse"), { opacity: 0, y: 16, duration: 0.45, ease: "power3.out" }, ">-0.05")
      .to(curseur, { opacity: 0, duration: 0.25 }, "<0.1")
      .fromTo(s.page, { "--s": 1 }, { "--s": () => s.geo().s, duration: 0.95, ease: "power3.inOut" }, ">-0.1")
      .fromTo(s.chemin, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, ">-0.25")
      .fromTo(s.point, { attr: { r: 0 } }, { attr: { r: 4 }, duration: 0.3, ease: "back.out(2)" }, ">-0.1")
      .from(el.querySelector(".verifie"), { opacity: 0, duration: 0.3 }, "<")
      .fromTo(s.coche, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.4 }, "<0.05");
  }

  // --- Étape 6 : l'élément, sa page, le trait qui les relie ----------------
  // Fonctionne aussi sans GSAP : un clic change la page affichée et le trait.
  function initialiserSource() {
    const scene = document.querySelector(".scene-source");
    if (!scene) return null;
    const boutons = [...scene.querySelectorAll(".element")];
    const page = scene.querySelector(".visionneuse-page");
    const image = page.querySelector("img");
    const cadre = scene.querySelector(".visionneuse-cadre");
    const legende = scene.querySelector(".visionneuse-legende");
    const svg = scene.querySelector(".source-lien");
    const chemin = svg.querySelector("path");
    const point = svg.querySelector("circle");
    const coche = scene.querySelector(".verifie path");
    let actif = Math.max(0, boutons.findIndex((b) => b.classList.contains("actif")));
    let geo = null;

    function appliquer() {
      const b = boutons[actif];
      const rects = b.dataset.rects.split(";").map((r) => r.split(",").map(Number));
      const large = rects.reduce((a, r) => (r[2] - r[0] > a[2] - a[0] ? r : a));
      geo = { large, s: Math.min(2.4, 0.9 / (large[2] - large[0])), cx: (large[0] + large[2]) / 2, cy: (large[1] + large[3]) / 2 };
      if (image.getAttribute("src") !== b.dataset.page) image.src = b.dataset.page;
      page.querySelectorAll(".surligne").forEach((e) => e.remove());
      rects.forEach(([x0, y0, x1, y1]) => {
        const i = document.createElement("i");
        i.className = "surligne " + (b.dataset.couleur || "s-nullite");
        i.style.cssText = `--x0:${x0};--y0:${y0};--x1:${x1};--y1:${y1}`;
        if (x0 === large[0] && y0 === large[1]) i.dataset.large = "1";
        page.append(i);
      });
      page.style.setProperty("--cx", geo.cx);
      page.style.setProperty("--cy", geo.cy);
      page.style.setProperty("--s", geo.s);
      legende.textContent = b.dataset.legende;
      boutons.forEach((x, i) => { x.classList.toggle("actif", i === actif); x.setAttribute("aria-pressed", String(i === actif)); });
    }

    // Position d'un élément dans la scène, sans tenir compte des animations en cours.
    function decalage(el) {
      let x = 0, y = 0;
      for (let n = el; n && n !== scene; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
      return { x, y };
    }

    // Trait de l'élément choisi jusqu'au début du passage surligné, page zoomée.
    function tracer() {
      if (!geo || !scene.offsetWidth) return;
      const carte = boutons[actif];
      const cible = [...page.querySelectorAll(".surligne")].find((i) => i.dataset.large);
      const avant = page.style.getPropertyValue("--s");
      page.style.setProperty("--s", geo.s);
      const r = cible.getBoundingClientRect();
      const rc = cadre.getBoundingClientRect();
      page.style.setProperty("--s", avant);
      const oc = decalage(cadre);
      const hx = oc.x + (r.left - rc.left) - 4;
      const hy = oc.y + (r.top - rc.top) + r.height / 2;
      const ob = decalage(carte);
      let d;
      if (oc.x >= ob.x + carte.offsetWidth) {
        const bx = ob.x + carte.offsetWidth + 4, by = ob.y + carte.offsetHeight / 2;
        const dx = hx - bx;
        d = `M${bx},${by} C${bx + dx * 0.5},${by} ${hx - dx * 0.5},${hy} ${hx},${hy}`;
      } else {
        // Écran étroit : le trait longe la marge gauche, sans croiser les autres éléments.
        const bx = ob.x - 4, by = ob.y + carte.offsetHeight / 2;
        const marge = Math.min(bx, hx) - 12;
        d = `M${bx},${by} C${marge},${by} ${marge},${hy} ${hx},${hy}`;
      }
      svg.setAttribute("viewBox", `0 0 ${scene.offsetWidth} ${scene.offsetHeight}`);
      chemin.setAttribute("d", d);
      point.setAttribute("cx", hx);
      point.setAttribute("cy", hy);
      point.setAttribute("r", 4);
    }

    function rejouer() {
      if (!window.gsap || reduit) return;
      gsap.timeline()
        .fromTo(page, { "--s": 1 }, { "--s": geo.s, duration: 0.9, ease: "power3.inOut" })
        .fromTo(chemin, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, "-=0.2")
        .fromTo(point, { attr: { r: 0 } }, { attr: { r: 4 }, duration: 0.3, ease: "back.out(2)" }, "-=0.1")
        .fromTo(coche, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.4 }, "-=0.1");
    }

    boutons.forEach((b, i) => b.addEventListener("click", () => {
      if (i === actif) { rejouer(); return; }
      actif = i;
      appliquer();
      tracer();
      rejouer();
    }));

    // Précharge les deux autres pages pour un changement instantané.
    const precharger = () => boutons.forEach((b) => { const im = new Image(); im.src = b.dataset.page; });
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { precharger(); io.disconnect(); } }, { rootMargin: "600px" });
      io.observe(scene);
    }

    let minuteur;
    window.addEventListener("resize", () => { clearTimeout(minuteur); minuteur = setTimeout(tracer, 150); });
    image.addEventListener("load", tracer);
    appliquer();
    tracer();
    return { page, chemin, point, coche, tracer, decalage, geo: () => geo, boutonActif: () => boutons[actif] };
  }
})();
