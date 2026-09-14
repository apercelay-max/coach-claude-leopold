# Claude — Les révisions de Léopold

Appli web de **révision uniquement** pour accompagner **Léopold (12 ans, 5ème)** : des exercices par matière, correction immédiate, indices à la demande, un bonhomme **Claude** animé qui encourage avec bienveillance (et beaucoup d'humour), et un email de résumé envoyé à la fin de chaque séance.

Aucune installation, aucune base de données, aucune clé API : tout est en **HTML/CSS/JS pur**, le contenu est écrit directement dans le code. Ça tourne aussi bien en ouvrant simplement `index.html` que sur GitHub Pages.

## Ouvrir l'appli

Double-clique sur `index.html`, ou plus simple depuis un terminal :

```bash
open index.html
```

## Ce qui existe

- **Barre du bas** : une capsule flottante « liquid glass » (même style que PPL Tracker), avec un onglet par matière + **Stats** + **Réglages**. Un onglet matière ouvre l'écran de la matière : la liste des chapitres (choisir un chapitre précis ou tout réviser) et un petit résumé de maîtrise.
- **Réviser** : le cœur de l'appli. Des exercices avec correction immédiate, indice à la demande, et les réactions animées de Claude (jamais triste sur une mauvaise réponse, toujours un mot gentil et un peu d'humour).
- **📊 Stats** : un tableau de bord de progression, alimenté par un suivi **100 % local** (`localStorage`, clé `coach-claude-leopold:stats-v1`) de chaque séance. Courbe de score par séance, maîtrise par matière (dépliable par chapitre), « à revoir en priorité », dernières séances, filtres par matière. Rien ne quitte le navigateur.
- **⚙️ Réglages** : personnalisation façon PPL — couleur d'accent (6 + perso), thème Système/Clair/Sombre, nuit encrée (fond noir profond), taille du texte, coins arrondis, police, animations, confettis, mascotte (afficher / taille / blague au clic), contraste élevé, effet verre et libellés de la barre. Mémorisé dans `localStorage` (clé `coach-claude-leopold:reglages-v1`), appliqué via des attributs `data-*` sur `<html>`.
- **Résumé de fin de séance** : à la fin d'une session, un bouton envoie un email (brouillon Gmail pré-rempli) avec la matière travaillée, le score, et les points à revoir. La première fois, l'appli demande l'adresse email à utiliser et la garde uniquement dans le navigateur (`localStorage`) — elle n'est jamais écrite dans le code ni publiée.

Il n'y a toujours **ni mode évaluation, ni XP/niveaux/étoiles** : les stats sont un miroir de progression (pour Léopold), le résumé par email reste le suivi côté parents.

## Contenu = les vrais documents de Léopold

Les matières et exercices de [`js/data.js`](js/data.js) sont construits à partir des vrais cours et devoirs de Léopold, déposés dans le dossier `Léopold doc 5B/` (à la racine du projet). **Seules les matières qui ont au moins un document dans ce dossier apparaissent dans l'appli.**

Contenu actuel (~99 exercices, environ 1h30-2h de révision cumulée) :

- **➗ Mathématiques** : nombres décimaux (cours), vitesse et circonférence (devoir sur l'ISS), vocabulaire de maths en anglais (cours DNL), priorités opératoires (fiche de méthode).
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
index.html          Écrans : accueil, matières, exercice, résultats, matière, stats, réglages
css/style.css        Design system (tokens clair/sombre), styles, barre du bas, animations
js/data.js           Contenu : matières + banque d'exercices
js/mascotte.js       Phrases (encouragements, blagues, accueil...) + animations de la mascotte
js/app.js            Logique de révision (navigation, correction, email de résumé)
js/stats.js          Suivi local des séances + tableau de bord « Stats »
js/reglages.js       Réglages de personnalisation (stockage + application + écran)
js/nav.js            Barre du bas « liquid glass » + écran d'une matière + routage
Léopold doc 5B/      Les vrais documents de Léopold (source du contenu, non utilisés par l'appli elle-même)
```

Le design est piloté par un système de variables CSS (`css/style.css`, en tête) : palette claire par
défaut, palette sombre via `@media (prefers-color-scheme: dark)` **et** `:root[data-theme="dark"]`,
couleur d'accent via `:root[data-accent="…"]` (les blocs de thème ne redéfinissent jamais `--accent`
pour éviter le piège de spécificité). `js/reglages.js` est la source de vérité ; un mini-script en
tête de `index.html` réapplique thème + accent avant le premier rendu (anti-flash).

## Publier sur GitHub Pages

1. Crée un dépôt GitHub (public ou privé) et pousse ce dossier dedans.
2. Dans les paramètres du dépôt → **Pages** → Source : branche `main`, dossier `/ (root)`.
3. L'appli est en ligne à `https://<utilisateur>.github.io/<depot>/` en quelques minutes.

⚠️ Sur un compte GitHub gratuit, **GitHub Pages nécessite que le dépôt soit public**. Comme rien de personnel n'est écrit en dur dans le code (l'email de résumé est demandé à la volée et reste dans le navigateur), garder le dépôt public ne pose pas de problème de confidentialité.

## Prochaines étapes possibles

- Ajouter d'autres documents dans `Léopold doc 5B/` au fil de l'année (Claude les intègre à la demande).
- Adapter les phrases de Claude par matière dans `js/mascotte.js` si une nouvelle matière arrive.
