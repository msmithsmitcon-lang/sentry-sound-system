$baseUrl = "http://localhost:3000"

Write-Host "Loading payables..." -ForegroundColor Cyan

$payables = Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/payables" `
  -Method GET

$payable = $payables.payables[0]

Write-Host "Processing payable payment..." -ForegroundColor Cyan

$body = @{
  amount = 1000
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/payables/$($payable.id)/payment" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20
