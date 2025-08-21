# 🚀 Interview Drills - Complete Setup Guide

This guide will help you set up the Interview Drills application with full functionality including drill completion, score tracking, performance analytics, and database monitoring.

## 📋 What's New & Fixed

✅ **Drill Completion & Scoring**
- Real-time score calculation
- Answer submission to database
- Performance tracking
- Time tracking

✅ **Performance Analytics**
- Comprehensive statistics
- Performance charts
- Drill-wise analysis
- Progress tracking

✅ **Database Integration**
- Real API endpoints
- Proper data models
- User authentication
- Attempt history

✅ **Database Monitoring**
- View all users, drills, attempts
- Real-time statistics
- Search functionality
- Health checks

## 🏗️ Architecture Overview

```
Frontend (React + TypeScript) ←→ Backend API (Node.js + Express) ←→ MongoDB
     ↓                              ↓                              ↓
- Drill Interface              - Authentication              - User Data
- Score Display               - Score Calculation           - Drill Data
- Performance Charts          - Statistics API              - Attempt Data
- History View                - Data Validation             - Analytics
```

## 🚀 Quick Start

### 1. **Environment Setup**

```bash
# Copy environment template
cp env.example .env

# Edit .env with your credentials
nano .env
```

**Required Environment Variables:**
```bash
# Google OAuth (Required)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# JWT Secret (Required)
JWT_SECRET=your-super-secret-jwt-key

# Database (Optional - has defaults)
MONGO_URI=mongodb://mongo:27017/upivot
MONGO_DB_NAME=upivot
```

### 2. **Start the Application**

```bash
# Linux/Mac
chmod +x start.sh && ./start.sh

# Windows
start.bat

# Or manually
docker-compose up -d --build
```

### 3. **Seed the Database**

```bash
# Run the seeding script
docker-compose exec api npm run seed
```

This will create:
- 3 sample drills (JavaScript, React, TypeScript)
- 1 test user
- Sample attempt data

## 🔐 Google OAuth Setup

### Step 1: Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API

### Step 2: Create OAuth Credentials
1. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
2. Application type: "Web application"
3. Add authorized redirect URIs:
   - `http://localhost:4000/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)

### Step 3: Update Environment
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

## 📊 Testing the Application

### 1. **Access the Application**
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:4000
- **Health Check**: http://localhost:4000/api/health

### 2. **Login Flow**
1. Click "Login with Google"
2. Complete Google OAuth
3. You'll be redirected to `/dashboard`
4. Set your username if prompted

### 3. **Take a Drill**
1. Go to Dashboard
2. Select a drill (e.g., "JavaScript Fundamentals")
3. Answer all questions
4. Submit and see your score
5. View detailed feedback

### 4. **Check Performance**
1. Go to `/history` page
2. View your statistics
3. Check performance charts
4. Review attempt history

## 🗄️ Database Monitoring

### Interactive Monitor
```bash
# Run the database monitor
node database-monitor.js
```

**Available Commands:**
- View all users
- View all drills
- View all attempts
- User statistics
- Drill statistics
- Search by email
- Recent activity
- Database health check

### Direct MongoDB Access
```bash
# Connect to MongoDB container
docker-compose exec mongo mongosh

# Switch to database
use upivot

# View collections
show collections

# View users
db.users.find().pretty()

# View drills
db.drills.find().pretty()

# View attempts
db.attempts.find().pretty()
```

## 🔧 Troubleshooting

### Common Issues

#### 1. **Authentication Not Working**
```bash
# Check Google OAuth credentials
echo $GOOGLE_CLIENT_ID
echo $GOOGLE_CLIENT_SECRET

# Check backend logs
docker-compose logs api

# Verify callback URL in Google Console
```

#### 2. **Drill Not Loading**
```bash
# Check if drills exist in database
docker-compose exec mongo mongosh --eval "use upivot; db.drills.find().pretty()"

# Re-seed database if needed
docker-compose exec api npm run seed
```

#### 3. **Score Not Saving**
```bash
# Check API logs
docker-compose logs api

# Verify database connection
docker-compose exec api env | grep MONGO

# Check attempt creation
docker-compose exec mongo mongosh --eval "use upivot; db.attempts.find().pretty()"
```

#### 4. **Performance Charts Not Showing**
```bash
# Check if attempts exist
docker-compose exec mongo mongosh --eval "use upivot; db.attempts.count()"

# Verify API endpoints
curl http://localhost:4000/api/attempts/stats
curl http://localhost:4000/api/attempts
```

### Debug Commands

```bash
# Check service status
docker-compose ps

# View all logs
docker-compose logs -f

# Restart specific service
docker-compose restart api
docker-compose restart web

# Rebuild and restart
docker-compose up -d --build

# Check environment variables
docker-compose exec api env | grep -E "(MONGO|JWT|GOOGLE)"
```

## 📈 Performance Features

### What Gets Tracked
- **Score**: Percentage correct answers
- **Time**: Time spent on each drill
- **Progress**: Question-by-question tracking
- **History**: Complete attempt history
- **Analytics**: Performance trends and statistics

### Performance Metrics
- **Overall Score**: Average across all attempts
- **Improvement Rate**: Progress over time
- **Completion Rate**: Percentage of completed drills
- **Time Analysis**: Speed vs accuracy
- **Drill Analysis**: Performance by topic/difficulty

## 🎯 Sample Data

After running the seed script, you'll have:

### Drills
1. **JavaScript Fundamentals** (Easy)
   - 3 questions about JS basics
   - Multiple choice format
   - Explanations for each answer

2. **React Hooks Deep Dive** (Medium)
   - 3 questions about React Hooks
   - Advanced concepts
   - Detailed explanations

3. **Advanced TypeScript** (Hard)
   - 3 questions about TypeScript
   - Complex type system concepts
   - Expert-level content

### Test User
- **Email**: test@example.com
- **Name**: Test User
- **Username**: testuser
- **Sample attempts**: 3 completed drills

## 🚀 Production Deployment

### 1. **Update Environment**
```bash
# Production settings
NODE_ENV=production
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict
JWT_SECRET=your-production-secret
```

### 2. **Use Production Compose**
```bash
# Copy production config
cp docker-compose.prod.yml docker-compose.yml

# Set production variables
export NODE_ENV=production
export JWT_SECRET=your-production-secret
# ... other variables
```

### 3. **Deploy**
```bash
# Build and start production services
docker-compose up -d --build

# Scale if needed
docker-compose up -d --scale api=3
```

## 📚 API Endpoints

### Authentication
- `GET /auth/google` - Start OAuth
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/logout` - Logout
- `GET /auth/status` - Check auth status

### User Management
- `GET /api/me` - Get current user
- `PATCH /api/me` - Update user profile

### Drills
- `GET /api/drills` - List all drills
- `GET /api/drills/:id` - Get specific drill

### Attempts
- `POST /api/attempts` - Submit attempt
- `GET /api/attempts` - Get user attempts
- `GET /api/attempts/stats` - Get statistics
- `GET /api/attempts/:id` - Get specific attempt

## 🔍 Monitoring & Debugging

### Health Checks
```bash
# Application health
curl http://localhost:4000/api/health

# Database health
docker-compose exec mongo mongosh --eval "db.adminCommand('ping')"

# Frontend health
curl http://localhost:5173
```

### Log Analysis
```bash
# Real-time logs
docker-compose logs -f

# Specific service logs
docker-compose logs api
docker-compose logs web
docker-compose logs mongo

# Error logs only
docker-compose logs api | grep ERROR
```

## 🎉 Success Indicators

Your application is working correctly when:

✅ **Authentication**: Users can login with Google
✅ **Drill Loading**: Drills display with questions and options
✅ **Score Calculation**: Scores are calculated and displayed
✅ **Data Persistence**: Attempts are saved to database
✅ **Performance Charts**: Charts show in History page
✅ **Real-time Updates**: New attempts appear immediately

## 📞 Support

If you encounter issues:

1. **Check the logs**: `docker-compose logs -f`
2. **Verify environment**: Ensure all variables are set
3. **Test database**: Use the monitor script
4. **Check health**: Verify all services are running
5. **Review this guide**: Common solutions are documented

## 🚀 Next Steps

Once everything is working:

1. **Customize Drills**: Add your own questions and topics
2. **User Management**: Implement user roles and permissions
3. **Advanced Analytics**: Add more detailed performance metrics
4. **Mobile Optimization**: Improve mobile experience
5. **Performance**: Add caching and optimization

---

**🎯 You now have a fully functional interview drills application with real-time scoring, performance tracking, and comprehensive analytics!**
