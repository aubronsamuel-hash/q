# Project Management App Scaffold

This repository contains a minimal, production-ready scaffold split into two folders:

- **backend/** – Node.js + Express + Sequelize (PostgreSQL)
- **frontend/** – React with React Router and hooks

## Backend

### Quick start

- Copy `.env.example` to `.env`
- Use the default `DATABASE_URL` to connect to the local Docker PostgreSQL
- Start the database: `docker compose up -d`
- Run: `npm run dev`
- Visit: [http://localhost:4000/health](http://localhost:4000/health)

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Copy the example environment file and adjust values:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Run the linter:
   ```bash
   npm run lint
   ```

### Environment variables

The backend expects the following variables in a `.env` file:

- `DATABASE_URL` – connection string for PostgreSQL
- `JWT_SECRET` – secret key used to sign JSON Web Tokens
- `PORT` – port for the HTTP server (defaults to `4000` if not set)

### Promote a user to admin

Promote an existing account to administrator with a direct SQL query or the helper script.

**SQL (PostgreSQL):**

```sql
update "Users" set role='admin' where email='admin@example.com';
```

**NPM script:**

```bash
cd backend
npm run promote:admin -- user@example.com
```

## Frontend

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Copy the example environment file and adjust values:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Create a production build:
   ```bash
   npm run build
   ```

### Environment variables

Create a `.env` file with:

- `REACT_APP_API_URL` – base URL of the backend API (e.g. `http://localhost:4000`)

Both applications use environment variables and are ready for further development.

## Smoke Test

### Commands

Backend:
```
npm ci
npm run dev
```
or
```
npm run start
Invoke-WebRequest http://localhost:4000/health
```

Frontend:
```
setx REACT_APP_API_URL "http://localhost:4000"
# open new terminal
npm ci
npm start
```

Tests:
```
setx API_BASE_URL "http://localhost:4000"
powershell -ExecutionPolicy Bypass -File C:\\Users\\SAM\\test_api.ps1
```

### Checklist

- /health returns status ok
- test_api.ps1 completes with project cost JSON
- Front: login admin, create project, add task, member logs time, totals visible

## Dockerized Postgres

Start a local PostgreSQL container:

```
docker compose up -d
docker compose ps
docker compose logs -f postgres
```

## Local run

```
cp .env.example .env   # keep DATABASE_URL as docker localhost URL
npm ci
npm run db:up
npm run dev
curl http://localhost:4000/health
```

## Troubleshooting: ECONNREFUSED

```
docker compose ps           # postgres must be healthy
docker compose logs -f postgres  # check for crash loops
netstat -ano | findstr :5432
psql -h localhost -p 5432 -U postgres -d pm_app -c "\l"
```
If running outside Docker, update `DATABASE_URL` host/port accordingly. On WSL or Codespaces, use `127.0.0.1` and ensure port mapping.

## Run without Docker

1. Copy `.env.example` to `.env`.

**Option A (SQLite):**

```
set USE_SQLITE=1
npm run dev:sqlite
```

**Option B (Postgres native):**

```
set DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/pm_app
npm run dev
```

Check:

```
curl http://localhost:4000/health
```

### Postgres native (Windows)

- Install PostgreSQL 15
- Create database:

  ```
  psql -U postgres -h localhost -c "CREATE DATABASE pm_app;"
  ```
- Example `.env`:

  ```
  DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/pm_app
  JWT_SECRET=dev_jwt_secret
  PORT=4000
  ```
- Start API:

  ```
  npm ci
  npm run dev
  ```
- Troubleshooting: ECONNREFUSED -> check service, firewall, port 5432


## Playwright dependencies

Install system libraries and Chromium:

```bash
chmod +x tools/install_playwright_deps.sh && bash tools/install_playwright_deps.sh
```

## Run Playwright tests

Ensure the backend and frontend are running, then use the system Chromium:

```bash
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
export PW_CHROMIUM_PATH="$(which chromium || which chromium-browser || which google-chrome)"
npm --prefix frontend run e2e
```

Alternatively, run the helper script which installs dependencies, starts services, and executes the E2E suite:

```bash
chmod +x run_all_e2e_nodownload.sh
./run_all_e2e_nodownload.sh
```

## Production deployment (systemd + Nginx)

1. Create a dedicated user and directories:
   ```bash
   sudo useradd --system --home /opt/pm pm
   sudo mkdir -p /opt/pm/backend /opt/pm/frontend
   ```
2. Copy backend and frontend folders to `/opt/pm` and install dependencies:
   ```bash
   cd /opt/pm/backend && npm ci
   cd /opt/pm/frontend && npm ci && npm run build
   ```
3. Create `/opt/pm/backend/.env` with production values.
4. Copy unit files and enable services:
   ```bash
   sudo cp deploy/pm-api.service /etc/systemd/system/
   sudo cp deploy/pm-web.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable --now pm-api pm-web
   ```
5. Install Nginx and deploy the config:
   ```bash
   sudo cp deploy/nginx.conf /etc/nginx/sites-available/pm.conf
   sudo ln -s /etc/nginx/sites-available/pm.conf /etc/nginx/sites-enabled/pm.conf
   sudo systemctl reload nginx
   ```
6. Test the deployment:
   ```bash
   curl https://your-domain/health
   ```

## Migrate from SQLite to Postgres

1. Export the existing SQLite data:
   ```bash
   USE_SQLITE=1 node scripts/exportSqlite.js
   ```
   This creates `data/export-YYYYMMDD.json`.
2. Update `.env` with `DATABASE_URL` pointing to Postgres and run migrations.
3. Import the JSON into Postgres:
   ```bash
   node scripts/importPostgres.js data/export-YYYYMMDD.json
   ```
4. Verify table counts to ensure the migration succeeded.
