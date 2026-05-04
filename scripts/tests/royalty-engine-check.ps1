Write-Host "Sentry Sound Royalty Engine Check" -ForegroundColor Cyan

$path = "src\lib\royalties\calculateRoyaltyDistribution.ts"
$servicePath = "src\lib\royalties\processRoyaltyEvent.ts"
$ledgerPath = "src\lib\royalties\processRoyaltyEventToLedger.ts"
$ledgerValidatorPath = "src\lib\royalties\validateLedgerEntries.ts"
$errors = @()

if (!(Test-Path $path)) { $errors += "Royalty calculation file missing" }
if (!(Test-Path $servicePath)) { $errors += "Royalty processing service missing" }
if (!(Test-Path $ledgerPath)) { $errors += "Royalty ledger processing service missing" }
if (!(Test-Path $ledgerValidatorPath)) { $errors += "Ledger integrity validator missing" }

$content = Get-Content $path -Raw
$ledgerContent = Get-Content $ledgerPath -Raw

if ($content -notmatch "Royalty splits must equal 100%") { $errors += "100% split validation missing" }
if ($content -notmatch "platform_fee") { $errors += "Platform fee calculation missing" }
if ($content -notmatch "net_amount") { $errors += "Net amount calculation missing" }
if ($content -notmatch "distributions") { $errors += "Distribution output missing" }
if ($ledgerContent -notmatch "Royalty event already processed") { $errors += "Idempotency duplicate protection missing" }
if ($ledgerContent -notmatch "validateLedgerEntries") { $errors += "Ledger balance validation not enforced" }
if ($ledgerContent -notmatch '"debit" as const') { $errors += "Debit ledger entry missing" }
if ($ledgerContent -notmatch '"credit" as const') { $errors += "Credit ledger entries missing" }

if ($errors.Count -eq 0) {
  Write-Host "PASS: Royalty engine logic checks passed" -ForegroundColor Green
  exit 0
}

Write-Host "FAIL: Royalty engine checks failed" -ForegroundColor Red
$errors | ForEach-Object { Write-Host "- $_" -ForegroundColor Red }
exit 1
