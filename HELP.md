# 🌌 Cosmic Watch - Help Guide

Welcome to the Cosmic Watch Help Center! Find answers to common questions, learn about features, and get started quickly.

## 📚 Quick Links

| Guide                                              | Description                          |
| -------------------------------------------------- | ------------------------------------ |
| [🚀 Getting Started](#getting-started)             | First-time setup and running the app |
| [👤 User Guide](USER-GUIDE.md)                     | Account creation and login           |
| [🔑 API Key Setup](API_KEY_GUIDE.md)               | Configuring NASA API key             |
| [💻 Running Guide](RUNNING-GUIDE.md)               | Starting the application             |
| [🧪 Testing Guide](TESTING_GUIDE.md)               | API testing with Postman             |
| [📱 Mobile Deployment](MOBILE_DEPLOYMENT_GUIDE.md) | Deploy to mobile devices             |
| [❓ FAQ](#frequently-asked-questions)              | Common questions and solutions       |
| [🛠️ Troubleshooting](#troubleshooting)             | Fix common issues                    |

---

## 🚀 Getting Started

### Prerequisites

Before running Cosmic Watch, ensure you have:

- ✅ **Node.js 18+** installed ([Download](https://nodejs.org))
- ✅ **MongoDB** running locally or Docker installed
- ✅ **NASA API Key** (free at [https://api.nasa.gov](https://api.nasa.gov))

### Quick Start (3 Steps)

1. **Get your NASA API Key**
   - Visit [https://api.nasa.gov](https://api.nasa.gov)
   - Sign up for a free API key
   - Keep it handy for step 2

2. **Configure the environment**

   ```bash
   # The .env files should already exist
   # Edit backend/.env and add your NASA API key
   NASA_API_KEY=your_key_here
   ```

3. **Run the application**

   ```bash
   # Double-click run.bat OR run in terminal:
   run.bat
   ```

4. **Access the app**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5001](http://localhost:5001)

📖 For detailed instructions, see the [Running Guide](RUNNING-GUIDE.md)

---

## 🎯 Features Overview

### 🌠 Dashboard

Your main hub for asteroid monitoring.

**What you can do:**

- View today's asteroid feed from NASA
- Search asteroids by date range
- Filter by risk level, size, or velocity
- Click asteroids to see detailed information

**Quick Tips:**

- Use the date picker to explore different time periods
- Risk levels are color-coded: 🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Low
- The dashboard auto-refreshes when you change the date range

### 🔍 Asteroid Details

Get comprehensive information about any asteroid.

**Information shown:**

- Physical characteristics (size, mass, composition)
- Orbital data (trajectory, close approach dates)
- Risk analysis and scoring
- Close approach history
- Velocity and miss distance

**Actions available:**

- ⭐ **Add to Watchlist**: Track this asteroid
- 📊 **View Charts**: See data visualizations
- 🔔 **Set Alerts**: Get notifications

### ⭐ Watchlist

Keep track of asteroids that interest you.

**How it works:**

1. Click "View Details" on any asteroid
2. Click "Add to Watchlist"
3. Access your watchlist anytime from the navigation

**Features:**

- Enable/disable alerts for specific asteroids
- Remove asteroids from watchlist
- See all your tracked asteroids in one place
- Automatic checking every 6 hours

### 🔔 Alerts

Stay informed about your watched asteroids.

**Alert types:**

- Close approach warnings
- Risk level changes
- New orbital data available

**Managing alerts:**

- Mark as read individually
- Mark all as read
- Delete individual alerts
- Configure alert preferences in Profile

### 📊 Data Visualizations

Interactive charts powered by Chart.js.

**Available charts:**

1. **Risk Distribution**: Pie chart showing asteroid risk levels
2. **Risk Trend**: Line chart tracking risk over time
3. **Velocity Comparison**: Bar chart comparing asteroid speeds
4. **Size Comparison**: Bar chart showing asteroid diameters

### 🌍 Earth Viewer

Real-time 3D visualization of Earth with asteroid tracking.

**Features:**

- Interactive 3D Earth globe (Three.js)
- Rotate and zoom with mouse
- Real-time day/night cycle
- Asteroid position markers
- Orbital path visualization

**Controls:**

- Left-click + drag: Rotate Earth
- Scroll wheel: Zoom in/out
- Right-click + drag: Pan view

### 👤 Profile

Manage your account and preferences.

**Settings available:**

- Update profile information
- Change password
- Set alert preferences
- View account statistics
- Configure risk thresholds

---

## ❓ Frequently Asked Questions

### Account & Authentication

**Q: How do I create an account?**  
A: See the detailed [User Guide](USER-GUIDE.md) which walks you through registration step-by-step.

**Q: I forgot my password. How do I reset it?**  
A: Currently, password reset requires database access. Contact your administrator or create a new account.

**Q: Can I change my email address?**  
A: Email changes are not currently supported through the UI. You'll need to create a new account.

**Q: Do I stay logged in?**  
A: Yes! Your session persists even if you close the browser, until you manually log out.

### Running the Application

**Q: Which script should I use to run the app?**  
A:

- **Windows Command Prompt**: `run.bat`
- **PowerShell**: `.\run.ps1`
- **Double-click**: `run.bat` in File Explorer

**Q: What ports does the app use?**  
A:

- Frontend: `3000`
- Backend: `5001`
- MongoDB: `27017`

**Q: How do I stop the servers?**  
A:

- Run `stop.bat` or `.\stop.ps1`
- Or close the terminal windows
- Or press `Ctrl+C` in each terminal

**Q: The app won't start. What should I check?**  
A:

1. Node.js is installed: `node --version`
2. MongoDB is running
3. Ports 3000 and 5001 are not in use
4. Dependencies are installed: `npm install` in both frontend and backend folders

### NASA API

**Q: Where do I get a NASA API key?**  
A: Visit [https://api.nasa.gov](https://api.nasa.gov) and sign up for free. See the [API Key Guide](API_KEY_GUIDE.md).

**Q: Can I use the DEMO_KEY?**  
A: Yes, but it has strict rate limits (30 requests/hour, 50 requests/day). Get a personal key for better limits.

**Q: I'm getting "API rate limit exceeded" errors**  
A: You've hit the rate limit. Either:

- Wait an hour for the limit to reset
- Get a personal API key (1000 requests/hour)

**Q: No asteroid data is showing**  
A: Check:

1. Your API key is correctly set in `backend/.env`
2. Backend server is running without errors
3. You have internet connection
4. NASA API is operational (check [status.nasa.gov](https://status.nasa.gov))

### Features & Usage

**Q: How do I add an asteroid to my watchlist?**  
A:

1. Navigate to Dashboard
2. Click "View Details" on any asteroid
3. Click "Add to Watchlist" button

**Q: How often are alerts checked?**  
A: The system automatically checks your watched asteroids every 6 hours via a cron job.

**Q: Can I export my watchlist?**  
A: Export functionality is planned for a future update.

**Q: How is the risk score calculated?**  
A: Risk is based on 4 factors:

- Hazardous classification (40 points)
- Miss distance (30 points)
- Diameter (20 points)
- Velocity (10 points)

See the [README](README.md#-risk-analysis-algorithm) for details.

**Q: The Earth Viewer isn't loading**  
A:

1. Make sure you're logged in
2. Check browser console for WebGL errors
3. Ensure your browser supports WebGL
4. Try a different browser (Chrome recommended)

### Technical Issues

**Q: I see a blank white screen**  
A:

1. Open browser console (F12)
2. Check for JavaScript errors
3. Clear browser cache
4. Ensure backend is running on port 5001

**Q: Login works but dashboard is empty**  
A:

1. Check backend terminal for errors
2. Verify MongoDB is running
3. Check NASA API key is configured
4. Try logging out and back in

**Q: Charts aren't displaying**  
A: Ensure you have asteroid data loaded. Use the date picker to fetch data first.

---

## 🛠️ Troubleshooting

### Common Errors

#### ❌ "Cannot connect to backend"

**Problem**: Frontend can't reach the backend API  
**Solutions**:

1. Verify backend is running on port 5001
2. Check `frontend/.env` has `REACT_APP_API_URL=http://localhost:5001`
3. Restart both servers

#### ❌ "MongoDB connection failed"

**Problem**: Backend can't connect to MongoDB  
**Solutions**:

1. Start MongoDB: `net start MongoDB` (Windows)
2. Check MongoDB is running on port 27017
3. Verify `MONGODB_URI` in `backend/.env`

#### ❌ "NASA API error: 403 Forbidden"

**Problem**: Invalid API key  
**Solutions**:

1. Verify API key in `backend/.env`
2. Check for extra spaces or quotes
3. Get a new key from [https://api.nasa.gov](https://api.nasa.gov)
4. Restart backend server

#### ❌ "Port already in use"

**Problem**: Port 3000 or 5001 is occupied  
**Solutions**:

1. Run `stop.bat` to kill all node processes
2. Or run `kill-port.bat` to free specific ports
3. Manually kill the process using the port

#### ❌ "Module not found" errors

**Problem**: npm dependencies not installed  
**Solutions**:

```bash
cd backend
npm install

cd ../frontend
npm install
```

#### ❌ "Cannot read property of undefined"

**Problem**: React component error, usually due to missing data  
**Solutions**:

1. Check browser console for stack trace
2. Ensure you're logged in
3. Verify API endpoints are returning data
4. Clear browser cache and refresh

### Performance Issues

#### 🐌 "App is slow or laggy"

**Solutions**:

1. Close other applications
2. Clear browser cache
3. Reduce the date range for asteroid queries
4. Check your internet connection
5. Ensure MongoDB has enough resources

#### 🐌 "Earth Viewer is choppy"

**Solutions**:

1. Close other browser tabs
2. Update graphics drivers
3. Use Chrome for better WebGL performance
4. Reduce browser zoom level
5. Disable browser extensions

### Browser Compatibility

**Recommended**: Chrome, Firefox, Edge (latest versions)

**Not Supported**: Internet Explorer

**Mobile**: Works on mobile browsers, but desktop experience is optimized

---

## 🔧 Advanced Configuration

### Environment Variables

**Backend (`backend/.env`):**

```env
NASA_API_KEY=your_api_key_here
MONGODB_URI=mongodb://localhost:27017/cosmic-watch
JWT_SECRET=your_secret_key_here
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend (`frontend/.env`):**

```env
REACT_APP_API_URL=http://localhost:5001
```

### Changing Ports

1. Update `PORT` in `backend/.env`
2. Update proxy in `frontend/vite.config.js`
3. Update `REACT_APP_API_URL` in `frontend/.env`
4. Restart both servers

### Database Management

**View all users:**

```bash
mongo cosmic-watch
db.users.find()
```

**Clear all data:**

```bash
db.dropDatabase()
```

---

## 📖 Additional Resources

### Documentation Files

- **[README.md](README.md)** - Project overview and setup
- **[USER-GUIDE.md](USER-GUIDE.md)** - Account creation guide
- **[API_KEY_GUIDE.md](API_KEY_GUIDE.md)** - API key configuration
- **[RUNNING-GUIDE.md](RUNNING-GUIDE.md)** - How to run the app
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - API testing with Postman
- **[MOBILE_DEPLOYMENT_GUIDE.md](MOBILE_DEPLOYMENT_GUIDE.md)** - Mobile deployment
- **[AI-LOG.md](AI-LOG.md)** - Development history and decisions

### External Resources

- **NASA NeoWs API**: [https://api.nasa.gov](https://api.nasa.gov)
- **API Documentation**: [https://api.nasa.gov/neo/](https://api.nasa.gov/neo/)
- **MongoDB Docs**: [https://docs.mongodb.com](https://docs.mongodb.com)
- **React Docs**: [https://react.dev](https://react.dev)
- **Vite Docs**: [https://vitejs.dev](https://vitejs.dev)

---

## 🆘 Getting Help

### Still having issues?

1. **Check the Console**: Press F12 in your browser and look for error messages
2. **Review Logs**: Check terminal output for backend errors
3. **Restart Everything**: Run `stop.bat` then `run.bat`
4. **Read the Guides**: Check the documentation files listed above
5. **Check Dependencies**: Ensure Node.js, MongoDB, and npm packages are properly installed

### Debugging Tips

- Enable verbose logging in browser DevTools
- Check Network tab for failed API requests
- Verify all services are running (Frontend, Backend, MongoDB)
- Test API endpoints using Postman (see [TESTING_GUIDE.md](TESTING_GUIDE.md))

---

## 🎓 Tips & Best Practices

### For the Best Experience

✅ **DO:**

- Use a modern browser (Chrome, Firefox, Edge)
- Keep your NASA API key secure
- Regularly check your watchlist and alerts
- Use date ranges wisely to avoid rate limits
- Log out when using shared computers

❌ **DON'T:**

- Share your account credentials
- Commit `.env` files to Git
- Use DEMO_KEY in production
- Query large date ranges frequently
- Leave MongoDB exposed without authentication in production

### Keyboard Shortcuts

- **F12**: Open browser DevTools
- **Ctrl + R**: Refresh page
- **Ctrl + Shift + R**: Hard refresh (clear cache)
- **ESC**: Close modals/dialogs

---

## 📊 Quick Reference

### Common Commands

```bash
# Start the app
run.bat

# Stop the app
stop.bat

# Install dependencies
install.bat

# Kill ports manually
kill-port.bat
```

### Important URLs

| Service     | URL                       |
| ----------- | ------------------------- |
| Frontend    | http://localhost:3000     |
| Backend API | http://localhost:5001     |
| MongoDB     | mongodb://localhost:27017 |
| NASA API    | https://api.nasa.gov      |

### Risk Levels

| Level       | Score | Color  | Meaning             |
| ----------- | ----- | ------ | ------------------- |
| 🔴 CRITICAL | ≥75   | Red    | Immediate attention |
| 🟠 HIGH     | 50-74 | Orange | Monitor closely     |
| 🟡 MEDIUM   | 25-49 | Yellow | Worth tracking      |
| 🟢 LOW      | <25   | Green  | Low concern         |

---

**Happy Space Watching! 🌌✨**

_Last updated: February 2026_
