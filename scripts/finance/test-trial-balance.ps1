$baseUrl = "http://localhost:3000"

Write-Host "Loading trial balance..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/trial-balance" `
  -Method GET | ConvertTo-Json -Depth 20
