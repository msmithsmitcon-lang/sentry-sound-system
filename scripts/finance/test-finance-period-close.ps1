$baseUrl = "http://localhost:3000"

Write-Host "Loading finance periods..." -ForegroundColor Cyan

$periods = Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/periods" `
  -Method GET

$period = $periods.periods[0]

Write-Host "Closing finance period..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/periods/$($period.id)/close" `
  -Method POST | ConvertTo-Json -Depth 10
