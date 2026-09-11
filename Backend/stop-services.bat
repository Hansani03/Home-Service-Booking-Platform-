@echo off
echo ============================================
echo  Stopping Home Service Microservices
echo ============================================
echo.

for %%P in (8081 8082 8083) do (
    for /f "tokens=5" %%A in ('netstat -ano ^| findstr ":%%P " ^| findstr LISTENING') do (
        echo Stopping process on port %%P (PID %%A)...
        taskkill /PID %%A /F >nul 2>&1
    )
)

echo.
echo Ports 8081, 8082, 8083 should now be free.
echo.
netstat -ano | findstr ":8081 :8082 :8083"
if %ERRORLEVEL% NEQ 0 (
    echo All ports are free. You can start services now.
) else (
    echo Some ports may still be in use. Close any remaining Java terminals.
)
echo.
pause
