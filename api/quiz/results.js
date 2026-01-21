import { prisma } from '../_lib/prisma.js';
import { getBearerToken, methodNotAllowed, unauthorized, verifyAccessToken } from '../_lib/auth.js';
import { sendJson } from '../_lib/http.js';

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = '';
  for await (const chunk of req) raw += chunk;
  if (!raw) return {};
  return JSON.parse(raw);
}

function badRequest(res, message) {
  sendJson(res, 400, { message });
}

export default async function handler(req, res) {
  const token = getBearerToken(req);
  if (!token) return unauthorized(res, 'No token provided');

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch {
    return unauthorized(res, 'Invalid token');
  }

  const userId = decoded?.userId;
  if (!userId) return unauthorized(res, 'Invalid token');

  if (req.method === 'GET') {
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: String(userId) },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        category: {
          select: { id: true, name: true, courseId: true, courseName: true },
        },
      },
    });

    return sendJson(res, 200, { attempts });
  }

  if (req.method === 'POST') {
    const body = await readJson(req);
    const { categoryId, categoryName, courseId, courseName, score, total } = body;

    if (!categoryId || !String(categoryId).trim()) {
      return badRequest(res, 'categoryId is required');
    }

    if (!categoryName || !String(categoryName).trim()) {
      return badRequest(res, 'categoryName is required');
    }

    const scoreNum = Number(score);
    const totalNum = Number(total);

    if (!Number.isFinite(scoreNum) || scoreNum < 0) {
      return badRequest(res, 'score must be a non-negative number');
    }

    if (!Number.isFinite(totalNum) || totalNum <= 0) {
      return badRequest(res, 'total must be a positive number');
    }

    const percentage = Math.round((scoreNum / totalNum) * 100);

    await prisma.quizCategory.upsert({
      where: { id: String(categoryId) },
      update: {
        name: String(categoryName),
        courseId: courseId ? String(courseId) : null,
        courseName: courseName ? String(courseName) : null,
      },
      create: {
        id: String(categoryId),
        name: String(categoryName),
        courseId: courseId ? String(courseId) : null,
        courseName: courseName ? String(courseName) : null,
      },
      select: { id: true },
    });

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: String(userId),
        categoryId: String(categoryId),
        score: scoreNum,
        total: totalNum,
        percentage,
      },
      include: {
        category: {
          select: { id: true, name: true, courseId: true, courseName: true },
        },
      },
    });

    return sendJson(res, 201, { attempt });
  }

  return methodNotAllowed(res, ['GET', 'POST']);
}
