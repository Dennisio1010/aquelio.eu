---
name: brief-projet
description: Met en place un nouveau projet ou mandat client pour l'équipe d'agents marketing. Établit le brief (offre, marchés, cible, conversion, concurrents, conformité, budget) en lisant ce qui existe déjà et en posant le minimum de questions, puis crée l'arborescence marketing/. Utiliser au démarrage d'un projet, à l'arrivée d'un client, ou quand un agent signale qu'il n'y a pas de brief.
---

# Brief projet — l'onboarding d'un nouveau mandat

Un agent portable ne vaut que par le contexte qu'on lui donne. Ce skill
produit ce contexte : `marketing/BRIEF.md`, le fichier que tous les agents
lisent en premier.

Tu vises **cinq minutes de questions maximum**. Tout ce que tu peux
découvrir toi-même, tu ne le demandes pas.

## 1. Chercher avant de demander

Dans cet ordre :
- Un brief existant : `marketing/BRIEF.md`, `**/BRIEF.md`, `CLAUDE.md`,
  `README.md`, les docs de marque du dépôt (charte, fournisseurs, specs).
- Le produit lui-même : pages du site dans le dépôt, textes, prix, langues
  disponibles, formulaires — ils disent l'offre et la conversion.
- Le tracking déjà en place : pixels, balises de conversion, événements.
  Ils révèlent ce qui est réellement mesuré aujourd'hui.
- Le site en ligne via WebFetch si le dépôt n'est pas la source.
- Les comptes sociaux via `getBrandSettings` (Metricool) s'ils sont
  connectés.

Présente ensuite ce que tu as trouvé sous forme d'affirmations à corriger,
pas de questions ouvertes : « Je comprends que la conversion suivie est la
demande de devis, pas l'achat — exact ? » Le décideur corrige plus vite
qu'il ne rédige.

## 2. Ne demander que le décisif

Ces points-là ne se devinent jamais et changent tout le travail en aval :

1. **La conversion qui compte** — lead, achat, installation, abonnement,
   rendez-vous. Et sa valeur approximative, si elle est connue.
2. **Les marchés et les langues**, avec les variantes régionales.
3. **Le budget et l'horizon**.
4. **Les concurrents** — 3 à 5, avec les **URL de leurs profils sociaux**
   (indispensables à `veille-creative`) et de leur site.
5. **Les interdits** — ce que la marque ou le client refuse de dire, les
   contraintes légales du secteur, les engagements déjà pris.
6. **Qui décide et qui exécute** — surtout sur un mandat : qui valide une
   créa, qui a la main sur le compte publicitaire.

Le reste (ton, cible détaillée, saisonnalité) s'affine avec l'usage.
Un brief à 80 % aujourd'hui vaut mieux qu'un brief parfait la semaine
prochaine.

## 3. Écrire et installer

- Copie `.claude/templates/BRIEF-PROJET.md` vers `marketing/BRIEF.md` et
  remplis-le. **Laisse visibles les trous** : écris `À CONFIRMER` plutôt
  qu'une hypothèse déguisée en fait — les agents sont instruits de traiter
  un brief incertain comme incertain.
- Crée `marketing/veille/`, `marketing/campagnes/`, `marketing/plans/`.
- Si le projet contient des données client, vérifie qu'elles sont exclues
  du versionnement (`.gitignore`) avant d'écrire quoi que ce soit.

## 4. Rendre compte

Termine en affichant : le chemin du brief, les points restés `À CONFIRMER`,
et la première action que tu recommandes (en général `/manager-marketing`
avec un objectif précis).
