$baseUrl = "http://localhost:3000"

Write-Host "Creating exchange rate..." -ForegroundColor Cyan

$body = @{
  base_currency = "USD"
  target_currency = "ZAR"
  exchange_rate = 18.50
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/exchange-rates" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading exchange rates..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/exchange-rates" `
  -Method GET | ConvertTo-Json -Depth 20
