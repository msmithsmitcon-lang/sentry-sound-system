Write-Host "Testing Contributor Balances API..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod `
        -Uri "http://localhost:3000/api/contributors/balances" `
        -Method GET

    if ($response.success -eq $true) {
        Write-Host "PASS: Contributor balances loaded" -ForegroundColor Green
        $response.data | Format-Table
    } else {
        Write-Host "FAIL: API did not return success" -ForegroundColor Red
    }
}
catch {
    Write-Host "FAIL: API request failed" -ForegroundColor Red
    Write-Host $_
}
