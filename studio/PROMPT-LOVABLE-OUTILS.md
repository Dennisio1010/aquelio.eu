# Prompt Lovable — donner de vrais outils aux employés

Deux messages, dans l'ordre. **Attendez que le premier soit terminé et
testé** avant d'envoyer le second — c'est ce qui évite qu'il en fasse la
moitié.

---

# MESSAGE 1 — la boucle d'outils et la recherche web

Aujourd'hui, un employé ne peut rien faire d'autre qu'écrire du texte. Il ne
peut ni chercher sur le web, ni lire une page, ni appeler quoi que ce soit.
Résultat : quand on demande à Nina « les reels les plus vus sur ce sujet »,
elle invente des URL et des chiffres de vues plausibles. C'est le pire
comportement possible, parce qu'on ne voit pas la différence.

Je veux ajouter la **boucle d'outils** de l'API Anthropic à la fonction qui
fait parler les employés, et lui donner en premier les outils serveur
d'Anthropic — qui ne demandent aucune clé supplémentaire.

## 1. Réécris la boucle de conversation

Dans l'Edge Function qui appelle `/v1/messages`, remplace l'appel unique par
une boucle. Le principe : Claude répond soit avec du texte final, soit avec
une demande d'outil. Tant qu'il demande un outil, on l'exécute, on lui rend
le résultat, et on recommence.

```ts
const MAX_TOURS = 12;
let messages = [...historique, { role: "user", content: messageUtilisateur }];

for (let tour = 0; tour < MAX_TOURS; tour++) {
  const response = await client.messages.create({
    model: modeleDeLEmploye,
    max_tokens: 16000,
    system: promptSystemeDeLEmploye,
    thinking: { type: "adaptive" },
    output_config: { effort: "high" },
    tools: outilsAutorisesPourCetEmploye,
    messages,
  });

  if (response.stop_reason === "end_turn") {
    // réponse finale — on sort
    break;
  }

  // Un outil serveur a atteint sa limite d'itérations : on renvoie tel quel
  if (response.stop_reason === "pause_turn") {
    messages.push({ role: "assistant", content: response.content });
    continue;
  }

  if (response.stop_reason === "tool_use") {
    messages.push({ role: "assistant", content: response.content });

    const blocsOutils = response.content.filter((b) => b.type === "tool_use");

    // Exécute en parallèle, puis renvoie TOUS les résultats
    // dans UN SEUL message user. Les séparer en plusieurs messages
    // apprend au modèle à ne plus faire d'appels parallèles.
    const resultats = await Promise.all(
      blocsOutils.map(async (bloc) => {
        try {
          const sortie = await executerOutil(bloc.name, bloc.input);
          return {
            type: "tool_result",
            tool_use_id: bloc.id,
            content: JSON.stringify(sortie),
          };
        } catch (e) {
          // Un outil qui échoue renvoie quand même un tool_result,
          // marqué en erreur. Ne jamais l'omettre : le modèle attend
          // un résultat par appel, sinon la requête suivante est invalide.
          return {
            type: "tool_result",
            tool_use_id: bloc.id,
            content: `Erreur : ${e.message}`,
            is_error: true,
          };
        }
      }),
    );

    messages.push({ role: "user", content: resultats });
    continue;
  }

  break;
}
```

**Trois règles à ne pas contourner :**

- `bloc.input` se lit avec `JSON.parse` / comme un objet — jamais par
  comparaison de chaîne. L'échappement JSON varie selon le modèle.
- Un outil en échec renvoie un `tool_result` avec `is_error: true`. Il ne
  disparaît jamais.
- La boucle est plafonnée à 12 tours. Au-delà, on rend ce qu'on a, avec une
  mention claire dans l'interface : « limite d'outils atteinte ».

## 2. Ajoute les outils serveur d'Anthropic

Ils s'exécutent chez Anthropic. **Aucune clé, aucun compte, aucun
fournisseur tiers à brancher** — ils se déclarent, c'est tout, et il n'y a
rien à exécuter côté serveur pour eux.

```ts
const OUTIL_RECHERCHE_WEB = {
  type: "web_search_20260209",
  name: "web_search",
  max_uses: 8,
};

const OUTIL_LECTURE_WEB = {
  type: "web_fetch_20260209",
  name: "web_fetch",
  max_uses: 8,
  citations: { enabled: true },
};
```

Ajoute-les au tableau `tools` des employés concernés. Ces deux-là font
tourner du code chez Anthropic sous le capot : **ne déclare pas en plus
l'outil `code_execution`**, deux environnements d'exécution embrouillent le
modèle.

**Attention au traitement des erreurs** : ces outils ne lèvent pas
d'exception. En cas d'échec, la réponse est un HTTP 200 contenant un bloc
`web_search_tool_result` dont le `content` est un objet d'erreur au lieu
d'une liste. Teste le type avant d'itérer dessus.

## 3. Qui a le droit d'utiliser quoi

Ajoute une colonne `outils` (tableau de texte) sur la table des employés, et
dans « Gérer les employés » une liste à cocher.

Attribue dès maintenant `web_search` et `web_fetch` à : **Victor, Nadia,
Nina, Adrien, Karim, Théo, Amine**.

Laisse le tableau vide pour : **Malik, Sofia, Milo, Inès, Yanis, Chloé,
Nour, Léa**. Ils écrivent ou produisent à partir de ce qu'on leur donne ;
des outils inutiles ne feraient que coûter des jetons.

Un employé sans outil attribué reçoit un tableau `tools` vide — la boucle
tourne, elle sort au premier tour, comportement identique à aujourd'hui.

## 4. Montre ce qui s'est passé

Dans le fil de conversation, affiche chaque appel d'outil au fur et à
mesure : une ligne discrète « 🔍 Recherche : *les termes* » ou
« 📄 Lecture : *l'URL* ». C'est ce qui permet de distinguer une vraie
recherche d'une réponse inventée — et c'est exactement le problème qu'on
corrige. En fin de réponse, affiche le nombre de tours et d'appels d'outils.

## 5. Vérifie les paramètres du modèle

Pendant que tu y es, corrige la requête si ce n'est pas déjà fait :

- Modèles : `claude-opus-5` pour Victor, Karim, Théo, Adrien ;
  `claude-sonnet-5` pour les autres. **Ces identifiants sont complets — ne
  leur ajoute jamais de suffixe de date.**
- `thinking: { type: "adaptive" }` et `output_config: { effort: "high" }`.
- **Aucun préremplissage du message assistant.** Sur `claude-opus-5` et
  `claude-sonnet-5` c'est une erreur 400. Si un préremplissage `{` traîne
  quelque part pour forcer du JSON, retire-le et utilise
  `output_config.format` à la place.
- `budget_tokens` n'existe plus sur ces modèles : erreur 400.

## Le test qui valide ce message

Ouvre le chat de **Nina** et demande :

> Que dit la réglementation européenne sur les PFAS dans l'eau potable
> depuis janvier 2026 ? Donne-moi tes sources.

Ça doit marcher : les lignes « 🔍 Recherche » apparaissent, et la réponse
cite des URL réelles et vérifiables. Si elle répond sans qu'aucune ligne de
recherche s'affiche, la boucle n'est pas branchée.

Arrête-toi là et montre-moi le résultat.

---

# MESSAGE 2 — les outils maison

*(À n'envoyer qu'une fois le message 1 validé.)*

Ajoute trois outils exécutés par nos propres Edge Functions. Chacun est une
fonction séparée, avec sa clé stockée en secret Supabase — **jamais dans le
navigateur**.

## Règle qui prime sur tout le reste

**Un outil dont la clé est absente renvoie une erreur explicite, jamais un
résultat vide ni un résultat simulé.**

```ts
if (!Deno.env.get("METRICOOL_TOKEN")) {
  return {
    erreur: "Connecteur Metricool non configuré. Aucune donnée disponible.",
  };
}
```

Le modèle reçoit cette erreur et le dit à l'utilisateur. C'est le
comportement voulu : mieux vaut « je n'ai pas accès » qu'un chiffre inventé.
Ne mets **aucune donnée de démonstration** dans ces fonctions.

## Outil A — `metricool_stats`

Lit les statistiques réelles des comptes sociaux. Secrets à créer :
`METRICOOL_TOKEN` et `METRICOOL_USER_ID`.

```json
{
  "name": "metricool_stats",
  "description": "Lit les statistiques réelles des comptes sociaux du projet dans Metricool : abonnés, portée, engagement, publications programmées, meilleurs créneaux. À utiliser avant toute affirmation chiffrée sur les performances d'un compte.",
  "input_schema": {
    "type": "object",
    "properties": {
      "marque": { "type": "string", "description": "Nom de la marque Metricool, ex. Aquelio" },
      "reseau": { "type": "string", "enum": ["instagram", "facebook", "tiktok", "linkedin", "youtube", "twitter"] },
      "du": { "type": "string", "description": "Date de début, AAAA-MM-JJ" },
      "au": { "type": "string", "description": "Date de fin, AAAA-MM-JJ" }
    },
    "required": ["marque", "reseau", "du", "au"],
    "additionalProperties": false
  },
  "strict": true
}
```

Attribue-le à **Théo, Inès, Léa, Victor**.

## Outil B — `metricool_brouillon`

Dépose un post en brouillon. **Il ne publie pas.**

La fonction force `draft: true` et `autoPublish: false` **en dur, côté
serveur** — ces deux valeurs ne viennent jamais du modèle et ne sont jamais
surchargeables. C'est la garantie que rien ne part sans relecture humaine.

```json
{
  "name": "metricool_brouillon",
  "description": "Dépose un post en BROUILLON dans Metricool. Ne publie jamais : un humain relit et publie depuis Metricool. À utiliser pour préparer un calendrier éditorial.",
  "input_schema": {
    "type": "object",
    "properties": {
      "marque": { "type": "string" },
      "reseaux": { "type": "array", "items": { "type": "string" } },
      "texte": { "type": "string" },
      "date": { "type": "string", "description": "AAAA-MM-JJTHH:MM:SS" }
    },
    "required": ["marque", "reseaux", "texte", "date"],
    "additionalProperties": false
  },
  "strict": true
}
```

La réponse de l'outil renvoie le lien du brouillon dans Metricool, pour
qu'il s'affiche dans le fil.

Attribue-le à **Inès** uniquement.

Note : la file de relecture Metricool (`createScheduledPostForReview`)
n'est pas utilisable, elle exige un forfait avec gestion d'équipe que le
compte n'a pas. Le brouillon donne la même garantie.

## Outil C — `generer_image`

Génère une image et la stocke dans Supabase Storage. La fonction renvoie
l'**URL publique** — c'est indispensable, puisque Metricool n'accepte que
des URL publiques comme média.

```json
{
  "name": "generer_image",
  "description": "Génère une image à partir d'une description et renvoie son URL publique. Pour les fonds, ambiances et illustrations. Ne pas l'utiliser pour du texte à l'écran : les modèles déforment les lettres accentuées.",
  "input_schema": {
    "type": "object",
    "properties": {
      "description": { "type": "string" },
      "format": { "type": "string", "enum": ["1:1", "4:5", "9:16", "16:9"] }
    },
    "required": ["description", "format"],
    "additionalProperties": false
  },
  "strict": true
}
```

Utilise le fournisseur d'images que tu as déjà de branché. S'il n'y en a
aucun, crée la fonction et fais-la renvoyer l'erreur de non-configuration —
je brancherai le fournisseur ensuite.

Attribue-le à **Milo** uniquement.

## Deux garde-fous à coder, pas à espérer

1. **Plafond de dépense par conversation.** Compte les appels d'outils
   payants dans un tour de chat. Au-delà de 15, la boucle s'arrête et
   affiche « plafond d'outils atteint ». Sans ça, une seule question mal
   posée peut vider une réserve de crédits.

2. **Journal des appels.** Une table `appels_outils` : employé, projet,
   outil, entrée, succès ou échec, horodatage. C'est le seul moyen de savoir
   plus tard ce qui a réellement été appelé, et de retrouver la source d'un
   chiffre affiché il y a trois semaines.

## Le test qui valide ce message

1. **Théo** : « Quelles sont les statistiques Instagram d'Aquelio ce
   mois-ci ? » → doit rendre des chiffres réels, ou dire que le connecteur
   n'est pas configuré. Jamais un tableau inventé.
2. **Inès** : « Prépare un post Facebook pour lundi 10h sur la
   réglementation PFAS » → un brouillon doit apparaître dans Metricool, en
   état brouillon, sans publication automatique.
3. **Milo** : « Génère un fond en 4:5 pour un carrousel » → une image
   stockée, avec son URL publique affichée.

Arrête-toi là et montre-moi le résultat.
