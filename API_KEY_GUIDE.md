# API Key Configuration Guide

## ✅ Setup Complete

Your API key has been securely configured in both backend and frontend environment files.

### Backend Configuration

**File:** `backend/.env`

```env
NASA_API_KEY=chdMrDyk2LPwVTy1K0Rng7tjvfL5agY3NfqAq0Sd
API_KEY=chdMrDyk2LPwVTy1K0Rng7tjvfL5agY3NfqAq0Sd
```

### Frontend Configuration

**File:** `frontend/.env`

```env
REACT_APP_API_KEY=chdMrDyk2LPwVTy1K0Rng7tjvfL5agY3NfqAq0Sd
REACT_APP_API_URL=http://localhost:5001
```

### 🔒 Security

- ✅ `.env` files are already in `.gitignore`
- ✅ API keys will NOT be committed to Git
- ✅ Keys are loaded via `dotenv` package

---

## Usage Examples

### Backend (Already Implemented)

Your NASA service already uses the API key correctly:

**File:** `backend/src/services/nasaService.js`

```javascript
const NASA_API_KEY = process.env.NASA_API_KEY;

// Making requests to NASA API
const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/feed`, {
  params: {
    api_key: NASA_API_KEY,
    start_date: startDate,
    end_date: endDate,
  },
});
```

### Frontend (Calling Backend - Recommended)

**Current Implementation:**

```javascript
// frontend/src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

export const asteroidsAPI = {
  getAll: () =>
    api.get("/asteroids/browse", {
      params: { page: 0, size: 100 },
    }),
  // ... other methods
};
```

This is the **recommended approach** because:

- ✅ API key stays on the server (more secure)
- ✅ No exposure in browser
- ✅ Better rate limit management

### Alternative: Direct Frontend API Calls (If Needed)

If you need to call an external API directly from the frontend:

```javascript
// Example component
import axios from "axios";

const fetchExternalData = async () => {
  try {
    const response = await axios.get("https://api.example.com/data", {
      headers: {
        "X-API-Key": process.env.REACT_APP_API_KEY,
        // OR
        Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
  }
};
```

⚠️ **Note:** Frontend environment variables are exposed in the browser. Only use this for public APIs or when absolutely necessary.

---

## Adding New API Endpoints

### Backend Example

**File:** `backend/src/routes/external.js` (new file)

```javascript
const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_KEY = process.env.API_KEY;

// Example: Fetch data from external API
router.get("/external-data", async (req, res) => {
  try {
    const response = await axios.get("https://api.service.com/data", {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "X-API-Key": API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch data",
      message: error.message,
    });
  }
});

module.exports = router;
```

**Register the route in** `backend/src/routes/index.js`:

```javascript
const externalRoutes = require("./external");
router.use("/external", externalRoutes);
```

### Frontend Example

**File:** `frontend/src/services/api.js`

```javascript
export const externalAPI = {
  getData: () => api.get("/external/external-data"),
};
```

**Usage in Component:**

```javascript
import { externalAPI } from "../services/api";

const MyComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await externalAPI.getData();
        setData(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  return <div>{JSON.stringify(data)}</div>;
};
```

---

## Environment Variables Reference

### Backend (.env)

```env
# NASA API
NASA_API_KEY=chdMrDyk2LPwVTy1K0Rng7tjvfL5agY3NfqAq0Sd
API_KEY=chdMrDyk2LPwVTy1K0Rng7tjvfL5agY3NfqAq0Sd

# Database
MONGODB_URI=mongodb://localhost:27017/cosmic-watch

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
# API Configuration
REACT_APP_API_KEY=chdMrDyk2LPwVTy1K0Rng7tjvfL5agY3NfqAq0Sd
REACT_APP_API_URL=http://localhost:5001
```

---

## Restart Required

After updating `.env` files, you need to restart the servers:

### Backend

```bash
# Stop the current server (Ctrl+C)
# Then restart
cd backend
npm start
```

### Frontend

```bash
# Stop the current server (Ctrl+C)
# Then restart
cd frontend
npm run dev
```

Or use the convenient run scripts:

```bash
# Windows
run.bat

# PowerShell
./run.ps1
```

---

## Troubleshooting

### API Key Not Working

1. ✅ Check `.env` file exists in correct location
2. ✅ Verify no extra spaces around `=`
3. ✅ Restart the server after changes
4. ✅ Check `process.env.API_KEY` is not `undefined`

### Frontend Variables Not Loading

1. ✅ Must start with `REACT_APP_`
2. ✅ Restart Vite dev server
3. ✅ Clear browser cache

### Git Security Check

```bash
# Make sure .env is ignored
git status

# Should NOT show .env files
# If it does, run:
git rm --cached backend/.env
git rm --cached frontend/.env
```

---

## Best Practices

✅ **DO:**

- Use backend as proxy for API calls
- Keep sensitive keys on server only
- Add `.env.example` files with dummy values
- Document required environment variables

❌ **DON'T:**

- Commit `.env` files to Git
- Hardcode API keys in source code
- Share API keys in public repositories
- Use production keys in development

---

## Summary

Your API key is now configured and ready to use! The existing NASA API integration will automatically use the new key. For any new external APIs, follow the patterns shown above.

**Current Status:**

- ✅ Backend `.env` updated
- ✅ Frontend `.env` created
- ✅ Files protected by `.gitignore`
- ✅ NASA API will use new key
- ✅ Ready for development
