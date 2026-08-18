#!/usr/bin/env bash
# Installe le pack d'agents marketing portables.
#
#   ./.claude/install.sh                  → installation globale (~/.claude)
#                                           les agents deviennent disponibles
#                                           dans TOUS vos projets
#   ./.claude/install.sh /chemin/projet   → copie dans un projet précis
#                                           (utile en mandat client : le pack
#                                           part avec le dépôt du client)
#
# Le pack ne contient aucun contexte projet : celui-ci vit dans
# marketing/BRIEF.md, propre à chaque projet. Relancer ce script après avoir
# modifié un agent pour propager la mise à jour.

set -euo pipefail

SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CIBLE="${1:-$HOME}/.claude"

if [ "${1:-}" != "" ] && [ ! -d "$1" ]; then
  echo "Erreur : le dossier « $1 » n'existe pas." >&2
  exit 1
fi

mkdir -p "$CIBLE/agents" "$CIBLE/skills" "$CIBLE/templates"

for agent in "$SOURCE"/agents/*.md; do
  cp "$agent" "$CIBLE/agents/"
  echo "agent    → $CIBLE/agents/$(basename "$agent")"
done

for skill in "$SOURCE"/skills/*/; do
  nom="$(basename "$skill")"
  mkdir -p "$CIBLE/skills/$nom"
  cp -R "$skill." "$CIBLE/skills/$nom/"
  echo "skill    → $CIBLE/skills/$nom/"
done

cp "$SOURCE"/templates/*.md "$CIBLE/templates/"
echo "modèle   → $CIBLE/templates/"

cp "$SOURCE/STUDIO.md" "$CIBLE/STUDIO.md"
echo "studio   → $CIBLE/STUDIO.md"

echo
echo "Pack installé dans $CIBLE"
echo "Prochaine étape dans un projet : /brief-projet, puis /studio"
