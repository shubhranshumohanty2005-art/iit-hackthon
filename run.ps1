# Cosmic Watch - PowerShell Run Script
# This script starts both backend and frontend servers

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Cosmic Watch - Space Monitoring" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "[INFO] Node.js found: $nodeVersion" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Start In-Memory MongoDB
Write-Host "[INFO] Starting In-Memory MongoDB..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run db:memory"
Start-Sleep -Seconds 5
Write-Host ""

# Navigate to backend directory
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting Backend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Set-Location backend

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "[WARNING] .env file not found in backend directory" -ForegroundColor Yellow
    Write-Host "[INFO] Creating .env from .env.example..." -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "[SUCCESS] Created .env file" -ForegroundColor Green
        Write-Host "[ACTION REQUIRED] Please edit backend/.env and add your NASA API key" -ForegroundColor Yellow
        Read-Host "Press Enter to continue after editing .env file"
    }
    else {
        Write-Host "[ERROR] .env.example not found!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing backend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install backend dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "[SUCCESS] Backend dependencies installed" -ForegroundColor Green
    Write-Host ""
}

# Start backend server in new window
Write-Host "[INFO] Starting backend server on port 5001..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"
Start-Sleep -Seconds 3

# Navigate to frontend directory
Set-Location ..\frontend

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting Frontend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install frontend dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "[SUCCESS] Frontend dependencies installed" -ForegroundColor Green
    Write-Host ""
}

# Start frontend server in new window
Write-Host "[INFO] Starting frontend server on port 3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

# Return to root directory
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Cosmic Watch is Starting!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:5001" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "[INFO] Two PowerShell windows have been opened:" -ForegroundColor Yellow
Write-Host "  1. Backend Server (Node.js/Express)" -ForegroundColor White
Write-Host "  2. Frontend Server (Vite/React)" -ForegroundColor White
Write-Host ""
Write-Host "[INFO] The application will open automatically in your browser" -ForegroundColor Yellow
Write-Host "[INFO] To stop the servers, close both PowerShell windows" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Enter to exit this window..." -ForegroundColor Cyan
Read-Host
