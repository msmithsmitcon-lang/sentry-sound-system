Write-Host "Testing Audit Rebuild API..." -ForegroundColor Cyan

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/audit/rebuild" -Method GET

if ($response.ok -eq $true) {
    Write-Host "PASS: Audit rebuild loaded" -ForegroundColor Green
    $response.rows | Format-Table
} else {
    Write-Host "FAIL: API error" -ForegroundColor Red
}
