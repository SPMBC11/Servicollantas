#!/bin/bash

echo "Iniciando ServiCollantas en modo desarrollo..."
echo

echo "[1/3] Instalando dependencias del backend..."
cd src/server
npm install
if [ $? -ne 0 ]; then
    echo "Error instalando dependencias del backend"
    exit 1
fi

echo
echo "[2/3] Instalando dependencias del frontend..."
cd ../..
npm install
if [ $? -ne 0 ]; then
    echo "Error instalando dependencias del frontend"
    exit 1
fi

echo
echo "[3/3] Iniciando servidores..."
echo "Backend: http://localhost:4000"
echo "Frontend: http://localhost:5173"
echo

# Iniciar backend en background
cd src/server
npm run dev &
BACKEND_PID=$!

# Esperar un poco para que el backend inicie
sleep 3

# Iniciar frontend en background
cd ../..
npm run dev &
FRONTEND_PID=$!

echo
echo "Servidores iniciados correctamente!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo
echo "Presiona Ctrl+C para detener ambos servidores"

# Función para limpiar procesos al salir
cleanup() {
    echo
    echo "Deteniendo servidores..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Servidores detenidos"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Esperar indefinidamente
wait
