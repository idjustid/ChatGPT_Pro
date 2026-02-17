#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "[run-ios] iOS Simulator 실행은 macOS + Xcode 환경에서만 지원됩니다 (current: $(uname -s))."
  echo "[run-ios] 실패 없이 종료합니다. 앱 확인은 'npm run start'를 사용하세요."
  exit 0
fi

if [[ -x "node_modules/.bin/expo" ]]; then
  exec node_modules/.bin/expo run:ios
fi

if command -v expo >/dev/null 2>&1; then
  exec expo run:ios
fi

echo "[run-ios] Expo CLI를 찾을 수 없습니다."
echo "[run-ios] 먼저 의존성 설치 후 다시 시도하세요: npm run install:deps"
exit 1
