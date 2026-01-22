import { prisma } from '../_lib/prisma.js';
import { methodNotAllowed } from '../_lib/auth.js';
import { requireRole, requireUser } from '../_lib/authz.js';
import { sendServerError } from '../_lib/errors.js';
import { handleCors, sendJson } from '../_lib/http.js';

export default async function handler(req, res) {
  if (handleCors(req, res, { methods: ['GET'] })) return;
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  try {
    const auth = await requireUser(req, res);
    if (!auth) return;
    if (!requireRole(res, auth.user, ['Admin'])) return;

    const [totalStudents, totalFaculty, totalQuizzesTaken, pendingReports, publishedReports] = await Promise.all([
      prisma.user.count({ where: { role: 'Student' } }),
      prisma.user.count({ where: { role: 'Faculty' } }),
      prisma.quizAttempt.count(),
      prisma.facultyReport.count({ where: { status: 'pending' } }),
      prisma.facultyReport.count({ where: { status: 'published' } }),
    ]);

    return sendJson(res, 200, {
      totalStudents,
      totalFaculty,
      totalQuizzesTaken,
      pendingReports,
      publishedReports,
      systemUpdates: [
        { id: 1, type: 'System', message: 'Admin dashboard online (DB-backed)', time: 'Just now' },
        { id: 2, type: 'Faculty', message: 'Faculty reports are stored in the database', time: '10 mins ago' },
        { id: 3, type: 'System', message: 'Quiz attempts now visible to Faculty/Admin', time: '1 hour ago' },
      ],
    });
  } catch (error) {
    return sendServerError(res, 'Admin stats error', error);
  }
}
