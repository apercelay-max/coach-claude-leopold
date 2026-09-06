/* =========================================================================
   Claude — séance « tout sur un écran qui défile » + reprise de séance
   -------------------------------------------------------------------------
   1) Sur demande de Léopold : toute la séance sur une seule page qui défile
      (plus besoin de cliquer « Suivant »). Réglage Révision → « Tout sur un
      écran qui défile » (ON par défaut ; OFF = ancien mode de app.js).

   2) Reprise de séance : les réponses sont sauvegardées au fur et à mesure
      dans localStorage. Si on ferme l'appli en plein milieu, on peut
      reprendre là où on en était (bouton sur l'accueil, ou en relançant la
      même matière). Effacé à la fin de la séance et si on quitte.

   N'ajoute aucune logique de révision : réutilise estReponseCorrecte(),
   melanger(), getMatiere(), les réactions de la mascotte, finDeSession()
   et le hook stats de app.js.
   ========================================================================= */

(function () {
  "use strict";

  const _demarrerSession = window.demarrerSession;
  const _finDeSession = window.finDeSession;
  const COULEURS = typeof COULEURS_MATIERE !== "undefined" ? COULEURS_MATIERE : {};

  const CLE_SEANCE = "coach-claude-leopold:seance-v1";
  const MAX_AGE_MS = 36 * 3600 * 1000; // au-delà, on ne propose plus la reprise

  function defilementActif() {
    return !window.CoachReglages || window.CoachReglages.get("defilement") !== "off";
  }

  function el(tag, cls, texte) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (texte != null) n.textContent = texte;
    return n;
  }

  /* --------------------- Sauvegarde de la séance en cours --------------------- */

  let repondu = new Set();
  let reponsesValeurs = {}; // id -> valeur (string) pour la reprise

  function sauvegarderSeance() {
    try {
      if (repondu.size === 0 || repondu.size >= etat.session.length) {
        // rien à reprendre (pas commencé) ou fini → on nettoie
        localStorage.removeItem(CLE_SEANCE);
        return;
      }
      localStorage.setItem(
        CLE_SEANCE,
        JSON.stringify({
          matiere: etat.matiereCode,
          chapitre: etat.chapitre,
          ordre: etat.session.map((e) => e.id),
          reponses: reponsesValeurs,
          quand: Date.now(),
        })
      );
    } catch (e) {
      /* stockage indisponible : pas bloquant */
    }
  }

  function effacerSeance() {
    try {
      localStorage.removeItem(CLE_SEANCE);
    } catch (e) {}
    majBoutonAccueil();
  }

  function lireSeance() {
    try {
      const s = JSON.parse(localStorage.getItem(CLE_SEANCE) || "null");
      if (!s || !Array.isArray(s.ordre) || !s.reponses) return null;
      if (Date.now() - (s.quand || 0) > MAX_AGE_MS) return null;
      const nbRepondu = Object.keys(s.reponses).length;
      if (nbRepondu === 0 || nbRepondu >= s.ordre.length) return null;
      return s;
    } catch (e) {
      return null;
    }
  }

  /* --------------------------- Point d'entrée --------------------------- */

  function demarrer(matiereCode, chapitre, reprise) {
    const vieux = document.getElementById("carte-question");
    const liste = document.getElementById("exercice-liste");

    if (!defilementActif() && !reprise) {
      if (vieux) vieux.hidden = false;
      if (liste) liste.innerHTML = "";
      effacerSeance();
      return _demarrerSession(matiereCode, chapitre);
    }

    if (!reprise) effacerSeance(); // une nouvelle séance remplace toute séance en cours

    etat.matiereCode = matiereCode;
    etat.chapitre = chapitre || null;

    if (reprise) {
      // Reconstruit la séance dans l'ordre sauvegardé.
      const parId = {};
      (typeof EXERCICES !== "undefined" ? EXERCICES : []).forEach((e) => (parId[e.id] = e));
      etat.session = reprise.ordre.map((id) => parId[id]).filter(Boolean);
    } else {
      let exs = getExercicesParMatiere(matiereCode);
      if (etat.chapitre) exs = exs.filter((e) => e.chapitre === etat.chapitre);
      etat.session = melanger(exs);
    }
    etat.index = 0;
    etat.resultatsSession = [];

    if (vieux) vieux.hidden = true;
    rendre(reprise);
    window.afficherEcran("exercice");
    window.scrollTo({ top: 0 });
  }

  function reprendre() {
    const s = lireSeance();
    if (s) demarrer(s.matiere, s.chapitre, s);
  }

  /* ----------------------------- Rendu liste ----------------------------- */

  function rendre(reprise) {
    repondu = new Set();
    reponsesValeurs = {};
    const liste = document.getElementById("exercice-liste");
    liste.innerHTML = "";

    const cartes = etat.session.map((ex, i) => construireCarte(ex, i));
    cartes.forEach((c) => liste.appendChild(c.wrap));

    const pied = el("div", "exercice-pied");
    const b = el("button", "btn btn-principal", "Voir mon résultat");
    b.type = "button";
    b.id = "btn-voir-resultat";
    b.addEventListener("click", terminer);
    pied.appendChild(b);
    pied.appendChild(el("p", "exercice-pied-note", "Réponds dans l'ordre que tu veux, remonte en scrollant si besoin. Tes réponses sont gardées si tu fermes l'appli."));
    liste.appendChild(pied);

    // Reprise : re-valide les réponses déjà données
    if (reprise && reprise.reponses) {
      cartes.forEach((c) => {
        const v = reprise.reponses[c.ex.id];
        if (v !== undefined && v !== null) c.preRepondre(v);
      });
    }

    majProgression();
  }

  function construireCarte(ex, i) {
    const matiere = getMatiere(ex.matiere);
    const couleurs = COULEURS[matiere && matiere.couleur] || null;

    const wrap = el("div", "exo-carte carte-question");
    wrap.dataset.exo = ex.id;
    wrap.appendChild(el("div", "exo-num", `Question ${i + 1} / ${etat.session.length}`));

    const badge = el("span", "badge-matiere", `${matiere.emoji} ${matiere.nom} · ${ex.chapitre}`);
    if (couleurs) {
      badge.style.background = couleurs.fond;
      badge.style.color = couleurs.texte;
    }
    wrap.appendChild(badge);
    wrap.appendChild(el("p", "enonce", ex.question));

    const zone = el("div", "zone-reponse");
    let lireValeur = () => null;
    let poserValeur = () => {};

    const valBtn = el("button", "btn btn-principal", "Valider");
    valBtn.type = "button";
    valBtn.disabled = true;

    if (ex.type === "qcm" || ex.type === "vrai_faux") {
      zone.classList.add("grille-2");
      let sel = null;
      const choix = ex.type === "qcm" ? ex.choix : ["Vrai", "Faux"];
      const valeurDe = (idx) => (ex.type === "qcm" ? String(idx) : idx === 0 ? "vrai" : "faux");
      choix.forEach((txt, idx) => {
        const bt = el("button", "option-reponse", txt);
        bt.type = "button";
        bt.dataset.val = valeurDe(idx);
        bt.addEventListener("click", () => {
          if (repondu.has(ex.id)) return;
          sel = valeurDe(idx);
          zone.querySelectorAll(".option-reponse").forEach((x) => x.classList.remove("selectionnee"));
          bt.classList.add("selectionnee");
          valBtn.disabled = false;
        });
        zone.appendChild(bt);
      });
      lireValeur = () => sel;
      poserValeur = (v) => {
        const bt = zone.querySelector('.option-reponse[data-val="' + CSS.escape(String(v)) + '"]');
        if (bt) {
          sel = String(v);
          zone.querySelectorAll(".option-reponse").forEach((x) => x.classList.remove("selectionnee"));
          bt.classList.add("selectionnee");
          valBtn.disabled = false;
        }
      };
    } else {
      const input = el("input", "champ-texte");
      input.type = "text";
      input.placeholder = "Ta réponse…";
      input.addEventListener("input", () => {
        valBtn.disabled = input.value.trim() === "" || repondu.has(ex.id);
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !valBtn.disabled) valider();
      });
      zone.appendChild(input);
      lireValeur = () => (input.value.trim() === "" ? null : input.value);
      poserValeur = (v) => {
        input.value = v;
        valBtn.disabled = false;
      };
    }
    wrap.appendChild(zone);

    const indiceP = el("p", "indice");
    indiceP.hidden = true;
    const indiceBtn = el("button", "btn btn-fantome", "💡 Un indice ?");
    indiceBtn.type = "button";
    if (!ex.indice) indiceBtn.hidden = true;
    indiceBtn.addEventListener("click", () => {
      indiceP.textContent = "💡 " + ex.indice;
      indiceP.hidden = false;
      indiceBtn.hidden = true;
    });

    const corr = el("div", "carte-correction hidden");
    const verdict = el("p", "correction-verdict");
    const expl = el("p", "correction-explication");
    corr.append(verdict, expl);

    function valider(silencieux) {
      if (repondu.has(ex.id)) return;
      const valeur = lireValeur();
      if (valeur === null || valeur === undefined) return;
      const correct = estReponseCorrecte(ex, valeur);
      repondu.add(ex.id);
      reponsesValeurs[ex.id] = valeur;
      etat.resultatsSession.push({ exercice: ex, reponseDonnee: valeur, correct: correct });

      zone.querySelectorAll(".option-reponse").forEach((b) => (b.disabled = true));
      const champ = zone.querySelector(".champ-texte");
      if (champ) champ.disabled = true;

      if (ex.type === "qcm") {
        zone.querySelectorAll(".option-reponse").forEach((b, idx) => {
          if (idx === ex.bonne) b.classList.add("bonne-reponse");
          else if (String(idx) === valeur) b.classList.add("mauvaise-reponse");
        });
      } else if (ex.type === "vrai_faux") {
        const bonne = ex.reponse ? "vrai" : "faux";
        zone.querySelectorAll(".option-reponse").forEach((b) => {
          const v = b.textContent.toLowerCase();
          if (v === bonne) b.classList.add("bonne-reponse");
          else if (v === valeur) b.classList.add("mauvaise-reponse");
        });
      }

      indiceBtn.hidden = true;
      indiceP.hidden = true;
      valBtn.hidden = true;

      corr.classList.remove("hidden", "correcte", "incorrecte");
      corr.classList.add(correct ? "correcte" : "incorrecte");
      verdict.textContent = correct ? "✅ Bonne réponse !" : "✏️ Pas tout à fait…";
      expl.textContent = ex.explication;
      wrap.classList.add("exo-repondu", correct ? "exo-ok" : "exo-ko");

      if (!silencieux) {
        if (correct) mascotteReagitBonneReponse(ex.matiere, ex.difficulte);
        else mascotteReagitMauvaiseReponse(ex.matiere);
      }

      majProgression();
      sauvegarderSeance();
    }
    valBtn.addEventListener("click", () => valider(false));

    const actions = el("div", "actions-question");
    actions.append(indiceBtn, valBtn);
    wrap.append(actions, indiceP, corr);

    return {
      wrap: wrap,
      ex: ex,
      preRepondre: function (v) {
        poserValeur(v);
        valider(true); // pas de réaction mascotte ni de re-sauvegarde bruyante lors d'une reprise
      },
    };
  }

  /* ------------------------- Progression / fin ------------------------- */

  function majProgression() {
    const n = repondu.size;
    const total = etat.session.length;

    const cpt = document.getElementById("compteur-question");
    if (cpt) cpt.textContent = `Répondu : ${n} / ${total}`;

    const barre = document.getElementById("barre-progression-remplissage");
    if (barre) barre.style.width = (total ? (n / total) * 100 : 0) + "%";

    const b = document.getElementById("btn-voir-resultat");
    if (b) {
      if (n >= total) {
        b.textContent = "Voir mon résultat 🎉";
        b.classList.add("pret");
      } else {
        b.textContent = `Voir mon résultat (${n}/${total})`;
        b.classList.remove("pret");
      }
    }
  }

  function terminer() {
    const n = repondu.size;
    const total = etat.session.length;
    if (n < total) {
      const reste = total - n;
      const premiere = [...document.querySelectorAll(".exo-carte")].find((c) => !repondu.has(c.dataset.exo));
      if (!window.confirm(`Il te reste ${reste} question${reste > 1 ? "s" : ""} sans réponse. Voir ton résultat quand même ?`)) {
        if (premiere) premiere.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
    effacerSeance();
    window.finDeSession();
  }

  /* ------------------- Bouton « Reprendre » sur l'accueil ------------------- */

  function majBoutonAccueil() {
    const zone = document.querySelector("#ecran-accueil .cartes-accueil");
    if (!zone) return;
    let carte = document.getElementById("carte-reprendre");
    const s = lireSeance();

    if (!s) {
      if (carte) carte.remove();
      return;
    }

    const matiere = getMatiere(s.matiere);
    const nom = matiere ? matiere.nom : s.matiere;
    const n = Object.keys(s.reponses).length;
    const total = s.ordre.length;
    const prep = /^[aeiouyhàâäéèêëîïôöûü]/i.test(nom) ? "d'" : "de ";
    const libelle = `Reprendre ma séance ${prep}${nom} (${n}/${total})`;

    if (!carte) {
      carte = el("button", "carte-action carte-action--reprendre");
      carte.type = "button";
      carte.id = "carte-reprendre";
      carte.innerHTML =
        '<span class="carte-action-emoji">⏳</span>' +
        '<span class="carte-action-titre"></span>' +
        '<span class="carte-action-desc">Tu avais commencé une séance — on continue là où tu t\'étais arrêté.</span>';
      carte.addEventListener("click", reprendre);
      zone.insertBefore(carte, zone.firstChild);
    }
    carte.querySelector(".carte-action-titre").textContent = libelle;
  }

  /* ------------------------------- Init ------------------------------- */

  // finDeSession : on nettoie la séance en cours (au cas où on arrive par un
  // autre chemin) et on met à jour le bouton de l'accueil.
  window.finDeSession = function () {
    effacerSeance();
    if (typeof _finDeSession === "function") _finDeSession.apply(this, arguments);
  };

  // « Quitter » (et tout retour à l'accueil) : on garde la séance pour pouvoir
  // la reprendre, et on rafraîchit le bouton de l'accueil.
  const _afficherEcran = window.afficherEcran;
  window.afficherEcran = function (nom) {
    if (typeof _afficherEcran === "function") _afficherEcran(nom);
    if (nom === "accueil") majBoutonAccueil();
  };

  window.demarrerSession = demarrer;

  document.addEventListener("DOMContentLoaded", majBoutonAccueil);

  window.CoachSeance = {
    reprendre: reprendre,
    effacer: effacerSeance,
    enCours: function () { return !!lireSeance(); },
  };
})();
