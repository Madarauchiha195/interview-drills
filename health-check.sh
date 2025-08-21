#!/bin/bash

# Interview Drills Health Check Script
echo "🏥 Interview Drills Health Check"
echo "================================"

# Check Docker status
echo "🐳 Checking Docker status..."
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running"
    exit 1
fi
echo "✅ Docker is running"

# Check if containers are running
echo ""
echo "📦 Checking container status..."
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ No containers are running. Start with: docker-compose up -d"
    exit 1
fi

# Check each service
echo ""
echo "🔍 Checking individual services..."

# MongoDB
echo "📊 MongoDB:"
if docker-compose exec -T mongo mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "   ✅ Running and responding"
else
    echo "   ❌ Not responding"
fi

# API
echo "🔌 API:"
if curl -s http://localhost:4000/api/health > /dev/null; then
    echo "   ✅ Health check passed"
    HEALTH_RESPONSE=$(curl -s http://localhost:4000/api/health)
    echo "   📊 Response: $HEALTH_RESPONSE"
else
    echo "   ❌ Health check failed"
fi

# Web
echo "🌐 Web Frontend:"
if curl -s http://localhost:5173 > /dev/null; then
    echo "   ✅ Responding"
else
    echo "   ❌ Not responding"
    echo "   💡 Try restarting web service: ./restart-web.sh"
fi

# Check environment variables
echo ""
echo "🔧 Checking environment variables..."
if [ -f .env ]; then
    echo "✅ .env file exists"
    
    # Check required variables
    source .env
    
    if [ -z "$GOOGLE_CLIENT_ID" ]; then
        echo "⚠️  GOOGLE_CLIENT_ID not set"
    else
        echo "✅ GOOGLE_CLIENT_ID is set"
    fi
    
    if [ -z "$GOOGLE_CLIENT_SECRET" ]; then
        echo "⚠️  GOOGLE_CLIENT_SECRET not set"
    else
        echo "✅ GOOGLE_CLIENT_SECRET is set"
    fi
    
    if [ -z "$JWT_SECRET" ]; then
        echo "⚠️  JWT_SECRET not set"
    else
        echo "✅ JWT_SECRET is set"
    fi
else
    echo "❌ .env file not found"
fi

# Check network connectivity
echo ""
echo "🌐 Checking network connectivity..."
if ping -c 1 google.com > /dev/null 2>&1; then
    echo "✅ Internet connectivity: OK"
else
    echo "❌ Internet connectivity: Failed"
fi

# Check ports
echo ""
echo "🔌 Checking port availability..."
if netstat -an | grep ":4000" | grep "LISTEN" > /dev/null 2>&1; then
    echo "✅ Port 4000 (API): Available"
else
    echo "❌ Port 4000 (API): Not available"
fi

if netstat -an | grep ":5173" | grep "LISTEN" > /dev/null 2>&1; then
    echo "✅ Port 5173 (Web): Available"
else
    echo "❌ Port 5173 (Web): Not available"
    echo "   💡 Web service may have failed to start"
fi

if netstat -an | grep ":27017" | grep "LISTEN" > /dev/null 2>&1; then
    echo "✅ Port 27017 (MongoDB): Available"
else
    echo "❌ Port 27017 (MongoDB): Not available"
fi

# Display container logs summary
echo ""
echo "📋 Recent container logs (last 5 lines each):"
echo "--------------------------------------------"

echo "🔌 API logs:"
docker-compose logs --tail=5 api

echo ""
echo "🌐 Web logs:"
docker-compose logs --tail=5 web

echo ""
echo "📊 MongoDB logs:"
docker-compose logs --tail=5 mongo

echo ""
echo "🎯 Health Check Complete!"
echo "If you see any ❌ marks above, check the troubleshooting section in README.md"
echo ""
echo "💡 Quick fixes:"
echo "   - Restart web service: ./restart-web.sh"
echo "   - Restart all services: docker-compose restart"
echo "   - Rebuild and restart: docker-compose up -d --build"
