Write-Host "Sentry Sound Contributor System Check" -ForegroundColor Cyan

$pagePath = "src\app\create-song\page.tsx"
$routePath = "src\app\api\contributors\search\route.ts"
$errors = @()

$page = Get-Content $pagePath -Raw
$route = Get-Content $routePath -Raw

if ($route -notmatch "from\('contributors'\)") { $errors += "Search route does not query contributors table" }
if ($route -notmatch "ilike\('full_name'") { $errors += "Search route does not search contributor full_name" }
if ($page -notmatch "searchResults") { $errors += "Contributor search results state missing" }
if ($page -notmatch "Duplicate contributor selected") { $errors += "Duplicate contributor prevention missing" }
if ($page -notmatch "totalSplit") { $errors += "Split total calculation missing" }
if ($page -notmatch "isSplitValid") { $errors += "Split validation flag missing" }
if ($page -notmatch "Split must equal exactly 100%") { $errors += "Split UI warning missing" }
if ($page -notmatch "Contributor already added") { $errors += "Duplicate contributor UI prevention missing" }
if ($page -notmatch "maybeSingle") { $errors += "Contributor duplicate lookup before insert missing" }
if ($page -notmatch "existingContributor") { $errors += "Existing contributor reuse before insert missing" }
if ($page -notmatch "Split Type") { $errors += "Contributor grid header missing" }
if ($page -notmatch "grid-cols-\[1\.5fr_1fr_1fr_120px_90px\]") { $errors += "Contributor grid layout missing" }
if ($page -notmatch "bg-white border border-slate-200 rounded-xl p-3") { $errors += "Contributor row card styling missing" }

if ($errors.Count -eq 0) {
  Write-Host "PASS: Contributor reuse + split validation checks passed" -ForegroundColor Green
  exit 0
}

Write-Host "FAIL: Contributor system checks failed" -ForegroundColor Red
$errors | ForEach-Object { Write-Host "- $_" -ForegroundColor Red }
exit 1

if ($page -notmatch "Contributor already added") {
  $errors += "Duplicate contributor UI prevention missing"
}
