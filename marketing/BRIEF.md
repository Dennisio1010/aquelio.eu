# Brief projet — Aquelio

> Fichier lu en premier par tous les agents marketing. Il ne contient que le
> **contexte** : la compétence, elle, vit dans les agents (`.claude/agents/`)
> et sert à l'identique sur les autres projets.
> Mis à jour le 2026-08-17. Les points non tranchés restent `À CONFIRMER`.

## Identité

- **Projet / client** : Aquelio — marque propre
- **Type de mandat** : marque propre, phase 0
- **Site & pages clés** : aquelio.eu — `public/index.html` (FR),
  `public/nl/` (BE-NL), `public/de/` (DE),
  `public/pfas-eau-robinet-belgique.html` (page marché belge),
  `public/merci.html` (confirmation)
- **Ce qu'on vend, en une phrase** : de la filtration d'eau domestique,
  positionnée sur les PFAS
- **Prix / modèle économique** : À CONFIRMER — Stripe est câblé mais la
  phase 0 ne vend pas encore ; l'architecture produit n'est pas arrêtée
  (voir `FOURNISSEUR.md`)

## Objectif

- **Conversion réellement mesurée** : demande du dossier PFAS régional
  (code postal + email). **Pas un achat** — toute optimisation qui suppose
  une vente est hors sujet aujourd'hui.
- **Valeur approximative d'une conversion** : À CONFIRMER
- **Où elle est mesurée** : Google Ads (deux comptes, `AW-18245591187` et
  `AW-18381937595`, l'action de conversion étant routée vers le compte du
  marché) + Pixel Meta chargé après consentement (`public/cmp.js`). Le lead
  n'est compté qu'une fois réellement transmis côté serveur (`server.js`).
  Export des leads : `/api/export.csv` protégé par jeton.
- **Objectif chiffré et horizon** : À CONFIRMER
- **Budget** : À CONFIRMER

## Marchés

| Marché | Langue | Particularités |
|---|---|---|
| France | FR | Réglementation PFAS UE, cartes de contamination publiques |
| Belgique | NL (+ FR) | Page dédiée existante ; distinguer BE-NL et Pays-Bas dans les formulations |
| Allemagne | DE | Compte de conversion et pages propres ; vocabulaire local à ne pas traduire du français |

## Cible

- **Qui achète** : À CONFIRMER — foyers propriétaires, sensibilisés à la
  qualité de l'eau du robinet
- **Le déclencheur** : une information locale (carte, article, mesure sur la
  commune) plus qu'un besoin permanent
- **Objections principales** : À CONFIRMER
- **Alternative actuelle** : carafes filtrantes, eau en bouteille, rien

## Plateformes

- **Publicité** : Google Ads (actif, deux comptes) ; Meta (pixel posé)
- **Organique** : À CONFIRMER
- **Outils** : Metricool (si comptes connectés), Resend (emails)
- **Historique** : phase 0 — capture de leads contre le dossier PFAS régional

## Concurrents

| Nom | Site | Profils sociaux (URL) | Pourquoi les suivre |
|---|---|---|---|
| À CONFIRMER | | | `veille-creative` a besoin des URL de profil pour travailler |

## Conformité et interdits

- **Secteur réglementé** : oui — sujet santé. Google et Meta refusent ou
  suspendent sur allégation médicale, publicité jouant sur la peur de la
  maladie, ciblage impliquant l'état de santé supposé d'une personne.
- **Allégations interdites** : aucun bénéfice santé, aucune prévention,
  aucun diagnostic implicite (« votre eau vous rend malade »). Aquelio n'est
  pas un dispositif médical.
- **Sources officielles citables** : réglementation UE sur les PFAS, agences
  sanitaires nationales, relevés publics par commune.
- **Ce que la marque refuse de dire** : ne pas légender les trois étages du
  logo comme des « étapes de filtration » tant que l'architecture produit
  n'est pas confirmée (`BRAND.md`).

## Ton et marque

- **Ton** : factuel, local, documenté. L'angle qui fonctionne est
  « voici ce que dit le rapport officiel sur votre commune », pas l'alarme.
- **Charte / assets** : `BRAND.md` — teal `#0f2e2e`, corail `#ff6b5b`,
  blanc chaud `#f5f3ec`, wordmark Archivo.

## Décision

- **Qui valide** : Denis
- **Qui exécute** : Denis
- **Jamais sans validation** : budget, prix, publication, engagement public.

## Livrables

- Veille : `marketing/veille/`
- Campagnes : `marketing/campagnes/`
- Plans : `marketing/plans/`
