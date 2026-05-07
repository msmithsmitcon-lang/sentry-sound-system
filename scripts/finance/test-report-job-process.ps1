$baseUrl = "http://localhost:3000"

Write-Host "Loading report jobs..." -ForegroundColor Cyan

$jobs = Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/report-jobs" `
  -Method GET

$job = $jobs.jobs[0]

Write-Host "Processing report job..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/report-jobs/$($job.id)/process" `
  -Method POST | ConvertTo-Json -Depth 20
