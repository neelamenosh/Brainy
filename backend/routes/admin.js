const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'brainy-secret-key-2024';
const ADMIN_REPORTS_FILE = path.join(__dirname, '..', 'data', 'admin_reports.json');

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const readReports = () => {
  try {
    if (!fs.existsSync(ADMIN_REPORTS_FILE)) return [];
    return JSON.parse(fs.readFileSync(ADMIN_REPORTS_FILE, 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeReports = (data) => {
  if (!fs.existsSync(path.dirname(ADMIN_REPORTS_FILE))) {
    fs.mkdirSync(path.dirname(ADMIN_REPORTS_FILE), { recursive: true });
  }
  fs.writeFileSync(ADMIN_REPORTS_FILE, JSON.stringify(data, null, 2));
};

router.get('/reports', adminMiddleware, (req, res) => {
  const reports = readReports();
  res.json(reports);
});

router.post('/publish-results', adminMiddleware, (req, res) => {
  const { reportId } = req.body;
  const reports = readReports();
  const reportIndex = reports.findIndex(r => r.id === reportId);

  if (reportIndex === -1) return res.status(404).json({ message: 'Report not found' });

  reports[reportIndex].status = 'published';
  reports[reportIndex].publishedAt = new Date().toISOString();
  writeReports(reports);

  res.json({ message: 'Results published successfully', report: reports[reportIndex] });
});

router.get('/stats', adminMiddleware, async (req, res) => {
  try {
    const totalStudents = await prisma.user.count({ where: { role: 'Student' } });
    const totalFaculty = await prisma.user.count({ where: { role: 'Faculty' } });
    const totalQuizzesTaken = await prisma.quizAttempt.count();
    
    const reports = readReports();

    const stats = {
      totalStudents,
      totalFaculty,
      totalQuizzesTaken,
      pendingReports: reports.filter(r => r.status === 'pending').length,
      publishedReports: reports.filter(r => r.status === 'published').length,
      systemUpdates: [
        { id: 1, type: 'System', message: 'Admin dashboard refined with high authority look', time: 'Just now' },
        { id: 2, type: 'Faculty', message: 'New progress reports received from Faculty', time: '10 mins ago' },
        { id: 3, type: 'System', message: 'Automatic database backup completed', time: '1 hour ago' }
      ]
    };

    res.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
});

module.exports = router;
