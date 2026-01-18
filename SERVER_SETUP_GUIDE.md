# 🎯 QUICK SETUP - KEEP SERVERS RUNNING

## 📋 MINIMUM STEPS TO PREVENT NETWORK ERRORS

### Step 1: Start Backend (Terminal 1)
```bash
cd /Users/user/Desktop/stats-mastermind-main/backend
node server.js
```

**You should see:**
```
[dotenv@17.2.3] injecting env (3) from .env
Server running on port 3001
```

✅ If you see this, backend is ready!

---

### Step 2: Start Frontend (Terminal 2)
```bash
cd /Users/user/Desktop/stats-mastermind-main
npm run dev
```

**You should see:**
```
VITE v7.3.0  ready in XXX ms
Local:   http://localhost:8080/
```

✅ If you see this, frontend is ready!

---

### Step 3: Open Login Page
```
http://localhost:8080/login
```

✅ Login page should load without errors!

---

## ⚠️ IMPORTANT - DON'T CLOSE THESE TERMINALS

- **Terminal 1** → Keep backend running
- **Terminal 2** → Keep frontend running

If you close either terminal, you'll get **"Network Connection Error"** again!

---

## 🔄 Quick Reference

### If Login Page Shows "Network Error"
✅ Check Terminal 1: Does it show "Server running on port 3001"?  
✅ Check Terminal 2: Does it show "Local: http://localhost:8080"?

If either is missing, restart that server!

---

## ✅ You're All Set!

Try registering or logging in now. It should work! 🚀
