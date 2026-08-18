# Prompt Lovable — v2

Collez le bloc entre les deux traits dans le premier message d'un nouveau
projet Lovable. Remplacez `Studio Denis` par le nom du produit.

Cette version ajoute ce que les captures de NAIOM ont révélé : la direction
artistique précise, les onglets par agent, et surtout **l'écran Veille** —
qui est le vrai cœur du produit et le seul morceau qui dépend d'un
fournisseur de données externe.

---

Construis **Studio Denis**, une application web qui pilote une équipe
d'employés IA. Chaque employé est un agent spécialisé — veille vidéo,
rédaction, analyse de performance, prospection — à qui on parle et qui
produit un livrable écrit.

## Stack et règles non négociables

- React + TypeScript + Tailwind + shadcn/ui, Supabase pour l'auth, la base,
  le stockage et les Edge Functions.
- **La clé API Anthropic est un secret serveur.** Tous les appels au modèle
  passent par une Edge Function. Rien qui commence par `VITE_` ne doit
  contenir une clé : ces variables finissent dans le bundle public.
- Row Level Security sur toutes les tables. Un utilisateur ne voit que ses
  données.
- **Aucun chiffre décoratif.** Chaque compteur affiché vient d'une vraie
  ligne en base. Un compteur qu'on ne sait pas alimenter ne s'affiche pas.
- Interface en français, dates JJ/MM/AAAA, montants en euros.

## Direction artistique

Clair, coloré, généreux — l'inverse d'un tableau de bord d'entreprise.

- **Fond** blanc cassé très clair. **Cartes** blanches ou pastel, coins très
  arrondis (20 à 24 px), ombre douce et diffuse, aucune bordure dure.
- **Une couleur pastel par employé**, attribuée à la création et stable
  ensuite : lavande, pêche, rose poudré, bleu ciel, crème, menthe, lilas,
  vert tendre. C'est le seul repère de couleur — pas de code couleur
  supplémentaire par-dessus.
- **Le chef d'orchestre tranche** : sa carte est plus large que les autres,
  en aplat indigo saturé, texte blanc, avec un bouton clair « Ouvrir le
  chat → ».
- **Accent unique : un rouge corail.** Boutons primaires pleins et
  entièrement arrondis, onglet de navigation actif, et les intitulés de rôle
  en petites capitales espacées précédés d'un tiret (`— VEILLE TENDANCES`).
  Nulle part ailleurs.
- **Avatars** : un personnage 3D par employé, illustration ronde et amicale,
  centré en haut de sa carte. Prévois un emplacement d'image téléversable
  par agent avec un dégradé de repli.
- **Typographie** : une serif à caractère pour le nom de l'employé dans son
  panneau et pour les grands titres ; une sans-serif nette pour tout le
  reste ; une monospace pour les identifiants techniques et les chiffres
  alignés.
- **Navigation** : une barre flottante en pilule blanche, centrée en haut,
  ombre douce, l'onglet actif en pilule corail.
- **Badge d'état** en haut à droite de chaque carte : pastille verte +
  `LIVE` quand l'agent est configuré et opérationnel, gris + `INACTIF`
  sinon. Ce badge reflète un état réel, il n'est jamais décoratif.
- Mode clair soigné en priorité ; le mode sombre peut venir ensuite.

## Navigation

`Accueil · Studio · Les bases · Activité · Calendrier · Livrables · Connexions`

## Modèle de données

- `profiles` — utilisateur, nom.
- `projects` — un projet ou un client : nom, secteur, marchés, langues,
  **conversion mesurée**, contraintes de conformité, charte de marque,
  personas, historique de campagnes. C'est « Les bases ».
- `agents` — nom d'affichage, rôle, description courte, couleur pastel,
  avatar, **prompt système** (texte long, éditable), modèle, ordre
  d'affichage, actif, et **`tabs`** : la liste des onglets de son panneau
  (voir plus bas).
- `runs` — agent, projet, consigne, statut (en attente / en cours / terminé
  / échoué), horodatages, tokens entrée, tokens sortie, coût, erreur.
- `deliverables` — titre, contenu Markdown, agent, projet, date, favori.
- `messages` — conversation d'un run : rôle, contenu, horodatage.
- `reels` — le résultat des recherches de veille (voir l'écran Veille).
- `connections` — intégrations : nom, statut, dernière vérification. **Les
  clés vont dans les secrets Supabase, jamais dans cette table.**

## Écrans

### Accueil
L'état du studio : runs récents avec leur statut, derniers livrables,
consommation du mois en tokens et en euros — calculée depuis `runs`.
Un sélecteur de projet en haut conditionne toute l'application.

### Studio
La page centrale. Titre, puis une phrase : « Choisissez un employé pour lui
parler et lancer un livrable. » Ensuite la grille : la carte du chef
d'orchestre en premier, plus large et en indigo, puis les employés en cartes
pastel — avatar, badge d'état, nom, rôle en petites capitales. Un clic ouvre
son panneau.

### Panneau d'un employé
En-tête : les avatars des autres employés en rang, cliquables pour passer de
l'un à l'autre sans revenir en arrière, et un lien « ← Accueil ».

Colonne de gauche fixe : l'avatar, deux badges (`En ligne`, le nom du
modèle), l'intitulé de rôle en corail, le nom en grande serif, la
description en une phrase. En dessous, quatre compteurs — **livrables**,
**tokens sur 30 jours**, **coût sur 30 jours**, **taux de succès** (runs
terminés ÷ runs lancés). Tous calculés depuis `runs`, jamais saisis.

À droite, des onglets **définis par agent** dans le champ `tabs` :

- `chat` — présent chez tous.
- `analytics` — consommation et activité de cet agent dans le temps.
- `fichiers` — ses livrables.
- `historique` — ses runs passés, réouvrables.
- **un onglet outil optionnel**, propre au métier de l'agent. Le premier à
  construire est `veille`, décrit plus bas. C'est ce mécanisme qui donne des
  capacités réelles à un agent : sans lui, un agent ne fait qu'écrire du
  texte.

### Onglet Chat
État vide soigné : une icône, « Démarrer une conversation », puis une
phrase qui dit ce que l'agent sait déjà — « Nina connaît votre charte de
marque, vos personas et votre historique de campagnes » — et trois **chips
de démarrage** propres à l'agent, stockées avec lui, qui préremplissent le
champ. Zone de saisie en bas : « Demandez à Nina… », Entrée pour envoyer,
Maj+Entrée pour un retour à la ligne, bouton Envoyer. Réponse en streaming,
avec bouton d'annulation.

### Les bases
L'édition du projet : offre, marchés, langues, conversion mesurée,
concurrents, contraintes de conformité, ton, charte. Ce texte est injecté
dans le prompt système à chaque run. Affiche clairement à l'utilisateur que
tant que ces bases sont vides, les agents travaillent à l'aveugle.

### Activité
Le journal de tout ce qui s'est passé : qui a lancé quoi, quand, statut,
coût. Filtrable par agent et par projet.

### Livrables
La bibliothèque : filtres par projet, agent, date ; rendu Markdown propre ;
export `.md` ; copie ; favoris.

### Calendrier
Les livrables et publications prévus, en vue mensuelle. En v1, saisie
manuelle et rattachement à un livrable existant — aucune publication
automatique.

### Connexions
L'état des intégrations, avec un bouton « tester la connexion » qui appelle
une Edge Function et affiche le résultat réel.

## L'écran Veille (onglet outil de l'agent de veille)

C'est la fonctionnalité la plus importante du produit. Elle trouve les
Reels les plus performants sur un sujet, puis en transcrit le script.

**Trois modes**, en onglets : `Par sujet` · `Par hashtag · récents` ·
`Par créateur`.

**Deux champs de recherche côte à côte**, un par marché : « Recherche —
marché FR » et « Recherche — marché US ». On peut lancer les deux d'un coup
et comparer.

**Cinq filtres** en ligne : profondeur (1 / 2 / 3 pages, avec le nombre de
reels estimé affiché à côté), vues minimum, engagement minimum, marché,
période. Puis un bouton plein « Chercher les plus performants ».

**Sous les filtres, une phrase d'aide honnête** qui explique la limite du
mode choisi. Par exemple : « Le classement vient de la recherche par
popularité : idéal pour les gros performeurs, mauvais pour le récent —
passez en “Par hashtag · récents” pour ça. » Cette phrase change avec le
mode. Elle n'est pas optionnelle : sans elle, l'utilisateur croit voir un
classement exhaustif alors qu'il voit un échantillon.

**Barre de résultats** : tri par vues / engagement / date, filtre de marché
(Tous / FR / EN), et un compteur littéral du type « 73 reels · 8 avec
script ». À droite, un bouton « Transcrire le top 10 » qui affiche le coût
estimé avant de lancer.

**Rangée des créateurs** au-dessus de la grille : les comptes les plus
représentés dans les résultats, avatar et taux d'engagement moyen, triés
par engagement et non par nombre de vues.

**Grille de vignettes** au format vertical : badge de rang (#1, #2…) en haut
à gauche, badge de langue détectée en haut à droite, nombre de vues en bas
sur un voile sombre. Sous la vignette : le handle, le taux d'engagement, la
légende tronquée à deux lignes, et une pastille verte `script` quand la
transcription existe déjà.

**Détail d'un reel**, au clic : les métriques complètes (vues, likes,
commentaires, engagement, date de publication, durée, langue), la légende
entière, et le **script intégral** avec ses timecodes. Un bouton « Envoyer
au rédacteur » qui ouvre le chat de l'agent d'écriture avec ce script en
contexte.

### Comment brancher les données — à lire avant de coder

Aucune API officielle Instagram ne donne « les reels les plus vus d'un
hashtag ». Cette page a donc besoin d'un **fournisseur tiers**. Construis
une Edge Function `search-reels` avec une interface stable :

```
search-reels(mode, requête, marché, profondeur, vuesMin, engagementMin, période)
  → [{ url, miniature, handle, vues, likes, commentaires, légende,
       publiéLe, durée, langue }]
```

et deux implémentations derrière la même interface :

1. **`demo`** — un jeu de données de démonstration en base, pour que l'écran
   soit navigable immédiatement. Affiche un bandeau « données de
   démonstration » tant que ce mode est actif. Ne le masque jamais.
2. **`provider`** — l'appel au fournisseur réel, dont la clé vit dans les
   secrets Supabase. Le nom du fournisseur se règle dans Connexions.

Même principe pour la transcription : une Edge Function `transcribe-reel`
avec un mode démo et un mode réel. Enregistre le script dans `reels` pour
ne jamais payer deux fois la même transcription.

## Exécution d'un run

1. Le front crée une ligne `runs` en « en attente » et appelle l'Edge
   Function avec son identifiant.
2. La fonction assemble le prompt — prompt système de l'agent + bases du
   projet + consigne + contexte éventuel — appelle l'API Anthropic en
   streaming et renvoie le flux.
3. À la fin : enregistrement du livrable, statut mis à jour, et **tokens
   réellement consommés** lus dans le champ `usage` renvoyé par l'API pour
   calculer le coût. Jamais une estimation présentée comme une mesure.
4. En cas d'échec : statut « échoué », message d'erreur lisible, bouton
   relancer.

## Ce qu'on ne construit pas en v1

Pas de publication automatique sur les réseaux, pas de facturation, pas
d'équipes multi-utilisateurs, pas de génération d'images, pas d'onglet
« Installer » ni « Héberger » — l'application est hébergée, ces pages n'ont
pas d'objet.

## Ordre de construction

1. Auth, projets (« Les bases »), agents avec édition du prompt système, et
   la page Studio avec les cartes pastel. Trois agents de départ.
2. Le panneau d'agent avec les onglets Chat et Historique, l'Edge Function
   d'exécution en streaming, la table `runs` et les compteurs réels.
3. Livrables et Activité.
4. L'onglet Veille en mode démo, écran complet.
5. Le branchement du fournisseur réel et de la transcription.
6. Calendrier et Connexions.

Commence par l'étape 1 et montre-moi le résultat avant de passer à la
suivante.

---

## Après la génération — à vérifier vous-même

1. **La clé API.** Ouvrez le code de l'Edge Function : elle doit lire un
   secret Supabase, jamais une variable `VITE_…`.
2. **Le coût.** Les tokens enregistrés doivent venir du champ `usage`
   renvoyé par l'API, pas d'un calcul approximatif côté front.
3. **La RLS.** Créez un second compte et vérifiez qu'il ne voit rien du
   premier.
4. **Le bandeau démo.** Vérifiez qu'il est bien visible tant que la veille
   tourne sur des données de démonstration. C'est le piège classique : une
   belle grille de reels qui ne vient de nulle part.

## Le coût réel de l'écran Veille

Cet écran a deux factures, et aucune n'est celle de Lovable :

- **Le fournisseur de données Instagram** — un abonnement mensuel, au
  volume de requêtes.
- **La transcription** — au nombre de vidéos. « Transcrire le top 10 » a un
  prix à chaque clic, d'où le coût estimé avant lancement.

Un utilisateur qui lance dix recherches par jour sur deux marchés consomme
beaucoup plus que ce à quoi on s'attend. Prévoyez le compteur de
consommation dès la v1 : c'est plus facile à ajouter maintenant qu'après.
