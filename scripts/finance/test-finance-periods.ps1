$baseUrl = "http://localhost:3000"

Write-Host "Creating finance period..." -ForegroundColor Cyan

$body = @{
  period_year = 2026
  period_month = 5
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/periods" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 10

Write-Host "`nLoading finance periods..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/periods" `
  -Method GET | ConvertTo-Json -Depth 10
