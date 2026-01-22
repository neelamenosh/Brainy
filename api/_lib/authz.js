import { prisma } from './prisma.js';
import { getBearerToken, unauthorized, verifyAccessToken } from './auth.js';
import { sendJson } from './http.js';

export async function requireUser(req, res) {
  const token = getBearerToken(req);
  if (!token) {
    unauthorized(res, 'No token provided');
    return null;
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch {
    unauthorized(res, 'Invalid token');
    return null;
  }

  const userId = decoded?.userId;
  if (!userId) {
    unauthorized(res, 'Invalid token');
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: String(userId) },
    select: {
      id: true,
      rollNumber: true,
      fullName: true,
      email: true,
      department: true,
      course: true,
      semester: true,
      role: true,
      lastLogin: true,
      createdAt: true,
    },
  });

  if (!user) {
    unauthorized(res, 'User not found');
    return null;
  }

  return { user, decoded };
}

export function requireRole(res, user, allowedRoles) {
  const role = user?.role || '';
  if (!allowedRoles.includes(role)) {
    sendJson(res, 403, { message: 'Access denied' });
    return false;
  }
  return true;
}
