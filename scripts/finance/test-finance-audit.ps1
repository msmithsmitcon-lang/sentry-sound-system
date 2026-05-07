$baseUrl = "http://localhost:3000"

Write-Host "Loading expense audit trail..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/audit?reference_type=expense" `
  -Method GET | ConvertTo-Json -Depth 20

Write-Host "`nLoading BANK-001 audit trail..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/audit?account_code=BANK-001" `
  -Method GET | ConvertTo-Json -Depth 20
