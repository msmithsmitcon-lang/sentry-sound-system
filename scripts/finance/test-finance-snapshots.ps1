$baseUrl = "http://localhost:3000"

Write-Host "Creating finance snapshot..." -ForegroundColor Cyan

$body = @{
  snapshot_type = "manual"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/snapshots" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading finance snapshots..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/snapshots" `
  -Method GET | ConvertTo-Json -Depth 20
