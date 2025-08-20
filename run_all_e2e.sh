#!/usr/bin/env bash
set -euo pipefail

echo "[1/6] Install system libs for Playwright (Debian/Ubuntu)..."
if command -v apt-get >/dev/null 2>&1; then
  apt-get update -y
  apt-get install -y \
    libatk1.0-0t64 libatk-bridge2.0-0t64 libcups2t64 libxkbcommon0 \
    libatspi2.0-0t64 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2t64 \
  || apt-get install -y \
    libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon0 \
    libatspi2.0-0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2
else
  echo "apt-get not found; skip system libs install"
fi

echo "[2/6] Install Playwright Chromium..."
npx --yes playwright install-deps chromium || true
npx --yes playwright install chromium

API_URL_IPV4="http://127.0.0.1:4000"
FRONT_URL_IPV4="http://127.0.0.1:3000"

echo "[3/6] Start backend (SQLite quick run)..."
pushd backend >/dev/null
export USE_SQLITE=1
export JWT_SECRET="dev_jwt_secret"
export PORT=4000
npm ci
nohup node src/server.js >/tmp/api.log 2>&1 &
popd >/dev/null

echo "Wait for API /health..."
for i in {1..40}; do
  if curl -fsS "${API_URL_IPV4}/health" >/dev/null; then
    echo "API UP"
    break
  fi
  sleep 1
done
curl -fsS "${API_URL_IPV4}/health" || { echo "API still down"; tail -n 120 /tmp/api.log || true; exit 1; }

echo "[4/6] Start frontend (CRA dev server)..."
pushd frontend >/dev/null
export REACT_APP_API_URL="${API_URL_IPV4}"
export HOST=0.0.0.0
export PORT=3000
export BROWSER=none
npm ci
nohup npm start >/tmp/front.log 2>&1 &
popd >/dev/null

echo "Wait for Frontend 3000..."
for i in {1..60}; do
  if curl -fsS "${FRONT_URL_IPV4}" >/dev/null; then
    echo "FRONT UP"
    break
  fi
  sleep 1
done
curl -fsS "${FRONT_URL_IPV4}" || { echo "Front still down"; tail -n 120 /tmp/front.log || true; exit 1; }

echo "[5/6] Run Playwright E2E..."
pushd frontend >/dev/null
export E2E_BASE_URL="${FRONT_URL_IPV4}"
export E2E_API_BASE="${API_URL_IPV4}"
npm run e2e || { echo "E2E failed"; tail -n 120 /tmp/api.log || true; tail -n 120 /tmp/front.log || true; exit 1; }
popd >/dev/null

echo "[6/6] DONE: E2E passed."
