# PowerShell API smoke test
$baseUrl = $env:API_BASE_URL
if ([string]::IsNullOrWhiteSpace($baseUrl)) { $baseUrl = "http://localhost:4000" }
Write-Host "BASE URL: $baseUrl"

function Invoke-Api {
    param([string]$method, [string]$path, $body, [string]$token)
    $headers = @{}
    if ($token) { $headers['Authorization'] = "Bearer $token" }
    $params = @{ Method = $method; Uri = "$baseUrl$path"; Headers = $headers; ContentType = 'application/json'; ErrorAction = 'Stop' }
    if ($body) { $params.Body = ($body | ConvertTo-Json -Depth 5) }
    return Invoke-RestMethod @params
}

# Register admin (idempotent)
Write-Host 'Registering admin...'
try {
    Invoke-Api 'POST' '/auth/register' @{ email='admin@example.com'; password='adminpass'; role='admin' } | Out-Null
} catch {
    if ($_.Exception.Response.StatusCode -ne 409) { throw }
}
Write-Host 'Promote admin via SQL then press Enter...'
Read-Host | Out-Null

# Admin login
Write-Host 'Logging in admin...'
$adminLogin = Invoke-Api 'POST' '/auth/login' @{ email='admin@example.com'; password='adminpass' }
$adminToken = $adminLogin.token

# Create project and milestone
$id = Get-Random
$projName = "Proj$id"
Write-Host 'Creating project...'
$project = Invoke-Api 'POST' '/projects' @{ name=$projName; description='Demo' } $adminToken
Write-Host 'Creating milestone...'
$milestone = Invoke-Api 'POST' "/projects/$($project.id)/milestones" @{ name='M1' } $adminToken

# Register member
Write-Host 'Registering member...'
try {
    Invoke-Api 'POST' '/auth/register' @{ email='member@example.com'; password='memberpass'; hourlyRate=100 } | Out-Null
} catch {
    if ($_.Exception.Response.StatusCode -ne 409) { throw }
}
$memberLogin = Invoke-Api 'POST' '/auth/login' @{ email='member@example.com'; password='memberpass' }
$memberToken = $memberLogin.token
$memberId = $memberLogin.user.id

# Create task
Write-Host 'Creating task assigned to member...'
$task = Invoke-Api 'POST' "/projects/$($project.id)/tasks" @{ name="Task$id"; assignedUserId=$memberId } $adminToken

# Member updates status and logs time
Write-Host 'Member sets task in_progress...'
Invoke-Api 'PUT' "/tasks/$($task.id)" @{ status='in_progress' } $memberToken | Out-Null
Write-Host 'Member logs time...'
Invoke-Api 'POST' "/tasks/$($task.id)/timelogs" @{ hours=2 } $memberToken | Out-Null
Write-Host 'Member sets task done...'
Invoke-Api 'PUT' "/tasks/$($task.id)" @{ status='done' } $memberToken | Out-Null

# Fetch project cost
Write-Host 'Fetching project cost...'
$cost = Invoke-Api 'GET' "/projects/$($project.id)/cost" $null $adminToken
$cost | ConvertTo-Json
