@echo off
chcp 65001 >nul
echo 🔄 Restarting Interview Drills Web Service...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

REM Stop web service
echo 🛑 Stopping web service...
docker-compose stop web

REM Remove web container
echo 🗑️  Removing web container...
docker-compose rm -f web

REM Rebuild web service
echo 🔨 Rebuilding web service...
docker-compose up -d --build web

REM Wait for service to be ready
echo ⏳ Waiting for web service to be ready...
timeout /t 15 /nobreak >nul

REM Check service health
echo 🏥 Checking web service health...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Web service is now responding!
    echo 🌐 Frontend: http://localhost:5173
) else (
    echo ❌ Web service is still not responding. Check logs:
    echo    docker-compose logs web
)

pause
