# Agents IA marketing — Aquelio

Comment fonctionne l'équipe d'agents IA du projet, comment s'en servir, et
comment en ajouter. Tout est versionné dans le dépôt : un agent est un
simple fichier Markdown, pas un service à héberger.

## L'équipe

```
        Denis
          │
          ▼
  /manager-marketing        ← le manager : cadre, délègue, arbitre, livre
          │
    ┌─────┴─────┐
    ▼           ▼
veille-virale  mots-cles-ads   ← les spécialistes : exécutent, rapportent
```

| Fichier | Rôle |
|---|---|
| `.claude/skills/manager-marketing/SKILL.md` | Le manager |
| `.claude/agents/veille-virale.md` | Veille des formats vidéo qui performent |
| `.claude/agents/mots-cles-ads.md` | Mots-clés, négatifs, ciblage Google + Meta |

Les livrables sont écrits dans `marketing/` : `veille/`, `mots-cles/`,
`plans/`. Ils sont datés et versionnés — les agents relisent les précédents
pour ne pas répéter le même travail d'une semaine sur l'autre.

## Comment s'en servir

Dans Claude Code, sur ce dépôt :

```
/manager-marketing prépare le lancement Allemagne pour septembre,
budget 1500 €, objectif demandes de dossier
```

Le manager cadre la demande, lance les deux spécialistes en parallèle,
confronte leurs retours et écrit un plan unique dans `marketing/plans/`.

Un spécialiste peut aussi être appelé seul, sans passer par le manager,
quand le besoin est ciblé :

```
Lance l'agent veille-virale sur les pubs vidéo concurrentes en Belgique
```

## Pourquoi le manager est un skill et pas un agent

Un sous-agent tourne dans son propre contexte et ne peut pas lancer d'autres
sous-agents de façon fiable. Le manager doit donc vivre dans la session
principale — c'est là qu'il peut réellement déléguer, lire les retours et
arbitrer. Le comportement est identique côté utilisateur : une commande, un
plan en sortie.

## Deux limites à connaître avant de faire confiance à un rapport

**1. Aucun accès au feed IG / TikTok / Facebook.** Il n'existe pas d'API
publique donnant « les vidéos virales du moment », et le scraping de ces
plateformes est interdit par leurs CGU et bloqué techniquement. Les sources
réellement utilisées sont :

- **Meta Ad Library** — toutes les pubs Instagram + Facebook actives, par
  pays, publiques. La date de première diffusion est le meilleur signal
  disponible : une pub qui tourne depuis des mois est une pub rentable.
- **TikTok Creative Center** — top ads, hashtags et sons tendance, public.
- **Metricool** (connecté à la session) — les statistiques de nos propres
  comptes, et les créneaux de publication.
- **Recherche web** — actualité et réglementation PFAS par pays.

C'est moins glamour que « l'agent scanne TikTok », et beaucoup plus fiable :
la Ad Library montre ce que les concurrents *paient* pour diffuser.

**2. Aucun chiffre de volume ou de CPC.** Le Keyword Planner et le
Gestionnaire de publicités demandent une authentification que les agents
n'ont pas. Ils sont donc explicitement instruits de ne jamais inventer un
volume de recherche : toute estimation chiffrée sort marquée
`à valider dans Keyword Planner`. Si un rapport contient un chiffre sans
source ni date, c'est un bug — signale-le.

## Le garde-fou conformité

Aquelio parle de PFAS, donc de santé. Google et Meta refusent ou suspendent
les comptes sur : allégations médicales, publicité jouant sur la peur de la
maladie, ciblage impliquant l'état de santé supposé d'une personne. Les
trois agents portent la même consigne : chaque angle proposé sort étiqueté
**OK / à reformuler / à écarter**, avec la raison. Un angle factuel sourcé
(« voici ce que dit le rapport officiel sur votre commune ») passe ; un
angle anxiogène fait perdre le compte publicitaire.

Les agents ne publient rien et ne dépensent rien : ils préparent, Denis
valide et exécute.

## Ajouter un agent

Créer un fichier dans `.claude/agents/<nom>.md` :

```markdown
---
name: nom-de-lagent
description: Ce qu'il fait et QUAND l'utiliser — c'est cette phrase qui
  déclenche sa sélection, elle compte autant que le reste du fichier.
tools: WebSearch, WebFetch, Read, Write
model: sonnet
---

Rôle, sources autorisées, méthode étape par étape, garde-fous,
format exact du livrable et où l'écrire.
```

Ce qui fait la différence entre un agent utile et un agent décoratif :

- **Des sources nommées**, avec les URL. Sans cela l'agent improvise.
- **Un format de livrable imposé**, fichier et chemin compris. Deux rapports
  au même format se comparent d'une semaine sur l'autre ; deux rapports
  libres, non.
- **L'interdiction explicite d'inventer** ce qu'il ne peut pas mesurer.
- **Le minimum d'outils nécessaires** dans `tools:` — un agent de veille n'a
  aucune raison de pouvoir modifier le site.

Puis l'ajouter au tableau du manager (`.claude/skills/manager-marketing/SKILL.md`)
et à celui de ce fichier.

Candidats naturels pour la suite : un agent *rédaction annonces* (variantes
FR/NL/DE dans les limites de caractères), un agent *analyse de performance*
(lecture des conversions et des exports de leads), un agent *veille
réglementaire PFAS* par pays.

## Automatiser l'exécution récurrente

Une veille n'a de valeur que régulière. Deux options :

- **Routine planifiée** — une tâche récurrente (par ex. tous les lundis
  8h) qui lance le manager sur un brief fixe et écrit le plan de la semaine.
  À créer sur demande ; rien n'est planifié par défaut.
- **`/loop`** — pour une session ponctuelle qui repasse à intervalle
  régulier.

Dans les deux cas la règle ne change pas : l'agent prépare, Denis décide.
