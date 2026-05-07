$baseUrl = "http://localhost:3000"

Write-Host "Loading finance transactions..." -ForegroundColor Cyan

$transactions = Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/transactions" `
  -Method GET

$transaction = $transactions.transactions[0]

Write-Host "Updating reconciliation status..." -ForegroundColor Cyan

$body = @{
  reconciliation_status = "reconciled"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/transactions/$($transaction.id)/reconcile" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 10
