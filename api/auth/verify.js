import { prisma } from '../_lib/prisma.js';
import { getBearerToken, methodNotAllowed, unauthorized, verifyAccessToken } from '../_lib/auth.js';
import { handleCors, sendJson } from '../_lib/http.js';

export default async function handler(req, res) {
  if (handleCors(req, res, { methods: ['GET'] })) return;
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  try {
    const token = getBearerToken(req);
    if (!token) return unauthorized(res, 'No token provided');

    const decoded = verifyAccessToken(token);
    const userId = decoded?.userId;
    if (!userId) return unauthorized(res, 'Invalid token');

    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
      select: {
        id: true,
        rollNumber: true,
        fullName: true,
        email: true,
        role: true,
        department: true,
      },
    });

    if (!user) {
      return sendJson(res, 404, { message: 'User not found' });
    }

    return sendJson(res, 200, { user });
  } catch (error) {
    console.error('Verify error:', error);
    return unauthorized(res, 'Invalid token');
  }
}
