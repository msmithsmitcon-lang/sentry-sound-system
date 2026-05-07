$baseUrl = "http://localhost:3000"

Write-Host "Loading finance accounts..." -ForegroundColor Cyan

$accounts = Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/accounts" `
  -Method GET

$cash = $accounts.accounts | Where-Object {
  $_.code -eq "BANK-001"
} | Select-Object -First 1

Write-Host "Loading account ledger..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/accounts/$($cash.id)" `
  -Method GET | ConvertTo-Json -Depth 20
