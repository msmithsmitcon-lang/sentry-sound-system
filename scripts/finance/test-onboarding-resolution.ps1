$baseUrl = "http://localhost:3000"

Write-Host "Testing onboarding finance resolution..." -ForegroundColor Cyan

$body = @{
  country_code = "ZA"
  is_vat_registered = $false
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/onboarding-resolution" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20
