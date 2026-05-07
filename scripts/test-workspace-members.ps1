$baseUrl = "http://localhost:3000"

Write-Host "Loading workspaces..." -ForegroundColor Cyan

$workspaceResponse = Invoke-RestMethod `
  -Uri "$baseUrl/api/workspaces" `
  -Method GET

$workspace =
  $workspaceResponse.workspaces[0]

Write-Host "Creating workspace member..." -ForegroundColor Cyan

$body = @{
  workspace_id = $workspace.id

  user_email = "admin@sentrysound.co.za"

  display_name = "Finance Admin"

  role = "admin"

  performed_by = "system"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/workspace-members" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading workspace members..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/workspace-members?workspace_id=$($workspace.id)" `
  -Method GET | ConvertTo-Json -Depth 20
