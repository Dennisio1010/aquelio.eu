# Message Lovable — peupler l'équipe

À envoyer avant le message 2 de `PROMPT-LOVABLE-2.md`. Il remplace les trois
agents de démarrage par l'équipe complète et corrige le rôle d'orchestrateur.

---

L'équipe ne doit pas rester à trois agents : c'était un jeu de départ pour
valider le design. Voici l'équipe complète.

**Corrige d'abord deux choses :**

1. **Victor est le seul chef d'orchestre.** Retire ce rôle à l'agent qui le
   porte aujourd'hui et donne-le à Victor. Lui seul a la carte large en
   indigo ; tous les autres sont en pastel.
2. **Les rôles ci-dessous font foi** sur ceux déjà en base. Si un agent
   existant porte le même prénom avec un autre rôle, corrige le rôle et la
   description plutôt que de créer un doublon.

Ajoute une colonne `pole` sur la table des agents (`direction`, `contenu`,
`acquisition`, `produit`, `commercial`) et regroupe les cartes par pôle sur
la page Studio, chaque groupe précédé de son intitulé en petites capitales.

**Renseigne pour chaque employé :** le prénom, le rôle, le pôle, la couleur
pastel, la description en une phrase, et les trois amorces de conversation.
Laisse le prompt système vide — je les remplirai moi-même, agent par agent.
Marque `LIVE` uniquement ceux dont le prompt système est renseigné : au
départ, ils seront donc tous `INACTIF`, et c'est normal.

---

### Direction

**Victor** — Directeur du studio — indigo — *chef d'orchestre*
Dites-lui l'objectif en français courant : il choisit les employés à
mobiliser, les lance et rend une décision unique.
- Prépare le lancement d'un produit sur un nouveau marché
- Qu'est-ce qu'on fait cette semaine sur ce projet ?
- Monte un plan de campagne complet, budget à préciser

### Pôle Contenu & créa

**Nadia** — Analyste tendances vidéo — lavande
Décortique les vidéos des concurrents nommés et en tire des formats
réplicables.
- Analyse les 3 concurrents du brief et sors les formats qui marchent
- Qu'est-ce qui a changé chez eux depuis le mois dernier ?
- Trouve-moi 5 angles créatifs pour ce produit

**Nina** — Chasseuse de reels — pêche
Part d'un hashtag ou d'un sujet et ramène les reels les plus vus avec le
script de chacun.
- Les reels les plus vus sur ce hashtag, marché FR
- Compare le marché FR et le marché US sur ce sujet
- Transcris le top 10 et sors-moi les hooks

**Malik** — Scénariste — crème
Transforme une veille ou un angle en scripts tournables, plan par plan.
- Écris 3 scripts de 30 secondes à partir de la dernière veille
- Donne-moi 5 hooks pour cette offre
- Adapte ce script en néerlandais et en allemand

**Inès** — Responsable éditoriale — menthe
Construit le calendrier de publication et décline chaque script par réseau.
- Planifie le mois prochain, 3 publications par semaine
- Qu'est-ce qu'on publie cette semaine ?
- Décline ce script en Reel, Short et carrousel

### Pôle Acquisition

**Karim** — Stratège acquisition — bleu ciel
Mots-clés par intention, requêtes négatives et structure de compte.
- Monte la structure de campagne pour ce marché
- Trouve le gaspillage dans ce compte et propose des négatifs
- Quelles intentions on ne couvre pas encore ?

**Sofia** — Copywriter publicitaire — rose poudré
Écrit les annonces au caractère près, par langue, avec le plan de test.
- Écris les annonces du dernier plan de campagne
- Réécris ces titres, ils sont trop longs
- Décline cette annonce en allemand

**Théo** — Analyste performance — lilas
Vérifie que la mesure est juste, puis dit ce qui rapporte et ce qu'on coupe.
- Analyse cet export et dis-moi ce qu'on coupe
- Est-ce que mon suivi de conversion est fiable ?
- Compare ce mois au mois dernier

### Pôle Produit & dev

**Yanis** — Intégrateur web — vert tendre
Construit les pages d'atterrissage, les formulaires et le suivi de
conversion.
- Décline la landing page dans une nouvelle langue
- Le formulaire ne convertit pas, propose des corrections
- Comment poser proprement l'événement de conversion ?

**Chloé** — Contrôle qualité — bleu glacier
Passe derrière une mise en ligne et dit ce qui casse avant le lancement.
- Contrôle la page avant le lancement de la campagne
- Le refus de consentement est-il bien respecté ?
- Teste le parcours complet sur mobile

### Pôle Commercial & client

**Amine** — Développement commercial — abricot
Qualifie un prospect, prépare l'approche et chiffre la proposition.
- Qualifie ce prospect et prépare une approche
- Rédige la proposition pour ce mandat
- Quelles objections je vais avoir, et quoi répondre ?

**Léa** — Reporting client — mauve
Rend lisible le travail des autres pour quelqu'un qui n'a ni le temps ni le
vocabulaire.
- Prépare le rapport mensuel de ce client
- Résume la campagne en une page
- Rédige le point d'étape à envoyer

---

Ajoute aussi un écran **« Gérer les employés »** : création, édition et
réordonnancement, avec pour chacun le prénom, le rôle, le pôle, la couleur,
l'avatar, la description, les amorces, le modèle, les onglets et le prompt
système. Un employé doit pouvoir être ajouté sans toucher au code.

Arrête-toi là et montre-moi le résultat.
