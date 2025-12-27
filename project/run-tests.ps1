# Kill existing processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Start backend
Write-Host "Starting backend..."
Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c cd backend && npm start" -WorkingDirectory (Get-Location)
Start-Sleep -Seconds 5

# Start frontend
Write-Host "Starting frontend..."
Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c cd frontend && npm run dev" -WorkingDirectory (Get-Location)
Start-Sleep -Seconds 5

# Run tests
Write-Host "Running E2E tests..."
cd frontend
npx cypress run --spec "cypress/e2e/admin.cy.js" --headless
