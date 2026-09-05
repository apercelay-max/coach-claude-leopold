/* =========================================================================
   Claude — le bonhomme animé
   -------------------------------------------------------------------------
   Toutes les phrases (encouragements, blagues, accueil, fin de session) et
   les fonctions qui font réagir/parler la mascotte. Pas d'appel réseau :
   tout est écrit à la main, donc ça marche même sans connexion.
   ========================================================================= */

const PHRASES_ACCUEIL = [
  `Salut ${PRENOM} ! Prêt·e à faire chauffer les neurones ? 🧠🔥`,
  "Alors, on attaque quoi aujourd'hui ?",
  "Je suis Claude, ton assistant de révisions officiel — et ton fan numéro 1, officieusement.",
  "Debout champion ! Les fractions ne vont pas se réviser toutes seules.",
  "Prêt·e à devenir la terreur des évaluations de 5ème ?",
];

/*
 * Réactions "pertinentes" : plutôt que de piocher au hasard dans une seule
 * grande liste générique, Claude choisit dans un mélange de phrases
 * spécifiques à la matière du moment + un fond commun de phrases
 * génériques — et pioche en plus dans un petit bonus réservé aux questions
 * difficiles (difficulte >= 2) réussies, pour que le niveau de compliment
 * reste calibré sur le niveau réel de la question (pas de superlatifs sur
 * un exercice facile). Tout reste 100 % local, aucun appel réseau.
 */

const PHRASES_CORRECT_GENERIQUES = [
  "Nickel ! Si les bonnes réponses étaient des étoiles, tu serais en train de fonder ta galaxie.",
  "Pile poil ! Je note ça dans mon carnet « Léopold est un génie », page 47.",
  "Et hop, une de plus ! Tu collectionnes les bonnes réponses comme d'autres les cartes.",
  "Dans le mille ! Ton cerveau mérite une petite pause... mais juste une petite, hein 😏",
  `Bravo ${PRENOM} ! C'est le genre de réponse qui donne des frissons à un robot comme moi.`,
  "Officiellement, t'es en feu 🔥 aujourd'hui. Quelqu'un a un extincteur ?",
];

const PHRASES_CORRECT_PAR_MATIERE = {
  maths: [
    "Boom 💥 en plein dans le mille ! Pythagore aurait applaudi.",
    "Exact ! Tes neurones calculent plus vite qu'une calculatrice, et avec plus de style.",
    "Précis, net, sans bavure. T'es en train de devenir dangereux en maths.",
    "Nickel ! Cette réponse, je l'encadre et je l'accroche au mur.",
  ],
  espagnol: [
    "¡Perfecto! Ton espagnol devient redoutable.",
    "Exact ! Bientôt tu discutes avec Cristóbal sans souci.",
    "¡Muy bien! Cette réponse, hispanophone validée.",
  ],
  anglais: [
    "Well done! Ton anglais devient redoutable.",
    "Exact ! Bientôt tu corrigeras mes fautes en anglais.",
    "Nice one! Cette réponse, native speaker validée.",
  ],
};

const PHRASES_CORRECT_DIFFICILE = [
  "Alors LÀ, chapeau. C'était une question corsée, et tu l'as eue sans trembler.",
  "Sérieusement impressionnant — ce niveau de question, ce n'est pas donné à tout le monde.",
  "Tu viens de battre une question difficile. Je note ça dans les annales.",
];

const PHRASES_ENCOURAGEMENT_GENERIQUES = [
  "Ce n'est pas ça, mais regarde l'explication : après ça, cette question n'aura plus de secret pour toi.",
  "Pas grave du tout ! Même les meilleurs joueurs ratent des tirs — toi, tu progresses à chaque essai.",
  "Loupé, mais je crois en toi à 100 %, et je ne me trompe jamais sur ce genre de choses (enfin, presque).",
  "Aïe, non — mais l'important c'est d'avoir osé. Moi j'appelle ça du courage.",
  "Ce n'était pas la bonne réponse... mais c'était sûrement la plus créative que j'ai vue aujourd'hui 😄",
];

const PHRASES_ENCOURAGEMENT_PAR_MATIERE = {
  maths: [
    "Presque ! Ce genre de calcul joue souvent ce genre de tour — regarde l'explication, ça va cliquer.",
    "Raté de peu. En maths, une petite règle mal appliquée peut tout faire basculer : on la retient et on repart.",
    "Pas cette fois, mais ton raisonnement n'était pas loin. On ajuste et on retente.",
  ],
  espagnol: [
    "No pasa nada — l'espagnol adore ses petits pièges, celui-là en fait partie.",
    "Presque ! Une conjugaison a dû te jouer un tour. On regarde ensemble.",
    "Raté, mais c'est le genre de piège qui, une fois vu, ne te reprend plus jamais.",
  ],
  anglais: [
    "Not quite, mais l'anglais adore ses irrégularités — celle-ci en fait partie, on la retient.",
    "Presque ! Un petit mot piège, ça arrive même aux bilingues distraits.",
  ],
};

const PHRASES_BLAGUES = [
  "Que dit un 8 à un 0 ? Belle ceinture ! 😄",
  "Pourquoi le livre de maths est triste ? Parce qu'il a trop de problèmes. 📘",
  "Qu'est-ce qu'un synonyme ? Un mot qu'on utilise quand on ne sait pas écrire l'autre. ✍️",
  "Quel est le comble pour un prof de maths ? Ne pas avoir de solution. ➗",
  "Pourquoi les poissons détestent l'ordinateur ? À cause du net. 🐟",
  "Qu'est-ce qui est jaune et qui attend ? Jonathan. 😄",
  "Tu savais que je ne dors jamais ? Remarque, toi non plus la veille d'un contrôle...",
  "Moi aussi j'ai des devoirs, tu sais : devenir un peu plus drôle chaque jour.",
  "On me demande souvent si je préfère les maths ou le français... je réponds toujours « oui ».",
  "Pourquoi la maîtresse porte des lunettes de soleil ? Parce que ses élèves brillent. ☀️",
];

const PHRASES_FIN_HAUT = [
  "Franchement... bravo. T'as tout écrasé, il ne me reste plus qu'à applaudir 👏",
  "Score énorme ! Je crois qu'on va devoir t'inventer un niveau encore plus difficile.",
  "Alors ça, c'est une performance. Je suis officiellement impressionné.",
];

const PHRASES_FIN_MOYEN = [
  "Pas mal du tout ! Encore un peu d'entraînement et ce sera parfait.",
  "Du solide ! Il reste quelques détails à peaufiner, mais on tient le bon bout.",
  "Une bonne session ! On va vite transformer ces petites erreurs en points forts.",
];

const PHRASES_FIN_BAS = [
  "On note les points à revoir, et on revient plus fort — je crois en toi à 100 %.",
  "Séance un peu corsée ! Mais c'est justement pour ça qu'on s'entraîne. On y retourne ?",
  "Pas ta meilleure série, mais chaque session compte. Demain, on fait encore mieux.",
];

function choisirAuHasard(liste) {
  return liste[Math.floor(Math.random() * liste.length)];
}

/**
 * Fait parler la mascotte : met à jour la bulle de texte et rejoue
 * l'animation d'apparition (en retirant/remettant l'élément).
 */
function mascotteDit(texte) {
  const bulle = document.getElementById("bulle-parole");
  const texteEl = document.getElementById("texte-mascotte");
  if (!texteEl || !bulle) return;
  texteEl.textContent = texte;
  bulle.style.animation = "none";
  // Force le recalcul de style pour pouvoir relancer l'animation CSS.
  // eslint-disable-next-line no-unused-expressions
  bulle.offsetHeight;
  bulle.style.animation = "";
}

function declencherReaction(classe, dureeMs) {
  const widget = document.getElementById("mascotte-widget");
  if (!widget) return;
  widget.classList.remove("content", "encourage", "blague");
  // eslint-disable-next-line no-unused-expressions
  widget.offsetHeight;
  widget.classList.add(classe);
  setTimeout(() => widget.classList.remove(classe), dureeMs);
}

function mascotteReagitBonneReponse(matiereCode, difficulte) {
  let pool = [
    ...PHRASES_CORRECT_GENERIQUES,
    ...(PHRASES_CORRECT_PAR_MATIERE[matiereCode] || []),
  ];
  if (difficulte >= 2) pool = pool.concat(PHRASES_CORRECT_DIFFICILE);
  mascotteDit(choisirAuHasard(pool));
  declencherReaction("content", 750);
  lancerConfettis();
}

function mascotteReagitMauvaiseReponse(matiereCode) {
  const pool = [
    ...PHRASES_ENCOURAGEMENT_GENERIQUES,
    ...(PHRASES_ENCOURAGEMENT_PAR_MATIERE[matiereCode] || []),
  ];
  mascotteDit(choisirAuHasard(pool));
  declencherReaction("encourage", 600);
}

function mascotteAccueille() {
  mascotteDit(choisirAuHasard(PHRASES_ACCUEIL));
}

function mascotteRaconteUneBlague() {
  mascotteDit(choisirAuHasard(PHRASES_BLAGUES));
  declencherReaction("blague", 450);
}

function phraseFinDeSession(pourcentage) {
  if (pourcentage >= 80) return choisirAuHasard(PHRASES_FIN_HAUT);
  if (pourcentage >= 50) return choisirAuHasard(PHRASES_FIN_MOYEN);
  return choisirAuHasard(PHRASES_FIN_BAS);
}

const COULEURS_CONFETTI = ["#D97757", "#7C6FE0", "#2F9E6E", "#D9548F", "#C98A1F", "#4C7CE0"];

function lancerConfettis() {
  const conteneur = document.getElementById("confettis");
  if (!conteneur) return;
  const nombre = 24;
  for (let i = 0; i < nombre; i++) {
    const morceau = document.createElement("div");
    morceau.className = "confetti-piece";
    morceau.style.left = Math.random() * 100 + "vw";
    morceau.style.background = COULEURS_CONFETTI[i % COULEURS_CONFETTI.length];
    morceau.style.animationDelay = Math.random() * 0.3 + "s";
    morceau.style.animationDuration = 1.1 + Math.random() * 0.6 + "s";
    conteneur.appendChild(morceau);
    setTimeout(() => morceau.remove(), 2200);
  }
}

/** Câble le clic sur la mascotte pour déclencher une blague à la demande. */
function initMascotte() {
  const bouton = document.getElementById("mascotte");
  if (bouton) {
    bouton.addEventListener("click", mascotteRaconteUneBlague);
  }
}
