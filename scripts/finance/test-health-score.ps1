$baseUrl = "http://localhost:3000"

Write-Host "Loading finance health score..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/health-score" `
  -Method GET | ConvertTo-Json -Depth 20
