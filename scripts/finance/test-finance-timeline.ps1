$baseUrl = "http://localhost:3000"

Write-Host "Loading finance timeline..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/timeline?entity_type=finance_transaction&entity_id=TXN-001" `
  -Method GET | ConvertTo-Json -Depth 20
