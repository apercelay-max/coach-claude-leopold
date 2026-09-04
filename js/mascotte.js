/* =========================================================================
   Coach Claude — le bonhomme animé
   -------------------------------------------------------------------------
   Toutes les phrases (encouragements, blagues, accueil, fin de session) et
   les fonctions qui font réagir/parler la mascotte. Pas d'appel réseau :
   tout est écrit à la main, donc ça marche même sans connexion.
   ========================================================================= */

const PHRASES_ACCUEIL = [
  `Salut ${PRENOM} ! Prêt·e à faire chauffer les neurones ? 🧠🔥`,
  "Alors, on attaque quoi aujourd'hui ?",
  "Je suis Coach Claude, ton assistant de révisions officiel — et ton fan numéro 1, officieusement.",
  "Debout champion ! Les fractions ne vont pas se réviser toutes seules.",
  "Prêt·e à devenir la terreur des évaluations de 5ème ?",
];

const PHRASES_CORRECT = [
  "Boom 💥 en plein dans le mille ! Même une calculatrice aurait été jalouse.",
  "Alors là... chapeau bas 🎩 ! T'as dégainé plus vite que ton ombre.",
  "Officiellement, t'es en feu 🔥 aujourd'hui. Quelqu'un a un extincteur ?",
  "Pile poil ! Je note ça dans mon carnet « Léopold est un génie », page 47.",
  "Impeccable ! À ce rythme, c'est moi qui vais devoir réviser pour te suivre.",
  "Et hop, une de plus ! Tu collectionnes les bonnes réponses comme d'autres les cartes.",
  "Nickel ! Si les bonnes réponses étaient des étoiles, tu serais en train de fonder ta galaxie.",
  "Parfait ! Franchement, je commence à me demander qui aide qui, là.",
  "Dans le mille ! Ton cerveau mérite une petite pause... mais juste une petite, hein 😏",
  `Bravo ${PRENOM} ! C'est le genre de réponse qui donne des frissons à un robot comme moi.`,
];

const PHRASES_ENCOURAGEMENT = [
  "Raté... mais version élégante ! On retente, le prochain est pour toi.",
  "Pas tout à fait — mais bon, même les meilleurs se plantent sur un exercice de temps en temps.",
  "Oups ! Ça arrive même aux meilleurs cerveaux — le mien inclus, parfois, chut 🤫",
  "Presque ! Il te manquait juste... un petit détail. Mais sinon, très bien tenté.",
  "Aïe, non — mais l'important c'est d'avoir osé. Moi j'appelle ça du courage.",
  "Manqué de peu ! Enfin... disons manqué, mais avec panache.",
  "Ce n'est pas ça, mais regarde l'explication : après ça, cette question n'aura plus de secret pour toi.",
  "Pas grave du tout ! Même les meilleurs joueurs ratent des tirs — toi, tu progresses à chaque essai.",
  "Loupé, mais je crois en toi à 100 %, et je ne me trompe jamais sur ce genre de choses (enfin, presque).",
  "Ce n'était pas la bonne réponse... mais c'était sûrement la plus créative que j'ai vue aujourd'hui 😄",
];

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

const PHRASES_EVALUATION_NEUTRE = [
  "Réponse enregistrée ✅ On garde ça pour la correction finale.",
  "Noté ! Question suivante...",
  "C'est dans la boîte. On continue, tu gères.",
  "Enregistré ! Silence radio jusqu'à la fin, comme dans un vrai contrôle.",
  "Réponse prise en compte. Concentre-toi, la suite arrive !",
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

function mascotteReagitBonneReponse() {
  mascotteDit(choisirAuHasard(PHRASES_CORRECT));
  declencherReaction("content", 750);
  lancerConfettis();
}

function mascotteReagitMauvaiseReponse() {
  mascotteDit(choisirAuHasard(PHRASES_ENCOURAGEMENT));
  declencherReaction("encourage", 600);
}

function mascotteAccuseReceptionEvaluation() {
  mascotteDit(choisirAuHasard(PHRASES_EVALUATION_NEUTRE));
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
