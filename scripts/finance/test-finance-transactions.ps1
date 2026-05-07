$baseUrl = "http://localhost:3000"

Write-Host "Loading finance accounts..." -ForegroundColor Cyan

$accountsResponse = Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/accounts" `
  -Method GET

$cash = $accountsResponse.accounts | Where-Object { $_.code -eq "BANK-001" } | Select-Object -First 1
$liability = $accountsResponse.accounts | Where-Object { $_.code -eq "LIAB-001" } | Select-Object -First 1

if (-not $cash) {
  throw "Missing BANK-001 cash account. Run test-finance-accounts.ps1 first."
}

if (-not $liability) {
  Write-Host "Creating liability account..." -ForegroundColor Cyan

  $body = @{
    name = "Royalty Liability"
    code = "LIAB-001"
    type = "liability"
  } | ConvertTo-Json

  $liabilityResponse = Invoke-RestMethod `
    -Uri "$baseUrl/api/finance/accounts" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

  $liability = $liabilityResponse.account
} else {
  Write-Host "Using existing liability account..." -ForegroundColor Yellow
}

Write-Host "Creating finance transaction..." -ForegroundColor Cyan

$transactionBody = @{
  debit_account_id = $cash.id
  credit_account_id = $liability.id
  amount = 1500
  reference_type = "royalty_event"
  reference_id = "ROYALTY-001"
  description = "Royalty liability allocation"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/transactions" `
  -Method POST `
  -ContentType "application/json" `
  -Body $transactionBody | ConvertTo-Json -Depth 10
