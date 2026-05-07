$baseUrl = "http://localhost:3000"

Write-Host "Checking finance API health..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/health" `
  -Method GET | ConvertTo-Json -Depth 20
