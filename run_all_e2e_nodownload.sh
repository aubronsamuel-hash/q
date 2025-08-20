#!/usr/bin/env bash
set -euo pipefail

API="http://127.0.0.1:4000"
WEB="http://127.0.0.1:3000"

export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
export PW_CHROMIUM_PATH="${PW_CHROMIUM_PATH:-/usr/bin/google-chrome-stable}"

# Backend
pkill -f "node src/server.js" 2>/dev/null || true
pushd backend >/dev/null
export USE_SQLITE=1 JWT_SECRET="dev_jwt_secret" PORT=4000
mkdir -p ./data
npm ci
nohup node src/server.js >/tmp/api.log 2>&1 &
popd >/dev/null

for i in {1..40}; do
  if curl -fsS "$API/health" >/dev/null; then echo "API UP"; break; fi
  sleep 1
done
if ! curl -fsS "$API/health" >/dev/null; then
  echo "API still down"; tail -n 200 /tmp/api.log || true; exit 1
fi

# Frontend
pkill -f "npm start" 2>/dev/null || true
pushd frontend >/dev/null
export REACT_APP_API_URL="$API" HOST=0.0.0.0 PORT=3000 BROWSER=none
npm ci
nohup npm start >/tmp/front.log 2>&1 &
popd >/dev/null

for i in {1..60}; do
  if curl -fsS "$WEB" >/dev/null; then echo "FRONT UP"; break; fi
  sleep 1
done
if ! curl -fsS "$WEB" >/dev/null; then
  echo "Front still down"; tail -n 200 /tmp/front.log || true; exit 1
fi

# E2E
pushd frontend >/dev/null
export E2E_BASE_URL="$WEB" E2E_API_BASE="$API"
npm run e2e || { echo "E2E failed"; tail -n 200 /tmp/api.log || true; tail -n 200 /tmp/front.log || true; exit 1; }
popd >/dev/null

echo "DONE"
