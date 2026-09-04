/* =========================================================================
   Coach Claude — logique de l'application
   -------------------------------------------------------------------------
   Navigation entre écrans, moteur d'exercices (révision / évaluation),
   correction, progression (XP, niveaux, étoiles, série). Tout en
   localStorage : aucune donnée ne quitte l'appareil.
   ========================================================================= */

const COULEURS_MATIERE = {
  bleu: { fond: "var(--bleu-clair)", texte: "var(--bleu)" },
  rose: { fond: "var(--rose-clair)", texte: "var(--rose)" },
  ambre: { fond: "var(--ambre-clair)", texte: "var(--ambre)" },
  emeraude: { fond: "var(--emeraude-clair)", texte: "var(--emeraude)" },
  indigo: { fond: "var(--indigo-clair)", texte: "var(--indigo)" },
};

const ECRANS = ["accueil", "matieres", "exercice", "resultats", "progres"];

const CLE_STOCKAGE = "coach-claude-leopold:progression";

let etat = {
  mode: null, // "revision" | "evaluation"
  matiereCode: null,
  session: [],
  index: 0,
  reponseActuelle: null,
  aRepondu: false,
  resultatsSession: [],
  xpSession: 0,
};

/* ------------------------------- Utilitaires ------------------------------- */

function melanger(tableau) {
  const copie = [...tableau];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

function normaliserTexte(texte) {
  return texte
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), ""); // retire les accents (é, à, ç...) pour une comparaison souple
}

function estReponseCorrecte(exercice, reponseDonnee) {
  if (reponseDonnee === null || reponseDonnee === undefined) return false;
  switch (exercice.type) {
    case "qcm":
      return Number(reponseDonnee) === exercice.bonne;
    case "vrai_faux":
      return (reponseDonnee === "vrai") === exercice.reponse;
    case "reponse_courte":
      return exercice.reponses.some((r) => normaliserTexte(r) === normaliserTexte(reponseDonnee));
    default:
      return false;
  }
}

/* ------------------------------- Progression ------------------------------- */

function progressionParDefaut() {
  return { xpTotal: 0, matieres: {}, derniereVisite: null, serie: 0 };
}

function chargerProgression() {
  try {
    const brut = localStorage.getItem(CLE_STOCKAGE);
    if (!brut) return progressionParDefaut();
    const donnees = JSON.parse(brut);
    return { ...progressionParDefaut(), ...donnees, matieres: donnees.matieres || {} };
  } catch (erreur) {
    return progressionParDefaut();
  }
}

function sauvegarderProgression(progression) {
  try {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(progression));
  } catch (erreur) {
    // Stockage indisponible (navigation privée, quota...) : tant pis, on continue sans persister.
  }
}

function mettreAJourSerie(progression) {
  const aujourdHui = new Date().toISOString().slice(0, 10);
  if (progression.derniereVisite === aujourdHui) return progression;
  const hier = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  progression.serie = progression.derniereVisite === hier ? progression.serie + 1 : 1;
  progression.derniereVisite = aujourdHui;
  sauvegarderProgression(progression);
  return progression;
}

const PALIERS_NIVEAU = [
  { seuil: 1, titre: "Apprenti Réviseur" },
  { seuil: 3, titre: "Chercheur de Savoir" },
  { seuil: 5, titre: "Stratège des Révisions" },
  { seuil: 8, titre: "Maître Réviseur" },
  { seuil: 12, titre: "Expert Suprême" },
  { seuil: 18, titre: "Légende du Collège" },
];

function calculerNiveau(xpTotal) {
  return Math.floor(xpTotal / 100) + 1;
}

function titreNiveau(niveau) {
  let titre = PALIERS_NIVEAU[0].titre;
  for (const palier of PALIERS_NIVEAU) {
    if (niveau >= palier.seuil) titre = palier.titre;
  }
  return titre;
}

function majEnTeteStats(progression) {
  const zone = document.getElementById("entete-stats");
  if (!progression || progression.xpTotal <= 0) {
    zone.hidden = true;
    return;
  }
  const niveau = calculerNiveau(progression.xpTotal);
  document.getElementById("pastille-niveau").textContent = `Niveau ${niveau}`;
  document.getElementById("pastille-xp").textContent = `${progression.xpTotal} XP`;
  zone.hidden = false;
}

/* ------------------------------- Navigation ------------------------------- */

function afficherEcran(nom) {
  ECRANS.forEach((e) => {
    document.getElementById(`ecran-${e}`).classList.toggle("hidden", e !== nom);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (nom === "accueil") mascotteAccueille();
}

/* ------------------------------- Écran matières ------------------------------- */

function allerVersMatieres(mode) {
  etat.mode = mode;
  document.getElementById("titre-matieres").textContent =
    mode === "evaluation" ? "Choisis une matière pour l'évaluation" : "Choisis une matière à réviser";

  const grille = document.getElementById("grille-matieres");
  grille.innerHTML = "";

  MATIERES.forEach((matiere) => {
    const nb = getExercicesParMatiere(matiere.code).length;
    const couleurs = COULEURS_MATIERE[matiere.couleur];

    const carte = document.createElement("button");
    carte.type = "button";
    carte.className = "carte-matiere";
    carte.style.background = couleurs.fond;
    carte.style.color = couleurs.texte;

    const emoji = document.createElement("span");
    emoji.className = "carte-matiere-emoji";
    emoji.textContent = matiere.emoji;

    const nomEl = document.createElement("span");
    nomEl.className = "carte-matiere-nom";
    nomEl.textContent = matiere.nom;

    const meta = document.createElement("span");
    meta.className = "carte-matiere-meta";
    meta.textContent = `${nb} exercice${nb > 1 ? "s" : ""}`;

    carte.append(emoji, nomEl, meta);
    carte.addEventListener("click", () => demarrerSession(mode, matiere.code));
    grille.appendChild(carte);
  });

  afficherEcran("matieres");
}

/* ------------------------------- Session d'exercices ------------------------------- */

function demarrerSession(mode, matiereCode) {
  etat.mode = mode;
  etat.matiereCode = matiereCode;
  etat.session = melanger(getExercicesParMatiere(matiereCode));
  etat.index = 0;
  etat.resultatsSession = [];
  etat.xpSession = 0;

  const badgeMode = document.getElementById("badge-mode");
  if (mode === "evaluation") {
    badgeMode.textContent = "📝 Évaluation";
    badgeMode.style.background = "var(--rose-clair)";
    badgeMode.style.color = "var(--rose)";
  } else {
    badgeMode.textContent = "📘 Révision";
    badgeMode.style.background = "var(--violet-clair)";
    badgeMode.style.color = "var(--violet)";
  }

  afficherEcran("exercice");
  afficherQuestion();
}

function rejouer() {
  demarrerSession(etat.mode, etat.matiereCode);
}

function majEnTeteExercice() {
  document.getElementById("compteur-question").textContent = `Question ${etat.index + 1} / ${etat.session.length}`;
  const pourcentage = (etat.index / etat.session.length) * 100;
  document.getElementById("barre-progression-remplissage").style.width = pourcentage + "%";
}

function afficherQuestion() {
  const exercice = etat.session[etat.index];
  etat.reponseActuelle = null;
  etat.aRepondu = false;

  const matiere = getMatiere(exercice.matiere);
  const couleurs = COULEURS_MATIERE[matiere.couleur];
  const badgeMatiere = document.getElementById("badge-matiere-question");
  badgeMatiere.textContent = `${matiere.emoji} ${matiere.nom} · ${exercice.chapitre}`;
  badgeMatiere.style.background = couleurs.fond;
  badgeMatiere.style.color = couleurs.texte;

  document.getElementById("enonce-question").textContent = exercice.question;

  const zone = document.getElementById("zone-reponse");
  zone.innerHTML = "";
  zone.classList.remove("grille-2");

  if (exercice.type === "qcm") {
    zone.classList.add("grille-2");
    exercice.choix.forEach((texteChoix, i) => {
      const bouton = document.createElement("button");
      bouton.type = "button";
      bouton.className = "option-reponse";
      bouton.textContent = texteChoix;
      bouton.addEventListener("click", () => selectionnerReponse(String(i), bouton));
      zone.appendChild(bouton);
    });
  } else if (exercice.type === "vrai_faux") {
    zone.classList.add("grille-2");
    ["vrai", "faux"].forEach((valeur) => {
      const bouton = document.createElement("button");
      bouton.type = "button";
      bouton.className = "option-reponse";
      bouton.textContent = valeur === "vrai" ? "Vrai" : "Faux";
      bouton.addEventListener("click", () => selectionnerReponse(valeur, bouton));
      zone.appendChild(bouton);
    });
  } else if (exercice.type === "reponse_courte") {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "champ-texte";
    input.placeholder = "Ta réponse…";
    input.addEventListener("input", () => {
      etat.reponseActuelle = input.value.trim() === "" ? null : input.value;
      document.getElementById("btn-valider").disabled = etat.reponseActuelle === null;
    });
    input.addEventListener("keydown", (evenement) => {
      if (evenement.key === "Enter" && !document.getElementById("btn-valider").disabled) {
        valider();
      }
    });
    zone.appendChild(input);
  }

  document.getElementById("carte-correction").classList.add("hidden");
  document.getElementById("zone-indice").hidden = true;
  document.getElementById("btn-valider").hidden = false;
  document.getElementById("btn-valider").disabled = true;
  document.getElementById("btn-suivant").classList.add("hidden");
  document.getElementById("btn-indice").hidden = !(exercice.indice && etat.mode === "revision");

  majEnTeteExercice();
}

function selectionnerReponse(valeur, boutonClique) {
  if (etat.aRepondu) return;
  etat.reponseActuelle = valeur;
  document.querySelectorAll("#zone-reponse .option-reponse").forEach((b) => b.classList.remove("selectionnee"));
  boutonClique.classList.add("selectionnee");
  document.getElementById("btn-valider").disabled = false;
}

function afficherIndice() {
  const exercice = etat.session[etat.index];
  if (!exercice.indice) return;
  const zone = document.getElementById("zone-indice");
  zone.textContent = `💡 ${exercice.indice}`;
  zone.hidden = false;
}

function valider() {
  if (etat.aRepondu || etat.reponseActuelle === null) return;
  const exercice = etat.session[etat.index];
  const correct = estReponseCorrecte(exercice, etat.reponseActuelle);
  etat.aRepondu = true;
  etat.resultatsSession.push({ exercice, reponseDonnee: etat.reponseActuelle, correct });
  if (correct) etat.xpSession += etat.mode === "evaluation" ? 15 : 10;

  document.querySelectorAll("#zone-reponse .option-reponse").forEach((b) => (b.disabled = true));
  const champTexte = document.querySelector("#zone-reponse .champ-texte");
  if (champTexte) champTexte.disabled = true;

  document.getElementById("btn-indice").hidden = true;
  document.getElementById("zone-indice").hidden = true;
  document.getElementById("btn-valider").hidden = true;
  document.getElementById("btn-suivant").classList.remove("hidden");

  if (etat.mode === "revision") {
    if (exercice.type === "qcm") {
      document.querySelectorAll("#zone-reponse .option-reponse").forEach((b, i) => {
        if (i === exercice.bonne) b.classList.add("bonne-reponse");
        else if (String(i) === etat.reponseActuelle) b.classList.add("mauvaise-reponse");
      });
    } else if (exercice.type === "vrai_faux") {
      const valeurCorrecte = exercice.reponse ? "vrai" : "faux";
      document.querySelectorAll("#zone-reponse .option-reponse").forEach((b) => {
        const valeur = b.textContent.toLowerCase();
        if (valeur === valeurCorrecte) b.classList.add("bonne-reponse");
        else if (valeur === etat.reponseActuelle) b.classList.add("mauvaise-reponse");
      });
    }

    const carte = document.getElementById("carte-correction");
    carte.classList.remove("hidden", "correcte", "incorrecte");
    carte.classList.add(correct ? "correcte" : "incorrecte");
    document.getElementById("correction-verdict").textContent = correct ? "✅ Bonne réponse !" : "✏️ Pas tout à fait…";
    document.getElementById("correction-explication").textContent = exercice.explication;

    if (correct) mascotteReagitBonneReponse();
    else mascotteReagitMauvaiseReponse();
  } else {
    mascotteAccuseReceptionEvaluation();
  }
}

function suivant() {
  etat.index++;
  if (etat.index >= etat.session.length) {
    finDeSession();
  } else {
    afficherQuestion();
  }
}

function finDeSession() {
  const total = etat.session.length;
  const score = etat.resultatsSession.filter((r) => r.correct).length;
  const pourcentage = Math.round((score / total) * 100);

  const progression = chargerProgression();
  progression.xpTotal += etat.xpSession;

  if (!progression.matieres[etat.matiereCode]) {
    progression.matieres[etat.matiereCode] = {
      meilleureEvaluation: 0,
      sessionsRevision: 0,
      sessionsEvaluation: 0,
    };
  }
  const statsMatiere = progression.matieres[etat.matiereCode];
  if (etat.mode === "evaluation") {
    statsMatiere.meilleureEvaluation = Math.max(statsMatiere.meilleureEvaluation, pourcentage);
    statsMatiere.sessionsEvaluation = (statsMatiere.sessionsEvaluation || 0) + 1;
  } else {
    statsMatiere.sessionsRevision = (statsMatiere.sessionsRevision || 0) + 1;
  }

  sauvegarderProgression(progression);
  majEnTeteStats(progression);

  document.getElementById("resultat-emoji").textContent = pourcentage >= 80 ? "🏆" : pourcentage >= 50 ? "👍" : "💪";
  document.getElementById("resultat-titre").textContent =
    etat.mode === "evaluation" ? "Évaluation terminée !" : "Séance terminée !";
  document.getElementById("resultat-score").textContent =
    `${score} bonne${score > 1 ? "s" : ""} réponse${score > 1 ? "s" : ""} sur ${total} (${pourcentage} %)`;

  let texteXp = `+${etat.xpSession} XP gagnés`;
  if (etat.mode === "evaluation") {
    const note = Math.round(((score / total) * 20) * 2) / 2;
    texteXp += ` · Note : ${note}/20`;
  }
  document.getElementById("resultat-xp").textContent = texteXp;

  const recap = document.getElementById("recap-evaluation");
  recap.innerHTML = "";
  if (etat.mode === "evaluation") {
    recap.classList.remove("hidden");
    etat.resultatsSession.forEach((r) => {
      const item = document.createElement("div");
      item.className = "recap-item " + (r.correct ? "correcte" : "incorrecte");
      const q = document.createElement("p");
      q.className = "recap-question";
      q.textContent = (r.correct ? "✅ " : "✏️ ") + r.exercice.question;
      const e = document.createElement("p");
      e.className = "recap-explication";
      e.textContent = r.exercice.explication;
      item.append(q, e);
      recap.appendChild(item);
    });
  } else {
    recap.classList.add("hidden");
  }

  mascotteDit(phraseFinDeSession(pourcentage));
  if (pourcentage >= 80) lancerConfettis();

  afficherEcran("resultats");
}

/* ------------------------------- Écran progrès ------------------------------- */

function afficherEcranProgres() {
  const progression = chargerProgression();
  const niveau = calculerNiveau(progression.xpTotal);

  document.getElementById("progres-titre-niveau").textContent = `Niveau ${niveau} · ${titreNiveau(niveau)}`;
  const xpDansNiveau = progression.xpTotal % 100;
  document.getElementById("progres-barre-xp").style.width = xpDansNiveau + "%";
  document.getElementById("progres-detail-xp").textContent =
    `${progression.xpTotal} XP au total · encore ${100 - xpDansNiveau} XP avant le niveau ${niveau + 1}`;

  const carteSerie = document.getElementById("carte-serie");
  carteSerie.textContent =
    progression.serie >= 2
      ? `🔥 ${progression.serie} jours de suite, ${PRENOM} est en feu !`
      : "✨ Reviens demain pour démarrer une série de jours !";

  const liste = document.getElementById("liste-matieres-progres");
  liste.innerHTML = "";
  MATIERES.forEach((matiere) => {
    const stats = progression.matieres[matiere.code];
    const meilleure = stats ? stats.meilleureEvaluation : 0;
    const etoiles = meilleure >= 90 ? 3 : meilleure >= 70 ? 2 : meilleure >= 40 ? 1 : 0;

    const ligne = document.createElement("div");
    ligne.className = "ligne-matiere-progres";

    const tete = document.createElement("div");
    tete.className = "ligne-matiere-progres-tete";
    const nomSpan = document.createElement("span");
    nomSpan.textContent = `${matiere.emoji} ${matiere.nom}`;
    const etoilesSpan = document.createElement("span");
    etoilesSpan.className = "etoiles";
    etoilesSpan.textContent = "★".repeat(etoiles) + "☆".repeat(3 - etoiles);
    tete.append(nomSpan, etoilesSpan);

    const detail = document.createElement("p");
    detail.className = "niveau-detail";
    detail.textContent =
      stats && stats.sessionsEvaluation
        ? `Meilleure évaluation : ${meilleure} %`
        : "Pas encore d'évaluation passée dans cette matière.";

    ligne.append(tete, detail);
    liste.appendChild(ligne);
  });

  afficherEcran("progres");
}

/* ------------------------------- Initialisation ------------------------------- */

function initEvenements() {
  document.getElementById("btn-logo").addEventListener("click", () => afficherEcran("accueil"));
  document.querySelectorAll('[data-retour="accueil"]').forEach((b) =>
    b.addEventListener("click", () => afficherEcran("accueil"))
  );
  document.querySelectorAll(".carte-action[data-mode]").forEach((b) =>
    b.addEventListener("click", () => allerVersMatieres(b.dataset.mode))
  );
  document.getElementById("btn-voir-progres").addEventListener("click", afficherEcranProgres);
  document.getElementById("btn-indice").addEventListener("click", afficherIndice);
  document.getElementById("btn-valider").addEventListener("click", valider);
  document.getElementById("btn-suivant").addEventListener("click", suivant);
  document.getElementById("btn-rejouer").addEventListener("click", rejouer);
}

document.addEventListener("DOMContentLoaded", () => {
  initMascotte();
  initEvenements();
  let progression = chargerProgression();
  progression = mettreAJourSerie(progression);
  majEnTeteStats(progression);
  mascotteAccueille();
  afficherEcran("accueil");
});
