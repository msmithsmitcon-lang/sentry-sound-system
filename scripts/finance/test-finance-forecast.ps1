$baseUrl = "http://localhost:3000"

Write-Host "Loading finance forecast..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/forecast" `
  -Method GET | ConvertTo-Json -Depth 20
