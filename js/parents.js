/* =========================================================================
   Claude — coin des parents
   -------------------------------------------------------------------------
   Petit écran séparé de l'espace de Léopold (pas un onglet de la barre du
   bas — juste un lien discret depuis l'accueil) qui résume, pour un parent
   pressé : le temps passé à réviser, les résultats, et les points
   d'attention. Toutes les données viennent de js/stats.js (localStorage) ;
   ce fichier ne fait que les mettre en forme.

   Réutilise volontairement les classes CSS déjà écrites pour l'écran Stats
   (stats-bloc, stat-tuile, maitrise-*, revoir-*, seance-ligne...) pour que
   ça reste cohérent visuellement sans dupliquer de CSS.
   ========================================================================= */

(function () {
  "use strict";

  function el(tag, cls, texte) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (texte != null) n.textContent = texte;
    return n;
  }

  // "1h 12min", "8 min", "moins d'une minute" — jamais de décimales, ce
  // n'est pas ce dont un parent a besoin d'un coup d'œil.
  function formaterDuree(ms) {
    if (!ms || ms < 1000) return "moins d'une minute";
    const minutesTotal = Math.round(ms / 60000);
    if (minutesTotal < 1) return "moins d'une minute";
    const h = Math.floor(minutesTotal / 60);
    const m = minutesTotal % 60;
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h} h`;
    return `${h} h ${m} min`;
  }

  function quandTexte(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    const j = new Date();
    j.setHours(0, 0, 0, 0);
    const diff = Math.floor((j - new Date(d).setHours(0, 0, 0, 0)) / 86400000);
    if (diff <= 0) return "aujourd'hui";
    if (diff === 1) return "hier";
    if (diff < 7) return `il y a ${diff} j`;
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  }

  // Un petit paragraphe généré à partir des chiffres — pas de placeholder
  // générique, il change vraiment selon la réalité des séances de Léopold.
  function genererResume(b) {
    if (b.totalSessions === 0) {
      return `${PRENOM} n'a pas encore fait de séance de révision. Dès qu'il en fera une, le bilan apparaîtra ici.`;
    }
    const phrases = [];
    phrases.push(
      `${PRENOM} a fait ${b.sessions7jCount} séance${b.sessions7jCount > 1 ? "s" : ""} ces 7 derniers jours` +
        (b.dureeSemaineMs > 0 ? ` (${formaterDuree(b.dureeSemaineMs)} au total)` : "") +
        "."
    );
    if (b.reussiteGlobale != null) {
      phrases.push(`Taux de réussite global : ${b.reussiteGlobale} %.`);
    }
    if (b.serieJours >= 2) {
      phrases.push(`Série en cours : ${b.serieJours} jours d'affilée. 🔥`);
    }
    if (b.pointsAttention.length > 0) {
      const chapitres = [...new Set(b.pointsAttention.slice(0, 3).map((p) => `${p.matiereNom} · ${p.chapitre}`))];
      phrases.push(`À surveiller en priorité : ${chapitres.join(", ")}.`);
    } else if (b.totalSessions > 0) {
      phrases.push("Aucun point faible marqué pour l'instant — continuez comme ça !");
    }
    return phrases.join(" ");
  }

  function rendre(conteneur) {
    conteneur.innerHTML = "";
    const b = window.CoachStats ? window.CoachStats.bilanParents() : null;

    if (!b || b.totalSessions === 0) {
      const vide = el("div", "stats-bloc");
      vide.appendChild(
        el(
          "div",
          "stats-bloc-vide",
          `${PRENOM} n'a pas encore fait de séance de révision. Dès qu'il en fera une, le bilan apparaîtra ici. 📈`
        )
      );
      conteneur.appendChild(vide);
      return;
    }

    // ----- Résumé en une phrase -----
    const resume = el("div", "stats-bloc parents-resume");
    resume.appendChild(el("p", null, genererResume(b)));
    conteneur.appendChild(resume);

    // ----- 3 tuiles : temps cette semaine / réussite / série -----
    const tuiles = el("div", "stats-tuiles");
    [
      { g: formaterDuree(b.dureeSemaineMs), p: "cette semaine" },
      { g: b.reussiteGlobale == null ? "—" : b.reussiteGlobale + "%", p: "réussite globale" },
      { g: String(b.serieJours), p: b.serieJours > 1 ? "jours de suite" : "jour de suite" },
    ].forEach((t) => {
      const tu = el("div", "stat-tuile");
      tu.appendChild(el("div", "grand", t.g));
      tu.appendChild(el("div", "petit", t.p));
      tuiles.appendChild(tu);
    });
    conteneur.appendChild(tuiles);

    // ----- Temps total + nombre de séances -----
    const blocTemps = el("div", "stats-bloc");
    blocTemps.appendChild(el("h3", null, "Temps passé au total"));
    const ligneTemps = el("p", "parents-total-temps");
    ligneTemps.appendChild(el("strong", null, formaterDuree(b.dureeTotaleMs)));
    ligneTemps.appendChild(
      document.createTextNode(
        ` sur ${b.totalSessions} séance${b.totalSessions > 1 ? "s" : ""} (${b.totalReponses} réponse${b.totalReponses > 1 ? "s" : ""} au total)`
      )
    );
    blocTemps.appendChild(ligneTemps);
    if (b.derniereActivite) {
      blocTemps.appendChild(el("p", "parents-derniere", `Dernière séance : ${quandTexte(b.derniereActivite)}`));
    }
    conteneur.appendChild(blocTemps);

    // ----- Par matière -----
    const blocM = el("div", "stats-bloc");
    blocM.appendChild(el("h3", null, "Résultats par matière"));
    b.parMatiere.forEach((m) => {
      const ligne = el("div", "maitrise-ligne");
      const tete = el("div", "maitrise-tete");
      tete.appendChild(el("span", "emoji", m.emoji));
      tete.appendChild(el("span", "nom", m.nom));
      const barre = el("div", "maitrise-barre");
      const rempli = el("span");
      rempli.style.width = (m.maitrise || 0) + "%";
      barre.appendChild(rempli);
      tete.appendChild(barre);
      tete.appendChild(el("span", "maitrise-pct", m.maitrise == null ? "—" : m.maitrise + "%"));
      ligne.appendChild(tete);
      const meta = el(
        "p",
        "parents-matiere-meta",
        `${m.sessions} séance${m.sessions > 1 ? "s" : ""}${m.dureeMs > 0 ? " · " + formaterDuree(m.dureeMs) : ""}`
      );
      ligne.appendChild(meta);
      blocM.appendChild(ligne);
    });
    conteneur.appendChild(blocM);

    // ----- Points d'attention -----
    if (b.pointsAttention.length > 0) {
      const blocA = el("div", "stats-bloc");
      blocA.appendChild(el("h3", null, "⚠️ Points d'attention"));
      b.pointsAttention.forEach((p) => {
        const item = el("div", "revoir-item");
        const q = el("button", "revoir-q");
        q.appendChild(el("span", "badge-ratio", p.ratio));
        q.appendChild(el("span", null, `${p.emoji} ${p.matiereNom} · ${p.chapitre}`));
        const exp = el("div", "revoir-exp", p.question);
        exp.hidden = true;
        q.addEventListener("click", () => {
          exp.hidden = !exp.hidden;
        });
        item.appendChild(q);
        item.appendChild(exp);
        blocA.appendChild(item);
      });
      conteneur.appendChild(blocA);
    }

    // ----- Dernières séances -----
    const blocS = el("div", "stats-bloc");
    blocS.appendChild(el("h3", null, "Dernières séances"));
    const matieres = typeof MATIERES !== "undefined" ? MATIERES : [];
    b.sessionsRecentes.forEach((s) => {
      const m = matieres.find((x) => x.code === s.matiere);
      const pct = Math.round((s.correct / s.total) * 100);
      const ligne = el("div", "seance-ligne");
      ligne.appendChild(el("span", "emoji", m ? m.emoji : "📘"));
      ligne.appendChild(el("span", "nom", (m ? m.nom : s.matiere) + (s.chapitre ? " · " + s.chapitre : "")));
      ligne.appendChild(el("span", "score", `${s.correct}/${s.total} (${pct}%)`));
      ligne.appendChild(el("span", "quand", (s.duree ? formaterDuree(s.duree) + " · " : "") + quandTexte(s.date)));
      blocS.appendChild(ligne);
    });
    conteneur.appendChild(blocS);
  }

  // Affiche l'écran (en cachant tous les autres) puis le remplit — mêmes
  // écrans que ceux gérés par nav.js, mais "parents" n'est volontairement
  // pas un onglet de la barre du bas : c'est un lien discret depuis l'accueil.
  function ouvrir() {
    ["accueil", "matieres", "exercice", "resultats", "matiere", "stats", "reglages", "parents"].forEach((id) => {
      const n = document.getElementById("ecran-" + id);
      if (n) n.classList.toggle("hidden", id !== "parents");
    });
    document.body.setAttribute("data-vue", "parents");
    window.scrollTo({ top: 0, behavior: "smooth" });
    rendre(document.getElementById("parents-contenu"));
  }

  window.CoachParents = { ouvrir: ouvrir, rendre: rendre };
})();
