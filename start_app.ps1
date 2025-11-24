$serverPath = Resolve-Path ".\server"
$clientPath = Resolve-Path ".\client"

Write-Host "Starting Backend Server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$serverPath'; npm run dev"

Write-Host "Starting Frontend Client..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$clientPath'; npm run dev"

Start-Sleep -Seconds 5
Start-Process "http://localhost:5173"
