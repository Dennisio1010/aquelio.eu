# Carrousel — « Le 12 janvier, une limite légale »

> Milo (`design-visuel`) · 20 août 2026

## Déclaration d'outil

**OpenArt était absent de mes outils au moment de la production.** Aucune
image générée. Ce n'est pas un contournement : le carrousel est composé en
HTML/CSS, ce que mon protocole impose de toute façon pour tout visuel
porteur de texte — les modèles d'image déforment les lettres accentuées, et
un carrousel est du texte à 90 %.

Ce qui aurait demandé OpenArt, et qui manque donc : un fond photographique
ou illustré derrière les vignettes 01 et 07. En l'état elles sont en aplat
de charte, ce qui est correct et cohérent, mais plus sobre.

## À quoi ça sert

- **Format** : 7 vignettes, 1080 × 1350 px (4:5)
- **Plateformes** : Instagram (carrousel), Facebook, LinkedIn
- **Marché** : Wallonie, FR
- **Source** : `marketing/scripts/2026-08-20-pfas-reglementation.md`, script 1
- **Objectif** : demande du dossier PFAS régional

## Exporter

Ouvrez `carrousel.html` dans un navigateur. Chaque bloc fait exactement
1080 × 1350. Deux méthodes :

1. **Capture** — capture d'écran de chaque vignette, à 100 % de zoom.
2. **Impression PDF** — Ctrl/Cmd + P, sans marges, puis découpe des pages.

Pour corriger un mot, éditez le HTML : le texte n'est pas dans une image.

## La charte appliquée

| Élément | Valeur | D'où ça vient |
|---|---|---|
| Fond principal | `#0f2e2e` teal foncé | `BRAND.md` |
| Accent | `#ff6b5b` corail | `BRAND.md` |
| Fond alterné | `#f5f3ec` blanc chaud | `BRAND.md` |
| Titres | Archivo 800 | `BRAND.md` |
| Corps | Instrument Sans | `BRAND.md` |
| Numéros, pieds, mentions | IBM Plex Mono | `BRAND.md` |

**Trois couleurs, aucune quatrième.** L'alternance foncé / clair d'une
vignette à l'autre est ce qui donne le rythme — pas une couleur de plus.

## Le texte de chaque vignette

1. Le 12 janvier, une limite légale est entrée en vigueur. — *Sur votre eau du robinet. Vous n'en avez pas entendu parler.*
2. **100** — nanogrammes par litre. *Le maximum autorisé, pour vingt substances PFAS additionnées.*
3. Les PFAS ne se dégradent pas. — *Polluants éternels. La loi ne les interdit pas : elle plafonne leur quantité.*
4. Conforme, ce n'est pas zéro. — *Conforme veut dire : sous la limite.*
5. Et en 2028, ça se resserre. — *Un second seuil / quatre substances / toutes les régions ne sont pas logées à la même enseigne.*
6. On a compilé les données publiques. — *Par région, sourcées, datées, six pages.*
7. Votre code postal, et c'est à vous. — *aquelio.eu* + mention légale.

## Déclinaisons

- ✅ **4:5 (1080 × 1350)** — fourni, format natif du carrousel Instagram
- ❌ **1:1** — non fourni. Changez `height:1350px` en `1080px` dans le CSS ;
  les corps de police tiennent, les titres de la 01 déborderont d'une ligne.
- ❌ **9:16 Story** — non fourni. Demande une refonte, pas un recadrage.
- ❌ **NL et DE** — non fournis. Les textes existent dans les scripts 2 et 3 ;
  attention, les titres allemands sont ~20 % plus longs et casseront la mise
  en page actuelle.

## Conformité

✅ **Utilisable tel quel**, sous une réserve.

- Aucun produit montré — le filtre n'existe pas encore, l'illustrer
  laisserait croire qu'il est validé et en vente.
- Aucune allégation santé, aucun danger affirmé, aucun avant/après.
- Aucun verre d'eau trouble, aucune imagerie anxiogène.
- La vignette 07 porte la mention « aucune vente ferme avant validation en
  laboratoire indépendant ».
- Aucun visage, aucune personne générée.

⚠️ **Réserve sur la vignette 05.** Le seuil 2028 est délibérément écrit sans
chiffre (« un second seuil, plus strict ») parce que la valeur de 20 ng/L
et la liste des quatre substances viennent d'un résumé de recherche, pas du
texte officiel — le fetch direct était bloqué. **Vérifiez la TrinkwV avant
d'ajouter le chiffre.** Le pied de vignette porte l'avertissement ; retirez-le
une fois la vérification faite.

## Statut

Utilisable tel quel en FR. À produire encore : les versions NL et DE, la
déclinaison 1:1, et les fonds générés si OpenArt revient.
