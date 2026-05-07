$baseUrl = "http://localhost:3000"

Write-Host "Creating finance export..." -ForegroundColor Cyan

$body = @{
  report_type = "balance_sheet"

  export_format = "pdf"

  file_name = "balance-sheet-2026.pdf"

  storage_path = "/finance/reports/balance-sheet-2026.pdf"

  generated_by = "finance_admin"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/report-exports" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading report exports..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/report-exports" `
  -Method GET | ConvertTo-Json -Depth 20
