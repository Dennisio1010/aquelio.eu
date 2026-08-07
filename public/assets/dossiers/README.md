# Dossiers PFAS régionaux

Trois PDF, produits hors code (Canva, Google Docs ou InDesign — export PDF).
**Ils n'existent pas encore : sans eux, le bouton de téléchargement des pages
de remerciement renvoie une 404.** C'est le dernier verrou avant mise en ligne.

| Fichier | Couverture | Servi à |
|---|---|---|
| `wallonie.pdf` | Wallonie + Bruxelles | `/merci.html` — codes postaux BE 1000–1499 et 4000–7999 |
| `vlaanderen.pdf` | Flandre | `/nl/bedankt.html` — codes postaux BE 1500–3999 et 8000–9999 |
| `deutschland.pdf` | Allemagne | `/de/danke.html` — tous codes postaux DE (5 chiffres) |

Le choix se fait sur le préfixe du code postal saisi, pas sur la langue de la
page : un visiteur flamand arrivé sur la version FR reçoit `vlaanderen.pdf`.
La règle vit à deux endroits qui doivent rester alignés — `public/thanks.js`
(choix du lien) et `server.js` (`regionFor`, pour l'export).

## Format conseillé

6 à 8 pages, mise en page aux couleurs de la marque (teal `#0f2e2e`, corail
`#ff6b5b`, blanc chaud `#f5f3ec`), **sources citées à chaque affirmation**.

## Ce que doit contenir le dossier Wallonie

C'est le mieux documenté des trois, et le seul marché où le problème d'eau de
distribution est réel et documenté.

- Rapport SPW « Les PFAS dans les eaux de distribution en Wallonie — État des
  lieux », version mars 2026 : 3 160 résultats entre septembre 2023 et
  décembre 2025, sur 641 zones de distribution. Source centrale.
- Outil cartographique SPW Environnement (mars 2026) — vérifier que les données
  PFAS y sont désormais intégrées ; mise à jour annuelle en juin.
- ODWB (Open Data Wallonie-Bruxelles) — jeux de données du SPW ARNE.
- Rapports des distributeurs : SWDE (« Qualité de mon eau »), CILE, INASEP,
  inBW, IEG, AIEC.
- Portail Environnement-Santé Wallonie — page PFAS, FAQ, campagne de
  prélèvements sanguins ISSeP.

À intégrer : la norme PFAS-20 à 100 ng/L applicable depuis le 12 janvier 2026,
la valeur cible PFAS-4 à 4 ng/L, les zones ayant connu des dépassements, la
campagne de biomonitoring sanguin, les filtres à charbon installés sur le
feeder du Hainaut.

## Ce que doit contenir le dossier Flandre

- VMM — geoloket waterkwaliteit, PFAS-verkenner (Databank Ondergrond Vlaanderen)
- Rapports qualité des sociétés d'eau : Pidpa, De Watergroep, Farys, Vivaqua

**Angle obligatoire.** L'eau potable flamande est conforme à la norme
européenne : les campagnes de mesure des sociétés d'eau n'ont relevé aucun
dépassement des 100 ng/L pour les PFAS-20. Le dossier porte sur l'exposition
environnementale (sols, nappes, eaux de surface — la Flandre est un point
chaud reconnu depuis l'affaire 3M Zwijndrecht), **jamais** sur une
contamination de l'eau de distribution. Les textes de `/nl/` sont écrits sur
cet angle ; le PDF doit s'y tenir.

## Ce que doit contenir le dossier Allemagne

- Umweltbundesamt (UBA) — données PFAS
- Rapports annuels de qualité des Wasserversorger locaux

## À étudier avant de produire

`pfaskaartvlaanderen.be` — plateforme indépendante qui agrège les données PFAS
flamandes et bruxelloises sur une carte interactive, monétisée par liens
affiliés vers des filtres à eau. Le mécanisme « vérifiez votre commune » y est
déjà déployé.
