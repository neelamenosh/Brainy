import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../_lib/prisma.js';
import { methodNotAllowed, requireEnv } from '../_lib/auth.js';
import { sendJson, handleCors } from '../_lib/http.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = '';
  for await (const chunk of req) raw += chunk;
  if (!raw) return {};
  return JSON.parse(raw);
}

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    requireEnv('DATABASE_URL');
    const JWT_SECRET = requireEnv('JWT_SECRET');
    const REFRESH_TOKEN_SECRET = requireEnv('REFRESH_TOKEN_SECRET');

    const body = await readJson(req);
    const { rollNumber, fullName, email, phone, password, department, course, semester } = body;

    if (!rollNumber || !String(rollNumber).trim()) {
      return sendJson(res, 400, { message: 'Roll number is required' });
    }

    if (!fullName || String(fullName).trim().length < 2) {
      return sendJson(res, 400, { message: 'Full name must be at least 2 characters' });
    }

    if (!email || !emailRegex.test(String(email))) {
      return sendJson(res, 400, { message: 'Please provide a valid email address' });
    }

    if (!phone || String(phone).replace(/\D/g, '').length < 10) {
      return sendJson(res, 400, { message: 'Phone must be at least 10 digits' });
    }

    if (!password || String(password).length < 6) {
      return sendJson(res, 400, { message: 'Password must be at least 6 characters' });
    }

    if (!department) {
      return sendJson(res, 400, { message: 'Department is required' });
    }

    const normalizedEmail = String(email).toLowerCase();
    const normalizedRoll = String(rollNumber).trim();

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { rollNumber: normalizedRoll }],
      },
      select: { id: true },
    });

    if (existing) {
      return sendJson(res, 400, { message: 'User with this email or roll number already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(String(password), salt);

    const user = await prisma.user.create({
      data: {
        rollNumber: normalizedRoll,
        fullName: String(fullName).trim(),
        email: normalizedEmail,
        phone: String(phone),
        passwordHash,
        department: String(department),
        course: course ? String(course) : null,
        semester: typeof semester === 'number' ? semester : semester ? Number(semester) : null,
        role: 'Student',
        lastLogin: new Date(),
      },
      select: {
        id: true,
        rollNumber: true,
        fullName: true,
        email: true,
        role: true,
        department: true,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, rollNumber: user.rollNumber, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    return sendJson(res, 201, {
      message: 'Registration successful',
      token,
      refreshToken,
      user,
    });
  } catch (error) {
    console.error('Register error:', error);
    return sendJson(res, 500, { message: 'Server error. Please try again later.' });
  }
}
