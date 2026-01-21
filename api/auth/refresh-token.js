import jwt from 'jsonwebtoken';
import { prisma } from '../_lib/prisma.js';
import { methodNotAllowed, requireEnv } from '../_lib/auth.js';
import { handleCors, sendJson } from '../_lib/http.js';

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = '';
  for await (const chunk of req) raw += chunk;
  if (!raw) return {};
  return JSON.parse(raw);
}

export default async function handler(req, res) {
  if (handleCors(req, res, { methods: ['POST'] })) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const JWT_SECRET = requireEnv('JWT_SECRET');
    const REFRESH_TOKEN_SECRET = requireEnv('REFRESH_TOKEN_SECRET');

    const body = await readJson(req);
    const { refreshToken } = body;

    if (!refreshToken) {
      return sendJson(res, 401, { message: 'Refresh token required' });
    }

    const decoded = jwt.verify(String(refreshToken), REFRESH_TOKEN_SECRET);
    const userId = decoded?.userId;

    if (!userId) {
      return sendJson(res, 401, { message: 'Invalid refresh token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
      select: { id: true, email: true, rollNumber: true, role: true },
    });

    if (!user) {
      return sendJson(res, 404, { message: 'User not found' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, rollNumber: user.rollNumber, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return sendJson(res, 200, { token });
  } catch (error) {
    console.error('Refresh token error:', error);
    return sendJson(res, 401, { message: 'Invalid refresh token' });
  }
}
