/* =========================================================================
   Claude — suivi de progression (stats)
   -------------------------------------------------------------------------
   Nouveau : un petit suivi 100 % local (localStorage) de chaque session de
   révision, et le rendu du tableau de bord « 📊 Stats » de la barre du bas.

   Aucune donnée ne quitte le navigateur. C'est un complément au résumé par
   email (qui reste le suivi côté parents) : ici c'est le suivi côté Léopold,
   pour voir sa progression matière par matière et repérer ce qui coince.

   Format stocké (clé COACH_STATS_CLE) :
   {
     version: 1,
     sessions: [
       { date: <ISO>, matiere: "maths", chapitre: null|"…", total: 8, correct: 6 }
     ],
     parExercice: {
       "maths-3": { vus: 4, reussis: 3, dernier: <timestamp>, dernierOk: true }
     }
   }
   ========================================================================= */

(function () {
  "use strict";

  const COACH_STATS_CLE = "coach-claude-leopold:stats-v1";
  const MAX_SESSIONS = 200; // large mémoire, mais borné pour ne pas gonfler sans fin

  // MATIERES / EXERCICES sont des `const` globales de data.js (pas des
  // propriétés de window). Accès défensif via ces deux getters.
  const M = () => (typeof MATIERES !== "undefined" ? MATIERES : []);
  const X = () => (typeof EXERCICES !== "undefined" ? EXERCICES : []);

  /* ----------------------------- Stockage ----------------------------- */

  function etatVide() {
    return { version: 1, sessions: [], parExercice: {} };
  }

  function charger() {
    try {
      const brut = localStorage.getItem(COACH_STATS_CLE);
      if (!brut) return etatVide();
      const obj = JSON.parse(brut);
      if (!obj || typeof obj !== "object") return etatVide();
      obj.sessions = Array.isArray(obj.sessions) ? obj.sessions : [];
      obj.parExercice = obj.parExercice && typeof obj.parExercice === "object" ? obj.parExercice : {};
      return obj;
    } catch (e) {
      return etatVide();
    }
  }

  function sauver(etat) {
    try {
      localStorage.setItem(COACH_STATS_CLE, JSON.stringify(etat));
    } catch (e) {
      /* stockage indisponible (navigation privée…) : tant pis, pas bloquant */
    }
  }

  /* ------------------------- Enregistrement --------------------------- */

  function enregistrerSession(matiereCode, chapitre, resultats, dureeMs) {
    if (!Array.isArray(resultats) || resultats.length === 0) return;
    const etat = charger();
    const maintenant = Date.now();

    const total = resultats.length;
    const correct = resultats.filter((r) => r.correct).length;

    etat.sessions.push({
      date: new Date(maintenant).toISOString(),
      matiere: matiereCode,
      chapitre: chapitre || null,
      total: total,
      correct: correct,
      // Millisecondes entre le démarrage de la session et la validation de la
      // dernière question. Absent (undefined) sur les séances enregistrées
      // avant l'ajout du coin des parents — traité comme 0 partout ailleurs.
      duree: typeof dureeMs === "number" && dureeMs > 0 ? dureeMs : null,
    });
    if (etat.sessions.length > MAX_SESSIONS) {
      etat.sessions = etat.sessions.slice(etat.sessions.length - MAX_SESSIONS);
    }

    resultats.forEach((r) => {
      const id = r.exercice && r.exercice.id;
      if (!id) return;
      const e = etat.parExercice[id] || { vus: 0, reussis: 0, dernier: 0, dernierOk: false };
      e.vus += 1;
      if (r.correct) e.reussis += 1;
      e.dernier = maintenant;
      e.dernierOk = !!r.correct;
      etat.parExercice[id] = e;
    });

    sauver(etat);
  }

  function effacerTout() {
    sauver(etatVide());
  }

  /* --------------------------- Agrégations --------------------------- */

  // Maîtrise d'un exercice : dernière tentative réussie = 100, sinon ratio
  // réussites/tentatives. Pas encore vu = null (n'entre pas dans la moyenne).
  function maitriseExercice(stat) {
    if (!stat || stat.vus === 0) return null;
    if (stat.dernierOk) return Math.max(60, Math.round((stat.reussis / stat.vus) * 100));
    return Math.round((stat.reussis / stat.vus) * 100);
  }

  function maitriseListe(ids, parExercice) {
    const valeurs = ids.map((id) => maitriseExercice(parExercice[id])).filter((v) => v !== null);
    if (valeurs.length === 0) return { pct: null, vus: 0, total: ids.length };
    const moy = Math.round(valeurs.reduce((a, b) => a + b, 0) / valeurs.length);
    return { pct: moy, vus: valeurs.length, total: ids.length };
  }

  // Petit résumé pour l'écran d'une matière (mini-tuiles).
  function resumeMatiere(matiereCode) {
    const etat = charger();
    const ids = (X()).filter((e) => e.matiere === matiereCode).map((e) => e.id);
    const m = maitriseListe(ids, etat.parExercice);
    const sessions = etat.sessions.filter((s) => s.matiere === matiereCode);
    const derniere = sessions.length ? sessions[sessions.length - 1] : null;
    return {
      maitrise: m.pct,
      exercicesVus: m.vus,
      exercicesTotal: ids.length,
      sessions: sessions.length,
      derniere: derniere ? derniere.date : null,
    };
  }

  function maitriseChapitre(matiereCode, chapitre) {
    const etat = charger();
    const ids = (X())
      .filter((e) => e.matiere === matiereCode && e.chapitre === chapitre)
      .map((e) => e.id);
    return maitriseListe(ids, etat.parExercice);
  }

  // Clé "AAAA-MM-JJ" en heure LOCALE (les dates stockées sont en UTC ; les
  // comparer avec .toISOString() décale d'un jour selon le fuseau).
  function jourLocal(d) {
    const x = new Date(d);
    return (
      x.getFullYear() +
      "-" +
      String(x.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(x.getDate()).padStart(2, "0")
    );
  }

  // Série de jours consécutifs avec au moins une session (aujourd'hui ou hier
  // comme point de départ, sinon la série est cassée).
  function serieJours() {
    const etat = charger();
    if (etat.sessions.length === 0) return 0;
    const jours = new Set(etat.sessions.map((s) => jourLocal(s.date)));
    const unJour = 86400000;
    let curseur = new Date();
    curseur.setHours(0, 0, 0, 0);
    if (!jours.has(jourLocal(curseur))) {
      curseur = new Date(curseur.getTime() - unJour);
      if (!jours.has(jourLocal(curseur))) return 0;
    }
    let serie = 0;
    while (jours.has(jourLocal(curseur))) {
      serie += 1;
      curseur = new Date(curseur.getTime() - unJour);
    }
    return serie;
  }

  /* --------------------------- Bilan pour le coin des parents --------------------------- */

  // Agrégation complète, pensée pour un adulte qui n'a que 30 secondes :
  // temps passé, résultats globaux, par matière, et points d'attention.
  // La mise en forme (HTML) vit dans js/parents.js — ici, uniquement les
  // chiffres.
  function bilanParents() {
    const etat = charger();
    const matieres = M();
    const exercices = X();

    const totalReponses = etat.sessions.reduce((a, s) => a + s.total, 0);
    const totalCorrect = etat.sessions.reduce((a, s) => a + s.correct, 0);
    const reussiteGlobale = totalReponses ? Math.round((totalCorrect / totalReponses) * 100) : null;
    const dureeTotaleMs = etat.sessions.reduce((a, s) => a + (s.duree || 0), 0);

    const septJoursMs = 7 * 86400000;
    const maintenant = Date.now();
    const sessions7j = etat.sessions.filter((s) => maintenant - new Date(s.date).getTime() <= septJoursMs);
    const dureeSemaineMs = sessions7j.reduce((a, s) => a + (s.duree || 0), 0);

    const parMatiere = matieres.map((m) => {
      const ids = exercices.filter((e) => e.matiere === m.code).map((e) => e.id);
      const res = maitriseListe(ids, etat.parExercice);
      const sessionsM = etat.sessions.filter((s) => s.matiere === m.code);
      const dureeM = sessionsM.reduce((a, s) => a + (s.duree || 0), 0);
      return {
        code: m.code,
        nom: m.nom,
        emoji: m.emoji,
        maitrise: res.pct,
        sessions: sessionsM.length,
        dureeMs: dureeM,
      };
    });

    // Points d'attention : exercices avec moins de 60% de réussite (vus au
    // moins une fois), les pires en premier.
    const pointsAttention = Object.keys(etat.parExercice)
      .map((id) => ({ id: id, ...etat.parExercice[id] }))
      .filter((e) => e.vus > 0 && e.reussis / e.vus < 0.6)
      .sort((a, b) => a.reussis / a.vus - b.reussis / b.vus)
      .slice(0, 8)
      .map((e) => {
        const ex = exercices.find((x) => x.id === e.id);
        const m = ex ? matieres.find((mm) => mm.code === ex.matiere) : null;
        return ex ? { matiereNom: m ? m.nom : ex.matiere, emoji: m ? m.emoji : "📘", chapitre: ex.chapitre, question: ex.question, ratio: `${e.reussis}/${e.vus}` } : null;
      })
      .filter(Boolean);

    return {
      totalSessions: etat.sessions.length,
      totalReponses: totalReponses,
      totalCorrect: totalCorrect,
      reussiteGlobale: reussiteGlobale,
      dureeTotaleMs: dureeTotaleMs,
      dureeSemaineMs: dureeSemaineMs,
      sessions7jCount: sessions7j.length,
      serieJours: serieJours(),
      derniereActivite: etat.sessions.length ? etat.sessions[etat.sessions.length - 1].date : null,
      parMatiere: parMatiere,
      pointsAttention: pointsAttention,
      sessionsRecentes: etat.sessions.slice(-10).reverse(),
    };
  }

  /* --------------------------- Rendu du dashboard --------------------------- */

  function quandTexte(iso) {
    const d = new Date(iso);
    const j = new Date();
    j.setHours(0, 0, 0, 0);
    const diff = Math.floor((j - new Date(d).setHours(0, 0, 0, 0)) / 86400000);
    if (diff <= 0) return "aujourd'hui";
    if (diff === 1) return "hier";
    if (diff < 7) return `il y a ${diff} j`;
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  }

  function el(tag, cls, texte) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (texte != null) n.textContent = texte;
    return n;
  }

  let filtreActif = "tout";

  function rendre(conteneur) {
    const etat = charger();
    conteneur.innerHTML = "";

    const matieres = M();

    // ----- Filtres -----
    const filtres = el("div", "stats-filtres");
    const chips = [{ code: "tout", nom: "Tout", emoji: "🎯" }].concat(
      matieres.map((m) => ({ code: m.code, nom: m.nom, emoji: m.emoji }))
    );
    chips.forEach((c) => {
      const b = el("button", "stats-chip" + (filtreActif === c.code ? " actif" : ""), `${c.emoji} ${c.nom}`);
      b.addEventListener("click", () => {
        filtreActif = c.code;
        rendre(conteneur);
      });
      filtres.appendChild(b);
    });
    conteneur.appendChild(filtres);

    const sessionsFiltrees =
      filtreActif === "tout" ? etat.sessions : etat.sessions.filter((s) => s.matiere === filtreActif);

    if (etat.sessions.length === 0) {
      const vide = el("div", "stats-bloc");
      vide.appendChild(el("div", "stats-bloc-vide", "Aucune révision enregistrée pour l'instant. Lance une session depuis un onglet matière — tes stats apparaîtront ici. 📈"));
      conteneur.appendChild(vide);
      return;
    }

    // ----- 3 tuiles -----
    const idsFiltre = (X())
      .filter((e) => filtreActif === "tout" || e.matiere === filtreActif)
      .map((e) => e.id);
    const totalRep = sessionsFiltrees.reduce((a, s) => a + s.total, 0);
    const totalOk = sessionsFiltrees.reduce((a, s) => a + s.correct, 0);
    const reussite = totalRep ? Math.round((totalOk / totalRep) * 100) : 0;

    const serie = serieJours();
    const tuiles = el("div", "stats-tuiles");
    [
      { g: String(totalRep), p: totalRep > 1 ? "réponses" : "réponse" },
      { g: reussite + "%", p: "réussite" },
      { g: String(serie), p: serie > 1 ? "jours de suite" : "jour de suite" },
    ].forEach((t) => {
      const tu = el("div", "stat-tuile");
      tu.appendChild(el("div", "grand", t.g));
      tu.appendChild(el("div", "petit", t.p));
      tuiles.appendChild(tu);
    });
    conteneur.appendChild(tuiles);

    // ----- Graphe de progression -----
    const blocGraphe = el("div", "stats-bloc");
    blocGraphe.appendChild(el("h3", null, "Progression (score par séance)"));
    const points = sessionsFiltrees.slice(-12).map((s) => Math.round((s.correct / s.total) * 100));
    if (points.length < 2) {
      blocGraphe.appendChild(el("div", "stats-bloc-vide", "Fais au moins 2 séances pour voir la courbe."));
    } else {
      const largeur = Math.max(240, (conteneur.clientWidth || 320) - 40);
      blocGraphe.appendChild(construireGraphe(points, largeur));
      const leg = el("div", "graphe-legende");
      leg.appendChild(el("span", null, `il y a ${points.length} séances`));
      leg.appendChild(el("span", null, "dernière"));
      blocGraphe.appendChild(leg);
    }
    conteneur.appendChild(blocGraphe);

    // ----- Maîtrise par matière -----
    const blocM = el("div", "stats-bloc");
    blocM.appendChild(el("h3", null, "Maîtrise par matière"));
    const matieresAffichees = filtreActif === "tout" ? matieres : matieres.filter((m) => m.code === filtreActif);
    matieresAffichees.forEach((m) => {
      const ids = (X()).filter((e) => e.matiere === m.code).map((e) => e.id);
      const res = maitriseListe(ids, etat.parExercice);
      const ligne = el("div", "maitrise-ligne");
      const tete = el("button", "maitrise-tete");
      tete.appendChild(el("span", "emoji", m.emoji));
      tete.appendChild(el("span", "nom", m.nom));
      const barre = el("div", "maitrise-barre");
      const rempli = el("span");
      rempli.style.width = (res.pct || 0) + "%";
      barre.appendChild(rempli);
      tete.appendChild(barre);
      tete.appendChild(el("span", "maitrise-pct", res.pct == null ? "—" : res.pct + "%"));

      const detail = el("div", "maitrise-detail");
      detail.hidden = true;
      const chapitres = [...new Set((X()).filter((e) => e.matiere === m.code).map((e) => e.chapitre))];
      chapitres.forEach((ch) => {
        const cr = maitriseChapitre(m.code, ch);
        const sous = el("div", "maitrise-sous");
        sous.appendChild(el("span", "nom-sous", ch));
        const sb = el("div", "maitrise-barre");
        const sr = el("span");
        sr.style.width = (cr.pct || 0) + "%";
        sb.appendChild(sr);
        sous.appendChild(sb);
        sous.appendChild(el("span", "maitrise-pct", cr.pct == null ? "—" : cr.pct + "%"));
        detail.appendChild(sous);
      });
      tete.addEventListener("click", () => {
        detail.hidden = !detail.hidden;
      });
      ligne.appendChild(tete);
      ligne.appendChild(detail);
      blocM.appendChild(ligne);
    });
    conteneur.appendChild(blocM);

    // ----- À revoir -----
    const aRevoir = Object.keys(etat.parExercice)
      .map((id) => ({ id, ...etat.parExercice[id] }))
      .filter((e) => idsFiltre.indexOf(e.id) !== -1)
      .filter((e) => e.vus > 0 && e.reussis / e.vus < 0.6)
      .sort((a, b) => a.reussis / a.vus - b.reussis / b.vus)
      .slice(0, 6);
    if (aRevoir.length > 0) {
      const blocR = el("div", "stats-bloc");
      blocR.appendChild(el("h3", null, "À revoir en priorité"));
      aRevoir.forEach((e) => {
        const ex = (X()).find((x) => x.id === e.id);
        if (!ex) return;
        const item = el("div", "revoir-item");
        const q = el("button", "revoir-q");
        q.appendChild(el("span", "badge-ratio", `${e.reussis}/${e.vus}`));
        q.appendChild(el("span", null, ex.question));
        const exp = el("div", "revoir-exp", ex.explication);
        exp.hidden = true;
        q.addEventListener("click", () => {
          exp.hidden = !exp.hidden;
        });
        item.appendChild(q);
        item.appendChild(exp);
        blocR.appendChild(item);
      });
      conteneur.appendChild(blocR);
    }

    // ----- Dernières séances -----
    const blocS = el("div", "stats-bloc");
    blocS.appendChild(el("h3", null, "Dernières séances"));
    sessionsFiltrees
      .slice(-8)
      .reverse()
      .forEach((s) => {
        const m = matieres.find((x) => x.code === s.matiere);
        const pct = Math.round((s.correct / s.total) * 100);
        const ligne = el("div", "seance-ligne");
        ligne.appendChild(el("span", "emoji", m ? m.emoji : "📘"));
        ligne.appendChild(el("span", "nom", (m ? m.nom : s.matiere) + (s.chapitre ? " · " + s.chapitre : "")));
        ligne.appendChild(el("span", "score", `${s.correct}/${s.total} (${pct}%)`));
        ligne.appendChild(el("span", "quand", quandTexte(s.date)));
        blocS.appendChild(ligne);
      });
    conteneur.appendChild(blocS);

    // ----- Effacer -----
    const reset = el("button", "btn btn-fantome reglages-reset", "Effacer toutes mes stats");
    reset.addEventListener("click", () => {
      if (window.confirm("Effacer tout l'historique de tes révisions ? (irréversible)")) {
        effacerTout();
        filtreActif = "tout";
        rendre(conteneur);
      }
    });
    conteneur.appendChild(reset);
  }

  // Graphe SVG maison (aire + courbe + points), 0–100 %. On construit le
  // viewBox à la largeur réelle du conteneur pour éviter toute déformation
  // (preserveAspectRatio="none" reste, mais l'échelle est ~1:1).
  function construireGraphe(valeurs, largeur) {
    const W = Math.round(largeur || 320), H = 150, padX = 6, padY = 12;
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "graphe");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("preserveAspectRatio", "none");

    const x = (i) => padX + (i / (valeurs.length - 1)) * (W - padX * 2);
    const y = (v) => padY + (1 - v / 100) * (H - padY * 2);

    [0, 50, 100].forEach((v) => {
      const l = document.createElementNS(svgNS, "line");
      l.setAttribute("class", "grille");
      l.setAttribute("x1", padX);
      l.setAttribute("x2", W - padX);
      l.setAttribute("y1", y(v));
      l.setAttribute("y2", y(v));
      svg.appendChild(l);
    });

    const dLigne = valeurs.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
    const aire = document.createElementNS(svgNS, "path");
    aire.setAttribute("class", "aire");
    aire.setAttribute("d", `${dLigne} L ${x(valeurs.length - 1).toFixed(1)} ${H - padY} L ${x(0).toFixed(1)} ${H - padY} Z`);
    svg.appendChild(aire);

    const courbe = document.createElementNS(svgNS, "path");
    courbe.setAttribute("class", "courbe");
    courbe.setAttribute("d", dLigne);
    svg.appendChild(courbe);

    valeurs.forEach((v, i) => {
      const c = document.createElementNS(svgNS, "circle");
      c.setAttribute("class", "pt");
      c.setAttribute("cx", x(i).toFixed(1));
      c.setAttribute("cy", y(v).toFixed(1));
      c.setAttribute("r", i === valeurs.length - 1 ? 4.5 : 3.5);
      const titre = document.createElementNS(svgNS, "title");
      titre.textContent = `${v}%`;
      c.appendChild(titre);
      svg.appendChild(c);
    });

    return svg;
  }

  /* ------------------------------- API ------------------------------- */

  window.CoachStats = {
    enregistrerSession: enregistrerSession,
    effacerTout: effacerTout,
    resumeMatiere: resumeMatiere,
    maitriseChapitre: maitriseChapitre,
    bilanParents: bilanParents,
    rendre: rendre,
    _reinitFiltre: function () { filtreActif = "tout"; },
  };
})();
