$baseUrl = "http://localhost:3000"

Write-Host "Loading approvals..." -ForegroundColor Cyan

$approvals = Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/approvals" `
  -Method GET

$approval = $approvals.approvals[0]

Write-Host "Approving finance approval..." -ForegroundColor Cyan

$body = @{
  status = "approved"
  performed_by = "finance_admin"
  approval_notes = "Approved by finance"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/approvals/$($approval.id)/decision" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20
