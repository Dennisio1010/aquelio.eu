# Les outils du studio — qui appelle quoi

> Lu par tout agent qui doit **produire** et pas seulement décrire.
> Un agent qui écrit « je recommande de générer un visuel » au lieu de le
> générer n'a pas fait son travail.

## La règle des identifiants

Les outils des connecteurs (MCP) portent un identifiant **haché qui change
d'une connexion à l'autre** : `mcp__<hash>__watch_url` aujourd'hui,
`mcp__Transcript_X__watch_url` demain. **Ne jamais coder un identifiant en
dur, ni dans une liste `tools:`, ni dans une instruction.**

La bonne façon : chercher l'outil **par son nom de fonction** (`watch_url`,
`openart_generate_image`, `createScheduledPostForReview`) dans les outils
disponibles, et l'appeler. S'il est absent, c'est que le connecteur est
déconnecté — le dire, ne pas simuler.

## Ce qui existe, et pour quoi

### TranscriptX — voir les vidéos, avec les vrais chiffres

| Fonction | Ce qu'elle fait | Coût |
|---|---|---|
| `watch_url` | Images horodatées + transcription + **vues, likes, commentaires réels** | 2 crédits |
| `transcribe_url` | La transcription seule | 1 crédit |
| `list_creator_videos` | La liste des vidéos d'un compte, avec leurs vues | — |
| `get_account_status` | La réserve de crédits restante | — |

Marche sur TikTok, Instagram, YouTube, Facebook, X, LinkedIn — à partir
d'une **URL publique**. Ne demande aucun accès aux comptes.

**Vérifier la réserve avant une série.** Une veille à trous vaut mieux
qu'une veille inventée : signaler l'épuisement, ne pas combler.

### OpenArt — générer les images et les vidéos

| Fonction | Ce qu'elle fait |
|---|---|
| `openart_model_list` | Les modèles disponibles |
| `openart_model_form_get` | Les paramètres attendus d'un modèle |
| `openart_model_cost` | Le coût d'une génération **avant** de la lancer |
| `openart_generate_image` | Génère une image |
| `openart_generate_video` | Génère une vidéo courte |
| `openart_creation_get` | Récupère le résultat |

**C'est l'outil de Milo.** Un carrousel se produit ici, il ne se décrit pas.

### Metricool — les vrais chiffres, et la programmation

| Fonction | Ce qu'elle fait |
|---|---|
| `getBrandSettings` | Les marques connectées et leurs réseaux |
| `getAnalyticsDataByMetrics` | Les statistiques réelles d'un compte |
| `getBestTimeToPostByNetwork` | Les créneaux, sur données du compte |
| `getScheduledPosts` | Ce qui est déjà programmé |
| `createScheduledPostForReview` | **Crée le post en file de relecture** |
| `createScheduledPost` | Programme directement — **interdit sans accord écrit** |

**La distinction est la garantie.** `...ForReview` dépose un brouillon que
Denis relit et valide ; rien ne part sans lui. C'est ce que les agents
utilisent. `createScheduledPost` publie pour de vrai : jamais sans une
instruction explicite dans le message, au cas par cas.

### ElevenLabs — la voix

`creative_generate_speech` pour une voix off (appeler `creative_list_voices`
d'abord : une voix ne s'invente pas). Utile pour les formats TikTok sans
visage.

### Recherche web

`WebSearch` et `WebFetch` restent la source des faits sourcés : agences
publiques, réglementation, presse locale. Toute affirmation chiffrée porte
son URL et sa date.

## Ce qu'aucun outil ne fait

**Personne ne donne « les reels les plus vus du hashtag X ».** Ni API
publique, ni connecteur. Le scraping d'Instagram et de TikTok viole leurs
conditions et se fait bloquer.

Le chemin réel, en trois temps :

1. **Repérer** — TikTok Creative Center (gratuit, public) pour les hashtags
   et les sons qui montent, Meta Ad Library pour les publicités actives par
   pays, recherche web pour les comptes qui circulent.
2. **Récolter** — `list_creator_videos` sur chaque compte repéré, trier par
   vues.
3. **Disséquer** — `watch_url` sur les meilleures.

C'est plus lent qu'un bouton magique et c'est le seul chemin honnête.
**Dire toujours quel chemin a été pris.**

## Les deux chiffres qui comptent

- **Taux d'engagement** = (likes + commentaires) / vues
- **Indice de surperformance** = vues ÷ médiane des 8-15 dernières vidéos du
  même compte

400 000 vues sur un compte à 15 000 de médiane, c'est un signal (×27). Sur
un compte à 2 millions, c'est un échec (×0,2). Sans l'indice, un classement
par vues brutes ne dit rien.
