/* =========================================================================
   Coach Claude — données
   -------------------------------------------------------------------------
   Tout le contenu (matières + exercices) vit ici, en JS pur (pas de fetch
   JSON) pour que l'appli marche même ouverte directement en double-clic,
   sans serveur.

   Pour AJOUTER du contenu (ex. à partir des vrais devoirs de Léopold) :
   il suffit d'ajouter des objets au tableau EXERCICES ci-dessous, en
   suivant le même format. Rien d'autre à toucher.
   ========================================================================= */

const PRENOM = "Léopold";

// Une matière = { code, nom, emoji, couleur (voir COULEURS_MATIERE dans app.js) }
const MATIERES = [
  { code: "maths", nom: "Mathématiques", emoji: "➗", couleur: "bleu" },
  { code: "francais", nom: "Français", emoji: "📖", couleur: "rose" },
  { code: "histoire_geo", nom: "Histoire-Géographie", emoji: "🌍", couleur: "ambre" },
  { code: "sciences", nom: "Sciences", emoji: "🔬", couleur: "emeraude" },
  { code: "anglais", nom: "Anglais", emoji: "🇬🇧", couleur: "indigo" },
];

/**
 * Types d'exercices supportés :
 *  - "qcm"            : { choix: string[], bonne: index }
 *  - "vrai_faux"       : { reponse: true|false }
 *  - "reponse_courte"    : { reponses: string[] } (comparaison sans accents/casse)
 *
 * Champs communs : id, matiere, chapitre, difficulte (1-3), question, explication.
 * Contenu de démonstration niveau 5ème — à enrichir avec les vrais devoirs.
 */
const EXERCICES = [
  // ------------------------------- Maths -------------------------------
  {
    id: "maths-1", matiere: "maths", chapitre: "Nombres relatifs", difficulte: 2,
    type: "qcm", question: "Combien font (-5) + 8 ?",
    choix: ["-13", "3", "-3", "13"], bonne: 1,
    indice: "Sur la droite graduée, pars de -5 et avance de 8.",
    explication: "(-5) + 8 = 3 : en partant de -5, on avance de 8 vers la droite.",
  },
  {
    id: "maths-2", matiere: "maths", chapitre: "Nombres relatifs", difficulte: 2,
    type: "vrai_faux", question: "-7 est plus petit que -2.",
    reponse: true,
    indice: "Sur la droite graduée, plus on va vers la gauche, plus le nombre est petit.",
    explication: "Vrai : -7 est à gauche de -2 sur la droite graduée, donc -7 < -2.",
  },
  {
    id: "maths-3", matiere: "maths", chapitre: "Nombres relatifs", difficulte: 2,
    type: "qcm", question: "Que vaut (-4) × (-6) ?",
    choix: ["24", "-24", "10", "-10"], bonne: 0,
    indice: "Moins × moins = plus !",
    explication: "(-4) × (-6) = 24 : le produit de deux nombres négatifs est positif.",
  },
  {
    id: "maths-4", matiere: "maths", chapitre: "Fractions", difficulte: 1,
    type: "qcm", question: "Que vaut 1/2 + 1/4 ?",
    choix: ["3/4", "2/6", "1/3", "3/6"], bonne: 0,
    indice: "Mets les deux fractions au même dénominateur avant d'additionner.",
    explication: "1/2 = 2/4, donc 2/4 + 1/4 = 3/4.",
  },
  {
    id: "maths-5", matiere: "maths", chapitre: "Fractions", difficulte: 1,
    type: "qcm", question: "Simplifie la fraction 6/8.",
    choix: ["3/4", "6/8", "2/3", "4/6"], bonne: 0,
    indice: "Cherche un nombre qui divise à la fois 6 et 8.",
    explication: "6/8 = (6÷2)/(8÷2) = 3/4.",
  },
  {
    id: "maths-6", matiere: "maths", chapitre: "Fractions", difficulte: 2,
    type: "qcm", question: "Que vaut 2/3 × 1/5 ?",
    choix: ["2/15", "3/5", "2/8", "1/15"], bonne: 0,
    indice: "On multiplie les numérateurs entre eux, puis les dénominateurs entre eux.",
    explication: "2/3 × 1/5 = (2×1)/(3×5) = 2/15.",
  },

  // ------------------------------ Français ------------------------------
  {
    id: "francais-1", matiere: "francais", chapitre: "Nature des mots", difficulte: 1,
    type: "qcm", question: "Dans « Le petit chat dort. », quelle est la nature du mot « petit » ?",
    choix: ["Un adjectif qualificatif", "Un verbe", "Un adverbe", "Un nom"], bonne: 0,
    indice: "Ce mot donne une information sur le chat.",
    explication: "« Petit » qualifie le nom « chat » : c'est un adjectif qualificatif.",
  },
  {
    id: "francais-2", matiere: "francais", chapitre: "Compléments du verbe", difficulte: 2,
    type: "qcm", question: "Dans « Léopold mange une pomme. », quel est le COD ?",
    choix: ["Léopold", "mange", "une pomme", "il n'y en a pas"], bonne: 2,
    indice: "Le COD répond à la question « quoi ? » juste après le verbe.",
    explication: "« Une pomme » répond à « mange quoi ? » : c'est le complément d'objet direct.",
  },
  {
    id: "francais-3", matiere: "francais", chapitre: "Conjugaison", difficulte: 2,
    type: "qcm", question: "Conjugue « chanter » au passé simple, 3e personne du singulier.",
    choix: ["il chanta", "il chantait", "il a chanté", "il chante"], bonne: 0,
    indice: "Les verbes du 1er groupe prennent -a au passé simple à la 3e personne du singulier.",
    explication: "Au passé simple, « chanter » devient « il chanta ».",
  },
  {
    id: "francais-4", matiere: "francais", chapitre: "Conjugaison", difficulte: 2,
    type: "vrai_faux", question: "Le futur simple du verbe « voir » à la 1ère personne du singulier est « je verrai ».",
    reponse: true,
    indice: "« Voir » est un verbe irrégulier au futur.",
    explication: "Vrai : je verrai, tu verras, il verra… (à retenir par cœur, c'est irrégulier).",
  },
  {
    id: "francais-5", matiere: "francais", chapitre: "Orthographe", difficulte: 1,
    type: "qcm", question: "Quel est le pluriel de « cheval » ?",
    choix: ["chevals", "chevaux", "chevales", "chevaus"], bonne: 1,
    indice: "Les mots en -al font souvent leur pluriel en -aux.",
    explication: "Les mots en -al font leur pluriel en -aux : un cheval → des chevaux.",
  },
  {
    id: "francais-6", matiere: "francais", chapitre: "Vocabulaire", difficulte: 1,
    type: "reponse_courte", question: "Donne un synonyme du mot « content » (un seul mot).",
    reponses: ["heureux", "joyeux", "ravi", "satisfait"],
    indice: "Pense à un mot qui veut dire à peu près la même chose.",
    explication: "« Heureux », « joyeux » ou « ravi » sont de bons synonymes de « content ».",
  },

  // -------------------------- Histoire-Géographie --------------------------
  {
    id: "histgeo-1", matiere: "histoire_geo", chapitre: "Moyen Âge", difficulte: 2,
    type: "qcm", question: "À quelle époque appartient Charlemagne ?",
    choix: ["l'Antiquité", "le Moyen Âge", "la Renaissance", "l'époque contemporaine"], bonne: 1,
    indice: "Il a été sacré empereur en l'an 800.",
    explication: "Charlemagne (VIIIe-IXe siècle) est une figure majeure du Moyen Âge.",
  },
  {
    id: "histgeo-2", matiere: "histoire_geo", chapitre: "Moyen Âge", difficulte: 1,
    type: "vrai_faux", question: "Le Moyen Âge se situe entre l'Antiquité et les Temps modernes.",
    reponse: true,
    indice: "Situe-le entre la chute de Rome et la Renaissance.",
    explication: "Le Moyen Âge s'étend environ du Ve au XVe siècle, entre l'Antiquité et la Renaissance.",
  },
  {
    id: "histgeo-3", matiere: "histoire_geo", chapitre: "Naissance de l'Islam", difficulte: 2,
    type: "qcm", question: "Au VIIe siècle, dans quelle région naît l'Islam ?",
    choix: ["La péninsule arabique", "L'Égypte", "La Grèce", "L'Espagne"], bonne: 0,
    indice: "C'est la région où se trouvent La Mecque et Médine.",
    explication: "L'Islam naît au VIIe siècle dans la péninsule arabique.",
  },
  {
    id: "histgeo-4", matiere: "histoire_geo", chapitre: "Naissance de l'Islam", difficulte: 1,
    type: "qcm", question: "Comment appelle-t-on le texte sacré de l'Islam ?",
    choix: ["Le Coran", "La Bible", "La Torah", "Les Évangiles"], bonne: 0,
    indice: "C'est un mot arabe qui signifie « récitation ».",
    explication: "Le Coran est le texte sacré de l'Islam.",
  },
  {
    id: "histgeo-5", matiere: "histoire_geo", chapitre: "Ressources en eau", difficulte: 2,
    type: "qcm", question: "Quelle proportion de l'eau sur Terre est de l'eau douce facilement accessible ?",
    choix: ["Moins de 1 %", "50 %", "25 %", "10 %"], bonne: 0,
    indice: "La plupart de l'eau douce est gelée aux pôles ou souterraine.",
    explication: "Moins de 1 % de l'eau sur Terre est de l'eau douce facilement accessible pour l'être humain.",
  },
  {
    id: "histgeo-6", matiere: "histoire_geo", chapitre: "Ressources en eau", difficulte: 2,
    type: "qcm", question: "Quel secteur consomme le plus d'eau douce dans le monde ?",
    choix: ["L'agriculture", "L'industrie", "Les foyers (usage domestique)", "Le tourisme"], bonne: 0,
    indice: "Pense à l'irrigation des champs.",
    explication: "L'agriculture (irrigation) est le secteur qui consomme le plus d'eau douce dans le monde.",
  },

  // ------------------------------ Sciences ------------------------------
  {
    id: "sciences-1", matiere: "sciences", chapitre: "Digestion", difficulte: 2,
    type: "qcm", question: "Quel organe produit la bile, qui aide à digérer les graisses ?",
    choix: ["l'estomac", "le foie", "les poumons", "les reins"], bonne: 1,
    indice: "C'est aussi l'organe qui filtre le sang.",
    explication: "Le foie produit la bile, qui aide à digérer les graisses dans l'intestin.",
  },
  {
    id: "sciences-2", matiere: "sciences", chapitre: "Digestion", difficulte: 1,
    type: "vrai_faux", question: "Les aliments sont transformés en nutriments au cours de la digestion.",
    reponse: true,
    indice: "Pense à ce que le corps doit faire pour utiliser ce qu'on mange.",
    explication: "La digestion transforme les aliments en nutriments, assez petits pour passer dans le sang.",
  },
  {
    id: "sciences-3", matiere: "sciences", chapitre: "États de la matière", difficulte: 1,
    type: "qcm", question: "Comment s'appelle le passage de l'état liquide à l'état gazeux ?",
    choix: ["l'évaporation", "la fusion", "la solidification", "la condensation"], bonne: 0,
    indice: "Pense à une flaque d'eau qui disparaît au soleil.",
    explication: "L'évaporation est le passage de l'état liquide à l'état gazeux.",
  },
  {
    id: "sciences-4", matiere: "sciences", chapitre: "Géologie", difficulte: 2,
    type: "vrai_faux", question: "Une roche sédimentaire se forme par accumulation de sédiments.",
    reponse: true,
    indice: "« Sédimentaire » vient du mot « sédiment ».",
    explication: "Vrai : les roches sédimentaires se forment par accumulation et compactage de sédiments au fil du temps.",
  },
  {
    id: "sciences-5", matiere: "sciences", chapitre: "Respiration", difficulte: 1,
    type: "reponse_courte", question: "Quel organe permet la respiration chez l'être humain ? (un mot)",
    reponses: ["poumons", "les poumons"],
    indice: "Il y en a deux, dans la cage thoracique.",
    explication: "Ce sont les poumons qui permettent les échanges gazeux lors de la respiration.",
  },
  {
    id: "sciences-6", matiere: "sciences", chapitre: "Le vivant", difficulte: 1,
    type: "vrai_faux", question: "Tous les êtres vivants ont besoin d'eau pour survivre.",
    reponse: true,
    indice: "Pense à la composition des cellules vivantes.",
    explication: "L'eau est indispensable à la vie : elle compose une grande partie des cellules vivantes.",
  },

  // ------------------------------- Anglais -------------------------------
  {
    id: "anglais-1", matiere: "anglais", chapitre: "Present Simple", difficulte: 2,
    type: "qcm", question: "Choose the correct form: “She ___ to school every day.”",
    choix: ["goes", "go", "going", "went"], bonne: 0,
    indice: "Avec « she », on ajoute un -s au verbe au présent simple.",
    explication: "“She goes” — à la 3e personne du singulier, on ajoute -s.",
  },
  {
    id: "anglais-2", matiere: "anglais", chapitre: "Present Simple", difficulte: 2,
    type: "qcm", question: "What is the negative form of “They play football”?",
    choix: ["They don't play football", "They doesn't play football", "They not play football", "They isn't play football"], bonne: 0,
    indice: "Au présent simple, la négation se forme avec « don't » (ou « doesn't »).",
    explication: "“They don't play football” : au présent simple, la négation se forme avec don't/doesn't.",
  },
  {
    id: "anglais-3", matiere: "anglais", chapitre: "Prétérit", difficulte: 2,
    type: "qcm", question: "Quelle est la traduction correcte de « J'ai mangé » ?",
    choix: ["I eat", "I am eating", "I ate", "I will eat"], bonne: 2,
    indice: "C'est une action terminée dans le passé.",
    explication: "“I ate” est le prétérit du verbe irrégulier « to eat ».",
  },
  {
    id: "anglais-4", matiere: "anglais", chapitre: "Comparatifs", difficulte: 2,
    type: "reponse_courte", question: "Complète : “London is bigger ___ Paris.” (un mot)",
    reponses: ["than"],
    indice: "Ce petit mot suit toujours un comparatif en anglais.",
    explication: "On utilise « than » après un comparatif : bigger than.",
  },
  {
    id: "anglais-5", matiere: "anglais", chapitre: "Vocabulaire du quotidien", difficulte: 1,
    type: "qcm", question: "How do you say « le petit-déjeuner » in English?",
    choix: ["Breakfast", "Lunch", "Dinner", "Snack"], bonne: 0,
    indice: "C'est le premier repas de la journée.",
    explication: "« Breakfast » signifie « le petit-déjeuner ».",
  },
  {
    id: "anglais-6", matiere: "anglais", chapitre: "Vocabulaire du quotidien", difficulte: 1,
    type: "qcm", question: "Translate: “Il est 3 heures.”",
    choix: ["It's 3 o'clock", "It's 3 hours", "He is 3 hours", "Is 3 o'clock"], bonne: 0,
    indice: "En anglais, on ne traduit pas « heures » par « hours » pour dire l'heure.",
    explication: "“It's 3 o'clock” est la façon correcte de dire l'heure en anglais.",
  },
];

function getMatiere(code) {
  return MATIERES.find((m) => m.code === code) || null;
}

function getExercicesParMatiere(code) {
  return EXERCICES.filter((e) => e.matiere === code);
}
