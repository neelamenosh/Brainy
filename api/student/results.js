import { prisma } from '../_lib/prisma.js';
import { methodNotAllowed } from '../_lib/auth.js';
import { requireRole, requireUser } from '../_lib/authz.js';
import { sendServerError } from '../_lib/errors.js';
import { handleCors, sendJson } from '../_lib/http.js';

function toIso(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function buildProgressFromAttempts(attempts) {
  const latest = new Map();
  for (const a of attempts || []) {
    const key = a.categoryId;
    const existing = latest.get(key);
    if (!existing) {
      latest.set(key, a);
      continue;
    }
    const t1 = new Date(a.createdAt || 0).getTime();
    const t2 = new Date(existing.createdAt || 0).getTime();
    if (t1 >= t2) latest.set(key, a);
  }

  const progress = {};
  for (const [categoryId, a] of latest.entries()) {
    progress[categoryId] = {
      completed: true,
      score: a.score,
      totalQuestions: a.total,
      completedAt: toIso(a.createdAt) || new Date().toISOString(),
    };
  }
  return progress;
}

export default async function handler(req, res) {
  if (handleCors(req, res, { methods: ['GET'] })) return;
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  try {
    const auth = await requireUser(req, res);
    if (!auth) return;
    if (!requireRole(res, auth.user, ['Student'])) return;

    const user = await prisma.user.findUnique({
      where: { id: auth.user.id },
      include: {
        quizAttempts: {
          select: {
            categoryId: true,
            score: true,
            total: true,
            createdAt: true,
            percentage: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return sendJson(res, 404, { message: 'User not found' });
    }

    // Fetch published faculty reports that include this student
    const publishedReports = await prisma.facultyReport.findMany({
      where: {
        status: 'published',
        studentIds: {
          has: auth.user.id,
        },
      },
      include: {
        faculty: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
    });

    // Transform reports to match StudentResult format
    const results = publishedReports.map((report) => ({
      reportId: report.id,
      facultyName: report.faculty?.fullName || 'Faculty',
      facultyEmail: report.faculty?.email || '',
      message: report.message || '',
      publishedAt: toIso(report.publishedAt) || new Date().toISOString(),
      studentData: {
        id: user.id,
        rollNumber: user.rollNumber,
        fullName: user.fullName,
        email: user.email,
        department: user.department,
        course: user.course,
        semester: user.semester,
        progress: buildProgressFromAttempts(user.quizAttempts),
        lastLogin: toIso(user.lastLogin),
      },
    }));

    return sendJson(res, 200, {
      results,
      student: {
        id: user.id,
        fullName: user.fullName,
        rollNumber: user.rollNumber,
        email: user.email,
        department: user.department,
        course: user.course,
        semester: user.semester,
      },
    });
  } catch (error) {
    return sendServerError(res, 'Student results error', error);
  }
}
