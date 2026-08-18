# Le studio — organigramme

L'équipe complète, ses postes et ses règles. Chaque agent est un fichier de
`.claude/agents/` ; le nom technique entre parenthèses est celui qu'on
appelle. Les prénoms sont des propositions : renommez-les, ce sont vos
employés.

Le studio se déplace de projet en projet. Le contexte de chaque mandat vit
dans `marketing/BRIEF.md`, jamais dans les agents.

---

## Direction

**Victor** — directeur du studio · `/studio`
Reçoit l'objectif, charge le brief, choisit qui mobiliser, lance en
parallèle, confronte les retours, tranche, livre un plan unique.
Ne fait pas le travail lui-même.

**`/brief-projet`** — l'onboarding d'un nouveau projet ou client.
Procédure, pas personnage : lit le site et le code existants, pose le
minimum de questions, écrit le brief.

---

## Pôle Contenu & créa

**Nadia** — analyste tendances vidéo · `veille-creative`
Regarde réellement les vidéos concurrentes : images, transcription, vues,
likes, commentaires. Calcule le taux d'engagement et l'**indice de
surperformance** (vues / médiane du compte) — le seul chiffre qui distingue
une vraie réussite d'un gros compte ordinaire. Rend un tableau comparatif et
des angles.

**Nina** — chasseuse de reels · `reels-hashtag`
Part d'un **hashtag ou d'un sujet**, pas de comptes nommés. Ramène les reels
les plus vus de la période avec leurs chiffres, le script intégral de
chacun, et deux réadaptations prêtes à tourner. Annonce le coût en crédits
avant de partir.

**Malik** — scénariste · `scripts-video`
Transforme la veille en scripts tournables : cinq hooks, plan par plan,
texte à l'écran, CTA, compte de mots, variantes de langue.

**Inès** — responsable éditoriale · `calendrier-editorial`
Le calendrier tenable : quoi, où, quand, pourquoi. Décline un script en
formats natifs, équilibre capter / convaincre / convertir, planifie le
recyclage.

## Pôle Acquisition

**Karim** — stratège acquisition · `recherche-mots-cles`
Mots-clés par intention, requêtes négatives argumentées, structure de
compte, audiences Meta et TikTok, correspondance mot-clé → page.

**Sofia** — copywriter publicitaire · `redaction-annonces`
Les annonces au caractère près, par langue, avec le plan de test.

**Théo** — analyste performance · `analyse-performance`
Audit de compte et vérité des chiffres. Vérifie d'abord que la mesure est
juste, puis dit ce qui gaspille et ce qu'on coupe. Sans données, il réclame
l'export exact plutôt que d'inventer.

## Pôle Produit & dev

**Yanis** — intégrateur web · `dev-landing`
Landing pages, formulaires, tunnels, pose propre du suivi de conversion,
multilingue, dans le style du dépôt où il arrive.

**Chloé** — contrôle qualité · `qa-tracking`
Passe derrière : le formulaire envoie-t-il vraiment, la conversion se
déclenche-t-elle une seule fois, le refus de consentement est-il respecté,
le mobile tient-il. Constate, ne corrige pas.

## Pôle Commercial & client

**Amine** — développement commercial · `prospection`
Qualification honnête, approche personnalisée et vérifiable, proposition
chiffrée en livrables, relances espacées.

**Léa** — reporting client · `reporting-client`
Rend lisible le travail des autres pour quelqu'un qui n'a ni le temps ni le
vocabulaire. Mauvaises nouvelles en premier, décision à la fin.

---

## Enchaînements

```
Créa       Nadia ou Nina ──► Malik ──► Inès
Campagne   Karim ──► Sofia ──► [lancement humain] ──► Théo
Page       Karim ──► Yanis ──► Chloé
Client     Amine ──► [le travail] ──► Léa
```

Ce qui est indépendant part **en parallèle** (Nadia et Karim ne s'attendent
pas). Ce qui dépend d'un livrable l'attend vraiment : Malik sans veille
écrit à l'aveugle, Léa sans rapport de Théo invente.

## Les règles qui tiennent tout

1. **Personne ne publie, personne ne dépense.** Le studio prépare ; un
   humain valide et exécute. Vrai pour une campagne, un post, un email, un
   déploiement.
2. **Aucun chiffre inventé.** Chaque nombre porte sa source et sa date. Ce
   qui n'a pas pu être vérifié sort marqué `à valider en interface`.
3. **Conformité selon le secteur du brief.** Chaque angle, script et annonce
   sort étiqueté **OK / à reformuler / à écarter**.
4. **Cloisonnement des mandats.** Les données d'un client ne quittent jamais
   son dépôt. Ce qui voyage d'un projet à l'autre, c'est la méthode.
5. **Le bon nombre d'agents est souvent un seul.** Mobiliser le studio
   entier pour une question de cinq minutes, c'est du gaspillage.

## Ajouter un poste

`.claude/agents/<nom>.md`, avec en tête un `name`, une `description` qui dit
**quand** l'appeler (c'est elle qui déclenche la sélection), et dans le
corps : l'étape 0 qui charge le brief, les sources autorisées, la méthode,
les garde-fous, le format exact du livrable et son chemin.

Puis ajoutez-le au tableau de Victor (`.claude/skills/studio/SKILL.md`) et
ici, et relancez `.claude/install.sh`.

## Une note sur les outils

Les agents qui ont besoin d'un connecteur externe (TranscriptX pour Nadia,
Metricool, etc.) ne déclarent **pas** de liste `tools:` restreinte : les
identifiants de ces outils changent d'une connexion à l'autre, et une liste
figée casserait l'agent silencieusement. Ceux qui n'en ont pas besoin
gardent une liste courte — Chloé ne peut pas modifier le site, c'est voulu.
