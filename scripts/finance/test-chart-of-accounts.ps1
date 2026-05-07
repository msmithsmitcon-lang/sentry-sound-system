$baseUrl = "http://localhost:3000"

Write-Host "Loading chart of accounts..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/chart-of-accounts" `
  -Method GET | ConvertTo-Json -Depth 20
