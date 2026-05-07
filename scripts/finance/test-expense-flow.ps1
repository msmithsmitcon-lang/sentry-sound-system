$baseUrl = "http://localhost:3000"

Write-Host "Loading finance accounts..." -ForegroundColor Cyan

$accountsResponse = Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/accounts" `
  -Method GET

$cash = $accountsResponse.accounts | Where-Object {
  $_.code -eq "BANK-001"
} | Select-Object -First 1

$expense = $accountsResponse.accounts | Where-Object {
  $_.code -eq "EXP-001"
} | Select-Object -First 1

if (-not $expense) {

  Write-Host "Creating expense account..." -ForegroundColor Cyan

  $expenseBody = @{
    name = "Marketing Expense"
    code = "EXP-001"
    type = "expense"
  } | ConvertTo-Json

  $expenseResponse = Invoke-RestMethod `
    -Uri "$baseUrl/api/finance/accounts" `
    -Method POST `
    -ContentType "application/json" `
    -Body $expenseBody

  $expense = $expenseResponse.account
}
else {
  Write-Host "Using existing expense account..." -ForegroundColor Yellow
}

Write-Host "Posting expense transaction..." -ForegroundColor Cyan

$transactionBody = @{
  debit_account_id = $expense.id
  credit_account_id = $cash.id
  amount = 500
  reference_type = "expense"
  reference_id = "EXPENSE-20260507110539"
  description = "Instagram marketing spend"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/transactions" `
  -Method POST `
  -ContentType "application/json" `
  -Body $transactionBody | ConvertTo-Json -Depth 10
