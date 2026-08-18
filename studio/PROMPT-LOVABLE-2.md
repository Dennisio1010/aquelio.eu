# Prompt Lovable — suite

À envoyer **sur le projet Lovable déjà généré**, pas sur un nouveau.

Cinq messages, à copier l'un après l'autre. Attendez que Lovable ait fini et
regardez le résultat avant d'envoyer le suivant — un seul bloc de cette
taille serait exécuté à moitié.

Le message 1 commence par un audit : Lovable doit dire ce qui existe déjà
avant de toucher quoi que ce soit. C'est ce qui évite qu'il recrée une
seconde table `agents` à côté de la première.

**Entre le message 1 et le message 2**, envoyez
[`PROMPT-LOVABLE-EQUIPE.md`](PROMPT-LOVABLE-EQUIPE.md) : il remplace les
trois agents de démarrage par l'équipe complète et corrige le rôle de chef
d'orchestre.

---

## Message 1 — Audit, puis refonte visuelle

Avant de coder quoi que ce soit, liste-moi ce qui existe déjà dans le
projet : les tables et leurs colonnes, les écrans, les Edge Functions, et
où la clé API est lue. Ne recrée rien de ce qui existe — tout ce qui suit
est une évolution de l'existant, pas un nouveau départ. Si une chose
demandée ici est déjà en place, dis-le et passe à la suivante.

Ensuite, applique cette direction artistique à toute l'application.

Le style actuel doit devenir clair, coloré et généreux — l'inverse d'un
tableau de bord d'entreprise.

- Fond blanc cassé très clair. Cartes blanches ou pastel, coins très
  arrondis (20 à 24 px), ombre douce et diffuse, aucune bordure dure.
- **Une couleur pastel par employé**, stockée sur l'agent et stable dans le
  temps : lavande, pêche, rose poudré, bleu ciel, crème, menthe, lilas,
  vert tendre. Ajoute la colonne si elle n'existe pas et attribue une
  couleur à chaque agent existant.
- **Le chef d'orchestre tranche visuellement** : sa carte est plus large que
  les autres, en aplat indigo saturé, texte blanc, avec un bouton clair
  « Ouvrir le chat → ». Si aucun agent n'a ce rôle, ajoute un booléen
  `is_orchestrator` et marque-en un.
- **Un seul accent : un rouge corail.** Boutons primaires pleins et
  entièrement arrondis, onglet de navigation actif, et intitulés de rôle en
  petites capitales espacées précédées d'un tiret : `— VEILLE TENDANCES`.
  Nulle part ailleurs.
- **Avatars** : ajoute un champ image par agent, affiché en rond et centré
  en haut de sa carte, avec un dégradé de repli quand il est vide. Je
  téléverserai les images moi-même.
- **Typographie** : une serif à caractère pour le nom de l'employé dans son
  panneau et les grands titres ; une sans-serif nette pour le reste ; une
  monospace pour les identifiants et les chiffres alignés.
- **Navigation** : une barre flottante en pilule blanche centrée en haut,
  ombre douce, onglet actif en pilule corail. Les onglets sont :
  `Accueil · Studio · Les bases · Activité · Calendrier · Livrables ·
  Connexions`. Renomme ce qui porte un autre nom, supprime toute page
  « Installer » ou « Héberger » si elle existe — l'application est hébergée.
- **Badge d'état** en haut à droite de chaque carte d'employé : pastille
  verte + `LIVE` quand l'agent a un prompt système et un modèle configurés,
  gris + `INACTIF` sinon. **Ce badge doit refléter un état réel, calculé.
  Jamais une valeur écrite en dur.**

Sur la page Studio, ajoute la phrase d'introduction : « Choisissez un
employé pour lui parler et lancer un livrable. »

Arrête-toi là et montre-moi le résultat.

---

## Message 2 — Le panneau d'employé et ses onglets

Refais le panneau d'un employé sur ce modèle.

En haut, les avatars des autres employés en rang, cliquables pour passer de
l'un à l'autre sans revenir en arrière, et un lien « ← Accueil ».

Colonne de gauche fixe : l'avatar, deux badges (`En ligne`, le nom du
modèle), l'intitulé de rôle en corail, le nom en grande serif, la
description en une phrase. En dessous, quatre compteurs :

- **Livrables** — le nombre produit par cet agent.
- **Tokens · 30 j** — la somme sur les 30 derniers jours.
- **Coût · 30 j** — en euros.
- **Succès** — runs terminés ÷ runs lancés, en pourcentage.

Ces quatre valeurs se calculent depuis la table des runs. Aucune n'est
saisie, aucune n'est simulée. Si une donnée manque, affiche un tiret plutôt
qu'un zéro trompeur.

À droite, des **onglets définis par agent**. Ajoute sur la table `agents`
une colonne `tabs` (tableau de chaînes) et remplis-la pour les agents
existants avec `["chat","analytics","fichiers","historique"]`.

- `chat` — la conversation.
- `analytics` — l'activité et la consommation de cet agent dans le temps.
- `fichiers` — ses livrables.
- `historique` — ses runs passés, réouvrables.

Ce mécanisme sert à donner plus tard un **onglet outil** à certains agents.
Construis-le pour qu'ajouter un onglet à un agent soit une modification de
donnée, pas de code.

Refais aussi l'état vide du chat : une icône, le titre « Démarrer une
conversation », une phrase qui dit ce que l'agent sait déjà — « Nina
connaît déjà votre charte de marque, vos personas et votre historique de
campagnes » — et **trois chips de démarrage propres à l'agent**, stockées
dans une nouvelle colonne `starter_prompts`, qui préremplissent le champ au
clic. Zone de saisie en bas : « Demandez à Nina… », Entrée pour envoyer,
Maj+Entrée pour un retour à la ligne.

Arrête-toi là et montre-moi le résultat.

---

## Message 3 — L'écran Veille, en mode démonstration

Ajoute un onglet outil `veille`, affiché seulement pour les agents dont le
champ `tabs` le contient. Active-le sur l'agent de veille.

C'est la fonctionnalité la plus importante du produit : elle trouve les
Reels les plus performants sur un sujet, puis en transcrit le script.

**Trois modes**, en onglets : `Par sujet` · `Par hashtag · récents` ·
`Par créateur`.

**Deux champs de recherche côte à côte**, un par marché — « Recherche —
marché FR » et « Recherche — marché US » — qu'on peut lancer ensemble pour
comparer.

**Cinq filtres** en ligne : profondeur (1 / 2 / 3 pages, avec le nombre de
reels estimé affiché à côté), vues minimum, engagement minimum, marché,
période. Puis un bouton plein « Chercher les plus performants ».

**Sous les filtres, une phrase d'aide qui change avec le mode et qui avoue
la limite de ce mode.** Pour « Par sujet » : « Le classement vient de la
recherche par popularité : idéal pour les gros performeurs, mauvais pour le
récent — passez en “Par hashtag · récents” pour ça. » Cette phrase est
obligatoire : sans elle, l'utilisateur croit voir un classement exhaustif
alors qu'il voit un échantillon.

**Barre de résultats** : tri par vues / engagement / date, filtre de marché
(Tous / FR / EN), et un compteur littéral du type « 73 reels · 8 avec
script ». À droite, un bouton « Transcrire le top 10 » qui **affiche le
coût estimé avant de lancer**.

**Rangée des créateurs** au-dessus de la grille : les comptes les plus
représentés dans les résultats, avatar et taux d'engagement moyen, triés
par engagement et non par vues.

**Grille de vignettes** au format vertical : badge de rang (#1, #2…) en haut
à gauche, badge de langue détectée en haut à droite, nombre de vues en bas
sur un voile sombre. Sous la vignette : le handle, le taux d'engagement, la
légende tronquée à deux lignes, et une pastille verte `script` quand la
transcription existe.

**Détail au clic** : métriques complètes (vues, likes, commentaires,
engagement, date de publication, durée, langue), légende entière, et le
script intégral avec ses timecodes. Un bouton « Envoyer au rédacteur »
ouvre le chat de l'agent d'écriture avec ce script en contexte.

### L'architecture des données — le point important

Aucune API officielle Instagram ne donne « les reels les plus vus d'un
hashtag ». Cet écran a besoin d'un fournisseur tiers que je n'ai pas encore.
Crée donc une table `reels` et une Edge Function `search-reels` avec une
interface stable :

```
search-reels(mode, requête, marché, profondeur, vuesMin, engagementMin, période)
  → [{ url, miniature, handle, vues, likes, commentaires, légende,
       publiéLe, durée, langue }]
```

et **deux implémentations derrière cette même interface** :

1. `demo` — un jeu de données de démonstration en base, pour que l'écran
   soit entièrement navigable dès maintenant.
2. `provider` — l'appel au fournisseur réel, dont la clé viendra des secrets
   Supabase. Laisse-la en attente, ne l'invente pas.

Le mode se choisit dans Connexions. **Tant que le mode `demo` est actif, un
bandeau « données de démonstration » reste visible en haut de l'écran
Veille, et il ne doit être masquable d'aucune façon.**

Fais pareil pour la transcription : une Edge Function `transcribe-reel` avec
un mode démo et un mode réel, et le script enregistré dans `reels` pour ne
jamais payer deux fois la même transcription.

Arrête-toi là et montre-moi le résultat.

---

## Message 4 — Les bases, l'activité et le calendrier

**Les bases** — l'écran d'édition du projet : offre, marchés, langues,
conversion réellement mesurée, concurrents, contraintes de conformité, ton,
charte de marque, personas. Ce texte doit être injecté dans le prompt
système à chaque exécution. Affiche un avertissement visible tant que ces
bases sont vides : les agents travaillent à l'aveugle sans elles.

**Activité** — le journal de tout ce qui s'est passé : qui a lancé quoi,
quand, avec quel statut et quel coût. Filtrable par agent et par projet.

**Livrables** — la bibliothèque : filtres par projet, agent et date, rendu
Markdown propre, export `.md`, copie, favoris.

**Calendrier** — vue mensuelle des livrables et publications prévus. Saisie
manuelle et rattachement à un livrable existant. **Aucune publication
automatique vers un réseau social.**

Arrête-toi là et montre-moi le résultat.

---

## Message 5 — Vérifications et finitions

Trois points à corriger s'ils ne sont pas déjà justes, et dis-moi
explicitement ce que tu trouves pour chacun :

1. **La clé API Anthropic** doit être lue depuis un secret Supabase dans
   l'Edge Function, et jamais depuis une variable `VITE_…` — celles-ci
   finissent dans le bundle public. Si c'est le cas aujourd'hui, corrige-le
   et dis-le-moi clairement.
2. **Les tokens enregistrés** doivent venir du champ `usage` renvoyé par
   l'API Anthropic, pas d'une estimation calculée côté front. Un compteur
   faux est pire qu'aucun compteur.
3. **La Row Level Security** doit être active sur toutes les tables, avec
   des politiques qui limitent chaque ligne à son propriétaire. Montre-moi
   les politiques.

Ensuite, les finitions :

- La page **Accueil** : runs récents avec leur statut, derniers livrables,
  et la consommation du mois en tokens et en euros, calculée depuis les
  runs. Un sélecteur de projet en haut qui conditionne toute l'application.
- La page **Connexions** : l'état de chaque intégration avec un bouton
  « tester la connexion » qui appelle réellement une Edge Function et
  affiche le résultat, pas une pastille décorative.
- **Responsive** : l'application doit être utilisable sur téléphone, la
  grille de vignettes comprise.
- **Accessibilité** : focus clavier visible partout, contrastes suffisants
  sur les pastels — vérifie que le texte gris sur pastel reste lisible.

---

## Ce qu'il faut vérifier de votre côté

Lovable dira que c'est fait. Ces quatre points ne se voient pas à l'écran :

1. Ouvrez le code de l'Edge Function et cherchez `VITE_`. S'il y a une clé
   derrière, elle est publique.
2. Créez un second compte et vérifiez qu'il ne voit rien du premier.
3. Lancez une vraie exécution et comparez le coût affiché à celui de votre
   console Anthropic. S'ils divergent, le compteur est faux.
4. Vérifiez que le bandeau « données de démonstration » est bien là sur
   l'écran Veille. C'est le piège classique : une belle grille de reels qui
   ne vient de nulle part, montrée un jour à un client.

## Les deux factures que Lovable ne montre pas

L'écran Veille coûte de l'argent en dehors de Lovable : **l'abonnement au
fournisseur de données Instagram**, au volume de requêtes, et **la
transcription**, au nombre de vidéos. « Transcrire le top 10 » a un prix à
chaque clic — d'où le coût estimé affiché avant lancement.

Dix recherches par jour sur deux marchés consomment beaucoup plus qu'on ne
l'imagine. Le compteur de consommation n'est pas un luxe.
