$baseUrl = "http://localhost:3000"

Write-Host "Running finance health check..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/health-check" `
  -Method GET | ConvertTo-Json -Depth 20
