const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const ADMIN_REPORTS_FILE = path.join(__dirname, '..', 'data', 'admin_reports.json');
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');
const PROGRESS_FILE = path.join(__dirname, '..', 'data', 'progress.json');
const JWT_SECRET = process.env.JWT_SECRET || 'brainy-secret-key-2024';

const adminMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'Admin') return res.status(403).json({ message: 'Access denied. Admin only.' });
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const readData = (file) => {
  try {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeData = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

router.get('/test', (req, res) => {
  res.json({ message: 'Admin routes are working' });
});

router.get('/reports', adminMiddleware, (req, res) => {
  const reports = readData(ADMIN_REPORTS_FILE);
  res.json(reports);
});

router.post('/publish-results', adminMiddleware, (req, res) => {
  const { reportId } = req.body;
  const reports = readData(ADMIN_REPORTS_FILE);
  const reportIndex = reports.findIndex(r => r.id === reportId);

  if (reportIndex === -1) return res.status(404).json({ message: 'Report not found' });

  reports[reportIndex].status = 'published';
  reports[reportIndex].publishedAt = new Date().toISOString();
  writeData(ADMIN_REPORTS_FILE, reports);

  res.json({ message: 'Results published successfully', report: reports[reportIndex] });
});

router.get('/stats', adminMiddleware, (req, res) => {
  const users = readData(USERS_FILE);
  const progress = readData(PROGRESS_FILE);
  const reports = readData(ADMIN_REPORTS_FILE);

  const stats = {
    totalStudents: users.filter(u => u.role === 'Student').length,
    totalFaculty: users.filter(u => u.role === 'Faculty').length,
    totalQuizzesTaken: Object.keys(progress).length,
    pendingReports: reports.filter(r => r.status === 'pending').length,
    publishedReports: reports.filter(r => r.status === 'published').length,
    systemUpdates: [
      { id: 1, type: 'System', message: 'Admin dashboard refined with high authority look', time: 'Just now' },
      { id: 2, type: 'Faculty', message: 'New progress reports received from Faculty', time: '10 mins ago' },
      { id: 3, type: 'System', message: 'Automatic database backup completed', time: '1 hour ago' }
    ]
  };

  res.json(stats);
});

module.exports = router;
