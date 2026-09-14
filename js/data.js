/* =========================================================================
   Claude — données
   -------------------------------------------------------------------------
   Tout le contenu (matières + exercices) vit ici, en JS pur (pas de fetch
   JSON) pour que l'appli marche même ouverte directement en double-clic,
   sans serveur.

   Contenu 100 % basé sur les vrais documents de Léopold (dossier
   « Léopold doc 5B »). Seules les matières qui ont au moins un document
   dans ce dossier apparaissent dans MATIERES : dès qu'un nouveau document
   arrive (nouvelle matière ou nouveau chapitre), il suffit d'ajouter des
   objets à EXERCICES (et une ligne à MATIERES si besoin). Rien d'autre à
   toucher.

   Français / Histoire-Géo / Sciences retirés (encore une fois) : aucun
   document de Léopold ne les couvre pour l'instant. Cf. la conversation du
   6 septembre 2026 — à réintroduire seulement quand un vrai cours/devoir
   arrive dans le dossier.
   ========================================================================= */

const PRENOM = "Léopold";

// Une matière = { code, nom, emoji, couleur (voir COULEURS_MATIERE dans app.js) }
const MATIERES = [
  { code: "maths", nom: "Mathématiques", emoji: "➗", couleur: "bleu" },
  { code: "espagnol", nom: "Espagnol", emoji: "🇪🇸", couleur: "violet" },
  { code: "anglais", nom: "Anglais", emoji: "🇬🇧", couleur: "indigo" },
];

/**
 * Types d'exercices supportés :
 *  - "qcm"            : { choix: string[], bonne: index }
 *  - "vrai_faux"       : { reponse: true|false }
 *  - "reponse_courte"    : { reponses: string[] } (comparaison sans accents/casse)
 *
 * Champs communs : id, matiere, chapitre, difficulte (1-3), question, explication.
 */
const EXERCICES = [
  // ============================ MATHS ============================
  // ---- Chapitre : Nombres décimaux (cours « 5ème - Nombres décimaux ») ----
  {
    id: "maths-1", matiere: "maths", chapitre: "Nombres décimaux", difficulte: 1,
    type: "qcm", question: "Une fraction décimale est une fraction dont le dénominateur est...",
    choix: ["une puissance de 10 (10, 100, 1000...)", "toujours un nombre pair", "toujours égal à 2", "un nombre premier"], bonne: 0,
    indice: "Pense à 1/10, 1/100, 1/1000…",
    explication: "Une fraction décimale a pour dénominateur 10, 100, 1000, etc. (une puissance de 10).",
  },
  {
    id: "maths-2", matiere: "maths", chapitre: "Nombres décimaux", difficulte: 1,
    type: "qcm", question: "Dans le nombre décimal 143,46, quelle est la partie décimale ?",
    choix: ["143", "46", "0,46", "1,4346"], bonne: 2,
    indice: "La partie décimale est ce qui se trouve après la virgule, et elle est toujours plus petite que 1.",
    explication: "143,46 = 143 (partie entière) + 0,46 (partie décimale, qui commence toujours par 0).",
  },
  {
    id: "maths-3", matiere: "maths", chapitre: "Nombres décimaux", difficulte: 2,
    type: "vrai_faux", question: "Le nombre 3 est un nombre décimal, car il peut s'écrire sous forme de fraction décimale (par exemple 30/10).",
    reponse: true,
    indice: "Un nombre décimal est un nombre qui peut s'écrire sous forme de fraction décimale, même les nombres entiers.",
    explication: "Vrai : 3 = 30/10 = 300/100, etc. Tout nombre entier est aussi un nombre décimal.",
  },
  {
    id: "maths-4", matiere: "maths", chapitre: "Nombres décimaux", difficulte: 2,
    type: "qcm", question: "Comment décompose-t-on 143,46 par rangs (centaines, dizaines, unités, dixièmes, centièmes) ?",
    choix: ["1×100 + 4×10 + 3×1 + 4×0,1 + 6×0,01", "1×1000 + 4×100 + 3×10 + 4 + 6", "14 + 3 + 46", "143 × 46"], bonne: 0,
    indice: "Chaque chiffre a une valeur selon son rang : centaines, dizaines, unités, dixièmes, centièmes…",
    explication: "143,46 = 1×100 + 4×10 + 3×1 + 4×0,1 + 6×0,01 : chaque chiffre est multiplié par la valeur de son rang.",
  },
  {
    id: "maths-5", matiere: "maths", chapitre: "Nombres décimaux", difficulte: 2,
    type: "qcm", question: "Quel est le plus grand entre 3,05 et 3,007 ?",
    choix: ["3,05", "3,007", "Ils sont égaux", "Impossible à dire"], bonne: 0,
    indice: "Complète avec des zéros pour comparer : 3,050 et 3,007. Compare ensuite chiffre par chiffre après la virgule.",
    explication: "3,05 = 3,050. Aux dixièmes, 0 = 0 ; aux centièmes, 5 > 0. Donc 3,05 > 3,007, même si 3,007 a plus de chiffres.",
  },
  {
    id: "maths-6", matiere: "maths", chapitre: "Nombres décimaux", difficulte: 2,
    type: "qcm", question: "Range dans l'ordre croissant : 3,05 ; 3,007 ; 3,101 ; 2,99. Quel est le plus petit ?",
    choix: ["2,99", "3,007", "3,05", "3,101"], bonne: 0,
    indice: "Compare d'abord les parties entières : 2 ou 3 ?",
    explication: "2,99 a pour partie entière 2, alors que les trois autres ont pour partie entière 3. 2 < 3, donc 2,99 est le plus petit.",
  },
  {
    id: "maths-7", matiere: "maths", chapitre: "Nombres décimaux", difficulte: 1,
    type: "qcm", question: "Sur une demi-droite graduée, comment appelle-t-on le nombre associé à un point ?",
    choix: ["son abscisse", "son origine", "son unité", "son échelle"], bonne: 0,
    indice: "C'est le mot utilisé en cours quand on place des points comme A, B, C sur la droite graduée.",
    explication: "Le nombre associé à un point d'une demi-droite graduée s'appelle l'abscisse de ce point.",
  },

  // ---- Chapitre : Vitesse et circonférence (devoir sur l'ISS / Sophie Adenot) ----
  {
    id: "maths-8", matiere: "maths", chapitre: "Vitesse et circonférence", difficulte: 1,
    type: "qcm", question: "Quelle est la formule de la circonférence d'un cercle de rayon R ?",
    choix: ["2 × π × R", "π × R × R", "2 × R", "R ÷ π"], bonne: 0,
    indice: "C'est la formule utilisée dans le devoir sur l'ISS pour calculer la longueur de son orbite.",
    explication: "La circonférence (le tour complet) d'un cercle de rayon R vaut 2 × π × R.",
  },
  {
    id: "maths-9", matiere: "maths", chapitre: "Vitesse et circonférence", difficulte: 2,
    type: "reponse_courte", question: "La Terre a un rayon d'environ 6400 km, et l'ISS orbite à 400 km d'altitude au-dessus du sol. Quel est le rayon R de l'orbite de l'ISS, en km ? (chiffres uniquement)",
    reponses: ["6800", "6800km", "6800 km"],
    indice: "R = rayon de la Terre + altitude de l'ISS.",
    explication: "R = 6400 + 400 = 6800 km : le rayon de l'orbite se mesure depuis le centre de la Terre.",
  },
  {
    id: "maths-10", matiere: "maths", chapitre: "Vitesse et circonférence", difficulte: 2,
    type: "qcm", question: "Avec π ≈ 3,14 et R = 6800 km, quelle est la circonférence de l'orbite de l'ISS (arrondie au km) ?",
    choix: ["42 704 km", "6 800 km", "21 352 km", "85 408 km"], bonne: 0,
    indice: "Circonférence = 2 × π × R = 2 × 3,14 × 6800.",
    explication: "2 × 3,14 × 6800 = 42 704 km : c'est la distance parcourue par l'ISS en un tour complet de la Terre.",
  },
  {
    id: "maths-11", matiere: "maths", chapitre: "Vitesse et circonférence", difficulte: 1,
    type: "qcm", question: "Quelle formule permet de calculer une vitesse à partir d'une distance et d'un temps ?",
    choix: ["vitesse = distance ÷ temps", "vitesse = distance × temps", "vitesse = temps ÷ distance", "vitesse = distance + temps"], bonne: 0,
    indice: "Plus on met de temps pour la même distance, plus on va lentement : c'est bien une division.",
    explication: "vitesse = distance ÷ temps (par exemple en km/h si la distance est en km et le temps en heures).",
  },
  {
    id: "maths-12", matiere: "maths", chapitre: "Vitesse et circonférence", difficulte: 2,
    type: "reponse_courte", question: "L'ISS fait 16 tours de la Terre par jour (24h). Combien de temps dure un tour, en heures ? (nombre uniquement)",
    reponses: ["1.5", "1,5", "1.5h", "1,5h"],
    indice: "temps d'un tour = 24 heures ÷ nombre de tours par jour.",
    explication: "24 ÷ 16 = 1,5 h : l'ISS met une heure et demie à faire un tour complet de la Terre.",
  },
  {
    id: "maths-13", matiere: "maths", chapitre: "Vitesse et circonférence", difficulte: 3,
    type: "qcm", question: "L'ISS parcourt environ 42 704 km en 1,5 h. Quelle est sa vitesse (arrondie au km/h) ?",
    choix: ["28 469 km/h", "42 704 km/h", "64 056 km/h", "14 235 km/h"], bonne: 0,
    indice: "vitesse = distance ÷ temps = 42 704 ÷ 1,5.",
    explication: "42 704 ÷ 1,5 ≈ 28 469 km/h : la vitesse de l'astronaute Sophie Adenot à bord de l'ISS — vertigineux !",
  },

  // ---- Chapitre : Vocabulaire maths en anglais (DNL) ----
  {
    id: "maths-14", matiere: "maths", chapitre: "Vocabulaire maths en anglais (DNL)", difficulte: 1,
    type: "qcm", question: "Que signifie le sigle « DNL », utilisé pour les cours de maths en anglais ?",
    choix: ["Discipline Non Linguistique", "Diplôme National de Langue", "Direction Nationale des Lycées", "Dispositif Numérique Local"], bonne: 0,
    indice: "C'est le nom officiel donné aux cours d'une matière (ici les maths) enseignés en partie en anglais.",
    explication: "DNL = Discipline Non Linguistique : on utilise l'anglais comme outil pour apprendre les maths, pas l'inverse.",
  },
  {
    id: "maths-15", matiere: "maths", chapitre: "Vocabulaire maths en anglais (DNL)", difficulte: 2,
    type: "qcm", question: "Comment dit-on « l'axe des abscisses » en anglais ?",
    choix: ["the x-axis", "the y-axis", "the x-coordinate", "the table"], bonne: 0,
    indice: "Il y a deux axes sur un repère : celui-ci est horizontal.",
    explication: "« The x-axis » = l'axe des abscisses (horizontal) ; « the y-axis » = l'axe des ordonnées (vertical).",
  },
  {
    id: "maths-16", matiere: "maths", chapitre: "Vocabulaire maths en anglais (DNL)", difficulte: 2,
    type: "qcm", question: "Comment dit-on « un entier naturel » en anglais ?",
    choix: ["a natural number", "a fraction", "a digit", "a decimal"], bonne: 0,
    indice: "« Natural » comme dans « nature ».",
    explication: "« A natural number » = un entier naturel (0, 1, 2, 3…).",
  },
  {
    id: "maths-17", matiere: "maths", chapitre: "Vocabulaire maths en anglais (DNL)", difficulte: 2,
    type: "reponse_courte", question: "Comment dit-on « le rapporteur » (l'instrument pour mesurer les angles) en anglais ? (un mot)",
    reponses: ["protractor"],
    indice: "Ça commence par « pro- ».",
    explication: "« A protractor » = un rapporteur, l'instrument gradué en degrés pour mesurer les angles.",
  },
  {
    id: "maths-18", matiere: "maths", chapitre: "Vocabulaire maths en anglais (DNL)", difficulte: 1,
    type: "qcm", question: "Comment dit-on « ordre croissant » en anglais ?",
    choix: ["ascending order", "descending order", "natural order", "growing order"], bonne: 0,
    indice: "« Ascend » = monter.",
    explication: "« Ascending order » = ordre croissant (du plus petit au plus grand) ; « descending order » = ordre décroissant.",
  },
  {
    id: "maths-19", matiere: "maths", chapitre: "Vocabulaire maths en anglais (DNL)", difficulte: 2,
    type: "reponse_courte", question: "Comment dit-on « le sommet » (d'un triangle, d'une pyramide) en anglais ? (un mot)",
    reponses: ["vertex"],
    indice: "Le pluriel est « vertices ».",
    explication: "« A vertex » = un sommet (pluriel : vertices).",
  },
  {
    id: "maths-20", matiere: "maths", chapitre: "Vocabulaire maths en anglais (DNL)", difficulte: 2,
    type: "qcm", question: "Comment dit-on « un losange » en anglais ?",
    choix: ["a rhombus", "a square", "an oval", "a diamond shape"], bonne: 0,
    indice: "Ce mot vient du grec « rhombos ».",
    explication: "« A rhombus » = un losange (un quadrilatère avec 4 côtés égaux).",
  },
  {
    id: "maths-21", matiere: "maths", chapitre: "Vocabulaire maths en anglais (DNL)", difficulte: 2,
    type: "qcm", question: "Comment dit-on « la moyenne » (en statistiques) en anglais ?",
    choix: ["the average / the mean", "the range", "the frequency", "the median only"], bonne: 0,
    indice: "C'est le mot qu'on utilise pour dire « en moyenne ».",
    explication: "« The average » ou « the mean » = la moyenne d'une série de valeurs.",
  },

  // ---- Chapitre : Priorités opératoires (fiche « III. Priorités opératoires ») ----
  {
    id: "maths-22", matiere: "maths", chapitre: "Priorités opératoires", difficulte: 1,
    type: "qcm", question: "Dans un calcul avec des parenthèses, que doit-on faire en tout premier ?",
    choix: ["Le calcul entre parenthèses", "La multiplication, où qu'elle soit", "L'opération la plus à gauche", "L'addition, où qu'elle soit"], bonne: 0,
    indice: "Les parenthèses indiquent toujours ce qui doit être calculé en priorité, avant tout le reste.",
    explication: "On commence toujours par calculer ce qu'il y a entre parenthèses, quelles que soient les opérations qui les entourent.",
  },
  {
    id: "maths-23", matiere: "maths", chapitre: "Priorités opératoires", difficulte: 1,
    type: "qcm", question: "Dans 5 + 3 × 4 (sans parenthèses), quel calcul doit-on faire en premier ?",
    choix: ["3 × 4", "5 + 3", "Peu importe, le résultat est le même", "4 tout seul"], bonne: 0,
    indice: "Sans parenthèses, une des deux opérations est toujours prioritaire sur l'autre.",
    explication: "La multiplication est prioritaire sur l'addition : on calcule 3 × 4 = 12 d'abord, puis 5 + 12 = 17.",
  },
  {
    id: "maths-24", matiere: "maths", chapitre: "Priorités opératoires", difficulte: 1,
    type: "vrai_faux", question: "Dans un calcul, on effectue toujours les opérations en les lisant de gauche à droite, sans aucune exception.",
    reponse: false,
    indice: "Pense aux parenthèses, et à la priorité de la multiplication et de la division sur l'addition et la soustraction.",
    explication: "Faux : on commence par les parenthèses, puis les multiplications et divisions, et seulement ensuite les additions et soustractions restantes, de gauche à droite.",
  },
  {
    id: "maths-25", matiere: "maths", chapitre: "Priorités opératoires", difficulte: 1,
    type: "qcm", question: "Dans une expression avec uniquement des additions et des soustractions, dans quel ordre calcule-t-on ?",
    choix: ["De gauche à droite", "Les additions d'abord, puis les soustractions", "De droite à gauche", "Les plus grands nombres d'abord"], bonne: 0,
    indice: "Aucune des deux opérations n'est prioritaire sur l'autre : il faut un ordre de lecture.",
    explication: "Avec uniquement + et –, on calcule dans l'ordre où on les lit, de gauche à droite.",
  },
  {
    id: "maths-26", matiere: "maths", chapitre: "Priorités opératoires", difficulte: 1,
    type: "qcm", question: "Dans une expression avec uniquement des multiplications et des divisions, dans quel ordre calcule-t-on ?",
    choix: ["De gauche à droite", "Les multiplications d'abord, puis les divisions", "De droite à gauche", "La plus grande valeur d'abord"], bonne: 0,
    indice: "Même règle que pour + et –, mais cette fois avec × et ÷.",
    explication: "Avec uniquement × et ÷, aucune des deux n'est prioritaire sur l'autre : on calcule de gauche à droite.",
  },
  {
    id: "maths-27", matiere: "maths", chapitre: "Priorités opératoires", difficulte: 1,
    type: "reponse_courte", question: "Calcule : 10 – 2 × 3 (nombre uniquement)",
    reponses: ["4"],
    indice: "La multiplication est prioritaire : commence par 2 × 3.",
    explication: "2 × 3 = 6, puis 10 – 6 = 4.",
  },
  {
    id: "maths-28", matiere: "maths", chapitre: "Priorités opératoires", difficulte: 1,
    type: "reponse_courte", question: "Calcule : 6 × 2 + 4 × 3 (nombre uniquement)",
    reponses: ["24"],
    indice: "Il y a deux multiplications à calculer avant l'addition : 6 × 2 et 4 × 3.",
    explication: "6 × 2 = 12 et 4 × 3 = 12, donc 12 + 12 = 24.",
  },
  {
    id: "maths-29", matiere: "maths", chapitre: "Priorités opératoires", difficulte: 2,
    type: "qcm", question: "Quand un calcul contient des parenthèses imbriquées (une paire à l'intérieur d'une autre), par laquelle commence-t-on ?",
    choix: ["La plus « à l'intérieur »", "La plus « à l'extérieur »", "Peu importe laquelle", "La plus courte à écrire"], bonne: 0,
    indice: "On « épluche » le calcul du centre vers l'extérieur, comme un oignon.",
    explication: "On commence toujours par la parenthèse la plus intérieure, puis on remonte vers l'extérieur.",
  },
  {
    id: "maths-30", matiere: "maths", chapitre: "Priorités opératoires", difficulte: 2,
    type: "reponse_courte", question: "Calcule : 18 – 4 + 5 – 1 – 3 (nombre uniquement)",
    reponses: ["15"],
    indice: "Il n'y a que des + et des – : calcule étape par étape, de gauche à droite.",
    explication: "18 – 4 = 14 ; 14 + 5 = 19 ; 19 – 1 = 18 ; 18 – 3 = 15.",
  },
  {
    id: "maths-31", matiere: "maths", chapitre: "Priorités opératoires", difficulte: 2,
    type: "reponse_courte", question: "Calcule : 20 ÷ 2 × 5 (nombre uniquement)",
    reponses: ["50"],
    indice: "Il n'y a que des × et des ÷ : calcule de gauche à droite, ne commence pas par 2 × 5.",
    explication: "20 ÷ 2 = 10, puis 10 × 5 = 50.",
  },
  {
    id: "maths-32", matiere: "maths", chapitre: "Priorités opératoires", difficulte: 2,
    type: "qcm", question: "Calcule : 2 + 2 × (8 – 3)",
    choix: ["12", "20", "15", "29"], bonne: 0,
    indice: "Calcule d'abord la parenthèse (8 – 3), puis la multiplication, et enfin l'addition.",
    explication: "(8 – 3) = 5 ; 2 × 5 = 10 ; 2 + 10 = 12. Attention à ne pas additionner 2 + 2 avant de multiplier !",
  },
  {
    id: "maths-33", matiere: "maths", chapitre: "Priorités opératoires", difficulte: 2,
    type: "qcm", question: "Calcule : (5 + 3) × 2",
    choix: ["16", "11", "10", "8"], bonne: 0,
    indice: "Les parenthèses changent tout : calcule (5 + 3) avant de multiplier par 2.",
    explication: "(5 + 3) = 8 ; 8 × 2 = 16.",
  },
  {
    id: "maths-34", matiere: "maths", chapitre: "Priorités opératoires", difficulte: 2,
    type: "qcm", question: "Calcule maintenant, sans parenthèses cette fois : 5 + 3 × 2",
    choix: ["11", "16", "8", "10"], bonne: 0,
    indice: "Sans parenthèses, la multiplication redevient prioritaire sur l'addition.",
    explication: "3 × 2 = 6, puis 5 + 6 = 11. Comparé à (5 + 3) × 2 = 16 : les parenthèses changent complètement le résultat !",
  },
  {
    id: "maths-35", matiere: "maths", chapitre: "Priorités opératoires", difficulte: 2,
    type: "reponse_courte", question: "Calcule : 30 – (2 + 3) × 4 (nombre uniquement)",
    reponses: ["10"],
    indice: "Calcule d'abord la parenthèse, puis la multiplication, et enfin la soustraction.",
    explication: "(2 + 3) = 5 ; 5 × 4 = 20 ; 30 – 20 = 10.",
  },
  {
    id: "maths-36", matiere: "maths", chapitre: "Priorités opératoires", difficulte: 2,
    type: "vrai_faux", question: "Dans le calcul 4 × 3 + 2, il faut calculer 3 + 2 avant de multiplier par 4.",
    reponse: false,
    indice: "Il n'y a pas de parenthèses ici : quelle opération est prioritaire entre × et + ?",
    explication: "Faux : sans parenthèses, la multiplication est prioritaire. Il faut calculer 4 × 3 = 12 d'abord, puis 12 + 2 = 14.",
  },
  {
    id: "maths-37", matiere: "maths", chapitre: "Priorités opératoires", difficulte: 3,
    type: "qcm", question: "Calcule : 3 × 8 – 20 ÷ (7 – 2)",
    choix: ["20", "0,8", "4", "28"], bonne: 0,
    indice: "Calcule d'abord la parenthèse (7 – 2), puis la multiplication et la division séparément, et enfin la soustraction.",
    explication: "(7 – 2) = 5 ; 3 × 8 = 24 ; 20 ÷ 5 = 4 ; 24 – 4 = 20.",
  },
  {
    id: "maths-38", matiere: "maths", chapitre: "Priorités opératoires", difficulte: 3,
    type: "qcm", question: "Calcule : 2 × (10 – (3 + 2))",
    choix: ["10", "18", "5", "30"], bonne: 0,
    indice: "Commence par la parenthèse la plus à l'intérieur : (3 + 2). N'oublie pas de soustraire ce résultat en entier.",
    explication: "(3 + 2) = 5 ; puis 10 – 5 = 5 ; puis 2 × 5 = 10. Attention à bien soustraire tout le résultat de la parenthèse intérieure, pas juste une partie.",
  },
  {
    id: "maths-39", matiere: "maths", chapitre: "Priorités opératoires", difficulte: 3,
    type: "reponse_courte", question: "Calcule : 50 – 4 × (9 – 2 × 3) (nombre uniquement)",
    reponses: ["38"],
    indice: "Même à l'intérieur d'une parenthèse, la multiplication reste prioritaire : commence par 2 × 3.",
    explication: "2 × 3 = 6 ; 9 – 6 = 3 ; 4 × 3 = 12 ; 50 – 12 = 38.",
  },

  // ============================ ESPAGNOL ============================
  // Toutes les matières ci-dessous proviennent du classeur complet
  // (39 pages) « A2-01 la vuelta al cole », désormais exploité en entier.

  // ---- Vocabulario: la vuelta al cole ----
  {
    id: "espagnol-1", matiere: "espagnol", chapitre: "Vocabulario: la vuelta al cole", difficulte: 1,
    type: "qcm", question: "Que signifie « la vuelta » en français ?",
    choix: ["le retour", "le voyage", "la classe", "le sac"], bonne: 0,
    indice: "« La vuelta al cole », c'est ce qui se passe en septembre !",
    explication: "« La vuelta » signifie « le retour » (ou « un tour ») : « la vuelta al cole » = la rentrée des classes.",
  },
  {
    id: "espagnol-1b", matiere: "espagnol", chapitre: "Vocabulario: la vuelta al cole", difficulte: 1,
    type: "reponse_courte", question: "« El cole » est le diminutif familier de quel mot ? (un mot)",
    reponses: ["colegio", "el colegio"],
    indice: "C'est le nom espagnol de l'école/collège.",
    explication: "« El cole » est l'abréviation familière de « el colegio » (l'école).",
  },

  // ---- Verbos regulares en presente ----
  {
    id: "espagnol-2", matiere: "espagnol", chapitre: "Verbos regulares en presente", difficulte: 1,
    type: "qcm", question: "Conjugue « comer » (manger) à la 2e personne du singulier : « tú ___ ».",
    choix: ["comes", "come", "coméis", "coman"], bonne: 0,
    indice: "Les verbes réguliers en -er prennent -es à la 2e personne du singulier.",
    explication: "« Tú comes » : les verbes en -ER prennent -o, -es, -e, -emos, -éis, -en au présent.",
  },
  {
    id: "espagnol-2b", matiere: "espagnol", chapitre: "Verbos regulares en presente", difficulte: 2,
    type: "qcm", question: "Conjugue « hablar » (parler) à la personne « nosotros/as ».",
    choix: ["hablamos", "habláis", "hablan", "hablo"], bonne: 0,
    indice: "Les verbes en -AR prennent -amos à la 1ère personne du pluriel.",
    explication: "« Nosotros/as hablamos » : les verbes en -AR se conjuguent -o, -as, -a, -amos, -áis, -an au présent.",
  },
  {
    id: "espagnol-2c", matiere: "espagnol", chapitre: "Verbos regulares en presente", difficulte: 2,
    type: "reponse_courte", question: "Complète (extrait du document) : « Voy al cole … hasta las dos y media, cuando vuelvo del colegio, ___. » (yo como, un mot)",
    reponses: ["como"],
    indice: "C'est le verbe « comer » à la 1ère personne du singulier.",
    explication: "« Como » : yo como, tú comes, él/ella come, nosotros comemos, vosotros coméis, ellos comen.",
  },

  // ---- Verbos irregulares: IR ----
  {
    id: "espagnol-3", matiere: "espagnol", chapitre: "Verbos irregulares", difficulte: 2,
    type: "qcm", question: "Conjugue le verbe « IR » (aller) à la personne « vosotros ».",
    choix: ["vais", "vamos", "van", "voy"], bonne: 0,
    indice: "IR : voy, vas, va, vamos, vais, van.",
    explication: "« Vosotros vais » : IR est un verbe très irrégulier à apprendre par cœur (voy, vas, va, vamos, vais, van).",
  },
  {
    id: "espagnol-3b", matiere: "espagnol", chapitre: "Verbos irregulares", difficulte: 1,
    type: "reponse_courte", question: "Conjugue « IR » à la 1ère personne du singulier : « yo ___ al instituto. » (un mot)",
    reponses: ["voy"],
    indice: "C'est irrégulier, ça ne suit pas le modèle habituel des verbes en -IR.",
    explication: "« Yo voy » : le verbe IR est totalement irrégulier au présent (voy, vas, va, vamos, vais, van).",
  },

  // ---- Gramática: la rutina (soler) ----
  {
    id: "espagnol-4", matiere: "espagnol", chapitre: "Gramática: la rutina", difficulte: 2,
    type: "qcm", question: "Que signifie « soler + infinitivo » (ex : « suelo desayunar a las siete ») ?",
    choix: ["avoir l'habitude de", "vouloir", "devoir", "pouvoir"], bonne: 0,
    indice: "C'est la structure utilisée pour parler de sa routine habituelle.",
    explication: "« Soler + infinitif » = avoir l'habitude de. « Suelo desayunar a las siete » = j'ai l'habitude de prendre le petit-déjeuner à sept heures.",
  },
  {
    id: "espagnol-4b", matiere: "espagnol", chapitre: "Gramática: la rutina", difficulte: 2,
    type: "qcm", question: "Conjugue « SOLER » (verbe à diphtongue o → ue) à la personne « nosotros ».",
    choix: ["solemos", "suelemos", "soléis", "sueles"], bonne: 0,
    indice: "Les verbes à diphtongue perdent leur diphtongue à « nosotros » et « vosotros ».",
    explication: "« Solemos » : SOLER = suelo, sueles, suele, SOLEMOS, soléis, suelen (la diphtongue -ue- disparaît à nosotros/vosotros).",
  },
  {
    id: "espagnol-4c", matiere: "espagnol", chapitre: "La rutina de Rosalía", difficulte: 2,
    type: "qcm", question: "D'après le document sur Rosalía, que fait-elle en premier le matin ?",
    choix: ["Ses exercices de chant", "Elle se douche", "Elle prépare des brownies", "Elle joue au ballon"], bonne: 0,
    indice: "« Lo primero que hace es hacer sus ejercicios de canto. »",
    explication: "Le texte dit : « Cuando se despierta por la mañana lo primero que hace es hacer sus ejercicios de canto. »",
  },
  {
    id: "espagnol-4d", matiere: "espagnol", chapitre: "La rutina de Rosalía", difficulte: 1,
    type: "qcm", question: "Rosalía est présentée dans le document comme...",
    choix: ["une jeune chanteuse, compositrice et productrice espagnole", "une actrice de cinéma américaine", "une joueuse de football", "une journaliste"], bonne: 0,
    indice: "C'est écrit dans l'encart « ¿Lo sabes? ».",
    explication: "« Rosalía es una joven cantante, compositora, actriz y productora española muy famosa. »",
  },

  // ---- Verbos reflexivos ----
  {
    id: "espagnol-5", matiere: "espagnol", chapitre: "Verbos reflexivos", difficulte: 2,
    type: "qcm", question: "Conjugue « despertarse » (se réveiller) à la 1ère personne du singulier.",
    choix: ["me despierto", "te despiertas", "se despierta", "me despierta"], bonne: 0,
    indice: "C'est un verbe à diphtongue e → ie, et n'oublie pas le pronom réfléchi ME.",
    explication: "« Me despierto » : despertarse est un verbe réfléchi (me, te, se…) à diphtongue e → ie.",
  },
  {
    id: "espagnol-6", matiere: "espagnol", chapitre: "Verbos reflexivos", difficulte: 2,
    type: "qcm", question: "Conjugue « acostarse » (se coucher) à la 2e personne du singulier.",
    choix: ["te acuestas", "te acuesto", "se acuesta", "te acostas"], bonne: 0,
    indice: "C'est un verbe à diphtongue o → ue : acuesto, acuestas, acuesta…",
    explication: "« Te acuestas » : acostarse se conjugue avec la diphtongue o → ue (me acuesto, te acuestas, se acuesta…).",
  },
  {
    id: "espagnol-6b", matiere: "espagnol", chapitre: "Verbos reflexivos", difficulte: 1,
    type: "qcm", question: "Conjugue « ducharse » (se doucher) à la personne « nosotros ».",
    choix: ["nos duchamos", "os ducháis", "se duchan", "me ducho"], bonne: 0,
    indice: "Ducharse n'est pas un verbe à diphtongue : la base ne change pas.",
    explication: "« Nos duchamos » : ME ducho, TE duchas, SE ducha, NOS duchamos, OS ducháis, SE duchan.",
  },
  {
    id: "espagnol-6c", matiere: "espagnol", chapitre: "Verbos reflexivos", difficulte: 1,
    type: "qcm", question: "Conjugue « levantarse » (se lever) à la 3e personne du pluriel.",
    choix: ["se levantan", "se levanta", "os levantáis", "nos levantamos"], bonne: 0,
    indice: "« Ellos/ellas » = la 3e personne du pluriel.",
    explication: "« Se levantan » : ME levanto, TE levantas, SE levanta, NOS levantamos, OS levantáis, SE levantan.",
  },
  {
    id: "espagnol-6d", matiere: "espagnol", chapitre: "Vocabulario: la rutina diaria", difficulte: 1,
    type: "reponse_courte", question: "Comment dit-on « tôt » en espagnol, dans l'expression « pronto x tarde » ? (un mot)",
    reponses: ["pronto"],
    indice: "C'est le premier mot de l'expression « pronto x tarde = tôt x tard ».",
    explication: "« Pronto » = tôt (par opposition à « tarde » = tard).",
  },
  {
    id: "espagnol-6e", matiere: "espagnol", chapitre: "Vocabulario: la rutina diaria", difficulte: 1,
    type: "qcm", question: "D'après le vocabulaire de la rutina, que signifie « costar (ue) » dans « me cuesta dormir »  ?",
    choix: ["avoir du mal à", "coûter cher", "compter", "coudre"], bonne: 0,
    indice: "Le document traduit « costar (ue) » par « avoir du mal de ».",
    explication: "« Costar (ue) » ici = avoir du mal à (faire quelque chose). Ex : « me cuesta dormir » = j'ai du mal à dormir.",
  },

  // ---- La hora ----
  {
    id: "espagnol-7", matiere: "espagnol", chapitre: "La hora", difficulte: 2,
    type: "qcm", question: "Comment dit-on « 13:30 » en espagnol ?",
    choix: ["Es la una y media (de la tarde)", "Son las trece y media", "Es la una menos media", "Son la una y media"], bonne: 0,
    indice: "1h de l'après-midi se dit « la una », pas « las trece ».",
    explication: "« Es la una y media (de la tarde) » : pour 1 heure on utilise « es la una », et « y media » pour la demie.",
  },
  {
    id: "espagnol-7b", matiere: "espagnol", chapitre: "La hora", difficulte: 2,
    type: "qcm", question: "Comment dit-on « 21:45 » (9h45 du soir) en espagnol ?",
    choix: ["Son las diez menos cuarto de la noche", "Son las nueve y cuarenta y cinco", "Es las diez menos cuarto", "Son las nueve menos cuarto"], bonne: 0,
    indice: "Après la demie, on compte « menos » par rapport à l'heure suivante : 21:45 est proche de 22h.",
    explication: "« Son las diez menos cuarto de la noche » : passé la demie, on annonce l'heure suivante « moins le quart ».",
  },
  {
    id: "espagnol-7c", matiere: "espagnol", chapitre: "La hora", difficulte: 1,
    type: "qcm", question: "Comment dit-on « 8h15 du matin » en espagnol ?",
    choix: ["Son las ocho y cuarto de la mañana", "Son las ocho y quince minutos solamente", "Es las ocho y cuarto", "Son las ocho menos cuarto"], bonne: 0,
    indice: "« Y cuarto » = et quart.",
    explication: "« Son las ocho y cuarto de la mañana » = il est huit heures et quart du matin.",
  },

  // ---- Comparativos ----
  {
    id: "espagnol-8", matiere: "espagnol", chapitre: "Comparativos", difficulte: 2,
    type: "reponse_courte", question: "Complète : « Ramón es ___ clásico que Carlos. » (comparatif de supériorité, un mot)",
    reponses: ["mas", "más"],
    indice: "Le comparatif de supériorité en espagnol se forme avec ce petit mot + adjectif + que.",
    explication: "« Ramón es más clásico que Carlos » : más... que = plus... que.",
  },
  {
    id: "espagnol-8b", matiere: "espagnol", chapitre: "Comparativos", difficulte: 2,
    type: "qcm", question: "Comment dit-on « Cristina est moins sérieuse qu'Ángeles » en espagnol ?",
    choix: ["Cristina es menos seria que Ángeles", "Cristina es más seria que Ángeles", "Cristina es tan seria como Ángeles", "Cristina está menos seria que Ángeles"], bonne: 0,
    indice: "Comparatif d'infériorité : menos... que.",
    explication: "« Cristina es menos seria que Ángeles » : menos... que = moins... que.",
  },
  {
    id: "espagnol-8c", matiere: "espagnol", chapitre: "Comparativos", difficulte: 2,
    type: "qcm", question: "Comment dit-on « Fina est aussi souriante que Cristina » (comparatif d'égalité) ?",
    choix: ["Fina es tan risueña como Cristina", "Fina es más risueña que Cristina", "Fina es menos risueña que Cristina", "Fina es tan risueña que Cristina"], bonne: 0,
    indice: "Comparatif d'égalité : tan... como.",
    explication: "« Fina es tan risueña como Cristina » : tan... como = aussi... que.",
  },

  // ---- Verbos a diptongo y debilitamiento ----
  {
    id: "espagnol-8d", matiere: "espagnol", chapitre: "Verbos a diptongo", difficulte: 2,
    type: "reponse_courte", question: "Conjugue « contar » (compter/raconter) à la 3e personne du singulier. (un mot)",
    reponses: ["cuenta"],
    indice: "Verbe à diphtongue o → ue, comme volver.",
    explication: "« Cuenta » : contar est un verbe à diphtongue o → ue (cuento, cuentas, cuenta, contamos, contáis, cuentan).",
  },
  {
    id: "espagnol-8e", matiere: "espagnol", chapitre: "Verbos a diptongo", difficulte: 2,
    type: "qcm", question: "Conjugue « querer » (vouloir) à la personne « vosotros ».",
    choix: ["queréis", "quieren", "quieres", "queremos"], bonne: 0,
    indice: "Comme pour SOLER, la diphtongue disparaît à « vosotros ».",
    explication: "« Queréis » : querer = quiero, quieres, quiere, queremos, QUERÉIS, quieren.",
  },
  {
    id: "espagnol-8f", matiere: "espagnol", chapitre: "Verbos a diptongo", difficulte: 2,
    type: "reponse_courte", question: "Conjugue « poder » (pouvoir) à la 1ère personne du singulier. (un mot)",
    reponses: ["puedo"],
    indice: "Verbe à diphtongue o → ue.",
    explication: "« Puedo » : poder = puedo, puedes, puede, podemos, podéis, pueden.",
  },
  {
    id: "espagnol-8g", matiere: "espagnol", chapitre: "Verbos a debilitamiento", difficulte: 3,
    type: "reponse_courte", question: "Conjugue « pedir » (demander) à la 1ère personne du pluriel (nosotros). (un mot)",
    reponses: ["pedimos"],
    indice: "Les verbes à affaiblissement (e→i) gardent la voyelle d'origine à nosotros/vosotros, contrairement aux verbes à diphtongue.",
    explication: "« Pedimos » : pedir = pido, pides, pide, PEDIMOS, pedís, piden (le e→i ne touche pas nosotros/vosotros).",
  },

  // ---- Ser y estar ----
  {
    id: "espagnol-9", matiere: "espagnol", chapitre: "Ser y estar", difficulte: 2,
    type: "qcm", question: "Complète : « Hoy nosotros ___ un poco cansados. » (fatigués, aujourd'hui)",
    choix: ["estamos", "somos", "estáis", "son"], bonne: 0,
    indice: "Un état temporaire (être fatigué aujourd'hui) se dit avec ESTAR, pas SER.",
    explication: "« Estamos cansados » : ESTAR sert pour un état passager (fatigue, humeur), SER pour une qualité permanente.",
  },
  {
    id: "espagnol-9b", matiere: "espagnol", chapitre: "Ser y estar", difficulte: 2,
    type: "qcm", question: "Complète : « Este señor ___ mi profesor de lengua y ___ muy simpático. » (deux fois le même verbe)",
    choix: ["es / es", "está / está", "es / está", "está / es"], bonne: 0,
    indice: "Être « professeur » et être « sympathique » sont deux caractéristiques durables : même verbe les deux fois.",
    explication: "« Es mi profesor... y es muy simpático » : une identité et une qualité de caractère se disent avec SER.",
  },
  {
    id: "espagnol-9c", matiere: "espagnol", chapitre: "Ser y estar", difficulte: 2,
    type: "qcm", question: "Complète : « Ellos ___ en el patio de recreo. » (ils se trouvent dans la cour)",
    choix: ["están", "son", "estáis", "es"], bonne: 0,
    indice: "Indiquer où se trouve quelqu'un se dit toujours avec ESTAR.",
    explication: "« Están en el patio » : la localisation se dit avec ESTAR, jamais avec SER.",
  },
  {
    id: "espagnol-9d", matiere: "espagnol", chapitre: "Ser y estar", difficulte: 1,
    type: "qcm", question: "Complète : « Yo ___ en el gimnasio. » (je me trouve dans le gymnase)",
    choix: ["estoy", "soy", "está", "es"], bonne: 0,
    indice: "Encore une localisation.",
    explication: "« Estoy en el gimnasio » : ESTAR pour dire où l'on se trouve.",
  },

  // ---- Expresar la obligación ----
  {
    id: "espagnol-10", matiere: "espagnol", chapitre: "Expresar la obligación", difficulte: 1,
    type: "qcm", question: "Que signifie « HAY QUE + infinitivo » (ex : « hay que escuchar a la profesora ») ?",
    choix: ["Il faut...", "Je veux...", "J'ai...", "Je peux..."], bonne: 0,
    indice: "C'est une obligation générale, qui ne dépend pas d'une personne précise.",
    explication: "« Hay que + infinitif » = il faut... (obligation impersonnelle). « Tener que » et « deber » expriment aussi l'obligation, mais pour une personne précise (« tú tienes que... », « debes... »).",
  },
  {
    id: "espagnol-10b", matiere: "espagnol", chapitre: "Expresar la obligación", difficulte: 2,
    type: "qcm", question: "Comment dit-on « tu dois apprendre le vocabulaire » en espagnol, avec TENER QUE ?",
    choix: ["Tienes que aprender el vocabulario", "Hay que aprender el vocabulario", "Debo aprender el vocabulario", "Tener que aprendes el vocabulario"], bonne: 0,
    indice: "TENER QUE + infinitif, conjugué pour « tú ».",
    explication: "« Tienes que aprender el vocabulario » : TENER QUE + infinitif = tu dois... (obligation personnelle).",
  },
  {
    id: "espagnol-10c", matiere: "espagnol", chapitre: "Expresar la obligación", difficulte: 2,
    type: "qcm", question: "Comment dit-on « nous devons beaucoup étudier » avec DEBER ?",
    choix: ["Debemos estudiar mucho", "Hay que estudiar mucho nosotros", "Tenemos deber estudiar mucho", "Debimos estudiar mucho"], bonne: 0,
    indice: "DEBER + infinitif, conjugué pour « nosotros ».",
    explication: "« Debemos estudiar mucho » : DEBER + infinitif = nous devons... (une autre façon d'exprimer l'obligation).",
  },
  {
    id: "espagnol-10d", matiere: "espagnol", chapitre: "Normas de clase (vocabulario)", difficulte: 1,
    type: "reponse_courte", question: "Comment dit-on « la poubelle » en espagnol, comme dans « tirar los papeles a la ___ » ? (un mot)",
    reponses: ["basura", "la basura"],
    indice: "C'est le mot utilisé pour « jeter les papiers à la... ».",
    explication: "« La basura » = la poubelle. « Tirar los papeles a la basura » = jeter les papiers à la poubelle.",
  },
  {
    id: "espagnol-10e", matiere: "espagnol", chapitre: "Normas de clase (vocabulario)", difficulte: 2,
    type: "qcm", question: "D'après les règles de classe du document, laquelle de ces actions N'EST PAS une règle à respecter ?",
    choix: ["Gritar en clase", "Escuchar al profesor", "Levantar la mano", "Decir « por favor »"], bonne: 0,
    indice: "Trois sont des choses à faire (règles positives) ; une seule est interdite.",
    explication: "Le document liste « NO HAY QUE GRITAR NI HABLAR FUERTE EN CLASE » : crier est justement ce qu'il ne faut PAS faire.",
  },

  // ---- La ropa ----
  {
    id: "espagnol-12", matiere: "espagnol", chapitre: "La ropa", difficulte: 1,
    type: "qcm", question: "Comment dit-on « le pantalon » en espagnol (au pluriel, comme souvent) ?",
    choix: ["los pantalones", "los vaqueros", "la falda", "el jersey"], bonne: 0,
    indice: "Attention, en espagnol ce mot s'utilise presque toujours au pluriel, comme en français.",
    explication: "« Los pantalones » = le pantalon (toujours au pluriel en espagnol, comme « los vaqueros » pour le jean).",
  },
  {
    id: "espagnol-12b", matiere: "espagnol", chapitre: "La ropa", difficulte: 1,
    type: "qcm", question: "« Las gafas de sol » signifie...",
    choix: ["les lunettes de soleil", "les chaussures de sport", "le sac à dos", "le manteau"], bonne: 0,
    indice: "« Gafas » = lunettes, « sol » = soleil.",
    explication: "« Las gafas de sol » = les lunettes de soleil.",
  },
  {
    id: "espagnol-12c", matiere: "espagnol", chapitre: "La ropa", difficulte: 2,
    type: "reponse_courte", question: "Comment dit-on « la jupe » en espagnol ? (un mot)",
    reponses: ["falda", "la falda"],
    indice: "C'est un vêtement porté par les filles dans l'uniforme cubain vu dans le document.",
    explication: "« La falda » = la jupe.",
  },
  {
    id: "espagnol-12d", matiere: "espagnol", chapitre: "La ropa", difficulte: 2,
    type: "qcm", question: "Parmi ces mots, lequel désigne des chaussures (« les baskets ») ?",
    choix: ["las zapatillas de deporte", "los tacones", "las botas", "los zapatos"], bonne: 0,
    indice: "« Deporte » = sport.",
    explication: "« Las zapatillas de deporte » = les baskets. « Los tacones » = les talons, « las botas » = les bottes, « los zapatos » = les chaussures (en général).",
  },

  // ---- Uniformes: Cuba ----
  {
    id: "espagnol-13", matiere: "espagnol", chapitre: "Uniformes: Cuba", difficulte: 2,
    type: "qcm", question: "D'après le document sur les élèves cubains, quel est l'uniforme des garçons ?",
    choix: ["Camisa blanca y pantalón azul", "Camiseta roja y pantalón corto", "Camisa azul y pantalón blanco", "Falda azul y camisa blanca"], bonne: 0,
    indice: "« Llevan un uniforme: camisa blanca y pantalón azul para los chicos... »",
    explication: "« Camisa blanca y pantalón azul para los chicos y falda azul para las chicas » : chemise blanche + pantalon bleu pour les garçons, jupe bleue pour les filles.",
  },
  {
    id: "espagnol-13b", matiere: "espagnol", chapitre: "Uniformes: Cuba", difficulte: 2,
    type: "qcm", question: "Et l'uniforme des filles, d'après le même document ?",
    choix: ["Camisa blanca y falda azul", "Camisa blanca y pantalón azul", "Vestido azul", "Camiseta blanca y vaqueros"], bonne: 0,
    indice: "Même chemise que les garçons, mais pas le même bas.",
    explication: "Les filles portent « camisa blanca » (comme les garçons) et « falda azul » (jupe bleue) au lieu du pantalon.",
  },

  // ---- Mi horario de clases ----
  {
    id: "espagnol-14", matiere: "espagnol", chapitre: "Mi horario de clases", difficulte: 2,
    type: "qcm", question: "D'après l'horaire du document (« Mi horario de clases »), à quelle heure commencent les cours chaque jour ?",
    choix: ["A las ocho y media", "A las ocho", "A las nueve", "A las siete y media"], bonne: 0,
    indice: "C'est la première ligne du tableau, tous les jours.",
    explication: "Les cours commencent « a las ocho y media » (8h30) tous les jours de la semaine, d'après le tableau.",
  },
  {
    id: "espagnol-14b", matiere: "espagnol", chapitre: "Mi horario de clases", difficulte: 2,
    type: "reponse_courte", question: "D'après l'horaire, combien de minutes dure le recreo (la récréation) ? (nombre uniquement)",
    reponses: ["30", "treinta"],
    indice: "Le recreo va de 11:00 à 11:30 dans le tableau.",
    explication: "Le recreo dure 30 minutes (treinta minutos), de 11h00 à 11h30.",
  },
  {
    id: "espagnol-14c", matiere: "espagnol", chapitre: "Mi horario de clases", difficulte: 2,
    type: "vrai_faux", question: "D'après le document, la matière « Sociales » correspond à l'histoire et à la géographie.",
    reponse: true,
    indice: "C'est indiqué en note de bas de tableau (renvoi n°1).",
    explication: "Vrai : la note 1 du document précise « Sociales = histoire et géographie ».",
  },
  {
    id: "espagnol-14d", matiere: "espagnol", chapitre: "Mi horario de clases", difficulte: 2,
    type: "qcm", question: "D'après le tableau, les cours du vendredi se terminent par quelle matière (13:30-14:30) ?",
    choix: ["Biología y geología", "Francés", "Matemáticas", "Música"], bonne: 0,
    indice: "Regarde la dernière case de la colonne « Viernes ».",
    explication: "Le vendredi, le dernier cours (13:30-14:30) est « Biología y geología ».",
  },

  // ---- Llegar al colegio es una aventura (lago Titicaca) ----
  {
    id: "espagnol-15", matiere: "espagnol", chapitre: "Llegar al colegio: el lago Titicaca", difficulte: 2,
    type: "qcm", question: "D'après le document « Llegar al colegio es una aventura », comment les deux enfants vont-ils à l'école ?",
    choix: ["Remando (en ramant, en barque)", "Nadando (en nageant)", "A pie (à pied)", "En autobús"], bonne: 0,
    indice: "Ils vivent près du lac Titicaca et n'ont pas de bateau à moteur.",
    explication: "Les enfants vont à l'école « remando » (en ramant), en pirogue sur le lac.",
  },
  {
    id: "espagnol-15b", matiere: "espagnol", chapitre: "Llegar al colegio: el lago Titicaca", difficulte: 2,
    type: "qcm", question: "Pourquoi les enfants n'ont-ils pas leur propre bateau (bote), d'après la correction du document ?",
    choix: ["Le père l'utilise pour pêcher", "Il est cassé", "Ils préfèrent marcher", "L'école le leur interdit"], bonne: 0,
    indice: "C'est une réponse liée à l'activité du père.",
    explication: "« Los niños no tienen bote porque el padre la utiliza para pescar » : le père utilise le bateau pour la pêche.",
  },
  {
    id: "espagnol-15c", matiere: "espagnol", chapitre: "Llegar al colegio: el lago Titicaca", difficulte: 1,
    type: "vrai_faux", question: "D'après le document, les deux enfants arrivent toujours à l'heure à l'école.",
    reponse: false,
    indice: "La correction du questionnaire indique « falso » pour cette affirmation.",
    explication: "Faux : d'après la correction, « los dos niños siempre llegan a la hora » est marqué falso.",
  },
  {
    id: "espagnol-15d", matiere: "espagnol", chapitre: "Llegar al colegio: el lago Titicaca", difficulte: 2,
    type: "reponse_courte", question: "D'après la correction, combien de temps les enfants mettent-ils pour aller de chez eux à l'école ? (un mot : media)",
    reponses: ["media hora", "media"],
    indice: "« Tardan ___ hora en llegar al cole. »",
    explication: "« Tardan media hora en llegar al cole » : ils mettent une demi-heure.",
  },

  // ---- El lago Titicaca (culture) ----
  {
    id: "espagnol-11", matiere: "espagnol", chapitre: "Cultura: el lago Titicaca", difficulte: 1,
    type: "qcm", question: "Le lac Titicaca se situe à la frontière entre quels deux pays ?",
    choix: ["Perú y Bolivia", "México y Cuba", "España y Portugal", "Chile y Argentina"], bonne: 0,
    indice: "C'est le plus grand lac d'Amérique du Sud, à plus de 3 800 mètres d'altitude.",
    explication: "El lago Titicaca se encuentra en la frontera entre Perú y Bolivia : c'est un lieu sacré pour les Incas, où vit la communauté des Uros sur des îles flottantes.",
  },
  {
    id: "espagnol-11b", matiere: "espagnol", chapitre: "Cultura: el lago Titicaca", difficulte: 2,
    type: "qcm", question: "La comunidad de los Uros, qui vit sur le lac Titicaca, habite sur des îles faites avec quel matériau ?",
    choix: ["La planta totora (un roseau)", "Du bois flotté", "Des rochers volcaniques", "Du bambou"], bonne: 0,
    indice: "C'est une plante sauvage qui pousse dans le lac.",
    explication: "« Vive en islas flotantes hechas con la planta silvestre totora » : les îles flottantes des Uros sont faites avec le roseau totora.",
  },
  {
    id: "espagnol-11c", matiere: "espagnol", chapitre: "Cultura: el lago Titicaca", difficulte: 2,
    type: "reponse_courte", question: "À combien de mètres d'altitude se situe le lac Titicaca (au minimum, d'après le document) ? (nombre uniquement)",
    reponses: ["3800", "3.800", "3 800"],
    indice: "« Está a más de ___ metros de altitud. »",
    explication: "Le lac Titicaca est situé à plus de 3 800 mètres d'altitude.",
  },

  // ============================ ANGLAIS ============================
  // ---- Lesson: Yearbooks in America ----
  {
    id: "anglais-1", matiere: "anglais", chapitre: "Yearbooks in America", difficulte: 1,
    type: "qcm", question: "In the United States, what is a « yearbook »?",
    choix: ["A book of memories from the school year (photos, events...)", "A dictionary used in English class", "The school's weekly timetable", "A letter sent to parents"], bonne: 0,
    indice: "Il contient plein de photos et de souvenirs de l'année scolaire.",
    explication: "Un « yearbook » est une tradition scolaire aux États-Unis : un livre-souvenir de l'année, avec des photos et des moments marquants.",
  },
  {
    id: "anglais-2", matiere: "anglais", chapitre: "Yearbooks in America", difficulte: 1,
    type: "vrai_faux", question: "Les « yearbooks » sont une tradition scolaire propre aux États-Unis.",
    reponse: true,
    indice: "C'est précisément ce que dit le document.",
    explication: "Vrai : les yearbooks font partie de la vie scolaire américaine, contrairement à la France où cette tradition n'existe pas vraiment.",
  },
  {
    id: "anglais-3", matiere: "anglais", chapitre: "Yearbooks in America", difficulte: 2,
    type: "qcm", question: "D'après le document, laquelle de ces choses ne se trouve PAS typiquement dans un yearbook ?",
    choix: ["The teachers' home addresses", "Portrait photos of students and teachers", "Photos of sports teams and their results", "Photos from school events and trips"], bonne: 0,
    indice: "Trois de ces réponses sont explicitement citées dans le document ; une seule n'a rien à y faire.",
    explication: "Un yearbook contient des photos (élèves, professeurs, équipes sportives, événements, voyages scolaires) — jamais des informations privées comme une adresse.",
  },
  {
    id: "anglais-4", matiere: "anglais", chapitre: "Yearbooks in America", difficulte: 2,
    type: "qcm", question: "Sur la photo du document (des élèves dans un collège au Texas), que font les élèves avec leurs yearbooks ?",
    choix: ["They are signing them", "They are selling them", "They are throwing them away", "They are reading them silently"], bonne: 0,
    indice: "C'est une habitude très répandue aux États-Unis en fin d'année : écrire un petit mot dans le yearbook d'un camarade.",
    explication: "« To sign » = signer : les élèves américains signent (et écrivent souvent un petit mot) dans les yearbooks de leurs camarades en fin d'année.",
  },
  {
    id: "anglais-5", matiere: "anglais", chapitre: "Yearbooks in America", difficulte: 1,
    type: "reponse_courte", question: "Comment dit-on « un souvenir » en anglais, comme dans « a book of ___ » ? (un mot)",
    reponses: ["memory", "memories"],
    indice: "C'est un mot qu'on retrouve aussi dans « to memorize ».",
    explication: "« A memory » (pluriel : memories) = un souvenir. Un yearbook est un « book of memories ».",
  },
  {
    id: "anglais-6", matiere: "anglais", chapitre: "Yearbooks in America", difficulte: 1,
    type: "qcm", question: "Quelle traduction correspond le mieux à « yearbook » ?",
    choix: ["Un livre-souvenir de l'année scolaire (une sorte d'annuaire)", "Un cahier de texte", "Un bulletin de notes", "Un emploi du temps"], bonne: 0,
    indice: "Ce n'est ni un carnet de notes, ni un emploi du temps : c'est un objet-souvenir.",
    explication: "« Yearbook » se traduit par « annuaire scolaire » ou « livre-souvenir de l'année », rempli de photos et de souvenirs.",
  },
  {
    id: "anglais-7", matiere: "anglais", chapitre: "Yearbooks in America", difficulte: 1,
    type: "qcm", question: "Dans l'expression « class photos », que désigne le mot « class » ?",
    choix: ["La classe (le groupe d'élèves)", "Un cours de sport", "Une salle de classe vide", "Un devoir noté"], bonne: 0,
    indice: "Pense à une photo de groupe prise devant l'école.",
    explication: "« Class photos » = les photos de classe : toute la classe posant ensemble pour une photo souvenir.",
  },
];

function getMatiere(code) {
  return MATIERES.find((m) => m.code === code) || null;
}

function getExercicesParMatiere(code) {
  return EXERCICES.filter((e) => e.matiere === code);
}
