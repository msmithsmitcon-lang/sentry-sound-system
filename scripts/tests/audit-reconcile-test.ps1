Write-Host "Testing Audit Reconcile API..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod `
        -Uri "http://localhost:3000/api/audit/reconcile" `
        -Method POST `
        -ContentType "application/json"

    if ($response.ok -eq $true) {
        Write-Host "PASS: Reconciliation check complete" -ForegroundColor Green
        $response.rows | Format-Table
    } else {
        Write-Host "FAIL: API returned ok=false" -ForegroundColor Red
        $response | ConvertTo-Json -Depth 5
    }
}
catch {
    Write-Host "FAIL: API request failed" -ForegroundColor Red

    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        Write-Host $body -ForegroundColor Yellow
    } else {
        Write-Host $_
    }
}
