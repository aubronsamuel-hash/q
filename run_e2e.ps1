# Runs Playwright end-to-end tests for the frontend

# Check backend
try {
  Invoke-WebRequest http://localhost:4000/health | Out-Null
} catch {
  Write-Host "Backend not reachable at http://localhost:4000" -ForegroundColor Yellow
}

# Check frontend
try {
  Invoke-WebRequest http://localhost:3000 | Out-Null
} catch {
  Write-Host "Frontend not reachable at http://localhost:3000" -ForegroundColor Yellow
}

# Default environment variables
if (-not $env:E2E_BASE_URL) { $env:E2E_BASE_URL = "http://localhost:3000" }
if (-not $env:E2E_API_BASE) { $env:E2E_API_BASE = "http://localhost:4000" }
if (-not $env:ADMIN_EMAIL) { $env:ADMIN_EMAIL = "admin@example.com" }
if (-not $env:ADMIN_PASS) { $env:ADMIN_PASS = "Admin123!" }
if (-not $env:MEMBER_EMAIL) { $env:MEMBER_EMAIL = "member@example.com" }
if (-not $env:MEMBER_PASS) { $env:MEMBER_PASS = "Member123!" }

Push-Location "$PSScriptRoot/frontend"

if (-not (Test-Path 'node_modules')) {
  npm ci
}

npx playwright install
npm run e2e

Pop-Location
