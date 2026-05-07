$baseUrl = "http://localhost:3000"

Write-Host "Testing currency conversion..." -ForegroundColor Cyan

$body = @{
  amount = 100
  base_currency = "USD"
  target_currency = "ZAR"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/currency-convert" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20
