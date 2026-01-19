const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082',
    'http://localhost:9000',
    'http://192.168.0.4:3000',
    'http://192.168.0.5:8080'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

const JWT_SECRET = process.env.JWT_SECRET || 'stats-mastermind-secret-key-2024';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'stats-mastermind-refresh-secret-2024';

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

app.post('/api/auth/register', async (req, res) => {
  console.log('Register request received:', req.body);
  try {
    const { rollNumber, fullName, email, phone, password, department, course, semester } = req.body;

    if (!rollNumber || !rollNumber.trim()) {
      return res.status(400).json({ message: 'Roll number is required' });
    }

    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({ message: 'Full name must be at least 2 characters' });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (!phone || phone.length < 10) {
      return res.status(400).json({ message: 'Phone must be at least 10 digits' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (!department) {
      return res.status(400).json({ message: 'Department is required' });
    }

    const users = readUsers();

    const existingUser = users.find(user => 
      user.email.toLowerCase() === email.toLowerCase() || 
      user.rollNumber === rollNumber
    );
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or roll number already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      id: Date.now().toString(),
      rollNumber: rollNumber.trim(),
      fullName: fullName.trim(),
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      department,
      course: course || '',
      semester: semester || 1,
      role: 'Student',
      isVerified: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    users.push(user);
    writeUsers(users);

    const token = jwt.sign(
      { userId: user.id, email: user.email, rollNumber: user.rollNumber, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      refreshToken,
      user: {
        id: user.id,
        rollNumber: user.rollNumber,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  console.log('Login request received:', req.body);
  try {
    const { email, password } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const users = readUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    user.lastLogin = new Date().toISOString();
    writeUsers(users);

    const token = jwt.sign(
      { userId: user.id, email: user.email, rollNumber: user.rollNumber, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user.id,
        rollNumber: user.rollNumber,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

app.get('/api/auth/verify', authMiddleware, (req, res) => {
  try {
    const users = readUsers();
    const user = users.find(u => u.id === req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        rollNumber: user.rollNumber,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
});

app.post('/api/auth/refresh-token', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const users = readUsers();
    const user = users.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newToken = jwt.sign(
      { userId: user.id, email: user.email, rollNumber: user.rollNumber, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token: newToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  try {
    const users = readUsers();
    const user = users.find(u => u.id === req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        rollNumber: user.rollNumber,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        department: user.department,
        course: user.course,
        semester: user.semester,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Failed to get user data' });
  }
});

app.put('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const { fullName, phone, department, course, semester } = req.body;
    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === req.user.userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (fullName) users[userIndex].fullName = fullName.trim();
    if (phone) users[userIndex].phone = phone;
    if (department) users[userIndex].department = department;
    if (course) users[userIndex].course = course;
    if (semester) users[userIndex].semester = semester;

    writeUsers(users);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: users[userIndex].id,
        rollNumber: users[userIndex].rollNumber,
        fullName: users[userIndex].fullName,
        email: users[userIndex].email,
        role: users[userIndex].role,
        department: users[userIndex].department
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Stats Mastermind API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      verify: 'GET /api/auth/verify',
      logout: 'POST /api/auth/logout',
      refreshToken: 'POST /api/auth/refresh-token',
      me: 'GET /api/auth/me',
      updateProfile: 'PUT /api/auth/profile'
    }
  });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints ready at http://localhost:${PORT}/api/auth`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
