$baseUrl = "http://localhost:3000"

Write-Host "Creating non-VAT registered tax profile..." -ForegroundColor Cyan

$body = @{
  entity_name = "Small Indie Label"
  country_code = "ZA"
  is_vat_registered = $false
  tax_registration_status = "not_registered"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/tax-profiles" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading tax profiles..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/tax-profiles" `
  -Method GET | ConvertTo-Json -Depth 20
