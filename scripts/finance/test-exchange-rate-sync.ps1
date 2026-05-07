$baseUrl = "http://localhost:3000"

Write-Host "Syncing official exchange rate..." -ForegroundColor Cyan

$body = @{
  base_currency = "USD"
  target_currency = "ZAR"
  exchange_rate = 18.72

  source_name = "South African Reserve Bank"
  source_type = "central_bank"

  source_reference = "SARB Daily FX"

  is_official = $true
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/exchange-rates/sync" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20
