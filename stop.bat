@echo off
REM Stop all Cosmic Watch servers

echo ========================================
echo    Stopping Cosmic Watch Servers
echo ========================================
echo.

REM Kill Node.js processes (this will stop both backend and frontend)
echo [INFO] Stopping all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] All servers stopped
) else (
    echo [INFO] No running servers found
)

echo.
echo Press any key to exit...
pause >nul
