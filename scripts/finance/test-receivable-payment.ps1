$baseUrl = "http://localhost:3000"

Write-Host "Loading receivables..." -ForegroundColor Cyan

$receivables = Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/receivables" `
  -Method GET

$receivable = $receivables.receivables[0]

Write-Host "Processing receivable payment..." -ForegroundColor Cyan

$body = @{
  amount = 2000
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/receivables/$($receivable.id)/payment" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20
