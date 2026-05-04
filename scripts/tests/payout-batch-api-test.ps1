Write-Host "Testing Payout Batch API..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod `
        -Uri "http://localhost:3000/api/payouts/batches" `
        -Method POST

    if ($response.success -eq $true) {
        Write-Host "PASS: Payout batch created" -ForegroundColor Green
        Write-Host "Batch ID:" $response.batch.id
        Write-Host "Items Created:" $response.items_created
    } else {
        Write-Host "FAIL: API did not return success" -ForegroundColor Red
    }
}
catch {
    Write-Host "FAIL: API request failed" -ForegroundColor Red
    Write-Host $_
}
