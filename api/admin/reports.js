import { prisma } from '../_lib/prisma.js';
import { methodNotAllowed } from '../_lib/auth.js';
import { requireRole, requireUser } from '../_lib/authz.js';
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
    if (!requireRole(res, auth.user, ['Admin'])) return;

    const reports = await prisma.facultyReport.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        faculty: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      take: 100,
    });

    const allStudentIds = Array.from(
      new Set(reports.flatMap((r) => (Array.isArray(r.studentIds) ? r.studentIds : [])))
    );

    const students = await prisma.user.findMany({
      where: { id: { in: allStudentIds }, role: 'Student' },
      select: {
        id: true,
        rollNumber: true,
        fullName: true,
        email: true,
        department: true,
        course: true,
        semester: true,
        lastLogin: true,
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

    const studentMap = new Map(students.map((s) => [s.id, s]));

    const payload = reports.map((r) => {
      const reportStudents = (r.studentIds || [])
        .map((id) => studentMap.get(id))
        .filter(Boolean)
        .map((s) => ({
          id: s.id,
          rollNumber: s.rollNumber,
          fullName: s.fullName,
          email: s.email,
          department: s.department,
          course: s.course,
          semester: s.semester,
          progress: buildProgressFromAttempts(s.quizAttempts),
          lastLogin: toIso(s.lastLogin),
        }));

      return {
        id: r.id,
        facultyId: r.facultyId,
        facultyName: r.faculty?.fullName || 'Faculty',
        facultyEmail: r.faculty?.email || '',
        reportType: r.reportType,
        message: r.message || '',
        students: reportStudents,
        createdAt: toIso(r.createdAt) || new Date().toISOString(),
        status: r.status,
        publishedAt: toIso(r.publishedAt),
      };
    });

    return sendJson(res, 200, payload);
  } catch (error) {
    console.error('Admin reports error:', error);
    return sendJson(res, 500, { message: 'Failed to fetch reports' });
  }
}
