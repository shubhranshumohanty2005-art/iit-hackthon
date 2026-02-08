# Stop all Cosmic Watch servers - PowerShell version

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Stopping Cosmic Watch Servers" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kill Node.js processes
Write-Host "[INFO] Stopping all Node.js processes..." -ForegroundColor Yellow

try {
    Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "[SUCCESS] All servers stopped" -ForegroundColor Green
} catch {
    Write-Host "[INFO] No running servers found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press Enter to exit..." -ForegroundColor Cyan
Read-Host
