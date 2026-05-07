$baseUrl = "http://localhost:3000"

Write-Host "Creating finance attachment..." -ForegroundColor Cyan

$body = @{
  entity_type = "finance_transaction"

  entity_id = "TXN-001"

  file_name = "invoice.pdf"

  file_type = "application/pdf"

  storage_path = "/finance/invoices/invoice.pdf"

  uploaded_by = "finance_admin"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/attachments" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading finance attachments..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/attachments" `
  -Method GET | ConvertTo-Json -Depth 20
