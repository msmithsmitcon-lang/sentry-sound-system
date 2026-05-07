$baseUrl = "http://localhost:3000"

Write-Host "Creating finance report job..." -ForegroundColor Cyan

$body = @{
  report_type = "income_statement"

  export_format = "pdf"

  requested_by = "finance_admin"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/report-jobs" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading finance report jobs..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/report-jobs" `
  -Method GET | ConvertTo-Json -Depth 20
