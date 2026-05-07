$baseUrl = "http://localhost:3000"

Write-Host "Creating finance notification..." -ForegroundColor Cyan

$body = @{
  notification_type = "approval"

  severity = "info"

  title = "Finance Approval Required"

  message = "A finance transaction requires approval."

  entity_type = "finance_approval"

  entity_id = "APPROVAL-001"

  recipient = "finance_admin"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/notifications" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading finance notifications..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/notifications" `
  -Method GET | ConvertTo-Json -Depth 20
