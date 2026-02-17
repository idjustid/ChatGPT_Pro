#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DIST_DIR="$ROOT_DIR/dist"
APP_NAME="${APP_NAME:-EggEvolutionMatch}"
APP_PATH="${APP_PATH:-$ROOT_DIR/build/${APP_NAME}.app}"
DMG_PATH="$DIST_DIR/${APP_NAME}.dmg"

mkdir -p "$DIST_DIR"

if [[ "$(uname -s)" != "Darwin" ]]; then
  cat > "$DIST_DIR/DMG_NOT_AVAILABLE_ON_LINUX.txt" <<MSG
DMG packaging is macOS-only.

Current host: $(uname -s)
Requested output: $DMG_PATH

If your goal is Apple App Store (iOS) deployment, build an IPA instead:
  npm run deploy:ios

If you really need DMG, run this on macOS with Xcode tools:
  APP_PATH=/path/to/${APP_NAME}.app npm run package:dmg
MSG
  echo "[package-dmg] macOS가 아니므로 DMG 생성 대신 안내 파일을 생성했습니다: $DIST_DIR/DMG_NOT_AVAILABLE_ON_LINUX.txt"
  exit 0
fi

if ! command -v hdiutil >/dev/null 2>&1; then
  echo "[package-dmg] hdiutil not found. Install Xcode Command Line Tools."
  exit 1
fi

if [[ ! -d "$APP_PATH" ]]; then
  echo "[package-dmg] App bundle not found: $APP_PATH"
  echo "[package-dmg] Build your macOS app first, then retry."
  exit 1
fi

TMP_DIR="$(mktemp -d)"
cp -R "$APP_PATH" "$TMP_DIR/"
hdiutil create -volname "$APP_NAME" -srcfolder "$TMP_DIR" -ov -format UDZO "$DMG_PATH" >/dev/null
rm -rf "$TMP_DIR"

echo "[package-dmg] DMG created: $DMG_PATH"
