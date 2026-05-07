$baseUrl = "http://localhost:3000"

Write-Host "Loading overdue finance summary..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/overdue-summary" `
  -Method GET | ConvertTo-Json -Depth 20
