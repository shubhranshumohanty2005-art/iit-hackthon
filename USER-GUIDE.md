# 👤 How to Create an Account - Cosmic Watch

## Step-by-Step Account Creation Guide

### Prerequisites

Make sure the application is running:

1. Backend server is running on http://localhost:5001
2. Frontend is running on http://localhost:3000

If not running, execute `run.bat` from the project root.

---

## Creating Your Account

### Step 1: Open the Application

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Navigate to: **http://localhost:3000**
3. You'll see the Cosmic Watch homepage

### Step 2: Go to Registration Page

1. Click on the **"Register"** button in the navigation bar
2. Or navigate directly to: http://localhost:3000/register

### Step 3: Fill in Registration Form

You'll see a registration form with the following fields:

```
┌─────────────────────────────────┐
│  🌌 Create Your Account         │
├─────────────────────────────────┤
│  Name:     [Your Full Name]     │
│  Email:    [your@email.com]     │
│  Password: [••••••••••]          │
│  Confirm:  [••••••••••]          │
│                                  │
│  [Create Account Button]         │
│                                  │
│  Already have account? Login     │
└─────────────────────────────────┘
```

**Fill in the fields:**

1. **Name**: Enter your full name
   - Example: `John Doe`

2. **Email**: Enter a valid email address
   - Example: `john.doe@example.com`
   - Must be unique (not already registered)

3. **Password**: Create a secure password
   - Minimum 6 characters
   - Example: `MySecurePass123`

4. **Confirm Password**: Re-enter the same password
   - Must match the password above

### Step 4: Submit Registration

1. Click the **"Create Account"** button
2. Wait for the system to process your registration

### Step 5: Automatic Login

- ✅ If successful, you'll be automatically logged in
- ✅ You'll be redirected to the Dashboard
- ✅ Your name will appear in the navigation bar

---

## What Happens After Registration?

### 1. **You're Logged In**

- Your session is saved in the browser
- You'll stay logged in even if you refresh the page

### 2. **Access to Features**

You now have access to:

- 🌠 **Dashboard**: View asteroid feed and search
- 📊 **Data Visualizations**: Interactive charts
- 🔍 **Asteroid Details**: Full orbital information
- ⭐ **Watchlist**: Track your favorite asteroids
- 🔔 **Alerts**: Receive notifications
- 👤 **Profile**: Manage your settings

---

## Example Registration

Here's a complete example:

```
Name:              Jane Smith
Email:             jane.smith@cosmicwatch.com
Password:          SpaceRocks2024!
Confirm Password:  SpaceRocks2024!

[Click: Create Account]
```

**Result:**

```
✅ Account created successfully!
✅ Logged in as Jane Smith
→ Redirected to Dashboard
```

---

## Troubleshooting

### ❌ "Email already exists"

**Problem**: Someone already registered with this email  
**Solution**:

- Use a different email address
- Or click "Login" if it's your account

### ❌ "Passwords do not match"

**Problem**: Password and Confirm Password are different  
**Solution**:

- Make sure both password fields have the exact same text
- Check for typos or extra spaces

### ❌ "Password too short"

**Problem**: Password is less than 6 characters  
**Solution**:

- Use at least 6 characters
- Recommended: Use a mix of letters, numbers, and symbols

### ❌ "Invalid email format"

**Problem**: Email format is incorrect  
**Solution**:

- Use format: `name@domain.com`
- Check for typos

### ❌ "Server error" or "Cannot connect"

**Problem**: Backend server is not running  
**Solution**:

1. Open terminal
2. Run `run.bat`
3. Wait for servers to start
4. Try registration again

---

## After Creating Account

### First-Time Setup

1. **Explore the Dashboard**
   - View today's asteroid feed
   - Try the search function
   - Check out the data visualizations

2. **Add Asteroids to Watchlist**
   - Click "View Details" on any asteroid
   - Click "Add to Watchlist"
   - Monitor them from the Watchlist page

3. **Configure Your Profile**
   - Click "Profile" in the navigation
   - Set your alert preferences
   - Customize risk thresholds

4. **Check Alerts**
   - Visit the Alerts page
   - See notifications about your watched asteroids

---

## Login Next Time

When you return to the application:

1. Go to http://localhost:3000
2. Click **"Login"**
3. Enter your email and password
4. Click **"Login"** button

Your watchlist and alerts will be saved!

---

## Security Tips

✅ **Do:**

- Use a unique password
- Keep your password secure
- Logout when using shared computers

❌ **Don't:**

- Share your password
- Use simple passwords like "123456"
- Leave your account logged in on public computers

---

## Quick Reference

| Action    | URL                             |
| --------- | ------------------------------- |
| Register  | http://localhost:3000/register  |
| Login     | http://localhost:3000/login     |
| Dashboard | http://localhost:3000/dashboard |
| Profile   | http://localhost:3000/profile   |

---

## Need Help?

If you encounter any issues:

1. **Check the servers are running**

   ```bash
   # Should see two terminal windows:
   # - Backend (port 5001)
   # - Frontend (port 3000)
   ```

2. **Restart the application**

   ```bash
   stop.bat
   run.bat
   ```

3. **Check browser console**
   - Press F12 in your browser
   - Look for error messages
   - Check the Console tab

4. **Verify MongoDB is running**
   - MongoDB should be running on port 27017
   - Check with: `net start MongoDB` (Windows)

---

**Enjoy exploring the cosmos! 🌌✨**
