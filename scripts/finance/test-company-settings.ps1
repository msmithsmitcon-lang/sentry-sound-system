$baseUrl = "http://localhost:3000"

Write-Host "Creating company finance settings..." -ForegroundColor Cyan

$body = @{
  company_name = "Sentry Sound"

  country_code = "ZA"

  base_currency = "ZAR"

  reporting_currency = "ZAR"

  is_vat_registered = $false

  tax_registration_status = "not_registered"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/company-settings" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading company finance settings..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/company-settings" `
  -Method GET | ConvertTo-Json -Depth 20
