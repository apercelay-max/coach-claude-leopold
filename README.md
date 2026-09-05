# Claude — Les révisions de Léopold

Appli web de **révision uniquement** pour accompagner **Léopold (12 ans, 5ème)** : des exercices par matière, correction immédiate, indices à la demande, un bonhomme **Claude** animé qui encourage avec bienveillance (et beaucoup d'humour), et un email de résumé envoyé à la fin de chaque séance.

Aucune installation, aucune base de données, aucune clé API : tout est en **HTML/CSS/JS pur**, le contenu est écrit directement dans le code. Ça tourne aussi bien en ouvrant simplement `index.html` que sur GitHub Pages.

## Ouvrir l'appli

Double-clique sur `index.html`, ou plus simple depuis un terminal :

```bash
open index.html
```

## Ce qui existe

- **Réviser** : c'est la seule chose que fait l'appli. Un écran d'accueil, un choix de matière, puis des exercices avec correction immédiate, indice à la demande, et les réactions animées de Claude (jamais triste sur une mauvaise réponse, toujours un mot gentil et un peu d'humour).
- **Résumé de fin de séance** : à la fin d'une session, un bouton envoie un email (brouillon Gmail pré-rempli) avec la matière travaillée, le score, et les points à revoir. La première fois, l'appli demande l'adresse email à utiliser et la garde uniquement dans le navigateur (`localStorage`) — elle n'est jamais écrite dans le code ni publiée.

Il n'y a **ni mode évaluation, ni suivi de progrès (XP/niveaux/étoiles)** : l'appli est volontairement limitée à la révision, et le résumé par email fait office de suivi pour les parents.

## Contenu = les vrais documents de Léopold

Les matières et exercices de [`js/data.js`](js/data.js) sont construits à partir des vrais cours et devoirs de Léopold, déposés dans le dossier `Léopold doc 5B/` (à la racine du projet). **Seules les matières qui ont au moins un document dans ce dossier apparaissent dans l'appli.**

Contenu actuel (~39 exercices, environ 1h de révision cumulée) :

- **➗ Mathématiques** : nombres décimaux (cours), vitesse et circonférence (devoir sur l'ISS), vocabulaire de maths en anglais (cours DNL).
- **🇪🇸 Espagnol** : vocabulaire, conjugaison, la rutina, l'heure, comparatifs, ser/estar, l'obligation, culture (support « la vuelta al cole »).
- **🇬🇧 Anglais** : compréhension de texte sur les yearbooks américains.

Dès que de nouveaux documents arrivent dans `Léopold doc 5B/` (nouvelle matière ou nouveau chapitre), il suffit de redemander à Claude de « re-scanner le dossier » pour mettre à jour `MATIERES` et `EXERCICES` en conséquence.

## Ajouter du contenu à la main

Dans `js/data.js`, chaque exercice suit ce format :

```js
{
  id: "maths-22",
  matiere: "maths",              // doit correspondre à un code dans MATIERES
  chapitre: "Nom du chapitre",
  difficulte: 2,                  // 1 à 3
  type: "qcm",                    // "qcm" | "vrai_faux" | "reponse_courte"
  question: "Énoncé de la question",
  choix: ["a", "b", "c", "d"],    // uniquement pour "qcm"
  bonne: 0,                       // index de la bonne réponse, pour "qcm"
  // reponse: true,                // pour "vrai_faux"
  // reponses: ["mot1", "mot2"],   // pour "reponse_courte" (comparaison sans accents/casse)
  indice: "Un petit coup de pouce",
  explication: "Pourquoi c'est la bonne réponse",
}
```

Pour ajouter une nouvelle matière : une ligne dans `MATIERES` (code, nom, emoji, couleur), et une couleur correspondante dans `COULEURS_MATIERE` (`js/app.js`).

## Structure du projet

```
index.html          Écrans : accueil, matières, exercice, résultats
css/style.css        Styles + animations (mascotte, confettis...)
js/data.js           Contenu : matières + banque d'exercices
js/mascotte.js       Phrases (encouragements, blagues, accueil...) + animations de la mascotte
js/app.js            Logique de l'appli (navigation, correction, email de résumé)
Léopold doc 5B/      Les vrais documents de Léopold (source du contenu, non utilisés par l'appli elle-même)
```

## Publier sur GitHub Pages

1. Crée un dépôt GitHub (public ou privé) et pousse ce dossier dedans.
2. Dans les paramètres du dépôt → **Pages** → Source : branche `main`, dossier `/ (root)`.
3. L'appli est en ligne à `https://<utilisateur>.github.io/<depot>/` en quelques minutes.

⚠️ Sur un compte GitHub gratuit, **GitHub Pages nécessite que le dépôt soit public**. Comme rien de personnel n'est écrit en dur dans le code (l'email de résumé est demandé à la volée et reste dans le navigateur), garder le dépôt public ne pose pas de problème de confidentialité.

## Prochaines étapes possibles

- Ajouter d'autres documents dans `Léopold doc 5B/` au fil de l'année (Claude les intègre à la demande).
- Adapter les phrases de Claude par matière dans `js/mascotte.js` si une nouvelle matière arrive.
