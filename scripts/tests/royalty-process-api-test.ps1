Write-Host "Testing Royalty Process API..." -ForegroundColor Cyan

$body = @{
    royalty_event_id = "00000000-0000-0000-0000-000000000006"
    work_id = "00000000-0000-0000-0000-000000000003"
    gross_amount = 1000
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod `
        -Uri "http://localhost:3000/api/royalty-events/process" `
        -Method POST `
        -Body $body `
        -ContentType "application/json"

    if ($response.success -eq $true) {
        Write-Host "PASS: Royalty event processed" -ForegroundColor Green
    } else {
        Write-Host "FAIL: API did not return success" -ForegroundColor Red
    }
}
catch {
    Write-Host "FAIL: API request failed" -ForegroundColor Red
    Write-Host $_
}
