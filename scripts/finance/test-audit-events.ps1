$baseUrl = "http://localhost:3000"

Write-Host "Creating finance audit event..." -ForegroundColor Cyan

$body = @{
  event_type = "transaction"

  entity_type = "finance_transaction"

  entity_id = "TXN-001"

  action = "created"

  performed_by = "system"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/audit-events" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading finance audit events..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/audit-events" `
  -Method GET | ConvertTo-Json -Depth 20
