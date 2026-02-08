@echo off
REM Install all dependencies for Cosmic Watch

echo ========================================
echo    Installing Cosmic Watch Dependencies
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

echo [INFO] Node.js version:
node --version
echo.
echo [INFO] npm version:
npm --version
echo.

REM Install backend dependencies
echo ========================================
echo    Installing Backend Dependencies
echo ========================================
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
echo [SUCCESS] Backend dependencies installed
echo.

REM Install frontend dependencies
cd ..\frontend
echo ========================================
echo    Installing Frontend Dependencies
echo ========================================
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
echo [SUCCESS] Frontend dependencies installed
echo.

REM Return to root
cd ..

echo ========================================
echo    Installation Complete!
echo ========================================
echo.
echo All dependencies have been installed successfully.
echo.
echo Next steps:
echo 1. Get your NASA API key from https://api.nasa.gov
echo 2. Edit backend/.env and add your API key
echo 3. Run 'run.bat' to start the application
echo.
echo Press any key to exit...
pause >nul
