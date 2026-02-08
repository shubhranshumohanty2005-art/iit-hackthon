# 🌌 Cosmic Watch - Space Monitoring Platform

A full-stack web application for monitoring Near-Earth Objects (NEOs) using NASA's NeoWs API. Track asteroids, analyze risk levels, and receive alerts about potentially hazardous space objects.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### Core Features

- **Real-time Asteroid Monitoring**: Fetch and display asteroid data from NASA's NeoWs API
- **Risk Analysis Engine**: Intelligent scoring system based on hazardous status, miss distance, diameter, and velocity
- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Watchlist Management**: Track specific asteroids and receive personalized alerts
- **Alert System**: Automated cron jobs check watched asteroids every 6 hours
- **Responsive Design**: Beautiful space-themed dark mode UI that works on all devices

### Extra Features ⭐

- **Asteroid Detail Page**: Comprehensive view with full orbital data, physical characteristics, and close approach information
- **Data Visualizations**: 4 interactive Chart.js charts (Risk Distribution, Risk Trend, Velocity Comparison, Size Comparison)
- **Search Functionality**: Real-time search by asteroid name or ID with dynamic filtering
- **User Profile**: Personalized profile page with settings and statistics
- **Enhanced Navigation**: Seamless routing between dashboard, details, watchlist, alerts, and profile

### Bonus Features

- **Real-time Chat**: Socket.io powered chat rooms for discussing asteroids
- **3D Visualization**: Three.js integration for orbital path rendering (ready for implementation)

## 🛠️ Technology Stack

### Backend

- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Database**: MongoDB 7
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.io
- **Scheduling**: node-cron
- **API Integration**: Axios (NASA NeoWs API)

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Chart.js + react-chartjs-2
- **3D Graphics**: Three.js + React Three Fiber (ready for implementation)

### DevOps

- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (for frontend)
- **Environment**: Multi-stage builds for production optimization

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- NASA API key (get one free at https://api.nasa.gov)
- **OR** Node.js 18+ and MongoDB for local development

### Option 1: Windows Quick Start (Recommended)

1. **Get NASA API Key**: Visit https://api.nasa.gov and get your free API key

2. **Configure environment**

   ```bash
   # Edit .env.example and add your NASA API key
   # Save as backend/.env
   ```

3. **Run the application**

   ```bash
   # Double-click run.bat or execute in terminal:
   run.bat
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Option 2: Using Docker

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cosmic-watch
   ```

2. **Set up environment variables**

   ```bash
   # Create .env file in the root directory
   cp .env.example .env

   # Edit .env and add your NASA API key
   NASA_API_KEY=your_nasa_api_key_here
   JWT_SECRET=your_secure_jwt_secret
   ```

3. **Start the application**

   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

### Local Development

#### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
cosmic-watch/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic (NASA API, risk analysis, Socket.io)
│   │   ├── utils/           # Utilities (scheduler)
│   │   └── server.js        # Entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── styles/          # Global styles
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Asteroids

- `GET /api/asteroids/feed` - Get asteroid feed (query: start_date, end_date)
- `GET /api/asteroids/:id` - Get specific asteroid details
- `GET /api/asteroids/browse` - Browse asteroid database (query: page, size)

### Watchlist

- `GET /api/watchlist` - Get user's watchlist (protected)
- `POST /api/watchlist` - Add asteroid to watchlist (protected)
- `DELETE /api/watchlist/:id` - Remove from watchlist (protected)
- `PUT /api/watchlist/:id/alerts` - Update alert settings (protected)

### Alerts

- `GET /api/alerts` - Get user's alerts (protected)
- `PUT /api/alerts/:id/read` - Mark alert as read (protected)
- `DELETE /api/alerts/:id` - Delete alert (protected)
- `PUT /api/alerts/read-all` - Mark all as read (protected)

## 🎯 Risk Analysis Algorithm

The risk scoring system evaluates asteroids based on four key factors:

1. **Hazardous Classification** (40 points)
   - Potentially hazardous asteroids receive full points

2. **Miss Distance** (30 points)
   - ≤0.05 AU: 30 points
   - 0.05-0.1 AU: 20 points
   - 0.1-0.2 AU: 10 points
   - > 0.2 AU: 5 points

3. **Diameter** (20 points)
   - > 1000m: 20 points
   - 500-1000m: 15 points
   - 100-500m: 10 points
   - <100m: 5 points

4. **Velocity** (10 points)
   - > 30 km/s: 10 points
   - 20-30 km/s: 7 points
   - 10-20 km/s: 5 points
   - <10 km/s: 3 points

**Risk Levels:**

- CRITICAL: ≥75 points
- HIGH: 50-74 points
- MEDIUM: 25-49 points
- LOW: <25 points

## 🎨 UI/UX Features

- **Space-themed Dark Mode**: Immersive cosmic design with animated star background
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Risk Color Coding**: Visual indicators for different threat levels
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Gradient Typography**: Eye-catching headers with gradient effects

## 📊 Postman Collection

Import the Postman collection from `postman_collection.json` to test all API endpoints with pre-configured requests and examples.

## 🔒 Security Features

- JWT-based authentication with secure token storage
- Password hashing with bcrypt (10 salt rounds)
- Protected API routes with authentication middleware
- CORS configuration for frontend-backend communication
- Environment variable management for sensitive data

## 🐳 Docker Configuration

The application uses multi-stage Docker builds for optimized production images:

- **Backend**: Node.js Alpine image with production dependencies only
- **Frontend**: Build stage + Nginx Alpine for serving static files
- **MongoDB**: Official MongoDB 7 image with persistent volume

## 📝 Environment Variables

```env
# NASA API
NASA_API_KEY=your_api_key

# MongoDB
MONGODB_URI=mongodb://mongodb:27017/cosmic-watch

# JWT
JWT_SECRET=your_secret_key

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
```

## 🧪 Testing

### Manual Testing

1. Register a new user account
2. Login and explore the dashboard
3. Search for asteroids by date range
4. Add asteroids to your watchlist
5. Check alerts for updates

### API Testing

Use the provided Postman collection to test all endpoints with various scenarios.

## 🚧 Future Enhancements

### High Priority

1. Complete 3D orbital visualization with Three.js
2. Add email notifications using nodemailer
3. Implement backend for profile settings
4. Add data export (CSV/JSON)

### Medium Priority

1. Advanced filtering (by risk level, size, velocity)
2. Asteroid comparison feature
3. Historical data analysis and trends
4. Push notifications for mobile

### Low Priority

1. Dark/light mode toggle
2. Social sharing features
3. Mobile app (React Native)
4. Multi-language support

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- NASA NeoWs API for providing asteroid data
- The open-source community for amazing tools and libraries

## 👨‍💻 Developer

Built with ❤️ for the IIT Hackathon

---

**Note**: This application uses NASA's DEMO_KEY by default, which has rate limits. For production use, obtain a personal API key from https://api.nasa.gov
