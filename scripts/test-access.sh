#!/bin/bash

# ------------ CONFIG ----------------
ACTOR=$1  # simulate GitHub user
BRANCH_TO_DIFF=${2:-main}

ACCESS_FILE="access-control.json"
ADMIN_FILE=".github/security/access-config.yaml"

echo "🧪 Simulation pour l'utilisateur: $ACTOR"
echo "🔁 Comparaison avec branche: $BRANCH_TO_DIFF"
echo ""

# ------------ CHECK FILES -----------
if [ ! -f "$ACCESS_FILE" ]; then
  echo "❌ Fichier $ACCESS_FILE manquant"
  exit 1
fi

if [ -f "$ADMIN_FILE" ]; then
  ADMINS=$(python3 -c "import yaml; print(','.join(yaml.safe_load(open('$ADMIN_FILE'))['admins']))")
else
  echo "⚠️ Pas de fichier admin trouvé, tous les utilisateurs seront considérés comme non-admin"
  ADMINS=""
fi

# ------------ GET MODIFIED FILES -----------
git fetch origin $BRANCH_TO_DIFF > /dev/null 2>&1
MODIFIED_FILES=$(git diff --name-only origin/$BRANCH_TO_DIFF...HEAD)

if [ -z "$MODIFIED_FILES" ]; then
  echo "✅ Aucun fichier modifié — test terminé"
  exit 0
fi

echo "📦 Fichiers modifiés :"
echo "$MODIFIED_FILES"
echo ""

# ------------ CHECK LOGIC -----------

VIOLATION=0

for FILE in $MODIFIED_FILES; do
  # Protection spéciale
  if [[ "$FILE" == "access-control.json" || "$FILE" == .github/workflows/* || "$FILE" == .github/security/* ]]; then
    if [[ ! ",$ADMINS," =~ ",$ACTOR," ]]; then
      echo "❌ $ACTOR n'est PAS autorisé à modifier $FILE"
      VIOLATION=1
    else
      echo "✅ $ACTOR est autorisé à modifier $FILE"
    fi
    continue
  fi

  # Vérification dossier par access-control.json
  DIR=$(echo "$FILE" | grep -E '^(apps|packages)/' | cut -d/ -f1-2)
  if [ -z "$DIR" ]; then
    continue
  fi

  ALLOWED=$(jq -r --arg dir "$DIR" '.[$dir] // empty | @csv' "$ACCESS_FILE" | tr -d '"')

  if [ -z "$ALLOWED" ]; then
    echo "❌ Aucun droit défini pour $DIR — PR bloquée"
    VIOLATION=1
  elif [[ ! ",$ALLOWED," =~ ",$ACTOR," ]]; then
    echo "❌ $ACTOR n'est pas autorisé à modifier $DIR"
    VIOLATION=1
  else
    echo "✅ $ACTOR est autorisé à modifier $DIR"
  fi
done

echo ""
if [ "$VIOLATION" -eq 1 ]; then
  echo "❌ Fin du test : des violations ont été détectées."
  exit 1
else
  echo "✅ Fin du test : tout est conforme."
  exit 0
fi