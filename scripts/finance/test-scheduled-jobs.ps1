$baseUrl = "http://localhost:3000"

Write-Host "Creating scheduled finance job..." -ForegroundColor Cyan

$body = @{
  job_name = "daily_fx_sync"

  job_type = "exchange_rate_sync"

  schedule_expression = "0 0 * * *"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/scheduled-jobs" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading scheduled jobs..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/scheduled-jobs" `
  -Method GET | ConvertTo-Json -Depth 20
