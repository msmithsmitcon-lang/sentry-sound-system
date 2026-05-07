$baseUrl = "http://localhost:3000"

Write-Host "Creating finance account..." -ForegroundColor Cyan

$body = @{
  name = "Main Bank Account"
  code = "BANK-001"
  type = "cash"
  currency = "ZAR"
  opening_balance = 0
  metadata = @{
    purpose = "Primary operating bank account"
  }
} | ConvertTo-Json -Depth 5

$create = Invoke-RestMethod -Uri "$baseUrl/api/finance/accounts" -Method POST -ContentType "application/json" -Body $body
$create | ConvertTo-Json -Depth 10

Write-Host "`nListing finance accounts..." -ForegroundColor Cyan

$list = Invoke-RestMethod -Uri "$baseUrl/api/finance/accounts" -Method GET
$list | ConvertTo-Json -Depth 10
