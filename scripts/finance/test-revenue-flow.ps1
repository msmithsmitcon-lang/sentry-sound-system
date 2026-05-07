$baseUrl = "http://localhost:3000"

Write-Host "Loading finance accounts..." -ForegroundColor Cyan

$accountsResponse = Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/accounts" `
  -Method GET

$cash = $accountsResponse.accounts | Where-Object {
  $_.code -eq "BANK-001"
} | Select-Object -First 1

$revenue = $accountsResponse.accounts | Where-Object {
  $_.code -eq "REV-001"
} | Select-Object -First 1

if (-not $revenue) {
  Write-Host "Creating revenue account..." -ForegroundColor Cyan

  $revenueBody = @{
    name = "Platform Revenue"
    code = "REV-001"
    type = "revenue"
  } | ConvertTo-Json

  $revenueResponse = Invoke-RestMethod `
    -Uri "$baseUrl/api/finance/accounts" `
    -Method POST `
    -ContentType "application/json" `
    -Body $revenueBody

  $revenue = $revenueResponse.account
}
else {
  Write-Host "Using existing revenue account..." -ForegroundColor Yellow
}

Write-Host "Posting revenue transaction..." -ForegroundColor Cyan

$transactionBody = @{
  debit_account_id = $cash.id
  credit_account_id = $revenue.id
  amount = 2500
  reference_type = "revenue"
  reference_id = "REVENUE-001"
  description = "Platform revenue received"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/transactions" `
  -Method POST `
  -ContentType "application/json" `
  -Body $transactionBody | ConvertTo-Json -Depth 10
