const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'brainy-secret-key-2024';

const authenticateFaculty = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user || user.role !== 'Faculty') {
      return res.status(403).json({ error: 'Access denied. Faculty only.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/students', authenticateFaculty, async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'Student' },
      include: {
        quizAttempts: {
          include: {
            category: true
          }
        }
      }
    });
    
    const studentsWithStats = students.map(student => {
      let totalQuizzes = student.quizAttempts.length;
      let totalScore = student.quizAttempts.reduce((acc, curr) => acc + curr.score, 0);
      let totalQuestions = student.quizAttempts.reduce((acc, curr) => acc + curr.total, 0);
      
      let subjectScores = {};
      student.quizAttempts.forEach(attempt => {
        subjectScores[attempt.categoryId] = {
          score: attempt.score,
          totalQuestions: attempt.total,
          percentage: attempt.percentage,
          completedAt: attempt.createdAt
        };
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
    
    res.json({ students: studentsWithStats });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

router.get('/students/:studentId', authenticateFaculty, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const student = await prisma.user.findUnique({
      where: { id: studentId },
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

    if (!student || student.role !== 'Student') {
      return res.status(404).json({ error: 'Student not found' });
    }
    
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
      progress: student.quizAttempts
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ error: 'Failed to fetch student details' });
  }
});

router.post('/send-to-admin', authenticateFaculty, async (req, res) => {
  try {
    // Note: Reports are currently not in Prisma schema, so we'll still use JSON for now 
    // or we could add a Report model. For now let's stick to the request and use JSON for reports
    // if it's required, but usually everything should be in the DB.
    // However, I'll keep the report logic for now.
    const fs = require('fs');
    const path = require('path');
    const ADMIN_REPORTS_FILE = path.join(__dirname, '..', 'data', 'admin_reports.json');

    const { studentIds, message, reportType } = req.body;
    
    const students = await prisma.user.findMany({
      where: { id: { in: studentIds } },
      include: {
        quizAttempts: true
      }
    });
    
    let reports = [];
    try {
      if (fs.existsSync(ADMIN_REPORTS_FILE)) {
        reports = JSON.parse(fs.readFileSync(ADMIN_REPORTS_FILE, 'utf8'));
      }
    } catch (e) {}
    
    const report = {
      id: Date.now().toString(),
      facultyId: req.user.id,
      facultyName: req.user.fullName,
      facultyEmail: req.user.email,
      reportType: reportType || 'progress_report',
      message: message || '',
      students: students,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    reports.push(report);
    fs.writeFileSync(ADMIN_REPORTS_FILE, JSON.stringify(reports, null, 2));
    
    res.json({ success: true, message: 'Report sent to admin successfully', reportId: report.id });
  } catch (error) {
    console.error('Error sending report to admin:', error);
    res.status(500).json({ error: 'Failed to send report to admin' });
  }
});

module.exports = router;


module.exports = router;
