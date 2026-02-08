@echo off
REM Kill process on port 5001 (backend)

echo Checking for process on port 5001...

FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :5001') DO (
    echo Found process %%P on port 5001
    taskkill /F /PID %%P
    echo Process killed successfully
)

echo.
echo Port 5001 is now free
pause
