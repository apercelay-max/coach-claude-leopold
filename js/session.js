/* =========================================================================
   Claude — séance « tout sur un écran qui défile »
   -------------------------------------------------------------------------
   Sur demande de Léopold : au lieu de répondre à une question, cliquer
   « Suivant », etc., toute la séance tient sur une seule page qui défile.
   Chaque question a son bouton « Valider » ; la correction s'affiche juste
   en dessous ; en bas un bouton « Voir mon résultat ».

   N'ajoute aucune logique de révision : réutilise estReponseCorrecte(),
   melanger(), getMatiere(), les réactions de la mascotte, finDeSession()
   et le hook stats de app.js. Enrobe window.demarrerSession — si le réglage
   « Tout sur un écran » est désactivé, on retombe sur l'ancien mode
   (une question à la fois) de app.js, inchangé.
   ========================================================================= */

(function () {
  "use strict";

  const _demarrerSession = window.demarrerSession;
  const COULEURS = typeof COULEURS_MATIERE !== "undefined" ? COULEURS_MATIERE : {};

  function defilementActif() {
    return !window.CoachReglages || window.CoachReglages.get("defilement") !== "off";
  }

  function el(tag, cls, texte) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (texte != null) n.textContent = texte;
    return n;
  }

  let repondu = new Set();

  /* --------------------------- Point d'entrée --------------------------- */

  function demarrer(matiereCode, chapitre) {
    const vieux = document.getElementById("carte-question");
    const liste = document.getElementById("exercice-liste");

    if (!defilementActif()) {
      // Ancien mode : une question à la fois (app.js)
      if (vieux) vieux.hidden = false;
      if (liste) liste.innerHTML = "";
      return _demarrerSession(matiereCode, chapitre);
    }

    etat.matiereCode = matiereCode;
    etat.chapitre = chapitre || null;
    let exs = getExercicesParMatiere(matiereCode);
    if (etat.chapitre) exs = exs.filter((e) => e.chapitre === etat.chapitre);
    etat.session = melanger(exs);
    etat.index = 0;
    etat.resultatsSession = [];

    if (vieux) vieux.hidden = true;
    rendre();
    window.afficherEcran("exercice");
    window.scrollTo({ top: 0 });
  }

  /* ----------------------------- Rendu liste ----------------------------- */

  function rendre() {
    repondu = new Set();
    const liste = document.getElementById("exercice-liste");
    liste.innerHTML = "";

    etat.session.forEach((ex, i) => liste.appendChild(construireCarte(ex, i)));

    const pied = el("div", "exercice-pied");
    const b = el("button", "btn btn-principal", "Voir mon résultat");
    b.type = "button";
    b.id = "btn-voir-resultat";
    b.addEventListener("click", terminer);
    pied.appendChild(b);
    pied.appendChild(el("p", "exercice-pied-note", "Réponds dans l'ordre que tu veux, remonte en scrollant si besoin."));
    liste.appendChild(pied);

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

    const valBtn = el("button", "btn btn-principal", "Valider");
    valBtn.type = "button";
    valBtn.disabled = true;

    if (ex.type === "qcm") {
      zone.classList.add("grille-2");
      let sel = null;
      ex.choix.forEach((txt, idx) => {
        const bt = el("button", "option-reponse", txt);
        bt.type = "button";
        bt.addEventListener("click", () => {
          if (repondu.has(ex.id)) return;
          sel = String(idx);
          zone.querySelectorAll(".option-reponse").forEach((x) => x.classList.remove("selectionnee"));
          bt.classList.add("selectionnee");
          valBtn.disabled = false;
        });
        zone.appendChild(bt);
      });
      lireValeur = () => sel;
    } else if (ex.type === "vrai_faux") {
      zone.classList.add("grille-2");
      let sel = null;
      ["vrai", "faux"].forEach((v) => {
        const bt = el("button", "option-reponse", v === "vrai" ? "Vrai" : "Faux");
        bt.type = "button";
        bt.addEventListener("click", () => {
          if (repondu.has(ex.id)) return;
          sel = v;
          zone.querySelectorAll(".option-reponse").forEach((x) => x.classList.remove("selectionnee"));
          bt.classList.add("selectionnee");
          valBtn.disabled = false;
        });
        zone.appendChild(bt);
      });
      lireValeur = () => sel;
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

    function valider() {
      if (repondu.has(ex.id)) return;
      const valeur = lireValeur();
      if (valeur === null || valeur === undefined) return;
      const correct = estReponseCorrecte(ex, valeur);
      repondu.add(ex.id);
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

      if (correct) mascotteReagitBonneReponse(ex.matiere, ex.difficulte);
      else mascotteReagitMauvaiseReponse(ex.matiere);

      majProgression();
    }
    valBtn.addEventListener("click", valider);

    const actions = el("div", "actions-question");
    actions.append(indiceBtn, valBtn);
    wrap.append(actions, indiceP, corr);
    return wrap;
  }

  /* ------------------------- Progression / fin ------------------------- */

  function majProgression() {
    const n = repondu.size;
    const total = etat.session.length;

    const cpt = document.getElementById("compteur-question");
    if (cpt) cpt.textContent = `${n} / ${total} répondu${n > 1 ? "s" : ""}`;

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
    window.finDeSession();
  }

  window.demarrerSession = demarrer;
})();
