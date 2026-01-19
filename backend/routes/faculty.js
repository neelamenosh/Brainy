const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'brainy-secret-key-2024';
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');
const PROGRESS_FILE = path.join(__dirname, '..', 'data', 'progress.json');
const ADMIN_REPORTS_FILE = path.join(__dirname, '..', 'data', 'admin_reports.json');

const loadUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch {
    return [];
  }
};

const loadProgress = () => {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  } catch {
    return {};
  }
};

const loadAdminReports = () => {
  try {
    return JSON.parse(fs.readFileSync(ADMIN_REPORTS_FILE, 'utf8'));
  } catch {
    return [];
  }
};

const saveAdminReports = (reports) => {
  fs.writeFileSync(ADMIN_REPORTS_FILE, JSON.stringify(reports, null, 2));
};

const authenticateFaculty = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const users = loadUsers();
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user || user.role !== 'Faculty') {
      return res.status(403).json({ error: 'Access denied. Faculty only.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/students', authenticateFaculty, (req, res) => {
  try {
    const users = loadUsers();
    const progress = loadProgress();
    
    const students = users
      .filter(u => u.role === 'Student')
      .map(student => {
        const studentProgress = progress[student.id] || {};
        
        let totalQuizzes = 0;
        let totalScore = 0;
        let totalQuestions = 0;
        let subjectScores = {};
        
        Object.entries(studentProgress).forEach(([subjectId, data]) => {
          if (data.completed) {
            totalQuizzes++;
            totalScore += data.score || 0;
            totalQuestions += data.totalQuestions || 0;
            subjectScores[subjectId] = {
              score: data.score,
              totalQuestions: data.totalQuestions,
              percentage: data.totalQuestions > 0 ? Math.round((data.score / data.totalQuestions) * 100) : 0,
              completedAt: data.completedAt
            };
          }
        });
        
        const overallPercentage = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
        
        return {
          id: student.id,
          rollNumber: student.rollNumber,
          fullName: student.fullName,
          email: student.email,
          department: student.department,
          course: student.course,
          semester: student.semester,
          totalQuizzes,
          totalScore,
          totalQuestions,
          overallPercentage,
          subjectScores,
          lastActive: student.lastLogin
        };
      });
    
    res.json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

router.get('/students/:studentId', authenticateFaculty, (req, res) => {
  try {
    const { studentId } = req.params;
    const users = loadUsers();
    const progress = loadProgress();
    
    const student = users.find(u => u.id === studentId && u.role === 'Student');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const studentProgress = progress[studentId] || {};
    
    res.json({
      student: {
        id: student.id,
        rollNumber: student.rollNumber,
        fullName: student.fullName,
        email: student.email,
        department: student.department,
        course: student.course,
        semester: student.semester
      },
      progress: studentProgress
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ error: 'Failed to fetch student details' });
  }
});

router.post('/send-to-admin', authenticateFaculty, (req, res) => {
  try {
    const { studentIds, message, reportType } = req.body;
    const users = loadUsers();
    const progress = loadProgress();
    
    const reports = loadAdminReports();
    
    const studentsData = studentIds.map(id => {
      const student = users.find(u => u.id === id);
      const studentProgress = progress[id] || {};
      return {
        ...student,
        progress: studentProgress
      };
    });
    
    const report = {
      id: Date.now().toString(),
      facultyId: req.user.id,
      facultyName: req.user.fullName,
      facultyEmail: req.user.email,
      reportType: reportType || 'progress_report',
      message: message || '',
      students: studentsData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    reports.push(report);
    saveAdminReports(reports);
    
    res.json({ success: true, message: 'Report sent to admin successfully', reportId: report.id });
  } catch (error) {
    console.error('Error sending report to admin:', error);
    res.status(500).json({ error: 'Failed to send report to admin' });
  }
});

router.get('/admin-reports', authenticateFaculty, (req, res) => {
  try {
    const reports = loadAdminReports();
    const facultyReports = reports.filter(r => r.facultyId === req.user.id);
    res.json({ reports: facultyReports });
  } catch (error) {
    console.error('Error fetching admin reports:', error);
    res.status(500).json({ error: 'Failed to fetch admin reports' });
  }
});

module.exports = router;
