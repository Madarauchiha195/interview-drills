# Interview Drills - Full Stack Application

A comprehensive interview preparation platform with authentication, drill management, and performance tracking.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB + JWT
- **Authentication**: Google OAuth 2.0
- **Containerization**: Docker + Docker Compose
- **Database**: MongoDB

## 📁 Project Structure

```
interview-drills/
├── api/                 # Backend API
│   ├── models/         # MongoDB models
│   ├── routes/         # API endpoints
│   ├── middlewares/    # Authentication middleware
│   ├── utils/          # Database and utility functions
│   └── Dockerfile      # API container configuration
├── web/                # Frontend application
│   ├── src/           # React source code
│   ├── components/    # Reusable UI components
│   ├── pages/         # Application pages
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API service layer
│   └── Dockerfile     # Web container configuration
├── docker-compose.yml  # Development environment
├── docker-compose.prod.yml # Production environment
├── env.example        # Environment variables template
└── env.development    # Development environment variables
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Google OAuth credentials

### 1. Environment Setup

Copy the environment template and configure your variables:

```bash
# Copy environment template
cp env.example .env

# Edit .env with your actual values
nano .env
```

**Required Environment Variables:**

```bash
# Google OAuth (Required)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# JWT Secret (Required)
JWT_SECRET=your-super-secret-jwt-key

# Optional (have defaults)
SESSION_COOKIE_NAME=upivot_session
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
```

### 2. Start with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **API Health**: http://localhost:4000/api/health
- **MongoDB**: localhost:27017

## 🔧 Development

### Local Development

```bash
# Install dependencies
cd api && npm install
cd ../web && npm install

# Start backend (in api directory)
npm run dev

# Start frontend (in web directory)
npm run dev
```

### Docker Development

```bash
# Rebuild and restart specific service
docker-compose up -d --build api

# View service logs
docker-compose logs api

# Access container shell
docker-compose exec api sh
```

## 🔐 Authentication Setup

### Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:4000/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)

### Environment Variables

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
```

## 🐳 Production Deployment

### 1. Production Environment

```bash
# Copy production compose file
cp docker-compose.prod.yml docker-compose.yml

# Set production environment variables
export NODE_ENV=production
export JWT_SECRET=your-production-jwt-secret
export GOOGLE_CLIENT_ID=your-production-client-id
export GOOGLE_CLIENT_SECRET=your-production-client-secret
export GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback
export WEB_ORIGIN=https://yourdomain.com
export API_BASE_URL=https://yourdomain.com
```

### 2. Deploy

```bash
# Build and start production services
docker-compose -f docker-compose.prod.yml up -d --build

# Scale if needed
docker-compose -f docker-compose.prod.yml up -d --scale api=3
```

## 📊 API Endpoints

### Authentication
- `GET /auth/google` - Start Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/logout` - Logout user
- `GET /auth/status` - Check auth status

### User Management
- `GET /api/me` - Get current user
- `PATCH /api/me` - Update user profile

### Drills
- `GET /api/drills` - List all drills
- `GET /api/drills/:id` - Get specific drill

### Attempts
- `GET /api/attempts` - Get user attempts
- `POST /api/attempts` - Submit attempt

## 🛠️ Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check Google OAuth credentials
   - Verify callback URLs
   - Check CORS configuration

2. **Database connection failed**
   - Ensure MongoDB is running
   - Check MONGO_URI environment variable
   - Verify network connectivity

3. **Frontend can't connect to API**
   - Check VITE_API_BASE_URL
   - Verify API service is running
   - Check CORS settings

### Debug Commands

```bash
# Check service status
docker-compose ps

# View service logs
docker-compose logs api
docker-compose logs web

# Check environment variables
docker-compose exec api env | grep MONGO

# Test API health
curl http://localhost:4000/api/health

# Check MongoDB connection
docker-compose exec mongo mongosh --eval "db.adminCommand('ping')"
```

## 🔒 Security Considerations

- **JWT Secret**: Use strong, unique secrets in production
- **Cookie Security**: Enable secure cookies in production
- **CORS**: Restrict origins to your domains
- **Rate Limiting**: Configure appropriate limits
- **Environment Variables**: Never commit secrets to version control

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review logs and error messages
3. Create an issue with detailed information
