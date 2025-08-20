# Frontend

## E2E env

Environment variables for Playwright tests:

- `E2E_BASE_URL` (default http://127.0.0.1:3000)
- `E2E_API_BASE` (default http://127.0.0.1:4000)
- `ADMIN_EMAIL` / `ADMIN_PASS`
- `MEMBER_EMAIL` / `MEMBER_PASS`

Run tests with:

```
npm run e2e
```

## Minimal E2E run

Backend:
```
cd backend
set -a; export USE_SQLITE=1 JWT_SECRET=dev_jwt_secret PORT=4000; set +a
npm ci
nohup node src/server.js >/tmp/api.log 2>&1 &
curl -fsS http://127.0.0.1:4000/health
```

Frontend:
```
cd frontend
export REACT_APP_API_URL="http://127.0.0.1:4000"
npm ci
nohup npm start >/tmp/front.log 2>&1 &
curl -fsS http://127.0.0.1:3000
```

E2E:
```
export E2E_BASE_URL="http://127.0.0.1:3000"
export E2E_API_BASE="http://127.0.0.1:4000"
npm --prefix frontend run e2e
```

## Tests

Tests split:
- Unit/Component (Jest): files under src/**/*.test.(js|jsx|ts|tsx)
  Run: npm test -- --watchAll=false
- E2E (Playwright): files under e2e/**/*.spec.ts
  Run: npm run e2e

Ensure system deps for Playwright are installed:
  apt-get update -y
  apt-get install -y libatk1.0-0t64 libatk-bridge2.0-0t64 libcups2t64 libxkbcommon0 libatspi2.0-0t64 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2t64 \ 
    || apt-get install -y libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon0 libatspi2.0-0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2
  apt-get install -y chromium || apt-get install -y chromium-browser

Set environment variables so Playwright uses the system Chromium and skips downloads:

```
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
export PW_CHROMIUM_PATH="$(which chromium || which chromium-browser || which google-chrome)"
```

## Playwright with system Chromium (no downloads)

Install system Chromium and required libraries (Debian/Ubuntu):

```
apt-get update
apt-get install -y chromium || apt-get install -y chromium-browser
# libs may be required: libatk1.0-0[t64], libatk-bridge2.0-0[t64], libcups2[t64], libxkbcommon0, libatspi2.0-0[t64], libxcomposite1, libxdamage1, libxfixes3, libxrandr2, libgbm1, libasound2[t64]
```

Export variables so Playwright skips downloads and points to the system browser:

```
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
export PW_CHROMIUM_PATH="$(which chromium || which chromium-browser || which google-chrome)"
```

Run E2E tests:

```
npm --prefix frontend run e2e
```

Or run everything (deps, servers, tests):

```
chmod +x ./run_all_e2e_nodownload.sh
./run_all_e2e_nodownload.sh
```

## Install system Chrome (Debian/Ubuntu)

```bash
chmod +x ../tools/install_chrome.sh && sudo bash ../tools/install_chrome.sh
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
export PW_CHROMIUM_PATH="/usr/bin/google-chrome-stable"
```

## Local E2E with system Chrome

1) Install Chrome once (Debian/Ubuntu):
   chmod +x ../tools/install_chrome.sh && sudo bash ../tools/install_chrome.sh
2) Export variables:
   export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
   export PW_CHROMIUM_PATH="/usr/bin/google-chrome-stable"
3) Run all-in-one:
   chmod +x ./run_all_e2e_nodownload.sh
   ./run_all_e2e_nodownload.sh
Troubleshooting:
- If PW_CHROMIUM_PATH is different, set it accordingly (e.g. /usr/bin/google-chrome).
- Ensure backend /health and frontend 3000 are reachable before E2E.
