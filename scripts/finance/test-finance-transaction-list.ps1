$baseUrl = "http://localhost:3000"

Write-Host "Loading finance transactions..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/transactions" `
  -Method GET | ConvertTo-Json -Depth 15
