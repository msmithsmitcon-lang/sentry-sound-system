$baseUrl = "http://localhost:3000"

Write-Host "Loading general ledger..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/general-ledger" `
  -Method GET | ConvertTo-Json -Depth 20
