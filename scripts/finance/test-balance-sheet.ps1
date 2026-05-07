$baseUrl = "http://localhost:3000"

Write-Host "Loading balance sheet..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/balance-sheet" `
  -Method GET | ConvertTo-Json -Depth 20
