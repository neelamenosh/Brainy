import { prisma } from '../_lib/prisma.js';
import { methodNotAllowed } from '../_lib/auth.js';
import { requireRole, requireUser } from '../_lib/authz.js';
import { handleCors, sendJson } from '../_lib/http.js';

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
          include: { category: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return sendJson(res, 404, { message: 'User not found' });
    }

    return sendJson(res, 200, {
      results: user.quizAttempts,
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
    console.error('Student results error:', error);
    return sendJson(res, 500, { message: 'Failed to fetch results' });
  }
}
