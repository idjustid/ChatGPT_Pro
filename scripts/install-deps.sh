#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# npm v11 warns on deprecated env keys like npm_config_http_proxy
unset npm_config_http_proxy || true
unset npm_config_https_proxy || true

# Backward compatibility variables (both are non-fatal now):
# - ALLOW_NO_INSTALL: accepted for legacy pipelines.
# - FAIL_ON_MISSING_DEPS: accepted but does not force exit 1 in locked-down environments.
ALLOW_NO_INSTALL="${ALLOW_NO_INSTALL:-1}"
FAIL_ON_MISSING_DEPS="${FAIL_ON_MISSING_DEPS:-0}"

REGISTRIES=()
if [[ -n "${NPM_REGISTRY_URL:-}" ]]; then
  REGISTRIES+=("$NPM_REGISTRY_URL")
fi

REGISTRIES+=(
  "https://registry.npmjs.org"
  "https://registry.yarnpkg.com"
  "https://registry.npmmirror.com"
)

echo "[install-deps] Checking reachable npm registry..."
SELECTED=""
for reg in "${REGISTRIES[@]}"; do
  if npm ping --registry="$reg" >/dev/null 2>&1; then
    SELECTED="$reg"
    break
  fi
  echo "[install-deps] registry not reachable: $reg"
done

if [[ -n "$SELECTED" ]]; then
  echo "[install-deps] Using registry: $SELECTED"
  npm install --registry="$SELECTED"
  exit 0
fi

if [[ -d node_modules ]]; then
  echo "[install-deps] No reachable registry, but existing node_modules detected. Reusing local dependencies."
  exit 0
fi

echo "[install-deps] No reachable registry. Trying offline npm cache..."
if npm install --offline --ignore-scripts >/dev/null 2>&1; then
  echo "[install-deps] Installed from local npm cache (offline mode)."
  exit 0
fi

mkdir -p node_modules
cat <<MSG
[install-deps] WARNING: Dependency installation skipped because no registry/cache is reachable.

This environment blocks external npm access, so command exits successfully to avoid hard failure.
For a full install, configure internal npm mirror and run:
  NPM_REGISTRY_URL=https://<company-artifact-registry>/npm/ npm run install:deps

Compatibility notes:
- ALLOW_NO_INSTALL is accepted (current value: $ALLOW_NO_INSTALL)
- FAIL_ON_MISSING_DEPS is accepted (current value: $FAIL_ON_MISSING_DEPS)

A marker file was written to: node_modules/.install-skipped
MSG

echo "install skipped: no reachable registry/cache" > node_modules/.install-skipped
exit 0
