import { prisma } from '../_lib/prisma.js';
import { methodNotAllowed } from '../_lib/auth.js';
import { requireRole, requireUser } from '../_lib/authz.js';
import { handleCors, sendJson } from '../_lib/http.js';

function toIso(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function buildLatestByCategory(quizAttempts) {
  const latest = new Map();
  for (const attempt of quizAttempts || []) {
    const key = attempt.categoryId;
    const existing = latest.get(key);
    if (!existing) {
      latest.set(key, attempt);
      continue;
    }
    const a = new Date(attempt.createdAt || 0).getTime();
    const b = new Date(existing.createdAt || 0).getTime();
    if (a >= b) latest.set(key, attempt);
  }
  return latest;
}

export default async function handler(req, res) {
  if (handleCors(req, res, { methods: ['GET'] })) return;
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  try {
    const auth = await requireUser(req, res);
    if (!auth) return;
    if (!requireRole(res, auth.user, ['Faculty'])) return;

    const students = await prisma.user.findMany({
      where: { role: 'Student' },
      select: {
        id: true,
        rollNumber: true,
        fullName: true,
        email: true,
        department: true,
        course: true,
        semester: true,
        lastLogin: true,
        createdAt: true,
        quizAttempts: {
          select: {
            categoryId: true,
            score: true,
            total: true,
            percentage: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const studentsWithStats = students.map((student) => {
      const latestByCategory = buildLatestByCategory(student.quizAttempts);

      const subjectScores = {};
      let totalScore = 0;
      let totalQuestions = 0;

      for (const [categoryId, attempt] of latestByCategory.entries()) {
        subjectScores[categoryId] = {
          score: attempt.score,
          totalQuestions: attempt.total,
          percentage: attempt.percentage,
          completedAt: toIso(attempt.createdAt) || new Date().toISOString(),
        };
        totalScore += attempt.score;
        totalQuestions += attempt.total;
      }

      const totalQuizzes = latestByCategory.size;
      const overallPercentage = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
      const lastActive = toIso(student.lastLogin) || toIso(student.createdAt) || new Date().toISOString();

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
        lastActive,
      };
    });

    return sendJson(res, 200, { students: studentsWithStats });
  } catch (error) {
    console.error('Faculty students error:', error);
    return sendJson(res, 500, { error: 'Failed to fetch students' });
  }
}
