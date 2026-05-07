$baseUrl = "http://localhost:3000"

Write-Host "Loading finance notifications..." -ForegroundColor Cyan

$notifications = Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/notifications" `
  -Method GET

$notification = $notifications.notifications[0]

Write-Host "Marking notification as read..." -ForegroundColor Cyan

Invoke-RestMethod `
  -Uri "$baseUrl/api/finance/notifications/$($notification.id)/read" `
  -Method POST | ConvertTo-Json -Depth 20
