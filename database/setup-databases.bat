@echo off
echo ============================================
echo  Home Service Booking Platform - DB Setup
echo ============================================
echo.
echo Make sure XAMPP MySQL is running.
echo.
echo Option 1: Import SQL files in phpMyAdmin
echo   - Open http://localhost/phpmyadmin
echo   - Import each file from the database folder:
echo       homeservice_provider_db.sql
echo       homeservice_booking_db.sql
echo       homeservice_notification_db.sql
echo.
echo Option 2: Run this script automatically
echo.

set DB_DIR=%~dp0

set MYSQL_EXE=
if exist "D:\XAMPP\mysql\bin\mysql.exe" set MYSQL_EXE=D:\XAMPP\mysql\bin\mysql.exe
if exist "C:\xampp\mysql\bin\mysql.exe" set MYSQL_EXE=C:\xampp\mysql\bin\mysql.exe
if exist "C:\wamp64\bin\mariadb\mariadb10.4.32\bin\mysql.exe" set MYSQL_EXE=C:\wamp64\bin\mariadb\mariadb10.4.32\bin\mysql.exe

if "%MYSQL_EXE%"=="" (
    where mysql >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo mysql.exe not found. Import SQL files manually via phpMyAdmin.
        pause
        exit /b 1
    )
    set MYSQL_EXE=mysql
)

echo Creating databases using %MYSQL_EXE% ...
"%MYSQL_EXE%" -u root < "%DB_DIR%homeservice_provider_db.sql"
"%MYSQL_EXE%" -u root < "%DB_DIR%homeservice_booking_db.sql"
"%MYSQL_EXE%" -u root < "%DB_DIR%homeservice_notification_db.sql"

echo.
echo Done! Databases created:
echo   - homeservice_provider_db      (Provider service - port 8082)
echo   - homeservice_booking_db       (Booking service  - port 8081)
echo   - homeservice_notification_db  (Notification service - port 8083)
echo.
pause
