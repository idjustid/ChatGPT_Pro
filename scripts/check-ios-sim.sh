#!/usr/bin/env bash
set -euo pipefail

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "[check-ios-sim] iOS Simulator is only available on macOS (current: $(uname -s))."
  echo "[check-ios-sim] Skipping simulator check without failure."
  exit 0
fi

if ! command -v xcrun >/dev/null 2>&1; then
  echo "[check-ios-sim] xcrun not found. Install Xcode Command Line Tools."
  exit 1
fi

if ! xcrun simctl list devices >/dev/null 2>&1; then
  echo "[check-ios-sim] simctl unavailable. Install full Xcode and launch it once."
  exit 1
fi

echo "[check-ios-sim] iOS Simulator tooling is available."
exit 0
