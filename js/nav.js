/* =========================================================================
   Claude — barre du bas + navigation
   -------------------------------------------------------------------------
   Port fidèle de la barre « liquid glass » de PPL Tracker (NavBar.tsx) en
   vanilla JS : capsule flottante translucide, pastille de verre sous
   l'onglet actif, libellé + point sous chaque icône, reflet spéculaire,
   halo qui suit le pointeur, grain fin, et distorsion réelle du fond via
   filtre SVG sur Chrome/Edge desktop.

   Onglets : un par matière (lu dans MATIERES) + « Stats » + « Réglages ».
   - Onglet matière  -> écran de la matière (liste des chapitres).
   - Onglet Stats     -> tableau de bord (js/stats.js).
   - Onglet Réglages  -> personnalisation (js/reglages.js).

   N'ajoute aucune logique de révision : il réutilise demarrerSession() et
   afficherEcran() de app.js, et enrobe afficherEcran() pour garder l'onglet
   actif synchronisé quand app.js navigue de son côté.
   ========================================================================= */

(function () {
  "use strict";

  const ICONES_MATIERE = { maths: "➗", espagnol: "🇪🇸", anglais: "🇬🇧" };
  const ECRANS_APP = ["accueil", "matieres", "exercice", "resultats"];
  const ECRANS_EXTRA = ["matiere", "stats", "reglages"];

  // MATIERES / EXERCICES sont des `const` globales de data.js, et `etat` un
  // `let` global de app.js : accessibles ici (script chargé après) mais pas
  // via window. Getters défensifs.
  const M = () => (typeof MATIERES !== "undefined" ? MATIERES : []);
  const X = () => (typeof EXERCICES !== "undefined" ? EXERCICES : []);
  const matiereEnCours = () => (typeof etat !== "undefined" && etat ? etat.matiereCode : null);

  let actif = null; // code matière | "stats" | "reglages" | null

  /* --------------------------- Utilitaires DOM --------------------------- */

  function el(tag, cls, texte) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (texte != null) n.textContent = texte;
    return n;
  }

  function supporteRefraction() {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    const isBlink = /Chrome|Chromium|Edg\//.test(ua);
    return isBlink && !isIOS;
  }

  const NOISE_URL =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>" +
        "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter>" +
        "<rect width='100%' height='100%' filter='url(%23n)'/></svg>"
    );

  /* ----------------------------- Construction ----------------------------- */

  let capsule;

  function construireBarre() {
    const matieres = M();

    const wrap = el("div", "nav-wrap");
    const row = el("div", "nav-row");
    capsule = el("div", "navbar-glass nav-capsule");
    if (supporteRefraction()) capsule.classList.add("navbar-glass-refract");

    capsule.appendChild(el("div", "nav-sheen"));
    capsule.appendChild(el("div", "nav-glow"));
    const noise = el("div", "nav-noise");
    noise.style.backgroundImage = `url("${NOISE_URL}")`;
    capsule.appendChild(noise);

    const onglets = matieres
      .map((m) => ({ cle: m.code, label: raccourci(m.nom), emoji: ICONES_MATIERE[m.code] || m.emoji }))
      .concat([
        { cle: "stats", label: "Stats", emoji: "📊" },
        { cle: "reglages", label: "Réglages", emoji: "⚙️" },
      ]);

    onglets.forEach((o) => {
      const b = el("button", "nav-tab");
      b.dataset.nav = o.cle;
      b.setAttribute("aria-label", o.label);
      b.appendChild(el("span", "nav-ic", o.emoji));
      b.appendChild(el("span", "nav-lb", o.label));
      b.appendChild(el("span", "nav-dot"));
      b.addEventListener("click", () => activer(o.cle));
      capsule.appendChild(b);
    });

    // Halo qui suit le pointeur (variables CSS, pas de re-render).
    capsule.addEventListener("pointermove", (e) => {
      const r = capsule.getBoundingClientRect();
      capsule.style.setProperty("--gx", ((e.clientX - r.left) / r.width) * 100 + "%");
      capsule.style.setProperty("--gy", ((e.clientY - r.top) / r.height) * 100 + "%");
    });
    capsule.addEventListener("pointerdown", () => capsule.classList.add("pressed"));
    ["pointerup", "pointerleave", "pointercancel"].forEach((ev) =>
      capsule.addEventListener(ev, () => capsule.classList.remove("pressed"))
    );

    row.appendChild(capsule);
    wrap.appendChild(row);

    // Filtre SVG de distorsion (invisible), référencé par .navbar-glass-refract.
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.style.position = "absolute";
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML =
      '<defs><filter id="liquidGlassNav" x="-20%" y="-20%" width="140%" height="140%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.009 0.02" numOctaves="2" seed="7" result="noise"/>' +
      '<feGaussianBlur in="noise" stdDeviation="2.5" result="softNoise"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="softNoise" scale="16" xChannelSelector="R" yChannelSelector="G"/>' +
      "</filter></defs>";
    wrap.appendChild(svg);

    document.body.appendChild(wrap);
  }

  function raccourci(nom) {
    if (/math/i.test(nom)) return "Maths";
    return nom.length > 9 ? nom.slice(0, 8) + "…" : nom;
  }

  /* ----------------------------- Navigation ----------------------------- */

  function tousLesEcrans() {
    return ECRANS_APP.map((e) => "ecran-" + e).concat(ECRANS_EXTRA.map((e) => "ecran-" + e));
  }

  function montrer(id) {
    tousLesEcrans().forEach((eid) => {
      const n = document.getElementById(eid);
      if (n) n.classList.toggle("hidden", eid !== id);
    });
    document.body.setAttribute("data-vue", id.replace("ecran-", ""));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setActif(cle) {
    actif = cle;
    if (!capsule) return;
    capsule.querySelectorAll(".nav-tab").forEach((b) => {
      b.classList.toggle("actif", b.dataset.nav === cle);
    });
  }

  function activer(cle) {
    if (cle === "stats") {
      montrer("ecran-stats");
      setActif("stats");
      if (window.CoachStats) window.CoachStats.rendre(document.getElementById("stats-contenu"));
    } else if (cle === "reglages") {
      montrer("ecran-reglages");
      setActif("reglages");
      if (window.CoachReglages) window.CoachReglages.rendreEcran(document.getElementById("reglages-contenu"));
    } else {
      ouvrirMatiere(cle);
    }
  }

  /* --------------------------- Écran d'une matière --------------------------- */

  function ouvrirMatiere(code) {
    const matiere = window.getMatiere ? window.getMatiere(code) : (M()).find((m) => m.code === code);
    if (!matiere) return;
    const box = document.getElementById("matiere-contenu");
    box.innerHTML = "";

    const exs = X().filter((e) => e.matiere === code);
    const chapitres = [...new Set(exs.map((e) => e.chapitre))];
    const resume = window.CoachStats ? window.CoachStats.resumeMatiere(code) : null;

    // Bouton retour
    const retour = el("button", "lien-retour", "← Accueil");
    retour.addEventListener("click", () => window.afficherEcran("accueil"));
    box.appendChild(retour);

    // En-tête
    const entete = el("div", "matiere-entete");
    entete.appendChild(el("div", "matiere-entete-emoji", matiere.emoji));
    const bloc = el("div");
    bloc.appendChild(el("h2", null, matiere.nom));
    bloc.appendChild(el("p", null, `${exs.length} exercice${exs.length > 1 ? "s" : ""} · ${chapitres.length} chapitre${chapitres.length > 1 ? "s" : ""}`));
    entete.appendChild(bloc);
    box.appendChild(entete);

    // Mini-stats
    if (resume) {
      const grille = el("div", "matiere-stats");
      const tuiles = [
        { val: resume.maitrise == null ? "—" : resume.maitrise + "%", lab: "maîtrise" },
        { val: `${resume.exercicesVus}/${resume.exercicesTotal}`, lab: "exos vus" },
        { val: String(resume.sessions), lab: "séances" },
      ];
      tuiles.forEach((t) => {
        const tu = el("div", "mini-tuile");
        tu.appendChild(el("div", "val", t.val));
        tu.appendChild(el("div", "lab", t.lab));
        grille.appendChild(tu);
      });
      box.appendChild(grille);
    }

    box.appendChild(el("p", "sous-titre-section", "Choisis un chapitre"));

    const liste = el("div", "chapitres-liste");
    chapitres.forEach((ch) => {
      const nb = exs.filter((e) => e.chapitre === ch).length;
      const m = window.CoachStats ? window.CoachStats.maitriseChapitre(code, ch) : { pct: null };
      const carte = el("button", "chapitre-carte");
      const txt = el("div", "chapitre-carte-texte");
      txt.appendChild(el("div", "chapitre-carte-nom", ch));
      txt.appendChild(el("div", "chapitre-carte-meta", `${nb} exercice${nb > 1 ? "s" : ""}${m.pct == null ? "" : " · " + m.pct + "% maîtrisé"}`));
      const jauge = el("div", "chapitre-jauge");
      const rempli = el("span");
      rempli.style.width = (m.pct || 0) + "%";
      jauge.appendChild(rempli);
      txt.appendChild(jauge);
      carte.appendChild(txt);
      carte.appendChild(el("div", "chapitre-carte-fleche", "›"));
      carte.addEventListener("click", () => window.demarrerSession(code, ch));
      liste.appendChild(carte);
    });
    box.appendChild(liste);

    const tout = el("button", "btn btn-principal matiere-tout", `Tout réviser (${exs.length} exercices)`);
    tout.addEventListener("click", () => window.demarrerSession(code));
    box.appendChild(tout);

    montrer("ecran-matiere");
    setActif(code);
  }

  /* ------------------- Synchronisation avec app.js ------------------- */

  // Quand app.js navigue (logo, « Quitter », fin de séance…), on cache nos
  // écrans en plus et on remet l'onglet actif au bon endroit.
  const _afficherEcran = window.afficherEcran;
  window.afficherEcran = function (nom) {
    if (typeof _afficherEcran === "function") _afficherEcran(nom);
    ECRANS_EXTRA.forEach((e) => {
      const n = document.getElementById("ecran-" + e);
      if (n) n.classList.add("hidden");
    });
    document.body.setAttribute("data-vue", nom);
    if (nom === "exercice" || nom === "resultats") {
      setActif(matiereEnCours());
    } else {
      setActif(null);
    }
  };

  /* ------------------------------- Init ------------------------------- */

  document.addEventListener("DOMContentLoaded", construireBarre);

  window.CoachNav = {
    ouvrirMatiere: ouvrirMatiere,
    activer: activer,
  };
})();
