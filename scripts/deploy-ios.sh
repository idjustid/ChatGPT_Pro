#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DIST_DIR="$ROOT_DIR/dist"
mkdir -p "$DIST_DIR"

cat <<MSG
[deploy-ios] Apple App Store 배포는 DMG가 아니라 IPA를 사용합니다.
MSG

FAIL_ON_MISSING_EAS="${FAIL_ON_MISSING_EAS:-0}"

if ! command -v eas >/dev/null 2>&1; then
  if [[ "$FAIL_ON_MISSING_EAS" == "1" ]]; then
    echo "[deploy-ios] EAS CLI가 없습니다. 설치: npm install -g eas-cli"
    exit 1
  fi

  cat > "$DIST_DIR/DEPLOY_IOS_SKIPPED.txt" <<MSG
EAS CLI is not installed in this environment.

Install:
  npm install -g eas-cli

Then run:
  npm run deploy:ios

Strict mode (fail if EAS missing):
  FAIL_ON_MISSING_EAS=1 npm run deploy:ios

Reference flow:
  eas login
  eas build --platform ios --profile production --non-interactive
  eas submit --platform ios --non-interactive
MSG
  cp "$DIST_DIR/DEPLOY_IOS_SKIPPED.txt" "$DIST_DIR/IOS_DEPLOY_SKIPPED.txt"
  echo "[deploy-ios] EAS CLI 미설치로 배포를 건너뜁니다. 안내 파일: $DIST_DIR/DEPLOY_IOS_SKIPPED.txt"
  exit 0
fi

# non-interactive CI friendly toggle
EAS_FLAGS="${EAS_FLAGS:---non-interactive}"

set -x
eas build --platform ios --profile production ${EAS_FLAGS}
eas submit --platform ios ${EAS_FLAGS}
set +x
