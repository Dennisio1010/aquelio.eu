# Équipe d'agents IA marketing — pack portable

Des agents qui exécutent des tâches marketing précises, sur **n'importe
quel projet** : une marque à soi, un produit digital, le mandat d'un client
qui commande une campagne. Un agent est un fichier Markdown ; il n'y a rien
à héberger et rien à payer en plus.

## Le principe

> **L'agent porte la compétence. Le projet porte le contexte.**

La compétence « chercher des mots-clés » ne change pas entre une boutique de
mobilier et une app : ce qui change, c'est l'offre, le marché, la conversion
et les interdits. Donc :

- les **agents** sont écrits une fois et installés globalement — le même
  fichier sert tous les projets ;
- chaque projet a un **brief** (`marketing/BRIEF.md`) que les agents lisent
  en premier ;
- les **livrables** restent dans le dépôt du projet concerné.

Un agent sans brief s'arrête et le réclame. C'est volontaire : un plan bâti
sur une offre supposée coûte plus cher qu'un plan non fait — et devant un
client, il coûte le client.

## L'équipe

```
           Vous
            │
            ▼
   /manager-marketing        ← cadre, délègue, confronte, arbitre, livre UN plan
            │
      ┌─────┴──────┐
      ▼            ▼
veille-creative  recherche-mots-cles     ← exécutent, rapportent, sourcent
```

| Fichier | Rôle |
|---|---|
| `.claude/skills/manager-marketing/SKILL.md` | Le manager |
| `.claude/skills/brief-projet/SKILL.md` | Onboarding d'un nouveau projet ou client |
| `.claude/agents/veille-creative.md` | Ce qui performe en vidéo : concurrents, créateurs, pubs actives |
| `.claude/agents/recherche-mots-cles.md` | Mots-clés, négatifs, structure de compte, audiences, annonces |
| `.claude/templates/BRIEF-PROJET.md` | Le modèle de brief |
| `.claude/install.sh` | Installe le pack ailleurs |

## Installation

Une fois, pour rendre les agents disponibles dans **tous** vos projets :

```bash
./.claude/install.sh              # copie vers ~/.claude
```

Ou dans un projet précis — utile en mandat client, le pack part alors avec
le dépôt du client :

```bash
./.claude/install.sh /chemin/vers/le-projet-client
```

Ce dépôt reste la source de vérité : après avoir modifié un agent, relancez
le script pour propager.

## Usage type

**Nouveau client, nouveau projet :**

```
/brief-projet
```
Lit le site, le code et le tracking existants, pose le minimum de questions
(la conversion qui compte, les marchés, le budget, les concurrents avec les
URL de leurs profils, les interdits), écrit `marketing/BRIEF.md` et crée
l'arborescence. Cinq minutes.

**Ensuite, au quotidien :**

```
/manager-marketing prépare le lancement du produit sur le marché allemand
                   en septembre, budget 1500 €, objectif demandes de devis
```
Le manager charge le brief, lance les deux spécialistes **en parallèle**,
contrôle leurs retours (chiffres sourcés, cohérence, conformité,
faisabilité) et écrit un plan unique dans `marketing/plans/`.

**Ou un spécialiste seul, pour un besoin ciblé :**

```
Lance veille-creative sur les 3 concurrents du brief, marché DE
```

## Ce que la veille vidéo peut réellement faire

C'est le point où la plupart des « agents veille » mentent. Celui-ci
**regarde vraiment les vidéos** via TranscriptX : images horodatées,
transcription segmentée, et les **vues, likes et commentaires réels** —
sur TikTok, Instagram, YouTube, Facebook, X, LinkedIn et 1000+ plateformes.

Concrètement il peut : lister les vidéos récentes d'un concurrent depuis
l'URL de son profil, les regarder une par une, comparer chaque vidéo à la
médiane de son propre compte (400 000 vues sur un compte à 15 000, c'est le
signal ; sur un compte à 2 millions, c'est un échec), et en ressortir le
hook mot pour mot, la structure plan par plan et un script adapté à votre
projet.

S'y ajoutent la **Meta Ad Library** (toutes les pubs IG + FB actives par
pays — la date de première diffusion est le meilleur proxy de rentabilité),
le **TikTok Creative Center**, et **Metricool** pour vos propres comptes.

Ce qui reste hors de portée, et qu'aucun agent ne fera honnêtement : lire
votre feed personnel, ou sortir un classement global des « vidéos virales
du jour » — ça n'existe pas en accès public. On part donc des comptes et
des concurrents que vous nommez dans le brief.

## Les deux garde-fous, dans chaque agent

**Aucun chiffre inventé.** Le Keyword Planner et les gestionnaires de
publicités demandent une authentification que les agents n'ont pas. Toute
estimation sort marquée `à valider en interface`, et chaque affirmation
porte son URL et sa date. Un chiffre sans source dans un rapport est un bug
— signalez-le.

**Conformité par secteur.** Santé, finance, minceur, crypto, alcool, jeu,
et les catégories spéciales Meta (emploi, logement, crédit) ont chacune
leurs règles. Le brief dit lesquelles s'appliquent ; chaque angle proposé
sort étiqueté **OK / à reformuler / à écarter**, avec la raison.

Et une règle commune : **les agents préparent, un humain valide et exécute.**
Ils ne publient rien, ne dépensent rien, et ne transportent jamais les
données d'un client vers un autre projet — ce qui voyage, c'est la méthode.

## Ajouter un agent

Créez `.claude/agents/<nom>.md` :

```markdown
---
name: nom-de-lagent
description: Ce qu'il fait et QUAND l'utiliser — cette phrase déclenche sa
  sélection, elle compte autant que le reste du fichier.
tools: Read, Write, WebSearch, WebFetch
model: sonnet
---

Rôle. Étape 0 : lire marketing/BRIEF.md, s'arrêter s'il manque.
Sources autorisées avec leurs URL. Méthode. Garde-fous.
Format exact du livrable et où l'écrire.
```

Ce qui sépare un agent utile d'un agent décoratif :

- **une étape 0 qui charge le brief** — sans quoi il redevient spécifique à
  un projet, ou pire, il improvise ;
- **des sources nommées avec leurs URL** ;
- **un format de livrable imposé**, chemin compris : deux rapports au même
  format se comparent d'une semaine sur l'autre, deux rapports libres non ;
- **l'interdiction explicite d'inventer** ce qu'il ne peut pas mesurer ;
- **le minimum d'outils** dans `tools:` — un agent de veille n'a aucune
  raison de pouvoir modifier un site.

Ajoutez-le ensuite au tableau du manager et à celui-ci, puis relancez
`install.sh`.

Candidats naturels pour la suite : **rédaction d'annonces** (variantes
multilingues dans les limites de caractères), **analyse de performance**
(lecture des conversions et des exports de leads), **audit de compte**
(repérer le gaspillage dans un compte client existant), **veille
réglementaire** par secteur et par pays.

## Automatiser

Une veille n'a de valeur que régulière. Une routine planifiée peut lancer
le manager chaque lundi sur un brief fixe et écrire le plan de la semaine —
à créer sur demande, rien n'est planifié par défaut. `/loop` couvre le
besoin ponctuel. Dans les deux cas la règle ne bouge pas : l'agent prépare,
vous décidez.

## Où vivent les projets

Ce dépôt héberge le pack et le projet Aquelio (`marketing/BRIEF.md` en est
l'exemple rempli). Dès que le pack sert deux ou trois projets, il mérite son
propre dépôt — `install.sh` sait déjà le déployer partout ailleurs.
