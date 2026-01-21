const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const prisma = new PrismaClient();
const app = express();

const splitCsv = (value) =>
  String(value || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

const staticAllowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:9000',
  'http://192.168.0.4:3000',
  'http://192.168.0.5:8080',
];

const envAllowedOrigins = [
  ...splitCsv(process.env.CORS_ALLOW_ORIGINS || process.env.CORS_ALLOWED_ORIGINS),
  ...splitCsv(process.env.FRONTEND_ORIGIN || process.env.FRONTEND_URL),
  ...splitCsv(process.env.VERCEL_URL).map((host) => (host.startsWith('http') ? host : `https://${host}`)),
];

const allowedOrigins = new Set([...staticAllowedOrigins, ...envAllowedOrigins]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin / server-to-server requests (no Origin header)
      if (!origin) return callback(null, true);
      if (process.env.CORS_ALLOW_ALL === 'true') return callback(null, true);

      if (allowedOrigins.has(origin)) return callback(null, true);
      if (/^https?:\/\/.*\.vercel\.app$/.test(origin)) return callback(null, true);

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

const JWT_SECRET = process.env.JWT_SECRET || 'brainy-secret-key-2024';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'brainy-refresh-secret-2024';

const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.authToken || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const facultyRoutes = require('./routes/faculty');
const adminRoutes = require('./routes/admin');
const quizRoutes = require('./routes/quiz');
const authRoutes = require('./routes/auth');

app.use('/api/faculty', facultyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/auth', authRoutes);


app.get('/api/student/results', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Student') {
      return res.status(403).json({ message: 'Access denied. Students only.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        quizAttempts: {
          include: {
            category: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      results: user.quizAttempts,
      student: {
        id: user.id,
        fullName: user.fullName,
        rollNumber: user.rollNumber,
        email: user.email,
        department: user.department,
        course: user.course,
        semester: user.semester
      }
    });
  } catch (error) {
    console.error('Student results error:', error);
    res.status(500).json({ message: 'Failed to fetch results' });
  }
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Brainy API Server',
    version: '1.0.0',
    status: 'running'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend Server running on http://localhost:${PORT}`);
});

