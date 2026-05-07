$baseUrl = "http://localhost:3000"

Write-Host "Creating finance note..." -ForegroundColor Cyan

$body = @{
  entity_type = "finance_transaction"

  entity_id = "TXN-001"

  note = "Invoice verified and approved."

  note_type = "approval"

  created_by = "finance_admin"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/notes" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading finance notes..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/notes" `
  -Method GET | ConvertTo-Json -Depth 20
