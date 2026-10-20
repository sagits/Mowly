#!/usr/bin/env bash
# Runs the Maestro flows of one app (or both) against the booted simulator, with that app's Metro.
# Usage: scripts/e2e.sh <customer|pro|all> [flow.yaml]
set -um # -m: each background job gets its own process group, so Metro dies with its npx wrapper
cd "$(dirname "$0")/.."
DEVICE="${E2E_DEVICE:-iPhone 16}"
METRO_PID=""

stop_metro() {
  [ -n "$METRO_PID" ] && { kill -- "-$METRO_PID" 2>/dev/null; wait "$METRO_PID" 2>/dev/null; }
  METRO_PID=""
}
trap stop_metro EXIT
trap 'exit 130' INT TERM

run_app() {
  local app=$1 flow=${2:-} port
  [ "$app" = customer ] && port=8081 || port=8082
  local udid
  udid=$(xcrun simctl list devices | grep -F "    $DEVICE (" | head -1 | sed -E 's/.*\(([0-9A-F-]{36})\).*/\1/')
  [ -n "$udid" ] || { echo "simulator '$DEVICE' not found"; return 1; }
  if curl -s "localhost:$port/status" | grep -q packager-status:running; then
    echo "port $port is already served by a Metro; stop it first"; return 1
  fi
  xcrun simctl boot "$DEVICE" 2>/dev/null || true
  (cd "apps/$app" && exec npx expo start --port "$port" >"../../.e2e-metro-$app.log" 2>&1) &
  METRO_PID=$!
  local i=0
  until curl -s "localhost:$port/status" | grep -q packager-status:running; do
    i=$((i+1)); [ $i -gt 120 ] && { echo "Metro on $port did not start"; stop_metro; return 1; }
    sleep 2
  done
  # a leftover foreground app makes Maestro fail "did not stop in time" on clearState
  xcrun simctl terminate "$udid" com.renatoprobst.mowly 2>/dev/null; xcrun simctl terminate "$udid" com.renatoprobst.mowlypro 2>/dev/null
  maestro --device "$udid" test --format junit --output "apps/$app/.maestro/report.xml" "${flow:-apps/$app/.maestro}"
  local code=$?
  stop_metro
  return $code
}

case "${1:-}" in
  customer|pro) run_app "$1" "${2:-}" ;;
  all) rc=0; run_app customer || rc=1; run_app pro || rc=1; exit $rc ;;
  *) echo "usage: $0 <customer|pro|all> [flow.yaml]"; exit 2 ;;
esac
