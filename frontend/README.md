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
