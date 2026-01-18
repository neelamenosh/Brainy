# 🚀 Startup Guide - Stats Mastermind

## ✅ One-Command Startup

From the root directory of the project, simply run:

```bash
npm run dev
```

This will automatically start:
- ✅ **Backend Server** on http://localhost:3001
- ✅ **Frontend (Vite)** on http://localhost:8080

Both servers will run side-by-side with automatic restart on file changes.

## 📋 What Happens

When you run `npm run dev`:

1. **Backend starts first** - Express server on port 3001
   - Loads authentication endpoints
   - Enables CORS for frontend communication
   - Ready for API requests

2. **Frontend starts second** - Vite dev server on port 8080
   - Builds React + TypeScript app
   - Hot module replacement enabled
   - Connects to backend API

## 🌐 Access the Application

- **Login Page**: http://localhost:8080/login
- **API Base**: http://localhost:3001/api/auth

## 🧪 Test Login

### Option 1: Register New User
- Email: `your-email@test.com`
- Password: `Password123` (min 6 chars)

### Option 2: Use Demo Account
- Email: `demo@test.com`
- Password: `Demo12345`

## ⚠️ Crash Prevention Features

The system now includes:

✅ **Global Error Handlers**
- Catches uncaught exceptions without crashing
- Logs all errors to console

✅ **Graceful Shutdown**
- Handles SIGTERM and SIGINT signals
- Allows in-flight requests to complete

✅ **Request Logging**
- Every API request is logged with timestamp
- Easy to debug issues

✅ **Process Management**
- Using `concurrently` to manage both processes
- Automatic restart on file changes
- Both servers continue running even if one has an error

## 🔧 Troubleshooting

### Port Already in Use

If you get "Port 3001 already in use":
```bash
# Kill existing process
lsof -i :3001 | grep -v PID | awk '{print $2}' | xargs kill -9

# Then run
npm run dev
```

### Login page loads but can't connect to backend

Check:
1. Backend is running (look for "✅ Backend Server running" in console)
2. Both servers started with `npm run dev` from root
3. Frontend is on port 8080, backend on port 3001

### Changes not reflecting

The system has hot-reload enabled:
- **Frontend changes**: Automatically reload in browser
- **Backend changes**: Server restarts automatically

Just save files and refresh browser if needed.

## 📁 Project Structure

```
stats-mastermind/
├── src/                    # Frontend React code
│   ├── pages/Login.tsx    # Login component
│   ├── contexts/          # AuthContext for state
│   └── api/authApi.ts     # API communication
├── backend/               # Express API server
│   ├── server.js          # Main server file
│   └── users.json         # User storage
└── package.json           # Scripts & dependencies
```

## 🔐 Authentication Flow

1. User enters email & password on Login page
2. Frontend sends request to backend: `POST /api/auth/login`
3. Backend verifies credentials and returns JWT token
4. Frontend stores token in browser session
5. Frontend redirects to dashboard (or quiz page)

## 📝 Environment Variables

Frontend uses `.env` file:
```
VITE_API_BASE_URL=http://localhost:3001/api/auth
```

Backend uses default port 3001 or `PORT` environment variable.

## 🎯 Key Features

- ✅ Single command startup (`npm run dev`)
- ✅ Automatic backend restart on crashes
- ✅ Hot module replacement for frontend
- ✅ Request logging for debugging
- ✅ CORS configured for all dev ports
- ✅ Global error handlers prevent crashes
- ✅ Graceful shutdown handling

---

**That's it! You're ready to develop. Just run `npm run dev` and start building!** 🎉
