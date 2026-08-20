# Brief projet — Aquelio

> Fichier lu en premier par tous les agents marketing. Il ne contient que le
> **contexte** : la compétence, elle, vit dans les agents (`.claude/agents/`)
> et sert à l'identique sur les autres projets.
> Mis à jour le 2026-08-20. Les points non tranchés restent `À CONFIRMER`.

## La règle qui prime sur toutes les autres

**Aquelio est en pré-lancement. Aucun fournisseur n'a encore fourni le
document de certification PFAS exigé.** Tant que ce document n'existe pas :

- **aucun contenu ne vend le produit** — ni performance, ni pourcentage de
  réduction, ni comparatif avec un concurrent ;
- **aucun contenu ne nomme une technologie** — pas d'osmose inverse, pas de
  charbon actif, pas de « 3 étages ». Le cahier des charges est
  volontairement agnostique (`FOURNISSEUR.md`) ;
- **la phrase « aucune vente ferme n'est effectuée avant validation en
  laboratoire indépendant » accompagne toute mention du produit.**

Un agent qui produit un contenu vendeur sur Aquelio aujourd'hui n'a pas fait
son travail : il a créé un risque juridique. En cas de doute, il livre du
contenu **éducatif sourcé** et le signale.

## Identité

- **Projet / client** : Aquelio — marque propre
- **Entité** : DH GLOBAL TECHNOLOGIES LLC (Wyoming, Filing ID
  2026-002015748), 312 W. 2nd St #1822, Casper, WY 82601. Fondateur basé au
  Bénin, marque tournée vers l'UE.
- **Site** : aquelio.eu — Node/Express, HTML statique, déployé sur Hostinger
  depuis GitHub. FR `/`, NL `/nl/`, DE `/de/`.
- **Ce qu'on vend, en une phrase** : un filtre à eau anti-PFAS sous-évier,
  compact, sans électricité, installable sans plombier.
- **Ce qui n'est pas arrêté** : la technologie. Exigence non négociable —
  réduction PFAS (PFOA/PFOS minimum) **certifiée NSF/ANSI 53 ou
  équivalent**, document à l'appui. Le reste (nombre d'étages, RO, charbon,
  hybride) est au choix du fournisseur.
- **Prix** : À CONFIRMER. Un dépôt de réservation remboursable de **20 €**
  existe (Stripe + Wise/Mercury), en complément du dossier gratuit — jamais
  à sa place.

## Objectif

- **Conversion réellement mesurée** : **demande du dossier PFAS régional**
  (code postal + email). **Pas un achat.** Toute optimisation qui suppose
  une vente est hors sujet aujourd'hui.
- **Conversion secondaire** : dépôt de réservation 20 €.
- **Où elle est mesurée** : Google Ads (deux comptes, un par marché) + Pixel
  Meta chargé après consentement (`public/cmp.js`). Le lead n'est compté
  qu'une fois transmis côté serveur (`server.js`). Export :
  `/api/export.csv`, protégé par jeton.
- **Valeur d'une conversion** : À CONFIRMER
- **Objectif chiffré et horizon** : À CONFIRMER
- **Budget** : À CONFIRMER

## Le momentum — vérifiable, et c'est le cœur du message

La directive UE **2020/2184** impose une conformité au **12 janvier 2026**.
Elle fixe **deux** paramètres, et les États membres choisissent lequel
appliquer :

- **Somme de 20 PFAS : 0,1 µg/L** (soit 100 ng/L) ;
- **PFAS Total : 0,5 µg/L**.

**Le seuil PFAS-4 à 20 ng/L en 2028 n'est PAS dans la directive
européenne** — c'est une disposition de la **TrinkwV allemande**. Il ne peut
donc être cité que sur le marché DE. L'écrire dans un contenu FR ou NL est
une erreur d'attribution, et une erreur d'attribution détruit exactement ce
qui fait la valeur d'Aquelio : la fiabilité de ses sources.

**Encore à vérifier** : la date d'application effective en Wallonie et en
Flandre. Une directive fixe une échéance européenne ; la transposition
régionale peut différer. Tant que ce n'est pas confirmé, écrire « depuis le
12 janvier 2026 » sans préciser le niveau est imprudent.

C'est **le** socle de tout le contenu tant que le produit n'est pas
certifié : on parle du problème et de la réglementation, pas de la solution.

## Marchés

| Marché | Langue | Particularités |
|---|---|---|
| Belgique — Wallonie | FR | Le seul cas documenté de dépassement : zone du Feeder du Hainaut, **désormais traitée** — le dire, sinon c'est de la peur |
| Belgique — Flandre | NL | Angle obligatoire : **l'eau du robinet est conforme**. Le vrai sujet est 3M Zwijndrecht — sols et nappes, pas le réseau |
| Allemagne | DE | Nouvelle TrinkwV, étude BUND, cas Mittelbaden/Rastatt. Vocabulaire local, jamais traduit du français |

**La France n'est pas un marché.** Ne pas produire de contenu ciblant la
France sans instruction explicite.

## Cible

- **Qui** : foyers propriétaires en Belgique et en Allemagne, sensibilisés à
  la qualité de l'eau du robinet.
- **Le déclencheur** : une information **locale** — une carte, une mesure sur
  la commune, un article régional — plus qu'un besoin permanent.
- **Alternative actuelle** : carafes filtrantes, eau en bouteille, rien.
- **Objections principales** : À CONFIRMER

## Le moteur d'acquisition

Le cœur du site n'est pas une vente, c'est une **capture de lead
documentaire** : le visiteur entre son code postal et reçoit gratuitement le
dossier PFAS de sa région. Trois dossiers PDF réels de 6 pages, sourcés,
existent déjà — Wallonie, Flandre, Allemagne. Le même contenu est décliné en
articles SEO (FR/NL/DE) avec schema `Article`/`FAQPage`.

**Tout contenu social doit ramener là.** Pas vers une page produit.

## Plateformes

- **Publicité** : Google Ads (actif, deux comptes) ; Meta (pixel posé)
- **Organique** : Facebook, Instagram, TikTok — à relancer
- **Outils** : Metricool (brand Aquelio connectée : Facebook, Instagram
  `aquelio0`, TikTok `aquelio.be`, Meta Ads, Google Ads)
- **Historique** : phase 0 — capture de leads contre le dossier régional

## Concurrents

| Nom | Site | Profils sociaux (URL) | Pourquoi les suivre |
|---|---|---|---|
| À CONFIRMER | | | `veille-creative` a besoin des URL de profil pour travailler |

## Conformité et interdits

- **Secteur réglementé** : oui — santé et eau potable. Google et Meta
  refusent ou suspendent sur allégation médicale, publicité jouant sur la
  peur de la maladie, ciblage impliquant l'état de santé supposé.
- **Allégations interdites** : aucun bénéfice santé, aucune prévention,
  aucun diagnostic implicite (« votre eau vous rend malade »). Aquelio n'est
  pas un dispositif médical.
- **Aucune statistique inventée.** Chaque affirmation PFAS porte sa source
  et sa date. Sources citables : SPW, VMM, OVAM, ISSeP (BE), UBA, BUND (DE),
  directive UE 2020/2184, TrinkwV.
- **Les trois étages du logo sont graphiques**, jamais légendés comme des
  « étapes de filtration » (`BRAND.md`).
- **Ne jamais laisser croire qu'on vend déjà.**

## Ton et marque

- **Ton** : vouvoiement en français. Factuel, local, documenté, sans
  survente. L'angle qui marche : « voici ce que dit le rapport officiel sur
  votre commune », jamais l'alarme.
- **Tagline** : « Petite. Efficace. Vérifiée. » — NL « Klein. Doeltreffend.
  Geverifieerd. » — DE « Klein. Wirksam. Geprüft. »
- **Logo** : un entonnoir à 3 étages surmontant une goutte.
- **Couleurs** : teal foncé `#0f2e2e`, corail `#ff6b5b`, blanc chaud
  `#f5f3ec`. **Trois couleurs, point.**
- **Typographie** : Archivo (titres), Instrument Sans (corps), IBM Plex Mono
  (labels et métadonnées).

## Décision

- **Qui valide** : Denis
- **Qui exécute** : Denis
- **Jamais sans validation** : budget, prix, publication, engagement public.

## Ce qui reste ouvert

- Le **document de certification PFAS** d'un fournisseur — le vrai verrou.
- Représentant UE (art. 27 RGPD) et responsable GPSR — en discussion avec
  AVASK.
- L'outil d'emailing pour la liste d'attente.
- Un CMP tiers réel (actuellement `CMP_ID_A_DEFINIR`).

## Livrables

- Veille : `marketing/veille/`
- Scripts : `marketing/scripts/`
- Visuels : `marketing/visuels/`
- Calendrier : `marketing/calendrier/`
- Campagnes : `marketing/campagnes/`
- Plans : `marketing/plans/`
