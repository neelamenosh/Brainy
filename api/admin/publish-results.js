import { prisma } from '../_lib/prisma.js';
import { methodNotAllowed } from '../_lib/auth.js';
import { requireRole, requireUser } from '../_lib/authz.js';
import { sendServerError } from '../_lib/errors.js';
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
    const auth = await requireUser(req, res);
    if (!auth) return;
    if (!requireRole(res, auth.user, ['Admin'])) return;

    const body = await readJson(req);
    const reportId = body?.reportId ? String(body.reportId) : '';
    if (!reportId) return sendJson(res, 400, { message: 'reportId is required' });

    const report = await prisma.facultyReport.update({
      where: { id: reportId },
      data: { status: 'published', publishedAt: new Date() },
      select: { id: true, status: true, publishedAt: true },
    });

    return sendJson(res, 200, { message: 'Results published successfully', report });
  } catch (error) {
    return sendServerError(res, 'Publish results error', error);
  }
}
