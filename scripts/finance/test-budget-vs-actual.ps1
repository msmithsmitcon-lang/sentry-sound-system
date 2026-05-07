$baseUrl = "http://localhost:3000"

Write-Host "Loading budget vs actual report..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/budget-vs-actual" `
  -Method GET | ConvertTo-Json -Depth 20
