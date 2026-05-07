$baseUrl = "http://localhost:3000"

Write-Host "Loading workspaces..." -ForegroundColor Cyan

$workspaceResponse = Invoke-RestMethod `
  -Uri "$baseUrl/api/workspaces" `
  -Method GET

$workspace =
  $workspaceResponse.workspaces[0]

Write-Host "Creating project..." -ForegroundColor Cyan

$body = @{
  workspace_id = $workspace.id

  title = "Midnight Drive Album"

  description = "Main production album project"

  project_type = "album"

  status = "active"

  created_by = "admin@sentrysound.co.za"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/projects" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading projects..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/projects?workspace_id=$($workspace.id)" `
  -Method GET | ConvertTo-Json -Depth 20
