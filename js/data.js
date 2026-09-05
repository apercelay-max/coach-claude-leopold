/* =========================================================================
   Claude — données
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
  { code: "espagnol", nom: "Espagnol", emoji: "🇪🇸", couleur: "violet" },
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

  {
    id: "maths-7", matiere: "maths", chapitre: "Nombres décimaux", difficulte: 1,
    type: "qcm", question: "Une fraction décimale est une fraction dont le dénominateur est...",
    choix: ["une puissance de 10 (10, 100, 1000...)", "toujours un nombre pair", "toujours égal à 2", "un nombre premier"], bonne: 0,
    indice: "Pense à 1/10, 1/100, 1/1000…",
    explication: "Une fraction décimale a pour dénominateur 10, 100, 1000, etc. (une puissance de 10).",
  },
  {
    id: "maths-8", matiere: "maths", chapitre: "Nombres décimaux", difficulte: 1,
    type: "qcm", question: "Dans le nombre décimal 143,46, quelle est la partie décimale ?",
    choix: ["143", "46", "0,46", "1,4346"], bonne: 2,
    indice: "La partie décimale est ce qui se trouve après la virgule, et elle est toujours plus petite que 1.",
    explication: "143,46 = 143 (partie entière) + 0,46 (partie décimale, qui commence toujours par 0).",
  },
  {
    id: "maths-9", matiere: "maths", chapitre: "Nombres décimaux", difficulte: 2,
    type: "vrai_faux", question: "Le nombre 3 est un nombre décimal, car il peut s'écrire sous forme de fraction décimale (par exemple 30/10).",
    reponse: true,
    indice: "Un nombre décimal est un nombre qui peut s'écrire sous forme de fraction décimale, même les nombres entiers.",
    explication: "Vrai : 3 = 30/10 = 300/100, etc. Tout nombre entier est aussi un nombre décimal.",
  },
  {
    id: "maths-10", matiere: "maths", chapitre: "Nombres décimaux", difficulte: 2,
    type: "qcm", question: "Comment décompose-t-on 143,46 par rangs (centaines, dizaines, unités, dixièmes, centièmes) ?",
    choix: ["1×100 + 4×10 + 3×1 + 4×0,1 + 6×0,01", "1×1000 + 4×100 + 3×10 + 4 + 6", "14 + 3 + 46", "143 × 46"], bonne: 0,
    indice: "Chaque chiffre a une valeur selon son rang : centaines, dizaines, unités, dixièmes, centièmes…",
    explication: "143,46 = 1×100 + 4×10 + 3×1 + 4×0,1 + 6×0,01 : chaque chiffre est multiplié par la valeur de son rang.",
  },
  {
    id: "maths-11", matiere: "maths", chapitre: "Nombres décimaux", difficulte: 2,
    type: "qcm", question: "Quel est le plus grand entre 3,05 et 3,007 ?",
    choix: ["3,05", "3,007", "Ils sont égaux", "Impossible à dire"], bonne: 0,
    indice: "Complète avec des zéros pour comparer : 3,050 et 3,007. Compare ensuite chiffre par chiffre après la virgule.",
    explication: "3,05 = 3,050. Aux dixièmes, 0 = 0 ; aux centièmes, 5 > 0. Donc 3,05 > 3,007, même si 3,007 a plus de chiffres.",
  },
  {
    id: "maths-12", matiere: "maths", chapitre: "Nombres décimaux", difficulte: 2,
    type: "qcm", question: "Range dans l'ordre croissant : 3,05 ; 3,007 ; 3,101 ; 2,99. Quel est le plus petit ?",
    choix: ["2,99", "3,007", "3,05", "3,101"], bonne: 0,
    indice: "Compare d'abord les parties entières : 2 ou 3 ?",
    explication: "2,99 a pour partie entière 2, alors que les trois autres ont pour partie entière 3. 2 < 3, donc 2,99 est le plus petit.",
  },
  {
    id: "maths-13", matiere: "maths", chapitre: "Nombres décimaux", difficulte: 1,
    type: "qcm", question: "Sur une demi-droite graduée, comment appelle-t-on le nombre associé à un point ?",
    choix: ["son abscisse", "son origine", "son unité", "son échelle"], bonne: 0,
    indice: "C'est le mot utilisé en cours quand on place des points comme A, B, C sur la droite graduée.",
    explication: "Le nombre associé à un point d'une demi-droite graduée s'appelle l'abscisse de ce point.",
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

  // ------------------------------ Espagnol ------------------------------
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
];

function getMatiere(code) {
  return MATIERES.find((m) => m.code === code) || null;
}

function getExercicesParMatiere(code) {
  return EXERCICES.filter((e) => e.matiere === code);
}
