Write-Host "Sentry Sound Royalty Engine Check" -ForegroundColor Cyan

$path = "src\lib\royalties\calculateRoyaltyDistribution.ts"
$servicePath = "src\lib\royalties\processRoyaltyEvent.ts"
$errors = @()

if (!(Test-Path $path)) { $errors += "Royalty calculation file missing" }
if (!(Test-Path $servicePath)) { $errors += "Royalty processing service missing" }

$content = Get-Content $path -Raw

if ($content -notmatch "Royalty splits must equal 100%") { $errors += "100% split validation missing" }
if ($content -notmatch "platform_fee") { $errors += "Platform fee calculation missing" }
if ($content -notmatch "net_amount") { $errors += "Net amount calculation missing" }
if ($content -notmatch "distributions") { $errors += "Distribution output missing" }

if ($errors.Count -eq 0) {
  Write-Host "PASS: Royalty engine logic checks passed" -ForegroundColor Green
  exit 0
}

Write-Host "FAIL: Royalty engine checks failed" -ForegroundColor Red
$errors | ForEach-Object { Write-Host "- $_" -ForegroundColor Red }
exit 1
