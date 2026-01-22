import { prisma } from '../_lib/prisma.js';
import { methodNotAllowed } from '../_lib/auth.js';
import { requireRole, requireUser } from '../_lib/authz.js';
import { handleCors, sendJson } from '../_lib/http.js';

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = '';
  for await (const chunk of req) raw += chunk;
  if (!raw) return {};
  return JSON.parse(raw);
}

function badRequest(res, message) {
  return sendJson(res, 400, { error: message });
}

export default async function handler(req, res) {
  if (handleCors(req, res, { methods: ['POST'] })) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const auth = await requireUser(req, res);
    if (!auth) return;
    if (!requireRole(res, auth.user, ['Faculty'])) return;

    const body = await readJson(req);
    const studentIds = Array.isArray(body?.studentIds) ? body.studentIds.map(String) : [];
    const message = body?.message ? String(body.message) : '';
    const reportType = body?.reportType ? String(body.reportType) : 'progress_report';

    if (studentIds.length === 0) return badRequest(res, 'studentIds is required');

    const report = await prisma.facultyReport.create({
      data: {
        facultyId: auth.user.id,
        reportType,
        message,
        status: 'pending',
        studentIds,
      },
      select: { id: true },
    });

    return sendJson(res, 200, {
      success: true,
      message: 'Report sent to admin successfully',
      reportId: report.id,
    });
  } catch (error) {
    console.error('Send to admin error:', error);
    return sendJson(res, 500, { error: 'Failed to send report to admin' });
  }
}
