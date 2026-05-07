Write-Host "Testing Audit Validate API..." -ForegroundColor Cyan

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/audit/validate" -Method GET

if ($response.ok -eq $true) {
    Write-Host "PASS: Audit validation loaded" -ForegroundColor Green
    $response.rows | Format-Table
} else {
    Write-Host "FAIL: API error" -ForegroundColor Red
}
