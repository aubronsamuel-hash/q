#!/usr/bin/env bash
set -euo pipefail

API="http://127.0.0.1:4000"
WEB="http://127.0.0.1:3000"

export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
export PW_CHROMIUM_PATH="${PW_CHROMIUM_PATH:-/usr/bin/google-chrome-stable}"

# Backend
pushd backend >/dev/null
export USE_SQLITE=1 JWT_SECRET="dev_jwt_secret" PORT=4000
npm ci
nohup node src/server.js >/tmp/api.log 2>&1 &
popd >/dev/null
for i in {1..40}; do curl -fsS "$API/health" >/dev/null && break; sleep 1; done
curl -fsS "$API/health" || { echo "API down"; tail -n 150 /tmp/api.log || true; exit 1; }

# Frontend
pushd frontend >/dev/null
export REACT_APP_API_URL="$API" HOST=0.0.0.0 PORT=3000 BROWSER=none
npm ci
nohup npm start >/tmp/front.log 2>&1 &
popd >/dev/null
for i in {1..60}; do curl -fsS "$WEB" >/dev/null && break; sleep 1; done
curl -fsS "$WEB" || { echo "Front down"; tail -n 150 /tmp/front.log || true; exit 1; }

# E2E
pushd frontend >/dev/null
export E2E_BASE_URL="$WEB" E2E_API_BASE="$API"
npm run e2e
popd >/dev/null
