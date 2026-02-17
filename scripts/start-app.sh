#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PORT="${PORT:-4173}"
HOST="${HOST:-0.0.0.0}"

has_expo_local="0"
if [[ -x "node_modules/.bin/expo" ]]; then
  has_expo_local="1"
fi

if [[ "$has_expo_local" == "1" ]]; then
  echo "[start-app] Starting Expo dev server..."
  exec node_modules/.bin/expo start
fi

echo "[start-app] Expo is not available in this environment."
echo "[start-app] Starting instant preview server instead: http://$HOST:$PORT"
echo "[start-app] (Set up npm mirror + install deps to run full Expo app.)"
exec python3 -m http.server "$PORT" --bind "$HOST" --directory preview
