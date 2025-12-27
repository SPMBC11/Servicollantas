@echo off
cd /d "c:\Users\santi\Desktop\Trabajos\ServiCollantas\project-bolt-sb1-gddud527\project"

REM Kill any existing node processes
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak

REM Start backend in new window
echo Starting backend...
start "Backend" cmd /k "cd backend && npm start"
timeout /t 5 /nobreak

REM Start frontend in new window
echo Starting frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 5 /nobreak

REM Check servers
echo.
echo Checking servers...
netstat -ano | findstr :4000 && echo Backend is running || echo Backend NOT responding
netstat -ano | findstr :5173 && echo Frontend is running || echo Frontend NOT responding

REM Run tests
echo.
echo Running E2E tests...
cd frontend
npx cypress run --spec "cypress/e2e/admin.cy.js"

pause
