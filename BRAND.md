# Aquelio — Charte graphique

Référence interne pour l'usage du logo et de l'identité visuelle. À transmettre
tel quel à un graphiste, une agence ou un fournisseur qui doit manipuler ces
fichiers.

## Le mark

Un entonnoir à 3 étages surmontant une goutte d'eau — évoque la filtration
et l'eau qui en sort, plutôt qu'un symbole générique lié à l'eau (goutte
seule, vague...). Les trois étages sont graphiques : l'architecture réelle
du produit (nombre d'étages, technologie) n'est pas encore arrêtée — voir
`FOURNISSEUR.md`. Ne pas les légender comme des « étapes de filtration »
tant que ce point n'est pas confirmé.

## Fichiers disponibles (`public/assets/`)

| Fichier | Usage |
|---|---|
| `logo-on-light.png` | Logo complet (icône + « AQUELIO »), sur fond clair — documents, emails, communications fournisseurs |
| `logo-on-dark.png` | Logo complet, sur fond teal foncé — mêmes usages sur fond sombre |
| `mark-on-light.png` | Icône seule, teal + corail, sans fond — réseaux sociaux, avatar, favicon-like |
| `mark-on-dark.png` | Icône seule, blanc chaud + corail, sans fond — sur fond sombre |
| `mono-black.png` | Icône seule, noir uni — gravure, tampon, impression une couleur, fax/photocopie |
| `mono-white.png` | Icône seule, blanc uni — gravure/impression sur fond sombre ou matière teintée |
| `favicon.ico` | Onglet navigateur (silhouette simplifiée, sans les 3 bandes internes — lisible dès 16px) |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | Icônes d'application / écran d'accueil (mark détaillé, fond teal) |

Le logo intégré au site lui-même est en SVG inline (dans le `<header>` de
chaque page HTML) — toujours net, à toute taille, sans fichier séparé.

## Espace de protection

Laisser une marge libre autour du logo au moins égale à la hauteur de la
goutte (le petit cercle en bas du mark). Aucun texte, bord de page ou autre
élément graphique ne doit entrer dans cette zone.

## Taille minimum

- Icône seule : jamais en dessous de 16px de large (limite déjà testée pour
  le favicon).
- Logo complet (icône + texte) : jamais en dessous de 90px de large — en
  dessous, le texte devient illisible avant l'icône.

## Couleurs

| Rôle | Hex |
|---|---|
| Teal foncé (fond, texte sur clair) | `#0f2e2e` |
| Corail (accent, goutte) | `#ff6b5b` |
| Blanc chaud (texte/icône sur fond sombre) | `#f5f3ec` |

Pas d'autre couleur sur le mark. Pas de dégradé, pas d'ombre portée, pas de
contour.

## Typographie du wordmark

« AQUELIO » en majuscules, police **Archivo** (variable), axe de graisse
(weight) 500, axe de largeur (width) 125 — police déjà chargée sur le site
via Google Fonts. Ne pas substituer par une autre police sans regénérer le
wordmark à l'identique.

## À ne pas faire

- Ne pas recolorer le mark en dehors des 3 couleurs ci-dessus.
- Ne pas déformer, incliner ou faire pivoter le logo.
- Ne pas séparer la goutte du reste du mark, ni changer l'ordre des éléments.
- Ne pas placer le logo teal/corail sur un fond de faible contraste (ex. gris
  moyen) — utiliser systématiquement la version mono dans ce cas.
- Ne pas régénérer le mark à partir des anciens rendus IA (Lovart/Artlist) :
  la version de référence est celle construite en coordonnées vectorielles
  précises (voir `logo-on-light.png` / SVG du site), qui reste nette à toute
  taille contrairement aux rendus raster IA d'origine.
