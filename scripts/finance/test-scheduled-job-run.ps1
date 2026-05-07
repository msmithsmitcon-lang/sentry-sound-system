$baseUrl = "http://localhost:3000"

Write-Host "Loading scheduled jobs..." -ForegroundColor Cyan

$jobs = Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/scheduled-jobs" `
  -Method GET

$job = $jobs.jobs[0]

Write-Host "Running scheduled job..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/scheduled-jobs/$($job.id)/run" `
  -Method POST | ConvertTo-Json -Depth 20
