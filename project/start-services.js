#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const projectRoot = __dirname;
const backendPath = path.join(projectRoot, 'backend');
const frontendPath = path.join(projectRoot, 'frontend');

console.log('🚀 Starting services...\n');

// Start backend
const backend = spawn('npm', ['start'], {
  cwd: backendPath,
  stdio: 'inherit',
  shell: true
});

// Start frontend after a delay
setTimeout(() => {
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: frontendPath,
    stdio: 'inherit',
    shell: true
  });

  // Keep processes alive
  process.on('SIGINT', () => {
    backend.kill();
    frontend.kill();
    process.exit(0);
  });
}, 3000);
