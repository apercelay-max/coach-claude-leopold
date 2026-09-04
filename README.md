# Claude — Les révisions de Léopold

Appli web pour accompagner **Léopold (12 ans, 5ème)** dans ses révisions : des exercices par matière, un bonhomme **Claude** animé qui encourage avec bienveillance (et beaucoup d'humour), et un mode évaluation avec note sur 20.

Aucune installation, aucune base de données, aucune clé API : tout est en **HTML/CSS/JS pur**, le contenu est écrit directement dans le code, et la progression est sauvegardée dans le navigateur (`localStorage`). Ça tourne aussi bien en ouvrant simplement `index.html` que sur GitHub Pages.

## Ouvrir l'appli

Double-clique sur `index.html`, ou plus simple depuis un terminal :

```bash
open index.html
```

## Ce qui existe déjà

- **Réviser** : exercices d'une matière (Maths, Français, Histoire-Géo, Sciences, Anglais), correction immédiate, indice à la demande, réactions animées de Claude.
- **Évaluation** : mêmes matières, mais sans correction immédiate ni indices (comme un vrai contrôle) — récap détaillé et note /20 à la fin.
- **Claude** : bonhomme animé (SVG + CSS, couleur et étincelle qui reprennent l'identité visuelle de Claude), qui réagit différemment sur une bonne réponse (petit saut, confettis) ou une réponse à revoir (jamais triste, toujours un mot gentil et un peu d'humour). Cliquable à tout moment pour une blague.
- **Mes progrès** : XP, niveau, série de jours, étoiles par matière selon la meilleure évaluation.

## Contenu actuel = démonstration

Les ~30 exercices dans [`js/data.js`](js/data.js) sont un point de départ réaliste (niveau 5ème) mais générique. **Dès que les vrais documents/devoirs de Léopold arrivent, Claude les remplace par du contenu sur-mesure** — c'est juste une question d'ajouter des objets au tableau `EXERCICES`, rien d'autre à modifier.

## Ajouter du contenu à la main

Dans `js/data.js`, chaque exercice suit ce format :

```js
{
  id: "maths-7",
  matiere: "maths",              // doit correspondre à un code dans MATIERES
  chapitre: "Nombres relatifs",
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

## Structure du projet

```
index.html          Toutes les vues (accueil, matières, exercice, résultats, progrès)
css/style.css        Styles + toutes les animations (mascotte, confettis...)
js/data.js           Contenu : matières + banque d'exercices
js/mascotte.js       Phrases (encouragements, blagues, accueil...) + animations de la mascotte
js/app.js            Logique de l'appli (navigation, correction, progression)
```

## Publier sur GitHub Pages

1. Crée un dépôt GitHub (public ou privé) et pousse ce dossier dedans.
2. Dans les paramètres du dépôt → **Pages** → Source : branche `main`, dossier `/ (root)`.
3. L'appli est en ligne à `https://<utilisateur>.github.io/<depot>/` en quelques minutes.

## Prochaines étapes possibles

- Remplacer le contenu de démonstration par les vrais devoirs de Léopold.
- Ajouter d'autres matières ou chapitres au fil de l'année.
- Pousser le dépôt sur GitHub (nom du dépôt et visibilité à définir).
