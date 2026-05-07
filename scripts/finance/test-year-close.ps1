$baseUrl = "http://localhost:3000"

Write-Host "Creating financial year..." -ForegroundColor Cyan

$body = @{
  financial_year = 2026
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/year-close" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading financial years..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/year-close" `
  -Method GET | ConvertTo-Json -Depth 20
