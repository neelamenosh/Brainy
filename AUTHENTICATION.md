# Authentication System Documentation

## Overview
The application now has a robust authentication system with the following features:

1. **Input Validation** - Email format and password strength validation on both frontend and backend
2. **Error Handling** - Comprehensive error messages for all scenarios
3. **Security** - Password hashing with bcrypt and JWT token-based authentication
4. **Session Management** - Automatic token verification on app load and expiration handling
5. **API Error Recovery** - Network error handling and graceful degradation

## Features

### Frontend (React + TypeScript)

**AuthContext** (`src/contexts/AuthContext.tsx`)
- Manages user authentication state
- Provides `login`, `register`, and `logout` functions
- Automatically verifies token on app startup
- Stores JWT token in localStorage

**Auth API** (`src/api/authApi.ts`)
- Centralized API utility for all authentication endpoints
- Input validation before API calls
- Comprehensive error handling
- Type-safe request/response handling
- Email validation regex
- Password minimum length validation (6 characters)

**Login Component** (`src/pages/Login.tsx`)
- Login and registration tabs
- Real-time error display with icons
- Input validation feedback
- Loading states
- Success message with auto-redirect
- Clear error messages for each field

### Backend (Node.js + Express)

**API Endpoints:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout (client-side token removal)

**Features:**
- Password hashing with bcrypt (salt rounds: 12)
- JWT token generation (expires in 7 days)
- Email case-insensitivity (normalized to lowercase)
- Input validation on all endpoints
- Comprehensive error messages
- CORS enabled for multiple origins

## Error Handling

### Frontend Error Scenarios
1. **Invalid Email** - Shows "Please enter a valid email address"
2. **Weak Password** - Shows "Password must be at least 6 characters"
3. **Missing Fields** - Shows specific field validation errors
4. **Network Errors** - Shows "Network error. Please check your connection."
5. **User Already Exists** - Shows helpful message to use different email or login
6. **Invalid Credentials** - Shows "Invalid email or password"

### Backend Validation
- Email format validation
- Password length validation (minimum 6 characters)
- Name length validation (minimum 2 characters)
- Duplicate email checking
- JWT token expiration handling
- Token format validation

## Configuration

### Environment Variables

**Frontend (.env)**
```
VITE_API_BASE_URL=http://localhost:5000/api/auth
```

**Frontend Production (.env.production)**
```
VITE_API_BASE_URL=/api/auth
```

**Backend (.env)**
```
JWT_SECRET=your-secret-key (optional, defaults to 'your-secret-key')
PORT=5000
```

## Security Features

1. **Password Hashing** - Bcrypt with 12 salt rounds
2. **JWT Authentication** - Secure token-based sessions
3. **CORS Protection** - Whitelist of allowed origins
4. **Input Validation** - Both frontend and backend
5. **Error Messages** - Generic messages to prevent user enumeration attacks
6. **Token Expiration** - 7-day token lifetime

## Testing the Login System

### Register a New User
1. Go to `/login`
2. Click the "Register" tab
3. Fill in Full Name, Email, Password, and Confirm Password
4. Click "Sign Up"
5. You should see a success message and auto-redirect to home

### Login with Existing User
1. Go to `/login`
2. Fill in Email and Password
3. Click "Sign In"
4. You should be redirected to home page

### Test Error Scenarios

**Invalid Email:**
- Enter "invalidemail" in email field and click Sign In
- Should show: "Please enter a valid email address"

**Weak Password:**
- Enter an email and password with less than 6 characters
- Should show: "Password must be at least 6 characters"

**Missing Fields:**
- Click Sign In without filling fields
- Should show specific field validation errors

**User Already Exists:**
- Try registering with an existing email
- Should show: "User already exists"

**Invalid Credentials:**
- Try logging in with non-existent user or wrong password
- Should show: "Invalid email or password"

## Future Improvements

1. **Password Reset** - Implement forgot password functionality
2. **Email Verification** - Send verification email on registration
3. **Two-Factor Authentication** - Add 2FA support
4. **Social Login** - Google/GitHub authentication
5. **Rate Limiting** - Prevent brute force attacks
6. **Session Management** - Multiple device sessions
7. **Refresh Tokens** - Implement refresh token rotation
8. **Account Management** - Profile update and password change

## Troubleshooting

### Login not working
1. Ensure backend is running: `npm run dev` in `/backend` folder
2. Check CORS settings in `backend/server.js`
3. Verify API base URL in `.env` file
4. Check browser console for network errors

### Users.json issues
- File is created automatically in `/backend` directory
- Contains hashed passwords (not plain text)
- Do not edit manually

### JWT Token not working
- Clear localStorage and try again
- Check token expiration (7 days)
- Verify JWT_SECRET matches between requests

## Database Migration (Future)

When ready to migrate from file-based storage to MongoDB:
1. Update `backend/models/User.js` to use Mongoose schema
2. Replace `readUsers()` and `writeUsers()` with database queries
3. Update email checking logic
4. Implement proper indexing on email field
