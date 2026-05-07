$baseUrl = "http://localhost:3000"

Write-Host "Creating tax rate..." -ForegroundColor Cyan

$body = @{
  name = "South Africa VAT"
  country_code = "ZA"
  tax_type = "VAT"
  rate = 15
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/tax-rates" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading tax rates..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/tax-rates" `
  -Method GET | ConvertTo-Json -Depth 20
