$baseUrl = "http://localhost:3000"

Write-Host "Loading finance alerts..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/alerts" `
  -Method GET | ConvertTo-Json -Depth 20
