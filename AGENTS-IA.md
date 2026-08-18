# Le studio d'agents IA

Une équipe d'employés IA qui exécutent des tâches précises, sur **n'importe
quel projet** : une marque à soi, un produit digital, le mandat d'un client.
Chaque employé est un fichier Markdown. Rien à héberger, aucun abonnement
supplémentaire.

L'organigramme complet — qui est qui, qui fait quoi — est dans
**[`.claude/STUDIO.md`](.claude/STUDIO.md)**.

## Le principe

> **L'agent porte la compétence. Le projet porte le contexte.**

Chercher des mots-clés, c'est le même métier pour une boutique de mobilier
et pour une app. Ce qui change, c'est l'offre, le marché, la conversion et
les interdits. Donc :

- les **agents** sont écrits une fois et installés globalement — le même
  fichier sert tous les projets ;
- chaque projet a un **brief** (`marketing/BRIEF.md`) que les agents lisent
  en premier ;
- les **livrables** restent dans le dépôt du projet concerné.

Un agent sans brief s'arrête et le réclame. C'est volontaire : un plan bâti
sur une offre supposée coûte plus cher qu'un plan non fait — et devant un
client, il coûte le client.

## L'équipe en un coup d'œil

```
                    Victor  /studio
                       │
   ┌───────────┬───────┴────────┬──────────────┐
   ▼           ▼                ▼              ▼
Contenu    Acquisition     Produit & dev   Commercial
Nadia         Karim            Yanis          Amine
Nina          Sofia            Nour           Léa
Malik         Théo             Chloé
Milo          Adrien
Inès
```

Les prénoms sont des propositions — ce sont vos employés, renommez-les.

## Installation

Une fois, pour rendre le studio disponible dans **tous** vos projets :

```bash
./.claude/install.sh              # copie vers ~/.claude
```

Ou dans un projet précis — en mandat client, le studio part avec le dépôt :

```bash
./.claude/install.sh /chemin/vers/le-projet-client
```

Ce dépôt reste la source de vérité : après avoir modifié un agent, relancez
le script pour propager.

## Usage

**Nouveau projet ou nouveau client :**

```
/brief-projet
```
Lit le site, le code et le tracking existants, pose le minimum de questions
(la conversion qui compte, les marchés, le budget, les concurrents avec les
URL de leurs profils, les interdits), écrit `marketing/BRIEF.md` et crée
l'arborescence. Cinq minutes.

**Ensuite :**

```
/studio prépare le lancement du produit sur le marché allemand en septembre,
        budget 1500 €, objectif demandes de devis
```
Victor charge le brief, mobilise les agents utiles **en parallèle**,
contrôle leurs retours et écrit un plan unique dans `marketing/plans/`.

**Ou un employé seul, pour un besoin ciblé :**

```
Lance veille-creative sur les 3 concurrents du brief, marché DE
```

## Ce que la veille vidéo fait réellement

C'est le point où la plupart des « agents veille » mentent. Nadia **regarde
vraiment les vidéos** via TranscriptX : images horodatées, transcription
segmentée, et les **vues, likes et commentaires réels** — TikTok, Instagram,
YouTube, Facebook, X, LinkedIn.

Elle calcule deux chiffres que personne ne donne :
- le **taux d'engagement** = (likes + commentaires) / vues ;
- l'**indice de surperformance** = vues / médiane des 8-15 dernières vidéos
  du même compte. 400 000 vues sur un compte à 15 000 de médiane, c'est un
  signal (×27) ; sur un compte à 2 millions, c'est un échec (×0,2).

**Sur la recherche « par sujet » :** aucune API publique ne donne « toutes
les vidéos sur un sujet ». Nadia la reconstruit — recherche web pour
identifier les comptes qui circulent, TikTok Creative Center pour les
hashtags et sons, Meta Ad Library pour les pubs actives par pays, puis
elle repasse chaque compte découvert par la liste de ses vidéos. C'est plus
lent qu'un bouton magique, et c'est le seul chemin honnête. Elle dit
toujours quel chemin elle a pris.

**Crédits :** `watch_url` coûte 2 crédits TranscriptX, `transcribe_url` 1.
Nadia vérifie la réserve, priorise les vidéos à fort indice, et signale une
réserve épuisée au lieu de rendre un rapport à trous.

## Les garde-fous, dans chaque agent

**Aucun chiffre inventé.** Le Keyword Planner et les gestionnaires de
publicités demandent une authentification que les agents n'ont pas. Toute
estimation sort marquée `à valider en interface`, et chaque affirmation
porte son URL et sa date. Un chiffre sans source est un bug — signalez-le.

**Conformité par secteur.** Santé, finance, minceur, crypto, alcool, jeu, et
les catégories spéciales Meta (emploi, logement, crédit) ont chacune leurs
règles. Le brief dit lesquelles s'appliquent ; chaque angle, script et
annonce sort étiqueté **OK / à reformuler / à écarter**.

**Personne ne publie, personne ne dépense.** Campagne, post, email,
déploiement, budget : le studio prépare, un humain valide et exécute.

**Cloisonnement des mandats.** Les données d'un client ne quittent jamais
son dépôt. Ce qui voyage d'un projet à l'autre, c'est la méthode.

## Ajouter un poste

Voir la fin de [`.claude/STUDIO.md`](.claude/STUDIO.md). En résumé : un
fichier dans `.claude/agents/`, une `description` qui dit **quand**
l'appeler, une étape 0 qui charge le brief, des sources nommées, un format
de livrable imposé, l'interdiction d'inventer, et le minimum d'outils.

Un détail qui a déjà mordu : les agents branchés sur un connecteur externe
(TranscriptX, Metricool) ne déclarent pas de liste `tools:` restreinte —
les identifiants de ces outils changent d'une connexion à l'autre et une
liste figée casse l'agent en silence.

## Automatiser

Une veille n'a de valeur que régulière. Une routine planifiée peut lancer
Victor chaque lundi sur un objectif fixe et écrire le plan de la semaine —
à créer sur demande, rien n'est planifié par défaut. Dans tous les cas la
règle ne bouge pas : le studio prépare, vous décidez.

## Où vivent les projets

Ce dépôt héberge le studio et le projet Aquelio (`marketing/BRIEF.md` en est
l'exemple rempli). Dès que le studio sert deux ou trois projets, il mérite
son propre dépôt — `install.sh` sait déjà le déployer partout ailleurs.
