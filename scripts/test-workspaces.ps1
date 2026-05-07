$baseUrl = "http://localhost:3000"

Write-Host "Creating workspace..." -ForegroundColor Cyan

$body = @{
  name = "Sentry Sound Demo Workspace"
  legal_name = "Sentry Sound (Pty) Ltd"
  country_code = "ZA"
  base_currency = "ZAR"
  performed_by = "system"
} | ConvertTo-Json -Depth 5

Invoke-RestMethod `
  -Uri "$baseUrl/api/workspaces" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading workspaces..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/workspaces" `
  -Method GET | ConvertTo-Json -Depth 20
