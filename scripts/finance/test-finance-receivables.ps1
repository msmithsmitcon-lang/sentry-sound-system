$baseUrl = "http://localhost:3000"

Write-Host "Creating receivable..." -ForegroundColor Cyan

$body = @{
  customer_name = "Acme Records"
  reference_code = "AR-001"
  amount = 5000
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/receivables" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 10

Write-Host "`nLoading receivables..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/receivables" `
  -Method GET | ConvertTo-Json -Depth 10
