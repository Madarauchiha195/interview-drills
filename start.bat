@echo off
chcp 65001 >nul
echo 🚀 Starting Interview Drills Application...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo ⚠️  No .env file found. Creating from template...
    if exist env.example (
        copy env.example .env >nul
        echo ✅ Created .env from template. Please edit it with your actual values.
        echo    Required: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET
        echo    Press Enter to continue after editing...
        pause
    ) else (
        echo ❌ No env.example found. Please create a .env file manually.
        pause
        exit /b 1
    )
)

echo ✅ Environment file found

REM Stop any existing containers
echo 🛑 Stopping existing containers...
docker-compose down

REM Build and start services
echo 🔨 Building and starting services...
docker-compose up -d --build

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check service health
echo 🏥 Checking service health...
docker-compose ps | findstr "unhealthy" >nul
if %errorlevel% equ 0 (
    echo ❌ Some services are unhealthy. Check logs with: docker-compose logs
    pause
    exit /b 1
)

echo ✅ All services are healthy!

REM Display service status
echo.
echo 📊 Service Status:
docker-compose ps

echo.
echo 🌐 Application URLs:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:4000
echo    Health:   http://localhost:4000/api/health
echo.
echo 📝 Useful Commands:
echo    View logs: docker-compose logs -f
echo    Stop:      docker-compose down
echo    Restart:   docker-compose restart
echo.
echo 🎉 Interview Drills is ready!
pause
