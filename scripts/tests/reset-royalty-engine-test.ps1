Write-Host "Reset Royalty Engine Test Data" -ForegroundColor Cyan
Write-Host ""
Write-Host "Open Supabase SQL Editor and run:" -ForegroundColor Yellow
Write-Host "docs\database\seed\RESET-ROYALTY-ENGINE-TEST.sql" -ForegroundColor Green
Write-Host ""
Write-Host "Then run:" -ForegroundColor Yellow
Write-Host "powershell -ExecutionPolicy Bypass -File scripts\tests\royalty-process-api-test.ps1" -ForegroundColor Green
