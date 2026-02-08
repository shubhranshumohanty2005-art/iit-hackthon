# 🚀 Running Cosmic Watch - Quick Guide

## The Problem

PowerShell doesn't run `.bat` files directly like Command Prompt does.

## ✅ Solutions

### **Option 1: Use PowerShell Script (Easiest)**

```powershell
# Run this in PowerShell:
.\run.ps1
```

If you get an execution policy error, run this first:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Option 2: Use Command Prompt**

1. Press `Win + R`
2. Type `cmd` and press Enter
3. Navigate to project:
   ```cmd
   cd "d:\PROJECT\iit hack"
   run.bat
   ```

### **Option 3: Call .bat from PowerShell**

```powershell
# In PowerShell:
cmd /c run.bat
```

### **Option 4: Double-Click**

- Just double-click `run.bat` in File Explorer
- Two terminal windows will open automatically

---

## 🎯 Recommended: Use PowerShell Scripts

I've created PowerShell versions of all scripts:

| Script          | Command         | Purpose              |
| --------------- | --------------- | -------------------- |
| **run.ps1**     | `.\run.ps1`     | Start both servers   |
| **stop.ps1**    | `.\stop.ps1`    | Stop all servers     |
| **install.bat** | `.\install.bat` | Install dependencies |

---

## 📝 Step-by-Step for PowerShell Users

### First Time Setup:

1. **Open PowerShell as Administrator**

   ```powershell
   # Allow script execution (one-time only)
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **Navigate to Project**

   ```powershell
   cd "d:\PROJECT\iit hack"
   ```

3. **Run the Application**
   ```powershell
   .\run.ps1
   ```

### Every Time After:

```powershell
cd "d:\PROJECT\iit hack"
.\run.ps1
```

---

## 🛑 To Stop Servers

```powershell
.\stop.ps1
```

Or just close the two PowerShell windows that opened.

---

## 🔧 Troubleshooting

### "Execution Policy" Error

```powershell
# Run this once:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "File not found"

```powershell
# Make sure you're in the right directory:
cd "d:\PROJECT\iit hack"
ls  # Should see run.ps1, run.bat, etc.
```

### Still Having Issues?

Use Command Prompt instead:

1. Press `Win + R`
2. Type `cmd`
3. Press Enter
4. Run: `cd "d:\PROJECT\iit hack" && run.bat`

---

## 📊 What Each Script Does

### run.ps1 / run.bat

- ✅ Checks Node.js installation
- ✅ Creates .env if missing
- ✅ Installs dependencies if needed
- ✅ Starts backend (port 5001)
- ✅ Starts frontend (port 3000)
- ✅ Opens two terminal windows

### stop.ps1 / stop.bat

- ✅ Kills all Node.js processes
- ✅ Frees up ports 3000 and 5001

---

**Choose whichever method works best for you! 🚀**
