$baseUrl = "http://localhost:3000"

Write-Host "Loading finance summary..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/summary" `
  -Method GET | ConvertTo-Json -Depth 15
