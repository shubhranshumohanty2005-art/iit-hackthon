@echo off
REM Cosmic Watch - Windows Run Script
REM This script starts both backend and frontend servers

echo ========================================
echo    Cosmic Watch - Space Monitoring
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js found: 
node --version
echo.

REM Start In-Memory MongoDB
echo [INFO] Starting In-Memory MongoDB...
start "Cosmic Watch - Database" cmd /c "cd /d %~dp0backend && npm run db:memory"
timeout /t 5 /nobreak >nul
echo.

REM Navigate to backend directory
echo ========================================
echo    Starting Backend Server
echo ========================================
cd backend

REM Check if .env file exists
if not exist ".env" (
    echo [WARNING] .env file not found in backend directory
    echo [INFO] Creating .env from .env.example...
    if exist ".env.example" (
        copy .env.example .env
        echo [SUCCESS] Created .env file
        echo [ACTION REQUIRED] Please edit backend/.env and add your NASA API key
        echo Press any key to continue after editing .env file...
        pause
    ) else (
        echo [ERROR] .env.example not found!
        pause
        exit /b 1
    )
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing backend dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install backend dependencies
        pause
        exit /b 1
    )
    echo [SUCCESS] Backend dependencies installed
    echo.
)

REM Start backend server in new window
echo [INFO] Starting backend server on port 5000...
start "Cosmic Watch - Backend" cmd /c "cd /d %~dp0backend && npm run dev"
timeout /t 3 /nobreak >nul

REM Navigate to frontend directory
cd ..\frontend

echo.
echo ========================================
echo    Starting Frontend Server
echo ========================================

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing frontend dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install frontend dependencies
        pause
        exit /b 1
    )
    echo [SUCCESS] Frontend dependencies installed
    echo.
)

REM Start frontend server in new window
echo [INFO] Starting frontend server on port 3000...
start "Cosmic Watch - Frontend" cmd /c "cd /d %~dp0frontend && npm run dev"

REM Return to root directory
cd ..

echo.
echo ========================================
echo    Cosmic Watch is Starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo [INFO] Two terminal windows have been opened:
echo   1. Backend Server (Node.js/Express) - Port 5000
echo   2. Frontend Server (Vite/React) - Port 3000
echo.
echo [INFO] The application will open automatically in your browser
echo [INFO] To stop the servers, close both terminal windows
echo       Or run stop.bat
echo.
echo Press any key to exit this window...
pause >nul
