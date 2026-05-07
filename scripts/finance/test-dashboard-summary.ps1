$baseUrl = "http://localhost:3000"

Write-Host "Loading finance dashboard..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/dashboard-summary" `
  -Method GET | ConvertTo-Json -Depth 20
