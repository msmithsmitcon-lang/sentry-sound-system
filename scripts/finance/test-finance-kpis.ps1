$baseUrl = "http://localhost:3000"

Write-Host "Loading finance KPIs..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/kpis" `
  -Method GET | ConvertTo-Json -Depth 20
