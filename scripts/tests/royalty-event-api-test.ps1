Write-Host "Testing Royalty Event API..." -ForegroundColor Cyan

$body = @{
    work_id = "53da2a6b-beab-480b-884f-44652c992cd4"
    gross_amount = 1000
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod `
        -Uri "http://localhost:3000/api/royalty-events" `
        -Method POST `
        -Body $body `
        -ContentType "application/json"

    if ($response.success -eq $true) {
        Write-Host "PASS: Royalty event created" -ForegroundColor Green
    } else {
        Write-Host "FAIL: API did not return success" -ForegroundColor Red
    }
}
catch {
    Write-Host "FAIL: API request failed" -ForegroundColor Red
    Write-Host $_
}

