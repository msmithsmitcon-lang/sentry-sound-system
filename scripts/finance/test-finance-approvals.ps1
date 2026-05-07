$baseUrl = "http://localhost:3000"

Write-Host "Creating finance approval..." -ForegroundColor Cyan

$body = @{
  approval_type = "transaction"

  entity_type = "finance_transaction"

  entity_id = "TXN-001"

  requested_by = "system"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/approvals" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading approvals..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/approvals" `
  -Method GET | ConvertTo-Json -Depth 20
