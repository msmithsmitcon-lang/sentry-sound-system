$baseUrl = "http://localhost:3000"

Write-Host "Creating payable..." -ForegroundColor Cyan

$body = @{
  vendor_name = "Meta Ads"
  reference_code = "AP-001"
  amount = 2500
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/payables" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 10

Write-Host "`nLoading payables..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/payables" `
  -Method GET | ConvertTo-Json -Depth 10
