# Earth Viewer Testing Guide

## 🚀 Quick Start

1. **Start the servers:**

   ```bash
   # Windows
   run.bat

   # PowerShell
   ./run.ps1
   ```

2. **Login to the application:**
   - Navigate to `http://localhost:3000/login`
   - Create an account or login with existing credentials
   - **Important:** You must be logged in to access Earth Viewer features

3. **Open Earth Viewer:**
   - Navigate to `http://localhost:3000/earth`
   - Wait for the Earth and asteroids to load

---

## 🧪 Testing All Features

### 1. Alert Notification System

#### Test Critical/High-Risk Alerts

**Steps:**

1. Open Earth Viewer at `/earth`
2. Wait for asteroids to load (check console for logs)
3. Look at the **top-right corner** for alert notifications

**Expected Results:**

- ✅ Red/orange alert cards appear for CRITICAL/HIGH-risk asteroids
- ✅ Each alert shows:
  - Risk level (CRITICAL/HIGH)
  - Asteroid name
  - Timestamp
  - Dismiss button (×)

**Console Logs to Check:**

```
🚀 Fetching asteroids from backend...
📡 API Response: {...}
✅ Asteroids received: X asteroids
🎨 Rendering asteroids to scene...
```

#### Test Audio Alerts

**Steps:**

1. Find the **"🔇 Alert Sound"** button in the left panel
2. Click to enable (should show **"🔊 Alert Sound"**)
3. Refresh the page to trigger alerts again

**Expected Results:**

- ✅ Button toggles between 🔇 and 🔊
- ✅ When enabled, you hear a beep sound when alerts appear
- ✅ Sound is a short 800Hz tone (0.5 seconds)

#### Test Alert Dismissal

**Steps:**

1. Click the **×** button on any alert card
2. Observe the alert disappears

**Expected Results:**

- ✅ Alert is removed from the screen
- ✅ Other alerts remain visible
- ✅ Success alerts (green) auto-dismiss after 3 seconds

---

### 2. Asteroid Click Selection & Details Modal

#### Test Click Detection

**Steps:**

1. Move your mouse over asteroids in the 3D view
2. Notice the cursor changes to **pointer** when hovering
3. Click on any asteroid

**Expected Results:**

- ✅ Cursor changes to pointer on hover
- ✅ Tooltip appears at top showing asteroid name, risk, and distance
- ✅ Modal popup appears when clicked

#### Test Details Modal

**Steps:**

1. Click any asteroid to open the modal
2. Review the information displayed
3. Click the **×** button or click outside to close

**Modal Should Show:**

- ✅ Asteroid name (large blue text)
- ✅ Risk level badge (color-coded)
- ✅ Asteroid ID (monospace font)
- ✅ Miss distance in kilometers
- ✅ Two action buttons

**Color Coding:**

- 🔴 Red = CRITICAL
- 🟠 Orange = HIGH
- 🟡 Yellow = MEDIUM
- 🟢 Green = LOW

---

### 3. Add to Watchlist Feature

#### Test Adding Asteroid

**Steps:**

1. Click an asteroid to open the modal
2. Click **"⭐ Add to Watchlist"** button
3. Wait for the response

**Expected Results:**

- ✅ Button shows "⏳ Adding..." while processing
- ✅ Success notification appears in top-right (green)
- ✅ Modal closes automatically
- ✅ Success message auto-dismisses after 3 seconds

**Verify in Watchlist:**

1. Navigate to `/watchlist`
2. Check if the asteroid appears in your list

#### Test Duplicate Detection

**Steps:**

1. Add an asteroid to watchlist
2. Try adding the same asteroid again

**Expected Results:**

- ✅ Error alert appears saying it's already in watchlist
- ✅ Modal remains open

---

### 4. Risk Level Filtering

#### Test Filter Dropdown

**Steps:**

1. Locate the **"Risk Filter"** dropdown in the left panel
2. Note the current asteroid count (e.g., "All Asteroids (100)")
3. Select different risk levels:
   - Low Risk
   - Medium Risk
   - High Risk
   - Critical Risk

**Expected Results:**

- ✅ Dropdown shows all 5 options
- ✅ "All Asteroids" shows total count
- ✅ Selecting a filter updates the 3D view immediately
- ✅ Only asteroids matching the selected risk level are visible

**Visual Verification:**

- Select "Critical Risk" → Only red asteroids visible
- Select "High Risk" → Only orange asteroids visible
- Select "Medium Risk" → Only yellow asteroids visible
- Select "Low Risk" → Only green asteroids visible
- Select "All Asteroids" → All asteroids visible again

---

### 5. Orbital Animation

#### Test Asteroid Movement

**Steps:**

1. Watch the asteroids in the 3D view
2. Increase the **Time Speed** slider
3. Observe the orbital motion

**Expected Results:**

- ✅ Asteroids orbit around Earth continuously
- ✅ Each asteroid has its own orbital path
- ✅ Closer asteroids orbit faster
- ✅ Asteroids at different inclinations (3D orbits)
- ✅ Speed increases with time multiplier

**Console Check:**
Look for orbital parameters in console:

```
Asteroid 1: (name) at position Vector3 {...} color: ff0000
```

---

### 6. UI Controls & Toggles

#### Test Time Speed Control

**Steps:**

1. Adjust the **"Time Speed"** slider (1x to 3600x)
2. Watch the Earth rotation and asteroid orbits

**Expected Results:**

- ✅ Earth rotates faster/slower
- ✅ Asteroids orbit faster/slower
- ✅ Sun position updates
- ✅ Time display updates in real-time

#### Test Map Style

**Steps:**

1. Change **"Map Style"** dropdown
2. Try all options:
   - Blue Marble (Satellite)
   - Natural Earth
   - Night Lights
   - Topographic

**Expected Results:**

- ✅ Earth texture changes immediately
- ✅ All textures load correctly
- ✅ No errors in console

#### Test View Location

**Steps:**

1. Change **"View Location"** dropdown
2. Try different locations:
   - Earth from Space
   - New York City
   - London
   - Tokyo

**Expected Results:**

- ✅ Camera moves to the selected location
- ✅ Earth rotates to show the location
- ✅ Smooth transition

#### Test Layer Toggles

**Steps:**

1. Click **"Clouds"** button to toggle
2. Click **"Atm"** (Atmosphere) button
3. Click **"Asteroids"** button

**Expected Results:**

- ✅ Buttons highlight when active (blue background)
- ✅ Clouds layer appears/disappears
- ✅ Atmosphere glow appears/disappears
- ✅ All asteroids appear/disappear

---

### 7. Full Details Link

#### Test Navigation

**Steps:**

1. Click an asteroid to open modal
2. Click **"📊 Full Details"** button

**Expected Results:**

- ✅ Opens new tab/window
- ✅ Navigates to `/asteroid/{id}`
- ✅ Shows detailed asteroid information page

---

## 🐛 Troubleshooting

### No Asteroids Appearing

**Check:**

1. Open browser console (F12)
2. Look for error messages
3. Check Network tab for failed requests

**Common Issues:**

- ❌ Not logged in → Go to `/login` first
- ❌ Backend not running → Start with `run.bat`
- ❌ API error → Check backend console logs

**Console Logs to Look For:**

```
✅ Asteroids received: X asteroids
🎨 Rendering asteroids to scene...
✅ Rendered X asteroids to scene
```

### No Alerts Appearing

**Possible Reasons:**

1. No CRITICAL or HIGH-risk asteroids in current data
2. Alerts were already dismissed
3. Check console for errors

**To Force Alerts:**

- Refresh the page to re-trigger alert detection
- Check if any asteroids have `risk_analysis.level` = "CRITICAL" or "HIGH"

### Click Not Working

**Check:**

1. Make sure asteroids are visible (toggle on)
2. Try clicking different asteroids
3. Check console for raycasting errors

**Debug:**

```javascript
// In browser console
console.log(asteroidsGroupRef.current.children.length);
// Should show number > 0
```

### Watchlist Add Fails

**Common Causes:**

- ❌ Not authenticated → Login again
- ❌ Already in watchlist → Expected behavior
- ❌ Backend error → Check backend console

**Check Network Tab:**

- Request to `/api/watchlist` should return 200 or 201
- 401 = Not authenticated
- 409 = Already exists

---

## 📊 Testing Checklist

Use this checklist to verify all features:

### Visual Features

- [ ] Earth renders correctly
- [ ] Asteroids appear as colored dots
- [ ] Asteroids orbit around Earth
- [ ] Clouds layer toggles
- [ ] Atmosphere glow toggles
- [ ] Map styles change texture

### Interactive Features

- [ ] Click asteroid → modal opens
- [ ] Hover asteroid → tooltip appears
- [ ] Add to watchlist works
- [ ] Full details link works
- [ ] Risk filter updates view
- [ ] All toggles work

### Alert System

- [ ] Alerts appear for high-risk asteroids
- [ ] Alert sound toggle works
- [ ] Audio plays when enabled
- [ ] Dismiss button works
- [ ] Success alerts auto-dismiss

### Backend Integration

- [ ] Asteroids load from backend
- [ ] Watchlist API call succeeds
- [ ] Authentication required
- [ ] Error handling works

### Performance

- [ ] Smooth 60fps animation
- [ ] No lag when filtering
- [ ] Modal opens instantly
- [ ] No memory leaks

---

## 🎥 Visual Testing Tips

### Best Way to See Alerts

1. Open Earth Viewer
2. Open DevTools Console (F12)
3. Look for log: `✅ Asteroids received: X asteroids`
4. Check top-right corner immediately
5. If no alerts, the current data may not have high-risk asteroids

### Best Way to Test Filtering

1. Start with "All Asteroids"
2. Count visible asteroids visually
3. Switch to "Critical Risk"
4. Notice only red asteroids remain
5. Switch back to "All" to see all again

### Best Way to Test Orbits

1. Increase Time Speed to 1000x
2. Watch asteroids move in circular paths
3. Notice closer asteroids move faster
4. Reduce to 1x to see slow, realistic motion

---

## 📝 Expected Data

### Sample Alert Notification

```
⚠️ CRITICAL RISK ALERT
(2024 AB123)
12:30:45 PM
[×]
```

### Sample Modal Content

```
(2024 AB123)
[CRITICAL RISK]

Asteroid ID
2024123

Miss Distance
1,234,567 km

[⭐ Add to Watchlist] [📊 Full Details]
```

---

## 🔧 Developer Testing

### Console Commands

Test filtering programmatically:

```javascript
// In browser console
setRiskFilter("critical");
setRiskFilter("all");
```

Check asteroid data:

```javascript
console.log(asteroidData);
console.log(asteroidsGroupRef.current.children);
```

Trigger alert manually:

```javascript
playAlertSound();
```

---

## ✅ Success Criteria

All features are working if:

1. ✅ Asteroids orbit smoothly around Earth
2. ✅ Clicking asteroids opens detailed modal
3. ✅ Adding to watchlist shows success message
4. ✅ Risk filter changes visible asteroids
5. ✅ Alerts appear for high-risk asteroids
6. ✅ Sound plays when enabled
7. ✅ All toggles and controls work
8. ✅ No console errors

---

## 🆘 Getting Help

If something doesn't work:

1. Check browser console for errors
2. Check backend terminal for errors
3. Verify you're logged in
4. Try refreshing the page
5. Restart both servers

**Common Fix:** Restart servers after `.env` changes!

```bash
# Stop servers (Ctrl+C)
# Then run:
run.bat
```
