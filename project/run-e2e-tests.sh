#!/bin/bash

echo "Kill existing node processes..."
pkill node 2>/dev/null || true
sleep 2

echo "Starting backend..."
cd backend
npm start > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
sleep 5

echo "Starting frontend..."
cd ../frontend
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 5

echo "Checking if servers are running..."
curl -s http://localhost:4000 > /dev/null && echo "✓ Backend is running" || echo "✗ Backend failed"
curl -s http://localhost:5173 > /dev/null && echo "✓ Frontend is running" || echo "✗ Frontend failed"

echo ""
echo "Running E2E tests..."
npx cypress run --spec "cypress/e2e/admin.cy.js"

echo ""
echo "Cleaning up..."
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
