# Start backend with SQLite and run API tests
$baseUrl = $env:API_BASE_URL
if ([string]::IsNullOrWhiteSpace($baseUrl)) { $baseUrl = "http://localhost:4000" }
$env:API_BASE_URL = $baseUrl
Write-Host "API_BASE_URL: $baseUrl"

if ([string]::IsNullOrWhiteSpace($env:USE_SQLITE)) { $env:USE_SQLITE = "1" }
if ([string]::IsNullOrWhiteSpace($env:JWT_SECRET)) { $env:JWT_SECRET = "dev_jwt_secret" }
if ([string]::IsNullOrWhiteSpace($env:PORT)) { $env:PORT = "4000" }

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $scriptDir 'backend'

Push-Location $backendPath
npm ci | Out-Null
$server = Start-Process npm 'run dev:sqlite' -WindowStyle Minimized -PassThru

$health = "$baseUrl/health"
for ($i=0; $i -lt 20; $i++) {
    Start-Sleep -Seconds 1
    try {
        Invoke-RestMethod -Method Get -Uri $health -ErrorAction Stop | Out-Null
        break
    } catch {
        if ($i -eq 19) { throw 'Backend did not start' }
    }
}
Pop-Location

powershell -ExecutionPolicy Bypass -File "$scriptDir\test_api.ps1"
