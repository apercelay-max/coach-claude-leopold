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

  // ============================ ESPAGNOL ============================
  // ---- Support « la vuelta al cole » ----
  {
    id: "espagnol-1", matiere: "espagnol", chapitre: "Vocabulario: la vuelta al cole", difficulte: 1,
    type: "qcm", question: "Que signifie « la vuelta » en français ?",
    choix: ["le retour", "le voyage", "la classe", "le sac"], bonne: 0,
    indice: "« La vuelta al cole », c'est ce qui se passe en septembre !",
    explication: "« La vuelta » signifie « le retour » (ou « un tour ») : « la vuelta al cole » = la rentrée des classes.",
  },
  {
    id: "espagnol-2", matiere: "espagnol", chapitre: "Verbos regulares en presente", difficulte: 1,
    type: "qcm", question: "Conjugue « comer » (manger) à la 2e personne du singulier : « tú ___ ».",
    choix: ["comes", "come", "coméis", "coman"], bonne: 0,
    indice: "Les verbes réguliers en -er prennent -es à la 2e personne du singulier.",
    explication: "« Tú comes » : les verbes en -ER prennent -o, -es, -e, -emos, -éis, -en au présent.",
  },
  {
    id: "espagnol-3", matiere: "espagnol", chapitre: "Verbos irregulares", difficulte: 2,
    type: "qcm", question: "Conjugue le verbe « IR » (aller) à la personne « vosotros ».",
    choix: ["vais", "vamos", "van", "voy"], bonne: 0,
    indice: "IR : voy, vas, va, vamos, vais, van.",
    explication: "« Vosotros vais » : IR est un verbe très irrégulier à apprendre par cœur (voy, vas, va, vamos, vais, van).",
  },
  {
    id: "espagnol-4", matiere: "espagnol", chapitre: "Gramática: la rutina", difficulte: 2,
    type: "qcm", question: "Que signifie « soler + infinitivo » (ex : « suelo desayunar a las siete ») ?",
    choix: ["avoir l'habitude de", "vouloir", "devoir", "pouvoir"], bonne: 0,
    indice: "C'est la structure utilisée pour parler de sa routine habituelle.",
    explication: "« Soler + infinitif » = avoir l'habitude de. « Suelo desayunar a las siete » = j'ai l'habitude de prendre le petit-déjeuner à sept heures.",
  },
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
    id: "espagnol-7", matiere: "espagnol", chapitre: "La hora", difficulte: 2,
    type: "qcm", question: "Comment dit-on « 13:30 » en espagnol ?",
    choix: ["Es la una y media (de la tarde)", "Son las trece y media", "Es la una menos media", "Son la una y media"], bonne: 0,
    indice: "1h de l'après-midi se dit « la una », pas « las trece ».",
    explication: "« Es la una y media (de la tarde) » : pour 1 heure on utilise « es la una », et « y media » pour la demie.",
  },
  {
    id: "espagnol-8", matiere: "espagnol", chapitre: "Comparativos", difficulte: 2,
    type: "reponse_courte", question: "Complète : « Ramón es ___ clásico que Carlos. » (comparatif de supériorité, un mot)",
    reponses: ["mas", "más"],
    indice: "Le comparatif de supériorité en espagnol se forme avec ce petit mot + adjectif + que.",
    explication: "« Ramón es más clásico que Carlos » : más... que = plus... que.",
  },
  {
    id: "espagnol-9", matiere: "espagnol", chapitre: "Ser y estar", difficulte: 2,
    type: "qcm", question: "Complète : « Hoy nosotros ___ un poco cansados. » (fatigués, aujourd'hui)",
    choix: ["estamos", "somos", "estáis", "son"], bonne: 0,
    indice: "Un état temporaire (être fatigué aujourd'hui) se dit avec ESTAR, pas SER.",
    explication: "« Estamos cansados » : ESTAR sert pour un état passager (fatigue, humeur), SER pour une qualité permanente.",
  },
  {
    id: "espagnol-10", matiere: "espagnol", chapitre: "Expresar la obligación", difficulte: 1,
    type: "qcm", question: "Que signifie « HAY QUE + infinitivo » (ex : « hay que escuchar a la profesora ») ?",
    choix: ["Il faut...", "Je veux...", "J'ai...", "Je peux..."], bonne: 0,
    indice: "C'est une obligation générale, qui ne dépend pas d'une personne précise.",
    explication: "« Hay que + infinitif » = il faut... (obligation impersonnelle). « Tener que » et « deber » expriment aussi l'obligation, mais pour une personne précise (« tú tienes que... », « debes... »).",
  },
  {
    id: "espagnol-11", matiere: "espagnol", chapitre: "Cultura: el lago Titicaca", difficulte: 1,
    type: "qcm", question: "Le lac Titicaca se situe à la frontière entre quels deux pays ?",
    choix: ["Perú y Bolivia", "México y Cuba", "España y Portugal", "Chile y Argentina"], bonne: 0,
    indice: "C'est le plus grand lac d'Amérique du Sud, à plus de 3 800 mètres d'altitude.",
    explication: "El lago Titicaca se encuentra en la frontera entre Perú y Bolivia : c'est un lieu sacré pour les Incas, où vit la communauté des Uros sur des îles flottantes.",
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
