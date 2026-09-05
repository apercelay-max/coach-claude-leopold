/* =========================================================================
   Claude — réglages / personnalisation
   -------------------------------------------------------------------------
   Reprend l'esprit de l'écran « Apparence » de PPL Tracker : couleur
   d'accent, thème Système/Clair/Sombre, nuit encrée (AMOLED), taille du
   texte, coins, police, animations, confettis, mascotte, contraste, barre
   du bas. Tout est mémorisé dans localStorage et appliqué en posant des
   attributs data-* sur <html> (le CSS fait le reste).

   Un mini-script en tête de index.html applique déjà le thème/accent avant
   le premier rendu pour éviter le flash ; ici on refait l'application
   complète (source de vérité) et on gère l'écran de réglages.
   ========================================================================= */

(function () {
  "use strict";

  const CLE = "coach-claude-leopold:reglages-v1";

  const DEFAUTS = {
    theme: "systeme",       // systeme | clair | sombre
    accent: "corail",       // corail | bleu | vert | violet | rose | ambre | perso
    accentPerso: "#D97757",
    nuit: "off",            // fond noir profond (thème sombre uniquement)
    texte: "md",            // sm | md | lg
    radius: "normal",       // doux | normal | carre
    police: "arrondie",     // arrondie | systeme
    anim: "on",             // on | off  (animations d'interface)
    confettis: "on",        // on | off
    mascotte: "on",         // on | off  (afficher Claude)
    mascotteTaille: "md",   // sm | md | lg
    blagues: "on",          // on | off  (blague au clic sur Claude)
    contraste: "off",       // on | off
    navGlass: "on",         // on | off  (effet verre de la barre)
    navLabels: "on",        // on | off  (libellés sous les icônes)
  };

  let etat = Object.assign({}, DEFAUTS);

  function charger() {
    try {
      const brut = localStorage.getItem(CLE);
      if (brut) etat = Object.assign({}, DEFAUTS, JSON.parse(brut));
    } catch (e) {
      etat = Object.assign({}, DEFAUTS);
    }
  }

  function sauver() {
    try {
      localStorage.setItem(CLE, JSON.stringify(etat));
    } catch (e) {
      /* pas bloquant */
    }
  }

  function get(cle) {
    return etat[cle];
  }

  /* ---------------------- Application au DOM ---------------------- */

  function poser(attr, valeur) {
    const d = document.documentElement;
    if (valeur === null || valeur === undefined) d.removeAttribute(attr);
    else d.setAttribute(attr, valeur);
  }

  function appliquer() {
    const d = document.documentElement;

    poser("data-theme", etat.theme === "clair" ? "light" : etat.theme === "sombre" ? "dark" : null);

    if (etat.accent === "perso") {
      poser("data-accent", "perso");
      d.style.setProperty("--accent", etat.accentPerso);
      d.style.setProperty("--accent-strong", assombrir(etat.accentPerso, 0.16));
    } else {
      poser("data-accent", etat.accent);
      d.style.removeProperty("--accent");
      d.style.removeProperty("--accent-strong");
    }

    poser("data-nuit", etat.nuit === "on" ? "on" : null);
    poser("data-texte", etat.texte === "md" ? null : etat.texte);
    poser("data-radius", etat.radius === "normal" ? null : etat.radius);
    poser("data-police", etat.police === "systeme" ? "systeme" : null);
    poser("data-anim", etat.anim === "off" ? "off" : null);
    poser("data-mascotte", etat.mascotte === "off" ? "off" : null);
    poser("data-mascotte-taille", etat.mascotteTaille === "md" ? null : etat.mascotteTaille);
    poser("data-contraste", etat.contraste === "on" ? "on" : null);
    poser("data-nav-glass", etat.navGlass === "off" ? "off" : null);
    poser("data-nav-labels", etat.navLabels === "off" ? "off" : null);
  }

  function assombrir(hex, montant) {
    const h = String(hex).replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const num = parseInt(full, 16) || 0;
    const cl = (v) => Math.max(0, Math.min(255, v));
    const r = cl(((num >> 16) & 255) - Math.round(255 * montant));
    const g = cl(((num >> 8) & 255) - Math.round(255 * montant));
    const b = cl((num & 255) - Math.round(255 * montant));
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function set(cle, valeur) {
    etat[cle] = valeur;
    sauver();
    appliquer();
  }

  function reinitialiser() {
    etat = Object.assign({}, DEFAUTS);
    sauver();
    appliquer();
  }

  /* ---------------------- Petits constructeurs d'UI ---------------------- */

  function el(tag, cls, texte) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (texte != null) n.textContent = texte;
    return n;
  }

  function groupe(titre) {
    const g = el("div", "reglages-groupe");
    g.appendChild(el("h3", null, titre));
    return g;
  }

  function ligneToggle(titre, desc, cle, onChange) {
    const l = el("div", "reglage-ligne");
    const t = el("div", "reglage-texte");
    t.appendChild(el("div", "reglage-titre", titre));
    if (desc) t.appendChild(el("div", "reglage-desc", desc));
    l.appendChild(t);
    const sw = el("button", "sw" + (etat[cle] === "on" ? " on" : ""));
    sw.setAttribute("aria-label", titre);
    sw.appendChild(el("span"));
    sw.addEventListener("click", () => {
      set(cle, etat[cle] === "on" ? "off" : "on");
      sw.classList.toggle("on", etat[cle] === "on");
      if (onChange) onChange();
    });
    l.appendChild(sw);
    return l;
  }

  function ligneSegments(titre, desc, cle, options, onChange) {
    const wrap = el("div", "reglage-ligne-col");
    wrap.appendChild(el("div", "reglage-titre", titre));
    if (desc) wrap.appendChild(el("div", "reglage-desc", desc));
    const seg = el("div", "seg");
    options.forEach((o) => {
      const b = el("button", etat[cle] === o.id ? "actif" : null);
      if (o.ic) {
        const s = el("span", "seg-ic", o.ic);
        b.appendChild(s);
      }
      b.appendChild(el("span", null, o.label));
      b.addEventListener("click", () => {
        set(cle, o.id);
        seg.querySelectorAll("button").forEach((x) => x.classList.remove("actif"));
        b.classList.add("actif");
        if (onChange) onChange();
      });
      seg.appendChild(b);
    });
    wrap.appendChild(seg);
    return wrap;
  }

  const ACCENTS = [
    { id: "corail", nom: "Corail", c1: "#D97757", c2: "#B85C3F" },
    { id: "bleu", nom: "Bleu", c1: "#4C7CE0", c2: "#3560BE" },
    { id: "vert", nom: "Vert", c1: "#2F9E6E", c2: "#237A54" },
    { id: "violet", nom: "Violet", c1: "#8A6FE8", c2: "#6C51C8" },
    { id: "rose", nom: "Rose", c1: "#DA5C93", c2: "#B94476" },
    { id: "ambre", nom: "Ambre", c1: "#C6871E", c2: "#A06A12" },
  ];

  function blocAccent(rerender) {
    const wrap = el("div", "reglage-ligne-col");
    wrap.appendChild(el("div", "reglage-titre", "Couleur d'accent"));
    wrap.appendChild(el("div", "reglage-desc", "La couleur des boutons, de la mascotte, des graphiques et du halo."));
    const grille = el("div", "swatches");

    ACCENTS.forEach((a) => {
      const b = el("button", "swatch" + (etat.accent === a.id ? " actif" : ""));
      const rond = el("div", "rond");
      rond.style.background = `linear-gradient(135deg, ${a.c1}, ${a.c2})`;
      b.appendChild(rond);
      b.appendChild(el("span", "nom", a.nom));
      b.addEventListener("click", () => {
        set("accent", a.id);
        rerender();
      });
      grille.appendChild(b);
    });

    // Perso (color picker)
    const label = document.createElement("label");
    label.className = "swatch" + (etat.accent === "perso" ? " actif" : "");
    label.style.position = "relative";
    const rond = el("div", "rond");
    rond.style.background =
      etat.accent === "perso"
        ? etat.accentPerso
        : "conic-gradient(#D97757, #4C7CE0, #2F9E6E, #DA5C93, #C6871E, #D97757)";
    if (etat.accent !== "perso") rond.textContent = "🎨";
    label.appendChild(rond);
    label.appendChild(el("span", "nom", "Perso"));
    const input = document.createElement("input");
    input.type = "color";
    input.value = etat.accentPerso;
    input.addEventListener("input", (e) => {
      etat.accentPerso = e.target.value;
      etat.accent = "perso";
      sauver();
      appliquer();
    });
    input.addEventListener("change", () => rerender());
    label.appendChild(input);
    grille.appendChild(label);

    wrap.appendChild(grille);
    return wrap;
  }

  /* ---------------------- Écran de réglages ---------------------- */

  function rendreEcran(conteneur) {
    conteneur.innerHTML = "";
    const rerender = () => rendreEcran(conteneur);

    // ----- Apparence -----
    const gApp = groupe("Apparence");
    gApp.appendChild(blocAccent(rerender));
    gApp.appendChild(
      ligneSegments("Thème", null, "theme", [
        { id: "systeme", label: "Système", ic: "🖥️" },
        { id: "clair", label: "Clair", ic: "☀️" },
        { id: "sombre", label: "Sombre", ic: "🌙" },
      ], rerender)
    );
    gApp.appendChild(
      ligneToggle(
        "Nuit encrée",
        "Fond quasi noir, économise la batterie sur écran OLED. Actif seulement en thème sombre.",
        "nuit"
      )
    );
    gApp.appendChild(
      ligneSegments("Taille du texte", null, "texte", [
        { id: "sm", label: "Petit" },
        { id: "md", label: "Normal" },
        { id: "lg", label: "Grand" },
      ])
    );
    gApp.appendChild(
      ligneSegments("Coins arrondis", null, "radius", [
        { id: "doux", label: "Doux" },
        { id: "normal", label: "Normal" },
        { id: "carre", label: "Carrés" },
      ])
    );
    gApp.appendChild(
      ligneSegments("Police", "« Arrondie » = la police d'origine (Baloo). « Système » = celle de ton téléphone.", "police", [
        { id: "arrondie", label: "Arrondie" },
        { id: "systeme", label: "Système" },
      ])
    );
    conteneur.appendChild(gApp);

    // ----- Animations -----
    const gAnim = groupe("Animations & effets");
    gAnim.appendChild(
      ligneToggle("Animations d'interface", "Transitions entre les écrans, flottement de la mascotte, halo. Désactive pour une appli plus calme.", "anim")
    );
    gAnim.appendChild(ligneToggle("Confettis", "Pluie de confettis sur les bonnes réponses et en fin de séance réussie.", "confettis"));
    conteneur.appendChild(gAnim);

    // ----- Mascotte -----
    const gMasc = groupe("Mascotte (Claude)");
    gMasc.appendChild(ligneToggle("Afficher Claude", "Le petit bonhomme en bas à droite qui encourage et raconte des blagues.", "mascotte"));
    gMasc.appendChild(
      ligneSegments("Taille de Claude", null, "mascotteTaille", [
        { id: "sm", label: "Petit" },
        { id: "md", label: "Normal" },
        { id: "lg", label: "Grand" },
      ])
    );
    gMasc.appendChild(ligneToggle("Blague au clic", "Quand tu touches Claude, il te sort une blague. Sinon il te dit juste bonjour.", "blagues"));
    conteneur.appendChild(gMasc);

    // ----- Accessibilité -----
    const gAcc = groupe("Accessibilité");
    gAcc.appendChild(ligneToggle("Contraste élevé", "Textes et bordures plus marqués, verre de la barre opaque.", "contraste"));
    conteneur.appendChild(gAcc);

    // ----- Barre du bas -----
    const gNav = groupe("Barre du bas");
    gNav.appendChild(ligneToggle("Effet verre (Liquid Glass)", "La capsule translucide façon iOS. Désactive pour une barre pleine et opaque.", "navGlass"));
    gNav.appendChild(ligneToggle("Libellés sous les icônes", "Afficher le nom (Maths, Stats…) sous chaque icône de la barre.", "navLabels"));
    conteneur.appendChild(gNav);

    // ----- Réinitialiser -----
    const gReset = groupe("Remise à zéro");
    const wrap = el("div", "reglage-ligne-col");
    const reset = el("button", "btn btn-fantome reglages-reset", "Réinitialiser tous les réglages");
    reset.addEventListener("click", () => {
      if (window.confirm("Remettre tous les réglages d'apparence par défaut ?")) {
        reinitialiser();
        rerender();
      }
    });
    wrap.appendChild(reset);
    gReset.appendChild(wrap);
    conteneur.appendChild(gReset);
  }

  /* ---------------------- Branchements comportementaux ---------------------- */

  // Confettis : on enrobe la fonction globale pour respecter le réglage. Les
  // appels dans app.js et mascotte.js passent par le binding global, donc
  // ils utiliseront cette version.
  if (typeof window.lancerConfettis === "function") {
    const _confettis = window.lancerConfettis;
    window.lancerConfettis = function () {
      if (etat.confettis !== "off") _confettis.apply(this, arguments);
    };
  }

  // Blague au clic : idem. Si désactivé, Claude dit juste bonjour.
  if (typeof window.mascotteRaconteUneBlague === "function") {
    const _blague = window.mascotteRaconteUneBlague;
    window.mascotteRaconteUneBlague = function () {
      if (etat.blagues !== "off") {
        _blague.apply(this, arguments);
      } else if (typeof window.mascotteAccueille === "function") {
        window.mascotteAccueille();
      }
    };
  }

  /* ------------------------------- Init ------------------------------- */

  charger();
  appliquer();

  window.CoachReglages = {
    get: get,
    set: set,
    appliquer: appliquer,
    rendreEcran: rendreEcran,
    reinitialiser: reinitialiser,
  };
})();
