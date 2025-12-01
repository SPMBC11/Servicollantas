@echo off
echo Iniciando ServiCollantas en modo desarrollo...
echo.

echo [1/3] Instalando dependencias del backend...
cd src\server
call npm install
if %errorlevel% neq 0 (
    echo Error instalando dependencias del backend
    pause
    exit /b 1
)

echo.
echo [2/3] Instalando dependencias del frontend...
cd ..\..
call npm install
if %errorlevel% neq 0 (
    echo Error instalando dependencias del frontend
    pause
    exit /b 1
)

echo.
echo [3/3] Iniciando servidores...
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
echo.

start "Backend" cmd /k "cd src\server && npm run dev"
timeout /t 3 /nobreak >nul
start "Frontend" cmd /k "npm run dev"

echo.
echo Servidores iniciados correctamente!
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
