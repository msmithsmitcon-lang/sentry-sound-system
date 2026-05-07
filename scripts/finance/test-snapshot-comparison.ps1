$baseUrl = "http://localhost:3000"

Write-Host "Loading finance snapshot comparison..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/snapshots/compare" `
  -Method GET | ConvertTo-Json -Depth 20
