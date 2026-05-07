$baseUrl = "http://localhost:3000"

Write-Host "Loading workspaces..." -ForegroundColor Cyan
$workspaceResponse = Invoke-RestMethod -Uri "$baseUrl/api/workspaces" -Method GET
$workspace = $workspaceResponse.workspaces[0]

Write-Host "Loading projects..." -ForegroundColor Cyan
$projectResponse = Invoke-RestMethod -Uri "$baseUrl/api/projects?workspace_id=$($workspace.id)" -Method GET
$project = $projectResponse.projects[0]

Write-Host "Creating project task..." -ForegroundColor Cyan

$body = @{
  workspace_id = $workspace.id
  project_id = $project.id
  title = "Review master file"
  description = "Listen through final master before release approval"
  task_type = "mastering"
  status = "todo"
  priority = "high"
  assigned_to = "admin@sentrysound.co.za"
  created_by = "admin@sentrysound.co.za"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "$baseUrl/api/project-tasks" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 20

Write-Host "`nLoading project tasks..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/project-tasks?project_id=$($project.id)" `
  -Method GET | ConvertTo-Json -Depth 20
