$baseUrl = "http://localhost:3000"

Write-Host "Loading retained earnings..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/retained-earnings" `
  -Method GET | ConvertTo-Json -Depth 20
