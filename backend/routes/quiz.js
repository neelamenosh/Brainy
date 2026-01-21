const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'brainy-secret-key-2024';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

router.post('/results', authMiddleware, async (req, res) => {
  try {
    const { categoryId, score, total } = req.body;
    const userId = req.user.userId;

    const percentage = Math.round((score / total) * 100);

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        categoryId,
        score,
        total,
        percentage
      }
    });

    res.status(201).json({ message: 'Quiz result saved successfully', attempt });
  } catch (error) {
    console.error('Save quiz result error:', error);
    res.status(500).json({ message: 'Failed to save quiz result' });
  }
});

router.get('/results', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ attempts });
  } catch (error) {
    console.error('List quiz results error:', error);
    res.status(500).json({ message: 'Failed to fetch quiz results' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.quizCategory.findMany({
      include: {
        _count: {
          select: { questions: true }
        }
      }
    });
    res.json(categories);
  } catch (error) {
    console.error('List categories error:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

module.exports = router;
