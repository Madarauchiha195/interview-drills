#!/bin/bash

# Interview Drills Startup Script
echo "🚀 Starting Interview Drills Application..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from template..."
    if [ -f env.example ]; then
        cp env.example .env
        echo "✅ Created .env from template. Please edit it with your actual values."
        echo "   Required: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET"
        echo "   Press Enter to continue after editing..."
        read
    else
        echo "❌ No env.example found. Please create a .env file manually."
        exit 1
    fi
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Environment variables loaded"
fi

# Check required environment variables
if [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ] || [ -z "$JWT_SECRET" ]; then
    echo "❌ Missing required environment variables:"
    echo "   - GOOGLE_CLIENT_ID"
    echo "   - GOOGLE_CLIENT_SECRET" 
    echo "   - JWT_SECRET"
    echo "Please update your .env file and try again."
    exit 1
fi

echo "✅ Environment validation passed"

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🏥 Checking service health..."
if docker-compose ps | grep -q "unhealthy"; then
    echo "❌ Some services are unhealthy. Check logs with: docker-compose logs"
    exit 1
fi

echo "✅ All services are healthy!"

# Display service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:4000"
echo "   Health:   http://localhost:4000/api/health"
echo ""
echo "📝 Useful Commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop:      docker-compose down"
echo "   Restart:   docker-compose restart"
echo ""
echo "🎉 Interview Drills is ready!"
