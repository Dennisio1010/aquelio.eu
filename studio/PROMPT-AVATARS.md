# Prompts avatars — les douze employés

Douze portraits photoréalistes, cohérents entre eux, pour les cartes du
studio.

**Le vrai problème n'est pas le réalisme, c'est la cohérence.** Douze
portraits magnifiques mais éclairés différemment donnent une grille qui
ressemble à une banque d'images. Douze portraits corrects avec le même
objectif, la même lumière et le même fond donnent une équipe.

D'où la méthode : **le bloc technique ci-dessous se colle mot pour mot dans
les douze prompts**, sans jamais le reformuler. Seule la description de la
personne change.

---

## Le bloc technique — à répéter à l'identique

```
Portrait photographique professionnel, cadrage tête et épaules, sujet
centré, regard vers l'objectif. Objectif 85 mm à f/2.0, arrière-plan
légèrement flou. Éclairage de studio doux : boîte à lumière principale à
45° sur la gauche, réflecteur d'appoint à droite, léger contre-jour sur les
cheveux. Fond uni gris chaud très clair, sans texture ni ombre portée
marquée. Peau naturelle : grain, pores et micro-imperfections visibles,
aucun lissage. Colorimétrie neutre et chaude, contraste doux, hautes
lumières maîtrisées. Format carré, haute résolution. Personne fictive, ne
ressemblant à aucune personnalité réelle.
```

## À exclure — dans le prompt négatif, ou en fin de prompt

```
pas de rendu 3D, pas d'illustration, pas de dessin, pas de peau lissée ou
plastique, pas de sourire figé exagéré, pas de lunettes de soleil, pas de
casquette, pas de logo ni de texte, pas de filigrane, pas de mains, pas de
fond en dégradé ou coloré, pas de bokeh spectaculaire, pas de retouche
beauté, pas de symétrie parfaite du visage.
```

---

## Les douze

Collez le bloc technique, puis la ligne de l'employé.

**Victor** — directeur du studio
Homme d'une cinquantaine d'années, cheveux poivre et sel courts, barbe de
trois jours nette, chemise bleu marine sans cravate, expression calme et
attentive, léger sourire retenu.

**Nadia** — analyste tendances vidéo
Femme d'une trentaine d'années, peau brune, cheveux bouclés relevés,
lunettes fines à monture dorée, pull col rond gris clair, regard vif et
curieux.

**Nina** — chasseuse de reels
Femme d'environ 26 ans, cheveux châtains mi-longs, boucles d'oreilles
discrètes, chemisier écru, expression enjouée, sourire naturel qui atteint
les yeux.

**Malik** — scénariste
Homme d'une trentaine d'années, peau mate, cheveux courts, barbe courte
entretenue, t-shirt noir uni sous une veste souple, expression concentrée et
amicale.

**Inès** — responsable éditoriale
Femme d'environ 35 ans, cheveux noirs lisses attachés, foulard fin autour du
cou, chemise blanche, expression posée et organisée, sourire léger.

**Karim** — stratège acquisition
Homme d'une quarantaine d'années, cheveux courts grisonnants aux tempes,
lunettes rectangulaires, chemise gris clair, expression analytique, sourcils
légèrement froncés par l'attention.

**Sofia** — copywriter publicitaire
Femme d'environ 29 ans, cheveux blonds vénitiens ondulés aux épaules, rouge
à lèvres discret, blazer beige sur t-shirt blanc, expression vive et
espiègle.

**Théo** — analyste performance
Homme d'environ 33 ans, cheveux bruns en bataille maîtrisée, lunettes rondes
à monture fine, chemise à carreaux discrets, expression sérieuse et directe,
sans sourire.

**Yanis** — intégrateur web
Homme d'environ 27 ans, peau claire, cheveux noirs courts, petite boucle
d'oreille, sweat à capuche gris anthracite, expression détendue et
concentrée.

**Chloé** — contrôle qualité
Femme d'environ 31 ans, cheveux roux coupés au carré, taches de rousseur
visibles, chemise en jean, expression attentive et légèrement sceptique,
sourcil droit à peine relevé.

**Amine** — développement commercial
Homme d'environ 38 ans, peau mate, cheveux courts soignés, barbe taillée,
chemise blanche col ouvert, expression chaleureuse et assurée, franc sourire.

**Léa** — reporting client
Femme d'environ 34 ans, peau noire, cheveux en twists relevés, boucles
d'oreilles dorées fines, chemisier bleu poudré, expression bienveillante et
posée, sourire sincère.

---

## Où les générer

Tous ces outils rendent du photoréalisme convaincant. Ce qui compte, c'est
la fonction de cohérence de chacun :

- **Midjourney** — ajoutez `--ar 1:1 --style raw`. Générez le premier
  portrait, puis passez son URL en `--sref` sur les onze autres : c'est ce
  qui verrouille lumière et rendu d'un visage à l'autre.
- **Flux 1.1 Pro** ou **Ideogram** — gardez la même graine (*seed*) entre les
  douze, ou variez-la peu ; le bloc technique fait le reste.
- **ChatGPT / DALL·E** — le plus simple, mais la cohérence est plus fragile.
  Générez les douze **dans une seule conversation**, à la suite, en
  rappelant à chaque fois « même éclairage et même fond que les précédents ».

Générez toujours **deux ou trois variantes par employé** et choisissez : le
taux de déchet sur les visages photoréalistes est élevé, les mains et les
oreilles se déforment, les regards partent de travers.

## Après génération

1. **Recadrez à l'identique** — le haut du crâne à la même hauteur sur les
   douze, les yeux au tiers supérieur. C'est ce qui saute aux yeux dans une
   grille quand c'est raté.
2. **Détourez le fond.** Vos cartes sont pastel : un portrait sur fond gris
   posé sur une carte lavande fait tache. Fond transparent, PNG.
3. **Exportez en 512 × 512 WebP**, autour de 40 à 60 ko. Douze portraits en
   pleine résolution ralentissent la page Studio pour rien.
4. **Téléversez** dans le stockage Supabase du projet et renseignez le champ
   avatar de chaque employé.

## Deux points à ne pas négliger

**Le réalisme se retourne contre vous si on croit à de vraies personnes.**
Ces visages n'existent pas. Sur une page interne, aucun problème. Le jour où
vous montrez le studio à un client ou en public, écrivez quelque part que ce
sont des personas générées — pas des membres d'une équipe. La différence
entre « voici mon outil » et « voici mon agence » se joue là.

**Vérifiez qu'aucun portrait ne ressemble à quelqu'un de connu.** Les
modèles reproduisent parfois un visage célèbre à partir d'une description
générique. Un coup d'œil suffit ; en cas de doute, régénérez.
