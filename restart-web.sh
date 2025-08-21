#!/bin/bash

echo "🔄 Restarting Interview Drills Web Service..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Stop web service
echo "🛑 Stopping web service..."
docker-compose stop web

# Remove web container
echo "🗑️  Removing web container..."
docker-compose rm -f web

# Rebuild web service
echo "🔨 Rebuilding web service..."
docker-compose up -d --build web

# Wait for service to be ready
echo "⏳ Waiting for web service to be ready..."
sleep 15

# Check service health
echo "🏥 Checking web service health..."
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Web service is now responding!"
    echo "🌐 Frontend: http://localhost:5173"
else
    echo "❌ Web service is still not responding. Check logs:"
    echo "   docker-compose logs web"
fi
