$baseUrl = "http://localhost:3000"

Write-Host "Loading cash flow summary..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/cash-flow" `
  -Method GET | ConvertTo-Json -Depth 20
