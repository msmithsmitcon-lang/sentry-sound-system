$baseUrl = "http://localhost:3000"

Write-Host "Creating finance role..." -ForegroundColor Cyan

$body = @{
  role_name = "finance_admin"
  description = "Full finance administration access"
  permissions = @{
    can_create_transactions = $true
    can_close_periods = $true
    can_reopen_periods = $true
    can_manage_tax = $true
    can_view_reports = $true
  }
} | ConvertTo-Json -Depth 5

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/roles" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading finance roles..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/roles" `
  -Method GET | ConvertTo-Json -Depth 20
