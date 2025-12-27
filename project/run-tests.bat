@echo off
REM Script para ejecutar tests E2E

echo ===== ServiCollantas E2E Tests =====
echo.
echo Iniciando servidores...

REM Terminal 1: Backend
start "ServiCollantas Backend" cmd /k "cd backend && npm start"

REM Esperar a que inicie
timeout /t 3 /nobreak

REM Terminal 2: Frontend
start "ServiCollantas Frontend" cmd /k "cd frontend && npm run dev"

REM Esperar a que inicie
timeout /t 5 /nobreak

REM Terminal 3: Tests
start "ServiCollantas E2E Tests" cmd /k "cd frontend && npm run e2e:run"

echo.
echo ✓ Servidores iniciados
echo ✓ Tests ejecutándose...
echo.
pause
