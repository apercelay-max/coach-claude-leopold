/* =========================================================================
   Claude — logique de l'application
   -------------------------------------------------------------------------
   Application de révision uniquement (pas d'évaluation, pas de suivi de
   progrès) : navigation entre écrans, moteur d'exercices, correction
   immédiate, et envoi d'un résumé de fin de session par email. Aucune
   donnée ne quitte l'appareil, à part le brouillon d'email ouvert dans
   Gmail à la demande de Léopold.
   ========================================================================= */

const COULEURS_MATIERE = {
  bleu: { fond: "var(--bleu-clair)", texte: "var(--bleu)" },
  violet: { fond: "var(--violet-clair)", texte: "var(--violet)" },
  indigo: { fond: "var(--indigo-clair)", texte: "var(--indigo)" },
};

const ECRANS = ["accueil", "matieres", "exercice", "resultats"];

let etat = {
  matiereCode: null,
  session: [],
  index: 0,
  reponseActuelle: null,
  aRepondu: false,
  resultatsSession: [], // [{ exercice, reponseDonnee, correct }]
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

/* ------------------------------- Navigation ------------------------------- */

function afficherEcran(nom) {
  ECRANS.forEach((e) => {
    document.getElementById(`ecran-${e}`).classList.toggle("hidden", e !== nom);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (nom === "accueil") mascotteAccueille();
}

/* ------------------------------- Écran matières ------------------------------- */

function allerVersMatieres() {
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
    carte.addEventListener("click", () => demarrerSession(matiere.code));
    grille.appendChild(carte);
  });

  afficherEcran("matieres");
}

/* ------------------------------- Session d'exercices ------------------------------- */

function demarrerSession(matiereCode) {
  etat.matiereCode = matiereCode;
  etat.session = melanger(getExercicesParMatiere(matiereCode));
  etat.index = 0;
  etat.resultatsSession = [];

  afficherEcran("exercice");
  afficherQuestion();
}

function rejouer() {
  demarrerSession(etat.matiereCode);
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
  document.getElementById("btn-indice").hidden = !exercice.indice;

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

  document.querySelectorAll("#zone-reponse .option-reponse").forEach((b) => (b.disabled = true));
  const champTexte = document.querySelector("#zone-reponse .champ-texte");
  if (champTexte) champTexte.disabled = true;

  document.getElementById("btn-indice").hidden = true;
  document.getElementById("zone-indice").hidden = true;
  document.getElementById("btn-valider").hidden = true;
  document.getElementById("btn-suivant").classList.remove("hidden");

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

  if (correct) mascotteReagitBonneReponse(exercice.matiere, exercice.difficulte);
  else mascotteReagitMauvaiseReponse(exercice.matiere);
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

  document.getElementById("resultat-emoji").textContent = pourcentage >= 80 ? "🏆" : pourcentage >= 50 ? "👍" : "💪";
  document.getElementById("resultat-titre").textContent = "Séance terminée !";
  document.getElementById("resultat-score").textContent =
    `${score} bonne${score > 1 ? "s" : ""} réponse${score > 1 ? "s" : ""} sur ${total} (${pourcentage} %)`;

  const recap = document.getElementById("recap-session");
  recap.innerHTML = "";
  const rates = etat.resultatsSession.filter((r) => !r.correct);
  if (rates.length > 0) {
    const intro = document.createElement("p");
    intro.className = "recap-intro";
    intro.textContent = "Points à revoir :";
    recap.appendChild(intro);
    rates.forEach((r) => {
      const item = document.createElement("div");
      item.className = "recap-item incorrecte";
      const q = document.createElement("p");
      q.className = "recap-question";
      q.textContent = "✏️ " + r.exercice.question;
      const e = document.createElement("p");
      e.className = "recap-explication";
      e.textContent = r.exercice.explication;
      item.append(q, e);
      recap.appendChild(item);
    });
  } else {
    const bravo = document.createElement("p");
    bravo.className = "recap-intro";
    bravo.textContent = "🎉 Toutes les réponses étaient bonnes !";
    recap.appendChild(bravo);
  }

  mascotteDit(phraseFinDeSession(pourcentage));
  if (pourcentage >= 80) lancerConfettis();

  document.getElementById("note-email").hidden = true;
  preremplirChampEmail();
  afficherEcran("resultats");
}

/* ------------------------------- Résumé par email ------------------------------- */

const CLE_EMAIL_PARENT = "coach-claude-leopold:email-parent";

function formaterDateHeure() {
  const maintenant = new Date();
  const date = maintenant.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const heure = maintenant.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `${date} à ${heure}`;
}

/** Pré-remplit le champ email avec la dernière adresse utilisée sur ce navigateur (s'il y en a une). */
function preremplirChampEmail() {
  const champ = document.getElementById("champ-email-parent");
  let connue = null;
  try {
    connue = localStorage.getItem(CLE_EMAIL_PARENT);
  } catch (erreur) {
    // ignore
  }
  if (connue) champ.value = connue;
}

function afficherNoteEmail(texte) {
  const note = document.getElementById("note-email");
  note.textContent = texte;
  note.hidden = false;
}

function envoyerResumeParEmail() {
  const champ = document.getElementById("champ-email-parent");
  const destinataire = champ.value.trim();
  if (destinataire === "" || !destinataire.includes("@")) {
    afficherNoteEmail("⚠️ Entre une adresse email valide avant d'envoyer.");
    champ.focus();
    return;
  }
  document.getElementById("note-email").hidden = true;
  try {
    localStorage.setItem(CLE_EMAIL_PARENT, destinataire);
  } catch (erreur) {
    // Stockage indisponible (navigation privée...) : tant pis, le champ sera vide la prochaine fois.
  }

  const matiere = getMatiere(etat.matiereCode);
  const total = etat.resultatsSession.length;
  const score = etat.resultatsSession.filter((r) => r.correct).length;
  const pourcentage = Math.round((score / total) * 100);
  const chapitres = [...new Set(etat.resultatsSession.map((r) => r.exercice.chapitre))];
  const rates = etat.resultatsSession.filter((r) => !r.correct);

  let corps = `Bonjour,\n\n${PRENOM} vient de terminer une session de révision.\n\n`;
  corps += `Matière : ${matiere.emoji} ${matiere.nom}\n`;
  corps += `Chapitre(s) : ${chapitres.join(", ")}\n`;
  corps += `Résultat : ${score}/${total} bonnes réponses (${pourcentage} %)\n`;
  corps += `${formaterDateHeure()}\n`;

  if (rates.length > 0) {
    corps += `\nPoints à retravailler ensemble :\n`;
    rates.slice(0, 6).forEach((r) => {
      const enonce = r.exercice.question.length > 100 ? r.exercice.question.slice(0, 100) + "…" : r.exercice.question;
      corps += `- ${enonce}\n`;
    });
    if (rates.length > 6) corps += `- … et ${rates.length - 6} autre(s).\n`;
  } else {
    corps += `\nToutes les réponses étaient correctes, bravo !\n`;
  }

  corps += `\nGénéré automatiquement par l'appli de révision de ${PRENOM}.`;

  const sujet = `Résumé de révision de ${PRENOM} – ${matiere.nom}`;
  const url =
    `https://mail.google.com/mail/?view=cm&fs=1` +
    `&to=${encodeURIComponent(destinataire)}` +
    `&su=${encodeURIComponent(sujet)}` +
    `&body=${encodeURIComponent(corps)}`;
  window.open(url, "_blank", "noopener");
}

/* ------------------------------- Initialisation ------------------------------- */

function initEvenements() {
  document.getElementById("btn-logo").addEventListener("click", () => afficherEcran("accueil"));
  document.querySelectorAll('[data-retour="accueil"]').forEach((b) =>
    b.addEventListener("click", () => afficherEcran("accueil"))
  );
  document.getElementById("btn-reviser").addEventListener("click", allerVersMatieres);
  document.getElementById("btn-indice").addEventListener("click", afficherIndice);
  document.getElementById("btn-valider").addEventListener("click", valider);
  document.getElementById("btn-suivant").addEventListener("click", suivant);
  document.getElementById("btn-rejouer").addEventListener("click", rejouer);
  document.getElementById("btn-envoyer-email").addEventListener("click", envoyerResumeParEmail);
}

document.addEventListener("DOMContentLoaded", () => {
  initMascotte();
  initEvenements();
  mascotteAccueille();
  afficherEcran("accueil");
});
