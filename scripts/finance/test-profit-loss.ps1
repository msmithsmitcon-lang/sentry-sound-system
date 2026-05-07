$baseUrl = "http://localhost:3000"

Write-Host "Loading Profit & Loss statement..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/profit-loss" `
  -Method GET | ConvertTo-Json -Depth 20
