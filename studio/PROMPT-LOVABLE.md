# Prompt à coller dans Lovable

Copiez tout le bloc ci-dessous dans le premier message d'un nouveau projet
Lovable. Il décrit l'application complète, l'architecture et l'ordre de
construction — Lovable travaille beaucoup mieux avec un cadrage de ce type
qu'avec « fais-moi un dashboard d'agents IA ».

Trois réglages à faire avant d'envoyer :
- remplacez `Studio Denis` par le nom que vous voulez donner au produit ;
- si vous ne voulez pas de multi-projets en v1, supprimez la table
  `projects` et la section « Projets » ;
- gardez la section « Ce qu'on ne construit pas en v1 » : c'est elle qui
  empêche Lovable de partir dans tous les sens.

---

Construis **Studio Denis**, une application web qui pilote une équipe
d'employés IA. Chaque employé est un agent spécialisé (veille vidéo,
rédaction d'annonces, analyse de performance…) à qui on confie une tâche
et qui rend un livrable écrit.

## Stack et contraintes

- React + TypeScript + Tailwind + shadcn/ui, Supabase pour l'auth, la base
  et le stockage.
- Les appels au modèle passent **exclusivement** par une Edge Function
  Supabase. La clé API Anthropic est un secret serveur : elle ne doit
  jamais apparaître dans le bundle front, ni transiter par le navigateur.
- Row Level Security activée sur toutes les tables : un utilisateur ne voit
  que ses propres données.
- Interface en français. Dates au format JJ/MM/AAAA, montants en euros.

## Modèle de données

- `profiles` — utilisateur, nom, plan.
- `projects` — un projet ou un client : nom, secteur, marchés, langues,
  **objectif de conversion mesuré**, contraintes de conformité, notes de
  brief (texte long). C'est le contexte que les agents reçoivent.
- `agents` — nom d'affichage (« Nina »), rôle (« chasseuse de reels »), pôle
  (contenu / acquisition / produit / commercial / direction), description
  courte, **prompt système** (texte long, éditable), modèle utilisé,
  paramètres attendus (JSON), chemin de livrable, actif oui/non.
- `runs` — une exécution : agent, projet, consigne saisie, statut
  (en attente / en cours / terminé / échoué), horodatages, tokens entrée,
  tokens sortie, coût calculé, message d'erreur.
- `deliverables` — le résultat d'un run : titre, contenu Markdown, agent,
  projet, date, favori oui/non.
- `messages` — l'historique de conversation d'un run (rôle, contenu).
- `connections` — intégrations tierces : nom, statut, date de dernière
  vérification. **Les clés elles-mêmes vont dans les secrets Supabase, pas
  dans cette table.**

## Écrans

**Accueil** — l'état du studio : runs récents avec leur statut, derniers
livrables, consommation du mois (tokens et coût réels, calculés depuis
`runs` — aucun chiffre décoratif). Un sélecteur de projet en haut, qui
conditionne tout le reste de l'application.

**Studio** — la page principale. Les employés en cartes, groupés par pôle,
chaque carte montrant le nom, le rôle, une phrase de description et l'état
réel (actif / inactif). Un clic ouvre la fiche : ce qu'il fait, quand
l'appeler, ce qu'il rend, et un bouton « Lancer ». En tête de page, une
carte distincte pour le **directeur** : on lui décrit l'objectif en langage
courant et il propose quels employés mobiliser, à valider avant exécution.

**Lancer une tâche** — un panneau latéral : le projet (pré-rempli), la
consigne en texte libre, les paramètres propres à l'agent (par exemple pour
Nina : hashtag, marché, seuil de vues, période, nombre de vidéos), et une
**estimation de coût affichée avant confirmation**. Puis la réponse arrive
en streaming, avec un bouton d'annulation.

**Livrables** — la bibliothèque de tout ce qui a été produit : filtres par
projet, agent, date ; rendu Markdown propre ; export en `.md` et copie dans
le presse-papier ; favoris.

**Projets** — création et édition du brief : offre, marchés, langues,
conversion mesurée, concurrents, contraintes de conformité, ton. Ce texte
est injecté dans le prompt système à chaque run — affiche clairement à
l'utilisateur que sans brief rempli, les agents travaillent à l'aveugle.

**Employés** — création et édition d'un agent : nom, rôle, pôle, prompt
système dans un éditeur confortable, modèle, paramètres. Un employé est
donc une donnée, pas du code : on doit pouvoir en ajouter un sans toucher
à l'application.

**Connexions** — l'état des intégrations, avec un bouton « tester la
connexion » qui appelle une Edge Function et affiche le résultat réel.

## Exécution d'un run

1. Le front crée une ligne `runs` en statut « en attente » et appelle
   l'Edge Function avec l'identifiant du run.
2. L'Edge Function assemble le prompt : prompt système de l'agent + brief
   du projet + consigne + paramètres, appelle l'API Anthropic en streaming,
   et renvoie le flux au client.
3. À la fin, elle enregistre le contenu dans `deliverables`, met à jour le
   statut, et **stocke les tokens réellement consommés** renvoyés par l'API
   pour calculer le coût. Jamais d'estimation présentée comme une mesure.
4. En cas d'échec, le statut passe à « échoué » avec le message d'erreur
   lisible, et l'utilisateur peut relancer.

## Design

Sobre et professionnel, pas de dégradé ni d'effet inutile. Une couleur par
pôle, utilisée comme information (liseré de carte, puce d'état) et non comme
décoration. Typographie : une police à caractère pour les noms d'employés et
les titres, une sans-serif neutre pour le texte, une monospace pour les
identifiants techniques et les chiffres. Mode clair et mode sombre, tous
deux soignés. Responsive : la page doit être utilisable sur téléphone.

## Ce qu'on ne construit pas en v1

Pas de recherche Instagram ou TikTok intégrée, pas de scraping, pas de
publication automatique sur les réseaux, pas de facturation, pas de
multi-utilisateurs par équipe. Les agents produisent du texte à partir de
ce qu'on leur donne. Ces briques viendront après, chacune avec sa propre
intégration.

## Ordre de construction

1. Auth, projets, employés (avec un jeu de départ de trois agents), édition
   des prompts système.
2. L'Edge Function d'exécution avec streaming, la table `runs`, la
   consommation réelle affichée.
3. La bibliothèque de livrables avec export.
4. La page Studio complète et le directeur qui propose une répartition.
5. Les connexions et la page d'accueil.

Commence par l'étape 1 et montre-moi le résultat avant de passer à la
suivante.

---

## Après la génération — les trois points à vérifier vous-même

Lovable produira une application qui tourne. Ces trois points-là ne se
voient pas à l'écran et coûtent cher s'ils sont faux :

1. **La clé API.** Ouvrez le code de la fonction et vérifiez qu'elle lit un
   secret Supabase et jamais une variable `VITE_…` — tout ce qui commence
   par `VITE_` finit dans le navigateur, donc public.
2. **Le coût.** Vérifiez que les tokens enregistrés viennent bien du champ
   `usage` renvoyé par l'API, et non d'un calcul approximatif côté front.
   Un compteur faux est pire qu'aucun compteur.
3. **La RLS.** Créez un deuxième compte et vérifiez qu'il ne voit rien du
   premier. Lovable active RLS, mais les politiques valent ce que vaut leur
   rédaction.

## Ce que cette application ne remplacera pas

Les employés de Lovable écriront du texte à partir du brief et de la
consigne. Ils **n'auront pas** les outils dont disposent vos agents dans
Claude Code : lecture du dépôt, recherche web, transcription de vidéos,
accès aux statistiques. Chacun de ces outils est une intégration à
construire séparément dans l'Edge Function.

Autrement dit : l'application Lovable vous donne l'**interface** et la
mémoire des livrables ; les agents du dépôt vous donnent le **travail**.
Les deux peuvent coexister — même prompts système, deux façons de les
lancer.
