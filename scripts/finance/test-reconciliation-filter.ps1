$baseUrl = "http://localhost:3000"

Write-Host "Loading reconciled transactions..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/transactions?reconciliation_status=reconciled" `
  -Method GET | ConvertTo-Json -Depth 15
