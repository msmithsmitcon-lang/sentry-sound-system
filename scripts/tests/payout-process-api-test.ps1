Write-Host "Testing Payout Process API..." -ForegroundColor Cyan

$body = @{
    payout_batch_id = "a7273ac9-d3e1-43ed-a958-7e0e0fec9283"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod `
        -Uri "http://localhost:3000/api/payouts/process" `
        -Method POST `
        -Body $body `
        -ContentType "application/json"

    if ($response.success -eq $true) {
        Write-Host "PASS: Payout batch processed" -ForegroundColor Green
    } else {
        Write-Host "FAIL: API did not return success" -ForegroundColor Red
    }
}
catch {
    Write-Host "FAIL: API request failed" -ForegroundColor Red
    Write-Host $_
}
