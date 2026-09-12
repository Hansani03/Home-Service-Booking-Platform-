@echo off
echo ============================================
echo  Home Service Booking Platform - Start
echo ============================================
echo.

set BASE=%~dp0

REM Check if MySQL is running
set MYSQL_EXE=
if exist "D:\XAMPP\mysql\bin\mysql.exe" set MYSQL_EXE=D:\XAMPP\mysql\bin\mysql.exe
if exist "C:\xampp\mysql\bin\mysql.exe" set MYSQL_EXE=C:\xampp\mysql\bin\mysql.exe

if not "%MYSQL_EXE%"=="" (
    "%MYSQL_EXE%" -u root -e "SELECT 1;" >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo [WARNING] MySQL is NOT running!
        echo Please start MySQL in XAMPP Control Panel first.
        echo.
        pause
        exit /b 1
    )
    echo MySQL is running. OK
) else (
    echo [WARNING] Could not find MySQL. Make sure XAMPP MySQL is started.
)

echo.
echo Starting services in order...
echo.

echo [1/3] Provider service (port 8082)...
start "Provider Service - 8082" cmd /k "cd /d "%BASE%provider-service" && mvnw.cmd spring-boot:run"

timeout /t 20 /nobreak >nul

echo [2/3] Notification service (port 8083)...
start "Notification Service - 8083" cmd /k "cd /d "%BASE%notification-service" && mvnw.cmd spring-boot:run"

timeout /t 20 /nobreak >nul

echo [3/3] Booking service (port 8081)...
start "Booking Service - 8081" cmd /k "cd /d "%BASE%booking-service" && mvnw.cmd spring-boot:run"

echo.
echo All 3 services are starting.
echo Wait for "Tomcat started on port..." in each window before testing.
echo.
pause
