$baseUrl = "http://localhost:3000"

Write-Host "Loading AR/AP summary..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/ar-ap-summary" `
  -Method GET | ConvertTo-Json -Depth 20
