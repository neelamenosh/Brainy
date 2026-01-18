# Login System Setup & Testing Guide

## Quick Start

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 2. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The backend should start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
The frontend should start on `http://localhost:5173` (or the shown port)

### 3. Test the Login System

Navigate to `http://localhost:5173/login`

## What Was Fixed

### ✅ Robust API Integration
- Created centralized API utility (`src/api/authApi.ts`)
- Proper error handling for all scenarios
- Network error recovery
- Type-safe API calls

### ✅ Input Validation
- Email format validation (frontend & backend)
- Password minimum length (6 characters)
- Name validation
- Real-time error feedback

### ✅ Enhanced Error Messages
- Specific error messages for each validation
- User-friendly error display with icons
- Clear login/register error states

### ✅ Improved UX
- Loading states while processing
- Error messages cleared when user starts typing
- Auto-redirect after successful registration
- Disabled inputs during loading

### ✅ Backend Improvements
- Email normalization (lowercase)
- Comprehensive validation
- Better error response messages
- Token expiration handling

### ✅ Environment Configuration
- `.env` for development
- `.env.production` for production
- Configurable API base URL

## Testing Scenarios

### Scenario 1: Successful Registration
1. Click "Register" tab
2. Enter:
   - Full Name: "John Doe"
   - Email: "john@example.com"
   - Password: "password123"
   - Confirm: "password123"
3. Click "Sign Up"
4. Should see success message and redirect to home

### Scenario 2: Login
1. Click "Login" tab
2. Enter the email and password from Scenario 1
3. Click "Sign In"
4. Should be redirected to home page

### Scenario 3: Validation Errors
- Leave fields empty → See required field errors
- Enter invalid email → See email format error
- Enter password < 6 chars → See length error
- Passwords don't match → See mismatch error

### Scenario 4: User Already Exists
1. Try registering with same email from Scenario 1
2. Should see "User already exists" error

### Scenario 5: Invalid Credentials
1. Click "Login" tab
2. Enter correct email but wrong password
3. Should see "Invalid email or password"

### Scenario 6: Network Error
1. Stop backend server
2. Try login/register
3. Should see "Network error" message

## API Endpoints

### Register
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Verify Token
```bash
GET http://localhost:5000/api/auth/verify
Authorization: Bearer <token>
```

## Common Issues & Solutions

### Issue: CORS error
**Solution:** Make sure backend is running and `.env` has correct API URL

### Issue: "User not found" after registration
**Solution:** Check that users.json was created in backend folder with the new user

### Issue: Token not persisting
**Solution:** Clear localStorage and re-login

### Issue: Port 5000 already in use
**Solution:** Change PORT in backend `.env` file

## Architecture

```
Login Flow:
1. User enters email & password
2. Frontend validates input
3. API call to POST /api/auth/login
4. Backend validates & checks password
5. JWT token generated
6. Token stored in localStorage
7. User object set in AuthContext
8. Redirect to protected route (/home)

Logout Flow:
1. User clicks logout
2. localStorage token removed
3. User state cleared
4. Redirect to /login
```

## Security Notes

- Passwords are hashed with bcrypt (not stored plain)
- JWT tokens expire in 7 days
- Emails are case-insensitive
- Rate limiting recommended for production
- Use HTTPS in production
- Keep JWT_SECRET secure in production

## Next Steps (Future Enhancements)

1. Database migration (MongoDB)
2. Email verification
3. Password reset functionality
4. Two-factor authentication
5. Social login (Google, GitHub)
6. Rate limiting
7. Refresh tokens
8. Profile management
