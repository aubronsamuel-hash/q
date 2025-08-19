#!/usr/bin/env bash
set -euo pipefail

API="http://127.0.0.1:4000"
WEB="http://127.0.0.1:3000"

# 0) System dependencies and Chromium (if not already installed)
if command -v apt-get >/dev/null 2>&1; then
  apt-get update -y
  apt-get install -y \
    libatk1.0-0t64 libatk-bridge2.0-0t64 libcups2t64 libxkbcommon0 \
    libatspi2.0-0t64 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2t64 \
  || apt-get install -y \
    libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon0 \
    libatspi2.0-0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2
  apt-get install -y chromium || apt-get install -y chromium-browser || true
fi

export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
export PW_CHROMIUM_PATH="$(which chromium || which chromium-browser || which google-chrome || echo '')"

# 1) Backend
pushd backend >/dev/null
export USE_SQLITE=1 JWT_SECRET="dev_jwt_secret" PORT=4000
npm ci
nohup node src/server.js >/tmp/api.log 2>&1 &
popd >/dev/null

for i in {1..40}; do curl -fsS "$API/health" >/dev/null && break; sleep 1; done
curl -fsS "$API/health" || { echo "API down"; tail -n 150 /tmp/api.log || true; exit 1; }

# 2) Frontend
pushd frontend >/dev/null
export REACT_APP_API_URL="$API" HOST=0.0.0.0 PORT=3000 BROWSER=none
npm ci
nohup npm start >/tmp/front.log 2>&1 &
popd >/dev/null

for i in {1..60}; do curl -fsS "$WEB" >/dev/null && break; sleep 1; done
curl -fsS "$WEB" || { echo "Front down"; tail -n 150 /tmp/front.log || true; exit 1; }

# 3) E2E
pushd frontend >/dev/null
export E2E_BASE_URL="$WEB" E2E_API_BASE="$API"
npm run e2e
popd >/dev/null
