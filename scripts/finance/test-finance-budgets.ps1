$baseUrl = "http://localhost:3000"

Write-Host "Creating finance budget..." -ForegroundColor Cyan

$body = @{
  name = "Marketing Budget"
  account_code = "EXP-001"
  budget_year = 2026
  budget_month = 5
  planned_amount = 10000
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/budgets" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading finance budgets..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/budgets" `
  -Method GET | ConvertTo-Json -Depth 20
