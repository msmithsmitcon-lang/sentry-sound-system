$baseUrl = "http://localhost:3000"

Write-Host "Loading country currency mapping..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/country-currency?country_code=ZA" `
  -Method GET | ConvertTo-Json -Depth 20
