import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../_lib/prisma.js';
import { methodNotAllowed, requireEnv } from '../_lib/auth.js';
import { handleCors, sendJson } from '../_lib/http.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    requireEnv('DATABASE_URL');
    const JWT_SECRET = requireEnv('JWT_SECRET');
    const REFRESH_TOKEN_SECRET = requireEnv('REFRESH_TOKEN_SECRET');

    const body = await readJson(req);
    const { email, password } = body;

    if (!email || !emailRegex.test(String(email))) {
      return sendJson(res, 400, { message: 'Please provide a valid email address' });
    }

    if (!password || String(password).length < 6) {
      return sendJson(res, 400, { message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = String(email).toLowerCase();

    const userWithHash = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        rollNumber: true,
        fullName: true,
        email: true,
        role: true,
        department: true,
        passwordHash: true,
      },
    });

    if (!userWithHash) {
      return sendJson(res, 400, { message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(String(password), userWithHash.passwordHash);
    if (!isMatch) {
      return sendJson(res, 400, { message: 'Invalid email or password' });
    }

    await prisma.user.update({
      where: { id: userWithHash.id },
      data: { lastLogin: new Date() },
      select: { id: true },
    });

    const token = jwt.sign(
      {
        userId: userWithHash.id,
        email: userWithHash.email,
        rollNumber: userWithHash.rollNumber,
        role: userWithHash.role,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign({ userId: userWithHash.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    const { passwordHash, ...user } = userWithHash;

    return sendJson(res, 200, {
      message: 'Login successful',
      token,
      refreshToken,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return sendJson(res, 500, { message: 'Server error. Please try again later.' });
  }
}
